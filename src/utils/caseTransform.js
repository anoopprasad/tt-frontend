/**
 * Recursively transforms object keys from snake_case to camelCase
 */
export function snakeToCamel(str) {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
}

export function camelToSnake(str) {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
}

export function transformKeys(obj, transformFn) {
  if (obj === null || obj === undefined) {
    return obj
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => transformKeys(item, transformFn))
  }

  if (typeof obj === 'object' && obj.constructor === Object) {
    const transformed = {}
    for (const [key, value] of Object.entries(obj)) {
      const newKey = transformFn(key)
      transformed[newKey] = transformKeys(value, transformFn)
    }
    return transformed
  }

  return obj
}

export function toCamelCase(obj) {
  return transformKeys(obj, snakeToCamel)
}

export function toSnakeCase(obj) {
  return transformKeys(obj, camelToSnake)
}
