import { PlatformDescriptor, PlatformType } from '../types';

export class HardwareAbstractionLayer {
  private static readonly PLATFORMS: Record<PlatformType, PlatformDescriptor> = {
    [PlatformType.ARM_CORTEX_M7]: {
      type: PlatformType.ARM_CORTEX_M7,
      actuatorWriteLatencyUs: 2.5,
      sensorReadLatencyUs: 1.8,
      interruptPriority: 1,
      clockSource: 'INTERNAL',
      innerLoopTimingBudgetUs: 15.0,
      floatingPointLatencyCycles: 1
    },
    [PlatformType.X86_SIMULATION]: {
      type: PlatformType.X86_SIMULATION,
      actuatorWriteLatencyUs: 120.0,
      sensorReadLatencyUs: 85.0,
      interruptPriority: 0,
      clockSource: 'INTERNAL',
      innerLoopTimingBudgetUs: 50.0,
      floatingPointLatencyCycles: 4
    },
    [PlatformType.FPGA_ACCELERATED]: {
      type: PlatformType.FPGA_ACCELERATED,
      actuatorWriteLatencyUs: 0.1,
      sensorReadLatencyUs: 0.05,
      interruptPriority: 7,
      clockSource: 'EXTERNAL_PTP',
      innerLoopTimingBudgetUs: 5.0,
      floatingPointLatencyCycles: 0 // Pipelined
    },
    [PlatformType.RAD_HARD_PROCESSOR]: {
      type: PlatformType.RAD_HARD_PROCESSOR,
      actuatorWriteLatencyUs: 8.5,
      sensorReadLatencyUs: 6.2,
      interruptPriority: 2,
      clockSource: 'ATOMIC_REF',
      innerLoopTimingBudgetUs: 25.0,
      floatingPointLatencyCycles: 12 // Triple-modular redundancy overhead
    }
  };

  private currentPlatform: PlatformDescriptor;

  constructor(initialPlatform: PlatformType = PlatformType.X86_SIMULATION) {
    this.currentPlatform = HardwareAbstractionLayer.PLATFORMS[initialPlatform];
  }

  public setPlatform(type: PlatformType) {
    this.currentPlatform = HardwareAbstractionLayer.PLATFORMS[type];
  }

  public getPlatformDescriptor(): PlatformDescriptor {
    return { ...this.currentPlatform };
  }

  /**
   * Simulates hardware-level write with latency
   */
  public async writeActuator(values: number[]): Promise<void> {
    const latency = this.currentPlatform.actuatorWriteLatencyUs / 1000; // to ms
    return new Promise(resolve => setTimeout(resolve, latency));
  }

  /**
   * Simulates hardware-level read with latency
   */
  public async readSensors(): Promise<void> {
    const latency = this.currentPlatform.sensorReadLatencyUs / 1000; // to ms
    return new Promise(resolve => setTimeout(resolve, latency));
  }
}
