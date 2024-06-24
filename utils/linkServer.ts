interface content {
  cmd: string;
  arg?: string;
  arg1?: string;
  arg2: string;
  arg3?: string;
  arg4?: string;
  arg5?: string;
  acc?: string;
  roll?: string;
  pitch?: string;
  yaw?: string;
  delay?: string;
}

interface Message {
  extension_id: string;
  content: content;
}

interface IExtension {
  notify: (content: content) => void;
}

class LinkServer {
  private extentions: {[key: string]: IExtension} = {};

  constructor(
    classesWithArgs: {Class: any; extention_id: string; args: any[]}[],
  ) {
    classesWithArgs.forEach(({Class, extention_id, args}, index) => {
      const instance = new Class(...args);
      this.registerExtention(extention_id, instance);
    });
  }

  onMessage(data: Message) {
    const {extension_id, content} = data;

    if (this.extentions[extension_id]) {
      this.extentions[extension_id].notify(content);
    }
  }

  registerExtention(extention_id: string, extention: any) {
    console.log(`${extention_id} registered`);
    if (extention_id in this.extentions) {
      throw new Error(`Extention ${extention_id} already exists`);
    }
    this.extentions[extention_id] = extention;
  }
}

export default LinkServer;
export type {content, Message};
