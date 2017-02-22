import { inject } from 'aurelia-framework'

@inject(Element)
export class IconLogo {

  constructor(element) {
    this.element = element;
  }

  attached() {
    this.element.addEventListener('mouseenter', () => {
      this.qFaceVisible = true;
    });
    this.element.addEventListener('mouseleave', () => {
      this.qFaceVisible = false;
    });
  }

}
