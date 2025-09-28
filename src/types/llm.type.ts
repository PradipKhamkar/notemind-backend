export interface IRetryConfig  {
  jsonRetries: number;          // max JSON parse retries
  apiRetryDelays: number[];     // retry delays (ms) for API errors
  fallbackModel: string
};

