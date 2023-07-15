import { errorMessages, statefulStates } from "../../shared";
import { ContextStore, ContextStoreData } from "../interfaces";

export async function getReplaceContextData<Params, TContextStore extends ContextStore<any>>(
  contextData: TContextStore,
  setContextData: React.Dispatch<React.SetStateAction<TContextStore>>,
  params: Params,
  dataHandlers: {
    action?: (params: Params) => Promise<ContextStoreData<TContextStore>>;
    error?: (params: Params) => Promise<ContextStoreData<TContextStore>>;
    preload?: (params: Params) => Promise<ContextStoreData<TContextStore>>;
  },
): Promise<ContextStoreData<TContextStore>> {
  const { action, error, preload } = dataHandlers;

  try {
    // Handle preload scenario
    let value = preload ? await preload(params) : contextData.data;
    setContextData({
      ...contextData,
      data: value,
      state: statefulStates.loading,
    });

    // Handle action
    value = action ? await action(params) : contextData.data;
    setContextData({
      ...contextData,
      data: value,
      state: statefulStates.success,
    });
    return Promise.resolve(value);
  } catch (e) {
    let errorValue = contextData.data;
    try {
      errorValue = error ? await error(params) : errorValue;
    } catch (e2) {
      setContextData({
        ...contextData,
        data: contextData.data,
        state: statefulStates.error,
      });
      return Promise.reject(errorMessages.errorCallbackRejected);
    }
    setContextData({
      ...contextData,
      data: errorValue,
      state: statefulStates.error,
    });
    if (typeof e === "string") {
      return Promise.reject(e);
    } else if (e instanceof Error) {
      return Promise.reject(e.message);
    } else {
      return Promise.reject(errorMessages.unknownPreloadOrActionReject);
    }
  }
}
