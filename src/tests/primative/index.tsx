import React, { PropsWithChildren, useEffect, useState } from "react";

import {
  ContextStore,
  getNotImplementedPromise,
  useUpdateAllContextData,
} from "../../index";

export type Item = number;
export interface ContextValue extends ContextStore<Item> {
  oneUp: (params: void) => Promise<Item>;
}

const defaultValue: ContextValue = {
  data: 0,
  oneUp: getNotImplementedPromise,
  state: "unsent",
};

export const Context = React.createContext(defaultValue);
export type ProviderProps = PropsWithChildren<{}>;

export function ApiProvider(props: ProviderProps) {
  const { children } = props;
  const [contextValue, setContextValue] = useState(defaultValue);

  const up = useUpdateAllContextData(contextValue, setContextValue, {
    action: (params: void) => {
      const newValue = contextValue.data + 1;
      return Promise.resolve(newValue);
    },
  });

  return (
    <Context.Provider value={{ ...contextValue, oneUp: up }}>
      {children}
    </Context.Provider>
  );
}
