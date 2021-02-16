import { configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { ShallowContextHarness } from "../test-utils/harness";
import { ApiProvider, Context, loadWithErrorValue } from "./index.mock";

configure({
  adapter: new Adapter(),
});

describe("Context store - stateful indexable", () => {
  it("changes data when callback function is called", async () => {
    // Work
    const harness = new ShallowContextHarness(ApiProvider, Context.Consumer);

    // Verify
    let result = harness.getContextData();
    expect(Object.keys(result.data).length).toEqual(0);

    // Work
    await result.loadWithError();
    await harness.waitForAsyncTasks();

    // Verify
    result = harness.getContextData();
    expect(result.data).toEqual(loadWithErrorValue);
  });

  // TODO
  xit("creates two items in parallel", async () => {
    // Work
    const harness = new ShallowContextHarness(ApiProvider, Context.Consumer);

    // Verify
    let result = harness.getContextData();
    expect(Object.keys(result.data).length).toEqual(0);

    // Work
    await Promise.all([
      result.createOne({
        id: "0",
      }),
      result.createOne({
        id: "1",
      }),
    ]);
    await harness.waitForAsyncTasks();

    // Verify
    result = harness.getContextData();
    expect(result.data).toEqual({
      0: {
        data: { id: "0", name: "0" },
        state: "success",
      },
      1: {
        data: { id: "1", name: "1" },
        state: "success",
      },
    });
  });
});
