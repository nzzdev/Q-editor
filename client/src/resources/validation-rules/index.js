import { inject } from "aurelia-framework";
import EmptyDataValidationRule from "./EmptyDataValidationRule.js";
import EmptySourcesValidationRule from "./EmptySourcesValidationRule.js";
import ToolEndpointValidationRule from "./ToolEndpointValidationRule.js";
import FormValidationRule from "./FormValidationRule.js";

@inject(
  EmptyDataValidationRule,
  EmptySourcesValidationRule,
  ToolEndpointValidationRule,
  FormValidationRule
)
export default class ValidationRules {
  constructor(
    emptyDataValidationRule,
    emptySourcesValidationRule,
    toolEndpointValidationRule,
    formValidationRule
  ) {
    this.emptyDataValidationRule = emptyDataValidationRule;
    this.emptySourcesValidationRule = emptySourcesValidationRule;
    this.toolEndpointValidationRule = toolEndpointValidationRule;
    this.formValidationRule = formValidationRule;
  }

  async validate(validationRule, validationData, schema, currentItem, element) {
    if (validationRule.type === "EmptyData") {
      return this.emptyDataValidationRule.validate(validationData);
    } else if (validationRule.type === "EmptySources") {
      return this.emptySourcesValidationRule.validate(validationData);
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
