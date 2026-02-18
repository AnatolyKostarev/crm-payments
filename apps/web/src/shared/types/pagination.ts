export interface PaginationMeta {
  total: number
  limit: number
  offset: number
  hasMore: boolean
}

export interface PaginatedResponse<T> {
  data: {
    items: T[]
    pagination: PaginationMeta
  }
}

export interface PaginationParams {
  limit?: number
  offset?: number
}
