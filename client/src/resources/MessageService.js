export default class MessageService {

  messages = [];

  pushMessage(type, text) {
    let message = new Message(type, text, this);
    this.messages.push(message);
    return message;
  }

  removeMessage(message) {
    this.messages.splice(this.messages.indexOf(message), 1);
  }

}

class Message {

  constructor(type, text, messageService) {
    this.type = type;
    this.text = text;
    this.messageService = messageService;
  }

  dismiss() {
    this.messageService.removeMessage(this);
  }

}
