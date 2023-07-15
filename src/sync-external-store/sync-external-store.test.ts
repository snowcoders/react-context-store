import { describe, it, jest } from "@jest/globals";
import { MockExternalStore } from "./example/store.js";

describe("subscribe", () => {
  it("calls subscribe callback once if subscribed twice", async () => {
    const mockStore = new MockExternalStore();
    const onChange = jest.fn();

    // Subscribe twice
    mockStore.subscribe(onChange);
    mockStore.subscribe(onChange);

    // Call fetch to trigger snapshot updates
    await mockStore.fetchSync();

    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("calls subscribe callback once if subscribed twice but unsubscribed once", async () => {
    const mockStore = new MockExternalStore();
    const onChange = jest.fn();

    // Subscribe twice and unsubscribe once
    mockStore.subscribe(onChange);
    const unsubscribe = mockStore.subscribe(onChange);
    unsubscribe();

    // Call fetch to trigger snapshot updates
    await mockStore.fetchSync();

    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("does not call the subscribe callback if subscribed then unsubscribed", async () => {
    const mockStore = new MockExternalStore();
    const onChange = jest.fn();

    // Subscribe and unsubscribe once
    const unsubscribe = mockStore.subscribe(onChange);
    unsubscribe();

    // Call fetch to trigger snapshot updates
    await mockStore.fetchSync();

    expect(onChange).toHaveBeenCalledTimes(0);
  });

  it("does not call the subscribe callback if subscribed twice then unsubscribed twice", async () => {
    const mockStore = new MockExternalStore();
    const onChange = jest.fn();

    // Subscribe and unsubscribe once
    const unsubscribe1 = mockStore.subscribe(onChange);
    const unsubscribe2 = mockStore.subscribe(onChange);
    unsubscribe1();
    unsubscribe2();

    // Call fetch to trigger snapshot updates
    await mockStore.fetchSync();

    expect(onChange).toHaveBeenCalledTimes(0);
  });

  it("does not call the subscribe callback if subscribed then unsubscribed twice", async () => {
    const mockStore = new MockExternalStore();
    const onChange = jest.fn();

    // Subscribe and unsubscribe once
    const unsubscribe1 = mockStore.subscribe(onChange);
    unsubscribe1();
    const unsubscribe2 = mockStore.subscribe(onChange);
    unsubscribe2();

    // Call fetch to trigger snapshot updates
    await mockStore.fetchSync();

    expect(onChange).toHaveBeenCalledTimes(0);
  });
});

describe("getSnapshot", () => {
  it("initializes with initial snapshot", async () => {
    const mockStore = new MockExternalStore();

    expect(mockStore.getSnapshot().state).toBe("NOT_STARTED");
  });

  it("updates immediately if synchronous", async () => {
    const mockStore = new MockExternalStore();

    mockStore.fetchSync();

    expect(mockStore.getSnapshot().state).toBe("COMPLETE");
  });

  it("updates twice if async", async () => {
    const mockStore = new MockExternalStore();

    const promise = mockStore.fetchAsync();
    expect(mockStore.getSnapshot().state).toBe("PENDING");

    await promise;
    expect(mockStore.getSnapshot().state).toBe("COMPLETE");
  });
});
