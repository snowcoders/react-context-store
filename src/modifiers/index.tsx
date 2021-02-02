const statefulStates = {
  error: "error",
  loading: "loading",
  success: "success",
  unsent: "unsent",
} as const;
export interface Stateful {
  state: keyof typeof statefulStates;
}

export interface ContextStore<TData> extends Stateful {
  data: TData;
}

// Helper type for when data is an indexable type (map or array)
type ContextStoreIndexableData<TIndexableDataItem> =
  | { [key: number]: TIndexableDataItem }
  | { [key: string]: TIndexableDataItem };

export const getNotImplementedPromise = () => Promise.reject("Not Implemented");

export async function getReplaceContextData<
  Params,
  TData,
  TContextStore extends ContextStore<TData>
>(
  contextData: TContextStore,
  setContextData: React.Dispatch<React.SetStateAction<TContextStore>>,
  params: Params,
  dataHandlers: {
    action?: (params: Params) => Promise<TData>;
    error?: (params: Params) => Promise<TData>;
    preaction?: (params: Params) => Promise<TData>;
  }
): Promise<TData> {
  const { action, error, preaction } = dataHandlers;

  try {
    // Handle preaction scenario
    let value = preaction ? await preaction(params) : contextData.data;
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
    } finally {
      setContextData({
        ...contextData,
        data: errorValue,
        state: statefulStates.error,
      });
      return Promise.resolve(errorValue);
    }
  }
}

export async function getCreateOneContextData<
  Params,
  TContextStore extends ContextStore<TIndexableData>,
  TIndexableData = TContextStore["data"],
  TIndexableDataItem = TContextStore["data"][any]
>(
  contextData: TContextStore,
  setContextData: React.Dispatch<React.SetStateAction<TContextStore>>,
  params: Params,
  dataHandlers: {
    action: (params: Params) => Promise<TIndexableDataItem>;
    error?: (params: Params) => Promise<TIndexableDataItem | null>;
    getIndex: (params: Params) => keyof TContextStore["data"];
    preaction?: (params: Params) => Promise<TIndexableDataItem>;
  }
): Promise<TIndexableDataItem> {
  const { action, error, getIndex, preaction } = dataHandlers;
  let value: null | TIndexableDataItem = null;

  try {
    // Handle preaction
    value =
      (await setContextDataForCreateOne(
        contextData,
        setContextData,
        params,
        getIndex,
        statefulStates.loading,
        preaction
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
      return Promise.reject("action did not create value");
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
        return Promise.reject("index not found");
      } else {
        return Promise.resolve(value);
      }
    } catch {
      setContextData({
        ...contextData,
        state: statefulStates.error,
      });
      return Promise.reject("error callback should never reject");
    }
  }
}

async function setContextDataForCreateOne<
  Params,
  TContextStore extends ContextStore<TIndexableData>,
  TIndexableData = TContextStore["data"],
  TIndexableDataItem = TContextStore["data"][any]
>(
  contextData: TContextStore,
  setContextData: React.Dispatch<React.SetStateAction<TContextStore>>,
  params: Params,
  getIndex: (params: Params) => keyof TIndexableData,
  state: Stateful["state"],
  action?: (params: Params) => Promise<TIndexableDataItem>
) {
  // Handle preaction scenario
  const index = getIndex(params);
  const value = action ? await action(params) : null;
  setContextData({
    ...contextData,
    data: getUpdatedContextDataForCreateOne(contextData.data, index, value),
    state: state,
  });
  return value;
}

function getUpdatedContextDataForCreateOne<
  TContextStore extends ContextStore<TIndexableData>,
  TIndexableData = TContextStore["data"],
  TIndexableDataItem = TContextStore["data"][any]
>(
  data: TIndexableData,
  index: keyof TIndexableData,
  value: null | TIndexableDataItem
): TIndexableData {
  if (value == null) {
    return data;
  }
  // Handle array updates
  if (Array.isArray(data)) {
    const newData = [...data];
    // @ts-ignore
    newData.splice(index, 1, value);
    // @ts-ignore
    return newData;
  } else {
    const newData = {
      ...data,
      [index]: value,
    };
    return newData;
  }
}
export async function getUpdateOneContextData<
  Params,
  TContextStore extends ContextStore<TIndexableData>,
  TIndexableData = TContextStore["data"],
  TIndexableDataItem = TContextStore["data"][any],
  TUpdateDataItem = Partial<TIndexableDataItem>
>(
  contextData: TContextStore,
  setContextData: React.Dispatch<React.SetStateAction<TContextStore>>,
  params: Params,
  dataHandlers: {
    action: (params: Params) => Promise<TUpdateDataItem>;
    error?: (params: Params) => Promise<Partial<TIndexableDataItem>>;
    getIndex: (params: Params) => keyof TIndexableData;
    preaction?: (params: Params) => Promise<Partial<TIndexableDataItem>>;
  }
): Promise<TIndexableDataItem> {
  const { action, error, getIndex, preaction } = dataHandlers;
  let value: null | TIndexableDataItem = null;

  try {
    // Handle preaction
    value =
      (await setContextDataForUpdateOne(
        contextData,
        setContextData,
        params,
        getIndex,
        statefulStates.loading,
        preaction
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
      return Promise.reject("index not found");
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
      if (value == null) {
        return Promise.reject("index not found");
      } else {
        return Promise.resolve(value);
      }
    } catch {
      setContextData({
        ...contextData,
        state: statefulStates.error,
      });
      return Promise.reject("error callback should never reject");
    }
  }
}

async function setContextDataForUpdateOne<
  Params,
  TContextStore extends ContextStore<TIndexableData>,
  TIndexableData = TContextStore["data"],
  TIndexableDataItem = TContextStore["data"][any],
  TUpdateDataItem = Partial<TIndexableDataItem>
>(
  contextData: TContextStore,
  setContextData: React.Dispatch<React.SetStateAction<TContextStore>>,
  params: Params,
  getIndex: (params: Params) => keyof TIndexableData,
  state: Stateful["state"],
  action?: (params: Params) => Promise<TUpdateDataItem>
): Promise<TIndexableDataItem> {
  // Handle preaction scenario
  const index = getIndex(params);
  const value = action ? await action(params) : null;
  const newData = getUpdatedContextDataForUpdateOne(
    contextData.data,
    index,
    value
  );
  setContextData({
    ...contextData,
    data: newData,
    state: state,
  });
  // @ts-ignore Our internal types don't seem to be fantastic
  return newData[index];
}

function getUpdatedContextDataForUpdateOne<
  TIndexableDataItem,
  TIndexableData = ContextStoreIndexableData<TIndexableDataItem>
>(
  data: TIndexableData,
  index: keyof TIndexableData,
  partialUpdates: null | Partial<TIndexableDataItem>
): TIndexableData {
  if (partialUpdates == null) {
    return data;
  }
  // Handle array updates
  if (Array.isArray(data)) {
    // @ts-ignore - get as Any so we don't have to ts-ignore the rest of the lines
    const newData = [...data] as any;
    const oldValue = data[index];
    if (oldValue == null) {
      throw new Error("index not found");
    }
    newData.splice(index, 1, { ...oldValue, ...partialUpdates });
    return newData;
  } else {
    const oldValue = data[index];
    if (oldValue == null) {
      throw new Error("index not found");
    }
    const newData = {
      ...data,
      [index]: { ...oldValue, ...partialUpdates },
    };
    return newData;
  }
}

export async function getDeleteOneContextData<
  Params,
  TContextStore extends ContextStore<TIndexableData>,
  TIndexableData = TContextStore["data"],
  TIndexableDataItem = TContextStore["data"][any]
>(
  contextData: TContextStore,
  setContextData: React.Dispatch<React.SetStateAction<TContextStore>>,
  params: Params,
  dataHandlers: {
    action: (params: Params) => Promise<null>;
    error?: (params: Params) => Promise<Partial<TIndexableDataItem>>;
    getIndex: (params: Params) => keyof TIndexableData;
    preaction?: (params: Params) => Promise<Partial<TIndexableDataItem>>;
  },
  deps: React.DependencyList = []
): Promise<TIndexableDataItem> {
  const { action, error, getIndex, preaction } = dataHandlers;
  let value: null | TIndexableDataItem = null;

  try {
    // Handle preaction
    value =
      (await setContextDataForDeleteOne(
        contextData,
        setContextData,
        params,
        getIndex,
        statefulStates.loading,
        preaction
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
      return Promise.reject("index not found");
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
        error
      );
      if (value == null) {
        return Promise.reject("index not found");
      } else {
        return Promise.resolve(value);
      }
    } catch {
      setContextData({
        ...contextData,
        state: statefulStates.error,
      });
      return Promise.reject("error callback should never reject");
    }
  }
}

async function setContextDataForDeleteOne<
  Params,
  TContextStore extends ContextStore<TIndexableData>,
  TIndexableData = TContextStore["data"],
  TIndexableDataItem = TContextStore["data"][any]
>(
  contextData: TContextStore,
  setContextData: React.Dispatch<React.SetStateAction<TContextStore>>,
  params: Params,
  getIndex: (params: Params) => keyof TIndexableData,
  state: Stateful["state"],
  action?: (params: Params) => Promise<Partial<TIndexableDataItem>>
): Promise<TIndexableDataItem> {
  // Handle preaction scenario
  const index = getIndex(params);
  if (action) {
    await action(params);
    const newData = getDeletedContextDataForDeleteOne(contextData.data, index);
    setContextData({
      ...contextData,
      data: newData,
      state: state,
    });
  }
  // @ts-expect-error - Our internal typing isn't fantastic
  return contextData.data[index];
}

function getDeletedContextDataForDeleteOne<
  TIndexableDataItem,
  TIndexableData = ContextStoreIndexableData<TIndexableDataItem>
>(data: TIndexableData, index: keyof TIndexableData): TIndexableData {
  // Handle array updates
  if (Array.isArray(data)) {
    const oldValue = data[index];
    if (oldValue == null) {
      throw new Error("index not found");
    }

    const newData = [...data];
    // @ts-ignore
    newData.splice(index, 1);
    // @ts-ignore
    return newData;
  } else {
    const oldValue = data[index];
    if (oldValue == null) {
      throw new Error("index not found");
    }

    const newData = {
      ...data,
    };
    delete newData[index];
    return newData;
  }
}
