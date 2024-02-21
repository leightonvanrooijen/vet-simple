import { ConsumedItem, Procedure } from "./Procedure.domain"
import { matchAnyUuid } from "../../_packages/test/matchers"

describe("Procedure", () => {
  describe("initial state", () => {
    it("generates a uuid for the id if no id is passed in", () => {
      const procedure = new Procedure(undefined, "456")

      expect(procedure.id).toEqual(matchAnyUuid)
    })
    it("is set to pending if no state is passed in", () => {
      const procedure = new Procedure("123", "456")

      expect(procedure.state).toBe("pending")
    })
    it("throws an error if no customer id is passed in", () => {
      expect(() => new Procedure("123", "")).toThrow("Procedure must have a customer")
    })
    it("can be created with an array of consumed items", () => {
      const consumedItems = [new ConsumedItem(1, "1")]
      const procedure = new Procedure("123", "456", consumedItems)

      expect(procedure.consumedItems).toEqual(consumedItems)
    })
  })

  describe("consumeItem", () => {
    it("adds the item to the end of the consumed items array", () => {
      const procedure = new Procedure("123", "456", [new ConsumedItem(1, "1")])

      procedure.consumeItem("789", 1)

      expect(procedure.consumedItems[1].quantity).toBe(1)
      expect(procedure.consumedItems[1].itemId).toBe("789")
    })
    it("if the item has previously been consumed, it increases the quantity the the existing item", () => {
      const procedure = new Procedure("123", "456")

      procedure.consumeItem("789", 2)
      procedure.consumeItem("789", 1)

      expect(procedure.consumedItems[0].quantity).toBe(3)
    })
    it("throws an error if no id is passed in", () => {
      const procedure = new Procedure("123", "456")

      expect(() => procedure.consumeItem(undefined, 1)).toThrow("Consumed Item must have an item id")
    })
  })
  describe("begin", () => {
    it("sets the state to inProgress", () => {
      const procedure = new Procedure("123", "456")

      procedure.begin()

      expect(procedure.state).toBe("inProgress")
    })
    it("throws an error if the state is already in progress", () => {
      const procedure = new Procedure("123", "456", [], "inProgress")

      expect(() => procedure.begin()).toThrow("Procedure is already in progress")
    })
    it("throws an error if the state is finished", () => {
      const procedure = new Procedure("123", "456", [], "finished")

      expect(() => procedure.begin()).toThrow("Procedure is finished, it must be pending to begin")
    })
  })

  describe("finish", () => {
    it("sets the state to finished", () => {
      const procedure = new Procedure("123", "456", [], "inProgress")

      procedure.finish()

      expect(procedure.state).toBe("finished")
    })
    it("throws an error if the state is already finished", () => {
      const procedure = new Procedure("123", "456", [], "finished")

      expect(() => procedure.finish()).toThrow("Procedure is already finished")
    })
    it("throws an error if the state is pending", () => {
      const procedure = new Procedure("123", "456", [], "pending")

      expect(() => procedure.finish()).toThrow("Procedure is pending, it must be in progress to finish")
    })
  })
})
