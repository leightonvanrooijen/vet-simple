import { After, Before, BeforeAll } from "@cucumber/cucumber"
import { CustomWorld } from "./world"
import { ProcedureService } from "../service/procedure.service"
import { TestProcedureRepo } from "../modules/procedure/Procedure.repo"
import { TestInvoiceRepo } from "../modules/invoice/invoice.repo"
import { TestItemRepo } from "../modules/item/item.repo"

Before({ tags: "@ignore" }, async function () {
  return "skipped"
})

Before({ tags: "@debug" }, async function () {
  this.debug = true
})

Before({ tags: "@manual" }, async function () {
  return "skipped"
})

Before({ tags: "@procedure" }, async function (this: CustomWorld) {
  const procedureRepo = new TestProcedureRepo()
  const invoiceRepo = new TestInvoiceRepo()
  const itemRepo = new TestItemRepo()

  this.service = {
    procedure: new ProcedureService(procedureRepo, invoiceRepo, itemRepo),
    procedureRepo,
    invoiceRepo,
    itemRepo,
  }
})

Before({ tags: "@invoice" }, async function (this: CustomWorld) {})

After({ tags: "@acceptance" }, async function () {})

BeforeAll(async function () {})
