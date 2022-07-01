const router = require('koa-router')()
const uuid = require('uuid')
const fs = require('fs')
const path = require('path')
const query = require('../db/index')

router.prefix('/users')

router.get('/', function (ctx, next) {
  ctx.body = 'this is a users response!'
})

router.get('/bar', function (ctx, next) {
  ctx.body = 'this is a users/bar response'
})

// localhost:3000/users/list/1/10?age=19
router.get('/list/:page/:size', async (ctx, next) => {
  const params1 = ctx.params; // { page: '1', size: '10' }
  const params2 = ctx.request.query; // { age: 19 }
  const { page, size } = params1;
  const { age } = params2;
  const result = await query(`select * from user_table where age=? limit ${size} offset ${(page - 1) * size}`, [age])
  const total = await query(`select count(*) from user_table where age=?`, [age])
  ctx.body = {
    title: 'list',
    code: 200,
    message: '获取成功',
    data: result,
    total: total[0]['count(*)']
  }
})

router.post('/login', async (ctx, next) => {
  const { name, password } = ctx.request.body;
  const result = await query(`select * from user_table where name=? and password=?`, [name, password])
  ctx.body = {
    title: 'login',
    code: 200,
    message: result.length ? '登录成功' : '账号/密码错误',
    data: result
  }
})

router.post('/registor', async (ctx, next) => {
  const { name, age, password } = ctx.request.body;
  const users = await query('select * from user_table');
  for (let i = 0; i < users.length; i++) {
    if (users[i].name === name) {
      ctx.body = {
        title: 'registor',
        code: 200,
        message: '账号已存在',
        data: []
      }
      return;
    }
  }
  const result = await query(`insert into user_table set id=?, name=?, age=?, password=?`, [uuid.v1(), name, age, password])
    ctx.body = {
      title: 'registor',
      code: 200,
      message: '注册成功',
      data: result
    }
})

router.post('/uploadFile', async (ctx, next) => {
  const file = ctx.request.files.file;

  // 读取文件流
  const fileReader = fs.createReadStream(file.path);

  const filePath = path.join(__dirname, '/static/upload');
  // 组装成绝对路径
  const fileResource = filePath + `/${file.name}`;

  // 使用 createWriteStream 写入数据，而后使用管道流pipe拼接
  const writeStream = fs.createWriteStream(fileResource);
  fileReader.pipe(writeStream);
  ctx.body = {
    url: `http://localhost:3000/users/static/upload/${file.name}`,
    code: 0,
    message: '上传成功'
  };
})

module.exports = router
