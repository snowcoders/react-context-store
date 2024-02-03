import { SyncExternalStore } from "../sync-external-store/index.js";
import {
  createStatefulIndexableErrorSnapshot,
  createStatefulIndexableLoadingSnapshot,
  createStatefulIndexableSuccessSnapshot,
  deleteStatefulIndexableSuccessSnapshot,
} from "./create-snapshot.js";
import type { CreateStatefulIndexableActionParams, DeleteIndexableActionParams, StoreSnapshot } from "./types.js";

export abstract class StatefulIndexableSyncExternalStore<
  TStore extends StoreSnapshot,
> extends SyncExternalStore<TStore> {
  constructor(
    initialState: TStore,
    private indexableItemKey: keyof StoreSnapshot["data"],
  ) {
    super(initialState);
  }

  protected makeUpsertAction<
    TRequestParams extends Pick<StoreSnapshot["data"][PropertyKey]["data"], keyof StoreSnapshot["data"]>,
  >(params: CreateStatefulIndexableActionParams<TStore, TRequestParams>) {
    const {
      action,
      updateRootState,
      updateSnapshot = {
        error: createStatefulIndexableErrorSnapshot,
        loading: createStatefulIndexableLoadingSnapshot,
        success: createStatefulIndexableSuccessSnapshot,
      },
    } = params;

    return async (actionParams: TRequestParams) => {
      const indexableKey = actionParams[this.indexableItemKey];
      this.updateSnapshot(updateSnapshot.loading(indexableKey, updateRootState));
      try {
        const data = await action(actionParams);
        this.updateSnapshot(updateSnapshot.success(data[this.indexableItemKey], updateRootState, data));
        return data;
      } catch (error) {
        this.updateSnapshot(updateSnapshot.error(indexableKey, updateRootState, error));
        throw error;
      }
    };
  }

  protected makeDeleteAction<
    TRequestParams extends Pick<StoreSnapshot["data"][PropertyKey]["data"], keyof StoreSnapshot["data"]>,
  >(params: DeleteIndexableActionParams<TStore, TRequestParams>) {
    const {
      action,
      updateRootState,
      updateSnapshot = {
        error: createStatefulIndexableErrorSnapshot,
        loading: createStatefulIndexableLoadingSnapshot,
        success: deleteStatefulIndexableSuccessSnapshot,
      },
    } = params;

    return async (actionParams: TRequestParams) => {
      const indexableKey = actionParams[this.indexableItemKey];
      this.updateSnapshot(updateSnapshot.loading(indexableKey, updateRootState));
      try {
        const data = await action(actionParams);
        this.updateSnapshot(updateSnapshot.success(indexableKey, updateRootState));
        return data;
      } catch (error) {
        this.updateSnapshot(updateSnapshot.error(indexableKey, updateRootState, error));
        throw error;
      }
    };
  }
}
