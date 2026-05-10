export class InitializerBase {
  public key: string;
  public controller: any;
  public data: any;

  constructor(key: string, controller?: any, data?: any) {
    this.key = key;
    this.controller = controller;
    this.data = data;
  }
}
