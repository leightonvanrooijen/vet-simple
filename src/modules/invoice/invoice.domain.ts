import { uuid } from "../../_packages/uuid/uuid.types"

export class InvoiceItem {
  constructor(
    private readonly _itemId: string,
    private readonly _unitPrice: string,
    private readonly _quantity: number,
  ) {
    if (!_itemId) throw new Error("Items must contain an itemId")
    if (!_unitPrice) throw new Error("Items must contain a unitPrice")
    if (!_quantity) throw new Error("Items must contain a quantity")

    this._itemId = _itemId
    this._unitPrice = _unitPrice
    this._quantity = _quantity
  }

  get itemId(): string {
    return this._itemId
  }

  get unitPrice(): string {
    return this._unitPrice
  }

  get quantity(): number {
    return this._quantity
  }
}

export class InvoiceOrder {
  constructor(private readonly _name: string, private readonly _items: InvoiceItem[]) {
    if (!this._items.length) throw new Error("Orders must contain at least one good")

    this._name = _name
    this._items = _items
  }

  get name(): string {
    return this._name
  }

  get items(): InvoiceItem[] {
    return this._items
  }
}

export class Invoice {
  private readonly _orders: InvoiceOrder[] = []

  constructor(
    private readonly _id?: string,
    private readonly _customerId?: string,
    private readonly _state?: "draft" | "billed",
  ) {
    if (!_customerId) throw new Error("An Invoice must contain an customerId")

    this._id = _id || uuid()
    this._customerId = _customerId
    this._state = _state || "draft"
  }

  addOrder(name: string, items: { itemId: string; quantity: number; unitPrice: string }[]) {
    if (this._state === "billed") throw new Error("Cannot add order to billed invoice")

    const invoiceItems = items.map((item) => new InvoiceItem(item.itemId, item.unitPrice, item.quantity))
    this._orders.push(new InvoiceOrder(name, invoiceItems))
    return this
  }

  get id(): string {
    return this._id
  }

  get customerId(): string {
    return this._customerId
  }

  get orders(): InvoiceOrder[] {
    return this._orders
  }

  get state() {
    return this._state
  }
}
