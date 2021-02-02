import { useCallback, useState } from "react";
import {
  ContextStore,
  getCreateOneContextData,
  getDeleteOneContextData,
  getNotImplementedPromise,
  getReplaceContextData,
  getUpdateOneContextData,
} from "./modifiers";

export { ContextStore, getNotImplementedPromise };

export function useContextStore<
  TContextStore extends ContextStore<any>,
  TData = TContextStore["data"]
>(defaultValue: TContextStore) {
  const [contextData, setContextData] = useState(defaultValue);

  const useReplaceFactory = <Params,>(dataHandlers: {
    action?: (params: Params) => Promise<TData>;
    error?: (params: Params) => Promise<TData>;
    preaction?: (params: Params) => Promise<TData>;
  }) => {
    return useCallback(
      async (params: Params) => {
        return await getReplaceContextData(
          contextData,
          setContextData,
          params,
          dataHandlers
        );
      },
      [contextData, setContextData]
    );
  };

  return [contextData, { useReplaceFactory, setContextData }] as const;
}

export function useIndexableContextStore<
  TContextStore extends ContextStore<TIndexableData>,
  TIndexableData = TContextStore["data"],
  TIndexableDataItem = TContextStore["data"][any]
>(defaultValue: TContextStore) {
  const [contextData, setContextData] = useState(defaultValue);

  const useReplaceFactory = <Params,>(dataHandlers: {
    action?: (params: Params) => Promise<TIndexableData>;
    error?: (params: Params) => Promise<TIndexableData>;
    preaction?: (params: Params) => Promise<TIndexableData>;
  }) => {
    return useCallback(
      async (params: Params) => {
        return await getReplaceContextData(
          contextData,
          setContextData,
          params,
          dataHandlers
        );
      },
      [contextData, setContextData]
    );
  };

  const useCreateOneFactory = <Params,>(dataHandlers: {
    action: (params: Params) => Promise<TIndexableDataItem>;
    error?: (params: Params) => Promise<TIndexableDataItem | null>;
    getIndex: (params: Params) => keyof TContextStore["data"];
    preaction?: (params: Params) => Promise<TIndexableDataItem>;
  }) => {
    return useCallback(
      async (params: Params) => {
        return await getCreateOneContextData(
          contextData,
          setContextData,
          params,
          dataHandlers
        );
      },
      [contextData, setContextData]
    );
  };

  const useUpdateOneFactory = <Params,>(dataHandlers: {
    action: (params: Params) => Promise<Partial<TIndexableDataItem>>;
    error?: (params: Params) => Promise<Partial<TIndexableDataItem>>;
    getIndex: (params: Params) => keyof TIndexableData;
    preaction?: (params: Params) => Promise<Partial<TIndexableDataItem>>;
  }) => {
    return useCallback(
      async (params: Params) => {
        return await getUpdateOneContextData(
          contextData,
          setContextData,
          params,
          dataHandlers
        );
      },
      [contextData, setContextData]
    );
  };

  const useDeleteOneFactory = <Params,>(dataHandlers: {
    action: (params: Params) => Promise<null>;
    error?: (params: Params) => Promise<Partial<TIndexableDataItem>>;
    getIndex: (params: Params) => keyof TIndexableData;
    preaction?: (params: Params) => Promise<Partial<TIndexableDataItem>>;
  }) => {
    return useCallback(
      async (params: Params) => {
        return await getDeleteOneContextData(
          contextData,
          setContextData,
          params,
          dataHandlers
        );
      },
      [contextData, setContextData]
    );
  };

  return [
    contextData,
    {
      useReplaceFactory,
      useUpdateOneFactory,
      useCreateOneFactory,
      useDeleteOneFactory,
      setContextData,
    },
  ] as const;
}
