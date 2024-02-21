import { CustomWorld } from "../world"
import { Given, Then, When } from "@cucumber/cucumber"
import { assertThat } from "mismatched"
import { Item } from "../../modules/item/Item.domain"

Given("a vet begins a procedure", async function (this: CustomWorld) {
  // Update item creation to use the service when it's done
  await this.service.itemRepo.create(new Item("itemId", "item", "23"))

  const procedure = await this.service.procedure.create("123")
  this["procedureId"] = procedure.id
  this["customerId"] = procedure.customerId

  await this.service.procedure.begin(this["procedureId"])
})
When("they finish", async function (this: CustomWorld) {
  await this.service.procedure.consumeItem(this["procedureId"], "itemId", 1)
  await this.service.procedure.finish(this["procedureId"])
})
Then("the procedure will be finished", async function (this: CustomWorld) {
  const procedure = await this.service.procedure.get(this["procedureId"])
  assertThat(procedure.state).is("finished")
})
Then("the customer will be billed", async function () {
  const invoice = await this.service.invoiceRepo.getByCustomerId(this["customerId"])

  assertThat(invoice[0].orders[0].items[0].itemId).is("itemId")
})
