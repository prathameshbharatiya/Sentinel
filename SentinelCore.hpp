#pragma once

#include <Eigen/Dense>
#include <vector>
#include <string>

namespace sentinel {

enum class RuntimeMode { NORMAL, DEGRADED, SAFE_FALLBACK, INTERNAL_FAULT };
enum class RiskLevel { NOMINAL, HIGH_RISK, CRITICAL };
enum class HazardLevel { NONE, H1_DRIFT, H2_STABILITY, H3_AUTHORITY, H4_CATASTROPHIC };

struct LyapunovMatrix {
    Eigen::Matrix2d P;
    Eigen::Matrix2d Q;
    bool is_positive_definite;
};

struct RobotHealth {
    double confidence;
    double drift_score;
    double risk_score;
    double redundancy_error;
    HazardLevel hazard;
    RuntimeMode mode;
    double last_wcet_ms;
    LyapunovMatrix lyapunov;
    std::string integrity_hash;
};

struct HealthAdvisory {
    double velocity_scale;
    RiskLevel risk;
    RuntimeMode mode;
    bool anomaly_detected;
};

class SentinelCore {
public:
    explicit SentinelCore(int dof = 1);
    
    // Core Execution Step (1kHz target)
    void step(const Eigen::VectorXd& pos, 
              const Eigen::VectorXd& vel, 
              const Eigen::VectorXd& control_input);

    RobotHealth getHealth() const;
    HealthAdvisory getAdvisory() const;

private:
    int dof_;
    RuntimeMode mode_;
    double lambda_forget_;
    double last_wcet_ms_;
    double redundancy_error_sum_;

    // Recursive Least Squares (RLS) Parameter ID
    Eigen::VectorXd theta_est_;
    Eigen::MatrixXd P_cov_;

    // Lyapunov Stability Monitoring
    Eigen::Matrix2d P_lyap_;
    Eigen::Matrix2d Q_lyap_;

    void runRLS(const Eigen::VectorXd& vel, const Eigen::VectorXd& cmd);
    void updateLyapunov(const Eigen::VectorXd& pos, const Eigen::VectorXd& vel);
    void checkRedundancy(const Eigen::VectorXd& vel, const Eigen::VectorXd& cmd);
    void evaluateSafety();
};

} // namespace sentinel