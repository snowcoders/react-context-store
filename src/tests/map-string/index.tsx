import React, { PropsWithChildren, useEffect, useState } from "react";

import {
  ContextStore,
  getNotImplementedPromise,
  useUpdateAllContextData,
  useUpdateOneContextData,
} from "../../index";

export type Item = {
  id: number;
  name: string;
};

export type ContextValueData = { [id: string]: Item };

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

  const updateOne = useUpdateOneContextData(contextValue, setContextValue, {
    action: (params: UpdateOneParams) => {
      return Promise.resolve({
        ...params,
      });
    },
    getIndex: (params: UpdateOneParams) => {
      return params.id;
    },
  });

  return (
    <Context.Provider value={{ ...contextValue, replaceAll, updateOne }}>
      {children}
    </Context.Provider>
  );
}
