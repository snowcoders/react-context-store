import { statefulStates } from "../shared/index.js";
import {
  indexableCreateLoadingSnapshot,
  indexableCreateSuccessSnapshot,
  indexableDeleteSuccessSnapshot,
  indexableErrorSnapshot,
} from "./create-snapshot.js";

export type IndexableArrayStore<TItem> = {
  data: Array<TItem>;
  error: null | string;
  state: keyof typeof statefulStates;
};
export type IndexableMapStore<TItem> = {
  data: Record<PropertyKey, TItem>;
  error: null | string;
  state: keyof typeof statefulStates;
};

export type IndexableStore<TItem = unknown> = IndexableArrayStore<TItem> | IndexableMapStore<TItem>;
export type IndexableStoreStructureKey<TIndexableStore extends IndexableStore<unknown>> = keyof TIndexableStore["data"];
export type IndexableStoreValue<TIndexableStore extends IndexableStore<unknown>> =
  TIndexableStore["data"][keyof TIndexableStore["data"]];

export type CreateIndexableActionParams<TStore extends IndexableStore<unknown>, TParams> = {
  key: IndexableStoreStructureKey<TStore>;
  updateSnapshot?: {
    error: typeof indexableErrorSnapshot;
    loading: typeof indexableCreateLoadingSnapshot;
    success: typeof indexableCreateSuccessSnapshot;
  };
  action: (params: TParams) => Promise<IndexableStoreValue<TStore>>;
};

export type DeleteIndexableActionParams<TStore extends IndexableStore<unknown>, TParams> = {
  key: IndexableStoreStructureKey<TStore>;
  updateSnapshot?: {
    error: typeof indexableErrorSnapshot;
    loading: typeof indexableCreateLoadingSnapshot;
    success: typeof indexableDeleteSuccessSnapshot;
  };
  action: (params: TParams) => Promise<void>;
};
