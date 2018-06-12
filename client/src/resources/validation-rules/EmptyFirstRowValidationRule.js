import qEnv from "resources/qEnv.js";
export default class EmptyFirstRowValidationRule {
  validate(data, validationConfig) {
    const validationResult = {
      showNotification: false,
      priority: validationConfig.priority
    };
    if (data[0][0]) {
      const totalValues = data[0][0].length;
      const nullValues = data[0][0].filter(entry => entry === null).length;
      validationResult.showNotification = nullValues === totalValues;
    }
    return validationResult;
  }
}
