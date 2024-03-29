import { describe, expect, it, jest } from "@jest/globals";
import { errorMessages } from "../../shared/index.js";
import { getReplaceContextData } from "./index.js";

describe("getReplaceContextData", () => {
  it("updates state correctly without any actions", async () => {
    const spy = jest.fn();
    const data = {
      a: "a",
    };
    await expect(
      getReplaceContextData(
        {
          data: data,
          state: "unsent",
        },
        spy,
        undefined,
        {},
      ),
    ).resolves.toMatchObject(data);

    expect(spy).toHaveBeenCalledTimes(2);
    // @ts-ignore: TODO fix typings before next release
    expect(spy.mock.calls[0][0].data).toBe(data);
    // @ts-ignore: TODO fix typings before next release
    expect(spy.mock.calls[0][0].state).toBe("loading");
    // @ts-ignore: TODO fix typings before next release
    expect(spy.mock.calls[1][0].data).toBe(data);
    // @ts-ignore: TODO fix typings before next release
    expect(spy.mock.calls[1][0].state).toBe("success");
  });

  describe("Reject promise scenarios", () => {
    it("rejects and updates state to error when preload rejects", async () => {
      const spy = jest.fn();
      const data = {
        a: "a",
      };
      const rejectMessage = "rejectMessage";
      await expect(
        getReplaceContextData(
          {
            data: data,
            state: "unsent",
          },
          spy,
          undefined,
          {
            preload: () => {
              return Promise.reject(rejectMessage);
            },
          },
        ),
      ).rejects.toEqual(rejectMessage);

      expect(spy).toHaveBeenCalledTimes(1);
      // @ts-ignore: TODO fix typings before next release
      expect(spy.mock.calls[0][0].data).toBe(data);
      // @ts-ignore: TODO fix typings before next release
      expect(spy.mock.calls[0][0].state).toBe("error");
    });

    it("rejects and updates state to error when action rejects", async () => {
      const spy = jest.fn();
      const data = {
        a: "a",
      };
      const rejectMessage = "rejectMessage";
      await expect(
        getReplaceContextData(
          {
            data: data,
            state: "unsent",
          },
          spy,
          undefined,
          {
            action: () => {
              return Promise.reject(rejectMessage);
            },
          },
        ),
      ).rejects.toEqual(rejectMessage);

      expect(spy).toHaveBeenCalledTimes(2);
      // @ts-ignore: TODO fix typings before next release
      expect(spy.mock.calls[0][0].data).toBe(data);
      // @ts-ignore: TODO fix typings before next release
      expect(spy.mock.calls[0][0].state).toBe("loading");
      // @ts-ignore: TODO fix typings before next release
      expect(spy.mock.calls[1][0].data).toBe(data);
      // @ts-ignore: TODO fix typings before next release
      expect(spy.mock.calls[1][0].state).toBe("error");
    });

    it("rejects if rejects if during an error handler", async () => {
      const spy = jest.fn();
      const data = {
        a: "a",
      };
      const rejectMessage = "rejectMessage";
      await expect(
        getReplaceContextData(
          {
            data: data,
            state: "unsent",
          },
          spy,
          undefined,
          {
            action: () => {
              return Promise.reject(rejectMessage);
            },
            error: () => {
              return Promise.reject(rejectMessage);
            },
          },
        ),
      ).rejects.toEqual(errorMessages.errorCallbackRejected);

      expect(spy).toHaveBeenCalledTimes(2);
      // @ts-ignore: TODO fix typings before next release
      expect(spy.mock.calls[0][0].data).toBe(data);
      // @ts-ignore: TODO fix typings before next release
      expect(spy.mock.calls[0][0].state).toBe("loading");
      // @ts-ignore: TODO fix typings before next release
      expect(spy.mock.calls[1][0].data).toBe(data);
      // @ts-ignore: TODO fix typings before next release
      expect(spy.mock.calls[1][0].state).toBe("error");
    });
  });

  describe("Throw error scenarios", () => {
    it("rejects and updates state to error when preload throws", async () => {
      const spy = jest.fn();
      const data = {
        a: "a",
      };
      const rejectMessage = "rejectMessage";
      await expect(
        getReplaceContextData(
          {
            data: data,
            state: "unsent",
          },
          spy,
          undefined,
          {
            preload: () => {
              throw new Error(rejectMessage);
            },
          },
        ),
      ).rejects.toEqual(rejectMessage);

      expect(spy).toHaveBeenCalledTimes(1);
      // @ts-ignore: TODO fix typings before next release
      expect(spy.mock.calls[0][0].data).toBe(data);
      // @ts-ignore: TODO fix typings before next release
      expect(spy.mock.calls[0][0].state).toBe("error");
    });

    it("rejects and updates state to error when action throws", async () => {
      const spy = jest.fn();
      const data = {
        a: "a",
      };
      const rejectMessage = "rejectMessage";
      await expect(
        getReplaceContextData(
          {
            data: data,
            state: "unsent",
          },
          spy,
          undefined,
          {
            action: () => {
              throw new Error(rejectMessage);
            },
          },
        ),
      ).rejects.toEqual(rejectMessage);

      expect(spy).toHaveBeenCalledTimes(2);
      // @ts-ignore: TODO fix typings before next release
      expect(spy.mock.calls[0][0].data).toBe(data);
      // @ts-ignore: TODO fix typings before next release
      expect(spy.mock.calls[0][0].state).toBe("loading");
      // @ts-ignore: TODO fix typings before next release
      expect(spy.mock.calls[1][0].data).toBe(data);
      // @ts-ignore: TODO fix typings before next release
      expect(spy.mock.calls[1][0].state).toBe("error");
    });

    it("rejects if throws error if during an error handler", async () => {
      const spy = jest.fn();
      const data = {
        a: "a",
      };
      const rejectMessage = "rejectMessage";
      await expect(
        getReplaceContextData(
          {
            data: data,
            state: "unsent",
          },
          spy,
          undefined,
          {
            action: () => {
              throw new Error(rejectMessage);
            },
            error: () => {
              throw new Error(rejectMessage);
            },
          },
        ),
      ).rejects.toEqual(errorMessages.errorCallbackRejected);

      expect(spy).toHaveBeenCalledTimes(2);
      // @ts-ignore: TODO fix typings before next release
      expect(spy.mock.calls[0][0].data).toBe(data);
      // @ts-ignore: TODO fix typings before next release
      expect(spy.mock.calls[0][0].state).toBe("loading");
      // @ts-ignore: TODO fix typings before next release
      expect(spy.mock.calls[1][0].data).toBe(data);
      // @ts-ignore: TODO fix typings before next release
      expect(spy.mock.calls[1][0].state).toBe("error");
    });
  });
});
