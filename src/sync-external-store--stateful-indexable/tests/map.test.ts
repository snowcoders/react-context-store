import { afterEach, beforeEach, describe, it, jest } from "@jest/globals";
import { ExampleMapStore } from "./map.store.js";

it("initalizes", async () => {
  // Arrange
  const store = new ExampleMapStore({
    data: {
      1: {
        data: {
          id: 1,
          loadTime: new Date().toISOString(),
          value: "Item from initialization",
        },
        error: null,
        state: "success",
      },
    },
    error: null,
    state: "unset",
  });

  // Act

  // Assert
  const { data } = store.getSnapshot();
  expect(data[1]).toBeTruthy();
  expect(data[1]["data"]).toMatchObject({
    id: 1,
    loadTime: expect.stringContaining("Z"),
    value: "Item from initialization",
  });
});

it("changes value on get", async () => {
  // Arrange
  const loadTime = new Date(2023).toISOString();
  const store = new ExampleMapStore({
    data: {
      1: {
        data: {
          id: 1,
          loadTime: loadTime,
          value: "Item from initialization",
        },
        error: null,
        state: "success",
      },
    },
    error: null,
    state: "unset",
  });

  // Act
  await store.get({ id: 1 });

  // Assert
  const snapshot = store.getSnapshot();
  expect(snapshot).toMatchObject({
    data: {
      1: {
        data: {
          id: 1,
          loadTime: expect.not.stringMatching(loadTime),
          value: "Get - 1",
        },
        error: null,
        state: "success",
      },
    },
    error: null,
    state: "unset",
  });
});

it("changes value on post", async () => {
  // Arrange
  const loadTime = new Date(2023).toISOString();
  const store = new ExampleMapStore({
    data: {
      1: {
        data: {
          id: 1,
          loadTime: loadTime,
          value: "Item from initialization",
        },
        error: null,
        state: "success",
      },
    },
    error: null,
    state: "unset",
  });

  // Act
  await store.post({ value: "Post - 2" });

  // Assert
  const snapshot = store.getSnapshot();
  expect(snapshot).toMatchObject({
    data: {
      1: {
        data: {
          id: 1,
          loadTime: loadTime,
          value: "Item from initialization",
        },
        error: null,
        state: "success",
      },
      2: {
        data: {
          id: 2,
          loadTime: expect.not.stringMatching(loadTime),
          value: "Post - 2",
        },
        error: null,
        state: "success",
      },
    },
    error: null,
    state: "success",
  });
});

it("deletes an item", async () => {
  // Arrange
  const store = new ExampleMapStore({
    data: {
      1: {
        data: {
          id: 1,
          loadTime: new Date().toISOString(),
          value: "Item from initialization",
        },
        error: null,
        state: "success",
      },
    },
    error: null,
    state: "unset",
  });

  // Act
  await store.delete({ id: 1 });

  // Assert
  const { data } = store.getSnapshot();
  expect(data[1]).toBeUndefined();
});
