import { beforeEach, describe, it, jest } from "@jest/globals";
import { ContextStore } from "../../context-store--basic";
import { errorMessages } from "../../shared";
import { getTestName } from "../../test-utils/get-test-name";
import { getUpdateOneContextData } from "./get-update-one-context-data";

type User = {
  id: string;
  name: string;
  title: string;
};

type UserMapContextStore = ContextStore<{
  [key: string]: User;
}>;
type UserArrayContextStore = ContextStore<User[]>;
describe(getTestName(import.meta.url), () => {
  let errorString: string;

  beforeEach(() => {
    errorString = "Whoops!";
  });

  describe("Map", () => {
    it("Updates via action resolves", async () => {
      const statefulIndexStore: UserMapContextStore = {
        data: {
          0: {
            id: "0",
            name: "name 0",
            title: "title 0",
          },
        },
        state: "success",
      };
      const setContextData = jest.fn((func) => {
        // @ts-ignore: TODO fix typings before next release
        return func(statefulIndexStore);
      });
      const result = await getUpdateOneContextData(
        statefulIndexStore,
        setContextData,
        {
          name: "name 1",
        },
        {
          action: (params) => {
            return Promise.resolve({
              name: params.name,
            });
          },
          getIndex: () => "0",
        }
      );

      // Expect the return of the call to give me the return value of the promise
      expect(result).toMatchObject({
        id: "0",
        name: "name 1",
        title: "title 0",
      });
      // Expect setContextData to have been called first with loading
      expect(setContextData).toHaveNthReturnedWith(
        1,
        expect.objectContaining({
          data: {
            0: {
              id: "0",
              name: "name 0",
              title: "title 0",
            },
          },
          state: "loading",
        })
      );
      // Expect setContextData to have been called first with then success
      expect(setContextData).toHaveNthReturnedWith(
        2,
        expect.objectContaining({
          data: {
            0: {
              id: "0",
              name: "name 1",
              title: "title 0",
            },
          },
          state: "success",
        })
      );
    });

    it("Updates via preload and action", async () => {
      const statefulIndexStore: UserMapContextStore = {
        data: {
          0: {
            id: "0",
            name: "name 0",
            title: "title 0",
          },
        },
        state: "success",
      };
      const setContextData = jest.fn((func) => {
        // @ts-ignore: TODO fix typings before next release
        return func(statefulIndexStore);
      });
      const result = await getUpdateOneContextData(
        statefulIndexStore,
        setContextData,
        {
          name: "name 1",
        },
        {
          action: (params) => {
            return Promise.resolve({
              name: "New name 2",
            });
          },
          getIndex: () => "0",
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
        title: "title 0",
      });
      // Expect setContextData to have been called first with loading
      expect(setContextData).toHaveNthReturnedWith(
        1,
        expect.objectContaining({
          data: {
            0: {
              id: "0",
              name: "New name",
              title: "title 0",
            },
          },
          state: "loading",
        })
      );
      // Expect setContextData to have been called first with then success
      expect(setContextData).toHaveNthReturnedWith(
        2,
        expect.objectContaining({
          data: {
            0: {
              id: "0",
              name: "New name 2",
              title: "title 0",
            },
          },
          state: "success",
        })
      );
    });

    it("Rejects in action", async () => {
      const statefulIndexStore: UserMapContextStore = {
        data: {
          0: {
            id: "0",
            name: "name 0",
            title: "title 0",
          },
        },
        state: "success",
      };
      const setContextData = jest.fn((func) => {
        // @ts-ignore: TODO fix typings before next release
        return func(statefulIndexStore);
      });
      await expect(
        getUpdateOneContextData(
          statefulIndexStore,
          setContextData,
          {
            name: "name 1",
          },
          {
            action: (params) => {
              return Promise.reject(errorString);
            },
            getIndex: () => "0",
          }
        )
      ).rejects.toEqual(errorString);

      // Expect setContextData to have been called first with loading
      expect(setContextData).toHaveNthReturnedWith(
        1,
        expect.objectContaining({
          data: {
            0: {
              id: "0",
              name: "name 0",
              title: "title 0",
            },
          },
          state: "loading",
        })
      );
      // Expect setContextData to have been called first with then success
      expect(setContextData).toHaveNthReturnedWith(
        2,
        expect.objectContaining({
          data: {
            0: {
              id: "0",
              name: "name 0",
              title: "title 0",
            },
          },
          state: "error",
        })
      );
    });

    it("Throws in action", async () => {
      const statefulIndexStore: UserMapContextStore = {
        data: {
          0: {
            id: "0",
            name: "name 0",
            title: "title 0",
          },
        },
        state: "success",
      };
      const setContextData = jest.fn((func) => {
        // @ts-ignore: TODO fix typings before next release
        return func(statefulIndexStore);
      });
      await expect(
        getUpdateOneContextData(
          statefulIndexStore,
          setContextData,
          {
            name: "name 1",
          },
          {
            action: (params) => {
              throw new Error(errorString);
            },
            getIndex: () => "0",
          }
        )
      ).rejects.toEqual(errorString);

      // Expect setContextData to have been called first with loading
      expect(setContextData).toHaveNthReturnedWith(
        1,
        expect.objectContaining({
          data: {
            0: {
              id: "0",
              name: "name 0",
              title: "title 0",
            },
          },
          state: "loading",
        })
      );
      // Expect setContextData to have been called first with then success
      expect(setContextData).toHaveNthReturnedWith(
        2,
        expect.objectContaining({
          data: {
            0: {
              id: "0",
              name: "name 0",
              title: "title 0",
            },
          },
          state: "error",
        })
      );
    });

    it("Rejects in action, rejects in error", async () => {
      const statefulIndexStore: UserMapContextStore = {
        data: {
          0: {
            id: "0",
            name: "name 0",
            title: "title 0",
          },
        },
        state: "success",
      };
      const setContextData = jest.fn((func) => {
        // @ts-ignore: TODO fix typings before next release
        return func(statefulIndexStore);
      });
      await expect(
        getUpdateOneContextData(
          statefulIndexStore,
          setContextData,
          {
            name: "name 1",
          },
          {
            action: (params) => {
              return Promise.reject(errorString);
            },
            error: (params) => {
              return Promise.reject(errorString);
            },
            getIndex: () => "0",
          }
        )
      ).rejects.toEqual(errorMessages.errorCallbackRejected);

      // Expect setContextData to have been called first with loading
      expect(setContextData).toHaveNthReturnedWith(
        1,
        expect.objectContaining({
          data: {
            0: {
              id: "0",
              name: "name 0",
              title: "title 0",
            },
          },
          state: "loading",
        })
      );
      // Expect setContextData to have been called first with then success
      expect(setContextData).toHaveNthReturnedWith(
        2,
        expect.objectContaining({
          data: {
            0: {
              id: "0",
              name: "name 0",
              title: "title 0",
            },
          },
          state: "error",
        })
      );
    });

    it("Rejects when index cannot be found", async () => {
      const statefulIndexStore: UserMapContextStore = {
        data: {
          0: {
            id: "0",
            name: "name 0",
            title: "title 0",
          },
        },
        state: "success",
      };
      const setContextData = jest.fn((func) => {
        // @ts-ignore: TODO fix typings before next release
        return func(statefulIndexStore);
      });
      await expect(
        getUpdateOneContextData(
          statefulIndexStore,
          setContextData,
          {
            name: "name 1",
          },
          {
            action: (params) => {
              return Promise.resolve({
                name: params.name,
              });
            },
            getIndex: () => "NOT_FOUND",
          }
        )
      ).rejects.toEqual(errorMessages.indexNotFound);
    });
  });

  describe("Array", () => {
    it("Updates via action resolves", async () => {
      const statefulIndexStore: UserArrayContextStore = {
        data: [
          {
            id: "0",
            name: "name 0",
            title: "title 0",
          },
        ],
        state: "success",
      };
      const setContextData = jest.fn((func) => {
        // @ts-ignore: TODO fix typings before next release
        return func(statefulIndexStore);
      });
      const result = await getUpdateOneContextData(
        statefulIndexStore,
        setContextData,
        {
          name: "name 1",
        },
        {
          action: (params) => {
            return Promise.resolve({
              name: params.name,
            });
          },
          getIndex: () => 0,
        }
      );

      // Expect the return of the call to give me the return value of the promise
      expect(result).toMatchObject({
        id: "0",
        name: "name 1",
        title: "title 0",
      });
      // Expect setContextData to have been called first with loading
      expect(setContextData).toHaveNthReturnedWith(
        1,
        expect.objectContaining({
          data: [
            {
              id: "0",
              name: "name 0",
              title: "title 0",
            },
          ],
          state: "loading",
        })
      );
      // Expect setContextData to have been called first with then success
      expect(setContextData).toHaveNthReturnedWith(
        2,
        expect.objectContaining({
          data: [
            {
              id: "0",
              name: "name 1",
              title: "title 0",
            },
          ],
          state: "success",
        })
      );
    });

    it("Updates via preload and action", async () => {
      const statefulIndexStore: UserArrayContextStore = {
        data: [
          {
            id: "0",
            name: "name 0",
            title: "title 0",
          },
        ],
        state: "success",
      };
      const setContextData = jest.fn((func) => {
        // @ts-ignore: TODO fix typings before next release
        return func(statefulIndexStore);
      });
      const result = await getUpdateOneContextData(
        statefulIndexStore,
        setContextData,
        {
          name: "name 1",
        },
        {
          action: (params) => {
            return Promise.resolve({
              name: "New name 2",
            });
          },
          getIndex: () => 0,
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
        title: "title 0",
      });
      // Expect setContextData to have been called first with loading
      expect(setContextData).toHaveNthReturnedWith(
        1,
        expect.objectContaining({
          data: [
            {
              id: "0",
              name: "New name",
              title: "title 0",
            },
          ],
          state: "loading",
        })
      );
      // Expect setContextData to have been called first with then success
      expect(setContextData).toHaveNthReturnedWith(
        2,
        expect.objectContaining({
          data: [
            {
              id: "0",
              name: "New name 2",
              title: "title 0",
            },
          ],
          state: "success",
        })
      );
    });

    it("Rejects in action", async () => {
      const statefulIndexStore: UserArrayContextStore = {
        data: [
          {
            id: "0",
            name: "name 0",
            title: "title 0",
          },
        ],
        state: "success",
      };
      const setContextData = jest.fn((func) => {
        // @ts-ignore: TODO fix typings before next release
        return func(statefulIndexStore);
      });
      await expect(
        getUpdateOneContextData(
          statefulIndexStore,
          setContextData,
          {
            name: "name 1",
          },
          {
            action: (params) => {
              return Promise.reject(errorString);
            },
            getIndex: () => 0,
          }
        )
      ).rejects.toEqual(errorString);

      // Expect setContextData to have been called first with loading
      expect(setContextData).toHaveNthReturnedWith(
        1,
        expect.objectContaining({
          data: [
            {
              id: "0",
              name: "name 0",
              title: "title 0",
            },
          ],
          state: "loading",
        })
      );
      // Expect setContextData to have been called first with then success
      expect(setContextData).toHaveNthReturnedWith(
        2,
        expect.objectContaining({
          data: [
            {
              id: "0",
              name: "name 0",
              title: "title 0",
            },
          ],
          state: "error",
        })
      );
    });

    it("Throws in action", async () => {
      const statefulIndexStore: UserArrayContextStore = {
        data: [
          {
            id: "0",
            name: "name 0",
            title: "title 0",
          },
        ],
        state: "success",
      };
      const setContextData = jest.fn((func) => {
        // @ts-ignore: TODO fix typings before next release
        return func(statefulIndexStore);
      });
      await expect(
        getUpdateOneContextData(
          statefulIndexStore,
          setContextData,
          {
            name: "name 1",
          },
          {
            action: (params) => {
              throw new Error(errorString);
            },
            getIndex: () => 0,
          }
        )
      ).rejects.toEqual(errorString);

      // Expect setContextData to have been called first with loading
      expect(setContextData).toHaveNthReturnedWith(
        1,
        expect.objectContaining({
          data: [
            {
              id: "0",
              name: "name 0",
              title: "title 0",
            },
          ],
          state: "loading",
        })
      );
      // Expect setContextData to have been called first with then success
      expect(setContextData).toHaveNthReturnedWith(
        2,
        expect.objectContaining({
          data: [
            {
              id: "0",
              name: "name 0",
              title: "title 0",
            },
          ],
          state: "error",
        })
      );
    });

    it("Rejects in action, rejects in error", async () => {
      const statefulIndexStore: UserArrayContextStore = {
        data: [
          {
            id: "0",
            name: "name 0",
            title: "title 0",
          },
        ],
        state: "success",
      };
      const setContextData = jest.fn((func) => {
        // @ts-ignore: TODO fix typings before next release
        return func(statefulIndexStore);
      });
      await expect(
        getUpdateOneContextData(
          statefulIndexStore,
          setContextData,
          {
            name: "name 1",
          },
          {
            action: (params) => {
              return Promise.reject(errorString);
            },
            error: (params) => {
              return Promise.reject(errorString);
            },
            getIndex: () => 0,
          }
        )
      ).rejects.toEqual(errorMessages.errorCallbackRejected);

      // Expect setContextData to have been called first with loading
      expect(setContextData).toHaveNthReturnedWith(
        1,
        expect.objectContaining({
          data: [
            {
              id: "0",
              name: "name 0",
              title: "title 0",
            },
          ],
          state: "loading",
        })
      );
      // Expect setContextData to have been called first with then success
      expect(setContextData).toHaveNthReturnedWith(
        2,
        expect.objectContaining({
          data: [
            {
              id: "0",
              name: "name 0",
              title: "title 0",
            },
          ],
          state: "error",
        })
      );
    });

    it("Rejects when index cannot be found", async () => {
      const statefulIndexStore: UserArrayContextStore = {
        data: [
          {
            id: "0",
            name: "name 0",
            title: "title 0",
          },
        ],
        state: "success",
      };
      const setContextData = jest.fn((func) => {
        // @ts-ignore: TODO fix typings before next release
        return func(statefulIndexStore);
      });
      await expect(
        getUpdateOneContextData(
          statefulIndexStore,
          setContextData,
          {
            name: "name 1",
          },
          {
            action: (params) => {
              return Promise.resolve({
                name: params.name,
              });
            },
            getIndex: () => -1,
          }
        )
      ).rejects.toEqual(errorMessages.indexNotFound);
    });
  });
});
