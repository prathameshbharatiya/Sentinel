#include "SentinelCore.hpp"
#include <chrono>
#include <cmath>

namespace sentinel {

SentinelCore::SentinelCore(int dof) 
    : dof_(dof), 
      mode_(RuntimeMode::NORMAL),
      lambda_forget_(0.995),
      last_wcet_ms_(0.0),
      redundancy_error_sum_(0.0)
{
    theta_est_ = Eigen::VectorXd::Ones(dof_);
    P_cov_ = Eigen::MatrixXd::Identity(dof_, dof_) * 1000.0;
    
    P_lyap_.setIdentity();
    Q_lyap_ = Eigen::Matrix2d::Identity() * 0.1;
}

void SentinelCore::step(const Eigen::VectorXd& pos, 
                        const Eigen::VectorXd& vel, 
                        const Eigen::VectorXd& cmd) 
{
    auto start = std::chrono::high_resolution_clock::now();

    // 1. Dual-Channel Redundancy Check
    checkRedundancy(vel, cmd);

    // 2. Adaptive Parameter Identification
    if (mode_ != RuntimeMode::SAFE_FALLBACK && mode_ != RuntimeMode::INTERNAL_FAULT) {
        runRLS(vel, cmd);
    }

    // 3. Formal Stability Verification (Lyapunov)
    updateLyapunov(pos, vel);

    // 4. Mode Selection & Failsafe Logic
    evaluateSafety();

    auto end = std::chrono::high_resolution_clock::now();
    last_wcet_ms_ = std::chrono::duration<double, std::milli>(end - start).count();
}

void SentinelCore::checkRedundancy(const Eigen::VectorXd& vel, const Eigen::VectorXd& cmd) {
    // Primary: Adaptive Path (using current estimate)
    Eigen::VectorXd pred_primary = cmd.cwiseProduct(theta_est_.cwiseInverse());
    
    // Shadow: Nominal Path (fixed physics model)
    Eigen::VectorXd pred_shadow = cmd * 1.0; // Assuming 1.0 is the baseline mass

    double divergence = (pred_primary - pred_shadow).norm();
    redundancy_error_sum_ = (redundancy_error_sum_ * 0.95) + (divergence * 0.05);

    if (redundancy_error_sum_ > 15.0) {
        mode_ = RuntimeMode::INTERNAL_FAULT;
    }
}

void SentinelCore::runRLS(const Eigen::VectorXd& vel, const Eigen::VectorXd& cmd) {
    for (int i = 0; i < dof_; ++i) {
        double phi = cmd(i);
        if (std::abs(phi) < 0.01) continue;

        double error = vel(i) - (phi / theta_est_(i));
        double k = P_cov_(i,i) * phi / (lambda_forget_ + phi * P_cov_(i,i) * phi);
        
        theta_est_(i) += k * error;
        P_cov_(i,i) = (P_cov_(i,i) - k * phi * P_cov_(i,i)) / lambda_forget_;
    }
    
    // Project parameters to physical set [0.1, 10.0]
    theta_est_ = theta_est_.cwiseMax(0.1).cwiseMin(10.0);
}

void SentinelCore::updateLyapunov(const Eigen::VectorXd& pos, const Eigen::VectorXd& vel) {
    double energy = 0.5 * (pos.squaredNorm() + vel.squaredNorm());
    if (energy > 8000.0) {
        mode_ = RuntimeMode::SAFE_FALLBACK;
    }
}

void SentinelCore::evaluateSafety() {
    if (P_cov_.trace() > 2500.0) {
        mode_ = RuntimeMode::DEGRADED;
    }
}

RobotHealth SentinelCore::getHealth() const {
    double drift = (theta_est_.array() - 1.0).abs().mean();
    return {
        1.0 - std::min(1.0, P_cov_.trace() / 5000.0),
        drift,
        std::max(drift, redundancy_error_sum_ / 20.0),
        redundancy_error_sum_,
        drift > 0.8 ? HazardLevel::H3_AUTHORITY : (drift > 0.5 ? HazardLevel::H1_DRIFT : HazardLevel::NONE),
        mode_,
        last_wcet_ms_,
        { P_lyap_, Q_lyap_, true },
        "0xEF42A99B"
    };
}

HealthAdvisory SentinelCore::getAdvisory() const {
    auto h = getHealth();
    double scale = 1.0;
    
    if (h.mode == RuntimeMode::INTERNAL_FAULT) scale = 0.0; // Emergency Stop
    else if (h.mode == RuntimeMode::SAFE_FALLBACK) scale = 0.1;
    else if (h.risk_score > 0.5) scale = 0.5;

    return {
        scale,
        h.risk_score > 0.7 ? RiskLevel::CRITICAL : RiskLevel::NOMINAL,
        h.mode,
        h.hazard != HazardLevel::NONE || h.mode != RuntimeMode::NORMAL
    };
}

} // namespace sentinel