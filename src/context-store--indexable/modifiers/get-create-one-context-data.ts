import { errorMessages, Stateful, statefulStates } from "../../shared";
import {
  IndexableContextStore,
  IndexableContextStoreValue,
  IndexableContextStoreKey,
} from "../interfaces";

export async function getCreateOneContextData<
  Params,
  TContextStore extends IndexableContextStore<any>
>(
  contextData: TContextStore,
  setContextData: React.Dispatch<React.SetStateAction<TContextStore>>,
  params: Params,
  dataHandlers: {
    action: (
      params: Params
    ) => Promise<IndexableContextStoreValue<TContextStore>>;
    error?: (
      params: Params
    ) => Promise<IndexableContextStoreValue<TContextStore> | null>;
    getIndex: (params: Params) => IndexableContextStoreKey<TContextStore>;
    preload?: (
      params: Params
    ) => Promise<IndexableContextStoreValue<TContextStore>>;
  }
): Promise<IndexableContextStoreValue<TContextStore>> {
  const { action, error, getIndex, preload } = dataHandlers;
  let value: null | IndexableContextStoreValue<TContextStore> = null;

  try {
    // Handle preload
    value =
      (await setContextDataForCreateOne(
        contextData,
        setContextData,
        params,
        getIndex,
        statefulStates.loading,
        preload
      )) ?? value;

    // Handle action
    value =
      (await setContextDataForCreateOne(
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
    try {
      value = await setContextDataForCreateOne(
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
      setContextData({
        ...contextData,
        state: statefulStates.error,
      });
      return Promise.reject(errorMessages.errorCallbackRejected);
    }
  }
}

export async function setContextDataForCreateOne<
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
  ) => Promise<IndexableContextStoreValue<TContextStore>>
) {
  // Handle preload scenario
  const index = getIndex(params);
  const value = action ? await action(params) : null;
  setContextData(
    getUpdatedContextDataForCreateOne(contextData, index, value, state)
  );
  return value;
}

export function getUpdatedContextDataForCreateOne<
  TContextStore extends IndexableContextStore<unknown>
>(
  store: TContextStore,
  index: IndexableContextStoreKey<TContextStore>,
  value: null | IndexableContextStoreValue<TContextStore>,
  state: keyof typeof statefulStates
): TContextStore {
  const { data } = store;
  if (value == null) {
    return {
      ...store,
      state: state,
    };
  }
  const newValue = value;
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
