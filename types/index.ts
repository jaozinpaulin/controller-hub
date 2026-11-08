export interface SystemMetrics {
    cpuUsage: number;
    cpuTemp: number;
    gpuUsage: number;
    gpuTemp: number;
    ramUsage: number;
    fanSpeedRpm: number;
}

export interface LedConfig {
    mode: 'static' | 'breathing' | 'rainbow' | 'temperature-sync';
    color: string;
    brightness: number;
}