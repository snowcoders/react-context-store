import { beforeEach, describe, it, jest } from "@jest/globals";
import { errorMessages } from "../../../shared/index.js";
import { ShallowContextHarness } from "../../../test-utils/harness.js";
import { ApiProvider, Context, Item } from "./index.mock";

describe("replaceAll", () => {
  it("completely rewrites all data", async () => {
    // Setup
    const data1: Array<Item> = [
      {
        id: 0,
        name: "Name 0",
      },
    ];
    const data2: Array<Item> = [
      {
        id: 1,
        name: "Name 1",
      },
      {
        id: 2,
        name: "Name 2",
      },
      {
        id: 3,
        name: "Name 3",
      },
    ];

    // Work
    const harness = new ShallowContextHarness(ApiProvider, Context.Consumer);

    // Verify
    let result = harness.getContextData();
    expect(result.data.length).toBe(0);

    // Work
    await result.replaceAll(data1);
    await harness.waitForAsyncTasks();

    // Verify
    result = harness.getContextData();
    expect(result.data.length).toBe(1);

    // Work
    await result.replaceAll(data2);
    await harness.waitForAsyncTasks();

    // Verify
    result = harness.getContextData();
    expect(result.data.length).toBe(3);
  });
});

describe("updateOne", () => {
  it("only updates one value", async () => {
    // Setup
    const originalData: Array<Item> = [
      {
        id: 1,
        name: "Name 1",
      },
      {
        id: 2,
        name: "Name 2",
      },
      {
        id: 3,
        name: "Name 3",
      },
    ];
    const harness = new ShallowContextHarness(ApiProvider, Context.Consumer);
    let result = harness.getContextData();
    await result.replaceAll(originalData);
    await harness.waitForAsyncTasks();
    result = harness.getContextData();
    expect(result.data.length).toBe(3);

    // Work
    await result.updateOne({
      ...originalData[1],
      name: "New name",
    });
    await harness.waitForAsyncTasks();

    // Verify
    result = harness.getContextData();
    expect(result.data.length).toBe(3);
    expect(result.data[0]).toBe(originalData[0]);
    expect(result.data[1]).not.toBe(originalData[1]);
    expect(result.data[2]).toBe(originalData[2]);
  });

  it("updates two values simultaneously", async () => {
    // Setup
    const originalData: Array<Item> = [
      {
        id: 1,
        name: "Name 1",
      },
      {
        id: 2,
        name: "Name 2",
      },
      {
        id: 3,
        name: "Name 3",
      },
    ];
    const harness = new ShallowContextHarness(ApiProvider, Context.Consumer);
    let result = harness.getContextData();
    await result.replaceAll(originalData);
    await harness.waitForAsyncTasks();
    result = harness.getContextData();
    expect(result.data.length).toBe(3);

    // Work
    await Promise.all([
      result.updateOne({
        ...originalData[1],
        name: "New name 2",
      }),
      result.updateOne({
        ...originalData[2],
        name: "New name 3",
      }),
    ]);
    await harness.waitForAsyncTasks();

    // Verify
    result = harness.getContextData();
    expect(result.data).toMatchObject([
      {
        id: 1,
        name: "Name 1",
      },
      {
        id: 2,
        name: "New name 2",
      },
      {
        id: 3,
        name: "New name 3",
      },
    ]);
  });
});

describe("pushOne", () => {
  it("creates a new entry", async () => {
    // Setup
    const originalData: Array<Item> = [
      {
        id: 1,
        name: "Name 1",
      },
      {
        id: 2,
        name: "Name 2",
      },
      {
        id: 3,
        name: "Name 3",
      },
    ];
    const harness = new ShallowContextHarness(ApiProvider, Context.Consumer);
    let result = harness.getContextData();
    await result.replaceAll(originalData);
    await harness.waitForAsyncTasks();
    result = harness.getContextData();
    expect(result.data.length).toBe(3);

    // Work
    await result.pushOne({
      id: 0,
      name: "New name",
    });
    await harness.waitForAsyncTasks();

    // Verify
    result = harness.getContextData();
    expect(result.data.length).toBe(4);
    expect(result.data[0]).toBe(originalData[0]);
    expect(result.data[1]).toBe(originalData[1]);
    expect(result.data[2]).toBe(originalData[2]);
    expect(result.data[3]).toEqual({
      id: 0,
      name: "New name",
    });
  });
});

describe("unshiftOne", () => {
  it("creates a new entry", async () => {
    // Setup
    const originalData: Array<Item> = [
      {
        id: 1,
        name: "Name 1",
      },
      {
        id: 2,
        name: "Name 2",
      },
      {
        id: 3,
        name: "Name 3",
      },
    ];
    const harness = new ShallowContextHarness(ApiProvider, Context.Consumer);
    let result = harness.getContextData();
    await result.replaceAll(originalData);
    await harness.waitForAsyncTasks();
    result = harness.getContextData();
    expect(result.data.length).toBe(3);

    // Work
    await result.unshiftOne({
      id: 0,
      name: "New name",
    });
    await harness.waitForAsyncTasks();

    // Verify
    result = harness.getContextData();
    expect(result.data.length).toBe(4);
    expect(result.data[0]).toEqual({
      id: 0,
      name: "New name",
    });
    expect(result.data[1]).toBe(originalData[0]);
    expect(result.data[2]).toBe(originalData[1]);
    expect(result.data[3]).toBe(originalData[2]);
  });
});

describe("deleteOne", () => {
  it("deletes an existing value", async () => {
    // Setup
    const originalData: Array<Item> = [
      {
        id: 1,
        name: "Name 1",
      },
      {
        id: 2,
        name: "Name 2",
      },
      {
        id: 3,
        name: "Name 3",
      },
    ];
    const harness = new ShallowContextHarness(ApiProvider, Context.Consumer);
    let result = harness.getContextData();
    await result.replaceAll(originalData);
    await harness.waitForAsyncTasks();
    result = harness.getContextData();
    expect(result.data.length).toBe(3);

    // Work
    await result.deleteOne({
      id: 2,
    });
    await harness.waitForAsyncTasks();

    // Verify
    result = harness.getContextData();
    expect(result.data.length).toBe(2);
    expect(result.data[0]).toBe(originalData[0]);
    expect(result.data[1]).toBe(originalData[2]);
  });

  it("throws reject when deleting non-existant value", async () => {
    // Setup
    const originalData: Array<Item> = [
      {
        id: 1,
        name: "Name 1",
      },
      {
        id: 2,
        name: "Name 2",
      },
      {
        id: 3,
        name: "Name 3",
      },
    ];
    const harness = new ShallowContextHarness(ApiProvider, Context.Consumer);
    let result = harness.getContextData();
    await result.replaceAll(originalData);
    await harness.waitForAsyncTasks();
    result = harness.getContextData();
    expect(result.data.length).toBe(3);

    // Work - Since 4 doesn't exist, this should throw
    await expect(async () => {
      await result.deleteOne({
        id: 4,
      });
      await harness.waitForAsyncTasks();
    }).rejects.toEqual(errorMessages.indexNotFound);
  });
});
