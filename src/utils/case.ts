function snakeToCamel(str: string) {
  return str.replace(/[-_]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
}

function camelToSnake(str: string) {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
}

function convertObjectKeys<T extends Record<string, any>>(
  obj: T,
  converter: (str: string) => string
): T {
  const result: Record<string, any> = {}
  for (const [key, value] of Object.entries(obj)) {
    if (Array.isArray(value)) {
      result[converter(key)] = value.map((item) => {
        if (typeof item === 'object' && item !== null) {
          return convertObjectKeys(item, converter)
        }
        return item
      })
      continue
    }
    if (typeof value === 'object' && value !== null) {
      result[converter(key)] = convertObjectKeys(value, converter)
      continue
    }
    result[converter(key)] = value
  }
  return result as T
}

export function objectSnakeToCamel<T extends Record<string, any>>(obj: T) {
  return convertObjectKeys<T>(obj, snakeToCamel)
}

export function objectCamelToSnake<T extends Record<string, any>>(obj: T) {
  return convertObjectKeys<T>(obj, camelToSnake)
}
