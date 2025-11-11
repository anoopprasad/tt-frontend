/**
 * Transform object keys between snake_case and camelCase
 */

const isObject = (obj) => {
  return obj !== null && typeof obj === 'object' && !Array.isArray(obj)
}

const isArray = (obj) => {
  return Array.isArray(obj)
}

/**
 * Convert snake_case string to camelCase
 */
export const toCamelCase = (str) => {
  return str.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase())
}

/**
 * Convert camelCase string to snake_case
 */
export const toSnakeCase = (str) => {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
}

/**
 * Recursively transform object keys from snake_case to camelCase
 */
export const keysToCamel = (obj) => {
  if (isArray(obj)) {
    return obj.map((item) => keysToCamel(item))
  }

  if (isObject(obj)) {
    return Object.keys(obj).reduce((acc, key) => {
      const camelKey = toCamelCase(key)
      acc[camelKey] = keysToCamel(obj[key])
      return acc
    }, {})
  }

  return obj
}

/**
 * Recursively transform object keys from camelCase to snake_case
 */
export const keysToSnake = (obj) => {
  if (isArray(obj)) {
    return obj.map((item) => keysToSnake(item))
  }

  if (isObject(obj)) {
    return Object.keys(obj).reduce((acc, key) => {
      const snakeKey = toSnakeCase(key)
      acc[snakeKey] = keysToSnake(obj[key])
      return acc
    }, {})
  }

  return obj
}
