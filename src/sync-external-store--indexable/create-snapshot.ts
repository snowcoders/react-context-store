import { normalizeError } from "../shared/index.js";
import type { IndexableStore, IndexableStoreStructureKey, IndexableStoreValue } from "./types.js";

export function indexableCreateLoadingSnapshot<TStore extends IndexableStore<unknown>>() {
  return (snapshot: TStore): TStore => {
    return {
      ...snapshot,
      error: null,
      state: "loading",
    };
  };
}

export function indexableErrorSnapshot<TStore extends IndexableStore<unknown>>(error: unknown) {
  const errorMessage = normalizeError(error);
  return (snapshot: TStore): TStore => {
    return {
      ...snapshot,
      error: errorMessage,
      state: "error",
    };
  };
}

export function indexableCreateSuccessSnapshot<TStore extends IndexableStore<unknown>>(
  key: IndexableStoreStructureKey<TStore>,
  data: IndexableStoreValue<TStore>,
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

export function indexableDeleteSuccessSnapshot<TStore extends IndexableStore<unknown>>(
  key: IndexableStoreStructureKey<TStore>,
) {
  return (snapshot: TStore): TStore => {
    if (Array.isArray(snapshot.data) && typeof key === "number") {
      const newData = [...snapshot.data];
      newData.splice(key, 1);
      return {
        ...snapshot,
        data: newData,
        error: null,
        state: "success",
      };
    } else {
      const newData = { ...snapshot.data };
      // @ts-expect-error: TODO see if we can type this better
      delete newData[key];
      return {
        ...snapshot,
        data: newData,
        error: null,
        state: "success",
      };
    }
  };
}
