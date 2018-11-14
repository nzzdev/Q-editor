import EmptyDataNotificationCheck from "./EmptyDataNotificationCheck";
import HasColumnTitlesNotificationCheck from "./HasColumnTitlesNotificationCheck.js";
import TooManyColumnsNotificationCheck from "./TooManyColumnsNotificationCheck.js";
import ToolEndpointNotificationCheck from "./ToolEndpointNotificationCheck.js";

export function configure(frameworkConfiguration) {
  frameworkConfiguration.singleton(
    "EmptyDataNotificationCheck",
    EmptyDataNotificationCheck
  );
  frameworkConfiguration.singleton(
    "HasColumnTitlesNotificationCheck",
    HasColumnTitlesNotificationCheck
  );
  frameworkConfiguration.singleton(
    "TooManyColumnsNotificationCheck",
    TooManyColumnsNotificationCheck
  );
  frameworkConfiguration.singleton(
    "ToolEndpointNotificationCheck",
    ToolEndpointNotificationCheck
  );
}
