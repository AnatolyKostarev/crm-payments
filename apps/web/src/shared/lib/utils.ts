export function toSearchParams(params?: object): Record<string, string> {
  if (!params) return {}
  const result: Record<string, string> = {}
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') {
      result[key] = String(value)
    }
  }
  return result
}
