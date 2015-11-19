###js载入优化
----------
>
- 加快JavaScript装入速度的工具：
	- Lab.js
		- 借助LAB.js（装入和阻止JavaScript），你就可以并行装入JavaScript文件，加快总的装入过程。此外，你还可以为需要装入的脚本设置某个顺序，那样就能确保依赖关系的完整性。此外，开发者声称其网站上的速度提升了2倍。
- 使用适当的CDN：
>
	- 现在许多网页使用内容分发网络（CDN）。它可以改进你的缓存机制，因为每个人都可以使用它。它还能为你节省一些带宽。你很容易使用ping检测或使用Firebug调试那些服务器，以便搞清可以从哪些方面加快数据的速度。选择CDN时，要照顾到你网站那些访客的位置。记得尽可能使用公共存储库。
- 网页末尾装入JavaScript：
>
	- 也可以在头部分放置需要装入的一些JavaScript，但是前提是它以异步方式装入。
- 异步装入跟踪代码：
	>脚本加载与解析会阻塞HTML渲染，可以通过异步加载方式来避免渲染阻塞，步加载的方式很多，比较通用的方法如下。
>
		var _gaq = _gaq || []; 
		    _gaq.push(['_setAccount', 'UA-XXXXXXX-XX']); 
		    _gaq.push(['_trackPageview']); 
	    (function() { 
	        var ga = document.createElement('script'); ga.type = 'text/JavaScript'; ga.async = true; 
	        ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js'; 
	        var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s); 
	    })();
>
	或者
>
		function loadjs (script_filename){
		     var script = document.createElement( 'script' );
		     script.setAttribute( 'type' , 'text/javascript' );
		     script.setAttribute( 'src' , script_filename);
		     script.setAttribute( 'id' , 'script-id' );
>	 
		     scriptElement = document.getElementById( 'script-id' );
		     if (scriptElement){
		         document.getElementsByTagName( 'head' )[0].removeChild(scriptElement);
		     }
		     document.getElementsByTagName( 'head' )[0].appendChild(script);
		}
		var script = 'scripts/alert.js' ;
		loadjs(script);
>
- 把你的JavaScript打包成PNG文件
	- 将JavaScript/css数据打包成PNG文件。之后进行拆包，只要使用画布API的getImageData()。可以在不缩小数据的情况下，多压缩35%左右。而且是无损压缩，对比较庞大的脚本来说，在图片指向画布、读取像素的过程中，你会觉得有“一段”装入时间。
>
- 设置Cache-Control和Expires头
>
	通过Cache-Control和Expires头可以将脚本文件缓存在客户端或者代理服务器上，可以减少脚本下载的时间。
	>
	Expires格式:
	>
		Expires = "Expires" ":" HTTP-date
		Expires: Thu, 01 Dec 1994 16:00:00 GMT
		Note: if a response includes a Cache-Control field with the max-age directive that directive overrides the
		Expires field.
	>
	Cache-Control格式：
	>
		Cache-Control   = "Cache-Control" ":" 1#cache-directive
		Cache-Control: public
>
	具体的标准定义可以参考http1.1中的定义，简单来说Expires控制过期时间是多久，Cache-Control控制什么地方可以缓存 。