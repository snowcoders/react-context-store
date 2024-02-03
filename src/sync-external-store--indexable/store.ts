import { SyncExternalStore } from "../sync-external-store/index.js";
import {
  indexableCreateLoadingSnapshot,
  indexableCreateSuccessSnapshot,
  indexableDeleteSuccessSnapshot,
  indexableErrorSnapshot,
} from "./create-snapshot.js";
import type { CreateIndexableActionParams, DeleteIndexableActionParams, IndexableStore } from "./types.js";

/**
 * An array store base that has a loading state across the whole store
 */
export abstract class IndexableSyncExternalStore<
  TStore extends IndexableStore<unknown>,
> extends SyncExternalStore<TStore> {
  protected makeUpsertAction<TParams = void>(params: CreateIndexableActionParams<TStore, TParams>) {
    const {
      action,
      key,
      updateSnapshot = {
        error: indexableErrorSnapshot,
        loading: indexableCreateLoadingSnapshot,
        success: indexableCreateSuccessSnapshot,
      },
    } = params;

    return async (actionParams: TParams) => {
      this.updateSnapshot(updateSnapshot.loading());
      try {
        const data = await action(actionParams);
        this.updateSnapshot(updateSnapshot.success(key, data));
        return data;
      } catch (error) {
        this.updateSnapshot(updateSnapshot.error(error));
        throw error;
      }
    };
  }

  protected makeDeleteAction<TParams = void>(params: DeleteIndexableActionParams<TStore, TParams>) {
    const {
      action,
      key,
      updateSnapshot = {
        error: indexableErrorSnapshot,
        loading: indexableCreateLoadingSnapshot,
        success: indexableDeleteSuccessSnapshot,
      },
    } = params;

    return async (actionParams: TParams) => {
      this.updateSnapshot(updateSnapshot.loading());
      try {
        const data = await action(actionParams);
        this.updateSnapshot(updateSnapshot.success(key));
        return data;
      } catch (error) {
        this.updateSnapshot(updateSnapshot.error(error));
        throw error;
      }
    };
  }
}
