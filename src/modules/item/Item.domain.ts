import { uuid } from "../../_packages/uuid/uuid.types"

export class Item {
  constructor(private readonly _id: string, private readonly _name: string, private readonly _price: string) {
    if (!_name) throw new Error("Item must have a name")
    if (!_price) throw new Error("Item must have a price")

    this._id = _id || uuid()
    this._name = _name
    this._price = _price
  }

  get id() {
    return this._id
  }

  get name() {
    return this._name
  }

  get price() {
    return this._price
  }
}
