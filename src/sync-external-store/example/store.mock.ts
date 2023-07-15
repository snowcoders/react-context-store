import { SyncExternalStore } from "../sync-external-store.js";

export type MockExternalStoreState = {
  data: null | string;
  state: "COMPLETE" | "ERROR" | "NOT_STARTED" | "PENDING";
};

// Typically you'd only export the instance `mockStore` however we're using this to test our SyncExternalStore code
export class SomeStore extends SyncExternalStore<MockExternalStoreState> {
  constructor() {
    super({
      data: null,
      state: "NOT_STARTED",
    });
  }

  fetchSync = () => {
    this.updateSnapshot({
      data: "We didn't make a network request because this is synchronous and mostly here as just an example",
      state: "COMPLETE",
    });
  };

  fetchAsync = () => {
    this.updateSnapshot((snapshot) => ({
      ...snapshot,
      state: "PENDING",
    }));

    return fetch("https://raw.githubusercontent.com/snowcoders/react-context-store/main/README.md")
      .then((resp) => resp.text())
      .then((text) => {
        this.updateSnapshot((snapshot) => ({
          ...snapshot,
          data: text,
          state: "COMPLETE",
        }));
        return text;
      })
      .catch((e) => {
        this.updateSnapshot((snapshot) => ({
          ...snapshot,
          data: e,
          state: "ERROR",
        }));
        return Promise.reject(e);
      });
  };
}

export const someStore = new SomeStore();
