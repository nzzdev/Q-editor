import { inject } from 'aurelia-framework';
import MessageService from 'resources/MessageService.js';

@inject(MessageService)
export class QMessages {

  constructor(messageService) {
    this.messageService = messageService;
  }

}
