import { uuid } from "../../_packages/uuid/uuid.types"

export class Procedure {
  private readonly _id: string
  private readonly _customerId: string
  private _consumedItems: ConsumedItem[]
  private _state: "pending" | "inProgress" | "finished"

  constructor(
    id?: string,
    customerId?: string,
    consumedItems?: ConsumedItem[],
    state?: "pending" | "inProgress" | "finished",
  ) {
    if (!customerId) throw new Error("Procedure must have a customer")

    this._id = id || uuid()
    this._customerId = customerId
    this._consumedItems = consumedItems || []
    this._state = state || "pending"
  }

  get id(): string {
    return this._id
  }

  get customerId(): string {
    return this._customerId
  }

  get consumedItems(): ConsumedItem[] {
    return this._consumedItems
  }

  get state(): "pending" | "inProgress" | "finished" {
    return this._state
  }

  consumeItem(itemId: string, quantity: number) {
    const existingConsumedItem = this._consumedItems.find((consumedItem) => itemId === consumedItem.itemId)
    if (existingConsumedItem) {
      existingConsumedItem.consume(quantity)
      return
    }

    this._consumedItems.push(new ConsumedItem(quantity, itemId))
  }

  begin() {
    if (this._state === "inProgress") throw new Error("Procedure is already in progress")
    if (this._state === "finished") throw new Error("Procedure is finished, it must be pending to begin")

    this._state = "inProgress"
  }

  finish() {
    if (this._state === "finished") throw new Error("Procedure is already finished")
    if (this._state === "pending") throw new Error("Procedure is pending, it must be in progress to finish")

    this._state = "finished"
  }
}

export class ConsumedItem {
  private readonly _itemId: string
  private _quantity: number

  constructor(quantity?: number, itemId?: string) {
    if (!quantity) throw new Error("Consumed Item must have a quantity")
    if (!itemId) throw new Error("Consumed Item must have an item id")

    this._itemId = itemId
    this._quantity = quantity
  }

  get quantity(): number {
    return this._quantity
  }

  get itemId(): string {
    return this._itemId
  }

  consume(quantity: number) {
    this._quantity += quantity
  }
}
