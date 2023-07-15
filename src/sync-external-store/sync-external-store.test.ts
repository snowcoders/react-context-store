import { describe, it, jest } from "@jest/globals";
import { SomeStore } from "./example/store.mock.js";

const fetchMock: jest.Mocked<typeof global.fetch> = jest.fn();
beforeEach(() => {
  fetchMock.mockResolvedValue({
    text: () => Promise.resolve("Success"),
  } as Response);
  Object.defineProperty(window, "fetch", {
    value: fetchMock,
    writable: true,
  });
});

describe("subscribe", () => {
  it("calls subscribe callback once if subscribed twice", async () => {
    const mockStore = new SomeStore();
    const onChange = jest.fn();

    // Subscribe twice
    mockStore.subscribe(onChange);
    mockStore.subscribe(onChange);

    // Call fetch to trigger snapshot updates
    await mockStore.fetchSync();

    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("calls subscribe callback once if subscribed twice but unsubscribed once", async () => {
    const mockStore = new SomeStore();
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
    const mockStore = new SomeStore();
    const onChange = jest.fn();

    // Subscribe and unsubscribe once
    const unsubscribe = mockStore.subscribe(onChange);
    unsubscribe();

    // Call fetch to trigger snapshot updates
    await mockStore.fetchSync();

    expect(onChange).toHaveBeenCalledTimes(0);
  });

  it("does not call the subscribe callback if subscribed twice then unsubscribed twice", async () => {
    const mockStore = new SomeStore();
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
    const mockStore = new SomeStore();
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
    const mockStore = new SomeStore();

    expect(mockStore.getSnapshot().state).toBe("NOT_STARTED");
  });

  it("updates immediately if synchronous", async () => {
    const mockStore = new SomeStore();

    mockStore.fetchSync();

    expect(mockStore.getSnapshot().state).toBe("COMPLETE");
  });

  it("updates twice if async", async () => {
    const mockStore = new SomeStore();

    const promise = mockStore.fetchAsync();
    expect(mockStore.getSnapshot().state).toBe("PENDING");

    let result = await promise;
    expect(mockStore.getSnapshot().state).toBe("COMPLETE");
  });
});
