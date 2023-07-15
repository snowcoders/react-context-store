import React, { PropsWithChildren } from "react";

import { ContextStore, getNotImplementedPromise, useIndexableContextStore } from "../../../index";

export type Item = {
  id: number;
  name: string;
};

type contextStoreDataArray = Array<Item>;

export type ReplaceAllParams = contextStoreDataArray;
export type UpdateOneParams = Partial<Item> & Pick<Item, "id">;
export type PushOneParams = Item;
export type DeleteOneParams = Pick<Item, "id">;
export interface ContextValue extends ContextStore<contextStoreDataArray> {
  deleteOne: (params: DeleteOneParams) => Promise<Item>;
  pushOne: (params: PushOneParams) => Promise<Item>;
  replaceAll: (params: ReplaceAllParams) => Promise<contextStoreDataArray>;
  unshiftOne: (params: PushOneParams) => Promise<Item>;
  updateOne: (params: UpdateOneParams) => Promise<Item>;
}

const defaultValue: ContextValue = {
  data: [],
  deleteOne: getNotImplementedPromise,
  pushOne: getNotImplementedPromise,
  replaceAll: getNotImplementedPromise,
  state: "unsent",
  unshiftOne: getNotImplementedPromise,
  updateOne: getNotImplementedPromise,
};

export const Context = React.createContext(defaultValue);
export type ProviderProps = PropsWithChildren<{}>;

export function ApiProvider(props: ProviderProps) {
  const { children } = props;
  const [contextValue, { useCreateOneFactory, useDeleteOneFactory, useUpdateFactory, useUpdateOneFactory }] =
    useIndexableContextStore(defaultValue);

  const replaceAll = useUpdateFactory({
    action: (params: ReplaceAllParams) => {
      const newValue = [...params];
      return Promise.resolve(newValue);
    },
  });

  const pushOne = useCreateOneFactory({
    action: (params: PushOneParams) => {
      return Promise.resolve({
        ...params,
      });
    },
    getIndex: (params: PushOneParams) => {
      return contextValue.data.length;
    },
  });

  const unshiftOne = useCreateOneFactory({
    action: (params: PushOneParams) => {
      return Promise.resolve({
        ...params,
      });
    },
    getIndex: (params: PushOneParams) => {
      return 0;
    },
  });

  const updateOne = useUpdateOneFactory({
    action: async (params: UpdateOneParams) => {
      return {
        ...params,
      };
    },
    getIndex: (params: UpdateOneParams) => {
      return contextValue.data.findIndex((item) => {
        return item.id === params.id;
      });
    },
  });

  const deleteOne = useDeleteOneFactory({
    action: (params: DeleteOneParams) => {
      return Promise.resolve(null);
    },
    getIndex: (params: DeleteOneParams) => {
      return contextValue.data.findIndex((item) => {
        return item.id === params.id;
      });
    },
  });

  return (
    <Context.Provider
      value={{
        ...contextValue,
        replaceAll,
        updateOne,
        pushOne,
        deleteOne,
        unshiftOne,
      }}
    >
      {children}
    </Context.Provider>
  );
}
