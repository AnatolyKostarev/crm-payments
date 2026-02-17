export function paginatedResponse<T>(
  items: T[],
  total: number,
  limit: number,
  offset: number,
) {
  return {
    items,
    pagination: {
      total,
      limit,
      offset,
      hasMore: offset + limit < total,
    },
  }
}
