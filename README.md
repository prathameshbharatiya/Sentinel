# Sentinel MVK - Proactive Safety Kernel

The Sentinel Minimum Viable Kernel (MVK) provides the core safety governance for the Sentinel system. 
Version 6.0 introduces a **Proactive Safety Pipeline** that anticipates limit breaches before they occur.

## Architecture

The MVK now operates as a multi-stage proactive pipeline:

1.  **Preprocessing (`sentinel_preprocess.py`)**: Normalizes input commands and performs state estimation. It predicts the robot's state 500ms into the future.
2.  **Lyapunov Kernel (`sentinel_lyapunov.py`)**: Uncertainty-Aware Lyapunov Stability Kernel (L4). Projects commands onto the stability boundary $dV/dt \le -\alpha V$ instead of simple clamping.
3.  **Safety Evaluation (`sentinel_mvk.py`)**: The core Governor logic that applies deterministic clamping and safety rules.
4.  **Postprocessing (`sentinel_postprocess.py`)**: Smooths the governed commands to reduce jerk and applies active corrections.
5.  **Fault Observer (`sentinel_fault_observer.py`)**: L5 Hardware Fault Observer. Detects bearing wear, unexpected payloads, and sensor drift using RLS parameter trends.

## Proactive Features

-   **Lyapunov Stability**: Mathematically verified stability checking for all commands.
-   **Hardware Fault Detection**: Detects failure modes from real-time parameter drift.
-   **Trajectory Prediction**: Anticipates joint limit breaches 500ms in advance.
-   **Active Correction**: Automatically dampens commands when approaching safety boundaries.
-   **Jerk Reduction**: Rate-limits acceleration to protect mechanical components.
-   **Tamper-Evident Logging**: Every command (raw, safe, and corrected) is hashed into a SHA-256 chain for forensic auditing.

## Deployment

Use the provided launch script to verify the integrity of the safety modules:

```bash
chmod +x sentinel_launch.sh
./sentinel_launch.sh
```
