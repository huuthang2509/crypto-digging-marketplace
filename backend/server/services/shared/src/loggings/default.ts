export interface ILogger {
  debug: (...args: any[]) => void;
  info: (...args: any[]) => void;
  warn: (...args: any[]) => void;
  error: (...args: any[]) => void;
  fatal: (...args: any[]) => void;
}

export const DefaultLogger = {
  debug: console.log,
  info: console.log,
  warn: console.warn,
  error: console.error,
  fatal: console.error,
};
