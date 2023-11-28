import { SyncExternalStore } from "../sync-external-store/index.js";
import {
  createStatefulIndexableErrorSnapshot,
  createStatefulIndexableLoadingSnapshot,
  createStatefulIndexableSuccessSnapshot,
} from "./create-snapshot.js";
import type { CreateStatefulIndexableActionParams, StatefulIndexableStore } from "./types.js";

export abstract class StatefulIndexableSyncExternalStore<
  TStore extends StatefulIndexableStore<unknown>,
> extends SyncExternalStore<TStore> {
  protected createAction<TParams = void, TResponse = void>(
    params: CreateStatefulIndexableActionParams<TStore, TParams, TResponse>,
  ) {
    const {
      action,
      key,
      updateSnapshot = {
        loading: createStatefulIndexableLoadingSnapshot,
        success: createStatefulIndexableSuccessSnapshot,
        error: createStatefulIndexableErrorSnapshot,
      },
    } = params;

    return async (actionParams: TParams) => {
      this.updateSnapshot(updateSnapshot.loading(key));
      try {
        const data = await action(actionParams);
        this.updateSnapshot(updateSnapshot.success(key, data));
      } catch (error) {
        this.updateSnapshot(updateSnapshot.error(key, error));
      }
    };
  }
}
