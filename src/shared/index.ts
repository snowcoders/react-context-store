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
  indexNotFound: "Index not found",
  unknownPreloadOrActionReject:
    "Preload or action promise rejected without message",
  errorCallbackRejected: "Error callback should never reject",
  actionReturnedNull: "Action did not return value",
};

export const getNotImplementedPromise = () => Promise.reject("Not Implemented");
