import { configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { ShallowContextHarness } from "../harness";
import { ApiProvider, Context, Item } from "./index";

configure({
  adapter: new Adapter(),
});

describe("Context store - object", () => {
  it("completely rewrites all data with replace all", async () => {
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

  it("only updates one value with updateOne", async () => {
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

  it("creates a new entry with createOne", async () => {
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
    expect(result.data[3]).toEqual({
      id: 0,
      name: "New name",
    });
  });

  it("deletes an entry with deleteOne", async () => {
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

  it("deletes a non-existant entry with deleteOne", async () => {
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
    expect(async () => {
      await result.deleteOne({
        id: 4,
      });
      await harness.waitForAsyncTasks();
    }).rejects.toContain("");
  });
});
