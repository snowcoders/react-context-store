import { CreateActionParams, statefulStates } from "../shared/index.js";
import {
  createStatefulIndexableErrorSnapshot,
  createStatefulIndexableLoadingSnapshot,
  createStatefulIndexableSuccessSnapshot,
} from "./create-snapshot.js";

export type CreateStatefulIndexableErrorSnapshot = typeof createStatefulIndexableErrorSnapshot;
export type CreateStatefulIndexableLoadingSnapshot = typeof createStatefulIndexableLoadingSnapshot;
export type CreateStatefulIndexableSuccessSnapshot = typeof createStatefulIndexableSuccessSnapshot;

export type StatefulIndexableStore<TData> = Record<string, StoreItem<TData>>;

export type StoreItem<TData> = {
  data: TData;
  error: null | string;
  state: keyof typeof statefulStates;
};

export type CreateStatefulIndexableActionParams<
  TStore extends StatefulIndexableStore<unknown>,
  TParams,
  TResponse,
> = CreateActionParams<TParams, TResponse> & {
  key: keyof TStore;
  updateSnapshot?: {
    loading: CreateStatefulIndexableLoadingSnapshot;
    success: CreateStatefulIndexableSuccessSnapshot;
    error: CreateStatefulIndexableErrorSnapshot;
  };
};
