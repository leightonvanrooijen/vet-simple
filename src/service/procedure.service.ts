import { ConsumedItem, Procedure } from "../modules/procedure/Procedure.domain"
import { ProcedureRepo, TestProcedureRepo } from "../modules/procedure/Procedure.repo"
import { Invoice } from "../modules/invoice/invoice.domain"
import { InvoiceRepo, TestInvoiceRepo } from "../modules/invoice/invoice.repo"
import { TestItemRepo } from "../modules/item/item.repo"
import { Item } from "../modules/item/Item.domain"

// TODO: this would typically have methods wrapped in transactions
export class ProcedureService {
  constructor(
    private readonly _procedureRepo?: ProcedureRepo,
    private readonly _invoiceRepo?: InvoiceRepo,
    private readonly _itemRepo?: TestItemRepo,
  ) {
    this._procedureRepo = _procedureRepo || new TestProcedureRepo()
    this._invoiceRepo = _invoiceRepo || new TestInvoiceRepo()
    this._itemRepo = _itemRepo || new TestItemRepo()
  }

  async create(customerId: string) {
    const procedure = new Procedure(undefined, customerId)
    await this._procedureRepo.create(procedure)
    return procedure
  }

  async begin(id: string) {
    const procedure = await this._procedureRepo.get(id)

    procedure.begin()
    await this._procedureRepo.begin(procedure)
  }

  async consumeItem(id: string, itemId: string, quantity: number) {
    const procedure = await this._procedureRepo.get(id)
    await this._itemRepo.get(itemId)

    procedure.consumeItem(itemId, quantity)
    await this._procedureRepo.consumeItem(procedure)
  }

  async finish(id: string) {
    const procedure = await this._procedureRepo.get(id)
    procedure.finish()

    const invoice = new Invoice(undefined, procedure.customerId)
    const items = await this._itemRepo.getByIds(this.getUniqueItemIds(procedure))

    const consumedItems = this.procedureItemsToInvoiceItems(procedure.consumedItems, items)
    invoice.addOrder("procedure " + procedure.customerId, consumedItems)

    await this._procedureRepo.finish(procedure)
    await this._invoiceRepo.create(invoice)
  }

  async get(id: string) {
    return await this._procedureRepo.get(id)
  }

  private procedureItemsToInvoiceItems(consumedItems: ConsumedItem[], items: Item[]) {
    return consumedItems.map((consumedItem) => ({
      itemId: consumedItem.itemId,
      quantity: consumedItem.quantity,
      unitPrice: items.find((item) => item.id === consumedItem.itemId).price,
    }))
  }

  private getUniqueItemIds(procedure: Procedure) {
    return [...new Set(procedure.consumedItems.map((item) => item.itemId))]
  }
}
