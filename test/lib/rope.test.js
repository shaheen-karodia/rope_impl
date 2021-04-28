import { Rope, insert, append, prepend, deleteRange } from "../../lib/rope";

/*
  These tests are here as a starting point, they are not comprehensive
*/
describe("rope basics", () => {
  test("constructor", () =>
    expect(new Rope("test").toString()).toEqual("test"));
  test("append", () =>
    expect(append(new Rope("test"), "123").toString()).toEqual("test123"));
  test("prepend", () =>
    expect(prepend(new Rope("test"), "123").toString()).toEqual("123test"));
});

describe("insertion", () => {
  test("simple insertion", () =>
    expect(insert(new Rope("test"), "123", 2).toString()).toEqual("te123st"));
  test("ending insertion", () =>
    expect(insert(new Rope("test"), "123", 4).toString()).toEqual("test123"));
  test("beginning insertion", () =>
    expect(insert(new Rope("test"), "123", 0).toString()).toEqual("123test"));
});

describe("deletion", () => {
  test("simple deletion", () =>
    expect(deleteRange(new Rope("test"), 1, 3).toString()).toEqual("tt"));
  test("delete until end", () =>
    expect(deleteRange(new Rope("test"), 2, 4).toString()).toEqual("te"));
  test("delete beginning", () =>
    expect(deleteRange(new Rope("test"), 0, 2).toString()).toEqual("st"));
  test("delete then insert", () =>
    expect(
      insert(deleteRange(new Rope("test"), 1, 3), "abc", 2).toString()
    ).toEqual("ttabc"));
});
