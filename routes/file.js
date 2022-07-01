const router = require('koa-router')()
const fs = require('fs')
const path = require('path')
const mime = require('mime-types')

router.prefix('/static')

router.get(`/upload/:name`, async (ctx, next) => {
  const url = ctx.request.url
  // 同步读取
  let filePath = path.join(__dirname, url); //图片地址
  let file = null;
  file = fs.readFileSync(filePath); //读取文件

  let mimeType = mime.lookup(filePath); //读取文件类型
  ctx.set('content-type', mimeType); //设置返回类型
  ctx.body = file;
})

module.exports = router
