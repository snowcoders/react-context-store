# React context store

A two way binding mechanism that uses React context as a storage machanism.

For small to medium sized apps I found redux to be a bit heavy for what it achieved. In reality, most of the time I want to create a simple website that blocks the form submit as a network call is being processed.

## API

There are a few types of store hooks both of which return the current store contents and the available modifiers.

- useContextStore - For non-indexable stores like objects and primatives or when you don't need to edit individual elements
- useIndexableContextStore - For indexable stores like maps or arrays with a single loading state at the root
- useIndexableStatefulContextStore - For indexable stores but when you want to maintain separate load states per item than the list of items

All come with some basic modifiers:

- useUpdateFactory - Used to modify all the values in the store at once. Useful for getAll, deleteAll, modifyAll, etc.
- setContextData - Used to create custom modifiers if for some reason you don't like ours.

They also have the same states:

- unsent - No modifier has acted upon the data
- loading - The modifier has been invoked but the action hasn't completed yet
- success - The action was successful and the data has been updated
- error - The action failed

The `useIndexableContextStore` and `useIndexableStatefulContextStore` have additional update factories that allow for creating functions that manipulate individual items:

- useCreateOneFactory - Used to create a new entry - GET and POST calls.
- useDeleteOneFactory - Used to remove an entry - DELETE call
- useUpdateOneFactory - Used to update an existing entry - PUT/PATCH calls

## Example usage

The following documentation has been copied out of a test case. If you find that it's not working, please check the test case. This example is an array but you can also use maps, or store a non-indexable type.

First create the context store

```javascript
import React, { PropsWithChildren } from "react";

import {
  ContextStore,
  getNotImplementedPromise,
  useIndexableContextStore,
} from "react-context-store";

export type Item = {
  id: number,
  name: string,
};

type ContextStoreData = Array<Item>;

export type RefreshAllParams = void;
export interface ContextValue extends ContextStore<ContextStoreData> {
  refreshAll: (params: RefreshAllParams) => Promise<ContextStoreData>;
}

const defaultValue: ContextValue = {
  data: [],
  refreshAll: getNotImplementedPromise,
  state: "unsent",
};

export const Context = React.createContext(defaultValue);
export type ProviderProps = PropsWithChildren<{}>;

export function ApiProvider(props: ProviderProps) {
  const { children } = props;
  const [contextValue, { useUpdateFactory }] = useIndexableContextStore(
    defaultValue
  );

  const refreshAll = useUpdateFactory({
    action: (params: RefreshAllParams) => {
      return fetchResults(params);
    },
  });

  return (
    <Context.Provider
      value={{
        ...contextValue,
        refreshAll,
      }}
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
  const { data, refreshAll, state } = useContext(Context);

  useEffect(() => {
    refreshAll();
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
