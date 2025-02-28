export class EventEmitter {
  // 存储事件及其对应的回调函数列表
  private events: { [eventName: string]: Array<(...args: any[]) => void> } = {};

  // 订阅事件
  public on(eventName: string, callback: (...args: any[]) => void): void {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(callback);
  }

  // 只订阅一次事件，触发后自动取消订阅
  public once(eventName: string, callback: (...args: any[]) => void): void {
    const onceCallback = (...args: any[]) => {
      // 先执行回调函数
      callback(...args);
      // 执行完后取消订阅
      this.off(eventName, onceCallback);
    };
    this.on(eventName, onceCallback);
  }

  // 取消订阅事件
  public off(eventName: string, callback: (...args: any[]) => void): void {
    if (this.events[eventName]) {
      this.events[eventName] = this.events[eventName].filter(cb => cb !== callback);
    }
  }

  // 发布事件
  public emit(eventName: string, ...args: any[]): void {
    if (this.events[eventName]) {
      this.events[eventName].forEach(callback => {
        callback(...args);
      });
    }
  }
}
