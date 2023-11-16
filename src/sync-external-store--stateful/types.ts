import { CreateActionParams, statefulStates } from "../shared/index.js";
import {
  createStatefulErrorSnapshot,
  createStatefulLoadingSnapshot,
  createStatefulSuccessSnapshot,
} from "./create-snapshot.js";

export type CreateStatefulErrorSnapshot = typeof createStatefulErrorSnapshot;
export type CreateStatefulLoadingSnapshot = typeof createStatefulLoadingSnapshot;
export type CreateStatefulSuccessSnapshot = typeof createStatefulSuccessSnapshot;

export type StatefulStore<TData> = {
  data: TData;
  error: null | string;
  state: keyof typeof statefulStates;
};

export type CreateStatefulActionParams<TParams, TResponse> = CreateActionParams<TParams, TResponse> & {
  updateSnapshot?: {
    loading: CreateStatefulLoadingSnapshot;
    success: CreateStatefulSuccessSnapshot;
    error: CreateStatefulErrorSnapshot;
  };
};
