import { errorMessages, Stateful, statefulStates } from "../../shared";
import {
  IndexableContextStore,
  IndexableContextStoreKey,
  IndexableContextStoreValue,
} from "../interfaces";

export async function getUpdateOneContextData<
  Params,
  TContextStore extends IndexableContextStore<any>
>(
  contextData: TContextStore,
  setContextData: React.Dispatch<React.SetStateAction<TContextStore>>,
  params: Params,
  dataHandlers: {
    action: (
      params: Params
    ) => Promise<Partial<IndexableContextStoreValue<TContextStore>>>;
    error?: (
      params: Params
    ) => Promise<Partial<IndexableContextStoreValue<TContextStore>> | null>;
    getIndex: (params: Params) => IndexableContextStoreKey<TContextStore>;
    preload?: (
      params: Params
    ) => Promise<Partial<IndexableContextStoreValue<TContextStore>>>;
  }
): Promise<IndexableContextStoreValue<TContextStore>> {
  const { action, error, getIndex, preload } = dataHandlers;
  let value: null | IndexableContextStoreValue<TContextStore> = null;

  try {
    // Handle preload
    value =
      (await setContextDataForUpdateOne(
        contextData,
        setContextData,
        params,
        getIndex,
        statefulStates.loading,
        preload
      )) ?? value;

    // Handle action
    value =
      (await setContextDataForUpdateOne(
        contextData,
        setContextData,
        params,
        getIndex,
        statefulStates.success,
        action
      )) ?? value;

    if (value == null) {
      return Promise.reject(errorMessages.actionReturnedNull);
    } else {
      return Promise.resolve(value);
    }
  } catch (e) {
    if (e.message === errorMessages.indexNotFound) {
      return Promise.reject(errorMessages.indexNotFound);
    }
    try {
      value = await setContextDataForUpdateOne(
        contextData,
        setContextData,
        params,
        getIndex,
        statefulStates.error,
        error
      );
      if (value == null) {
        return Promise.reject(errorMessages.indexNotFound);
      } else {
        return Promise.resolve(value);
      }
    } catch {
      setContextData((contextData) => {
        return {
          ...contextData,
          state: statefulStates.error,
        };
      });
      return Promise.reject(errorMessages.errorCallbackRejected);
    }
  }
}

export async function setContextDataForUpdateOne<
  Params,
  TContextStore extends IndexableContextStore<any>
>(
  contextData: TContextStore,
  setContextData: React.Dispatch<React.SetStateAction<TContextStore>>,
  params: Params,
  getIndex: (params: Params) => IndexableContextStoreKey<TContextStore>,
  state: Stateful["state"],
  action?: (
    params: Params
  ) => Promise<Partial<IndexableContextStoreValue<TContextStore>> | null>
): Promise<IndexableContextStoreValue<TContextStore>> {
  // Handle preload scenario
  const index = getIndex(params);
  const value = action ? await action(params) : null;

  return new Promise((resolve) => {
    setContextData((contextData) => {
      const newStore = getUpdatedContextDataForUpdateOne(
        contextData,
        index,
        value,
        state
      );
      resolve(newStore.data[index]);
      return newStore;
    });
  });
}

export function getUpdatedContextDataForUpdateOne<
  TContextStore extends IndexableContextStore<any>
>(
  store: TContextStore,
  index: IndexableContextStoreKey<TContextStore>,
  value: null | Partial<IndexableContextStoreValue<TContextStore>>,
  state: keyof typeof statefulStates
): TContextStore {
  const { data } = store;
  const oldValue: IndexableContextStoreValue<TContextStore> = store.data[index];
  if (oldValue == null) {
    throw new Error(errorMessages.indexNotFound);
  }
  const newValue: IndexableContextStoreValue<TContextStore> = {
    ...oldValue,
    ...value,
  };
  // Handle array updates
  if (Array.isArray(data)) {
    const newData: Array<IndexableContextStoreValue<TContextStore>> = [...data];
    // @ts-expect-error
    newData.splice(index, 1, newValue);
    return {
      ...store,
      data: newData,
      state: state,
    };
  } else {
    const newData = {
      ...data,
      [index]: newValue,
    };
    return {
      ...store,
      data: newData,
      state: state,
    };
  }
}
