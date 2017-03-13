import { inject } from 'aurelia-framework';
import { bindingBehavior, ValueConverter } from 'aurelia-binding';
import { SignalBindingBehavior } from 'aurelia-templating-resources';
import { RelativeTime, I18N } from 'aurelia-i18n';

@bindingBehavior('timeAgo')
@inject(RelativeTime, I18N, SignalBindingBehavior)
export class TimeAgoBindingBehavior {

  constructor(relativeTime, i18n, signalBindingBehavior) {
    this.relativeTime = relativeTime;
    this.i18n = i18n;
    this.signalBindingBehavior = signalBindingBehavior;
  }

  // source copied from https://github.com/aurelia/i18n/blob/master/src/t.js
  bind(binding, source) {
    this.signalBindingBehavior.bind(binding, source, 'aurelia-translation-signal');

    // rewrite the expression to use the TValueConverter.
    // pass through any args to the binding behavior to the TValueConverter
    let sourceExpression = binding.sourceExpression;

    // do create the sourceExpression only once
    if (sourceExpression.rewritten) {
      return;
    }
    sourceExpression.rewritten = true;

    let expression = sourceExpression.expression;
    sourceExpression.expression = new ValueConverter(
      expression,
      'timeAgo',
      sourceExpression.args,
      [expression, ...sourceExpression.args]
    );
  }

  unbind(binding, source) {
    // unbind the signal behavior
    this.signalBindingBehavior.unbind(binding, source);
  }

}
