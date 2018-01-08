import { bindable, inject, Loader, LogManager } from 'aurelia-framework';
import { checkAvailability } from 'resources/schemaEditorDecorators.js';
import { Notification } from 'aurelia-notification';
import debounce from 'debounce';

const allowedTagsFormatOptionsMapping = {
  a: 'link'
};

const log = LogManager.getLogger('Q');

@checkAvailability()
@inject(Element, Notification, Loader)
export class SchemaEditorHtml {

  @bindable schema;
  @bindable data;
  @bindable change;
  @bindable required;

  constructor(element, notification, loader) {
    this.element = element;
    this.notification = notification;
    this.loader = loader;
  }

  async attached() {
    if (typeof this.data === 'string') {
      this.contentElement.innerHTML = this.data;
    }

    const Quill = await this.loader.loadModule('quill');
    await this.loader.loadModule('npm:quill@1.3.4/dist/quill.core.css!');
    await this.loader.loadModule('npm:quill@1.3.4/dist/quill.snow.css!');

    const Link = Quill.import('formats/link');

    // extend Quill Link class to set noopener noreferrer rel on the link with target blank
    // because: https://www.jitbit.com/alexblog/256-targetblank---the-most-underestimated-vulnerability-ever/
    class QLink extends Link {
      static create(value) {
        let node = super.create(value);
        value = this.sanitize(value);
        node.setAttribute('href', value);
        node.setAttribute('target', '_blank');
        node.setAttribute('rel', 'noopener noreferrer');
        return node;
      }
    }

    Quill.register(QLink);

    this.quill = new Quill(this.contentElement, {
      modules: {
        toolbar: this.getToolbarControls()
      },
      formats: this.getAllowedFormats(),
      theme: 'snow',
      bounds: this.element
    });

    this.quill.on('text-change', debounce((delta, oldDelta, source) => {
      this.data = this.quill.root.innerHTML;
      this.change();
    }, 800));
  }

  getToolbarControls() {
    const toolbarControls = [];
    try {
      if (this.schema['Q:options'].type.allowedTags) {
        for (let tag of this.schema['Q:options'].type.allowedTags) {
          if (allowedTagsFormatOptionsMapping.hasOwnProperty(tag)) {
            toolbarControls.push(allowedTagsFormatOptionsMapping[tag]);
          }
        }
      }
    } catch (err) {
      log.error(err);
    }
    return toolbarControls;
  }

  getAllowedFormats() {
    const formats = [];
    try {
      if (this.schema['Q:options'].type.allowedTags) {
        for (let tag of this.schema['Q:options'].type.allowedTags) {
          if (allowedTagsFormatOptionsMapping.hasOwnProperty(tag)) {
            formats.push(allowedTagsFormatOptionsMapping[tag]);
          }
        }
      }
    } catch (err) {
      log.error(err);
    }
    return formats;
  }

}
