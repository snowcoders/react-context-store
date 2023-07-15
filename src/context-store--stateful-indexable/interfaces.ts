import { ContextStore } from "../context-store--basic";

// Helper type for when data is an indexable type (map or array)
export type IndexableContextStoreData<IndexableContextStoreItem> =
  | Array<IndexableContextStoreItem>
  | Record<number | string | symbol, IndexableContextStoreItem>;

export interface IndexableStatefulContextStore<TDataItem>
  extends ContextStore<IndexableContextStoreData<ContextStore<TDataItem>>> {}

export type IndexableStatefulContextStoreValue<TContextStore extends IndexableStatefulContextStore<unknown>> =
  TContextStore["data"][any];

export type IndexableStatefulContextStoreValueData<TContextStore extends IndexableStatefulContextStore<unknown>> =
  TContextStore["data"][any]["data"];

export type IndexableStatefulContextStoreKey<TContextStore extends IndexableStatefulContextStore<unknown>> =
  TContextStore["data"] extends Array<any> ? number : keyof TContextStore["data"];
