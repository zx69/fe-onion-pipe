

众所周知，洋葱模型是著名的node.js服务器库【koa】所使用的数据流模型，因为中间件如同洋葱一般“环形”分层而得名。与一般中间件的线性管道模式不同，洋葱模型每次执行回调时，数据会在中间层中"出了又进"，形如下图：

虽然这是一种为服务器处理请求而设计的模型，但其数据处理模式设计很优雅，在其他场合下其实也能发挥作用，特别是需要进行类似“出了又进”的逻辑处理————比如对前一步的处理进行反馈操作————的时候，洋葱模型能发挥良好的效果，同时能对处理函数进行解耦，具有良好的扩展性。所以我们来尝试在前端实现一个洋葱模型，并写一下小例子验证一下。

## 洋葱模型的实现: koa-compose

洋葱模型的实现其实非常简洁，koa已经将其组合中间件的核心逻辑抽取到成一个独立的npm依赖：[koa-compose](https://github.com/koajs/compose)。这个模块只包含一个函数，去掉注释后的代码只有20几行： 

```
module.exports = compose

function compose (middleware) {
  if (!Array.isArray(middleware)) throw new TypeError('Middleware stack must be an array!')
  for (const fn of middleware) {
    if (typeof fn !== 'function') throw new TypeError('Middleware must be composed of functions!')
  }

  return function (context, next) {
    let index = -1
    return dispatch(0)
    function dispatch (i) {
      if (i <= index) return Promise.reject(new Error('next() called multiple times'))
      index = i
      let fn = middleware[i]
      if (i === middleware.length) fn = next
      if (!fn) return Promise.resolve()
      try {
        return Promise.resolve(fn(context, dispatch.bind(null, i + 1)))
      } catch (err) {
        return Promise.reject(err)
      }
    }
  }
}
```

具体的实现方式是将多个串行挂载的中间件处理函数，按挂载顺序组合成逐层包裹的函数调用，同时支持使用async-await进行异步等待操作：

```
app.use(async function cb1(ctx, next){
  console.log('go to cb1')
  await next();
  console.log('go out cb1')

});
app.use(async function cb2(ctx, next){
  console.log('go to cb2')
  await next()
  console.log('go out cb2')

});
app.use(async function cb3(ctx, next){
  console.log('go to cb3')
  await next()
  console.log('go out cb3')
});

====> 

[
  async function cb1(ctx, next){
    await next()
  }, 
  async function cb2(ctx, next){
    await next()
  }, 
  async function cb3(ctx, next){
    await next()
  }
]

====>
async function cb1(ctx){
  console.log('go to cb1')
  await (async function cb2(ctx){
    console.log('go to cb2')
    await (async function cb3(ctx){
      ...
    })()
    console.log('go out cb2')
  })();
  console.log('go out cb1')
}
```

其实就是用后面挂载的异步中间件函数，逐个替换前一步中间件函数的参数`next`. 因为其挂载函数是扁平化的，可以避免多层嵌套产生的“回调地狱”。最重要的是`next`函数使用await调用，`next`之前和之后的代码将分段线性执行，所以可以在`next`前后分别定义不同的处理逻辑，对数据流进行两个阶段分块处理。

可以看到，koa-compose只包含最纯粹的js代码，不包含任何node.js专有方法，因为完成可以直接拿到前端来使用。

不过因为koa-compose是基于commonjs的，如果不借助webpack等打包工具，前端没办法直接使用。为了摆脱打包工具，可以直接将koa-compose复制到本地文件，改写为esm版本(只需将`module.export`改写为`export default`). 

# 

上节复制的koa-compose是构建洋葱模型的核心函数，当它本身并不包含挂载，触发等操作，这些需要我们自行实现。为了方便复用，我们先使用类来定义该模型：

```
class OnionPipi{
  #middlewares: compose.Middleware<Record<PropertyKey, any>>[] = [];
  #lastResolve: Parameters<ConstructorParameters<typeof Promise>[0]>[0];
  params = {};
  constructor(initParams = {}) {
    this.params = initParams;
  }
}
```

### 挂载中间件
koa使用
```
app.use()
```

koa作为服务器框架，

