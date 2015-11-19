# AJAX的拓展

---

阻塞的AJAX请求 

执行两个，第三个等待
function simpleRequest()  
{  
   var request = new XMLHttpRequest();  
    request.open(”POST“, “Script.ashx“);  
    request.send(null);  
} 
function threeRequests()  
{  
    simpleRequest();  
    simpleRequest();  
    simpleRequest();  
} 

传统的跨域名异步请求解决方案 
　　AJAX安全性的唯一保证，似乎就是对于跨域名（Cross-Domain）AJAX请求 的限制。除非打开本地硬盘的网页，或者在IE中将跨域名传输数据的限制打开，否则向其他域名发出AJAX请求都会被禁止。而且对于跨域名的判断非常严格， 不同的子域名，或者相同域名的不同端口，都会被认作是不同的域名，我们不能向它们的资源发出AJAX请求。 

　　从表面上看起来似乎没有办法打破这个限制，还好我们有个救星，那就是iframe！ 

　　iframe虽然不在标准中出现，但是由于它实在有用，FireFox也“不得不”对它进 行了支持（类似的还有innerHTML）。网上已经有一些跨域名发出异步请求的做法，但是它们实在做的不好。它们的简单工作原理如下：在另一个域名下放 置一个特定的页面文件作为Proxy，主页面将异步请求的信息通过Query String传递入iframe里的Proxy页面，Proxy页面在AJAX请求执行完毕后将结果放在自己location的hash中，而主页面会对 iframe的src的hash值进行轮询，一旦发现它出现了改变，则通过hash值得到需要的信息。 

　　这个方法的实现比较复杂，而且功能有限。在 IE和FireFox中，对于URL的长度大约可以支持2000个左右的字符。对于普通的需求它可能已经足够了，可惜如果真要传递大量的数据，这就远远不 够了。与我们一会儿要提出的解决方案相比，可能它唯一的优势就是能够跨任意域名进行异步请求，而我们的解决方案只能突破子域名的限制。 

　　那么现在来看看我们的做法！ 

  

优雅地突破子域名的限制 

　　我们突破子域名限制的关键还是在于iframe。 

　　iframe是的好东西，我们能够跨过子域名来访问iframe里的页面对象，例如 window和DOM结构，包括调用JavaScript（通过window对象）——我们将内外页面的 document.domain设为相同就可以了。然后在不同子域名的页面发起不同的请求，把结果通过JavaScript进行传递即可。唯一需要的也仅 仅是一个简单的静态页面作为Proxy而已。 

　　我们现在就来开始编写一个原形，虽然简单，但是可以说明问题。 

　　首先，我们先来编写一个静态页面，作为放在iframe里的Proxy，如下： 

SubDomainProxy.html 
复制代码 代码如下:

<html xmlns=“http://www.w3.org/1999/xhtml” >  
<head>  
    <title>Untitled Page</title>  
    <script type=“text/javascript” language=“javascript”>  
        document.domain = “test.com“;        function sendRequest(method, url)  
        {  
            var request = new XMLHttpRequest();  
            request.open(method, url);  
            request.send(null);  
        }  
    </script>  
</head>  
<body>  
</body>  
</html> 


  

　　然后我们再编写我们的主页面： 


http://www.test.com/Default.html 

复制代码 代码如下:

<html xmlns=“http://www.w3.org/1999/xhtml” >  
<head runat=“server”>  
    <title>Untitled Page</title>  
    <script type=“text/javascript” language=“javascript”>  
        document.domain = “test.com“;        function simpleRequest()  
        {  
            var request = new XMLHttpRequest();  
            request.open(”POST“, “Script.ashx“);  
            request.send(null);  
        }  
function crossSubDomainRequest()  
        {  
            var proxy = document.getElementById(”iframeProxy“).contentWindow;  
            proxy.sendRequest('POST', ‘http://sub0.test.com/Script.ashx‘);  
        }  
function threeRequests()  
        {  
            simpleRequest();  
            simpleRequest();  
            crossSubDomainRequest();  
        }  
    </script>  
</head>  
<body>  
    <input type=“button” value=“Request” onclick=“threeRequests()” />  
    <iframe src=“http://sub0.test.com/SubDomainProxy.html” style=“display:none;”  
        id=“iframeProxy”></iframe>  
</body>  
</html> 
 　　当执行threeRequests方法时，将会同时请求http://www.test.com以及http://sub0.test.com两个不同域名下的资源。很明显，最后一个请求已经不会受到前两个请求的阻塞了：
script2.jpg
不同域名的请求不会被阻塞 

　　令人满意的结果！ 

　　虽说只能突破子域名，但是这已经足够了，不是吗？我们为什么要强求任意域名之间能够异步通 讯呢？更何况我们的解决方案是多么的优雅！在下一篇文章中，我们将会为ASP.NET AJAX客户端实现一个完整的CrossSubDomainRequestExecutor，它会自动判断是否正在发出跨子域名的请求，并选择AJAX请 求的方式。这样，客户端的异步通讯层就会对开发人员完全透明。世上还会有比这更令人愉快的事情吗？:) 

 注意事项 

　　可能以下几点值得一提： 

我在出现这个想法之后也作了一些尝试，最后发现创建XMLHttpRequest对象，调用open方法和send方法都必须在iframe中的页面中执行才能够在IE和FireFox中成功发送AJAX请求。 

在上面的例子中，我们向子域名请求的的路径是http://sub0.test.com/Script.ashx。请注意，完整的子域名不可以省略，否则在FireFox下就会出现权限不够的错误，在调用open方法时就会抛出异常——似乎FireFox把它当作了父页面域名的资源了。 
因为浏览器的安全策略，浏览器不允许不同域(比如：phinest.org和lab.phinest.org)、不同协议(比如: http://phinest.org和https://phinest.org)、不同端口(比如:http: phinest.org和http://phinest.org:8080)下的页面通过XMLHTTPRequest相互访问，这个问题同样影响着不同页面的Javascript的相互调用和控制，但是当主域、协议、端口相同时，通过设置页面的document.domain主域， Javascript可以在不同的子域名间访问控制，比如通过设置document.domain='phinest.org'，http: //phinest.org和http://lab.phinest.org页面可互访，这个特性也提供了此情况下不同子域名下的 XMLHTTPRequest相互访问的解决方案。 

对于主域、协议、端口相同时的Ajax跨域问题，很早就有设置document.domain来解决的说法，但一直没有看到具体的成功应用，这次尝试了一下，其原理就是，利用一个隐藏的iframe引入所跨另一子域的页面作为代理，通过Javascript来控制iframe引入的另一子域的 XMLHTTPRequest来进行数据获取。对于不同主域/不同协议/不同端口下的Ajax访问需要通过后台的代理来实现。 
