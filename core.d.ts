interface cFunction<P extends any[] = any[], R extends any = any> {
    (...args: P): R;
}
export declare class OnionPipe {
    #private;
    params: {};
    constructor(initParams?: {});
    watch(fn: cFunction): this;
    emit(): this;
    off(): this;
}
export default OnionPipe;
