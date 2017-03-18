import { valueConverter, inject } from 'aurelia-framework';
import { RelativeTime, I18N } from 'aurelia-i18n';

@valueConverter('timeAgo')
@inject(RelativeTime, I18N)
export class TimeAgoValueConverter {

  constructor(relativeTime, i18n) {
    this.relativeTime = relativeTime;
    this.i18n = i18n;
  }

  toView(value, max = false) {
    if (!value) {
      return value;
    }

    let timestamp = Date.parse(value);
    if (isNaN(timestamp)) {
      return value;
    }

    let date = new Date(value);
    let now = new Date();

    let timeDiff = (now.getTime() - date.getTime()) / 1000;

    if (max && (max > timeDiff)) {
      return this.relativeTime.getRelativeTime(date);
    }

    return this.i18n.df().format(date);
  }
}
