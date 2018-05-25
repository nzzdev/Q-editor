import { inject } from "aurelia-framework";
import EmptyDataValidationRule from "./EmptyDataValidationRule.js";
import EmptyFirstRowValidationRule from "./EmptyFirstRowValidationRule.js";
import TooManyColumnsValidationRule from "./TooManyColumnsValidationRule.js";
import ToolEndpointValidationRule from "./ToolEndpointValidationRule.js";
import FormValidationRule from "./FormValidationRule.js";

@inject(
  EmptyDataValidationRule,
  EmptyFirstRowValidationRule,
  TooManyColumnsValidationRule,
  ToolEndpointValidationRule,
  FormValidationRule
)
export default class ValidationRules {
  constructor(
    emptyDataValidationRule,
    emptyFirstRowValidationRule,
    tooManyColumnsValidationRule,
    toolEndpointValidationRule,
    formValidationRule
  ) {
    this.emptyDataValidationRule = emptyDataValidationRule;
    this.emptyFirstRowValidationRule = emptyFirstRowValidationRule;
    this.tooManyColumnsValidationRule = tooManyColumnsValidationRule;
    this.toolEndpointValidationRule = toolEndpointValidationRule;
    this.formValidationRule = formValidationRule;
  }

  async validate(validationRule, validationData, schema, currentItem, element) {
    if (validationRule.type === "EmptyData") {
      return this.emptyDataValidationRule.validate(validationData);
    } else if (validationRule.type === "EmptyFirstRow") {
      return this.emptyFirstRowValidationRule.validate(validationData);
    } else if (validationRule.type === "TooManyColumns") {
      return this.tooManyColumnsValidationRule.validate(validationData);
    } else if (validationRule.type === "ToolEndpoint") {
      return await this.toolEndpointValidationRule.validate(
        validationRule,
        validationData,
        schema,
        currentItem
      );
    } else if (validationRule.type === "Form") {
      return this.formValidationRule.validate(element);
    }
  }
}
