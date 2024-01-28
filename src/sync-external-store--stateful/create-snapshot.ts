import { normalizeError } from "../shared/index.js";
import type { StatefulStore } from "./types.js";

export function createStatefulLoadingSnapshot<TStore extends StatefulStore<unknown>>() {
  return (snapshot: TStore): TStore => {
    return {
      ...snapshot,
      error: null,
      state: "loading",
    };
  };
}

export function createStatefulErrorSnapshot<TStore extends StatefulStore<unknown>>(error: unknown) {
  const errorMessage = normalizeError(error);
  return (snapshot: TStore): TStore => {
    return {
      ...snapshot,
      error: errorMessage,
      state: "error",
    };
  };
}

export function createStatefulSuccessSnapshot<TStore extends StatefulStore<unknown>>(data: TStore["data"]) {
  return (snapshot: TStore): TStore => {
    return {
      ...snapshot,
      data,
      error: null,
      state: "success",
    };
  };
}
