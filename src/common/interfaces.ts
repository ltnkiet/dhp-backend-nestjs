export interface JwtPayload {
  shopId: any;
  email: string;
}

export interface HasTimestamp {
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

export interface FindOptions {
  sort: Record<string, number>;
  select: Record<string, number>;
  populate: any[];
  forceReload?: boolean;
}

export interface PaginationResult<T = any> {
  rows: T[];
  total: number;
  limit: number;
  offset: number;
}

export interface AppRequest extends Request {
  startTime: Date;
}
