export const statefulStates = {
  error: "error",
  loading: "loading",
  success: "success",
  unsent: "unsent",
} as const;
export interface Stateful {
  state: keyof typeof statefulStates;
}

export const errorMessages = {
  actionReturnedNull: "Action did not return value",
  errorCallbackRejected: "Error callback should never reject",
  indexNotFound: "Index not found",
  unknownPreloadOrActionReject: "Preload or action promise rejected without message",
};

export const getNotImplementedPromise = () => Promise.reject("Not Implemented");

export function normalizeError(error: unknown): null | string {
  if (error == null) {
    return null;
  }

  if (typeof error === "string") {
    return error;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return JSON.stringify(error);
}

export type CreateActionParams<TParams, TResponse> = {
  action: (params: TParams) => Promise<TResponse>;
};
