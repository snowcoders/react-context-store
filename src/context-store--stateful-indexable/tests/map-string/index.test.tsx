import { ContextStore } from "../../../context-store--basic/index.js";
import { errorMessages } from "../../../shared/index.js";
import { ShallowContextHarness } from "../../../test-utils/harness.js";
import { ApiProvider, Context, ContextValueData, Item } from "./index.mock";

function toContextStore<T>(data: T): ContextStore<T> {
  return {
    data: data,
    state: "success",
  };
}

describe("replaceAll", () => {
  it("completely rewrites all data", async () => {
    // Setup
    const data1: ContextValueData = {
      a: toContextStore({
        id: "a",
        name: "Name a",
      }),
    };
    const data2: ContextValueData = {
      b: toContextStore({
        id: "b",
        name: "Name b",
      }),
      c: toContextStore({
        id: "c",
        name: "Name c",
      }),
      d: toContextStore({
        id: "d",
        name: "Name d",
      }),
    };

    // Work
    const harness = new ShallowContextHarness(ApiProvider, Context.Consumer);

    // Verify
    let result = harness.getContextData();
    expect(Object.keys(result.data).length).toBe(0);

    // Work
    await result.replaceAll(data1);
    await harness.waitForAsyncTasks();

    // Verify
    result = harness.getContextData();
    expect(Object.keys(result.data).length).toBe(1);

    // Work
    await result.replaceAll(data2);
    await harness.waitForAsyncTasks();

    // Verify
    result = harness.getContextData();
    expect(Object.keys(result.data).length).toBe(3);
  });
});

describe("createOne", () => {
  it("creates a new entry", async () => {
    // Setup
    const originalData: ContextValueData = {
      a: toContextStore({
        id: "a",
        name: "Name a",
      }),
    };
    const newEntry: Item = {
      id: "b",
      name: "New name",
    };
    const harness = new ShallowContextHarness(ApiProvider, Context.Consumer);
    let result = harness.getContextData();
    await result.replaceAll(originalData);
    await harness.waitForAsyncTasks();
    result = harness.getContextData();
    expect(Object.keys(result.data).length).toBe(1);

    // Work
    await result.createOne(newEntry);
    await harness.waitForAsyncTasks();

    // Verify
    result = harness.getContextData();
    expect(Object.keys(result.data).length).toBe(2);
    expect(result.data["a"]).toBe(originalData["a"]);
    expect(result.data["b"]).toEqual(toContextStore(newEntry));
  });

  it("creates a duplicate entry overwriting the old entry", async () => {
    // Setup
    const originalData: ContextValueData = {
      a: toContextStore({
        id: "a",
        name: "Name a",
      }),
    };
    const newEntry: Item = {
      id: "a",
      name: "New name",
    };
    const harness = new ShallowContextHarness(ApiProvider, Context.Consumer);
    let result = harness.getContextData();
    await result.replaceAll(originalData);
    await harness.waitForAsyncTasks();
    result = harness.getContextData();
    expect(Object.keys(result.data).length).toBe(1);

    // Work
    await result.createOne(newEntry);
    await harness.waitForAsyncTasks();

    // Verify
    result = harness.getContextData();
    expect(Object.keys(result.data).length).toBe(1);
    expect(result.data["a"]).toEqual(toContextStore(newEntry));
  });

  it("creates two items in parallel", async () => {
    // Work
    const harness = new ShallowContextHarness(ApiProvider, Context.Consumer);

    // Verify
    let result = harness.getContextData();
    expect(Object.keys(result.data).length).toEqual(0);

    // Work
    await Promise.all([
      result.createOne({
        id: "0",
        name: "0",
      }),
      result.createOne({
        id: "1",
        name: "1",
      }),
    ]);
    await harness.waitForAsyncTasks();

    // Verify
    result = harness.getContextData();
    expect(result.data).toEqual({
      0: {
        data: { id: "0", name: "0" },
        state: "success",
      },
      1: {
        data: { id: "1", name: "1" },
        state: "success",
      },
    });
  });
});

describe("updateOne", () => {
  it("only updates one value", async () => {
    // Setup
    const originalData: ContextValueData = {
      b: toContextStore({
        id: "b",
        name: "Name b",
      }),
      c: toContextStore({
        id: "c",
        name: "Name c",
      }),
      d: toContextStore({
        id: "d",
        name: "Name d",
      }),
    };
    const harness = new ShallowContextHarness(ApiProvider, Context.Consumer);
    let result = harness.getContextData();
    await result.replaceAll(originalData);
    await harness.waitForAsyncTasks();
    result = harness.getContextData();
    expect(Object.keys(result.data).length).toBe(3);

    // Work
    await result.updateOne({
      ...originalData["c"].data,
      name: "New name",
    });
    await harness.waitForAsyncTasks();

    // Verify
    result = harness.getContextData();
    expect(Object.keys(result.data).length).toBe(3);
    expect(result.data["b"]).toBe(originalData["b"]);
    expect(result.data["c"]).not.toBe(originalData["c"]);
    expect(result.data["d"]).toBe(originalData["d"]);
  });

  it("rejects updateOne when index is not found", async () => {
    // Setup
    const originalData: ContextValueData = {
      b: toContextStore({
        id: "b",
        name: "Name b",
      }),
      c: toContextStore({
        id: "c",
        name: "Name c",
      }),
      d: toContextStore({
        id: "d",
        name: "Name d",
      }),
    };
    const harness = new ShallowContextHarness(ApiProvider, Context.Consumer);
    let result = harness.getContextData();
    await result.replaceAll(originalData);
    await harness.waitForAsyncTasks();
    result = harness.getContextData();
    expect(Object.keys(result.data).length).toBe(3);

    // Work
    const work = async () => {
      await result.updateOne({
        id: "4",
        name: "New name",
      });
      await harness.waitForAsyncTasks();
    };

    // Verify
    await expect(work).rejects.toEqual(errorMessages.indexNotFound);
  });
});

describe("deleteOne", () => {
  it("only deletes one value", async () => {
    // Setup
    const originalData: ContextValueData = {
      b: toContextStore({
        id: "b",
        name: "Name b",
      }),
      c: toContextStore({
        id: "c",
        name: "Name c",
      }),
      d: toContextStore({
        id: "d",
        name: "Name d",
      }),
    };
    const harness = new ShallowContextHarness(ApiProvider, Context.Consumer);
    let result = harness.getContextData();
    await result.replaceAll(originalData);
    await harness.waitForAsyncTasks();
    result = harness.getContextData();
    expect(Object.keys(result.data).length).toBe(3);

    // Work
    await expect(
      result.deleteOne({
        id: "c",
      }),
    ).resolves.toEqual({
      id: "c",
      name: "Name c",
    });
    await harness.waitForAsyncTasks();

    // Verify
    result = harness.getContextData();
    expect(Object.keys(result.data).length).toBe(2);
    expect(result.data["b"]).toBe(originalData["b"]);
    expect(result.data["c"]).not.toBeDefined();
    expect(result.data["d"]).toBe(originalData["d"]);
  });

  it("rejects when attempting to delete item that is not loaded", async () => {
    // Setup
    const originalData: ContextValueData = {
      b: toContextStore({
        id: "b",
        name: "Name b",
      }),
      c: toContextStore({
        id: "c",
        name: "Name c",
      }),
      d: toContextStore({
        id: "d",
        name: "Name d",
      }),
    };
    const harness = new ShallowContextHarness(ApiProvider, Context.Consumer);
    let result = harness.getContextData();
    await result.replaceAll(originalData);
    await harness.waitForAsyncTasks();
    result = harness.getContextData();
    expect(Object.keys(result.data).length).toBe(3);

    // Work
    await expect(
      result.deleteOne({
        id: "4",
      }),
    ).rejects.toEqual(errorMessages.indexNotFound);
  });

  it("sets an error state if delete action fails", async () => {
    // Setup
    const originalData: ContextValueData = {
      b: toContextStore({
        id: "b",
        name: "Name b",
      }),
      c: toContextStore({
        id: "c",
        name: "Name c",
      }),
      d: toContextStore({
        id: "d",
        name: "Name d",
      }),
    };
    const harness = new ShallowContextHarness(ApiProvider, Context.Consumer);
    let result = harness.getContextData();
    const { rejectId } = result;
    await result.replaceAll({
      ...originalData,
      [rejectId]: toContextStore({ id: rejectId, name: "Reject id" }),
    });
    await harness.waitForAsyncTasks();
    result = harness.getContextData();
    expect(Object.keys(result.data).length).toBe(4);

    // Work
    await expect(async () => {
      await result.deleteOne({
        id: rejectId,
      });
      await harness.waitForAsyncTasks();
    }).rejects.not.toHaveLength(0);

    // Verify
    result = harness.getContextData();
    expect(Object.keys(result.data).length).toBe(4);
    // Individual state is error
    expect(result.data[rejectId]).toEqual({
      data: { id: rejectId, name: "Reject id" },
      state: "error",
    });
    // List state is success
    expect(result.state).toEqual("success");
  });
});
