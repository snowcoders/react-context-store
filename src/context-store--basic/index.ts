import { useCallback, useState } from "react";
import { getNotImplementedPromise } from "../shared";
import { ContextStore, ContextStoreData } from "./interfaces";
import { getReplaceContextData } from "./modifiers";

export { ContextStore, getNotImplementedPromise };

export function useContextStore<TContextStore extends ContextStore<any>>(
  defaultValue: TContextStore
) {
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

  return [contextData, { useUpdateFactory, setContextData }] as const;
}
