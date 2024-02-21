import { IWorldOptions, setWorldConstructor, World } from "@cucumber/cucumber"
import { ProcedureService } from "../service/procedure.service"
import { ProcedureRepo } from "../modules/procedure/Procedure.repo"
import { InvoiceRepo } from "../modules/invoice/invoice.repo"
import { ItemRepo } from "../modules/item/item.repo"

export type Service = {
  procedure: ProcedureService
  procedureRepo: ProcedureRepo
  invoiceRepo: InvoiceRepo
  itemRepo: ItemRepo
}

export class CustomWorld extends World {
  service: Service

  constructor(options: IWorldOptions, procedureService: Service) {
    super(options)
    this.service = procedureService
  }
}

setWorldConstructor(CustomWorld)
