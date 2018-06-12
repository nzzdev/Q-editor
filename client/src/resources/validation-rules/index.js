import { inject } from "aurelia-framework";
import { I18N } from "aurelia-i18n";
import qEnv from "resources/qEnv.js";
import EmptyDataValidationRule from "./EmptyDataValidationRule.js";
import EmptyFirstRowValidationRule from "./EmptyFirstRowValidationRule.js";
import TooManyColumnsValidationRule from "./TooManyColumnsValidationRule.js";
import ToolEndpointValidationRule from "./ToolEndpointValidationRule.js";
import IsValueMissingValidationRule from "./IsValueMissingValidationRule.js";

@inject(
  I18N,
  EmptyDataValidationRule,
  EmptyFirstRowValidationRule,
  TooManyColumnsValidationRule,
  ToolEndpointValidationRule,
  IsValueMissingValidationRule
)
export default class ValidationRules {
  constructor(
    i18n,
    emptyDataValidationRule,
    emptyFirstRowValidationRule,
    tooManyColumnsValidationRule,
    toolEndpointValidationRule,
    isValueMissingValidationRule
  ) {
    this.i18n = i18n;
    this.emptyDataValidationRule = emptyDataValidationRule;
    this.emptyFirstRowValidationRule = emptyFirstRowValidationRule;
    this.tooManyColumnsValidationRule = tooManyColumnsValidationRule;
    this.toolEndpointValidationRule = toolEndpointValidationRule;
    this.isValueMissingValidationRule = isValueMissingValidationRule;
  }

  async validate(validationRule, data, tool, element) {
    const validationConfig = await qEnv.validationConfig;
    if (validationRule.type === "IsValueMissing") {
      let validationResult = this.isValueMissingValidationRule.validate(
        element,
        validationConfig.isValueMissing
      );
      return this.getNotification(validationResult, "", validationRule.type);
    } else if (validationRule.type === "EmptyData") {
      let validationResult = this.emptyDataValidationRule.validate(
        data,
        validationConfig.emptyData
      );
      return this.getNotification(validationResult, "", validationRule.type);
    } else if (validationRule.type === "EmptyFirstRow") {
      let validationResult = this.emptyFirstRowValidationRule.validate(
        data,
        validationConfig.emptyFirstRow
      );
      return this.getNotification(validationResult, "", validationRule.type);
    } else if (validationRule.type === "TooManyColumns") {
      let validationResult = this.tooManyColumnsValidationRule.validate(
        data,
        validationConfig.tooManyColumns
      );
      return this.getNotification(validationResult, "", validationRule.type);
    } else if (validationRule.type === "ToolEndpoint") {
      let validationResult = await this.toolEndpointValidationRule.validate(
        validationRule,
        data,
        tool
      );
      const validationNamespace = `${tool}:`;
      const validationType = validationRule.endpoint.replace("validate/", "");
      return this.getNotification(
        validationResult,
        validationNamespace,
        validationType
      );
    }
  }

  getNotification(validationResult, translationNamespace, validationType) {
    if (validationResult.showNotification) {
      const translationKey =
        validationType.charAt(0).toLowerCase() + validationType.slice(1);
      return {
        priority: validationResult.priority,
        message: {
          title: `${translationNamespace}notifications.${translationKey}.title`,
          body: `${translationNamespace}notifications.${translationKey}.body`,
          parameters: validationResult.messageParameters
        }
      };
    }
    return {};
  }
}
