import { SyncExternalStore } from "../sync-external-store/index.js";
import {
  createStatefulErrorSnapshot,
  createStatefulLoadingSnapshot,
  createStatefulSuccessSnapshot,
} from "./create-snapshot.js";
import type { CreateStatefulActionParams, StatefulStore } from "./types.js";

/**
 * TODO: Consider naming conventions here. We have the following:
 *  - SyncExternalStore - Base of everything
 *  - IndexableSyncExternalStore - Indexable data, state at store level
 *  - StatefulSyncExternalStore - Non-indexable data, state at store level
 *  - StatefulIndexableSyncExternalStore - Indexable data, state at item level
 *
 * Alternate names
 *  - SyncExternalStore - Base of everything
 *  - GlobalStateSyncExternalStore - Any data, stores state at store level
 *  - IndexableGlobalStateSyncExternalStore - Indexable data, stores state at store level
 *  - IndexableLocalStateSyncExternalStore - Indexable data, stores state at item level
 *  - IndexableStateSyncExternalStore - Indexable data, stores state at both global and local level
 *
 * Question becomes can I:
 *  - Add my own states (CRUD)
 *  - Calculate a global state based off local states
 * If so maybe IndexableStateSyncExternalStore and IndexableGlobalStateSyncExternalStore isn't needed
 *
 * This makes me wonder if I can merge StatefulIndexableSyncExternalStore into
 * IndexableSyncExternalStore and keep the state in the root level and add it in
 * the item level
 */
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
