import React from "react";
import { someStore } from "./store.mock.js";

export const MockComponent = () => {
  const snapshot = React.useSyncExternalStore(...someStore.getUseSyncExternalStoreArgs());

  const onFetchSync = () => {
    someStore.fetchSync();
  };

  const onFetchAsync = () => {
    someStore.fetchAsync();
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
