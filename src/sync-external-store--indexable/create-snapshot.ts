import { normalizeError } from "../shared/index.js";
import type { IndexableStore, IndexableStoreStructureKey } from "./types.js";

export function createIndexableLoadingSnapshot<TStore extends IndexableStore<unknown>>() {
  return (snapshot: TStore): TStore => {
    return {
      ...snapshot,
      error: null,
      state: "loading",
    };
  };
}

export function createIndexableErrorSnapshot<TStore extends IndexableStore<unknown>>(error: unknown) {
  const errorMessage = normalizeError(error);
  return (snapshot: TStore): TStore => {
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
  return (snapshot: TStore): TStore => {
    if (Array.isArray(snapshot.data) && typeof key === "number") {
      const newData = [...snapshot.data];
      newData[key] = data;
      return {
        ...snapshot,
        data: newData,
        error: null,
        state: "success",
      };
    } else {
      return {
        ...snapshot,
        data: {
          ...snapshot.data,
          [key]: data,
        },
        error: null,
        state: "success",
      };
    }
  };
}
