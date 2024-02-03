import {
  indexableCreateLoadingSnapshot,
  indexableCreateSuccessSnapshot,
  indexableDeleteSuccessSnapshot,
  indexableErrorSnapshot,
} from "../create-snapshot.js";
import { IndexableSyncExternalStore } from "../store.js";
import { IndexableArrayStore } from "../types.js";

export type ItemDelete = { index: number };
export type ItemCreate = { value: string };
export type ItemGet = ItemDelete;
export type Item = ItemCreate & { id: number; loadTime: string };

export class ArrayExampleStore extends IndexableSyncExternalStore<IndexableArrayStore<Item>> {
  private static nextId: number = 0;
  constructor() {
    super({
      data: [],
      error: null,
      state: "unsent",
    });
  }

  /**
   * Represents a POST http request and adds the item to the end of the list
   * @param actionParams
   * @returns
   */
  public push = (actionParams: ItemCreate) => {
    const id = ArrayExampleStore.nextId++;
    const nextIndex = this.getSnapshot().data.length;
    return this.makeUpsertAction({
      key: nextIndex,
      updateSnapshot: {
        error: indexableErrorSnapshot,
        loading: indexableCreateLoadingSnapshot,
        success: indexableCreateSuccessSnapshot,
      },
      action: (props: ItemCreate) =>
        Promise.resolve({
          ...props,
          id,
          loadTime: new Date().toISOString(),
        }),
    })(actionParams);
  };

  /**
   * Represents a POST http request and adds the item to the end of the list
   * @param actionParams
   * @returns
   */
  public pushFail = (actionParams: ItemCreate) => {
    const nextIndex = this.getSnapshot().data.length;
    return this.makeUpsertAction({
      key: nextIndex,
      updateSnapshot: {
        error: indexableErrorSnapshot,
        loading: indexableCreateLoadingSnapshot,
        success: indexableCreateSuccessSnapshot,
      },
      action: (props: ItemCreate) => Promise.reject(Response.error()),
    })(actionParams);
  };

  /**
   * Represents a GET http request
   * @param actionParams
   * @returns
   */
  public get = (actionParams: ItemGet) => {
    const id = ArrayExampleStore.nextId++;
    const { index } = actionParams;
    const { data } = this.getSnapshot();
    return this.makeUpsertAction({
      key: index,
      updateSnapshot: {
        error: indexableErrorSnapshot,
        loading: indexableCreateLoadingSnapshot,
        success: indexableCreateSuccessSnapshot,
      },
      action: (props: ItemGet) => {
        const item = data[index];
        if (item) {
          return Promise.resolve(item);
        }
        return Promise.resolve({
          ...props,
          id,
          loadTime: new Date().toISOString(),
          value: "Item - Get - " + id,
        });
      },
    })(actionParams);
  };

  /**
   * Represents a GET http request
   * @param actionParams
   * @returns
   */
  public getFail = (actionParams: ItemGet) => {
    const nextIndex = this.getSnapshot().data.length;
    return this.makeUpsertAction({
      key: nextIndex,
      updateSnapshot: {
        error: indexableErrorSnapshot,
        loading: indexableCreateLoadingSnapshot,
        success: indexableCreateSuccessSnapshot,
      },
      action: (props: ItemGet) => Promise.reject(Response.error()),
    })(actionParams);
  };

  public delete = (actionParams: ItemDelete) => {
    const { index } = actionParams;
    return this.makeDeleteAction({
      key: index,
      updateSnapshot: {
        error: indexableErrorSnapshot,
        loading: indexableCreateLoadingSnapshot,
        success: indexableDeleteSuccessSnapshot,
      },
      action: (props: ItemDelete) => Promise.resolve(),
    })(actionParams);
  };
}
