import { Item } from "./Item.domain"

describe("Item", () => {
  describe("initial state", () => {
    it("can be created with an id and a name", () => {
      const item = new Item("123", "item 1", "2")

      expect(item.id).toBe("123")
      expect(item.name).toBe("item 1")
      expect(item.price).toBe("2")
    })
    it("generates a uuid for the id if no id is passed in", () => {
      const item = new Item(undefined, "item 1", "2")

      expect(item.id).toEqual(matchAnyUuid)
    })
    it("throws an error if no name is passed in", () => {
      expect(() => new Item("123", "", "2")).toThrow("Item must have a name")
    })
    it("throws an error if no price is passed in", () => {
      expect(() => new Item("123", "item 1", "")).toThrow("Item must have a price")
    })
  })
})

const matchAnyUuid = expect.stringMatching(/^[0-9a-f-]{36}$/)
