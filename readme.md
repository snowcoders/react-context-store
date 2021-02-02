# React context store

A two way binding mechanism that uses React context as a storage machanism.

For small to medium sized apps I found redux to be a bit heavy for what it achieved. In reality, most of the time I want to create a simple website that blocks the form submit as a network call is being processed.

## Basic usage

The following documentation has been copied out of a test case. If you find that it's not working, please check the test case. This example is an array but you can also use maps, or store a non-indexable type.

First create the context store

```javascript
import React, { PropsWithChildren } from "react";

import {
  ContextStore,
  useIndexableContextStore,
  getNotImplementedPromise,
} from "@tesla/react-context-store";

export type Item = {
  id: number,
  name: string,
};

type ContextStoreDataArray = Array<Item>;

export type GetAllParams = ContextStoreDataArray;
export interface ContextValue extends ContextStore<ContextStoreDataArray> {
  getAll: (params: GetAllParams) => Promise<ContextStoreDataArray>;
}

const defaultValue: ContextValue = {
  data: [],
  getAll: getNotImplementedPromise,
  state: "unsent",
};

export const Context = React.createContext(defaultValue);
export type ApiProviderProps = PropsWithChildren<{}>;

export function ApiProvider(props: ApiProviderProps) {
  const { children } = props;
  const [
    contextValue,
    {
      useReplaceFactory,
      useUpdateOneFactory,
      useCreateOneFactory,
      useDeleteOneFactory,
    },
  ] = useIndexableContextStore(defaultValue);

  const getAll = useReplaceFactory({
    action: (params: GetAllParams) => {
      return await fetchList(params);
    },
  });

  return (
    <Context.Provider
      value={{ ...contextValue, getAll }}
    >
      {children}
    </Context.Provider>
  );
}
```

Somewhere in your app, setup the shared provider

```javascript
import { ApiProvider, Context } from "../context";
import { List } from "./component";

export function App() {
  return (
    <ApiProvider>
      <List />
    </ApiProvider>
  );
}
```

And finally consume the context

```javascript
import { ApiProvider, Context } from "../context";

export function List() {
  const { data, getAll, state } = useContext(Context);

  useEffect(() => {
    getAll();
  });

  switch (state) {
    case "error":
      return <div>Oh no!</div>;
    case "success":
      return (
        <div>
          <ul>
            {data.map((item) => {
              const { id, name } = item;
              return <li key={id}>{name}</li>;
            })}
          </ul>
        </div>
      );
    default:
      return <div>Loading</div>;
  }
}
```

For more examples, take a look at our extensive testing suite.

## API

There are two types of store hooks both of which return the current store contents and the available modifiers.

- useContextStore - For non-indexable stores like objects and primatives
- useIndexableContextStore - For indexable stores like maps or arrays

Both come with the following modifiers:

- useReplaceFactory - Used to modify all the values in the store at once. Useful for getAll, deleteAll, modifyAll, etc.
- setContextData - Used to create custom modifiers if for some reason you don't like ours.

They also have the same states:

- unsent - No modifier has acted upon the data
- loading - The modifier has been invoked but the action hasn't completed yet
- success - The action was successful and the data has been updated
- error - The action failed

The `useIndexableContextStore` has an additional update methods that affect individual items each of which have their own state:

- useUpdateOneFactory - Used to create an updater which modifies an existing entry - PUT calls
- useCreateOneFactory - Used to create a creator which creates a new entry - GET and POST calls.
- useDeleteOneFactory - Used to create a deletor which removes an entry - DELETE call
