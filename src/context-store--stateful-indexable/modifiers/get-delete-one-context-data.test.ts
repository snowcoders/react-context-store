import { describe, expect, it, jest } from "@jest/globals";
import { act } from "@testing-library/react";
import { ContextStore } from "../../context-store--basic";
import { errorMessages } from "../../shared";
import { getTestName } from "../../test-utils/get-test-name";
import {
  getDeleteOneContextData,
  getUpdatedContextDataForDeleteOne,
  setContextDataForDeleteOne,
} from "./get-delete-one-context-data";

type User = {
  id: string;
  name: string;
};

type UserMapContextStore = ContextStore<{ [key: string]: ContextStore<User> }>;

describe(getTestName(import.meta.url), () => {
  describe("Reactive delete", () => {
    describe("action resolves", () => {
      it("Deletes item (setting states) and returns expected result", async () => {
        const statefulIndexStore: UserMapContextStore = {
          data: {
            "0": {
              data: {
                id: "0",
                name: "name 0",
              },
              state: "success",
            },
          },
          state: "success",
        };
        const setContextData = jest.fn((func) => {
          // @ts-ignore: TODO fix typings before next release
          return func(statefulIndexStore);
        });
        await act(async () => {
          const result = await getDeleteOneContextData(
            statefulIndexStore,
            setContextData,
            {
              id: "0",
            },
            {
              action: (params) => {
                return Promise.resolve();
              },
              getIndex: () => "0",
            },
          );
          // Returns deleted item
          expect(result).toMatchObject({
            id: "0",
            name: "name 0",
          });
        });

        expect(setContextData).toHaveBeenCalledTimes(2);
        // Expect setContextData to have been called first with loading
        expect(setContextData).toHaveNthReturnedWith(
          1,
          expect.objectContaining({
            data: {
              0: {
                data: {
                  id: "0",
                  name: "name 0",
                },
                state: "loading",
              },
            },
            state: "success",
          }),
        );

        expect(setContextData).toHaveNthReturnedWith(
          2,
          expect.objectContaining({
            data: {},
            state: "success",
          }),
        );
      });

      it("Updates item via preload, deletes item (setting states), and returns expected result", async () => {
        const statefulIndexStore: UserMapContextStore = {
          data: {
            0: {
              data: {
                id: "0",
                name: "name 0",
              },
              state: "success",
            },
          },
          state: "success",
        };
        const setContextData = jest.fn((func) => {
          // @ts-ignore: TODO fix typings before next release
          return func(statefulIndexStore);
        });
        const result = await getDeleteOneContextData(
          statefulIndexStore,
          setContextData,
          {
            id: "0",
          },
          {
            action: (params) => {
              return Promise.resolve();
            },
            getIndex: () => "0",
            preload: (params) => {
              return Promise.resolve({
                name: "preload",
              });
            },
          },
        );

        // Returns deleted item
        expect(result).toMatchObject({
          id: "0",
          name: "name 0",
        });

        expect(setContextData).toHaveBeenCalledTimes(2);
        // Expect setContextData to have been called first with loading
        expect(setContextData).toHaveNthReturnedWith(
          1,
          expect.objectContaining({
            data: {
              0: {
                data: {
                  id: "0",
                  name: "preload",
                },
                state: "loading",
              },
            },
            state: "success",
          }),
        );

        expect(setContextData).toHaveNthReturnedWith(
          2,
          expect.objectContaining({
            data: {},
            state: "success",
          }),
        );
      });
    });

    describe("action rejects", () => {
      it("rejects request and updates state to loading then error", async () => {
        const rejectErrorMessage = "Test reject error message";

        const statefulIndexStore: UserMapContextStore = {
          data: {
            0: {
              data: {
                id: "0",
                name: "name 0",
              },
              state: "success",
            },
          },
          state: "success",
        };
        const setContextData = jest.fn((func) => {
          // @ts-ignore: TODO fix typings before next release
          return func(statefulIndexStore);
        });
        await expect(
          getDeleteOneContextData(
            statefulIndexStore,
            setContextData,
            {
              id: "0",
            },
            {
              action: (params) => {
                return Promise.reject(rejectErrorMessage);
              },
              getIndex: () => "0",
            },
          ),
        ).rejects.toEqual(rejectErrorMessage);

        expect(setContextData).toHaveBeenCalledTimes(2);
        // Expect setContextData to have been called first with loading
        expect(setContextData).toHaveNthReturnedWith(
          1,
          expect.objectContaining({
            data: {
              0: {
                data: {
                  id: "0",
                  name: "name 0",
                },
                state: "loading",
              },
            },
            state: "success",
          }),
        );
        // Expect setContextData to have been last called with error
        expect(setContextData).toHaveNthReturnedWith(
          2,
          expect.objectContaining({
            data: {
              0: {
                data: {
                  id: "0",
                  name: "name 0",
                },
                state: "error",
              },
            },
            state: "success",
          }),
        );
      });

      it("rejects request and updates state to loading then custom error", async () => {
        const rejectErrorMessage = "Test reject error message";

        const statefulIndexStore: UserMapContextStore = {
          data: {
            0: {
              data: {
                id: "0",
                name: "name 0",
              },
              state: "success",
            },
          },
          state: "success",
        };
        const setContextData = jest.fn((func) => {
          // @ts-ignore: TODO fix typings before next release
          return func(statefulIndexStore);
        });
        await expect(
          getDeleteOneContextData(
            statefulIndexStore,
            setContextData,
            {
              id: "0",
            },
            {
              action: (params) => {
                return Promise.reject(rejectErrorMessage);
              },
              error: (params) => {
                return Promise.resolve({
                  ...params,
                  name: rejectErrorMessage,
                });
              },
              getIndex: () => "0",
            },
          ),
        ).rejects.toEqual(rejectErrorMessage);

        expect(setContextData).toHaveBeenCalledTimes(2);
        // Expect setContextData to have been called first with loading
        expect(setContextData).toHaveNthReturnedWith(
          1,
          expect.objectContaining({
            data: {
              0: {
                data: {
                  id: "0",
                  name: "name 0",
                },
                state: "loading",
              },
            },
            state: "success",
          }),
        );
        // Expect setContextData to have been last called with error
        expect(setContextData).toHaveNthReturnedWith(
          2,
          expect.objectContaining({
            data: {
              0: {
                data: {
                  id: "0",
                  name: rejectErrorMessage,
                },
                state: "error",
              },
            },
            state: "success",
          }),
        );
      });

      it("Throws error if reject happens in error handler", async () => {
        const statefulIndexStore: UserMapContextStore = {
          data: {
            0: {
              data: {
                id: "0",
                name: "name 0",
              },
              state: "success",
            },
          },
          state: "success",
        };
        const setContextData = jest.fn((func) => {
          // @ts-ignore: TODO fix typings before next release
          return func(statefulIndexStore);
        });
        await expect(
          getDeleteOneContextData(
            statefulIndexStore,
            setContextData,
            {
              id: "0",
            },
            {
              action: (params) => {
                return Promise.reject();
              },
              error: (params) => {
                return Promise.reject();
              },
              getIndex: () => "0",
            },
          ),
        ).rejects.toEqual(errorMessages.errorCallbackRejected);
      });
    });

    describe("action throws", () => {
      it("rejects request and updates state to loading then error", async () => {
        const rejectErrorMessage = "Test reject error message";

        const statefulIndexStore: UserMapContextStore = {
          data: {
            0: {
              data: {
                id: "0",
                name: "name 0",
              },
              state: "success",
            },
          },
          state: "success",
        };
        const setContextData = jest.fn((func) => {
          // @ts-ignore: TODO fix typings before next release
          return func(statefulIndexStore);
        });
        await expect(
          getDeleteOneContextData(
            statefulIndexStore,
            setContextData,
            {
              id: "0",
            },
            {
              action: (params) => {
                throw new Error(rejectErrorMessage);
              },
              getIndex: () => "0",
            },
          ),
        ).rejects.toEqual(rejectErrorMessage);

        expect(setContextData).toHaveBeenCalledTimes(2);
        // Expect setContextData to have been called first with loading
        expect(setContextData).toHaveNthReturnedWith(
          1,
          expect.objectContaining({
            data: {
              0: {
                data: {
                  id: "0",
                  name: "name 0",
                },
                state: "loading",
              },
            },
            state: "success",
          }),
        );
        // Expect setContextData to have been last called with error
        expect(setContextData).toHaveNthReturnedWith(
          2,
          expect.objectContaining({
            data: {
              0: {
                data: {
                  id: "0",
                  name: "name 0",
                },
                state: "error",
              },
            },
            state: "success",
          }),
        );
      });

      it("rejects request and updates state to loading then custom error", async () => {
        const rejectErrorMessage = "Test reject error message";

        const statefulIndexStore: UserMapContextStore = {
          data: {
            0: {
              data: {
                id: "0",
                name: "name 0",
              },
              state: "success",
            },
          },
          state: "success",
        };
        const setContextData = jest.fn((func) => {
          // @ts-ignore: TODO fix typings before next release
          return func(statefulIndexStore);
        });
        await expect(
          getDeleteOneContextData(
            statefulIndexStore,
            setContextData,
            {
              id: "0",
            },
            {
              action: (params) => {
                throw new Error(rejectErrorMessage);
              },
              error: (params) => {
                return Promise.resolve({
                  ...params,
                  name: rejectErrorMessage,
                });
              },
              getIndex: () => "0",
            },
          ),
        ).rejects.toEqual(rejectErrorMessage);

        expect(setContextData).toHaveBeenCalledTimes(2);
        // Expect setContextData to have been called first with loading
        expect(setContextData).toHaveNthReturnedWith(
          1,
          expect.objectContaining({
            data: {
              0: {
                data: {
                  id: "0",
                  name: "name 0",
                },
                state: "loading",
              },
            },
            state: "success",
          }),
        );
        // Expect setContextData to have been last called with error
        expect(setContextData).toHaveNthReturnedWith(
          2,
          expect.objectContaining({
            data: {
              0: {
                data: {
                  id: "0",
                  name: rejectErrorMessage,
                },
                state: "error",
              },
            },
            state: "success",
          }),
        );
      });

      it("Throws error if reject happens in error handler", async () => {
        const statefulIndexStore: UserMapContextStore = {
          data: {
            0: {
              data: {
                id: "0",
                name: "name 0",
              },
              state: "success",
            },
          },
          state: "success",
        };
        const setContextData = jest.fn((func) => {
          // @ts-ignore: TODO fix typings before next release
          return func(statefulIndexStore);
        });
        await expect(
          getDeleteOneContextData(
            statefulIndexStore,
            setContextData,
            {
              id: "0",
            },
            {
              action: (params) => {
                throw new Error("Throw in action");
              },
              error: (params) => {
                throw new Error("Throw in error");
              },
              getIndex: () => "0",
            },
          ),
        ).rejects.toEqual(errorMessages.errorCallbackRejected);

        expect(setContextData).toHaveBeenCalledTimes(2);
        // Expect setContextData to have been called first with loading
        expect(setContextData).toHaveNthReturnedWith(
          1,
          expect.objectContaining({
            data: {
              0: {
                data: {
                  id: "0",
                  name: "name 0",
                },
                state: "loading",
              },
            },
            state: "success",
          }),
        );
        // Expect setContextData to have been last called with error
        expect(setContextData).toHaveNthReturnedWith(
          2,
          expect.objectContaining({
            data: {
              0: {
                data: {
                  id: "0",
                  name: "name 0",
                },
                state: "error",
              },
            },
            state: "success",
          }),
        );
      });
    });
  });

  describe("Proactive", () => {
    it("Removes data proactively if preload resolves null", async () => {
      const statefulIndexStore: UserMapContextStore = {
        data: {
          0: {
            data: {
              id: "0",
              name: "name 0",
            },
            state: "success",
          },
        },
        state: "success",
      };
      const setContextData = jest.fn((func) => {
        // @ts-ignore: TODO fix typings before next release
        return func(statefulIndexStore);
      });
      const result = await getDeleteOneContextData(
        statefulIndexStore,
        setContextData,
        {
          id: "0",
        },
        {
          action: (params) => {
            return Promise.resolve();
          },
          getIndex: () => "0",
          preload: (params) => {
            return Promise.resolve(null);
          },
        },
      );

      // Expect the return of the call to give me the return value of the promise
      expect(result).toMatchObject({
        id: "0",
        name: "name 0",
      });
      // Expect setContextData to have been called first with loading
      expect(setContextData).toHaveNthReturnedWith(
        1,
        expect.objectContaining({
          data: {},
          state: "success",
        }),
      );
      // Expect setContextData to have been called first with then success
      expect(setContextData).toHaveNthReturnedWith(
        2,
        expect.objectContaining({
          data: {},
          state: "success",
        }),
      );
    });
  });

  it("Deletes an entry when action is defined", async () => {
    const statefulIndexStore: UserMapContextStore = {
      data: {
        0: {
          data: {
            id: "0",
            name: "name 0",
          },
          state: "success",
        },
      },
      state: "success",
    };
    const setContextData = jest.fn((func) => {
      // @ts-ignore: TODO fix typings before next release
      return func(statefulIndexStore);
    });

    let result: any;
    await act(async () => {
      result = await setContextDataForDeleteOne(
        statefulIndexStore,
        setContextData,
        {
          id: "0",
        },
        () => "0",
        "loading",
        (params) => {
          return Promise.resolve(null);
        },
      );
    });

    // Expect the return of the call to give me the return value of the promise
    expect(result).toMatchObject({
      id: "0",
      name: "name 0",
    });
    // Expect setContextData to have been set with the new store information
    expect(setContextData).toHaveNthReturnedWith(
      1,
      expect.objectContaining({
        data: {},
        state: "success",
      }),
    );
  });

  it("Deletes an entry", () => {
    const statefulIndexStore: UserMapContextStore = {
      data: {
        0: {
          data: {
            id: "0",
            name: "name 0",
          },
          state: "success",
        },
      },
      state: "success",
    };
    const result = getUpdatedContextDataForDeleteOne(statefulIndexStore, 1);

    expect(result).toMatchObject({
      data: {},
      state: "success",
    });
  });
});
