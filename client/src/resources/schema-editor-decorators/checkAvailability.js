import SchemaEditorInputAvailabilityChecker from "resources/SchemaEditorInputAvailabilityChecker.js";

async function check(context) {
  context.element.classList.add("disabled");
  for (let inputElement of context.inputElements) {
    inputElement.disabled = true;
  }
  const availabilityInfo = await context.schemaEditorInputAvailabilityChecker.getAvailabilityInfo(
    context.getSchema()
  );
  if (availabilityInfo.isAvailable) {
    delete context.element.style.display;
    delete context.element.closest("schema-editor-wrapper").style.display;
    context.element.classList.remove("disabled");
    const messageElement = getMessageElement(context);
    if (messageElement) {
      messageElement.remove();
    }
    for (let inputElement of context.inputElements) {
      inputElement.disabled = false;
    }
  } else {
    context.element.style.display = "none";
    if (availabilityInfo.hasOwnProperty("unavailableMessage")) {
      const messageElement = getMessageElement(context);
      messageElement.innerHTML = availabilityInfo.unavailableMessage;
      context.element.parentNode.appendChild(messageElement);
    } else {
      context.element.closest("schema-editor-wrapper").style.display = "none";
    }
  }
}

function getMessageElement(context) {
  if (context.messageElement) {
    return context.messageElement;
  }
  context.messageElement = context.element.ownerDocument.createElement("div");
  context.messageElement.classList.add("q-text");
  return context.messageElement;
}

// we store all the context for the decorated class in this WeakMap
const contextMap = new WeakMap();

export function checkAvailability() {
  return function(target) {
    // store any already existing inject property to concat it with the Element we want injected
    let inject = [];
    if (target.prototype.inject) {
      inject = target.prototype.inject;
    }

    return class extends target {
      static inject = [Element, SchemaEditorInputAvailabilityChecker].concat(
        inject
      );
      constructor(element, schemaEditorInputAvailabilityChecker, ...rest) {
        super(...rest);
        contextMap.set(this, {
          getSchema: () => this.schema,
          element: element,
          schemaEditorInputAvailabilityChecker: schemaEditorInputAvailabilityChecker,
          inputElements: element.querySelectorAll(
            "input, textarea, select, button"
          ),
          reevaluateAvailabilityCallbackId: null
        });
      }

      bind(bindingContext, overrideContext) {
        if (super.bind) {
          super.bind(bindingContext, overrideContext);
        } else {
          // if we do not have bind implemented in the decorated class, we should call
          // all the *Changed methods, as aurelia is not doing it for the first change if bind is implemented
          let parentPrototype = Object.getPrototypeOf(
            Object.getPrototypeOf(this)
          );
          if (!parentPrototype) {
            return;
          }
          for (let prop of Object.getOwnPropertyNames(parentPrototype)) {
            if (prop.endsWith("Changed")) {
              let dataprop = prop.slice(0, -7); // 'Changed' has length of 7
              this[prop](this[dataprop]);
            }
          }
        }

        contextMap.get(this).reevaluateAvailabilityCallbackId = contextMap
          .get(this)
          .schemaEditorInputAvailabilityChecker.registerReevaluateCallback(
            async () => {
              check(contextMap.get(this));
            }
          );

        check(contextMap.get(this));
      }

      unbind() {
        if (super.unbind) {
          super.unbind();
        }
        contextMap
          .get(this)
          .schemaEditorInputAvailabilityChecker.unregisterReevaluateCallback(
            contextMap.get(this).reevaluateAvailabilityCallbackId
          );
      }
    };
  };
}
