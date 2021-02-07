import { Stateful } from "../shared";

export interface ContextStore<TData> extends Stateful {
  data: TData;
}

export type ContextStoreData<
  TContextStore extends ContextStore<any>
> = TContextStore["data"];
