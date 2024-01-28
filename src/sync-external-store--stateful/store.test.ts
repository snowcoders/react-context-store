import { afterEach, beforeEach, describe, it, jest } from "@jest/globals";
import { StatefulSyncExternalStore } from "./store.js";
import { StatefulStore } from "./types.js";

describe("StatefulSyncExternalStore", () => {
  type Item = { id: number; value: string };
  const mockAction = jest.fn(async (value: Item) => value);
  const mockStoreInitialState: StatefulStore<null | Item> = {
    data: null,
    error: null,
    state: "unsent",
  };

  class MockStore extends StatefulSyncExternalStore<StatefulStore<null | Item>> {
    constructor() {
      super(mockStoreInitialState);
    }

    private async putAction(value: Item) {
      const action = this.createAction({
        action: mockAction,
      });
      return action(value);
    }
    public async put(value: Item) {
      await this.putAction(value);
    }
  }

  let store: MockStore;

  beforeEach(() => {
    store = new MockStore();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("will update the store", async () => {
    //* Arrange
    const mockItem: Item = { id: 2112, value: "hello world" };

    //* Act
    await store.put(mockItem);
    const updatedSnapshot = store.getSnapshot();

    //* Assert
    expect(mockAction).toHaveBeenCalledTimes(1);
    expect(updatedSnapshot.data).toMatchObject(mockItem);
  });
});
