const express = require('express');
const app = express();
const fs = require('fs')
const formidable = require('express-formidable'); //解析formdata
const cors = require('cors');
const WebSocket = require("ws");
let userData = []
let wss = new WebSocket.Server({ port: 3010 });




app.use((req, res, next) => {
  //读取文件
  fs.readFile('user.json', (error, data) => {
    data = JSON.parse(data)
  })
  // 广播
  // wss.broadcast = function(msg) {
  //   wss.clients.forEach(function each (client) {
  //     client.send(msg.toString());
  //   });
  // };
  next()
})

// 连接时触发
// 参考https://blog.csdn.net/qq_41097495/article/details/105835100
wss.on("connection", function(ws) {//先连接
  ws.on("message", function(data) {//用message来监听客户端发来的消息
    console.log(JSON.parse(data))
    let info = JSON.parse(data);
    if (info.type === 'login') {
      ws['user'] = info.id;
      fs.writeFile('user.json', (error, data) => {
        console.log(data)
      })
    } else {
      // 如果是信息请求 则遍历wss.clients这个客户端set对象
      // 注意 这个对象是set类型 所以需要使用forEach进行遍历
      wss.clients.forEach(item => {
        // 如果遍历到的客户端的user和info中的to相同 则发送信息给该客户端
        if (item['user'] === info.toId) {
          console.log(122)
          item.send(info)
        }
      });
    }
    // 调用广播
    // wss.broadcast(data)
  })
})
wss.on("close", function(data) {//用message来监听客户端发来的消息
  console.log(data, 55555)
  wss.close(function() {
    item.send(info)
  })
  // wss.broadcast(data)
})
// wss.close(function() {
//   console.log("服务器关闭之后执行的回调函数");
// })

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
