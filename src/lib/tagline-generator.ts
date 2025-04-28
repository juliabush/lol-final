/**
 * Generates a random alphanumeric tagline of specified length
 */
export function generateRandomTagline(length: number = 3): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  
  return result
}

/**
 * Generates an array of unique random taglines
 */
export function generateRandomTaglines(count: number = 10, length: number = 3): string[] {
  const taglines = new Set<string>()
  
  while (taglines.size < count) {
    taglines.add(generateRandomTagline(length))
  }
  
  return Array.from(taglines)
}
