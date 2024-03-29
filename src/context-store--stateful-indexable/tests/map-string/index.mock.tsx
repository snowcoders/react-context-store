import React, { PropsWithChildren } from "react";

import { ContextStore, getNotImplementedPromise, useIndexableStatefulContextStore } from "../../../index.js";

export type ContextValueData = Record<string, ContextStore<Item>>;
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
export type ProviderProps = PropsWithChildren<Record<string, never>>;

export function ApiProvider(props: ProviderProps) {
  const { children } = props;
  const [contextValue, modifiers] = useIndexableStatefulContextStore(defaultValue);

  const replaceAll = modifiers.useUpdateFactory({
    action: (params: ReplaceAllParams) => {
      const newValue = { ...params };
      return Promise.resolve(newValue);
    },
  });

  const createOne = modifiers.useCreateOneFactory({
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

  const updateOne = modifiers.useUpdateOneFactory({
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

  const deleteOne = modifiers.useDeleteOneFactory({
    action: (params: DeleteOneParams) => {
      if (params.id === contextValue.rejectId) {
        return Promise.reject("Force reject due to id");
      }
      return Promise.resolve();
    },
    getIndex: (params: DeleteOneParams) => {
      return params.id;
    },
  });

  return (
    <Context.Provider value={{ ...contextValue, replaceAll, updateOne, createOne, deleteOne }}>
      {children}
    </Context.Provider>
  );
}
