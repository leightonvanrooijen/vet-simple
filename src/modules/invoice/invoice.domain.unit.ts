import { Invoice } from "./invoice.domain"
import { matchAnyUuid } from "../../_packages/test/matchers"

describe("Invoice", () => {
  describe("initial state", () => {
    it("default", () => {
      const invoice = new Invoice(undefined, "123")

      expect(invoice.id).toEqual(matchAnyUuid)
      expect(invoice.customerId).toEqual("123")
      expect(invoice.state).toEqual("draft")
      expect(invoice.orders).toEqual([])
    })
    it("generates an id", () => {
      const invoice = new Invoice(undefined, "123", "draft")
      expect(invoice.id).toEqual(matchAnyUuid)
    })
    it("throws if there is no customerId", () => {
      const invoice = () => new Invoice(undefined, "")
      expect(invoice).toThrow("An Invoice must contain an customerId")
    })
  })
})
