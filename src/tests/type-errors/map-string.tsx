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
  createOne: (params: CreateOneParams) => Promise<Item>;
  deleteOne: (params: DeleteOneParams) => Promise<Item>;
  replaceAll: (params: ReplaceAllParams) => Promise<ContextValueData>;
  updateOne: (params: UpdateOneParams) => Promise<Item>;
}

const defaultValue: ContextValue = {
  createOne: getNotImplementedPromise,
  data: {},
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
      const newValue = { ...params };
      return Promise.resolve(newValue);
    },
  });

  const createOne = useCreateOneContextData(contextValue, setContextValue, {
    // TODO @ts-expect-error - "doesNotExist" isn't part of Item
    action: (params: CreateOneParams) => {
      return Promise.resolve({
        ...params,
        // TODO - "doesNotExist" isn't part of Item
        doesNotExist: "asdfasdf",
      });
    },
    // @ts-expect-error - key is a string not a number
    getIndex: (params: CreateOneParams) => {
      return 123;
    },
  });

  const updateOne = useUpdateOneContextData(contextValue, setContextValue, {
    // TODO @ts-expect-error - "doesNotExist" isn't part of Item
    action: (params: UpdateOneParams) => {
      return Promise.resolve({
        ...params,
        doesNotExist: "asdfasdf",
      });
    },
    // @ts-expect-error - key is a string not a number
    getIndex: (params: UpdateOneParams) => {
      return 123;
    },
  });

  const deleteOne = useDeleteOneContextData(contextValue, setContextValue, {
    action: (params: DeleteOneParams) => {
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
