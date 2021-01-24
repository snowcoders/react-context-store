import React, { PropsWithChildren, useEffect, useState } from "react";

import {
  ContextStore,
  getNotImplementedPromise,
  useUpdateAllContextData,
} from "../../index";

export type Item = {
  id: 0;
  name: string;
};

export type ChangeNameParams = { newName: string };
export interface ContextValue extends ContextStore<Item> {
  changeName: (params: ChangeNameParams) => Promise<Item>;
}

const defaultValue: ContextValue = {
  changeName: getNotImplementedPromise,
  data: {
    id: 0,
    name: "name",
  },
  state: "unsent",
};

export const Context = React.createContext(defaultValue);
export type ProviderProps = PropsWithChildren<{}>;

export function ApiProvider(props: ProviderProps) {
  const { children } = props;
  const [contextValue, setContextValue] = useState(defaultValue);

  const up = useUpdateAllContextData(contextValue, setContextValue, {
    action: (params: ChangeNameParams) => {
      const { newName } = params;
      const newValue = { ...contextValue.data, name: newName };
      return Promise.resolve(newValue);
    },
  });

  return (
    <Context.Provider value={{ ...contextValue, changeName: up }}>
      {children}
    </Context.Provider>
  );
}
