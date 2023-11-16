import { normalizeError } from "../shared/index.js";
import type { IndexableStore, IndexableStoreStructureKey } from "./types.js";

export function createIndexableLoadingSnapshot<TStore extends IndexableStore<unknown>>() {
  return (snapshot: TStore) => {
    return {
      ...snapshot,
      state: "loading",
    };
  };
}

export function createIndexableErrorSnapshot<TStore extends IndexableStore<unknown>>(error: unknown) {
  const errorMessage = normalizeError(error);
  return (snapshot: TStore) => {
    return {
      ...snapshot,
      error: errorMessage,
      state: "error",
    };
  };
}

export function createIndexableSuccessSnapshot<TStore extends IndexableStore<unknown>, TData>(
  key: IndexableStoreStructureKey<TStore>,
  data: TData,
) {
  return (snapshot: TStore) => {
    if (Array.isArray(snapshot.data) && typeof key === "number") {
      return {
        ...snapshot,
        data: [...snapshot.data.slice(0, key), data, ...snapshot.data.slice(key + 1)],
        state: "success",
      };
    } else {
      return {
        ...snapshot,
        data: {
          ...snapshot.data,
          [key]: data,
        },
        state: "success",
      };
    }
  };
}
