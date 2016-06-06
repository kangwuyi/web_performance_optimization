## AJAX（Asynchronous Javascript And XML：“异步JavaScript和XML”）



AJAX 已经是老生常谈的话题了，它最早起源于1997年，由 Microsoft 发明了其中的关键技术并由 Google 将其发扬光大。为什么是 Google 呢，这又是一个悲伤的故事，事实上在1995年 Microsoft 成功推出 IE5 之际就已经开始支持  XmlHttpRequset 对象，令人遗憾的是 Microsoft 高层没有看到它的前景，以至于后来者 Google 成为 AJAX 技术的最卓越的推动者和实践者，从而奠定 Google 在 AJAX 发展史上的领先地位。

- 从现在的角度
	- 提升用户体验
		- 虽然不能增加数据下载的速度和减少下载的数据，但可以减缓等待的过程
	- 对传统 B/S 软件的冲击
- 从未来的角度
	- 未来本地化转为云端的趋势（这里已经不算是未来了，毕竟已经基本实现了云端）

从1997这个关键词上我们就知道 AJAX 并不是一种新的技术，距今已经19年过去了 AJAX 的每次修订依然没有突破性的改变，由原本存在的几种技术的组成的聚合而成：

- 基于 XmlHttpRequest 对象
	- 通过 XMLHttpRequest 来和服务器进行异步通信
- 基于 WEB 标准
	- 使用 CSS、HTML（XHTML）呈现视觉效果
	- 操作 DOM 模型进行交互和动态呈现
	- 使用 JAVASCRIPT 绑定和调用等

### XMLHttpRequest

XMLHttpRequest 是 AJAX 的核心机制，XMLHttpRequest 最早出现在 IE5 中，是一种支持异步请求的技术（即 javascript 异步向服务器提出请求和处理响应，而不阻塞线程，以达到无刷新的效果）。

以上是很官方的对 XMLHttpRequest 的解释，这里不再重复造轮子，下面介绍一些简单的 XMLHttpRequest 属性：

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

但由于不同浏览器之间存在差异，所以 JAVASCRIPT 创建一个 XMLHttpRequest 对象需要不同的方法。这个差异主要体现在 IE 和其它浏览器之间，JAVASCRIPT 函数首先检查 XMLHttpRequest 的整体状态并且保证它已经完成，然后才可以执行后续操作，其中涉及到的一些方法如下：

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


	/**
	 * 使用原生js封装ajax
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
	/**
	 * 仍然需要更改 on 2015/11/18.
	 * 异步的时候需要触发onreadystatechange事件
	 * readyStatus=4 即数据已经发送完毕
	 * status=200 一切已经就绪
	 */
	var xhr = createXHR();
	xhr.onreadystatechange = function(){
	    // 执行完成
	    if(xhr.readyState == 4 && xhr.status==200){
	        //HTTP响应已经完全接收才调用
	        callBack();
	    }
	}

### XHR2 （XMLHttpRequest  Level2）

目前仍有一些浏览器没有实现 XHR2，所以在应用 AJAX 进行跨域访问之前，首先检测该浏览器是否支持跨域访问：

	if(typeof xhr.withCredentials!=undefined){
		//浏览器支持 xhr2 。
	}else{
		//浏览器支持不 xhr2 。
	}

XHR2 提供一系列新事件，在 XHR1 中我们一般只应用 onreadystatechange，然后检查状态值再决定下一步操作，XHR2 提供 onload 回调函数简化了这一步骤，在接收完数据的时候即可触发。

	xhr.onload=function(){
		//加载完成，进行下一步 todo。
	}

XHR2 的 onprogress事件的回调函数的事件参数有两个重要属性：loaded和total，用来计算百分值。

	xhr.onprogress=function(e){
		console.log('Dwonloading:'+Math.ceil(e.loaded/e.total*100)+'%');
	}

### XDomianRequest

[XDomainRequest](http://msdn.microsoft.com/en-us/library/cc288060(v=VS.85).aspx) 与 XHR2 功能上类似，且在 XHR2 之前出现，在 IE 中 XDomainRequest 和 XMLHttpRequest 是两个不同的对象，

	var xhr = new XDomainRequest();
	xhr.onprogress=function(e){
		console.log('Dwonloading:'+xhr.responseText.length);
	};
	xhr.onload=function(){
		//todo
	}

关注点：

- IE 中 [progress](http://msdn.microsoft.com/en-us/library/cc197058(v=VS.85).aspx) 事件不具备进度功能，当每次 onprogress 触发时可以获得不完整的 responseText，但无法确定总体大小，所以不能确定下载进度。
- 不具备 upload 对象及其事件方法。
- XDomainRequest.onprogress 事件是每接收到一个数据包触发一次。

### XMLHttpRequest 取舍之道

“鱼，我所欲也，熊掌亦我所欲也；二者不可得兼，舍鱼而取熊掌者也”，XMLHttpRequest 实现了页面无刷新更新数据，从而提升用户体验，减少页面整体的请求次数，减轻服务器和带宽的压力，但同时 XMLHttpRequest 也破坏了浏览器的后退机制（解决办法：通过创建或使用一个隐藏的IFRAME来重现页面上的变更）、破坏了程序的异常机制、违背了url和资源定位的初衷、不经意间会暴露比以前更多的数据和服务器逻辑、跨站点脚步攻击、SQL注入攻击和基于credentials的安全漏洞等等问题。


另外，有一些需要注意的地方

 - `异步`并不等于`即时`。
 - XMLHttpRequest 发送请求（URL长度不到`2K`，可以使用`GET`请求数据，`GET`相比`POST`更快速）
	- POST 类型请求要发送两个 TCP 数据包。
		- 先发送文件头。
		- 再发送数据。
	- GET 类型请求只需要发送一个 TCP 数据包。
		- 取决于你的 cookie 数量。

以及：

由于同源策略的限制，XHR（[XMLHttpRequest](https://dvcs.w3.org/hg/xhr/raw-file/tip/Overview.html)）对象不能直接与非同源的网站进行数据交互，那么如何安全并合乎规则的突破这一限制呢？

在 HTML5 的概念形成之后，W3C 于2008年2月提出 [XMLHttpRequest Level 2](http://www.w3.org/TR/XMLHttpRequest2/) （简称 XHR2）草案用以实现了跨域访问，全新的事件，请求进度、响应进度以及其他的一些新功能。与此同时 IE 也提出了 XDomianRequest ，XDomianRequest在功能上于 XHR2 类似。

浏览器检查 Access-Control-Allow-Origin，具体可参考[Http Access Control](https://developer.mozilla.org/zh-TW/docs/HTTP/Access_control_CORS)。

