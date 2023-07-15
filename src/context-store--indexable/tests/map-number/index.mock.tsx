import React, { PropsWithChildren } from "react";
import { ContextStore, getNotImplementedPromise, useIndexableContextStore } from "../../../index.js";

export type Item = {
  id: number;
  name: string;
};

export type ContextValueData = { [id: number]: Item };

export type ReplaceAllParams = ContextValueData;
export type CreateOneParams = Item;
export type UpdateOneParams = Partial<Item> & Pick<Item, "id">;
export interface ContextValue extends ContextStore<ContextValueData> {
  createOne: (params: CreateOneParams) => Promise<Item>;
  replaceAll: (params: ReplaceAllParams) => Promise<ContextValueData>;
  updateOne: (params: UpdateOneParams) => Promise<Item>;
}

const defaultValue: ContextValue = {
  createOne: getNotImplementedPromise,
  data: {},
  replaceAll: getNotImplementedPromise,
  state: "unsent",
  updateOne: getNotImplementedPromise,
};

export const Context = React.createContext(defaultValue);
export type ProviderProps = PropsWithChildren<Record<string, never>>;

export function ApiProvider(props: ProviderProps) {
  const { children } = props;
  const [contextValue, setContextValue] = useIndexableContextStore(defaultValue);

  const replaceAll = setContextValue.useUpdateFactory({
    action: (params: ReplaceAllParams) => {
      const newValue = { ...params };
      return Promise.resolve(newValue);
    },
  });

  const updateOne = setContextValue.useUpdateOneFactory({
    action: (params: UpdateOneParams) => {
      return Promise.resolve({
        ...params,
      });
    },
    getIndex: (params: UpdateOneParams) => {
      return params.id;
    },
  });

  const createOne = setContextValue.useCreateOneFactory({
    action: (params: CreateOneParams) => {
      return Promise.resolve({
        ...params,
      });
    },
    getIndex: (params: CreateOneParams) => {
      return params.id;
    },
  });

  return <Context.Provider value={{ ...contextValue, replaceAll, updateOne, createOne }}>{children}</Context.Provider>;
}
