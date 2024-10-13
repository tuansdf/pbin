const DEFAULT_MAX_RETRIES = 100;

export const handleRetry = async <T>({
  resultFn,
  shouldRetryFn,
  maxRetries = DEFAULT_MAX_RETRIES,
}: {
  resultFn: () => T | Promise<T>;
  shouldRetryFn: (text: T) => Promise<boolean>; // true: collision, false: no collision
  maxRetries?: number;
}): Promise<T> => {
  let retryCount = 0;
  let result: T | null = null;
  while (!result) {
    if (retryCount > maxRetries) {
      throw new Error("Cannot generate ID");
    }
    let temp: T | null = null;
    try {
      temp = await resultFn();
      const isRetry = await shouldRetryFn(temp);
      if (!isRetry) {
        result = temp;
      } else {
        console.error("Collision: " + temp);
      }
    } catch (e) {
      console.error("Collision: " + temp);
    }
    retryCount++;
  }
  return result;
};
