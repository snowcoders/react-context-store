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
