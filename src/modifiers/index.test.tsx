import { getReplaceContextData } from "./index";

describe("getReplaceContextData", () => {
  describe("state", () => {
    it("updates state correctly without any actions", async () => {
      const spy = jest.fn();
      const data = {
        a: "a",
      };
      await getReplaceContextData(
        {
          data: data,
          state: "unsent",
        },
        spy,
        undefined,
        {}
      );

      expect(spy).toHaveBeenCalledTimes(2);
      expect(spy.mock.calls[0][0].data).toBe(data);
      expect(spy.mock.calls[0][0].state).toBe("loading");
      expect(spy.mock.calls[1][0].data).toBe(data);
      expect(spy.mock.calls[1][0].state).toBe("success");
    });

    it("updates state to error when preaction throws", async () => {
      const spy = jest.fn();
      const data = {
        a: "a",
      };
      await getReplaceContextData(
        {
          data: data,
          state: "unsent",
        },
        spy,
        undefined,
        {
          preaction: () => {
            throw new Error();
          },
        }
      );

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy.mock.calls[0][0].data).toBe(data);
      expect(spy.mock.calls[0][0].state).toBe("error");
    });

    it("updates state to error when action throws", async () => {
      const spy = jest.fn();
      const data = {
        a: "a",
      };
      await getReplaceContextData(
        {
          data: data,
          state: "unsent",
        },
        spy,
        undefined,
        {
          action: () => {
            throw new Error();
          },
        }
      );

      expect(spy).toHaveBeenCalledTimes(2);
      expect(spy.mock.calls[0][0].data).toBe(data);
      expect(spy.mock.calls[0][0].state).toBe("loading");
      expect(spy.mock.calls[1][0].data).toBe(data);
      expect(spy.mock.calls[1][0].state).toBe("error");
    });

    it("throws error if error is thrown in error data handler", async () => {
      const spy = jest.fn();
      const data = {
        a: "a",
      };
      await getReplaceContextData(
        {
          data: data,
          state: "unsent",
        },
        spy,
        undefined,
        {
          action: () => {
            throw new Error();
          },
          error: () => {
            throw new Error();
          },
        }
      );

      expect(spy).toHaveBeenCalledTimes(2);
      expect(spy.mock.calls[0][0].data).toBe(data);
      expect(spy.mock.calls[0][0].state).toBe("loading");
      expect(spy.mock.calls[1][0].data).toBe(data);
      expect(spy.mock.calls[1][0].state).toBe("error");
    });
  });
});
