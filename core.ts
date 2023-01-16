import { compose, cFunction } from './koa-compose-esm.js';

export class OnionPipe {
  #middlewares: compose.Middleware<Record<PropertyKey, any>>[] = [];
  #lastResolve: Parameters<ConstructorParameters<typeof Promise>[0]>[0];
  params = {};
  constructor(initParams = {}) {
    this.params = initParams;
  }
  on(fn: cFunction) {
    if (typeof fn !== 'function') {
      console.warn('[warning] Middleware stack must be an array!')
      return;
    }
    // @ts-ignore
    const _fn = async (ctx, next) => {
      return new Promise<void>(resolve => {
        this.#lastResolve = resolve;
        let callFn = fn(ctx, next);
        if (!(callFn instanceof Promise)) {
          callFn = Promise.resolve();
        }
        callFn.then(() => {
          if (this.#lastResolve !== resolve) {
            resolve();
          }
        })
      })
    };
    this.#middlewares.push(_fn);
    return this;
  }
  emit() {
    const fn = compose(this.#middlewares);
    fn(this.params);
    return this;
  }
  off() {
    this.#lastResolve?.('');
    return this;
  }
}

export default OnionPipe;
