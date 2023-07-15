import { beforeEach, describe, it, jest } from "@jest/globals";
import { act, render } from "@testing-library/react";
import React from "react";
import type { MockExternalStoreState, SomeStore } from "./store.mock.js";

// 1. Mock the external store and other dependencies (here we have fetch)
const mockSomeStore: jest.Mocked<
  Pick<SomeStore, "fetchAsync" | "fetchSync" | "getSnapshot" | "getUseSyncExternalStoreArgs">
> = {
  fetchAsync: jest.fn(),
  fetchSync: jest.fn(),
  getSnapshot: jest.fn(),
  getUseSyncExternalStoreArgs: jest.fn(),
};
jest.unstable_mockModule("./store.mock.js", () => {
  return {
    someStore: mockSomeStore,
  };
});
const fetchMock: jest.Mocked<typeof global.fetch> = jest.fn();

// 2. Import the component that uses the external store
const { MockComponent } = await import("./component.mock.js");

beforeEach(() => {
  // Setup the default mocks for the store
  mockSomeStore.fetchSync.mockReturnValue(undefined);
  mockSomeStore.fetchAsync.mockResolvedValue("Some text from response");
  mockSomeStore.getUseSyncExternalStoreArgs.mockImplementation(() => [
    // subscribe
    () => () => {},
    // getSnapshot
    mockSomeStore.getSnapshot,
    // getServerSnapshot
    undefined,
  ]);

  // Our store uses fetch, let's mock that
  fetchMock.mockRejectedValue("Did you forget to setup your mocked fetch data?");
  Object.defineProperty(window, "fetch", {
    value: fetchMock,
    writable: true,
  });
});

afterEach(() => {
  jest.resetAllMocks();
});

// 3. Test render of different snapshot data
describe("rendering snapshot data", () => {
  it.each<MockExternalStoreState>`
    state
    ${"NOT_STARTED"}
    ${"PENDING"}
    ${"NON_SENSE"}
  `("renders $state", async ({ state }) => {
    // Arrange
    mockSomeStore.getSnapshot.mockReturnValue({ data: null, state: state });

    // Act
    const result = render(<MockComponent />);

    // Assert
    const text = (await result.findByRole("heading")).textContent;
    expect(text).toContain(state);
  });
});

// 4. Test actions get triggered, not that the snapshot updated based off the action
describe("actions", () => {
  it("calls fetchSync if button is clicked", async () => {
    // Arrange
    mockSomeStore.getSnapshot.mockReturnValue({ data: null, state: "NOT_STARTED" });

    // Act
    const result = render(<MockComponent />);
    const button = await result.findByText("Fetch sync");
    act(() => {
      button.click();
    });

    // Assert
    expect(mockSomeStore.fetchSync).toHaveBeenCalledTimes(1);
    expect(mockSomeStore.fetchAsync).toHaveBeenCalledTimes(0);
  });

  it("calls fetchAsync if button is clicked", async () => {
    // Arrange
    mockSomeStore.getSnapshot.mockReturnValue({ data: null, state: "NOT_STARTED" });

    // Act
    const result = render(<MockComponent />);
    const button = await result.findByText("Fetch async");
    act(() => {
      button.click();
    });

    // Assert
    expect(mockSomeStore.fetchSync).toHaveBeenCalledTimes(0);
    expect(mockSomeStore.fetchAsync).toHaveBeenCalledTimes(1);
  });
});
