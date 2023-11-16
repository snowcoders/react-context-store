import { SyncExternalStore } from "../sync-external-store/index.js";
import {
  createStatefulErrorSnapshot,
  createStatefulLoadingSnapshot,
  createStatefulSuccessSnapshot,
} from "./create-snapshot.js";
import type { CreateStatefulActionParams, StatefulStore } from "./types.js";

export class StatefulSyncExternalStore<TData extends StatefulStore<unknown>> extends SyncExternalStore<TData> {
  protected createAction<TParams = void, TResponse = void>(params: CreateStatefulActionParams<TParams, TResponse>) {
    const {
      action,
      updateSnapshot = {
        error: createStatefulErrorSnapshot,
        loading: createStatefulLoadingSnapshot,
        success: createStatefulSuccessSnapshot,
      },
    } = params;

    return async (actionParams: TParams) => {
      this.updateSnapshot(updateSnapshot.loading());
      try {
        const data = await action(actionParams);
        this.updateSnapshot(updateSnapshot.success(data));
      } catch (error) {
        this.updateSnapshot(updateSnapshot.error(error));
      }
    };
  }
}
