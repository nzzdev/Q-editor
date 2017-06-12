import SchemaEditorInputAvailabilityChecker from 'resources/SchemaEditorInputAvailabilityChecker.js';

export function checkAvailability() {
  return function(target) {
    // store any already existing inject property to concat it with the Element we want injected
    let inject = [];
    if (target.prototype.inject) {
      inject = target.prototype.inject;
    }

    return class extends target {
      static inject = [Element, SchemaEditorInputAvailabilityChecker].concat(inject);
      constructor(element, schemaEditorInputAvailabilityChecker, ...rest) {
        super(...rest);
        this.__element__ = element;
        this.__schemaEditorInputAvailabilityChecker__ = schemaEditorInputAvailabilityChecker;
        this.__inputElements__ = this.__element__.querySelectorAll('input, textarea, select, button');
      }

      bind(bindingContext, overrideContext) {
        if (super.bind) {
          super.bind(bindingContext, overrideContext);
        } else {
          // if we do not have bind implemented in the decorated class, we should call
          // all the *Changed methods, as aurelia is not doing it for the first change if bind is implemented
          let parentPrototype = Object.getPrototypeOf(Object.getPrototypeOf(this));
          if (!parentPrototype) {
            return;
          }
          for (let prop of Object.getOwnPropertyNames(parentPrototype)) {
            if (prop.endsWith('Changed')) {
              let dataprop = prop.slice(0, -7); // 'Changed' has length of 7
              this[prop](this[dataprop]);
            }
          }
        }

        this.__reevaluateAvailabilityCallbackId__ = this.__schemaEditorInputAvailabilityChecker__.registerReevaluateCallback(async () => {
          this.__checkAvailability__();
        });

        this.__checkAvailability__();
      }

      unbind() {
        if (super.unbind) {
          super.unbind();
        }
        this.__schemaEditorInputAvailabilityChecker__.unregisterReevaluateCallback(this.__reevaluateAvailabilityCallbackId__);
      }

      async __checkAvailability__() {
        this.__element__.classList.add('disabled');
        for (let inputElement of this.__inputElements__) {
          inputElement.disabled = true;
        }
        const availabilityInfo = await this.__schemaEditorInputAvailabilityChecker__.getAvailabilityInfo(this.schema);
        if (availabilityInfo.isAvailable) {
          this.__element__.style.display = 'block';
          this.__element__.closest('schema-editor-wrapper').style.display = 'block';
          this.__element__.classList.remove('disabled');
          const messageElement = this.__getMessageElement__();
          if (messageElement) {
            messageElement.remove();
          }
          for (let inputElement of this.__inputElements__) {
            inputElement.disabled = false;
          }
        } else {
          this.__element__.style.display = 'none';
          if (availabilityInfo.hasOwnProperty('unavailableMessage')) {
            const messageElement = this.__getMessageElement__();
            messageElement.innerHTML = availabilityInfo.unavailableMessage;
            this.__element__.parentNode.appendChild(messageElement);
          } else {
            this.__element__.closest('schema-editor-wrapper').style.display = 'none';
          }
        }
      }

      __getMessageElement__() {
        if (this.__messageElement__) {
          return this.__messageElement__;
        }
        this.__messageElement__ = this.__element__.ownerDocument.createElement('div');
        this.__messageElement__.classList.add('unavailability-message-block');
        return this.__messageElement__;
      }
    };
  };
}
