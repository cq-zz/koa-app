const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const logger = require('koa-logger')
const cors = require('koa2-cors')
const koaBody = require('koa-body')
const bodyparser = require('koa-bodyparser')

const index = require('./routes/index')
const users = require('./routes/users')
const file = require('./routes/file')

// error handler
onerror(app)

app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'ejs'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

app.use(cors())

app.use(koaBody({
  multipart: true
}))

app.use(bodyparser({
  enableTypes: ['json', 'form', 'text']
}))

// routes
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())
app.use(file.routes(), file.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
