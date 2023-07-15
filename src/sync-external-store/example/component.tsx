import React from "react";
import { mockStore } from "./store.js";

export const MockComponent = () => {
  const snapshot = React.useSyncExternalStore(...mockStore.getUseSyncExternalStoreArgs());

  const onFetchSync = () => {
    mockStore.fetchSync();
  };

  const onFetchAsync = () => {
    mockStore.fetchAsync();
  };

  return (
    <div>
      <h1>{snapshot.state}</h1>
      <button onClick={onFetchSync} type="button">
        Fetch sync
      </button>
      <button onClick={onFetchAsync} type="button">
        Fetch async
      </button>
    </div>
  );
};
