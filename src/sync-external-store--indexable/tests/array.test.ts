import { it } from "@jest/globals";
import { ArrayExampleStore } from "./array.store.js";

it("creates multiple entries without mis-ordering them", async () => {
  // Arrange
  const store = new ArrayExampleStore();
  const itemName1 = "item 2";
  const itemName2 = "item 1";

  // Act
  await store.push({
    value: itemName1,
  });
  await store.push({
    value: itemName2,
  });

  // Assert
  const { data } = store.getSnapshot();
  expect(Array.isArray(data)).toBeTruthy();
  expect(data[0]).toMatchObject({ value: itemName1 });
  expect(data[1]).toMatchObject({ value: itemName2 });
});

it("gets multiple entries without mis-ordering them", async () => {
  // Arrange
  const store = new ArrayExampleStore();

  // Act
  const item0 = await store.get({
    index: 0,
  });
  const item1 = await store.get({
    index: 1,
  });
  const item2 = await store.get({
    index: 2,
  });

  // Assert
  const { data } = store.getSnapshot();
  expect(Array.isArray(data)).toBeTruthy();
  expect(data[0]).toMatchObject(item0);
  expect(data[1]).toMatchObject(item1);
  expect(data[2]).toMatchObject(item2);
});

it("gets same entry", async () => {
  // Arrange
  const store = new ArrayExampleStore();

  // Act
  const item0 = await store.get({
    index: 0,
  });
  const item1 = await store.get({
    index: 0,
  });

  // Assert
  const { data } = store.getSnapshot();
  expect(Array.isArray(data)).toBeTruthy();
  expect(data).toHaveLength(1);
  expect(data[0]).toMatchObject(item0);
  expect(data[0]).toMatchObject(item1);
});

it("creates multiple entries and delete middle", async () => {
  // Arrange
  const store = new ArrayExampleStore();

  // Act
  const item0 = await store.get({
    index: 0,
  });
  await store.get({
    index: 1,
  });
  const item2 = await store.get({
    index: 2,
  });
  await store.delete({
    index: 1,
  });

  // Assert
  const { data } = store.getSnapshot();
  expect(Array.isArray(data)).toBeTruthy();
  expect(data[0]).toMatchObject(item0);
  expect(data[1]).toMatchObject(item2);
});
