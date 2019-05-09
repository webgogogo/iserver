//引入express中间件
let express = require('express');
let proxy = require('http-proxy-middleware');
const fs = require('fs');
let app = express();
let modeParam = process.argv[2],
  mode = '',
  serverDir = '';
if (modeParam === 'dev') {
  mode = 'development';
  serverDir = './src/';
} else if (modeParam === 'pro') {
  mode = 'production';
  serverDir = './dist/';
} else {
  serverDir = './'
}
// 服务器访问目录
app.use(express.static(serverDir));
// 代理服务器地址
app.use('/service', proxy({
  target: 'http://172.16.0.174:10086/',
  changeOrigin: true,
  pathRewrite: {
    '^/service': ''
  }
}));
// 404重定向
app.get('*', function (req, res) {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  fs.readFile('./index.html', 'utf-8', function (err, data) {
    if (err) {
      res.end('404 not found');
    }
    res.end(data);
  });
  // 重定向
  // res.redirect('./index.html')
});

//监听端口
let server = app.listen(8888, function () {
  let port = server.address().port;
  console.log('\033[42;30m DONE \033[40;32m ' + mode + ' app listening at http://localhost:' + port + '\033[0m')
});