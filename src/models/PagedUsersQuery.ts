export interface PagedUsersQuery {
  pageIndex: number;
  pageSize: number;
  sortBy?: string | null;
  sortDir?: 'asc' | 'desc' | '';
  search?: string | null;
}