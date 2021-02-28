import { ContextStore } from "../../context-store--basic";
import { errorMessages } from "../../shared";
import { getTestName } from "../../test-utils/get-test-name";
import {
  getUpdateOneContextData,
  getUpdatedContextDataForUpdateOne,
  setContextDataForUpdateOne,
} from "./get-update-one-context-data";

type User = {
  id: string;
  name: string;
};

type UserMapContextStore = ContextStore<{
  [key: string]: ContextStore<User>;
}>;
describe(getTestName(__dirname), () => {
  describe("getUpdateOneContextData", () => {
    it("Updates an entry when only action is defined", async () => {
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
      const result = await getUpdateOneContextData(
        statefulIndexStore,
        setContextData,
        {
          name: "name 1",
        },
        {
          getIndex: () => "0",
          action: (params) => {
            return Promise.resolve({
              name: params.name,
            });
          },
        }
      );

      // Expect the return of the call to give me the return value of the promise
      expect(result).toMatchObject({
        id: "0",
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
                name: "name 1",
              },
              state: "success",
            },
          },
          state: "success",
        })
      );
    });

    it("Updates an entry when preload", async () => {
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
      const result = await getUpdateOneContextData(
        statefulIndexStore,
        setContextData,
        {
          name: "name 1",
        },
        {
          getIndex: () => "0",
          action: (params) => {
            return Promise.resolve({
              name: "New name 2",
            });
          },
          preload: (params) => {
            return Promise.resolve({
              name: "New name",
            });
          },
        }
      );

      // Expect the return of the call to give me the return value of the promise
      expect(result).toMatchObject({
        id: "0",
        name: "New name 2",
      });
      // Expect setContextData to have been called first with loading
      expect(setContextData).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          data: {
            0: {
              data: {
                id: "0",
                name: "New name",
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
                name: "New name 2",
              },
              state: "success",
            },
          },
          state: "success",
        })
      );
    });

    it("Rejects when index cannot be found", async () => {
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
      await expect(
        getUpdateOneContextData(
          statefulIndexStore,
          setContextData,
          {
            name: "name 1",
          },
          {
            getIndex: () => "NOT_FOUND",
            action: (params) => {
              return Promise.resolve({
                name: params.name,
              });
            },
          }
        )
      ).rejects.toEqual(errorMessages.indexNotFound);
    });
  });

  describe("setContextDataForUpdateOne", () => {
    it("Updates an existing entry when action is defined", async () => {
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
      const result = await setContextDataForUpdateOne(
        statefulIndexStore,
        setContextData,
        {
          name: "name 1",
        },
        () => "0",
        "loading",
        (params) => {
          return Promise.resolve(params);
        }
      );

      // Expect the return of the call to give me the return value of the promise
      expect(result).toMatchObject({
        id: "0",
        name: "name 1",
      });
      // Expect setContextData to have been set with the new store information
      expect(setContextData).toHaveBeenCalledWith(
        expect.objectContaining({
          data: {
            0: {
              data: {
                id: "0",
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

  describe("getUpdatedContextDataForUpdateOne", () => {
    it("Updates existing entry", () => {
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
      const result = getUpdatedContextDataForUpdateOne(
        statefulIndexStore,
        0,
        {
          name: "name 1",
        },
        "loading"
      );

      expect(result).toMatchObject({
        data: {
          0: {
            data: {
              id: "0",
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
