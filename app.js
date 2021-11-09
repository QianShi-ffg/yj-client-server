const express = require('express');
const app = express();
const fs = require('fs')
const formidable = require('express-formidable'); //解析formdata
const cors = require('cors');
const WebSocket = require("ws");

let wss = new WebSocket.Server({ port: 3010 });
let userData = []



app.use((req, res, next) => {
  //读取文件
  fs.readFile('user.json', (error, data) => {
    console.log(JSON.parse(data))
    userData = JSON.parse(data)
    next()
  })
})

// 连接时触发
// 参考https://blog.csdn.net/qq_41097495/article/details/105835100
wss.on("connection", function(ws) {//先连接
  ws.on("message", function(data) {//用message来监听客户端发来的消息
    // console.log(JSON.parse(data), 555666)
    let info = JSON.parse(data);
    if (info.type === 'login') {
      ws['user'] = info.id;
    } else {
      let clientArr = []
      let isOnline = null
      let userClient = null
      // 如果是信息请求 则遍历wss.clients这个客户端set对象
      // 注意 这个对象是set类型 所以需要使用forEach进行遍历
      wss.clients.forEach(item => {
        console.log(item['user'], info.toId, 'item.user')
        clientArr.push(item)
        // 如果遍历到的客户端的user和info中的to相同 则发送信息给该客户端
        if (item['user'] === info.toId) {
          isOnline = item
        } else if (item['user'] === info.uuid) {
          userClient = item
        }
        //  else {
        //   info.failSend = true
        //   item.send(JSON.stringify(info))
        // }
      });
      // let currentClient = null
      // let isOnline = clientArr.filter(item => {
      //   return item['user'] === info.toId
      // })
      console.log(isOnline, 999)
      if (isOnline) {
        // if (item['user'] === info.toId) {
        // console.log(122)
        info.failSend = false
        isOnline.send(JSON.stringify(info))
        userClient.send(JSON.stringify(info))
        // }
      } else {
        info.failSend = true
        userClient.send(JSON.stringify(info))
      }
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
app.post('/login', (req, res, next) => {
  const { name, password } = req.fields
  let userArr = userData.filter(item => {
    return item.id === name
  })
  if (userArr.length > 0) {
    if (userArr[0].password === password) {
      res.json({
        code: 200, data: userArr[0], message: '666666'
      })
    } else {
      res.json({
        code: 401, data: [], message: '密码不正确'
      })
    }
  } else {
    res.json({
      code: 401, data: [], message: '该账户尚未注册'
    })
  }
})
app.get('/chatList', (req, res, next) => {
  // let userData = []
  // fs.readFile('user.json', (error, data) => {
  // console.log(JSON.parse(data))
  // userData = JSON.parse(data)
  res.status('200').send({
    code: 200, message: '666666',
    data: userData
  })
  // })
})


app.listen(port, () => {
  console.log('66666');
});
