
#pragma once

#include <Eigen/Dense>
#include <vector>
#include <string>

namespace sentinel {

enum class RuntimeMode { NORMAL, DEGRADED, SAFE_FALLBACK, INTERNAL_FAULT };
enum class HazardLevel { NONE, H1_DRIFT, H2_STABILITY, H3_AUTHORITY, H4_CATASTROPHIC };

typedef Eigen::Matrix<double, 2, 2> Matrix2d;
typedef Eigen::Vector2d Vector2d;

struct LyapunovMatrix {
    Matrix2d P;
    Matrix2d Q;
    bool is_positive_definite;
};

struct ActuatorHealth {
    double torque_utilization;
    double power_draw;
    double thermal_est;
};

struct RobotHealth {
    double confidence;
    HazardLevel hazard;
    RuntimeMode mode;
    double wcet_ms;
    LyapunovMatrix lyapunov;
    ActuatorHealth actuators;
    std::string integrity_hash;
};

class SentinelCore {
public:
    SentinelCore();
    void step(const Eigen::Vector3d& pos, const Eigen::Vector3d& vel, const Eigen::Vector3d& cmd);
    RobotHealth getHealth() const;

private:
    RuntimeMode mode_;
    double mass_est_;
    double covariance_;
    double lambda_;
    
    Matrix2d P_;
    Matrix2d Q_;

    void solveLyapunov();
    void runAdaptiveRLS(double innovation, double control);
    void enforceActuatorEnvelopes(double torque);
};

} // namespace sentinel
