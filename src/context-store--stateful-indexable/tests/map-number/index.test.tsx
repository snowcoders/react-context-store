import { ContextStore } from "../../../context-store--basic/index.js";
import { ShallowContextHarness } from "../../../test-utils/harness";
import { ApiProvider, Context, ContextValueData } from "./index.mock";

function toContextStore<T>(data: T): ContextStore<T> {
  return {
    data: data,
    state: "success",
  };
}

describe("Context store - object", () => {
  it("completely rewrites all data with replace all", async () => {
    // Setup
    const data1: ContextValueData = {
      0: toContextStore({
        id: 0,
        name: "Name 0",
      }),
    };
    const data2: ContextValueData = {
      1: toContextStore({
        id: 1,
        name: "Name 1",
      }),
      2: toContextStore({
        id: 2,
        name: "Name 2",
      }),
      3: toContextStore({
        id: 3,
        name: "Name 3",
      }),
    };

    // Work
    const harness = new ShallowContextHarness(ApiProvider, Context.Consumer);

    // Verify
    expect(Object.keys(harness.getContextData().data).length).toBe(0);

    // Work
    await harness.getContextData().replaceAll(data1);
    await harness.waitForAsyncTasks();

    // Verify
    expect(Object.keys(harness.getContextData().data).length).toBe(1);

    // Work
    await harness.getContextData().replaceAll(data2);
    await harness.waitForAsyncTasks();

    // Verify
    expect(Object.keys(harness.getContextData().data).length).toBe(3);
  });

  it("only updates one value with updateOne", async () => {
    // Setup
    const originalData: ContextValueData = {
      1: toContextStore({
        id: 1,
        name: "Name 1",
      }),
      2: toContextStore({
        id: 2,
        name: "Name 2",
      }),
      3: toContextStore({
        id: 3,
        name: "Name 3",
      }),
    };
    const harness = new ShallowContextHarness(ApiProvider, Context.Consumer);
    await harness.getContextData().replaceAll(originalData);
    await harness.waitForAsyncTasks();
    expect(Object.keys(harness.getContextData().data).length).toBe(3);

    // Work
    await harness.getContextData().updateOne({
      ...originalData[2].data,
      name: "New name",
    });
    await harness.waitForAsyncTasks();

    // Verify
    expect(Object.keys(harness.getContextData().data).length).toBe(3);
    expect(harness.getContextData().data[1]).toBe(originalData[1]);
    expect(harness.getContextData().data[2]).not.toBe(originalData[2]);
    expect(harness.getContextData().data[3]).toBe(originalData[3]);
  });

  it("only updates one value with updateOne", async () => {
    // Setup
    const originalData: ContextValueData = {
      1: toContextStore({
        id: 1,
        name: "Name 1",
      }),
      2: toContextStore({
        id: 2,
        name: "Name 2",
      }),
      3: toContextStore({
        id: 3,
        name: "Name 3",
      }),
    };
    const harness = new ShallowContextHarness(ApiProvider, Context.Consumer);
    await harness.getContextData().replaceAll(originalData);
    await harness.waitForAsyncTasks();
    await harness.getContextData().updateOne({
      ...originalData[2].data,
      name: "New name",
    });
    await harness.waitForAsyncTasks();

    // Verify
    expect(Object.keys(harness.getContextData().data).length).toBe(3);
    expect(harness.getContextData().data[1]).toBe(originalData[1]);
    expect(harness.getContextData().data[2]).not.toBe(originalData[2]);
    expect(harness.getContextData().data[3]).toBe(originalData[3]);
  });
});
