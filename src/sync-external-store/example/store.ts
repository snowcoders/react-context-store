import { SyncExternalStore } from "../sync-external-store.js";

// Typically you'd only export the instance `mockStore` however we're using this to test our SyncExternalStore code
export class MockExternalStore extends SyncExternalStore<{
  state: "NOT_STARTED" | "PENDING" | "COMPLETE";
}> {
  constructor() {
    super({
      state: "NOT_STARTED",
    });
  }

  fetchSync = () => {
    this.updateSnapshot({
      state: "COMPLETE",
    });
  };

  fetchAsync = () => {
    this.updateSnapshot({
      state: "PENDING",
    });

    return new Promise<void>((resolve) => {
      setTimeout(() => {
        this.updateSnapshot({
          state: "COMPLETE",
        });
        resolve();
      }, 0);
    });
  };
}

export const mockStore = new MockExternalStore();
