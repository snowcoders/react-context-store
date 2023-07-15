import type { useSyncExternalStore } from "react";

type StoreParameters<T> = Parameters<typeof useSyncExternalStore<T>>;

export interface ISyncExternalStore<T> {
  subscribe: StoreParameters<T>[0];

  getSnapshot: StoreParameters<T>[1];

  getServerSnapshot?: StoreParameters<T>[2];
}

const noop = () => {};

export class SyncExternalStore<TSnapshot> implements ISyncExternalStore<TSnapshot> {
  private subscribers: Set<Parameters<ISyncExternalStore<TSnapshot>["subscribe"]>[0]>;
  private snapshot: TSnapshot;

  constructor(initialSnapshot: TSnapshot) {
    this.snapshot = initialSnapshot;
    this.subscribers = new Set();
  }

  subscribe: ISyncExternalStore<TSnapshot>["subscribe"] = (onStoreChange) => {
    if (this.subscribers.has(onStoreChange)) {
      return noop;
    }

    this.subscribers.add(onStoreChange);
    return () => {
      this.subscribers.delete(onStoreChange);
    };
  };

  getSnapshot: ISyncExternalStore<TSnapshot>["getSnapshot"] = () => {
    return this.snapshot;
  };

  getServerSnapshot = undefined;

  getUseSyncExternalStoreArgs = () => {
    return [this.subscribe, this.getSnapshot, this.getServerSnapshot] as const;
  };
  protected updateSnapshot(newSnapshot: ((prevSnapshot: TSnapshot) => TSnapshot) | TSnapshot) {
    if (typeof newSnapshot === "function") {
      // @ts-expect-error: Not sure how to narrow a Function further to match our particular definition
      this.snapshot = newSnapshot(this.snapshot);
    } else {
      this.snapshot = newSnapshot;
    }
    this.subscribers.forEach((subscriber) => {
      subscriber();
    });
  }
}
