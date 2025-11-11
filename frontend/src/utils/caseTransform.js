/**
 * Utility functions for transforming between snake_case and camelCase
 */

const isObject = (obj) => {
  return obj === Object(obj) && !Array.isArray(obj) && typeof obj !== 'function';
};

const toCamel = (str) => {
  return str.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
};

const toSnake = (str) => {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
};

export const keysToCamel = (obj) => {
  if (isObject(obj)) {
    const result = {};
    Object.keys(obj).forEach((key) => {
      result[toCamel(key)] = keysToCamel(obj[key]);
    });
    return result;
  } else if (Array.isArray(obj)) {
    return obj.map((item) => keysToCamel(item));
  }
  return obj;
};

export const keysToSnake = (obj) => {
  if (isObject(obj)) {
    const result = {};
    Object.keys(obj).forEach((key) => {
      result[toSnake(key)] = keysToSnake(obj[key]);
    });
    return result;
  } else if (Array.isArray(obj)) {
    return obj.map((item) => keysToSnake(item));
  }
  return obj;
};
