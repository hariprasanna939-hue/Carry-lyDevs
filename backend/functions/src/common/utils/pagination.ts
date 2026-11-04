export interface PaginationParams {
  limit?: number;
  offset?: number;
  lastDocId?: string;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  hasMore: boolean;
  nextCursor?: string;
}

export function parsePaginationParams(params: PaginationParams, defaultLimit = 20): { limit: number; offset: number } {
  const limit = Math.min(Math.max(params.limit || defaultLimit, 1), 100);
  const offset = Math.max(params.offset || 0, 0);
  return { limit, offset };
}
