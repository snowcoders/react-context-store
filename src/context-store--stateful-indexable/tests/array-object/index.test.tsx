import { ContextStore } from "../../../context-store--basic/index.js";
import { errorMessages } from "../../../shared";
import { ShallowContextHarness } from "../../../test-utils/harness";
import { ApiProvider, Context, Item } from "./index.mock";

function toContextStore<T>(data: T): ContextStore<T> {
  return {
    data: data,
    state: "success",
  };
}

describe("replaceAll", () => {
  it("completely rewrites all data", async () => {
    // Setup
    const data1: Array<ContextStore<Item>> = [
      {
        id: 0,
        name: "Name 0",
      },
    ].map(toContextStore);
    const data2: Array<ContextStore<Item>> = [
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
    ].map(toContextStore);

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
  it("only updates one value with updateOne", async () => {
    // Setup
    const originalData: Array<ContextStore<Item>> = [
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
    ].map(toContextStore);
    const harness = new ShallowContextHarness(ApiProvider, Context.Consumer);
    let result = harness.getContextData();
    await result.replaceAll(originalData);
    await harness.waitForAsyncTasks();
    result = harness.getContextData();
    expect(result.data.length).toBe(3);

    // Work
    await result.updateOne({
      ...originalData[1].data,
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
});

describe("createOne", () => {
  it("creates a new entry", async () => {
    // Setup
    const originalData: Array<ContextStore<Item>> = [
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
    ].map(toContextStore);
    const harness = new ShallowContextHarness(ApiProvider, Context.Consumer);
    let result = harness.getContextData();
    await result.replaceAll(originalData);
    await harness.waitForAsyncTasks();
    result = harness.getContextData();
    expect(result.data.length).toBe(3);

    // Work
    await result.createOne({
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
    expect(result.data[3]).toEqual(
      toContextStore({
        id: 0,
        name: "New name",
      }),
    );
  });

  it("creates a duplicate entry", async () => {
    // Setup
    const originalData: Array<ContextStore<Item>> = [
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
    ].map(toContextStore);
    const harness = new ShallowContextHarness(ApiProvider, Context.Consumer);
    let result = harness.getContextData();
    await result.replaceAll(originalData);
    await harness.waitForAsyncTasks();
    result = harness.getContextData();
    expect(result.data.length).toBe(3);

    // Work
    await result.createOne({
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
    expect(result.data[3]).toEqual(
      toContextStore({
        id: 0,
        name: "New name",
      }),
    );
  });
});

describe("deleteOne", () => {
  it("deletes an existing value", async () => {
    // Setup
    const originalData: Array<ContextStore<Item>> = [
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
    ].map(toContextStore);
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
    const originalData: Array<ContextStore<Item>> = [
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
    ].map(toContextStore);
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
