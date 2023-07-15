# React context store

React storage helpers that provide structure around useSyncExternalStore or React Context.

For small to medium sized apps I found redux to be a bit heavy for what it achieved. In reality, most of the time I want to create a simple website that blocks the form submit as a network call is being processed.

## Sync External Store API

TL;DR: See [our working example](./src/sync-external-store/example/) of how to use our `SyncExternalStore<T>` base class with `useSyncExternalStore` and how to write cleaner tests with it.

React@18 added `useSyncExternalStore` which instead of storing any complicated state in a `useState`, allowed for the use of a non-React based store and created a simple interface to connect it to React. This means any complex logic of storing state (e.g. async fetch calls) can now get pulled out of React and into a vanilla JS file or package which means cleaner component code! However the main frustration with `useSyncExternalStore` is that you end up writing your `subscribe` logic over and over again. To avoid this duplication, this library provides a `SyncExternalStore<T>` base class to extend upon. Here's an example:

```ts
import { SyncExternalStore } from "react-context-store";

type Item = {
  id: number;
  name: string;
};
type ItemStoreState = {
  state: "NOT_STARTED" | "PENDING" | "COMPLETE";
  data: { [id: string]: Item };
};

class ItemStore extends SyncExternalStore<ItemStoreState> {
  constructor() {
    super({
      state: "NOT_STARTED",
      data: {},
    });
  }

  getAll = async () => {
    this.updateSnapshot((prevSnapshot) => ({
      ...prevSnapshot,
      state: "PENDING",
    }));

    const response = await fetch("GET");
    const json = await response.json();

    this.updateSnapshot((prevSnapshot) => ({
      ...prevSnapshot,
      state: "COMPLETE",
      data: json,
    }));
  };
}

export const itemStore = new ItemStore();
```

Now to use this in a component, all you need is useSyncExternalStore:

```tsx
import { itemStore } from "../stores/item-store.js";

export const Items = () => {
  const snapshot = React.useSyncExternalStore(...itemStore.getSyncExternalStoreParameters());
  const { state, data } = snapshot;

  const onRefresh = () => {
    itemStore.getAll();
  };

  return (
    <div>
      <h1>Items</h1>
      <ul>
        {Object.keys(data).map((key) => {
          const item = data[key];
          const { id, name } = item;
          return <li key={id}>{name}</li>;
        })}
      </ul>
      <button onClick={onRefresh} type="button">
        Refresh
      </button>
    </div>
  );
};
```

### Okay so what?

So why is this awesome? Because you can now get all the non-React state out of the React compnoents making the components more stateless than ever before! Further you can have a single store supplying data to multiple components without the heavy connecting of redux. All this means the component unit tests easier to write:

```tsx
import { beforeEach, describe, it, jest } from "@jest/globals";
import { act, render } from "@testing-library/react";
import React from "react";

// 1. Mock the external store
const getSnapshot = jest.fn();
const getAll = jest.fn();
jest.unstable_mockModule("../stores/item-store.js", () => {
  return {
    mockStore: {
      getAll,
      getSyncExternalStoreParameters: () => [
        // subscribe
        () => () => {},
        // snapshot
        getSnapshot,
      ],
    },
  };
});

// 2. Import the component that uses the external store
const { Items } = await import("./items.js");

beforeEach(() => {
  jest.resetAllMocks();
});

// 3. Test render of different snapshot data
describe("rendering snapshot data", () => {
  // test only the rendering of the snapshot, no callbacks as the component can be entirely stateless now
});

// 4. Test actions get triggered, not that the snapshot updated based off the action
describe("callbacks to store", () => {
  // Even better, when doing callbacks that perform actions on the store, you don't need to test the entire
  // render cycle, just that the callback was sent with expected arguments. If you wanted to test
  // that the snapshot was rendered correctly, you'd be in step #3.
});
```

See [our working example](./src/sync-external-store/example/) for a running example of a store, component, and test

## Context Store API (deprecated)

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

### Example usage

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
export type ProviderProps = PropsWithChildren<Record<string, never>>;

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
