即时通信模块，基于websocket 有两种模式： 内部沟通模式和客服模式

---------------------

# 转换im.js

因为im.js里用户如class等es6新语法，在IE11下支持不完善。所以需要通过babel工具进行转换。

> 第一次使用前，需要安装node相关插件

```
npm install
```

> 监控im.js

```
npm run dev
```

如果im.js有修改，会自动在目录下生成im-ie.js 