import { beforeEach, describe, it, jest } from "@jest/globals";
import { ShallowContextHarness } from "../../../test-utils/harness";
import { ApiProvider, Context } from "./index.mock";

describe("Context store - object", () => {
  it("changes data when callback function is called", async () => {
    // Work
    const harness = new ShallowContextHarness(ApiProvider, Context.Consumer);

    // Verify
    let result = harness.getContextData();
    expect(result.data.name).not.toHaveLength(0);

    // Work
    const newName = `New ${result.data.name}`;
    await result.changeName({ newName });
    await harness.waitForAsyncTasks();

    // Verify
    result = harness.getContextData();
    expect(result.data.name).toEqual(newName);
  });
});
