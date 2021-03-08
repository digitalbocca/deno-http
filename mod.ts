import { Application, Router, send } from 'https://deno.land/x/oak/mod.ts'

const app = new Application()
const router = new Router()

app.use(async (ctx, next) => {
  await next()
  const rt = ctx.response.headers.get('X-Response-Time')
  console.log(`${ctx.request.method} ${ctx.request.url} - ${rt}`)
})

app.use(async (ctx, next) => {
  const start = Date.now()
  await next()
  const ms = Date.now() - start
  ctx.response.headers.set('X-Response-Time', `${ms}ms`)
})

router.get('/', async ctx => {
    ctx.response.body = {
      status: 'ok',
      code: 200
    }
  })

router.get('/favicon.ico', async context => {
    await send(context, context.request.url.pathname, {
      root: `${Deno.cwd()}/static`,
      index: "favicon.ico",
    })
  })

app.use(router.routes())
app.use(router.allowedMethods())
/*
app.use(ctx => {
  ctx.response.body = 'Hello World!'
})
*/

await app.listen({ port: 3000 })
