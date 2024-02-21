import { DataStore, TestDB } from "../../_packages/db/testDB"
import { Invoice } from "./invoice.domain"

type InvoiceSave = {
  id: string
  customerId: string
  orders: { name: string; items: { itemId: string; unitPrice: string; quantity: number }[] }[]
  state: "draft" | "billed"
}

export interface InvoiceRepo {
  toSave(invoice: Invoice): InvoiceSave
  create(invoice: Invoice): Promise<Invoice>
  getByCustomerId(customerId: string): Promise<InvoiceSave[]>
}

export class TestInvoiceRepo implements InvoiceRepo {
  constructor(private readonly _db: DataStore<InvoiceSave> = new TestDB([], "id")) {}

  toSave(invoice: Invoice): InvoiceSave {
    return {
      id: invoice.id,
      customerId: invoice.customerId,
      orders: invoice.orders.map((order) => ({
        name: order.name,
        items: order.items.map((item) => ({
          itemId: item.itemId,
          unitPrice: item.unitPrice,
          quantity: item.quantity,
        })),
      })),
      state: invoice.state,
    }
  }

  async create(invoice: Invoice) {
    await this._db.create(this.toSave(invoice))
    return invoice
  }

  async getByCustomerId(customerId: string) {
    return (await this._db.getAll()).filter((invoice) => invoice.customerId === customerId)
  }
}
