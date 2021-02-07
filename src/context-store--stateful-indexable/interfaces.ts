import { IndexableContextStore } from "../context-store--indexable/interfaces";
import { ContextStore } from "../context-store--basic";

export type IndexableStatefulContextStore<TDataItem> = IndexableContextStore<
  ContextStore<TDataItem>
>;

export type IndexableStatefulContextStoreValue<
  TContextStore extends IndexableStatefulContextStore<any>
> = TContextStore["data"][any];

export type IndexableStatefulContextStoreValueData<
  TContextStore extends IndexableStatefulContextStore<any>
> = TContextStore["data"][any]["data"];

export type IndexableStatefulContextStoreKey<
  TContextStore extends IndexableStatefulContextStore<any>
> = keyof TContextStore["data"];
