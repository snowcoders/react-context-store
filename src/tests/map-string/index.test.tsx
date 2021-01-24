import { configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { ShallowContextHarness } from "../harness";
import { ApiProvider, Context, ContextValueData, Item } from "./index";

configure({
  adapter: new Adapter(),
});

describe("Context store - object", () => {
  it("completely rewrites all data with replace all", async () => {
    // Setup
    const data1: ContextValueData = {
      "0": {
        id: 0,
        name: "Name 0",
      },
    };
    const data2: ContextValueData = {
      "1": {
        id: 1,
        name: "Name 1",
      },
      "2": {
        id: 2,
        name: "Name 2",
      },
      "3": {
        id: 3,
        name: "Name 3",
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

  it("only updates one value with updateOne", async () => {
    // Setup
    const originalData: ContextValueData = {
      "1": {
        id: 1,
        name: "Name 1",
      },
      "2": {
        id: 2,
        name: "Name 2",
      },
      "3": {
        id: 3,
        name: "Name 3",
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
      ...originalData[2],
      name: "New name",
    });
    await harness.waitForAsyncTasks();

    // Verify
    result = harness.getContextData();
    expect(Object.keys(result.data).length).toBe(3);
    expect(result.data[1]).toBe(originalData[1]);
    expect(result.data[2]).not.toBe(originalData[2]);
    expect(result.data[3]).toBe(originalData[3]);
  });
});
