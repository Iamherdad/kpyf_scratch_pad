interface content {
  cmd: string;
  arg?: number | string;
  arg1?: number | string;
  arg2: number | string;
  arg3?: number | string;
  arg4?: number | string;
  arg5?: number | string;
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
