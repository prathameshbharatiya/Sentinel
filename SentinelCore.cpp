
#include "SentinelCore.hpp"
#include <chrono>
#include <algorithm>

namespace sentinel {

SentinelCore::SentinelCore(int dof) 
    : dof_(dof), 
      mode_(RuntimeMode::NORMAL),
      lambda_forget_(0.98),
      last_execution_time_ms_(0.0) 
{
    // Initialize Recursive Least Squares components
    theta_est_.setConstant(1.0); // Initial parameters (e.g. Mass)
    P_cov_.setIdentity();
    P_cov_ *= 1000.0;            // Initial high uncertainty for fast convergence

    nominal_params_.mass.setConstant(1.0);
    nominal_params_.friction.setConstant(0.1);

    history_.reserve(HISTORY_SIZE);
}

void SentinelCore::step(const RobotState& state) {
    auto start = std::chrono::high_resolution_clock::now();

    // Layer 1: Deterministic Data Ingestion (Circular Buffer)
    if (history_.size() >= HISTORY_SIZE) {
        history_.erase(history_.begin());
    }
    history_.push_back(state);

    // Layer 3: Multi-DOF Recursive Least Squares Estimation
    // Updates are gated by the current runtime safety mode.
    if (mode_ != RuntimeMode::SAFE_FALLBACK && mode_ != RuntimeMode::INTERNAL_FAULT) {
        runRLS(state);
    }

    // Layer 6 & 7: Runtime Safety & Mode Machine
    evaluateSafety(state);
    updateMode();

    auto end = std::chrono::high_resolution_clock::now();
    last_execution_time_ms_ = std::chrono::duration<double, std::milli>(end - start).count();
}

void SentinelCore::runRLS(const RobotState& state) {
    // Vectorized RLS Implementation: y = phi^T * theta
    // Simplified dynamics for 6-DOF system: acceleration = (1/mass) * control_input
    Vector6d phi = state.control_input;
    Vector6d y = state.acceleration;

    // Compute residual error (innovation)
    Vector6d epsilon = y - (phi.array() / theta_est_.array()).matrix();

    // RLS Gain Update per DOF (Decoupled approximation for performance)
    for (int i = 0; i < dof_; ++i) {
        if (std::abs(phi(i)) > 0.1) {
            double k = P_cov_(i, i) * phi(i) / (lambda_forget_ + phi(i) * P_cov_(i, i) * phi(i));
            theta_est_(i) += k * epsilon(i);
            P_cov_(i, i) = (P_cov_(i, i) - k * phi(i) * P_cov_(i, i)) / lambda_forget_;
        }
    }

    // Hard Projection: Constrain parameters to safe physical bounds
    theta_est_ = theta_est_.cwiseMax(0.1).cwiseMin(10.0);
}

void SentinelCore::evaluateSafety(const RobotState& state) {
    // WCET (Worst-Case Execution Time) Monitoring
    if (last_execution_time_ms_ > THRESHOLD_WCET) {
        mode_ = RuntimeMode::DEGRADED;
    }

    // Covariance Stability Check (Detects ill-conditioned RLS)
    if (P_cov_.trace() > 5000.0) {
        mode_ = RuntimeMode::SAFE_FALLBACK;
    }
}

void SentinelCore::updateMode() {
    // Internal state machine transition logic
    // (In production, this would handle recovery from Degraded modes)
}

RobotHealth SentinelCore::getHealth() const {
    double drift = (theta_est_ - nominal_params_.mass).norm();
    double risk = std::min(1.0, drift * 0.5 + (mode_ != RuntimeMode::NORMAL ? 0.3 : 0.0));

    PhysicalParams est;
    est.mass = theta_est_;
    est.covariance_trace = P_cov_.trace();

    return {
        1.0 - std::min(1.0, P_cov_.trace() / 5000.0), // Confidence
        drift,                                        // Drift score
        risk,                                         // Risk score
        mode_,                                        // Current Mode
        last_execution_time_ms_,                      // Latency
        est,                                          // Param Estimates
        drift > 1.0 ? std::vector<FailureType>{FailureType::DRIFT} : std::vector<FailureType>{}
    };
}

HealthAdvisory SentinelCore::getAdvisory() const {
    auto h = getHealth();
    double scale = 1.0;
    
    // Layer 9: Advisory Contract - Signal velocity envelope scaling based on risk
    if (h.mode == RuntimeMode::SAFE_FALLBACK) {
        scale = 0.1;
    } else if (h.risk_score > 0.6) {
        scale = 0.5;
    }

    RiskLevel level = RiskLevel::NOMINAL;
    if (h.risk_score > 0.7) level = RiskLevel::CRITICAL;
    else if (h.risk_score > 0.4) level = RiskLevel::HIGH_RISK;

    return {
        scale,
        level,
        h.mode,
        h.risk_score > 0.5
    };
}

} // namespace sentinel
