export declare class EventEmitter {
    private events;
    on(eventName: string, callback: (...args: any[]) => void): void;
    once(eventName: string, callback: (...args: any[]) => void): void;
    off(eventName: string, callback: (...args: any[]) => void): void;
    emit(eventName: string, ...args: any[]): void;
}
