
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

在示例响应头中，浏览器会检查 Access-Control-Allow-Origin，具体可参考[Http Access Control](https://developer.mozilla.org/zh-TW/docs/HTTP/Access_control_CORS)。
 
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

