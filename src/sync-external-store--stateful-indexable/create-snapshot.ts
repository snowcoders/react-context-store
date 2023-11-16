import { normalizeError } from "../shared/index.js";
import type { StatefulIndexableStore } from "./types.js";

export function createStatefulIndexableLoadingSnapshot<TStore extends StatefulIndexableStore<unknown>>(
  key: keyof TStore,
) {
  return (snapshot: TStore) => {
    return {
      ...snapshot,
      [key]: {
        ...snapshot[key],
        state: "loading",
      },
    };
  };
}

export function createStatefulIndexableErrorSnapshot<TStore extends StatefulIndexableStore<unknown>>(
  key: keyof TStore,
  error: unknown,
) {
  const errorMessage = normalizeError(error);
  return (snapshot: TStore) => {
    return {
      ...snapshot,
      [key]: {
        ...snapshot[key],
        error: errorMessage,
        state: "error",
      },
    };
  };
}

export function createStatefulIndexableSuccessSnapshot<TStore extends StatefulIndexableStore<unknown>, TData = unknown>(
  key: keyof TStore,
  data: TData,
) {
  return (snapshot: TStore) => {
    return {
      ...snapshot,
      [key]: {
        ...snapshot[key],
        data,
        state: "success",
      },
    };
  };
}
