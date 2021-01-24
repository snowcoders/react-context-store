import { configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { ShallowContextHarness } from "../harness";
import { ApiProvider, Context } from "./index";

configure({
  adapter: new Adapter(),
});

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
