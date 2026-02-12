cmake_minimum_required(VERSION 3.10)
project(sentinel_core)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Find Dependencies
find_package(Eigen3 REQUIRED)
# find_package(onnxruntime REQUIRED) # Optional for Layer 4

include_directories(${EIGEN3_INCLUDE_DIRS} .)

add_library(sentinel_core
    SentinelCore.cpp
    PhysicsObserver.cpp
    SysIDEngine.cpp
)

add_executable(sentinel_benchmark benchmark.cpp)
target_link_libraries(sentinel_benchmark sentinel_core)

# ROS2 Integration (Conceptual)
# find_package(rclcpp REQUIRED)
# add_executable(sentinel_node src/ros2_node.cpp)
# target_link_libraries(sentinel_node sentinel_core rclcpp::rclcpp)
