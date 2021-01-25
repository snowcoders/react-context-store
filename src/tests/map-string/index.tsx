import React, { PropsWithChildren, useState } from "react";

import {
  ContextStore,
  getNotImplementedPromise,
  useCreateOneContextData,
  useDeleteOneContextData,
  useUpdateAllContextData,
  useUpdateOneContextData,
} from "../../index";

export type ContextValueData = Record<string, Item>;
export type Item = {
  id: keyof ContextValueData;
  name: string;
};

export type ReplaceAllParams = ContextValueData;
export type CreateOneParams = Item;
export type UpdateOneParams = Partial<Item> & Pick<Item, "id">;
export type DeleteOneParams = Pick<Item, "id">;
export interface ContextValue extends ContextStore<ContextValueData> {
  rejectId: Item["id"];
  createOne: (params: CreateOneParams) => Promise<Item>;
  deleteOne: (params: DeleteOneParams) => Promise<Item>;
  replaceAll: (params: ReplaceAllParams) => Promise<ContextValueData>;
  updateOne: (params: UpdateOneParams) => Promise<Item>;
}

const defaultValue: ContextValue = {
  createOne: getNotImplementedPromise,
  data: {},
  deleteOne: getNotImplementedPromise,
  rejectId: "187",
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
      const newValue = { ...params };
      return Promise.resolve(newValue);
    },
  });

  const createOne = useCreateOneContextData(contextValue, setContextValue, {
    action: (params: CreateOneParams) => {
      if (params.id === contextValue.rejectId) {
        return Promise.reject("Force reject due to id");
      }
      return Promise.resolve({
        ...params,
      });
    },
    getIndex: (params: CreateOneParams) => {
      return params.id;
    },
  });

  const updateOne = useUpdateOneContextData(contextValue, setContextValue, {
    action: (params: UpdateOneParams) => {
      if (params.id === contextValue.rejectId) {
        return Promise.reject("Force reject due to id");
      }
      return Promise.resolve({
        ...params,
      });
    },
    getIndex: (params: UpdateOneParams) => {
      return params.id;
    },
  });

  const deleteOne = useDeleteOneContextData(contextValue, setContextValue, {
    action: (params: DeleteOneParams) => {
      if (params.id === contextValue.rejectId) {
        return Promise.reject("Force reject due to id");
      }
      return Promise.resolve(null);
    },
    getIndex: (params: DeleteOneParams) => {
      return params.id;
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
