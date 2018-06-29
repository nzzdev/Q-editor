import { inject } from "aurelia-framework";
import { SignalBindingBehavior } from "aurelia-templating-resources";
import { ValueConverter } from "aurelia-binding";

@inject(SignalBindingBehavior)
export class ToolTBindingBehavior {
  constructor(signalBindingBehavior) {
    this.signalBindingBehavior = signalBindingBehavior;
  }

  bind(binding, source) {
    // bind the signal behavior
    this.signalBindingBehavior.bind(
      binding,
      source,
      "aurelia-translation-signal"
    );

    // rewrite the expression to use the ToolTValueConverter.
    // pass through any args to the binding behavior to the ToolTValueConverter
    let sourceExpression = binding.sourceExpression;

    // do create the sourceExpression only once
    if (sourceExpression.rewritten) {
      return;
    }
    sourceExpression.rewritten = true;

    let expression = sourceExpression.expression;
    sourceExpression.expression = new ValueConverter(
      expression,
      "toolT",
      sourceExpression.args,
      [expression, ...sourceExpression.args]
    );
  }

  unbind(binding, source) {
    // unbind the signal behavior
    this.signalBindingBehavior.unbind(binding, source);
  }
}
