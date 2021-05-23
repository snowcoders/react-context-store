import { useCallback, useState } from "react";
import { ContextStoreData } from "../context-store--basic/interfaces";
import { getReplaceContextData } from "../context-store--basic/modifiers";
import {
  IndexableContextStore,
  IndexableContextStoreKey,
  IndexableContextStoreValue,
} from "./interfaces";
import {
  getCreateOneContextData,
  getDeleteOneContextData,
  getUpdateOneContextData,
} from "./modifiers";

export { IndexableContextStore };

export function useIndexableContextStore<
  TContextStore extends IndexableContextStore<any>
>(defaultValue: TContextStore) {
  const [contextData, setContextData] = useState(defaultValue);

  const useUpdateFactory = <Params = void>(
    dataHandlers: {
      action?: (params: Params) => Promise<ContextStoreData<TContextStore>>;
      error?: (params: Params) => Promise<ContextStoreData<TContextStore>>;
      preload?: (params: Params) => Promise<ContextStoreData<TContextStore>>;
    },
    deps: React.DependencyList = []
  ) => {
    return useCallback(
      async (params: Params) => {
        return await getReplaceContextData(
          contextData,
          setContextData,
          params,
          dataHandlers
        );
      },
      [contextData, setContextData, ...deps]
    );
  };

  const useCreateOneFactory = <Params = void>(
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
    },
    deps: React.DependencyList = []
  ) => {
    return useCallback(
      async (params: Params) => {
        return await getCreateOneContextData(
          contextData,
          setContextData,
          params,
          dataHandlers
        );
      },
      [contextData, setContextData, ...deps]
    );
  };

  const useUpdateOneFactory = <Params = void>(
    dataHandlers: {
      action: (
        params: Params
      ) => Promise<Partial<IndexableContextStoreValue<TContextStore>>>;
      error?: (
        params: Params
      ) => Promise<Partial<IndexableContextStoreValue<TContextStore>> | null>;
      getIndex: (params: Params) => IndexableContextStoreKey<TContextStore>;
      preload?: (
        params: Params
      ) => Promise<Partial<IndexableContextStoreValue<TContextStore>>>;
    },
    deps: React.DependencyList = []
  ) => {
    return useCallback(
      async (params: Params) => {
        return await getUpdateOneContextData(
          contextData,
          setContextData,
          params,
          dataHandlers
        );
      },
      [contextData, setContextData, ...deps]
    );
  };

  const useDeleteOneFactory = <Params = void>(
    dataHandlers: {
      action: (params: Params) => Promise<unknown>;
      error?: (
        params: Params
      ) => Promise<IndexableContextStoreValue<TContextStore> | null>;
      getIndex: (params: Params) => IndexableContextStoreKey<TContextStore>;
      preload?: (
        params: Params
      ) => Promise<IndexableContextStoreValue<TContextStore>>;
    },
    deps: React.DependencyList = []
  ) => {
    return useCallback(
      async (params: Params) => {
        return await getDeleteOneContextData(
          contextData,
          setContextData,
          params,
          dataHandlers
        );
      },
      [contextData, setContextData, ...deps]
    );
  };

  return [
    contextData,
    {
      useUpdateFactory,
      useUpdateOneFactory,
      useCreateOneFactory,
      useDeleteOneFactory,
      setContextData,
    },
  ] as const;
}
