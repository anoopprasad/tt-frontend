/**
 * Converts snake_case to camelCase
 */
export function snakeToCamel(str) {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
}

/**
 * Converts camelCase to snake_case
 */
export function camelToSnake(str) {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
}

/**
 * Recursively converts object keys from snake_case to camelCase
 */
export function toCamelCase(obj) {
  if (obj === null || obj === undefined) {
    return obj
  }

  if (Array.isArray(obj)) {
    return obj.map(toCamelCase)
  }

  if (typeof obj === 'object' && obj.constructor === Object) {
    const converted = {}
    for (const [key, value] of Object.entries(obj)) {
      const camelKey = snakeToCamel(key)
      converted[camelKey] = toCamelCase(value)
    }
    return converted
  }

  return obj
}

/**
 * Recursively converts object keys from camelCase to snake_case
 */
export function toSnakeCase(obj) {
  if (obj === null || obj === undefined) {
    return obj
  }

  if (Array.isArray(obj)) {
    return obj.map(toSnakeCase)
  }

  if (typeof obj === 'object' && obj.constructor === Object) {
    const converted = {}
    for (const [key, value] of Object.entries(obj)) {
      const snakeKey = camelToSnake(key)
      converted[snakeKey] = toSnakeCase(value)
    }
    return converted
  }

  return obj
}
