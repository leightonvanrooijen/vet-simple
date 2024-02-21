import { TestDB } from "../../_packages/db/testDB"
import { TestProcedureRepo } from "./Procedure.repo"
import { Procedure } from "./Procedure.domain"

describe("TestProcedureRepo", () => {
  describe("create", () => {
    it("creates a procedure", async () => {
      const repo = new TestProcedureRepo()
      const procedure = new Procedure("1", "name", [], "pending")

      await repo.create(procedure)

      expect(await repo.get(procedure.id)).toEqual(procedure)
    })
  })
  describe("begin", () => {
    it("begins a procedure", async () => {
      const db = new TestDB([], "id")
      const repo = new TestProcedureRepo(db)
      const procedure = new Procedure("1", "name", [], "inProgress")

      await db.create({
        consumedItems: [],
        customerId: "name",
        id: "1",
        state: "pending",
      })

      await repo.begin(procedure)

      expect(await repo.get(procedure.id)).toEqual(procedure)
    })
  })
  describe("finish", () => {
    it("finishes a procedure", async () => {
      const db = new TestDB([], "id")
      const repo = new TestProcedureRepo(db)
      const procedure = new Procedure("1", "name", [], "finished")

      await db.create({
        consumedItems: [],
        customerId: "name",
        id: "1",
        state: "inProgress",
      })

      await repo.finish(procedure)

      expect(await repo.get(procedure.id)).toEqual(procedure)
    })
  })
  describe("get", () => {
    it("gets a procedure", async () => {
      const db = new TestDB([], "id")
      const repo = new TestProcedureRepo(db)
      const procedure = new Procedure("1", "name", [], "pending")

      await db.create({
        consumedItems: [],
        customerId: "name",
        id: "1",
        state: "pending",
      })

      const result = await repo.get(procedure.id)

      expect(result).toEqual(procedure)
    })
  })
})
