import React, { PropsWithChildren } from "react";

import {
  ContextStore,
  IndexableStatefulContextStore,
  getNotImplementedPromise,
  useIndexableStatefulContextStore,
} from "../../../index";

export type Item = {
  id: number;
  name: string;
};

type contextStoreDataArray = Array<ContextStore<Item>>;

export type ReplaceAllParams = contextStoreDataArray;
export type UpdateOneParams = Partial<Item> & Pick<Item, "id">;
export type CreateOneParams = Item;
export type DeleteOneParams = Pick<Item, "id">;
export interface ContextValue extends ContextStore<contextStoreDataArray> {
  createOne: (params: CreateOneParams) => Promise<Item>;
  deleteOne: (params: DeleteOneParams) => Promise<Item>;
  replaceAll: (params: ReplaceAllParams) => Promise<contextStoreDataArray>;
  updateOne: (params: UpdateOneParams) => Promise<Item>;
}

const defaultValue: ContextValue = {
  createOne: getNotImplementedPromise,
  data: [],
  deleteOne: getNotImplementedPromise,
  replaceAll: getNotImplementedPromise,
  state: "unsent",
  updateOne: getNotImplementedPromise,
};

export const Context = React.createContext(defaultValue);
export type ProviderProps = PropsWithChildren<{}>;

export function ApiProvider(props: ProviderProps) {
  const { children } = props;
  const [
    contextValue,
    {
      useCreateOneFactory,
      useDeleteOneFactory,
      useUpdateFactory,
      useUpdateOneFactory,
    },
  ] = useIndexableStatefulContextStore<ContextValue>(defaultValue);

  const replaceAll = useUpdateFactory({
    action: (params: ReplaceAllParams) => {
      const newValue = [...params];
      return Promise.resolve(newValue);
    },
  });

  const createOne = useCreateOneFactory({
    action: (params: CreateOneParams) => {
      return Promise.resolve({
        ...params,
      });
    },
    getIndex: (params: CreateOneParams) => {
      return contextValue.data.length;
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
        return item.data.id === params.id;
      });
    },
  });

  const deleteOne = useDeleteOneFactory({
    action: (params: DeleteOneParams) => {
      return Promise.resolve(null);
    },
    getIndex: (params: DeleteOneParams) => {
      return contextValue.data.findIndex((item) => {
        return item.data.id === params.id;
      });
    },
  });

  return (
    <Context.Provider
      value={{ ...contextValue, replaceAll, updateOne, createOne, deleteOne }}
    >
      {children}
    </Context.Provider>
  );
}
