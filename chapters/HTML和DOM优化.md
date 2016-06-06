## HTML 和 DOM 优化

HTML 优化可以分成前端和后端两种，前端怎么优化呢，重点在于存储缓存的合理应用和 HTML 标签的语义化等等，用一个列表来叙述：

### HTML 文件中如何插入 JAVASCRIPT 代码

JAVASCRIPT 如何插入的问题（我邪恶了ヽ(ˋДˊ)ノ ）要从 JAVASCRIPT 如何渲染开始。当浏览器解析 HTML 标签到 SCRIPT 时，会执行里面的 JAVASCRIPT 语句直至结束再继续解析余下标签，所以第一点：

- 尝试使用defer方式加载 JAVASCRIPT 脚本。
- 尽量 JAVASCRIPT 脚本放在底部，以防止 JAVASCRIPT 阻塞。
	- 也可以在头部分放置需要装入的一些JavaScript，但是前提是它以异步方式装入。
- JAVASCRIPT 中使用`document.write`生成页面内容会效率较低，可以找一个容器元素，比如指定一个`div`，并使用`innerHTML`来将`HTML`代码插入到页面中。
- 避免空的`src`和`href`。当`link`标签的`href`属性为空、`script`标签的`src`属性为空的时候，浏览器渲染的时候会把当前页面的`URL`作为它们的属性值，从而把页面的内容加载进来作为它们的值，（包括 CSS）。
- 利用预加载优化资源。
- 加快JavaScript装入速度工具 Lab.js
	- 借助LAB.js（装入和阻止JavaScript），你就可以并行装入JavaScript文件，加快总的装入过程。此外，你还可以为需要装入的脚本设置某个顺序，那样就能确保依赖关系的完整性。此外，开发者声称其网站上的速度提升了2倍。
- 使用适当的CDN：
	- 现在许多网页使用内容分发网络（CDN）。它可以改进你的缓存机制，因为每个人都可以使用它。它还能为你节省一些带宽。你很容易使用ping检测或使用Firebug调试那些服务器，以便搞清可以从哪些方面加快数据的速度。选择CDN时，要照顾到你网站那些访客的位置。记得尽可能使用公共存储库。
- 异步装入跟踪代码：
	>脚本加载与解析会阻塞HTML渲染，可以通过异步加载方式来避免渲染阻塞，步加载的方式很多，比较通用的方法如下。

		var _gaq = _gaq || []; 
		    _gaq.push(['_setAccount', 'UA-XXXXXXX-XX']); 
		    _gaq.push(['_trackPageview']); 
	    (function() { 
	        var ga = document.createElement('script'); ga.type = 'text/JavaScript'; ga.async = true; 
	        ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js'; 
	        var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s); 
	    })();

	或者

		function loadjs (script_filename){
		     var script = document.createElement( 'script' );
		     script.setAttribute( 'type' , 'text/javascript' );
		     script.setAttribute( 'src' , script_filename);
		     script.setAttribute( 'id' , 'script-id' );
	 
		     scriptElement = document.getElementById( 'script-id' );
		     if (scriptElement){
		         document.getElementsByTagName( 'head' )[0].removeChild(scriptElement);
		     }
		     document.getElementsByTagName( 'head' )[0].appendChild(script);
		}
		var script = 'scripts/alert.js' ;
		loadjs(script);

- 把你的JavaScript打包成PNG文件
	- 将JavaScript/css数据打包成PNG文件。之后进行拆包，只要使用画布API的getImageData()。可以在不缩小数据的情况下，多压缩35%左右。而且是无损压缩，对比较庞大的脚本来说，在图片指向画布、读取像素的过程中，你会觉得有“一段”装入时间。

### CSS 哪些内容需要注意

在 CSS 中我们可能要兼容这个那个浏览器，这个太蛋疼了这里不说了：

- 重构 CSS 结构，把重要内容的优先级提高，这个和 HTML 代码相辅相成，亦是重构 HTML 代码。
- 合理架构，使DOM结构尽量简单。
- 尽量避免CSS表达式和滤镜。


### JAVASCRIPT 有哪些需要注意的地方

- 利用`LocalStorage`合理缓存资源。
- 新特性Beacon，不堵塞队列的异步数据发送。
- 使用HTML5 Web Workers来允许多线程工作。

### HTML

- 使用响应式图片。
- 为不同的Viewports设置不同大小的Content。

### 客户端需要注意些什么呢

- Post-load（次要加载）不是必须的资源。
- 尽量多地缓存文件。
- 支持新接口协议。
- 资源优化Resource Hints(preconnect, preload, 和prerender)。
- 缓存离线机制：Service Workers。

### 服务端的简单优化
 
- 避免404。
	- 更改404错误响应页面可以改进用户体验，但是同样也会浪费服务器资源。
	- 指向外部`JAVASCRIPT`的链接出现问题并返回404代码。
		- 这种加载会破坏并行加载。
		- 其次浏览器会把试图在返回的404响应内容中找到可能有用的部分当作JavaScript代码来执行。
- 删除重复的`JAVASCRIPT`和`CSS`。
	- 重复调用脚本缺点。
		- 增加额外的HTTP请求。
		- 多次运算也会浪费时间。在IE和Firefox中不管脚本是否可缓存，它们都存在重复运算`JAVASCRIPT`的问题。
- `ETags`配置`Entity`标签。
	- `ETags`用来判断浏览器缓存里的元素是否和原来服务器上的一致。
		- 与`last-modified date`相比更灵活。
			>如某个文件在1秒内修改了10次，`ETags`可以综合`Inode`(文件的索引节点`inode`数)，`MTime`(修改时间)和`Size`来精准的进行判断，避开`UNIX`记录`MTime`只能精确到秒的问题。服务器集群使用，可取后两个参数。使用`ETags`减少`Web`应用带宽和负载
- 权衡DNS查找次数
	- 减少主机名可以节省响应时间。但同时也会减少页面中并行下载的数量。
		- `IE`浏览器在同一时刻只能从同一域名下载两个文件。当在一个页面显示多张图片时，`IE`用户的图片下载速度就会受到影响。
- 通过Keep-alive机制减少TCP连接。
- 通过CDN减少延时。
- 平行处理请求（参考BigPipe）。
- 通过合并文件或者Image Sprites减少HTTP请求。
- 减少重定向（ HTTP 301和40x/50x）。
- 设置Cache-Control和Expires头

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

	具体的标准定义可以参考http1.1中的定义，简单来说Expires控制过期时间是多久，Cache-Control控制什么地方可以缓存 。

### DOM 优化

#### 优化节点修改：

使用`cloneNode`在外部更新节点然后再通过`replace`与原始节点互换。

		var orig = document.getElementById('container');
		var clone = orig.cloneNode(true);
		var list = ['foo', 'bar', 'baz'];
		var content;
		for (var i = 0; i < list.length; i++) {
		   content = document.createTextNode(list[i]);
		   clone.appendChild(content);
		}
		orig.parentNode.replaceChild(clone, orig);

#### 优化节点添加：

多个节点插入操作，即使在外面设置节点的元素和风格再插入，由于多个节点还是会引发多次reflow。优化的方法是创建`DocumentFragment`，在其中插入节点后再添加到页面。这里以 JQuery 中所有的添加节点的操作如`append` 为例，都是最终调用`DocumentFragment`来实现的，

		createSafeFragment(document) {
		     var list = nodeNames.split( "|" ),
		         safeFrag = document.createDocumentFragment();
		
		     if (safeFrag.createElement) {
		         while (list.length) {
		             safeFrag.createElement(
		                 list.pop();
		             );
		         };
		     };
		     return safeFrag;
		};

#### 优化`CSS`样式转换。

如果需要动态更改CSS样式，尽量采用触发reflow次数较少的方式，如以下代码逐条更改元素的几何属性，理论上会触发多次`reflow`。

		element.style.fontWeight = 'bold' ;
		element.style.marginLeft= '30px' ;
		element.style.marginRight = '30px' ;

可以通过直接设置元素的`className`直接设置，只会触发一次`reflow`。

		element.className = 'selectedAnchor' ;

#### 减少`DOM`元素数量：

在`console`中执行命令查看`DOM`元素数量。

		document.getElementsByTagName( '*' ).length

在一个正常页面的`DOM`元素数量一般不应该超过`1000`，`DOM`元素过多会使`DOM`元素查询效率，样式表匹配效率降低，是页面性能最主要的瓶颈之一。

#### DOM 操作优化。

DOM 操作性能问题主要有以下诸多原因。

- `DOM`元素过多导致元素定位缓慢。
- 大量的`DOM`接口调用。
	- `JAVASCRIPT`和`DOM`之间的交互需要通过函数`API`接口来完成，造成延时，尤其是在循环语句中。
- `DOM`操作触发频繁的`reflow(layout)`和`repaint`。
- `layout`发生在`repaint`之前，所以layout相对来说会造成更多性能损耗。
	- `reflow(layout)`就是计算页面元素的几何信息。
	- `repaint`就是绘制页面元素。
- 对`DOM`进行操作会导致浏览器执行回流`reflow`。

解决方案：

- 纯`JAVASCRIPT`执行时间是很短的。
- 最小化`DOM`访问次数，尽可能在js端执行。
- 如果需要多次访问某个`DOM`节点，请使用局部变量存储对它的引用。
- 谨慎处理`HTML`集合（`HTML`集合实时连系底层文档），把集合的长度缓存到一个变量中，并在迭代中使用它，如果需要经常操作集合，建议把它拷贝到一个数组中。
- 如果可能的话，使用速度更快的API，比如`querySelectorAll`和`firstElementChild`。
- 要留意重绘和重排。
- 批量修改样式时，`离线`操作`DOM`树。
- 使用缓存，并减少访问布局的次数。
- 动画中使用绝对定位，使用拖放代理。
- 使用事件委托来减少事件处理器的数量。

#### 优化 DOM 交互

在`JAVASCRIPT`中，`DOM`操作和交互要消耗大量时间，因为它们往往需要重新渲染整个页面或者某一个部分。

- 最小化`现场更新`。
	- 当需要访问的`DOM`部分已经已经被渲染为页面中的一部分，那么`DOM`操作和交互的过程就是再进行一次`现场更新`。
	 - `现场更新`是需要针对`现场`（相关显示页面的部分结构）立即进行更新，每一个更改（不管是插入单个字符还是移除整个片段），都有一个性能损耗。
	 - 现场更新进行的越多，代码完成执行所花的时间也越长。
- 多使用`innerHTML`。
	- 有两种在页面上创建`DOM`节点的方法：
		- 使用诸如`createElement()`和`appendChild()`之类的`DOM`方法。
		- 使用`innerHTML`。
			- 当使用`innerHTML`设置为某个值时，后台会创建一个`HTML`解释器，然后使用内部的`DOM`调用来创建`DOM`结构，而非基于`JAVASCRIPT`的`DOM`调用。由于内部方法是编译好的而非解释执行，故执行的更快。
		>对于小的`DOM`更改，两者效率差不多，但对于大的`DOM`更改，`innerHTML`要比标准的`DOM`方法创建同样的`DOM`结构快得多。
- 回流`reflow`。
- 发生场景。
	- 改变窗体大小。 
	- 更改字体。
	- 添加移除stylesheet块。
	- 内容改变哪怕是输入框输入文字。
	- CSS虚类被触发如 :hover。
	- 更改元素的className。
	- 当对DOM节点执行新增或者删除操作或内容更改时。  
	- 动态设置一个style样式时（比如element.style.width="10px"）。  
	- 当获取一个必须经过计算的尺寸值时，比如访问offsetWidth、clientHeight或者其他需要经过计算的CSS值。
- 解决问题的关键，就是限制通过DOM操作所引发回流的次数。
	- 在对当前DOM进行操作之前，尽可能多的做一些准备工作，保证N次创建，1次写入。  
	- 在对DOM操作之前，把要操作的元素，先从当前DOM结构中删除：  
		- 通过removeChild()或者replaceChild()实现真正意义上的删除。  
		- 设置该元素的display样式为“none”。 	
	- 每次修改元素的style属性都会触发回流操作。
    
		    element.style.backgroundColor = "blue";

		- 使用更改`className`的方式替换`style.xxx=xxx`的方式。  
		- 使用`style.cssText = '';`一次写入样式。  
		- 避免设置过多的行内样式。  
		- 添加的结构外元素尽量设置它们的位置为`fixed`或`absolute`。  
		- 避免使用表格来布局。  
		- 避免在`CSS`中使用`JavaScript expressions(IE only)`。  
	- 将获取的`DOM`数据缓存起来。这种方法，对获取那些会触发回流操作的属性（比如`offsetWidth`等）尤为重要。  
	- 当对HTMLCollection对象进行操作时，应该将访问的次数尽可能的降至最低，最简单的，你可以将length属性缓存在一个本地变量中，这样就能大幅度的提高循环的效率。


