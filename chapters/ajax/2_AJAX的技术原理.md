
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