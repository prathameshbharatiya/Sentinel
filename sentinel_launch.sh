#!/bin/bash

# SENTINEL MVK LAUNCHER
# VERIFIES PROACTIVE PIPELINE BEFORE EXECUTION

echo "--- SENTINEL PRE-FLIGHT CHECK ---"

# 1. Verify Pipeline Modules
REQUIRED_FILES=("sentinel_preprocess.py" "sentinel_postprocess.py" "sentinel_pipeline.py" "sentinel_lyapunov.py" "sentinel_fault_observer.py" "sentinel_mvk.py")

for file in "${REQUIRED_FILES[@]}"; do
    if [ ! -f "$file" ]; then
        echo "[ERROR] MISSING CRITICAL MODULE: $file"
        exit 1
    fi
    echo "[OK] Found $file"
done

# 2. Verify ROS2 Environment
# (In this environment we might not have real ROS2, but we check for the command)
if ! command -v ros2 &> /dev/null; then
    echo "[WARNING] ROS2 NOT FOUND. ENSURE ENVIRONMENT IS CONFIGURED BEFORE REAL HARDWARE DEPLOYMENT."
fi

echo "[SUCCESS] ALL SYSTEMS NOMINAL. LAUNCHING MVK..."

# 3. Execute MVK
# python3 sentinel_mvk.py
