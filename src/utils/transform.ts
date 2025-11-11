// Utility functions to transform between snake_case (API) and camelCase (JS)

/**
 * Recursively converts snake_case keys to camelCase
 */
export function snakeToCamel<T>(obj: any): T {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => snakeToCamel(item)) as T;
  }

  if (typeof obj !== 'object') {
    return obj;
  }

  const camelObj: any = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
      camelObj[camelKey] = snakeToCamel(obj[key]);
    }
  }
  return camelObj as T;
}

/**
 * Recursively converts camelCase keys to snake_case
 */
export function camelToSnake<T>(obj: any): T {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => camelToSnake(item)) as T;
  }

  if (typeof obj !== 'object') {
    return obj;
  }

  const snakeObj: any = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
      snakeObj[snakeKey] = camelToSnake(obj[key]);
    }
  }
  return snakeObj as T;
}
