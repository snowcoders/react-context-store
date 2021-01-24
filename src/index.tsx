import { useCallback } from "react";

export interface Stateful {
  state: "error" | "loading" | "success" | "unsent";
}

export interface ContextStore<T> extends Stateful {
  data: T;
}

export const getNotImplementedPromise = () => Promise.reject("Not Implemented");

export function useUpdateAllContextData<
  Params,
  TData,
  T extends ContextStore<TData>
>(
  contextData: T,
  setContextData: React.Dispatch<React.SetStateAction<T>>,
  dataHandlers: {
    action?: (params: Params) => Promise<TData>;
    error?: (params: Params) => Promise<TData>;
    preaction?: (params: Params) => Promise<TData>;
  },
  deps: React.DependencyList = []
): (params: Params) => Promise<TData> {
  return useCallback(
    async (params: Params) => {
      const { action, error, preaction } = dataHandlers;

      try {
        // Handle preaction scenario
        let value = preaction ? await preaction(params) : contextData.data;
        setContextData({
          ...contextData,
          data: value,
          state: "loading",
        });

        // Handle action
        value = action ? await action(params) : contextData.data;
        setContextData({
          ...contextData,
          data: value,
          state: "success",
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
            state: "error",
          });
          return Promise.resolve(errorValue);
        }
      }
    },
    [...deps, contextData, setContextData]
  );
}

export function useCreateOneContextData<
  Params,
  TData,
  T extends ContextStore<TMap>,
  TMap = { [key: number]: TData } | { [key: string]: TData }
>(
  contextData: T,
  setContextData: React.Dispatch<React.SetStateAction<T>>,
  dataHandlers: {
    action: (params: Params) => Promise<TData>;
    error?: (params: Params) => Promise<TData>;
    getIndex: (params: Params) => keyof TMap;
    preaction?: (params: Params) => Promise<TData>;
  },
  deps: React.DependencyList = []
): (params: Params) => Promise<TData> {
  return useCallback(
    async (params: Params) => {
      const { action, error, getIndex, preaction } = dataHandlers;
      let value: null | TData = null;

      try {
        // Handle preaction
        value =
          (await setContextDataForCreateOne(
            contextData,
            setContextData,
            params,
            getIndex,
            "loading",
            preaction
          )) ?? value;

        // Handle action
        value =
          (await setContextDataForCreateOne(
            contextData,
            setContextData,
            params,
            getIndex,
            "success",
            action
          )) ?? value;

        if (value == null) {
          return Promise.reject("action response was nullish");
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
            "error",
            error
          );
          if (value == null) {
            return Promise.reject("error response was nullish");
          } else {
            return Promise.resolve(value);
          }
        } finally {
          setContextData({
            ...contextData,
            state: "error",
          });
          return Promise.reject(
            "useUpdateOneContextData error callback should never reject"
          );
        }
      }
    },
    [...deps, contextData, setContextData]
  );
}

async function setContextDataForCreateOne<
  Params,
  TData,
  T extends ContextStore<TMap>,
  TMap = { [key: number]: TData } | { [key: string]: TData }
>(
  contextData: T,
  setContextData: React.Dispatch<React.SetStateAction<T>>,
  params: Params,
  getIndex: (params: Params) => keyof TMap,
  state: Stateful["state"],
  action?: (params: Params) => Promise<TData>
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
  TData,
  TMap = { [key: number]: TData } | { [key: string]: TData }
>(data: TMap, index: keyof TMap, value: null | TData): TMap {
  if (value == null) {
    return data;
  }
  // Handle array updates
  if (Array.isArray(data) && typeof index === "number") {
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
export function useUpdateOneContextData<
  Params,
  TData,
  T extends ContextStore<TMap>,
  TMap = { [key: number]: TData } | { [key: string]: TData }
>(
  contextData: T,
  setContextData: React.Dispatch<React.SetStateAction<T>>,
  dataHandlers: {
    action: (params: Params) => Promise<Partial<TData>>;
    error?: (params: Params) => Promise<Partial<TData>>;
    getIndex: (params: Params) => keyof TMap;
    preaction?: (params: Params) => Promise<Partial<TData>>;
  },
  deps: React.DependencyList = []
): (params: Params) => Promise<TData> {
  return useCallback(
    async (params: Params) => {
      const { action, error, getIndex, preaction } = dataHandlers;
      let value: null | TData = null;

      try {
        // Handle preaction
        value =
          (await setContextDataForUpdateOne(
            contextData,
            setContextData,
            params,
            getIndex,
            "loading",
            preaction
          )) ?? value;

        // Handle action
        value =
          (await setContextDataForUpdateOne(
            contextData,
            setContextData,
            params,
            getIndex,
            "success",
            action
          )) ?? value;

        if (value == null) {
          return Promise.reject("action response was nullish");
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
            "error",
            error
          );
          if (value == null) {
            return Promise.reject("error response was nullish");
          } else {
            return Promise.resolve(value);
          }
        } finally {
          setContextData({
            ...contextData,
            state: "error",
          });
          return Promise.reject(
            "useUpdateOneContextData error callback should never reject"
          );
        }
      }
    },
    [...deps, contextData, setContextData]
  );
}

async function setContextDataForUpdateOne<
  Params,
  TData,
  T extends ContextStore<TMap>,
  TMap = { [key: number]: TData } | { [key: string]: TData }
>(
  contextData: T,
  setContextData: React.Dispatch<React.SetStateAction<T>>,
  params: Params,
  getIndex: (params: Params) => keyof TMap,
  state: Stateful["state"],
  action?: (params: Params) => Promise<Partial<TData>>
): Promise<TData> {
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
  // @ts-expect-error - Our internal typing isn't fantastic
  return newData[index];
}

function getUpdatedContextDataForUpdateOne<
  TData,
  TMap = { [key: number]: TData } | { [key: string]: TData }
>(data: TMap, index: keyof TMap, value: null | TData): TMap {
  if (value == null) {
    return data;
  }
  // Handle array updates
  if (Array.isArray(data) && typeof index === "number") {
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

export function useDeleteOneContextData<
  Params,
  T extends ContextStore<TMap>,
  TData = T["data"][any],
  TMap = { [key: number]: TData } | { [key: string]: TData }
>(
  contextData: T,
  setContextData: React.Dispatch<React.SetStateAction<T>>,
  dataHandlers: {
    action: (params: Params) => Promise<null>;
    error?: (params: Params) => Promise<Partial<TData>>;
    getIndex: (params: Params) => keyof TMap;
    preaction?: (params: Params) => Promise<Partial<TData>>;
  },
  deps: React.DependencyList = []
): (params: Params) => Promise<TData> {
  return useCallback(
    async (params: Params) => {
      const { action, error, getIndex, preaction } = dataHandlers;
      let value: null | TData = null;

      try {
        // Handle preaction
        value =
          (await setContextDataForDeleteOne(
            contextData,
            setContextData,
            params,
            getIndex,
            "loading",
            preaction
          )) ?? value;

        // Handle action
        value =
          (await setContextDataForDeleteOne(
            contextData,
            setContextData,
            params,
            getIndex,
            "success",
            action
          )) ?? value;

        if (value == null) {
          return Promise.reject("action response was nullish");
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
            "error",
            error
          );
          if (value == null) {
            return Promise.reject("error response was nullish");
          } else {
            return Promise.resolve(value);
          }
        } finally {
          setContextData({
            ...contextData,
            state: "error",
          });
          return Promise.reject(
            "useDeleteOneContextData error callback should never reject"
          );
        }
      }
    },
    [...deps, contextData, setContextData]
  );
}

async function setContextDataForDeleteOne<
  Params,
  TData,
  T extends ContextStore<TMap>,
  TMap = { [key: number]: TData } | { [key: string]: TData }
>(
  contextData: T,
  setContextData: React.Dispatch<React.SetStateAction<T>>,
  params: Params,
  getIndex: (params: Params) => keyof TMap,
  state: Stateful["state"],
  action?: (params: Params) => Promise<Partial<TData>>
): Promise<TData> {
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
  TData,
  TMap = { [key: number]: TData } | { [key: string]: TData }
>(data: TMap, index: keyof TMap): TMap {
  // Handle array updates
  if (Array.isArray(data) && typeof index === "number") {
    const newData = [...data];
    // @ts-ignore
    newData.splice(index, 1);
    // @ts-ignore
    return newData;
  } else {
    const newData = {
      ...data,
    };
    delete newData[index];
    return newData;
  }
}
