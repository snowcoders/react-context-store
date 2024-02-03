import {
  StatefulIndexableSyncExternalStore,
  StoreSnapshot,
  createStatefulIndexableErrorSnapshot,
  createStatefulIndexableLoadingSnapshot,
  createStatefulIndexableSuccessSnapshot,
  deleteStatefulIndexableSuccessSnapshot,
} from "../index.js";

export type ItemDelete = { id: number };
export type ItemCreate = { value: string };
export type ItemUpdate = ItemCreate & ItemDelete;
export type ItemGet = ItemDelete;
export type Item = ItemCreate & { loadTime: string };

type ExampleStoreItemData = {
  id: number;
  loadTime: string;
  value: string;
};
const exampleStoreStates = ["unset", "loading", "success", "error"] as const;
type ExampleStoreState = (typeof exampleStoreStates)[number];
type ExampleStoreSnapshot = StoreSnapshot<ExampleStoreState, "id", ExampleStoreItemData>;

export class ExampleMapStore extends StatefulIndexableSyncExternalStore<ExampleStoreSnapshot> {
  constructor(initialState: ExampleStoreSnapshot) {
    super(initialState, "id");
  }

  public get = this.makeUpsertAction<ItemGet>({
    updateRootState: false,
    updateSnapshot: {
      error: createStatefulIndexableErrorSnapshot<ExampleStoreSnapshot>,
      loading: createStatefulIndexableLoadingSnapshot<ExampleStoreSnapshot>,
      success: createStatefulIndexableSuccessSnapshot<ExampleStoreSnapshot>,
    },
    action: (params) => {
      const { id } = params;
      return Promise.resolve({
        id,
        loadTime: new Date().toISOString(),
        value: `Get - ${id}`,
      });
    },
  });

  public post = this.makeUpsertAction<ItemCreate>({
    updateRootState: true,
    updateSnapshot: {
      error: createStatefulIndexableErrorSnapshot<ExampleStoreSnapshot>,
      loading: createStatefulIndexableLoadingSnapshot<ExampleStoreSnapshot>,
      success: createStatefulIndexableSuccessSnapshot<ExampleStoreSnapshot>,
    },
    action: (params) => {
      const { value } = params;
      const maxId = Math.max(...Object.keys(this.getSnapshot().data).map(parseInt));
      const nextId = maxId + 1;
      return Promise.resolve({
        id: nextId,
        loadTime: new Date().toISOString(),
        value,
      });
    },
  });

  public patch = this.makeUpsertAction<ItemUpdate>({
    updateRootState: false,
    updateSnapshot: {
      error: createStatefulIndexableErrorSnapshot<ExampleStoreSnapshot>,
      loading: createStatefulIndexableLoadingSnapshot<ExampleStoreSnapshot>,
      success: createStatefulIndexableSuccessSnapshot<ExampleStoreSnapshot>,
    },
    action: (params) => {
      const { id, value } = params;
      return Promise.resolve({
        id,
        loadTime: new Date().toISOString(),
        value,
      });
    },
  });

  public delete = this.makeDeleteAction<ItemDelete>({
    updateRootState: true,
    updateSnapshot: {
      error: createStatefulIndexableErrorSnapshot<ExampleStoreSnapshot>,
      loading: createStatefulIndexableLoadingSnapshot<ExampleStoreSnapshot>,
      success: deleteStatefulIndexableSuccessSnapshot<ExampleStoreSnapshot>,
    },
    action: (params) => {
      const { id } = params;
      return Promise.resolve();
    },
  });
}
