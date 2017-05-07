# 用Express框架--搭建便利贴网站

### 安装express

通过express创建本地服务器

```
var express = require('express');
var app = express()

app.get('/',function(req,res){
	res.send('Hello World')
});

var server = app.listen(3000,function(){
	var host = server.address().address;
	var port = server.address().port;

	console.log('Example app listening at http://%s:%s',host,port)
})

```

### 安装express-generator

搭建框架时，选择ejs模板引擎 `./node_modules/express-generator/bin/express-cli.js . --ejs -force` 点'.'表示在当前目录下创建



##### ejs模板引擎语法
基本用法大概三种
- 插入变量
`<%= varible %>`
- JavaScript For 循环
```
<ul>
<% for(var i=0;i<varibleArr.length;i++){%>
	<li> <%= varibleArr[i] %> <li>
<% } %>
</ul>
```
- JavaScript if条件语句

```
<% for(var i=0;i<people.length;i++){ %>
	<% if(people[i].length === 2){ %>
		This is a short name!
	<% } %>
	<strong> <%= people[i] %> </strong><br>
<% } %>

```
### 应用级中间件

应用级中间件绑定到app对象，使用app.use(),或者app.get()/app.put()/app.post()

var app = express()

//没有挂载路径的中间件，应用的每个请求都会执行该中间件

app.use(function(req,res,next){
	console.log('Time:',Date.now())
})

//挂载至 /user/:id 的中间件，任何指向 /user/:id的请求都会执行它

app.use('/user/:id',function(req,res,next){
	console.log('Request Type:',req.method);
});

//路由和句柄函数（中间件系统），处理指向 /user/:id 的GET请求

app.get('/user/:id',function(req,res,next){
	res.send('USER')
})

####下面这个例子展示了在一个挂载点装载一组中间件

//一个中间件栈，对任何指向 /user/:id 的HTTP请求打印出相关信息

app.use('/user/:id',function(req,res,next){
	console.log('Request URL:',req.originalUrl);
	next()
}, function(req,res,next){
	console.log('Request Type:',req.method);
	next()
})

#### 作为中间件系统的路由句柄，使得为路径定义多个路由成为可能。
在下面的例子中，为指向 /user/:id的GET请求定义了两个路由。第
二个路由虽然不会带来任何问题，但却永远不会被调用，因为第一个路由已经终止了请求-响应循环。

```
// 一个中间件栈，处理指向 /user/:id的GET请求
app.get('/user/:id',function(req,res,next){
	console.log('ID:',req.params.id);
	next();
}, function(req,res,next){
	res.send('User Info');
})

// 处理 /user/:id, 打印出用户 id ,这个路由永远不会被调用，因为上一个路由已经对请求做出了响应。
app.get('/user/:id',function(req,res,next){
	res.end(req.params.id) 
})
```

####  如果需要在中间件栈中跳过剩余中间件，调用 next('route') 方法将控制权交给下一个路由。
注意： next('route')只对使用app.verb()或router.VERB()加载的中间件有效
```
// 一个中间件栈，处理指向 /user/:id的 GET 请求
app.get('/user/:id',function(req,res,next){
	// 如果user id为0，调到下一个路由
	if(req.params.id === 0) next('route');
	// 否则将控制权交个栈中下一个中间件
	else next()
}, function(req,res,next){
	res.render('regular')
})

//处理 /user/:id ,渲染一个特殊页面
app.get('/user/:id',function(req,res,next){
	res.render('special')
})
```

### 路由级中间件

路由级中间件和应用级中间件一样，只是它绑定的对象为 express.Router().
`var router = express.Router()`
路由级使用`router.use()` 或 `router.VERB()`加载。
上述在应用级创建的中间件系统，可通过如下代码改写为路由级：
```
var app = express();
var router = express.Router();
//没有挂载路径的中间件，通过该路由的每个请求都会执行该中间件
router.use(function(req,res,next){
	console.log('Time:',Date.now())
});

// 一个中间件栈，显示任何指向 /user/:id 的HTTP请求的信息
router.use('/user/:id',function(req,res,next){
	console.log('Request URL:',req,originalUrl);
	next()
}, function(req,res,next){
	console.log('Tequest Type:',req.method);
});

// 一个中间件栈，处理指向 /user/:id的 GET 请求
router.get('/user/:id',function(req,res,next){
	//如果user id 为 0，调到下一个路由
	if(req.params.id === 0) next(route);
	// 负责将控制权交给栈中下一个中间件
	else next(); 
}, function(req,res,next){
	// 渲染常规页面
	res.render('regular')
});

router.get('/user/:id',function(req,res,next){
	console.log(req.params.id);
	res.render('special')
})
```
