export interface PaginatedModel<TData = unknown> {
  hasNextPage: boolean
  currentPage: number
  firstPage: number
  lastPage: number
  length: number
  total: number
  data: TData[]
}
