import { configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { ShallowContextHarness } from "../harness";
import { ApiProvider, Context, ContextValueData, Item } from "./index";

configure({
  adapter: new Adapter(),
});

describe("replaceAll", () => {
  it("completely rewrites all data", async () => {
    // Setup
    const data1: ContextValueData = {
      a: {
        id: "a",
        name: "Name a",
      },
    };
    const data2: ContextValueData = {
      b: {
        id: "b",
        name: "Name b",
      },
      c: {
        id: "c",
        name: "Name c",
      },
      d: {
        id: "d",
        name: "Name d",
      },
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
      a: {
        id: "a",
        name: "Name a",
      },
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
    expect(result.data["b"]).toEqual(newEntry);
  });

  it("creates a duplicate entry overwriting the old entry", async () => {
    // Setup
    const originalData: ContextValueData = {
      a: {
        id: "a",
        name: "Name a",
      },
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
    expect(result.data["a"]).toEqual(newEntry);
  });
});

describe("updateOne", () => {
  it("only updates one value", async () => {
    // Setup
    const originalData: ContextValueData = {
      b: {
        id: "b",
        name: "Name b",
      },
      c: {
        id: "c",
        name: "Name c",
      },
      d: {
        id: "d",
        name: "Name d",
      },
    };
    const harness = new ShallowContextHarness(ApiProvider, Context.Consumer);
    let result = harness.getContextData();
    await result.replaceAll(originalData);
    await harness.waitForAsyncTasks();
    result = harness.getContextData();
    expect(Object.keys(result.data).length).toBe(3);

    // Work
    await result.updateOne({
      ...originalData["c"],
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

  it("rejects when index is not found", async () => {
    // Setup
    const originalData: ContextValueData = {
      b: {
        id: "b",
        name: "Name b",
      },
      c: {
        id: "c",
        name: "Name c",
      },
      d: {
        id: "d",
        name: "Name d",
      },
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
    expect(work).rejects.toContain("index");
  });
});

describe("deleteOne", () => {
  it("only deletes one value", async () => {
    // Setup
    const originalData: ContextValueData = {
      b: {
        id: "b",
        name: "Name b",
      },
      c: {
        id: "c",
        name: "Name c",
      },
      d: {
        id: "d",
        name: "Name d",
      },
    };
    const harness = new ShallowContextHarness(ApiProvider, Context.Consumer);
    let result = harness.getContextData();
    await result.replaceAll(originalData);
    await harness.waitForAsyncTasks();
    result = harness.getContextData();
    expect(Object.keys(result.data).length).toBe(3);

    // Work
    await result.deleteOne({
      id: "c",
    });
    await harness.waitForAsyncTasks();

    // Verify
    result = harness.getContextData();
    expect(Object.keys(result.data).length).toBe(2);
    expect(result.data["b"]).toBe(originalData["b"]);
    expect(result.data["c"]).not.toBeDefined();
    expect(result.data["d"]).toBe(originalData["d"]);
  });

  it("rejects when index is not found", async () => {
    // Setup
    const originalData: ContextValueData = {
      b: {
        id: "b",
        name: "Name b",
      },
      c: {
        id: "c",
        name: "Name c",
      },
      d: {
        id: "d",
        name: "Name d",
      },
    };
    const harness = new ShallowContextHarness(ApiProvider, Context.Consumer);
    let result = harness.getContextData();
    await result.replaceAll(originalData);
    await harness.waitForAsyncTasks();
    result = harness.getContextData();
    expect(Object.keys(result.data).length).toBe(3);

    // Work
    const work = async () => {
      await result.deleteOne({
        id: "4",
      });
      await harness.waitForAsyncTasks();
    };

    // Verify
    expect(work).rejects.toContain("index");
  });
});
