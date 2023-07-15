import { beforeEach, describe, it, jest } from "@jest/globals";
import { act, render } from "@testing-library/react";
import React from "react";

// 1. Mock the external store
const getSnapshot = jest.fn();
const fetchSync = jest.fn();
const fetchAsync = jest.fn();
jest.unstable_mockModule("./store.js", () => {
  return {
    mockStore: {
      fetchAsync,
      fetchSync,
      getUseSyncExternalStoreArgs: () => [
        // subscribe
        () => () => {},
        // snapshot
        getSnapshot,
      ],
    },
  };
});

// 2. Import the component that uses the external store
const { MockComponent } = await import("./component.js");

beforeEach(() => {
  jest.resetAllMocks();
});

// 3. Test render of different snapshot data
describe("rendering snapshot data", () => {
  it.each<{ state: string }>`
    state
    ${"NOT_STARTED"}
    ${"PENDING"}
    ${"NON_SENSE"}
  `("renders $state", async ({ state }) => {
    // Arrange
    getSnapshot.mockReturnValue({ state: state });

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
    getSnapshot.mockReturnValue({ state: "NOT_STARTED" });

    // Act
    const result = render(<MockComponent />);
    const button = await result.findByText("Fetch sync");
    act(() => {
      button.click();
    });

    // Assert
    expect(fetchSync).toHaveBeenCalledTimes(1);
    expect(fetchAsync).toHaveBeenCalledTimes(0);
  });

  it("calls fetchAsync if button is clicked", async () => {
    // Arrange
    getSnapshot.mockReturnValue({ state: "NOT_STARTED" });

    // Act
    const result = render(<MockComponent />);
    const button = await result.findByText("Fetch async");
    act(() => {
      button.click();
    });

    // Assert
    expect(fetchSync).toHaveBeenCalledTimes(0);
    expect(fetchAsync).toHaveBeenCalledTimes(1);
  });
});
