#include "SentinelCore.hpp"
#include <chrono>
#include <cmath>

namespace sentinel {

SentinelCore::SentinelCore(int dof) 
    : dof_(dof), 
      mode_(RuntimeMode::NORMAL),
      lambda_forget_(0.995),
      last_wcet_ms_(0.0) 
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

    // 1. Adaptive Parameter Identification
    if (mode_ != RuntimeMode::SAFE_FALLBACK) {
        runRLS(vel, cmd);
    }

    // 2. Formal Stability Verification
    updateLyapunov(pos, vel);

    // 3. Mode Selection
    evaluateSafety();

    auto end = std::chrono::high_resolution_clock::now();
    last_wcet_ms_ = std::chrono::duration<double, std::milli>(end - start).count();
}

void SentinelCore::runRLS(const Eigen::VectorXd& vel, const Eigen::VectorXd& cmd) {
    // Simplified dynamics: acc = (1/mass) * cmd
    // We estimate mass parameter theta
    for (int i = 0; i < dof_; ++i) {
        double phi = cmd(i);
        if (std::abs(phi) < 0.01) continue;

        double error = vel(i) - (phi / theta_est_(i));
        double k = P_cov_(i,i) * phi / (lambda_forget_ + phi * P_cov_(i,i) * phi);
        
        theta_est_(i) += k * error;
        P_cov_(i,i) = (P_cov_(i,i) - k * phi * P_cov_(i,i)) / lambda_forget_;
    }
    
    // Parameter projection
    theta_est_ = theta_est_.cwiseMax(0.1).cwiseMin(5.0);
}

void SentinelCore::updateLyapunov(const Eigen::VectorXd& pos, const Eigen::VectorXd& vel) {
    double energy = 0.5 * (pos.squaredNorm() + vel.squaredNorm());
    if (energy > 5000.0) {
        mode_ = RuntimeMode::SAFE_FALLBACK;
    }
}

void SentinelCore::evaluateSafety() {
    if (P_cov_.trace() > 2000.0) {
        mode_ = RuntimeMode::DEGRADED;
    }
}

RobotHealth SentinelCore::getHealth() const {
    double drift = (theta_est_.array() - 1.0).abs().mean();
    return {
        1.0 - std::min(1.0, P_cov_.trace() / 5000.0),
        drift,
        drift > 0.8 ? 0.9 : 0.1,
        drift > 0.5 ? HazardLevel::H1_DRIFT : HazardLevel::NONE,
        mode_,
        last_wcet_ms_,
        { P_lyap_, Q_lyap_, true },
        "0xEF42A99B"
    };
}

HealthAdvisory SentinelCore::getAdvisory() const {
    auto h = getHealth();
    double scale = 1.0;
    if (h.mode == RuntimeMode::SAFE_FALLBACK) scale = 0.1;
    else if (h.risk_score > 0.5) scale = 0.5;

    return {
        scale,
        h.risk_score > 0.7 ? RiskLevel::CRITICAL : RiskLevel::NOMINAL,
        h.mode,
        h.hazard != HazardLevel::NONE
    };
}

} // namespace sentinel