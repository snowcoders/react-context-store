import React, { PropsWithChildren } from "react";

import { ContextStore, getNotImplementedPromise } from "../index";
import { useIndexableStatefulContextStore } from "./index";

export type Item = {
  id: string;
  name: string;
};
export type Map = {
  [key: string]: ContextStore<Item>;
};
export type CreateOneParams = {
  id: string;
};
export interface ContextValue extends ContextStore<Map> {
  createOne: (params: CreateOneParams) => Promise<Item>;
  loadWithError: (params: void) => Promise<Map>;
}

const defaultValue: ContextValue = {
  createOne: getNotImplementedPromise,
  data: {},
  loadWithError: getNotImplementedPromise,
  state: "unsent",
};

export const Context = React.createContext(defaultValue);
export type ProviderProps = PropsWithChildren<{}>;

export const loadWithErrorValue: ContextValue["data"] = {
  [0]: {
    data: {
      id: "0",
      name: "Name 0",
    },
    state: "error",
  },
};

export function ApiProvider(props: ProviderProps) {
  const { children } = props;
  const [contextValue, setContextValue] = useIndexableStatefulContextStore(
    defaultValue
  );

  const loadWithError = setContextValue.useUpdateFactory({
    action: () => {
      return Promise.resolve(loadWithErrorValue);
    },
  });

  const createOne = setContextValue.useCreateOneFactory<CreateOneParams>({
    action: (params) => {
      return Promise.resolve({
        id: params.id,
        name: params.id,
      });
    },
    getIndex: (params) => {
      return params.id;
    },
  });

  return (
    <Context.Provider value={{ ...contextValue, loadWithError, createOne }}>
      {children}
    </Context.Provider>
  );
}
