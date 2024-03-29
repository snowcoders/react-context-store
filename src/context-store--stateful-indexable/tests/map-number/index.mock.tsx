import React, { PropsWithChildren } from "react";
import { ContextStore, getNotImplementedPromise, useIndexableStatefulContextStore } from "../../../index.js";

export type Item = {
  id: number;
  name: string;
};

export type ContextValueData = { [id: number]: ContextStore<Item> };

export type ReplaceAllParams = ContextValueData;
export type UpdateOneParams = Partial<Item> & Pick<Item, "id">;
export interface ContextValue extends ContextStore<ContextValueData> {
  replaceAll: (params: ReplaceAllParams) => Promise<ContextValueData>;
  updateOne: (params: UpdateOneParams) => Promise<Item>;
  // TODO: add delete and create
}

const defaultValue: ContextValue = {
  data: {},
  replaceAll: getNotImplementedPromise,
  state: "unsent",
  updateOne: getNotImplementedPromise,
};

export const Context = React.createContext(defaultValue);
export type ProviderProps = PropsWithChildren<Record<string, never>>;

export function ApiProvider(props: ProviderProps) {
  const { children } = props;
  const [contextValue, setContextValue] = useIndexableStatefulContextStore(defaultValue);

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

  return <Context.Provider value={{ ...contextValue, replaceAll, updateOne }}>{children}</Context.Provider>;
}
