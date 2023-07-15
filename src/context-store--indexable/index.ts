import { useCallback, useState } from "react";
import { ContextStoreData } from "../context-store--basic/interfaces.js";
import { getReplaceContextData } from "../context-store--basic/modifiers/index.js";
import { IndexableContextStore, IndexableContextStoreKey, IndexableContextStoreValue } from "./interfaces.js";
import { getCreateOneContextData, getDeleteOneContextData, getUpdateOneContextData } from "./modifiers/index.js";

export { IndexableContextStore };

export function useIndexableContextStore<TContextStore extends IndexableContextStore<any>>(
  defaultValue: TContextStore,
) {
  const [contextData, setContextData] = useState(defaultValue);

  const useUpdateFactory = <Params = void>(
    dataHandlers: {
      action?: (params: Params) => Promise<ContextStoreData<TContextStore>>;
      error?: (params: Params) => Promise<ContextStoreData<TContextStore>>;
      preload?: (params: Params) => Promise<ContextStoreData<TContextStore>>;
    },
    deps: React.DependencyList = [],
  ) => {
    return useCallback(
      async (params: Params) => {
        return await getReplaceContextData(contextData, setContextData, params, dataHandlers);
      },
      [contextData, setContextData, ...deps],
    );
  };

  const useCreateOneFactory = <Params = void>(
    dataHandlers: {
      action: (params: Params) => Promise<IndexableContextStoreValue<TContextStore>>;
      error?: (params: Params) => Promise<null | IndexableContextStoreValue<TContextStore>>;
      getIndex: (params: Params) => IndexableContextStoreKey<TContextStore>;
      preload?: (params: Params) => Promise<IndexableContextStoreValue<TContextStore>>;
    },
    deps: React.DependencyList = [],
  ) => {
    return useCallback(
      async (params: Params) => {
        return await getCreateOneContextData(contextData, setContextData, params, dataHandlers);
      },
      [contextData, setContextData, ...deps],
    );
  };

  const useUpdateOneFactory = <Params = void>(
    dataHandlers: {
      action: (params: Params) => Promise<Partial<IndexableContextStoreValue<TContextStore>>>;
      error?: (params: Params) => Promise<null | Partial<IndexableContextStoreValue<TContextStore>>>;
      getIndex: (params: Params) => IndexableContextStoreKey<TContextStore>;
      preload?: (params: Params) => Promise<Partial<IndexableContextStoreValue<TContextStore>>>;
    },
    deps: React.DependencyList = [],
  ) => {
    return useCallback(
      async (params: Params) => {
        return await getUpdateOneContextData(contextData, setContextData, params, dataHandlers);
      },
      [contextData, setContextData, ...deps],
    );
  };

  const useDeleteOneFactory = <Params = void>(
    dataHandlers: {
      action: (params: Params) => Promise<null | IndexableContextStoreValue<TContextStore>>;
      error?: (params: Params) => Promise<null | IndexableContextStoreValue<TContextStore>>;
      getIndex: (params: Params) => IndexableContextStoreKey<TContextStore>;
      preload?: (params: Params) => Promise<IndexableContextStoreValue<TContextStore>>;
    },
    deps: React.DependencyList = [],
  ) => {
    return useCallback(
      async (params: Params) => {
        return await getDeleteOneContextData(contextData, setContextData, params, dataHandlers);
      },
      [contextData, setContextData, ...deps],
    );
  };

  return [
    contextData,
    {
      setContextData,
      useCreateOneFactory,
      useDeleteOneFactory,
      useUpdateFactory,
      useUpdateOneFactory,
    },
  ] as const;
}
