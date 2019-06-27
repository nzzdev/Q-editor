import ToolEndpointChecker from "resources/checkers/ToolEndpointChecker.js";
import { Container } from "aurelia-dependency-injection";
import { LogManager } from "aurelia-framework";

const log = LogManager.getLogger("Q");

export function resolveDynamicEnum() {
  return function(target) {
    let container = Container.instance || new Container();
    const toolEndpointChecker = container.get(ToolEndpointChecker);
    let originalBind;
    if (target.prototype.bind) {
      originalBind = target.prototype.bind;
    }

    let originalUnbind;
    if (target.prototype.unbind) {
      originalUnbind = target.prototype.unbind;
    }

    async function getDynamicEnum(schema) {
      const dynamicEnumSchema = schema["Q:options"].dynamicEnum;
      if (dynamicEnumSchema.type !== "ToolEndpoint") {
        throw new Error(
          `${dynamicEnumSchema.type} is not implemented as dynamicEnum type`
        );
      }
      return await toolEndpointChecker.check(dynamicEnumSchema.config);
    }

    async function resolve() {
      const disabledOrig = this.isDisabled;
      this.isDisabled = true;
      try {
        const dynamicEnum = await getDynamicEnum(this.schema);
        if (dynamicEnum.hasOwnProperty("enum")) {
          this.schema.enum = dynamicEnum.enum;
        }
        if (dynamicEnum.hasOwnProperty("enum_titles")) {
          this.schema["Q:options"].enum_titles = dynamicEnum.enum_titles;
        }
        if (this.schemaChanged) {
          this.schemaChanged(this.schema);
        }
      } catch (e) {
        delete this.schema.enum;
      }
      this.isDisabled = disabledOrig;
    }

    let reevaluateCallbackId;

    target.prototype.bind = async function(bindingContext, overrideContext) {
      // if there is an original bind lifecycle method implemented, call it here
      if (originalBind) {
        originalBind.apply(this, [bindingContext, overrideContext]);
      } else {
        // otherwise we need to call any *Changed() callback implemented on the bindingContext
        // as aurelia doesn't call these if the bind method is implemented
        // and we do not want to alter behaviour of the view model regarding this in this decorator
        for (let prop of Object.keys(Reflect.getPrototypeOf(bindingContext))) {
          const callbackName = `${prop}Changed`;
          if (this[callbackName]) {
            this[callbackName](bindingContext[prop]);
          }
        }
      }

      if (
        !this.schema.hasOwnProperty("Q:options") ||
        !this.schema["Q:options"] ||
        !this.schema["Q:options"].hasOwnProperty("dynamicEnum")
      ) {
        return;
      }

      log.info(
        "DEPRECATION NOTICE: In Q editor 5.0 dynamicEnum support will be removed. Use dynamicSchema to implement to same functionality. See https://github.com/nzzdev/Q-editor/blob/master/README.md for details."
      );

      reevaluateCallbackId = toolEndpointChecker.registerReevaluateCallback(
        async () => {
          resolve.apply(this);
        }
      );

      resolve.apply(this);
    };

    target.prototype.unbind = function() {
      // if there is an original unbind lifecycle method implemented, call it here
      if (originalUnbind) {
        originalUnbind.apply(this);
      }

      toolEndpointChecker.unregisterReevaluateCallback(reevaluateCallbackId);
    };
  };
}
