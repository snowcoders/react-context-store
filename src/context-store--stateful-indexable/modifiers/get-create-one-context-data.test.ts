import { ContextStore } from "../../context-store--basic";
import { getTestName } from "../../test-utils/get-test-name";
import {
  getCreateOneContextData,
  getUpdatedContextDataForCreateOne,
  setContextDataForCreateOne,
} from "./get-create-one-context-data";

type User = {
  id: string;
  name: string;
};

type UserMapContextStore = ContextStore<{ [key: string]: ContextStore<User> }>;
describe(getTestName(__dirname), () => {
  describe("getCreateOneContextData", () => {
    describe("reactive", () => {
      it("Add a new entry when only action is defined", async () => {
        const setContextData = jest.fn();
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
        const result = await getCreateOneContextData(
          statefulIndexStore,
          setContextData,
          {
            id: "1",
            name: "name 1",
          },
          {
            getIndex: () => "1",
            action: (params) => {
              return Promise.resolve(params);
            },
          }
        );

        // Expect the return of the call to give me the return value of the promise
        expect(result).toMatchObject({
          id: "1",
          name: "name 1",
        });
        // Expect setContextData to have been called first with loading
        expect(setContextData).toHaveBeenNthCalledWith(
          1,
          expect.objectContaining({
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
          })
        );
        // Expect setContextData to have been called first with then success
        expect(setContextData).toHaveBeenNthCalledWith(
          2,
          expect.objectContaining({
            data: {
              0: {
                data: {
                  id: "0",
                  name: "name 0",
                },
                state: "success",
              },
              1: {
                data: {
                  id: "1",
                  name: "name 1",
                },
                state: "success",
              },
            },
            state: "success",
          })
        );
      });

      it("Cleans up load state if action rejects", async () => {
        const setContextData = jest.fn();
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
        const rejectMessage = "fail time";
        await expect(
          getCreateOneContextData(
            statefulIndexStore,
            setContextData,
            {
              id: "1",
              name: "name 1",
            },
            {
              getIndex: () => "1",
              action: (params) => {
                return Promise.reject(rejectMessage);
              },
            }
          )
        ).rejects.toEqual(rejectMessage);

        // Expect setContextData to have been called first with loading
        expect(setContextData).toHaveBeenNthCalledWith(
          1,
          expect.objectContaining({
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
          })
        );
        // Expect setContextData to have been called first with then success
        expect(setContextData).toHaveBeenNthCalledWith(
          2,
          expect.objectContaining({
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
          })
        );
      });
    });

    describe("proactive", () => {
      it("Add a new entry when preload returns value", async () => {
        const setContextData = jest.fn();
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
        const result = await getCreateOneContextData(
          statefulIndexStore,
          setContextData,
          {
            id: "1",
            name: "name 1",
          },
          {
            getIndex: () => "1",
            action: (params) => {
              return Promise.resolve(params);
            },
            preload: (params) => {
              return Promise.resolve(params);
            },
          }
        );

        // Expect the return of the call to give me the return value of the promise
        expect(result).toMatchObject({
          id: "1",
          name: "name 1",
        });
        // Expect setContextData to have been called first with loading
        expect(setContextData).toHaveBeenNthCalledWith(
          1,
          expect.objectContaining({
            data: {
              0: {
                data: {
                  id: "0",
                  name: "name 0",
                },
                state: "success",
              },
              1: {
                data: {
                  id: "1",
                  name: "name 1",
                },
                state: "loading",
              },
            },
            state: "success",
          })
        );
        // Expect setContextData to have been called first with then success
        expect(setContextData).toHaveBeenNthCalledWith(
          2,
          expect.objectContaining({
            data: {
              0: {
                data: {
                  id: "0",
                  name: "name 0",
                },
                state: "success",
              },
              1: {
                data: {
                  id: "1",
                  name: "name 1",
                },
                state: "success",
              },
            },
            state: "success",
          })
        );
      });

      it("Cleans up load state if action rejects", async () => {
        const setContextData = jest.fn();
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
        const rejectMessage = "fail time";
        await expect(
          getCreateOneContextData(
            statefulIndexStore,
            setContextData,
            {
              id: "1",
              name: "name 1",
            },
            {
              getIndex: () => "1",
              action: (params) => {
                return Promise.reject(rejectMessage);
              },
              preload: (params) => {
                return Promise.resolve({
                  id: "1",
                  name: "name 1",
                });
              },
            }
          )
        ).rejects.toEqual(rejectMessage);

        // Expect setContextData to have been called first with loading
        expect(setContextData).toHaveBeenNthCalledWith(
          1,
          expect.objectContaining({
            data: {
              0: {
                data: {
                  id: "0",
                  name: "name 0",
                },
                state: "success",
              },
              1: {
                data: {
                  id: "1",
                  name: "name 1",
                },
                state: "loading",
              },
            },
            state: "success",
          })
        );
        // Expect setContextData to have been called first with then success
        expect(setContextData).toHaveBeenNthCalledWith(
          2,
          expect.objectContaining({
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
          })
        );
      });
    });
  });

  describe("setContextDataForCreateOne", () => {
    it("Adds a new entry when action is defined", async () => {
      const setContextData = jest.fn();
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
      const result = await setContextDataForCreateOne(
        statefulIndexStore,
        setContextData,
        {
          id: "1",
          name: "name 1",
        },
        () => "1",
        "loading",
        (params) => {
          return Promise.resolve(params);
        }
      );

      // Expect the return of the call to give me the return value of the promise
      expect(result).toMatchObject({
        id: "1",
        name: "name 1",
      });
      // Expect setContextData to have been set with the new store information
      expect(setContextData).toHaveBeenCalledWith(
        expect.objectContaining({
          data: {
            0: {
              data: {
                id: "0",
                name: "name 0",
              },
              state: "success",
            },
            1: {
              data: {
                id: "1",
                name: "name 1",
              },
              state: "loading",
            },
          },
          state: "success",
        })
      );
    });
  });

  describe("getUpdatedContextDataForCreateOne", () => {
    it("Adds a new entry", () => {
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
      const result = getUpdatedContextDataForCreateOne(
        statefulIndexStore,
        1,
        {
          id: "1",
          name: "name 1",
        },
        "loading"
      );

      expect(result).toMatchObject({
        data: {
          0: {
            data: {
              id: "0",
              name: "name 0",
            },
            state: "success",
          },
          1: {
            data: {
              id: "1",
              name: "name 1",
            },
            state: "loading",
          },
        },
        state: "success",
      });
    });
  });
});
