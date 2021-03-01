import { errorMessages, Stateful, statefulStates } from "../../shared";
import {
  IndexableStatefulContextStore,
  IndexableStatefulContextStoreValue,
  IndexableStatefulContextStoreValueData,
  IndexableStatefulContextStoreKey,
} from "../interfaces";

export async function getUpdateOneContextData<
  Params,
  TContextStore extends IndexableStatefulContextStore<unknown>
>(
  contextData: TContextStore,
  setContextData: React.Dispatch<React.SetStateAction<TContextStore>>,
  params: Params,
  dataHandlers: {
    action: (
      params: Params
    ) => Promise<
      Partial<IndexableStatefulContextStoreValueData<TContextStore>>
    >;
    error?: (
      params: Params
    ) => Promise<Partial<
      IndexableStatefulContextStoreValueData<TContextStore>
    > | null>;
    getIndex: (
      params: Params
    ) => IndexableStatefulContextStoreKey<TContextStore>;
    preload?: (
      params: Params
    ) => Promise<
      Partial<IndexableStatefulContextStoreValueData<TContextStore>>
    >;
  }
): Promise<IndexableStatefulContextStoreValueData<TContextStore>> {
  const { action, error, getIndex, preload } = dataHandlers;
  let value: null | IndexableStatefulContextStoreValueData<TContextStore> = null;

  // If the index doesn't exist, nothing to do
  const index = getIndex(params);
  // @ts-expect-error
  const oldData = contextData.data[index];
  if (oldData == null) {
    return Promise.reject(errorMessages.indexNotFound);
  }

  try {
    // Handle preload
    value =
      (await setContextDataForUpdateOne(
        setContextData,
        params,
        getIndex,
        statefulStates.loading,
        preload
      )) ?? value;

    // Handle action
    value =
      (await setContextDataForUpdateOne(
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
        setContextData,
        params,
        getIndex,
        statefulStates.error,
        error
      );
      if (typeof e === "string") {
        return Promise.reject(e);
      } else {
        return Promise.reject(
          e.message || errorMessages.unknownPreloadOrActionReject
        );
      }
    } catch {
      setContextData((contextData) => {
        return {
          ...contextData,
          state: statefulStates.error,
        };
      });
      return Promise.reject(errorMessages.unknownPreloadOrActionReject);
    }
  }
}

export async function setContextDataForUpdateOne<
  Params,
  TContextStore extends IndexableStatefulContextStore<unknown>
>(
  setContextData: React.Dispatch<React.SetStateAction<TContextStore>>,
  params: Params,
  getIndex: (params: Params) => IndexableStatefulContextStoreKey<TContextStore>,
  state: Stateful["state"],
  action?: (
    params: Params
  ) => Promise<Partial<
    IndexableStatefulContextStoreValueData<TContextStore>
  > | null>
) {
  // Handle preload scenario
  const index = getIndex(params);
  const value = action ? await action(params) : null;

  const newStore = await new Promise<TContextStore>((resolve) => {
    setContextData((contextData) => {
      const newStore = getUpdatedContextDataForUpdateOne(
        contextData,
        index,
        value,
        state
      );
      resolve(newStore);
      return newStore;
    });
  });
  const d = newStore.data;
  let a: IndexableStatefulContextStoreValue<TContextStore> =
    // @ts-expect-error
    d[index];
  return a.data;
}

export function getUpdatedContextDataForUpdateOne<
  TContextStore extends IndexableStatefulContextStore<unknown>
>(
  store: TContextStore,
  index: IndexableStatefulContextStoreKey<TContextStore>,
  value: null | Partial<IndexableStatefulContextStoreValueData<TContextStore>>,
  state: keyof typeof statefulStates
): TContextStore {
  const { data } = store;
  const oldValue: IndexableStatefulContextStoreValue<TContextStore> =
    // @ts-expect-error
    data[index];
  const newValue: typeof oldValue = {
    data: {
      // @ts-expect-error - TODO: Actually look into this, I think primitives might be broken
      ...oldValue.data,
      ...value,
    },
    state,
  };
  // Handle array updates
  if (Array.isArray(data)) {
    const newData: Array<
      IndexableStatefulContextStoreValueData<TContextStore>
    > = [...data];
    // @ts-expect-error
    newData.splice(index, 1, newValue);
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
