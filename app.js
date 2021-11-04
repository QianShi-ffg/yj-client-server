const express = require('express');
const app = express();
const formidable = require('express-formidable'); //解析formdata
const cors = require('cors');
const WebSocket = require("ws");
let wss = new WebSocket.Server({ port: 3010 });

wss.broadcast = function(msg) {
  wss.clients.forEach(function each (client) {
    client.send(msg.toString());
  });
};
// 连接时触发
wss.on("connection", function(ws) {//先连接
  ws.on("message", function(data) {//用message来监听客户端发来的消息
    console.log(data)
    wss.broadcast(data)
  })
  ws.on("close", function(data) {//用message来监听客户端发来的消息
    console.log(data, 55555)
    // wss.broadcast(data)
  })
})

const port = 3000;
app.use(cors());
app.use(formidable());

app.get('/chatList', (req, res, next) => {
  console.log(req.query)
  res.status('200').send({
    code: 200, message: '666666',
    data: [{
      icon: '',
      name: 'mychat',
      id: 'fafdsafasd'
    }, {
      icon: '',
      name: 'mychat1',
      id: 'sgaasdgg'
    }, {
      icon: '',
      name: 'mychat2',
      id: 'bvcbxcvzvz'
    }, {
      icon: '',
      name: 'mychat3',
      id: 'erhrtggd'
    }, {
      icon: '',
      name: 'mychat4',
      id: 'jhjhfgcn'
    }]
  })
})


app.listen(port, () => {
  console.log('66666');
});
