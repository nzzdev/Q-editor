import { LogManager } from "aurelia-framework";
import ToolEndpointChecker from "resources/checkers/ToolEndpointChecker.js";
import { Container } from "aurelia-dependency-injection";
import mixinDeep from "mixin-deep";

const log = LogManager.getLogger("Q");

export function resolveDynamicSchema() {
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

    async function getDynamicSchema(schema) {
      try {
        const dynamicSchema = schema["Q:options"].dynamicSchema;
        if (dynamicSchema.type !== "ToolEndpoint") {
          throw new Error(
            `${dynamicSchema.type} is not implemented as dynamicSchema type`
          );
        }
        return await toolEndpointChecker.check(dynamicSchema.config);
      } catch (e) {
        throw new Error(
          `failed to get dynamicSchema for ${JSON.stringify(schema)} ${e}`
        );
      }
    }

    async function resolve() {
      const disabledOrig = this.isDisabled;
      this.isDisabled = true;
      try {
        const dynamicSchema = await getDynamicSchema(this.schema);
        this.schema = mixinDeep(this.schema, dynamicSchema);
        if (this.schemaChanged) {
          this.schemaChanged(this.schema);
        }
      } catch (e) {
        log.error(
          `Failed to assign dynamicSchema to schema, you need to figure out why this happened as this case is not handled in a nice way and could feel pretty weird.`,
          e
        );
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
        !this.schema["Q:options"].hasOwnProperty("dynamicSchema")
      ) {
        return;
      }

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
