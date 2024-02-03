import {
  createStatefulIndexableErrorSnapshot,
  createStatefulIndexableLoadingSnapshot,
  createStatefulIndexableSuccessSnapshot,
  deleteStatefulIndexableSuccessSnapshot,
} from "./create-snapshot.js";

export type CreateStatefulIndexableLoadingSnapshot<TStore extends StoreSnapshot> =
  typeof createStatefulIndexableLoadingSnapshot<TStore>;
export type CreateStatefulIndexableSuccessSnapshot<TStore extends StoreSnapshot> =
  typeof createStatefulIndexableSuccessSnapshot<TStore>;
export type CreateStatefulIndexableErrorSnapshot<TStore extends StoreSnapshot> =
  typeof createStatefulIndexableErrorSnapshot<TStore>;
export type DeleteStatefulIndexableSuccessSnapshot<TStore extends StoreSnapshot> =
  typeof deleteStatefulIndexableSuccessSnapshot<TStore>;

export type StoreItem<TData, TState extends string> = {
  data: TData;
  error: null | string;
  state: TState;
};

export type StoreSnapshot<
  TState extends string = string,
  TKey extends PropertyKey = PropertyKey,
  TStoreItemData = Record<TKey, PropertyKey>,
> = {
  data: Record<PropertyKey, StoreItem<TStoreItemData, TState>>;
  error: null | string;
  state: TState;
};

export type CreateStatefulIndexableActionParams<TStore extends StoreSnapshot, TParams> = {
  updateRootState: boolean;
  updateSnapshot?: {
    error: CreateStatefulIndexableErrorSnapshot<TStore>;
    loading: CreateStatefulIndexableLoadingSnapshot<TStore>;
    success: CreateStatefulIndexableSuccessSnapshot<TStore>;
  };
  action: (params: TParams) => Promise<TStore["data"][keyof TStore["data"]]["data"]>;
};

export type DeleteIndexableActionParams<TStore extends StoreSnapshot, TParams> = {
  updateRootState: boolean;
  updateSnapshot?: {
    error: CreateStatefulIndexableErrorSnapshot<TStore>;
    loading: CreateStatefulIndexableLoadingSnapshot<TStore>;
    success: DeleteStatefulIndexableSuccessSnapshot<TStore>;
  };
  action: (params: TParams) => Promise<void>;
};
