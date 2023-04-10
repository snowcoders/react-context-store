import { beforeEach, describe, it, jest } from "@jest/globals";
import { ShallowContextHarness } from "../../../test-utils/harness";
import { ApiProvider, Context } from "./index.mock";

describe("Context store - primative", () => {
  it("changes data when callback function is called", async () => {
    // Work
    const harness = new ShallowContextHarness(ApiProvider, Context.Consumer);

    // Verify
    let result = harness.getContextData();
    expect(result.data).toEqual(0);

    // Work
    await result.oneUp();
    await harness.waitForAsyncTasks();

    // Verify
    result = harness.getContextData();
    expect(result.data).toEqual(1);
  });
});
