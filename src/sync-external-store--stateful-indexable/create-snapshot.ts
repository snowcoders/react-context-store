import { normalizeError } from "../shared/index.js";
import type { StoreSnapshot } from "./types.js";

export function createStatefulIndexableLoadingSnapshot<TStore extends StoreSnapshot>(
  key: keyof TStore["data"],
  updateRoot: boolean,
) {
  return (snapshot: TStore): TStore => {
    if (key == null) {
      return snapshot;
    }
    const nonDataValues = {
      error: null,
      state: "loading",
    };
    return {
      ...snapshot,
      ...(updateRoot && {
        ...nonDataValues,
      }),
      data: {
        ...snapshot.data,
        [key]: {
          ...snapshot.data[key],
          ...nonDataValues,
        },
      },
    };
  };
}

export function createStatefulIndexableErrorSnapshot<TStore extends StoreSnapshot>(
  key: keyof TStore["data"],
  updateRoot: boolean,
  error: unknown,
) {
  const errorMessage = normalizeError(error);
  const nonDataValues = {
    error: errorMessage,
    state: "error",
  };
  return (snapshot: TStore): TStore => {
    if (key == null) {
      return snapshot;
    }
    return {
      ...snapshot,
      ...(updateRoot && {
        ...nonDataValues,
      }),
      data: {
        ...snapshot.data,
        [key]: {
          ...snapshot.data[key],
          ...nonDataValues,
        },
      },
    };
  };
}

export function createStatefulIndexableSuccessSnapshot<TStoreSnapshot extends StoreSnapshot>(
  key: keyof TStoreSnapshot["data"],
  updateRoot: boolean,
  data: TStoreSnapshot["data"][keyof TStoreSnapshot["data"]]["data"],
) {
  return (snapshot: TStoreSnapshot): TStoreSnapshot => {
    const nonDataValues = {
      error: null,
      state: "success",
    };
    return {
      ...snapshot,
      ...(updateRoot && {
        ...nonDataValues,
      }),
      data: {
        ...snapshot.data,
        [key]: {
          ...snapshot.data[key],
          data,
          ...nonDataValues,
        },
      },
    };
  };
}

export function deleteStatefulIndexableSuccessSnapshot<TStoreSnapshot extends StoreSnapshot>(
  key: keyof TStoreSnapshot["data"],
  updateRoot: boolean,
) {
  return (snapshot: TStoreSnapshot): TStoreSnapshot => {
    const nonDataValues = {
      error: null,
      state: "success",
    };

    if (Array.isArray(snapshot.data) && typeof key === "number") {
      const newData = [...snapshot.data];
      newData.splice(key, 1);
      return {
        ...snapshot,
        data: newData,
        ...(updateRoot && {
          ...nonDataValues,
        }),
      };
    } else {
      const newData = { ...snapshot.data };
      delete newData[key];
      return {
        ...snapshot,
        data: newData,
        ...(updateRoot && {
          ...nonDataValues,
        }),
      };
    }
  };
}
