import { ContextStore } from "../context-store--basic/index.js";

// Helper type for when data is an indexable type (map or array)
export type IndexableContextStoreData<IndexableContextStoreItem> = Record<
  number | string | symbol,
  IndexableContextStoreItem
>;

export interface IndexableContextStore<TDataItem> extends ContextStore<IndexableContextStoreData<TDataItem>> {}

export type IndexableContextStoreValue<TContextStore extends IndexableContextStore<any>> = TContextStore["data"][any];

export type IndexableContextStoreKey<TContextStore extends IndexableContextStore<any>> =
  TContextStore["data"] extends Array<any> ? number : keyof TContextStore["data"];
