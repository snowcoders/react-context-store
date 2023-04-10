import { describe, expect, it, jest } from "@jest/globals";
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
type UserArrayContextStore = ContextStore<Array<ContextStore<User>>>;
describe(getTestName(import.meta.url), () => {
  describe("getCreateOneContextData", () => {
    describe("adds into map", () => {
      describe("reactive", () => {
        it("Add a new entry when only action is defined", async () => {
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
            }
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
          expect(setContextData).toHaveNthReturnedWith(
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
                action: (params) => {
                  return Promise.reject(rejectMessage);
                },
                getIndex: () => "1",
              }
            )
          ).rejects.toEqual(rejectMessage);

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
                  state: "success",
                },
              },
              state: "success",
            })
          );
          // Expect setContextData to have been called first with then success
          expect(setContextData).toHaveNthReturnedWith(
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
            }
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
          expect(setContextData).toHaveNthReturnedWith(
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
                action: (params) => {
                  return Promise.reject(rejectMessage);
                },
                getIndex: () => "1",
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
          expect(setContextData).toHaveNthReturnedWith(
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
          expect(setContextData).toHaveNthReturnedWith(
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

    describe("adds into array", () => {
      describe("to the beginning", () => {
        describe("reactive", () => {
          it("Add a new entry when only action is defined", async () => {
            const statefulIndexStore: UserArrayContextStore = {
              data: [
                {
                  data: {
                    id: "0",
                    name: "name 0",
                  },
                  state: "success",
                },
              ],
              state: "success",
            };
            const setContextData = jest.fn((func) => {
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
              }
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
                    data: {
                      id: "0",
                      name: "name 0",
                    },
                    state: "success",
                  },
                ],
                state: "success",
              })
            );
            // Expect setContextData to have been called first with then success
            expect(setContextData).toHaveNthReturnedWith(
              2,
              expect.objectContaining({
                data: [
                  {
                    data: {
                      id: "1",
                      name: "name 1",
                    },
                    state: "success",
                  },
                  {
                    data: {
                      id: "0",
                      name: "name 0",
                    },
                    state: "success",
                  },
                ],
                state: "success",
              })
            );
          });

          it("Does not add anything if action fails", async () => {
            const statefulIndexStore: UserArrayContextStore = {
              data: [
                {
                  data: {
                    id: "0",
                    name: "name 0",
                  },
                  state: "success",
                },
              ],
              state: "success",
            };
            const setContextData = jest.fn((func) => {
              // @ts-ignore: TODO fix typings before next release
              return func(statefulIndexStore);
            });
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
                  action: (params) => {
                    return Promise.reject(rejectMessage);
                  },
                  getIndex: () => 0,
                }
              )
            ).rejects.toEqual(rejectMessage);

            // Expect setContextData to have been called first with loading
            expect(setContextData).toHaveNthReturnedWith(
              1,
              expect.objectContaining({
                data: [
                  {
                    data: {
                      id: "0",
                      name: "name 0",
                    },
                    state: "success",
                  },
                ],
                state: "success",
              })
            );
            // Expect setContextData to have been called first with then success
            expect(setContextData).toHaveNthReturnedWith(
              2,
              expect.objectContaining({
                data: [
                  {
                    data: {
                      id: "0",
                      name: "name 0",
                    },
                    state: "success",
                  },
                ],
                state: "success",
              })
            );
          });

          it("Leaves data if custom error handler returns a value", async () => {
            const statefulIndexStore: UserArrayContextStore = {
              data: [
                {
                  data: {
                    id: "0",
                    name: "name 0",
                  },
                  state: "success",
                },
              ],
              state: "success",
            };
            const setContextData = jest.fn((func) => {
              // @ts-ignore: TODO fix typings before next release
              return func(statefulIndexStore);
            });
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
                  action: (params) => {
                    return Promise.reject(rejectMessage);
                  },
                  error: (params) => {
                    return Promise.resolve({
                      id: "1",
                      name: "name 1",
                    });
                  },
                  getIndex: () => 0,
                }
              )
            ).rejects.toEqual(rejectMessage);

            // Expect setContextData to have been called first with loading
            expect(setContextData).toHaveNthReturnedWith(
              1,
              expect.objectContaining({
                data: [
                  {
                    data: {
                      id: "0",
                      name: "name 0",
                    },
                    state: "success",
                  },
                ],
                state: "success",
              })
            );
            // Expect setContextData to have been called first with then success
            expect(setContextData).toHaveNthReturnedWith(
              2,
              expect.objectContaining({
                data: [
                  {
                    data: {
                      id: "1",
                      name: "name 1",
                    },
                    state: "error",
                  },
                  {
                    data: {
                      id: "0",
                      name: "name 0",
                    },
                    state: "success",
                  },
                ],
                state: "success",
              })
            );
          });
        });

        describe("proactive", () => {
          it("Add a new entry when preload returns value", async () => {
            const statefulIndexStore: UserArrayContextStore = {
              data: [
                {
                  data: {
                    id: "0",
                    name: "name 0",
                  },
                  state: "success",
                },
              ],
              state: "success",
            };
            const setContextData = jest.fn((func) => {
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
              }
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
                    data: {
                      id: "1",
                      name: "name 1",
                    },
                    state: "loading",
                  },
                  {
                    data: {
                      id: "0",
                      name: "name 0",
                    },
                    state: "success",
                  },
                ],
                state: "success",
              })
            );
            // Expect setContextData to have been called first with then success
            expect(setContextData).toHaveNthReturnedWith(
              2,
              expect.objectContaining({
                data: [
                  {
                    data: {
                      id: "1",
                      name: "name 1",
                    },
                    state: "success",
                  },
                  {
                    data: {
                      id: "0",
                      name: "name 0",
                    },
                    state: "success",
                  },
                ],
                state: "success",
              })
            );
          });

          it("Removes data on action error", async () => {
            const statefulIndexStore: UserArrayContextStore = {
              data: [
                {
                  data: {
                    id: "0",
                    name: "name 0",
                  },
                  state: "success",
                },
              ],
              state: "success",
            };
            const setContextData = jest.fn((func) => {
              // @ts-ignore: TODO fix typings before next release
              return func(statefulIndexStore);
            });
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
                  action: (params) => {
                    return Promise.reject(rejectMessage);
                  },
                  getIndex: () => 0,
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
            expect(setContextData).toHaveNthReturnedWith(
              1,
              expect.objectContaining({
                data: [
                  {
                    data: {
                      id: "1",
                      name: "name 1",
                    },
                    state: "loading",
                  },
                  {
                    data: {
                      id: "0",
                      name: "name 0",
                    },
                    state: "success",
                  },
                ],
                state: "success",
              })
            );
            // Expect setContextData to have been called first with then success
            expect(setContextData).toHaveNthReturnedWith(
              2,
              expect.objectContaining({
                data: [
                  {
                    data: {
                      id: "0",
                      name: "name 0",
                    },
                    state: "success",
                  },
                ],
                state: "success",
              })
            );
          });

          it("Leaves data with an error state if error handler is defined", async () => {
            const statefulIndexStore: UserArrayContextStore = {
              data: [
                {
                  data: {
                    id: "0",
                    name: "name 0",
                  },
                  state: "success",
                },
              ],
              state: "success",
            };
            const setContextData = jest.fn((func) => {
              // @ts-ignore: TODO fix typings before next release
              return func(statefulIndexStore);
            });
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
                  action: (params) => {
                    return Promise.reject(rejectMessage);
                  },
                  error: (params) => {
                    return Promise.resolve({
                      id: "1",
                      name: "name 1",
                    });
                  },
                  getIndex: () => 0,
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
            expect(setContextData).toHaveNthReturnedWith(
              1,
              expect.objectContaining({
                data: [
                  {
                    data: {
                      id: "1",
                      name: "name 1",
                    },
                    state: "loading",
                  },
                  {
                    data: {
                      id: "0",
                      name: "name 0",
                    },
                    state: "success",
                  },
                ],
                state: "success",
              })
            );
            // Expect setContextData to have been called first with then success
            expect(setContextData).toHaveNthReturnedWith(
              2,
              expect.objectContaining({
                data: [
                  {
                    data: {
                      id: "1",
                      name: "name 1",
                    },
                    state: "error",
                  },
                  {
                    data: {
                      id: "0",
                      name: "name 0",
                    },
                    state: "success",
                  },
                ],
                state: "success",
              })
            );
          });
        });
      });

      describe("to the end", () => {
        describe("reactive", () => {
          it("Add a new entry when only action is defined", async () => {
            const statefulIndexStore: UserArrayContextStore = {
              data: [
                {
                  data: {
                    id: "0",
                    name: "name 0",
                  },
                  state: "success",
                },
              ],
              state: "success",
            };
            const setContextData = jest.fn((func) => {
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
              }
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
                    data: {
                      id: "0",
                      name: "name 0",
                    },
                    state: "success",
                  },
                ],
                state: "success",
              })
            );
            // Expect setContextData to have been called first with then success
            expect(setContextData).toHaveNthReturnedWith(
              2,
              expect.objectContaining({
                data: [
                  {
                    data: {
                      id: "0",
                      name: "name 0",
                    },
                    state: "success",
                  },
                  {
                    data: {
                      id: "1",
                      name: "name 1",
                    },
                    state: "success",
                  },
                ],
                state: "success",
              })
            );
          });

          it("Cleans up load state if action rejects", async () => {
            const statefulIndexStore: UserArrayContextStore = {
              data: [
                {
                  data: {
                    id: "0",
                    name: "name 0",
                  },
                  state: "success",
                },
              ],
              state: "success",
            };
            const setContextData = jest.fn((func) => {
              // @ts-ignore: TODO fix typings before next release
              return func(statefulIndexStore);
            });
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
                  action: (params) => {
                    return Promise.reject(rejectMessage);
                  },
                  getIndex: () => 1,
                }
              )
            ).rejects.toEqual(rejectMessage);

            // Expect setContextData to have been called first with loading
            expect(setContextData).toHaveNthReturnedWith(
              1,
              expect.objectContaining({
                data: [
                  {
                    data: {
                      id: "0",
                      name: "name 0",
                    },
                    state: "success",
                  },
                ],
                state: "success",
              })
            );
            // Expect setContextData to have been called first with then success
            expect(setContextData).toHaveNthReturnedWith(
              2,
              expect.objectContaining({
                data: [
                  {
                    data: {
                      id: "0",
                      name: "name 0",
                    },
                    state: "success",
                  },
                ],
                state: "success",
              })
            );
          });
        });

        describe("proactive", () => {
          it("Add a new entry when preload returns value", async () => {
            const statefulIndexStore: UserArrayContextStore = {
              data: [
                {
                  data: {
                    id: "0",
                    name: "name 0",
                  },
                  state: "success",
                },
              ],
              state: "success",
            };
            const setContextData = jest.fn((func) => {
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
              }
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
                    data: {
                      id: "0",
                      name: "name 0",
                    },
                    state: "success",
                  },
                  {
                    data: {
                      id: "1",
                      name: "name 1",
                    },
                    state: "loading",
                  },
                ],
                state: "success",
              })
            );
            // Expect setContextData to have been called first with then success
            expect(setContextData).toHaveNthReturnedWith(
              2,
              expect.objectContaining({
                data: [
                  {
                    data: {
                      id: "0",
                      name: "name 0",
                    },
                    state: "success",
                  },
                  {
                    data: {
                      id: "1",
                      name: "name 1",
                    },
                    state: "success",
                  },
                ],
                state: "success",
              })
            );
          });

          it("Cleans up load state if action rejects", async () => {
            const statefulIndexStore: UserArrayContextStore = {
              data: [
                {
                  data: {
                    id: "0",
                    name: "name 0",
                  },
                  state: "success",
                },
              ],
              state: "success",
            };
            const setContextData = jest.fn((func) => {
              // @ts-ignore: TODO fix typings before next release
              return func(statefulIndexStore);
            });
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
                  action: (params) => {
                    return Promise.reject(rejectMessage);
                  },
                  getIndex: () => 1,
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
            expect(setContextData).toHaveNthReturnedWith(
              1,
              expect.objectContaining({
                data: [
                  {
                    data: {
                      id: "0",
                      name: "name 0",
                    },
                    state: "success",
                  },
                  {
                    data: {
                      id: "1",
                      name: "name 1",
                    },
                    state: "loading",
                  },
                ],
                state: "success",
              })
            );
            // Expect setContextData to have been called first with then success
            expect(setContextData).toHaveNthReturnedWith(
              2,
              expect.objectContaining({
                data: [
                  {
                    data: {
                      id: "0",
                      name: "name 0",
                    },
                    state: "success",
                  },
                ],
                state: "success",
              })
            );
          });
        });
      });
    });
  });

  describe("setContextDataForCreateOne", () => {
    it("Adds a new entry when action is defined", async () => {
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
      const result = await setContextDataForCreateOne(
        setContextData,
        {
          id: "1",
          name: "name 1",
        },
        // @ts-ignore: TODO fix typings before next release
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
      expect(setContextData).toHaveNthReturnedWith(
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
