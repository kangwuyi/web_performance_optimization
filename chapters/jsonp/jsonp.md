用原生js来处理跨域的数据（jsonp）

说明总结：

1.ajax和jsonp其实本质上是不同的东西。ajax的核心是通过XmlHttpRequest获取非本页内容，而jsonp的核心则是动态添加<script>标签来调用服务器提供的js脚本。

2.但是ajax和jsonp在数据传输的过程中都是可以用json格式的数据。

3.其实ajax与jsonp的区别不在于是否跨域，ajax通过服务端代理一样可以实现跨域，jsonp本身也不排斥同域的数据的获取。

4.ajax和jsonp这两种技术在调用方式上“看起来”很像，目的也一样，都是请求一个url，然后把服务器返回的数据进行处理，因此jquery和ext等框架都把jsonp作为ajax的一种形式进行了封装；



# 服务端 

返回的结果中，向输出流中一定要输出一个双方约定好Js的执行函数，如fn();可在fn()中添加参数，如fn(a,b)

,这样在页面中引入此页面中，就会向页面中输出此函数的调用。如果在主页面中定义好此函数，当页面执行到引入处时就会调用此函数了，就实现了跨域的目的。

# 客户端

//供jsonp服务的url地址（不管是什么类型的地址，最终生成的返回值都是一段javascript代码）
//其实参数都是前端和后台程序员规定的，前端传过去，后端判断获取即可。
var url = "flightResult.php?code=" + flightId +"&callback=flightHandler";
 // 创建script标签，设置其属性
var script = document.createElement('script');
script.setAttribute('src', url);
// 把script标签加入head，此时调用开始
document.getElementsByTagName('head')[0].appendChild(script); 