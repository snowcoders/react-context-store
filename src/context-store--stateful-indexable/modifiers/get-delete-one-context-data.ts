import { ContextStoreData } from "../../context-store--basic/interfaces";
import { errorMessages, Stateful, statefulStates } from "../../shared";
import {
  IndexableStatefulContextStore,
  IndexableStatefulContextStoreValueData,
  IndexableStatefulContextStoreKey,
  IndexableStatefulContextStoreValue,
} from "../interfaces";
import {
  setContextDataForUpdateOne,
  getUpdatedContextDataForUpdateOne,
} from "./get-update-one-context-data";

export async function getDeleteOneContextData<
  Params,
  TContextStore extends IndexableStatefulContextStore<unknown>
>(
  contextData: TContextStore,
  setContextData: React.Dispatch<React.SetStateAction<TContextStore>>,
  params: Params,
  dataHandlers: {
    action: (params: Params) => Promise<unknown>;
    error?: (
      params: Params
    ) => Promise<IndexableStatefulContextStoreValueData<TContextStore> | null>;
    getIndex: (
      params: Params
    ) => IndexableStatefulContextStoreKey<TContextStore>;
    preload?: (
      params: Params
    ) => Promise<Partial<
      IndexableStatefulContextStoreValueData<TContextStore>
    > | null>;
  }
): Promise<IndexableStatefulContextStoreValueData<TContextStore>> {
  const { action, error, getIndex, preload } = dataHandlers;
  let value: null | IndexableStatefulContextStoreValueData<TContextStore> = null;

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
      return Promise.reject(errorMessages.actionReturnedNull);
    } else {
      return Promise.resolve(value);
    }
  } catch (e) {
    try {
      value = await setContextDataForUpdateOne(
        contextData,
        setContextData,
        params,
        getIndex,
        statefulStates.error,
        error
      );
      if (typeof e === "string") {
        return Promise.reject(e);
      } else {
        throw e;
      }
    } catch (e2) {
      await setContextDataForUpdateOne(
        contextData,
        setContextData,
        params,
        getIndex,
        statefulStates.error
      );
      return Promise.reject(e2.message || errorMessages.errorCallbackRejected);
    }
  }
}

export async function setContextDataForDeleteOne<
  Params,
  TContextStore extends IndexableStatefulContextStore<unknown>
>(
  contextData: TContextStore,
  setContextData: React.Dispatch<React.SetStateAction<TContextStore>>,
  params: Params,
  getIndex: (params: Params) => IndexableStatefulContextStoreKey<TContextStore>,
  state: Stateful["state"],
  action?: (
    params: Params
  ) => Promise<IndexableStatefulContextStoreValueData<TContextStore> | null>,
  deleteIfNull: boolean = true
) {
  try {
    // Handle preload scenario
    const index = getIndex(params);
    const oldValue: IndexableStatefulContextStoreValueData<TContextStore> =
      // @ts-expect-error
      contextData.data[index].data;
    const defaultValue = deleteIfNull ? null : oldValue;
    const value = action ? await action(params) : defaultValue;
    // Handle data updates
    if (value != null) {
      const newStore = getUpdatedContextDataForUpdateOne(
        contextData,
        index,
        value,
        state
      );
      setContextData(newStore);
      // @ts-expect-error
      return newStore.data[index].data;
    } else {
      const newStore = getUpdatedContextDataForDeleteOne(contextData, index);
      setContextData(newStore);
      return oldValue;
    }
  } catch (e) {
    if (typeof e === "string") {
      return Promise.reject(e);
    }
    return Promise.reject(
      e?.message || errorMessages.unknownPreloadOrActionReject
    );
  }
}

export function getUpdatedContextDataForDeleteOne<
  TContextStore extends IndexableStatefulContextStore<unknown>
>(
  store: TContextStore,
  index: IndexableStatefulContextStoreKey<TContextStore>
): TContextStore {
  const { data } = store;
  // Handle array updates
  if (Array.isArray(data)) {
    const newData: Array<
      IndexableStatefulContextStoreValueData<TContextStore>
    > = [...data];
    // @ts-expect-error
    newData.splice(index, 1);
    return {
      ...store,
      data: newData,
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
    };
  }
}
