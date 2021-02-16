import { errorMessages, Stateful, statefulStates } from "../../shared";
import {
  IndexableContextStore,
  IndexableContextStoreKey,
  IndexableContextStoreValue,
} from "../interfaces";

import { getUpdatedContextDataForUpdateOne } from "./get-update-one-context-data";

export async function getDeleteOneContextData<
  Params,
  TContextStore extends IndexableContextStore<any>
>(
  contextData: TContextStore,
  setContextData: React.Dispatch<React.SetStateAction<TContextStore>>,
  params: Params,
  dataHandlers: {
    action: (params: Params) => Promise<unknown>;
    error?: (
      params: Params
    ) => Promise<IndexableContextStoreValue<TContextStore> | null>;
    getIndex: (params: Params) => IndexableContextStoreKey<TContextStore>;
    preload?: (
      params: Params
    ) => Promise<Partial<IndexableContextStoreValue<TContextStore>> | null>;
  }
): Promise<IndexableContextStoreValue<TContextStore>> {
  const { action, error, getIndex, preload } = dataHandlers;
  let value: null | IndexableContextStoreValue<TContextStore> = null;

  try {
    // Handle preload
    value =
      (await setContextDataForDeleteOne(
        contextData,
        setContextData,
        params,
        getIndex,
        statefulStates.loading,
        preload,
        false
      )) ?? value;

    // Handle action
    value =
      (await setContextDataForDeleteOne(
        contextData,
        setContextData,
        params,
        getIndex,
        statefulStates.success,
        action
      )) ?? value;

    if (value == null) {
      return Promise.reject(errorMessages.indexNotFound);
    } else {
      return Promise.resolve(value);
    }
  } catch (e) {
    try {
      value = await setContextDataForDeleteOne(
        contextData,
        setContextData,
        params,
        getIndex,
        statefulStates.error,
        error,
        false
      );
      if (value == null) {
        return Promise.reject(errorMessages.indexNotFound);
      } else if (typeof e === "string") {
        return Promise.reject(e);
      } else {
        return Promise.reject(
          e.message || errorMessages.unknownPreloadOrActionReject
        );
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

export async function setContextDataForDeleteOne<
  Params,
  TContextStore extends IndexableContextStore<unknown>
>(
  contextData: TContextStore,
  setContextData: React.Dispatch<React.SetStateAction<TContextStore>>,
  params: Params,
  getIndex: (params: Params) => IndexableContextStoreKey<TContextStore>,
  state: Stateful["state"],
  action?: (
    params: Params
  ) => Promise<IndexableContextStoreValue<TContextStore> | null>,
  deleteIfNull: boolean = true
) {
  // Handle preload scenario
  const index = getIndex(params);
  const oldValue = contextData.data[index];
  const defaultValue = deleteIfNull ? null : oldValue;
  const value = action ? await action(params) : defaultValue;
  const newStore = getUpdatedContextDataForDeleteOne(
    contextData,
    index,
    value,
    state
  );
  setContextData(newStore);
  return oldValue;
}

export function getUpdatedContextDataForDeleteOne<
  TContextStore extends IndexableContextStore<unknown>
>(
  store: TContextStore,
  index: IndexableContextStoreKey<TContextStore>,
  value: null | IndexableContextStoreValue<TContextStore>,
  state: keyof typeof statefulStates
): TContextStore {
  if (value != null) {
    return getUpdatedContextDataForUpdateOne(store, index, value, state);
  }

  const { data } = store;
  // Handle array updates
  if (Array.isArray(data)) {
    const newData: Array<IndexableContextStoreValue<TContextStore>> = [...data];
    // @ts-expect-error
    newData.splice(index, 1);
    return {
      ...store,
      data: newData,
      state,
    };
  } else {
    const newData = {
      ...data,
    };
    // @ts-expect-error
    delete newData[index];
    return {
      ...store,
      data: newData,
      state,
    };
  }
}
