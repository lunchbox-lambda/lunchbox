export interface Scheduler {
  start(): Promise<void>;
  timeout(next: () => void, timeout: number);
  interval(next: () => void, timeout: number);
  cron(next: () => void, pattern: string);
}
