import React, { PropsWithChildren, useEffect, useState } from "react";

import {
  ContextStore,
  getNotImplementedPromise,
  useCreateOneContextData,
  useDeleteOneContextData,
  useUpdateAllContextData,
  useUpdateOneContextData,
} from "../../index";

export type Item = {
  id: number;
  name: string;
};

type ContextValueData = Array<Item>;

export type ReplaceAllParams = ContextValueData;
export type UpdateOneParams = Partial<Item> & Pick<Item, "id">;
export type CreateOneParams = Item;
export type DeleteOneParams = Pick<Item, "id">;
export interface ContextValue extends ContextStore<ContextValueData> {
  createOne: (params: CreateOneParams) => Promise<Item>;
  deleteOne: (params: DeleteOneParams) => Promise<Item>;
  replaceAll: (params: ReplaceAllParams) => Promise<ContextValueData>;
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
  const [contextValue, setContextValue] = useState(defaultValue);

  const replaceAll = useUpdateAllContextData(contextValue, setContextValue, {
    action: (params: ReplaceAllParams) => {
      const newValue = [...params];
      return Promise.resolve(newValue);
    },
  });

  const createOne = useCreateOneContextData(contextValue, setContextValue, {
    action: (params: CreateOneParams) => {
      return Promise.resolve({
        ...params,
      });
    },
    getIndex: (params: CreateOneParams) => {
      return contextValue.data.length;
    },
  });

  const updateOne = useUpdateOneContextData(contextValue, setContextValue, {
    action: (params: UpdateOneParams) => {
      return Promise.resolve({
        ...params,
      });
    },
    getIndex: (params: UpdateOneParams) => {
      return contextValue.data.findIndex((item) => {
        return item.id === params.id;
      });
    },
  });

  const deleteOne = useDeleteOneContextData(contextValue, setContextValue, {
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
      value={{ ...contextValue, replaceAll, updateOne, createOne, deleteOne }}
    >
      {children}
    </Context.Provider>
  );
}
