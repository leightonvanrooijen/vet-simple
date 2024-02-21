import { DataStore, TestDB } from "../../_packages/db/testDB"
import { ConsumedItem, Procedure } from "./Procedure.domain"

type ProcedureSave = {
  id: string
  customerId: string
  state: "pending" | "inProgress" | "finished"
  consumedItems: { quantity: number; itemId: string }[]
}

export interface ProcedureRepo {
  create(procedure: Procedure): Promise<Procedure>
  begin(procedure: Procedure): Promise<Procedure>
  consumeItem(procedure: Procedure): Promise<Procedure>
  finish(procedure: Procedure): Promise<Procedure>
  get(id: string): Promise<Procedure>
}

export class TestProcedureRepo implements ProcedureRepo {
  constructor(private readonly _db: DataStore<ProcedureSave> = new TestDB([], "id")) {}

  private toSave(procedure: Procedure) {
    return {
      id: procedure.id,
      customerId: procedure.customerId,
      state: procedure.state,
      consumedItems: procedure.consumedItems.map((item) => ({
        quantity: item.quantity,
        itemId: item.itemId,
      })),
    }
  }

  private fromSave(dbProcedure: ProcedureSave) {
    return new Procedure(
      dbProcedure.id,
      dbProcedure.customerId,
      dbProcedure.consumedItems.map((item) => new ConsumedItem(item.quantity, item.itemId)),
      dbProcedure.state,
    )
  }

  async create(procedure: Procedure) {
    await this._db.create(this.toSave(procedure))
    return procedure
  }

  async begin(procedure: Procedure) {
    await this._db.update({ id: procedure.id, state: "inProgress" })
    return procedure
  }

  async consumeItem(procedure: Procedure) {
    // couldn't be bothered updating this properly
    await this._db.overwrite(this.toSave(procedure))
    return procedure
  }

  async finish(procedure: Procedure) {
    await this._db.update({ id: procedure.id, state: "finished" })
    return procedure
  }

  async get(id: string) {
    const procedureSave = await this._db.get(id)
    if (!procedureSave) throw new Error("Procedure not found")

    return this.fromSave(procedureSave)
  }
}
