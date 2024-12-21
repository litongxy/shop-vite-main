export default class NodeType {
  name: string;
  type: string;
  kind: string;
  credentials: {
    keyType: string;
    keyId: string;
  };
  parameters: Record<string, any>;
  global: Record<string, any>;

  constructor(
    name: string = '',
    type: string = '',
    kind: string = '',
    credentials: { keyType: string; keyId: string } = { keyType: '', keyId: '' },
    parameters: Record<string, any> = {},
    global: Record<string, any> = {}
  ) {
    this.name = name;
    this.type = type;
    this.kind = kind;
    this.credentials = credentials;
    this.parameters = parameters;
    this.global = global;
  }

  updateParameters(key: string, value: any): void {
    this.parameters[key] = value;
  }

  updateGlobal(key: string, value: any): void {
    this.global[key] = value;
  }
}
