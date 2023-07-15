import { useCallback, useState } from "react";
import { ContextStoreData } from "../context-store--basic/interfaces.js";
import { getReplaceContextData } from "../context-store--basic/modifiers/index.js";

import {
  IndexableStatefulContextStore,
  IndexableStatefulContextStoreKey,
  IndexableStatefulContextStoreValueData,
} from "./interfaces.js";
import { getCreateOneContextData, getDeleteOneContextData, getUpdateOneContextData } from "./modifiers/index.js";

export { IndexableStatefulContextStore };

export function useIndexableStatefulContextStore<TContextStore extends IndexableStatefulContextStore<unknown>>(
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
      action: (params: Params) => Promise<IndexableStatefulContextStoreValueData<TContextStore>>;
      error?: (params: Params) => Promise<null | IndexableStatefulContextStoreValueData<TContextStore>>;
      getIndex: (params: Params) => IndexableStatefulContextStoreKey<TContextStore>;
      preload?: (params: Params) => Promise<IndexableStatefulContextStoreValueData<TContextStore>>;
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
      action: (params: Params) => Promise<Partial<IndexableStatefulContextStoreValueData<TContextStore>>>;
      error?: (params: Params) => Promise<null | Partial<IndexableStatefulContextStoreValueData<TContextStore>>>;
      getIndex: (params: Params) => IndexableStatefulContextStoreKey<TContextStore>;
      preload?: (params: Params) => Promise<Partial<IndexableStatefulContextStoreValueData<TContextStore>>>;
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
      action: (params: Params) => Promise<unknown>;
      error?: (params: Params) => Promise<null | IndexableStatefulContextStoreValueData<TContextStore>>;
      getIndex: (params: Params) => IndexableStatefulContextStoreKey<TContextStore>;
      preload?: (params: Params) => Promise<IndexableStatefulContextStoreValueData<TContextStore>>;
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
