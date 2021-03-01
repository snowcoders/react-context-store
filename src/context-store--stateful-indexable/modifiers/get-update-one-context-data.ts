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
  } catch (e1) {
    try {
      value = await setContextDataForUpdateOne(
        contextData,
        setContextData,
        params,
        getIndex,
        statefulStates.error,
        error
      );
      if (typeof e1 === "string") {
        return Promise.reject(e1);
      } else {
        return Promise.reject(
          e1.message || errorMessages.unknownPreloadOrActionReject
        );
      }
    } catch (e2) {
      setContextData((contextData) => {
        return {
          ...contextData,
          state: statefulStates.error,
        };
      });
      if (typeof e2 === "string") {
        return Promise.reject(e2);
      }
      return Promise.reject(errorMessages.unknownPreloadOrActionReject);
    }
  }
}

export async function setContextDataForUpdateOne<
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
  ) => Promise<Partial<
    IndexableStatefulContextStoreValueData<TContextStore>
  > | null>
) {
  try {
    // Handle preload scenario
    const index = getIndex(params);
    const value = action ? await action(params) : null;

    const newStore = await new Promise<TContextStore>((resolve, reject) => {
      setContextData((contextData) => {
        try {
          const newStore = getUpdatedContextDataForUpdateOne(
            contextData,
            index,
            value,
            state
          );
          resolve(newStore);
          return newStore;
        } catch (e) {
          reject(e);
          return contextData;
        }
      });
    });
    const d = newStore.data;
    let a: IndexableStatefulContextStoreValue<TContextStore> =
      // @ts-expect-error
      d[index];
    return a.data;
  } catch (e) {
    return Promise.reject(
      e?.message || errorMessages.unknownPreloadOrActionReject
    );
  }
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
  if (oldValue == null) {
    throw new Error(errorMessages.indexNotFound);
  }
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
