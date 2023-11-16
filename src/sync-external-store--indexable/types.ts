import { CreateActionParams, statefulStates } from "../shared/index.js";
import {
  createIndexableErrorSnapshot,
  createIndexableLoadingSnapshot,
  createIndexableSuccessSnapshot,
} from "./create-snapshot.js";

export type CreateIndexableErrorSnapshot = typeof createIndexableErrorSnapshot;
export type CreateIndexableLoadingSnapshot = typeof createIndexableLoadingSnapshot;
export type CreateIndexableSuccessSnapshot = typeof createIndexableSuccessSnapshot;

export type IndexableStoreStructureKey<TStore extends IndexableStore<unknown>> = TStore["data"] extends Array<unknown>
  ? number
  : keyof TStore["data"];

export type IndexableStore<TData> = {
  data: Record<string | number | symbol, TData> | Array<TData>;
  error: null | string;
  state: keyof typeof statefulStates;
};

export type CreateIndexableActionParams<
  TStore extends IndexableStore<unknown>,
  TParams,
  TResponse,
> = CreateActionParams<TParams, TResponse> & {
  key: IndexableStoreStructureKey<TStore>;
  updateSnapshot?: {
    loading: CreateIndexableLoadingSnapshot;
    success: CreateIndexableSuccessSnapshot;
    error: CreateIndexableErrorSnapshot;
  };
};
