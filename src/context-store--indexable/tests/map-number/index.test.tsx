import { configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { ShallowContextHarness } from "../../../test-utils/harness";
import { ApiProvider, Context, ContextValueData } from "./index.mock";

configure({
  adapter: new Adapter(),
});

describe("Context store - object", () => {
  it("completely rewrites all data with replace all", async () => {
    // Setup
    const data1: ContextValueData = {
      0: {
        id: 0,
        name: "Name 0",
      },
    };
    const data2: ContextValueData = {
      1: {
        id: 1,
        name: "Name 1",
      },
      2: {
        id: 2,
        name: "Name 2",
      },
      3: {
        id: 3,
        name: "Name 3",
      },
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
      1: {
        id: 1,
        name: "Name 1",
      },
      2: {
        id: 2,
        name: "Name 2",
      },
      3: {
        id: 3,
        name: "Name 3",
      },
    };
    const harness = new ShallowContextHarness(ApiProvider, Context.Consumer);
    await harness.getContextData().replaceAll(originalData);
    await harness.waitForAsyncTasks();
    expect(Object.keys(harness.getContextData().data).length).toBe(3);

    // Work
    await harness.getContextData().updateOne({
      ...originalData[2],
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
      1: {
        id: 1,
        name: "Name 1",
      },
      2: {
        id: 2,
        name: "Name 2",
      },
      3: {
        id: 3,
        name: "Name 3",
      },
    };
    const harness = new ShallowContextHarness(ApiProvider, Context.Consumer);
    await harness.getContextData().replaceAll(originalData);
    await harness.waitForAsyncTasks();
    await harness.getContextData().updateOne({
      ...originalData[2],
      name: "New name",
    });
    await harness.waitForAsyncTasks();

    // Verify
    expect(Object.keys(harness.getContextData().data).length).toBe(3);
    expect(harness.getContextData().data[1]).toBe(originalData[1]);
    expect(harness.getContextData().data[2]).not.toBe(originalData[2]);
    expect(harness.getContextData().data[3]).toBe(originalData[3]);
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
        id: 0,
        name: "0",
      }),
      result.createOne({
        id: 1,
        name: "1",
      }),
    ]);
    await harness.waitForAsyncTasks();

    // Verify
    result = harness.getContextData();
    expect(result.data).toEqual({
      0: {
        id: 0,
        name: "0",
      },
      1: {
        id: 1,
        name: "1",
      },
    });
  });
});
