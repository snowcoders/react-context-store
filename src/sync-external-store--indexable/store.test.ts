import { afterEach, beforeEach, describe, it, jest } from "@jest/globals";
import { IndexableSyncExternalStore } from "./store.js";
import { IndexableStore } from "./types.js";

describe("IndexableSyncExternalStore", () => {
  describe("array data", () => {
    type Item = { id: number; value: string };
    const mockAction = jest.fn(async (value: Item) => value);
    const mockStoreInitialState: IndexableStore<Item> = {
      data: [
        { id: 2112, value: "hello world" },
        { id: 13, value: "hola mundo" },
      ],
      error: null,
      state: "unsent",
    };

    class MockStore extends IndexableSyncExternalStore<IndexableStore<Item>> {
      constructor() {
        super(mockStoreInitialState);
      }

      private getIndex(item: Item) {
        const snapshot = this.getSnapshot();
        if (!Array.isArray(snapshot.data)) {
          throw new Error("IndexableSyncExternalStore: data is not an array");
        }
        const index = snapshot.data.findIndex((data) => data.id === item.id);

        if (index === -1) {
          return snapshot.data.length;
        }

        return index;
      }

      private async updateDataAction(value: Item) {
        const action = this.makeUpsertAction({
          action: mockAction,
          key: this.getIndex(value),
        });
        return action(value);
      }
      public async updateData(value: Item) {
        await this.updateDataAction(value);
      }
    }

    let store: MockStore;

    beforeEach(() => {
      store = new MockStore();
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    describe("updateData", () => {
      it("will update the store", async () => {
        //* Arrange
        const item = { id: 2112, value: "goodbye world" };

        //* Act
        await store.updateData(item);
        const updatedSnapshot = store.getSnapshot();

        //* Assert
        expect(mockAction).toHaveBeenCalledTimes(1);
        expect(updatedSnapshot.data[0]).toMatchObject(item);
        expect(updatedSnapshot.data[1]).toMatchObject(mockStoreInitialState.data[1]);
      });
    });
  });

  describe("object data", () => {
    type Item = { id: number; value: string };
    const mockAction = jest.fn(async (value: Item) => value);
    const mockStoreInitialState: IndexableStore<Item> = {
      data: {
        13: { id: 13, value: "hola mundo" },
        2112: { id: 2112, value: "hello world" },
      },
      error: null,
      state: "unsent",
    };

    class MockStore extends IndexableSyncExternalStore<IndexableStore<Item>> {
      constructor() {
        super(mockStoreInitialState);
      }

      private getIndex(item: Item) {
        return item.id;
      }

      private async updateDataAction(value: Item) {
        const action = this.makeUpsertAction({
          action: mockAction,
          key: this.getIndex(value),
        });
        return action(value);
      }
      public async updateData(value: Item) {
        await this.updateDataAction(value);
      }
    }

    let store: MockStore;

    beforeEach(() => {
      store = new MockStore();
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    describe("updateData", () => {
      it("will update the store", async () => {
        //* Arrange
        const item = { id: 2112, value: "goodbye world" };

        //* Act
        await store.updateData(item);
        const updatedSnapshot = store.getSnapshot();

        //* Assert
        expect(mockAction).toHaveBeenCalledTimes(1);
        expect(updatedSnapshot.data[2112]).toMatchObject(item);
        expect(updatedSnapshot.data[13]).toMatchObject(mockStoreInitialState.data[13]);
      });
    });
  });
});
