import ToolEndpointChecker from "resources/ToolEndpointChecker.js";
import { Container } from "aurelia-dependency-injection";

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
      if (schema["Q:options"].dynamicEnum.type !== "ToolEndpoint") {
        throw new Error(
          `${
            schema["Q:options"].dynamicEnum.type
          } is not implemented as dynamicEnum type`
        );
      }
      if (schema["Q:options"].dynamicEnum.withData) {
        return await toolEndpointChecker.fetchWithItem(
          schema["Q:options"].dynamicEnum.endpoint
        );
      }
      return await toolEndpointChecker.fetch(
        schema["Q:options"].dynamicEnum.endpoint
      );
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
        !this.schema["Q:options"].hasOwnProperty("dynamicEnum")
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
