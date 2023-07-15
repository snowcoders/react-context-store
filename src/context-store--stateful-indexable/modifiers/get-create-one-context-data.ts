import { Stateful, errorMessages, statefulStates } from "../../shared/index.js";
import {
  IndexableStatefulContextStore,
  IndexableStatefulContextStoreKey,
  IndexableStatefulContextStoreValueData,
} from "../interfaces.js";

export async function getCreateOneContextData<Params, TContextStore extends IndexableStatefulContextStore<any>>(
  contextData: TContextStore,
  setContextData: React.Dispatch<React.SetStateAction<TContextStore>>,
  params: Params,
  dataHandlers: {
    action: (params: Params) => Promise<IndexableStatefulContextStoreValueData<TContextStore>>;
    error?: (params: Params) => Promise<IndexableStatefulContextStoreValueData<TContextStore>>;
    getIndex: (params: Params) => IndexableStatefulContextStoreKey<TContextStore>;
    preload?: (params: Params) => Promise<IndexableStatefulContextStoreValueData<TContextStore>>;
  },
): Promise<IndexableStatefulContextStoreValueData<TContextStore>> {
  const { action, error, getIndex, preload } = dataHandlers;
  let value: null | IndexableStatefulContextStoreValueData<TContextStore> = null;

  try {
    // Handle preload
    value =
      (await setContextDataForCreateOne(setContextData, params, getIndex, statefulStates.loading, preload)) ?? value;

    // Handle action
    value =
      (await setContextDataForCreateOne(setContextData, params, getIndex, statefulStates.success, action)) ?? value;

    if (value == null) {
      return Promise.reject(errorMessages.actionReturnedNull);
    } else {
      return Promise.resolve(value);
    }
  } catch (e) {
    if (error) {
      try {
        await setContextDataForCreateOne(setContextData, params, getIndex, statefulStates.error, error);
      } catch {
        return Promise.reject(errorMessages.errorCallbackRejected);
      }
    } else {
      setContextData((contextData) => {
        return {
          ...contextData,
          state: statefulStates.success,
        };
      });
    }
    if (typeof e === "string") {
      return Promise.reject(e);
    } else if (e instanceof Error) {
      return Promise.reject(e.message);
    } else {
      return Promise.reject(errorMessages.actionReturnedNull);
    }
  }
}

export async function setContextDataForCreateOne<Params, TContextStore extends IndexableStatefulContextStore<any>>(
  setContextData: React.Dispatch<React.SetStateAction<TContextStore>>,
  params: Params,
  getIndex: (params: Params) => IndexableStatefulContextStoreKey<TContextStore>,
  state: Stateful["state"],
  action?: (params: Params) => Promise<IndexableStatefulContextStoreValueData<TContextStore>>,
) {
  // Handle preload scenario
  const index = getIndex(params);
  const value = action ? await action(params) : null;
  setContextData((contextData) => {
    return getUpdatedContextDataForCreateOne(contextData, index, value, state);
  });
  return value;
}

export function getUpdatedContextDataForCreateOne<TContextStore extends IndexableStatefulContextStore<unknown>>(
  store: TContextStore,
  index: IndexableStatefulContextStoreKey<TContextStore>,
  value: null | IndexableStatefulContextStoreValueData<TContextStore>,
  state: keyof typeof statefulStates,
): TContextStore {
  if (value == null) {
    return store;
  }

  const { data } = store;
  const newValue: IndexableStatefulContextStoreValueData<TContextStore> = {
    data: value,
    state,
  };
  // Handle array updates
  if (Array.isArray(data)) {
    const newData: Array<IndexableStatefulContextStoreValueData<TContextStore>> = [...data];
    // @ts-expect-error
    newData.splice(index, 0, newValue);
    return {
      ...store,
      data: newData,
    };
  } else {
    const newData = {
      ...data,
      [index]: newValue,
    };
    return {
      ...store,
      data: newData,
    };
  }
}
