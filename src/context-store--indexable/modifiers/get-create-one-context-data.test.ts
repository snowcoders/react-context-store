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

type UserMapContextStore = ContextStore<{
  [key: string]: User;
}>;
describe(getTestName(__dirname), () => {
  describe("getCreateOneContextData", () => {
    it("Add a new entry when only action is defined", async () => {
      const setContextData = jest.fn();
      const statefulIndexStore: UserMapContextStore = {
        data: {
          0: {
            id: "0",
            name: "name 0",
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
              id: "0",
              name: "name 0",
            },
          },
          state: "loading",
        })
      );
      // Expect setContextData to have been called first with then success
      expect(setContextData).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          data: {
            0: {
              id: "0",
              name: "name 0",
            },
            1: {
              id: "1",
              name: "name 1",
            },
          },
          state: "success",
        })
      );
    });
  });

  describe("setContextDataForCreateOne", () => {
    it("Adds a new entry when action is defined", async () => {
      const setContextData = jest.fn();
      const statefulIndexStore: UserMapContextStore = {
        data: {
          0: {
            id: "0",
            name: "name 0",
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
              id: "0",
              name: "name 0",
            },
            1: {
              id: "1",
              name: "name 1",
            },
          },
          state: "loading",
        })
      );
    });
  });

  describe("getUpdatedContextDataForCreateOne", () => {
    it("Adds a new entry", () => {
      const statefulIndexStore: UserMapContextStore = {
        data: {
          0: {
            id: "0",
            name: "name 0",
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
            id: "0",
            name: "name 0",
          },
          1: {
            id: "1",
            name: "name 1",
          },
        },
        state: "loading",
      });
    });
  });
});
