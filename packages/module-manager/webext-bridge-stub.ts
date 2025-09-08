// Minimal no-op shim for Node/CLI
export const onMessage =
  (_type: string, _handler: any) =>
  // Return an off() function for API parity
  () => {};

export const sendMessage = async <T = any>(_type: string, _data?: any, _to?: string): Promise<T | undefined> =>
  undefined;

export default {} as any;
