
======================= 章节分割线 =======================

# 什么是 AJAX （Asynchronous JavaScript and XML）

---

## AJAX 的技术背景

AJAX 最早起源于1997年，由微软发明了 AJAX 的关键技术并在1995年 IE5 推出之际开始支持 XmlHttpRequset 对象，但令人遗憾的是微软发明 AJAX 之后没有看到它的前景，以至于 Google 成为 AJAX 技术的最卓越的推动者和实践者，从而奠定 Google 在 AJAX 发展史上的领先地位。

## AJAX 的技术意义

- 从过去的角度
- 从现在的角度
	- 提升用户体验
		- 并不能提高从服务器端下载数据的速度，而只是使这个等待不那么令人沮丧
	- 对传统 B/S 软件的冲击
- 从未来的角度
	- 未来本地化转为云端的趋势


# AJAX 的技术原理

---

周所周知 AJAX 并不是一种新的技术，而是由原本存在的几种技术的组成的聚合体，聚合体包含如下：

- 基于 XmlHttpRequest 对象
	- 通过XMLHttpRequest来和服务器进行异步通信
- 基于web标准
	- 使用 CSS、HTML（XHTML）呈现视觉效果
	- 操作DOM模型进行交互和动态呈现
	- 使用 javascript 来绑定和调用等操作

 
## XmlHttpRequest

XMLHttpRequest 是 AJAX 的核心机制，XMLHttpRequest 最早出现在 IE5 中，是一种支持异步请求的技术（即 javascript 异步向服务器提出请求和处理响应，而不阻塞线程，以达到无刷新的效果）。

### XMLHttpRequest 属性。

- onreadystatechange：每次状态改变所触发事件的事件处理程序。
- responseText：从服务器进程返回数据的字符串形式。
- responseXML：从服务器进程返回的DOM兼容的文档数据对象。
- responseBody：
- status：从服务器返回的数字代码，比如常见的 404（未找到）和 200（已就绪）。
- status Text：伴随状态码的字符串信息。
- readyState：对象状态值。
	- 0（未初始化）：对象已建立，但是尚未初始化（尚未调用 open 方法）。
	- 1（初始化）：对象已建立，尚未调用send方法。
	- 2（发送数据）：send 方法已调用，但是当前的状态及http头未知。
	- 3（数据传送中）：已接收部分数据，因为响应及 http 头不全，这时通过 responseBody 和 responseText 获取部分数据会出现错误。
	- 4（完成）：数据接收完毕,此时可以通过通过 responseXml 和 responseText 获取完整的回应数据。

### 创建 XMLHttpRequest 对象

但由于不同浏览器之间存在差异，所以创建一个XMLHttpRequest对象可能需要不同的方法。这个差异主要体现在IE和其它浏览器之间。

```
/**
 * 仍然需要更改 on 2015/11/18.
 * 使用原生js 封装ajax
 * 兼容xhr对象
 */
function createXHR(){
    if(typeof XMLHttpRequest != "undefined"){ // 非IE6浏览器
        return new XMLHttpRequest();
    }else if(typeof ActiveXObject != "undefined"){   // IE6浏览器
        var version = [
            "MSXML2.XMLHttp.6.0",
            "MSXML2.XMLHttp.3.0",
            "MSXML2.XMLHttp",
        ];
        for(var i = 0; i < version.length; i++){
            try{
                return new ActiveXObject(version[i]);
            }catch(e){
                //todo
            }
        }
    }else{
        throw new Error("您的系统或浏览器不支持XHR对象！");
    }
}
```

JAVASCRIPT 函数首先检查 XMLHttpRequest 的整体状态并且保证它已经完成，然后才可以执行后续操作。

```
/**
 * 仍然需要更改 on 2015/11/18.
 * 异步的时候需要触发onreadystatechange事件
 * readyStatus=4 即数据已经发送完毕
 * status=200 一切已经就绪
 */
xhr.onreadystatechange = function(){
    // 执行完成
    if(xhr.readyState == 4 && xhr.status==200){
        //HTTP响应已经完全接收才调用
        callBack();
    }
}
```

### XmlHttpRequest方法

- open
	- 向服务器提交数据的类型，即post还是get。
	- 请求的url地址和传递的参数
	- 传输方式，false为同步，true为异步。默认为true
		- 同步：同步方式(false)，客户机就要等到服务器返回消息后才去执行其他操作。
		- 异步：异步通信方式(true)，客户机就不等待服务器的响应。
- send
	- 发送请求。
- setRequestHeader
	- 设置请求头，如 `xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");`
 
在 AJAX 的整体工作流程中，我们将服务器端的 API 接口看成一个简单的数据接口，它接受由XMLHttpRequest向服务器端发送的请求信息并返回纯文本流（XML、Html、string、DataSet、json 或 Javascript 代码）。

# AJAX 的跨域访问

---

由于同源策略的限制，XHR（[XMLHttpRequest](https://dvcs.w3.org/hg/xhr/raw-file/tip/Overview.html)）对象不能直接与非同源的网站进行数据交互，那么如何安全并合乎规则的突破这一限制呢？

在 HTML5 的概念形成之后，W3C 于2008年2月提出 [XMLHttpRequest Level 2](http://www.w3.org/TR/XMLHttpRequest2/) （简称 XHR2）草案用以实现了跨域访问，全新的事件，请求进度、响应进度以及其他的一些新功能。与此同时 IE 也提出了 XDomianRequest ，XDomianRequest在功能上于 XHR2 类似。

## XHR2 （XMLHttpRequest  Level2）

### XHR2 兼容性

> - Chrome：2.0以上
> - Firefox：3.5以上
> - Internet Explorer：不支持
> - Opera：不支持
> - Safari：4.0以上

### XHR2 的工作流程

在网页中发起一个跨域请求：

```
/**
 * 仍然需要更改 on 2015/11/18.
 * xhr 对象 沿用 《AJAX 的技术原理》中“创建 XMLHttpRequest 对象”标题下的示例
 */
xhr.open('GET','http://kahn1990.com',true);//访问kahn1990.com
xhr.send();
```

在这个过程中流程如下：

- 浏览器客户端发起请求
	- 请求头中添加 Origin 头（与 Refer 请求头有点类似，但 Refer 因为隐私原因不出现在请求头里）
- 服务端接收到请求，判断是否同域
	- 同域
	- 跨域
- 服务端发送响应
- 浏览器客户端接收响应，然后根据响应头的规则来确定这个域是否同域
	- 同域：
	- 跨域：浏览器报错，接收到的数据也不提供给脚本

浏览器客户端在实现跨域访问和同源访问时，接收相应数据之前做的事情其实是一样的，跨域访问在接收响应后还需要检查规则，浏览器客户端响应头如下：

```
/**
 * 仍然需要更改 on 2015/11/18.
 * ！！！
 */
General
	Remote Address:103.245.222.133:80
	Request URL:http://kahn1990.com/
	Request Method:GET
	Status Code:304 Not Modified
Response Headers
	Age:6
	Cache-Control:max-age=600
	Connection:keep-alive
	Date:Thu, 19 Nov 2015 04:22:06 GMT
	Expires:Thu, 19 Nov 2015 04:31:59 GMT
	Vary:Accept-Encoding
	Via:1.1 varnish
	X-Cache:HIT
	X-Cache-Hits:1
	X-Fastly-Request-ID:5d7706209029a6368cec4ed2edf2345d7644185f
	X-Served-By:cache-itm7420-ITM
	X-Timer:S1447906926.159520,VS0,VE0
Request Headers
	Accept:text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8
	Accept-Encoding:gzip, deflate, sdch
	Accept-Language:zh-CN,zh;q=0.8
	Cache-Control:max-age=0
	Connection:keep-alive
	Host:kahn1990.com
	If-Modified-Since:Thu, 27 Aug 2015 09:40:23 GMT
	Upgrade-Insecure-Requests:1
	User-Agent:Mozilla/5.0 (iPhone; CPU iPhone OS 7_0 like Mac OS X; en-us) AppleWebKit/537.51.1 (KHTML, like Gecko) Version/7.0 Mobile/11A465 Safari/9537.53
```

在示例响应头中，浏览器会检查 Access-Control-Allow-Origin，具体可参考[Http Access Control](https://developer.mozilla.org/zh-TW/docs/HTTP/Access_control_CORS)
。
 
### XHR2 的功能检测

目前仍有一些浏览器没有实现 XHR2，所以在应用 AJAX 进行跨域访问之前，首先检测该浏览器是否支持跨域访问：

```
/**
 * 仍然需要更改 on 2015/11/18.
 * xhr 对象 沿用 《AJAX 的技术原理》中“创建 XMLHttpRequest 对象”标题下的示例
 */
if(typeof xhr.withCredentials!=undefined){
	//浏览器支持 xhr2 。
}else{
	//浏览器支持不 xhr2 。
}
```
 
### XHR2 的 onload 事件

XHR2 提供一系列新事件，在 XHR1 中我们一般只应用 onreadystatechange，然后检查状态值再决定下一步操作，XHR2 提供 onload 回调函数简化了这一步骤，在接收完数据的时候即可触发。

```
/**
 * 仍然需要更改 on 2015/11/18.
 * xhr 对象 沿用 《AJAX 的技术原理》中“创建 XMLHttpRequest 对象”标题下的示例
 */
xhr.onload=function(){
	//加载完成，进行下一步 todo。
}
```

### XHR2 的 onprogress 事件

XHR2 的 onprogress事件的回调函数的事件参数有两个重要属性：loaded和total，用来计算百分值。

```
/**
 * 仍然需要更改 on 2015/11/18.
 * xhr 对象 沿用 《AJAX 的技术原理》中“创建 XMLHttpRequest 对象”标题下的示例
 */
xhr.onprogress=function(e){
	console.log('Dwonloading:'+Math.ceil(e.loaded/e.total*100)+'%');
}
```

关注点：

- onprogress 什么时候触发一次？
- XHR里面有一个upload对象，也有onload和onprogress这两个事件,分别在上传完成和进度产生的时候触发。

## XDomianRequest

[XDomainRequest](http://msdn.microsoft.com/en-us/library/cc288060(v=VS.85).aspx) 与 XHR2 功能上类似，且在 XHR2 之前出现，在 IE 中 XDomainRequest 和 XMLHttpRequest 是两个不同的对象，

```
/**
 * 仍然需要更改 on 2015/11/18.
 */
var xhr = new XDomainRequest();
xhr.onprogress=function(e){
	console.log('Dwonloading:'+xhr.responseText.length);
};
xhr.onload=function(){
	//todo
}
```

关注点：

- IE 中 [progress](http://msdn.microsoft.com/en-us/library/cc197058(v=VS.85).aspx) 事件不具备进度功能，当每次 onprogress 触发时可以获得不完整的 responseText，但无法确定总体大小，所以不能确定下载进度。
- 不具备 upload 对象及其事件方法。
- XDomainRequest.onprogress 事件是每接收到一个数据包触发一次。



# 同步和异步

---

## 同步

> 同步传输是面向比特的传输，单位是帧，传输的过程中要求接受方和发送方的时钟保持一致。

在同步传输的过程中，比特的分组比较大，同步传输将需要发送的字符组合并一起发送，这些组合体称为数据帧（或简称为帧）。

- 数据帧的第一部分包含一组同步字符（数据帧开始标记），它是一个独特的比特组合，功能类似于异步传输的起始位，用于通知接收方数据帧已经到达，并确保接收方的采样速度和比特的到达速度保持一致，使收发双方进入同步。
- 数据帧的最后一部分是一组结束字符（数据帧结束标记）。功能类似于异步传输的停止位，用于表示当前数据帧传输结束。


## 异步

> 异步传输是面向字符的传输，单位是字符（将比特分成小组来进行传送），传输的过程中不要求接受方和发送方的时钟保持一致。

每个比特小组通常是一个8位字符，在每个小组的头部和尾部都有一个起始位和一个停止位，一段传输数据有 n 个比特小组组成。

- 每次异步传输的信息都以第一个小组的起始位开头，用于通知接收方传输数据已经到达。
- 在传输结束时，以最后一个小组的停止位通知此次传输数据的终止。

在实际生产中，同步传输通常要比异步传输快很多。在同步传输中，接收方不必对每个字符进行开始和停止的操作，一旦检测到帧同步字符，它就在接下来的数据到达时接收它们。

# AJAX 的优缺点

---

## 优点

- 无需刷新页面，增加用户体验。
- 减少页面整体的请求次数，减轻服务器和带宽的压力。

## 缺点

- 破坏了浏览器的后退机制。
	- 解决办法：通过创建或使用一个隐藏的IFRAME来重现页面上的变更。
- 安全问题
	- 不经意间会暴露比以前更多的数据和服务器逻辑。
	- 跨站点脚步攻击、SQL注入攻击和基于credentials的安全漏洞等。
- 对搜索引擎的支持比较弱。
- 破坏了程序的异常机制。
- 违背了url和资源定位的初衷。
- 一些手持设备（如手机、PDA等）现在还不能很好的支持ajax。

# AJAX 的优化
----------

## 缓存 AJAX

`异步`并不等于`即时`。

## 请求使用 GET

当使用`XMLHttpRequest`时，而URL长度不到`2K`，可以使用`GET`请求数据，`GET`相比`POST`更快速。

- `POST`类型请求要发送两个`TCP`数据包。
	- 先发送文件头。
	- 再发送数据。
- `GET`类型请求只需要发送一个`TCP`数据包。
	- 取决于你的`cookie`数量。


###GITHUB:[AJAX专题](https://github.com/kahn1990/ajax_kahn1990)
参考和借鉴了大家的经验，收集整理了这一篇开发规范，感谢所有的原作者，众人拾柴火焰高，技术无国界，持续更新中。
----------------------------------------