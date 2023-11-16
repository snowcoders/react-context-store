import { beforeEach, afterEach, describe, it, jest } from "@jest/globals";
import { StatefulIndexableStore } from "./types.js";
import { StatefulIndexableSyncExternalStore } from "./store.js";

describe("StatefulIndexableSyncExternalStore", () => {
  type Item = { id: number; value: string };
  const mockAction = jest.fn(async (value) => value);
  const mockStoreInitialState: StatefulIndexableStore<null | Item> = {
    hello: {
      data: null,
      error: null,
      state: "unsent",
    },
    goodbye: {
      data: null,
      error: null,
      state: "unsent",
    },
  };

  class MockStore extends StatefulIndexableSyncExternalStore<StatefulIndexableStore<null | Item>> {
    constructor() {
      super(mockStoreInitialState);
    }
    private async updateDataAction(key: string, value: Item) {
      const action = this.createAction({
        action: mockAction,
        key,
      });
      return action(value);
    }
    public async updateHello(value: Item) {
      await this.updateDataAction("hello", value);
    }
    public async updateGoodbye(value: Item) {
      await this.updateDataAction("goodbye", value);
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
    const mockItem = { id: 2112, value: "hello world" };

    //* Act
    await store.updateHello(mockItem);
    const updatedSnapshot = store.getSnapshot();

    //* Assert
    expect(mockAction).toHaveBeenCalledTimes(1);
    expect(updatedSnapshot.hello.data).toMatchObject(mockItem);
  });
});
