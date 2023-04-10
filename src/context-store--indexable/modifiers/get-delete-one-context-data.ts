import { Stateful, errorMessages, statefulStates } from "../../shared";
import { IndexableContextStore, IndexableContextStoreKey, IndexableContextStoreValue } from "../interfaces";

import { getUpdatedContextDataForUpdateOne } from "./get-update-one-context-data";

export async function getDeleteOneContextData<Params, TContextStore extends IndexableContextStore<any>>(
  contextDataAtTimeOfExecution: TContextStore,
  setContextData: React.Dispatch<React.SetStateAction<TContextStore>>,
  params: Params,
  dataHandlers: {
    action: (params: Params) => Promise<null | Partial<IndexableContextStoreValue<TContextStore>>>;
    error?: (params: Params) => Promise<null | IndexableContextStoreValue<TContextStore>>;
    getIndex: (params: Params) => IndexableContextStoreKey<TContextStore>;
    preload?: (params: Params) => Promise<null | Partial<IndexableContextStoreValue<TContextStore>>>;
  }
): Promise<IndexableContextStoreValue<TContextStore>> {
  const { action, error, getIndex, preload } = dataHandlers;

  // If the index doesn't exist, nothing to do
  const index = getIndex(params);
  const oldData = contextDataAtTimeOfExecution.data[index];
  if (oldData == null) {
    return Promise.reject(errorMessages.indexNotFound);
  }

  try {
    // Handle preload
    await setContextDataForDeleteOne(setContextData, params, getIndex, statefulStates.loading, preload, false);

    // Handle action
    await setContextDataForDeleteOne(setContextData, params, getIndex, statefulStates.success, action, true);

    return Promise.resolve(oldData);
  } catch (e) {
    try {
      await setContextDataForDeleteOne(setContextData, params, getIndex, statefulStates.error, error, false);
      if (typeof e === "string") {
        return Promise.reject(e);
      } else if (e instanceof Error) {
        return Promise.reject(e.message);
      } else {
        return Promise.reject(errorMessages.unknownPreloadOrActionReject);
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

async function setContextDataForDeleteOne<Params, TContextStore extends IndexableContextStore<unknown>>(
  setContextData: React.Dispatch<React.SetStateAction<TContextStore>>,
  params: Params,
  getIndex: (params: Params) => IndexableContextStoreKey<TContextStore>,
  state: Stateful["state"],
  action?: (params: Params) => Promise<null | Partial<IndexableContextStoreValue<TContextStore>>>,
  deleteIfActionUndefined: boolean = true
) {
  // Handle preload scenario
  const index = getIndex(params);
  const newValue = action ? await action(params) : null;

  setContextData((contextData) => {
    const oldValue = contextData.data[index];
    let value = newValue;
    if (action == null) {
      value = deleteIfActionUndefined ? null : oldValue;
    } else {
      value = newValue ?? null;
    }
    const newStore = getUpdatedContextDataForDeleteOne(contextData, index, value, state);
    return newStore;
  });
}

function getUpdatedContextDataForDeleteOne<TContextStore extends IndexableContextStore<unknown>>(
  store: TContextStore,
  index: IndexableContextStoreKey<TContextStore>,
  value: null | Partial<IndexableContextStoreValue<TContextStore>>,
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
    delete newData[index];
    return {
      ...store,
      data: newData,
      state,
    };
  }
}
