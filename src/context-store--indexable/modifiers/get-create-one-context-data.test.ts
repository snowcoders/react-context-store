import { beforeEach, describe, it, jest } from "@jest/globals";
import { ContextStore } from "../../context-store--basic/index.js";
import { errorMessages } from "../../shared/index.js";
import { getTestName } from "../../test-utils/get-test-name.js";
import {
  getCreateOneContextData,
  getUpdatedContextDataForCreateOne,
  setContextDataForCreateOne,
} from "./get-create-one-context-data.js";

type User = {
  id: string;
  name: string;
};

type UserMapContextStore = ContextStore<{
  [key: string]: User;
}>;
type UserArrayContextStore = ContextStore<Array<User>>;
describe(getTestName(import.meta.url), () => {
  describe("getCreateOneContextData", () => {
    let errorString: string;

    beforeEach(() => {
      errorString = "Whoops!";
    });

    describe("Object storage", () => {
      it("Add a new entry", async () => {
        const statefulIndexStore: UserMapContextStore = {
          data: {
            0: {
              id: "0",
              name: "name 0",
            },
          },
          state: "success",
        };
        const setContextData = jest.fn((func) => {
          // @ts-ignore: TODO figure out this typescript error
          // @ts-ignore: TODO fix typings before next release
          return func(statefulIndexStore);
        });
        const result = await getCreateOneContextData(
          statefulIndexStore,
          setContextData,
          {
            id: "1",
            name: "name 1",
          },
          {
            action: (params) => {
              return Promise.resolve(params);
            },
            getIndex: () => "1",
          },
        );

        // Expect the return of the call to give me the return value of the promise
        expect(result).toMatchObject({
          id: "1",
          name: "name 1",
        });
        // Expect setContextData to have been called first with loading
        expect(setContextData).toHaveNthReturnedWith(
          1,
          expect.objectContaining({
            data: {
              0: {
                id: "0",
                name: "name 0",
              },
            },
            state: "loading",
          }),
        );
        // Expect setContextData to have been called first with then success
        expect(setContextData).toHaveNthReturnedWith(
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
          }),
        );
      });

      it("Add a new entry in preload and updates it in action", async () => {
        const statefulIndexStore: UserMapContextStore = {
          data: {
            0: {
              id: "0",
              name: "name 0",
            },
          },
          state: "success",
        };
        const setContextData = jest.fn((func) => {
          // @ts-ignore: TODO figure out this typescript error
          // @ts-ignore: TODO fix typings before next release
          return func(statefulIndexStore);
        });
        const result = await getCreateOneContextData(
          statefulIndexStore,
          setContextData,
          {
            id: "1",
            name: "name 1",
          },
          {
            action: (params) => {
              return Promise.resolve(params);
            },
            getIndex: () => "1",
            preload: (params) => {
              return Promise.resolve(params);
            },
          },
        );

        // Expect the return of the call to give me the return value of the promise
        expect(result).toMatchObject({
          id: "1",
          name: "name 1",
        });
        // Expect setContextData to have been called first with loading
        expect(setContextData).toHaveNthReturnedWith(
          1,
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
          }),
        );
        // Expect setContextData to have been called first with then success
        expect(setContextData).toHaveNthReturnedWith(
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
          }),
        );
      });

      it("Add a new entry in preload, throws error in action, cleans up data", async () => {
        const statefulIndexStore: UserMapContextStore = {
          data: {
            0: {
              id: "0",
              name: "name 0",
            },
          },
          state: "success",
        };
        const setContextData = jest.fn((func) => {
          // @ts-ignore: TODO figure out this typescript error
          // @ts-ignore: TODO fix typings before next release
          return func(statefulIndexStore);
        });

        // Expect the call to reject with the same error found in the action
        await expect(
          getCreateOneContextData(
            statefulIndexStore,
            setContextData,
            {
              id: "1",
              name: "name 1",
            },
            {
              action: (params) => {
                throw new Error(errorString);
              },
              getIndex: () => "1",
              preload: (params) => {
                return Promise.resolve(params);
              },
            },
          ),
        ).rejects.toEqual(errorString);

        // Expect setContextData to have been called first with loading
        expect(setContextData).toHaveNthReturnedWith(
          1,
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
          }),
        );
        // Expect setContextData to have been called first with then success
        expect(setContextData).toHaveNthReturnedWith(
          2,
          expect.objectContaining({
            data: {
              0: {
                id: "0",
                name: "name 0",
              },
            },
            state: "error",
          }),
        );
      });

      it("Add a new entry in preload, rejects in action, cleans up data", async () => {
        const statefulIndexStore: UserMapContextStore = {
          data: {
            0: {
              id: "0",
              name: "name 0",
            },
          },
          state: "success",
        };
        const setContextData = jest.fn((func) => {
          // @ts-ignore: TODO figure out this typescript error
          // @ts-ignore: TODO fix typings before next release
          return func(statefulIndexStore);
        });

        // Expect the call to reject with the same error found in the action
        await expect(
          getCreateOneContextData(
            statefulIndexStore,
            setContextData,
            {
              id: "1",
              name: "name 1",
            },
            {
              action: (params) => {
                return Promise.reject(errorString);
              },
              getIndex: () => "1",
              preload: (params) => {
                return Promise.resolve(params);
              },
            },
          ),
        ).rejects.toEqual(errorString);

        // Expect setContextData to have been called first with loading
        expect(setContextData).toHaveNthReturnedWith(
          1,
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
          }),
        );
        // Expect setContextData to have been called first with then success
        expect(setContextData).toHaveNthReturnedWith(
          2,
          expect.objectContaining({
            data: {
              0: {
                id: "0",
                name: "name 0",
              },
            },
            state: "error",
          }),
        );
      });

      it("Add a new entry in preload, rejects in action, error handler resolve null, cleans up data", async () => {
        const statefulIndexStore: UserMapContextStore = {
          data: {
            0: {
              id: "0",
              name: "name 0",
            },
          },
          state: "success",
        };
        const setContextData = jest.fn((func) => {
          // @ts-ignore: TODO figure out this typescript error
          // @ts-ignore: TODO fix typings before next release
          return func(statefulIndexStore);
        });

        // Expect the call to reject with the same error found in the action
        await expect(
          getCreateOneContextData(
            statefulIndexStore,
            setContextData,
            {
              id: "1",
              name: "name 1",
            },
            {
              action: (params) => {
                return Promise.reject(errorString);
              },
              error: () => {
                return Promise.resolve(null);
              },
              getIndex: () => "1",
              preload: (params) => {
                return Promise.resolve(params);
              },
            },
          ),
        ).rejects.toEqual(errorString);

        // Expect setContextData to have been called first with loading
        expect(setContextData).toHaveNthReturnedWith(
          1,
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
          }),
        );
        // Expect setContextData to have been called first with then success
        expect(setContextData).toHaveNthReturnedWith(
          2,
          expect.objectContaining({
            data: {
              0: {
                id: "0",
                name: "name 0",
              },
            },
            state: "error",
          }),
        );
      });

      it("Add a new entry in preload, rejects in action, error handler resolve a value, data left alone", async () => {
        const statefulIndexStore: UserMapContextStore = {
          data: {
            0: {
              id: "0",
              name: "name 0",
            },
          },
          state: "success",
        };
        const setContextData = jest.fn((func) => {
          // @ts-ignore: TODO figure out this typescript error
          // @ts-ignore: TODO fix typings before next release
          return func(statefulIndexStore);
        });

        // Expect the call to reject with the same error found in the action
        await expect(
          getCreateOneContextData(
            statefulIndexStore,
            setContextData,
            {
              id: "1",
              name: "name 1",
            },
            {
              action: (params) => {
                return Promise.reject(errorString);
              },
              error: () => {
                return Promise.resolve({
                  id: "1",
                  name: "error 1",
                });
              },
              getIndex: () => "1",
              preload: (params) => {
                return Promise.resolve(params);
              },
            },
          ),
        ).rejects.toEqual(errorString);

        // Expect setContextData to have been called first with loading
        expect(setContextData).toHaveNthReturnedWith(
          1,
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
          }),
        );
        // Expect setContextData to have been called first with then success
        expect(setContextData).toHaveNthReturnedWith(
          2,
          expect.objectContaining({
            data: {
              0: {
                id: "0",
                name: "name 0",
              },
              1: {
                id: "1",
                name: "error 1",
              },
            },
            state: "error",
          }),
        );
      });

      it("Rejects in action, rejects in error", async () => {
        const statefulIndexStore: UserMapContextStore = {
          data: {
            0: {
              id: "0",
              name: "name 0",
            },
          },
          state: "success",
        };
        const setContextData = jest.fn((func) => {
          // @ts-ignore: TODO figure out this typescript error
          // @ts-ignore: TODO fix typings before next release
          return func(statefulIndexStore);
        });

        // Expect the call to reject with the same error found in the action
        await expect(
          getCreateOneContextData(
            statefulIndexStore,
            setContextData,
            {
              id: "1",
              name: "name 1",
            },
            {
              action: (params) => {
                return Promise.reject(errorString);
              },
              error: () => {
                return Promise.reject(errorString);
              },
              getIndex: () => "1",
            },
          ),
        ).rejects.toEqual(errorMessages.errorCallbackRejected);

        // Expect setContextData to have been called first with loading
        expect(setContextData).toHaveNthReturnedWith(
          1,
          expect.objectContaining({
            data: {
              0: {
                id: "0",
                name: "name 0",
              },
            },
            state: "loading",
          }),
        );
        // Expect setContextData to have been called first with then success
        expect(setContextData).toHaveNthReturnedWith(
          2,
          expect.objectContaining({
            data: {
              0: {
                id: "0",
                name: "name 0",
              },
            },
            state: "error",
          }),
        );
      });

      it("Add two entries in parallel", async () => {
        const statefulIndexStore: UserMapContextStore = {
          data: {
            0: {
              id: "0",
              name: "name 0",
            },
          },
          state: "success",
        };
        const setContextData = jest.fn((func) => {
          // @ts-ignore: TODO figure out this typescript error
          // @ts-ignore: TODO fix typings before next release
          return func(statefulIndexStore);
        });

        const result = await getCreateOneContextData(
          statefulIndexStore,
          setContextData,
          {
            id: "1",
            name: "name 1",
          },
          {
            action: (params) => {
              return Promise.resolve(params);
            },
            getIndex: () => "1",
          },
        );

        // Expect the return of the call to give me the return value of the promise
        expect(result).toMatchObject({
          id: "1",
          name: "name 1",
        });
        // Expect setContextData to have been called first with loading
        expect(setContextData).toHaveNthReturnedWith(
          1,
          expect.objectContaining({
            data: {
              0: {
                id: "0",
                name: "name 0",
              },
            },
            state: "loading",
          }),
        );
        // Expect setContextData to have been called first with then success
        expect(setContextData).toHaveNthReturnedWith(
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
          }),
        );
      });
    });

    describe("Array storage - adding to beginning", () => {
      it("Add a new entry when only action is defined", async () => {
        const statefulIndexStore: UserArrayContextStore = {
          data: [
            {
              id: "0",
              name: "name 0",
            },
          ],
          state: "success",
        };
        const setContextData = jest.fn((func) => {
          // @ts-ignore: TODO figure out this typescript error
          // @ts-ignore: TODO fix typings before next release
          return func(statefulIndexStore);
        });
        const result = await getCreateOneContextData(
          statefulIndexStore,
          setContextData,
          {
            id: "1",
            name: "name 1",
          },
          {
            action: (params) => {
              return Promise.resolve(params);
            },
            getIndex: () => 0,
          },
        );

        // Expect the return of the call to give me the return value of the promise
        expect(result).toMatchObject({
          id: "1",
          name: "name 1",
        });
        // Expect setContextData to have been called first with loading
        expect(setContextData).toHaveNthReturnedWith(
          1,
          expect.objectContaining({
            data: [
              {
                id: "0",
                name: "name 0",
              },
            ],
            state: "loading",
          }),
        );
        // Expect setContextData to have been called first with then success
        expect(setContextData).toHaveNthReturnedWith(
          2,
          expect.objectContaining({
            data: [
              {
                id: "1",
                name: "name 1",
              },
              {
                id: "0",
                name: "name 0",
              },
            ],
            state: "success",
          }),
        );
      });

      it("Add a new entry in preload and updates it in action", async () => {
        const statefulIndexStore: UserArrayContextStore = {
          data: [
            {
              id: "0",
              name: "name 0",
            },
          ],
          state: "success",
        };
        const setContextData = jest.fn((func) => {
          // @ts-ignore: TODO figure out this typescript error
          // @ts-ignore: TODO fix typings before next release
          return func(statefulIndexStore);
        });
        const result = await getCreateOneContextData(
          statefulIndexStore,
          setContextData,
          {
            id: "1",
            name: "name 1",
          },
          {
            action: (params) => {
              return Promise.resolve(params);
            },
            getIndex: () => 0,
            preload: (params) => {
              return Promise.resolve(params);
            },
          },
        );

        // Expect the return of the call to give me the return value of the promise
        expect(result).toMatchObject({
          id: "1",
          name: "name 1",
        });
        // Expect setContextData to have been called first with loading
        expect(setContextData).toHaveNthReturnedWith(
          1,
          expect.objectContaining({
            data: [
              {
                id: "1",
                name: "name 1",
              },
              {
                id: "0",
                name: "name 0",
              },
            ],
            state: "loading",
          }),
        );
        // Expect setContextData to have been called first with then success
        expect(setContextData).toHaveNthReturnedWith(
          2,
          expect.objectContaining({
            data: [
              {
                id: "1",
                name: "name 1",
              },
              {
                id: "0",
                name: "name 0",
              },
            ],
            state: "success",
          }),
        );
      });

      it("Add a new entry in preload and rejects in action", async () => {
        const statefulIndexStore: UserArrayContextStore = {
          data: [
            {
              id: "0",
              name: "name 0",
            },
          ],
          state: "success",
        };
        const setContextData = jest.fn((func) => {
          // @ts-ignore: TODO figure out this typescript error
          // @ts-ignore: TODO fix typings before next release
          return func(statefulIndexStore);
        });

        // Expect the call to reject with the same error found in the action
        await expect(
          getCreateOneContextData(
            statefulIndexStore,
            setContextData,
            {
              id: "1",
              name: "name 1",
            },
            {
              action: (params) => {
                return Promise.reject(errorString);
              },
              getIndex: () => 0,
              preload: (params) => {
                return Promise.resolve(params);
              },
            },
          ),
        ).rejects.toEqual(errorString);

        // Expect setContextData to have been called first with loading
        expect(setContextData).toHaveNthReturnedWith(
          1,
          expect.objectContaining({
            data: [
              {
                id: "1",
                name: "name 1",
              },
              {
                id: "0",
                name: "name 0",
              },
            ],
            state: "loading",
          }),
        );
        // Expect setContextData to have been called first with then success
        expect(setContextData).toHaveNthReturnedWith(
          2,
          expect.objectContaining({
            data: [
              {
                id: "0",
                name: "name 0",
              },
            ],
            state: "error",
          }),
        );
      });
    });

    describe("Array storage - adding to end", () => {
      it("Add a new entry when only action is defined", async () => {
        const statefulIndexStore: UserArrayContextStore = {
          data: [
            {
              id: "0",
              name: "name 0",
            },
          ],
          state: "success",
        };
        const setContextData = jest.fn((func) => {
          // @ts-ignore: TODO figure out this typescript error
          // @ts-ignore: TODO fix typings before next release
          return func(statefulIndexStore);
        });
        const result = await getCreateOneContextData(
          statefulIndexStore,
          setContextData,
          {
            id: "1",
            name: "name 1",
          },
          {
            action: (params) => {
              return Promise.resolve(params);
            },
            getIndex: () => 1,
          },
        );

        // Expect the return of the call to give me the return value of the promise
        expect(result).toMatchObject({
          id: "1",
          name: "name 1",
        });
        // Expect setContextData to have been called first with loading
        expect(setContextData).toHaveNthReturnedWith(
          1,
          expect.objectContaining({
            data: [
              {
                id: "0",
                name: "name 0",
              },
            ],
            state: "loading",
          }),
        );
        // Expect setContextData to have been called first with then success
        expect(setContextData).toHaveNthReturnedWith(
          2,
          expect.objectContaining({
            data: [
              {
                id: "0",
                name: "name 0",
              },
              {
                id: "1",
                name: "name 1",
              },
            ],
            state: "success",
          }),
        );
      });

      it("Add a new entry in preload and updates it in action", async () => {
        const statefulIndexStore: UserArrayContextStore = {
          data: [
            {
              id: "0",
              name: "name 0",
            },
          ],
          state: "success",
        };
        const setContextData = jest.fn((func) => {
          // @ts-ignore: TODO figure out this typescript error
          // @ts-ignore: TODO fix typings before next release
          return func(statefulIndexStore);
        });
        const result = await getCreateOneContextData(
          statefulIndexStore,
          setContextData,
          {
            id: "1",
            name: "name 1",
          },
          {
            action: (params) => {
              return Promise.resolve(params);
            },
            getIndex: () => 1,
            preload: (params) => {
              return Promise.resolve(params);
            },
          },
        );

        // Expect the return of the call to give me the return value of the promise
        expect(result).toMatchObject({
          id: "1",
          name: "name 1",
        });
        // Expect setContextData to have been called first with loading
        expect(setContextData).toHaveNthReturnedWith(
          1,
          expect.objectContaining({
            data: [
              {
                id: "0",
                name: "name 0",
              },
              {
                id: "1",
                name: "name 1",
              },
            ],
            state: "loading",
          }),
        );
        // Expect setContextData to have been called first with then success
        expect(setContextData).toHaveNthReturnedWith(
          2,
          expect.objectContaining({
            data: [
              {
                id: "0",
                name: "name 0",
              },
              {
                id: "1",
                name: "name 1",
              },
            ],
            state: "success",
          }),
        );
      });

      it("Add a new entry in preload and rejects in action", async () => {
        const statefulIndexStore: UserArrayContextStore = {
          data: [
            {
              id: "0",
              name: "name 0",
            },
          ],
          state: "success",
        };
        const setContextData = jest.fn((func) => {
          // @ts-ignore: TODO figure out this typescript error
          // @ts-ignore: TODO fix typings before next release
          return func(statefulIndexStore);
        });

        // Expect the call to reject with the same error found in the action
        await expect(
          getCreateOneContextData(
            statefulIndexStore,
            setContextData,
            {
              id: "1",
              name: "name 1",
            },
            {
              action: (params) => {
                return Promise.reject(errorString);
              },
              getIndex: () => 1,
              preload: (params) => {
                return Promise.resolve(params);
              },
            },
          ),
        ).rejects.toEqual(errorString);

        // Expect setContextData to have been called first with loading
        expect(setContextData).toHaveNthReturnedWith(
          1,
          expect.objectContaining({
            data: [
              {
                id: "0",
                name: "name 0",
              },
              {
                id: "1",
                name: "name 1",
              },
            ],
            state: "loading",
          }),
        );
        // Expect setContextData to have been called first with then success
        expect(setContextData).toHaveNthReturnedWith(
          2,
          expect.objectContaining({
            data: [
              {
                id: "0",
                name: "name 0",
              },
            ],
            state: "error",
          }),
        );
      });
    });
  });

  describe("setContextDataForCreateOne", () => {
    it("Adds a new entry when action is defined", async () => {
      const statefulIndexStore: UserMapContextStore = {
        data: {
          0: {
            id: "0",
            name: "name 0",
          },
        },
        state: "success",
      };
      const setContextData = jest.fn((func) => {
        // @ts-ignore: TODO figure out this typescript error
        return func(statefulIndexStore);
      });
      const result = await setContextDataForCreateOne(
        setContextData,
        {
          id: "1",
          name: "name 1",
        },
        () => "1",
        "loading",
        (params) => {
          return Promise.resolve(params);
        },
      );

      // Expect the return of the call to give me the return value of the promise
      expect(result).toMatchObject({
        id: "1",
        name: "name 1",
      });
      // Expect setContextData to have been set with the new store information
      expect(setContextData).toHaveNthReturnedWith(
        1,
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
        }),
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
        "loading",
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
