import { SyncExternalStore } from "../sync-external-store/index.js";
import {
  createIndexableErrorSnapshot,
  createIndexableLoadingSnapshot,
  createIndexableSuccessSnapshot,
} from "./create-snapshot.js";
import type { CreateIndexableActionParams, IndexableStore } from "./types.js";

export abstract class IndexableSyncExternalStore<
  TStore extends IndexableStore<unknown>,
> extends SyncExternalStore<TStore> {
  protected createAction<TParams = void, TResponse = void>(
    params: CreateIndexableActionParams<TStore, TParams, TResponse>,
  ) {
    const {
      action,
      key,
      updateSnapshot = {
        loading: createIndexableLoadingSnapshot,
        success: createIndexableSuccessSnapshot,
        error: createIndexableErrorSnapshot,
      },
    } = params;

    return async (actionParams: TParams) => {
      this.updateSnapshot(updateSnapshot.loading());
      try {
        const data = await action(actionParams);
        this.updateSnapshot(updateSnapshot.success(key, data));
      } catch (error) {
        this.updateSnapshot(updateSnapshot.error(error));
      }
    };
  }
}
