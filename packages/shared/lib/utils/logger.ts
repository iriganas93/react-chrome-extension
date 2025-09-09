export class Logger {
  namespace = 'CEB';
  log(message: string, trackInstance?: string) {
    const trackInfo = trackInstance ? ` [${trackInstance}]` : '';
    console.log(
      `%c[${this.namespace}]${trackInfo} ${message}`,
      'background: #0B627C; color: #ffffff; padding: 5px; border-radius: 3px;',
    );
  }
}

export const logger = new Logger();
