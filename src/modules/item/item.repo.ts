import { DataStore, TestDB } from "../../_packages/db/testDB"
import { Item } from "./Item.domain"

type ItemSave = {
  id: string
  name: string
  price: string
}

export interface ItemRepo {
  create(item: Item): Promise<Item>
  get(id: string): Promise<any>
  getByIds(ids: string[]): Promise<any>
}

export class TestItemRepo implements ItemRepo {
  constructor(private readonly _db: DataStore<ItemSave> = new TestDB([], "id")) {}

  private toSave(item: Item) {
    return {
      id: item.id,
      name: item.name,
      price: item.price,
    }
  }

  private fromSave(dbItem: ItemSave) {
    return new Item(dbItem.id, dbItem.name, dbItem.price)
  }

  async create(item: Item) {
    await this._db.create(this.toSave(item))
    return item
  }

  async get(id: string) {
    const item = await this._db.get(id)
    if (!item) throw new Error(`Item ${id} not found`)
    return this.fromSave(item)
  }

  async getByIds(ids: string[]) {
    const items = await this._db.getByIds(ids)
    if (!items) throw new Error(`Items ${ids} not found`)
    return items.map((item) => this.fromSave(item))
  }
}
