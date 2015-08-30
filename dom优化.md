###`DOM`优化
----------
>
- 优化节点修改。
	- 使用`cloneNode`在外部更新节点然后再通过`replace`与原始节点互换。
>
			var orig = document.getElementById('container');
			var clone = orig.cloneNode(true);
			var list = ['foo', 'bar', 'baz'];
			var content;
			for (var i = 0; i < list.length; i++) {
			   content = document.createTextNode(list[i]);
			   clone.appendChild(content);
			}
			orig.parentNode.replaceChild(clone, orig);
> - 优化节点添加
	>多个节点插入操作，即使在外面设置节点的元素和风格再插入，由于多个节点还是会引发多次reflow。
	- 优化的方法是创建`DocumentFragment`，在其中插入节点后再添加到页面。
		- 如`JQuery`中所有的添加节点的操作如`append`，都是最终调用`DocumentFragment`来实现的，
>
				createSafeFragment(document) {
				     var list = nodeNames.split( "|" ),
				         safeFrag = document.createDocumentFragment();
> 
				     if (safeFrag.createElement) {
				         while (list.length) {
				             safeFrag.createElement(
				                 list.pop();
				             );
				         };
				     };
				     return safeFrag;
				};
> - 优化`CSS`样式转换。
	>如果需要动态更改CSS样式，尽量采用触发reflow次数较少的方式。
	- 如以下代码逐条更改元素的几何属性，理论上会触发多次`reflow`。
>
			element.style.fontWeight = 'bold' ;
			element.style.marginLeft= '30px' ;
			element.style.marginRight = '30px' ;
	- 可以通过直接设置元素的`className`直接设置，只会触发一次`reflow`。
>
			element.className = 'selectedAnchor' ;
> - 减少`DOM`元素数量
	- 在`console`中执行命令查看`DOM`元素数量。
>
			`document.getElementsByTagName( '*' ).length`
	- 正常页面的`DOM`元素数量一般不应该超过`1000`。  
	- `DOM`元素过多会使`DOM`元素查询效率，样式表匹配效率降低，是页面性能最主要的瓶颈之一。
> - `DOM`操作优化。
	- `DOM`操作性能问题主要有以下原因。
		- `DOM`元素过多导致元素定位缓慢。
		- 大量的`DOM`接口调用。
			- `JAVASCRIPT`和`DOM`之间的交互需要通过函数`API`接口来完成，造成延时，尤其是在循环语句中。
		- `DOM`操作触发频繁的`reflow(layout)`和`repaint`。
		- `layout`发生在`repaint`之前，所以layout相对来说会造成更多性能损耗。
			- `reflow(layout)`就是计算页面元素的几何信息。
			- `repaint`就是绘制页面元素。
		- 对`DOM`进行操作会导致浏览器执行回流`reflow`。
	- 解决方案。
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
> - 优化`DOM`交互
	>在`JAVASCRIPT`中，`DOM`操作和交互要消耗大量时间，因为它们往往需要重新渲染整个页面或者某一个部分。
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
> - 回流`reflow`。
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
>        
			    element.style.backgroundColor = "blue";
>  
			- 使用更改`className`的方式替换`style.xxx=xxx`的方式。  
			- 使用`style.cssText = '';`一次写入样式。  
			- 避免设置过多的行内样式。  
			- 添加的结构外元素尽量设置它们的位置为`fixed`或`absolute`。  
			- 避免使用表格来布局。  
			- 避免在`CSS`中使用`JavaScript expressions(IE only)`。  
		- 将获取的`DOM`数据缓存起来。这种方法，对获取那些会触发回流操作的属性（比如`offsetWidth`等）尤为重要。  
		- 当对HTMLCollection对象进行操作时，应该将访问的次数尽可能的降至最低，最简单的，你可以将length属性缓存在一个本地变量中，这样就能大幅度的提高循环的效率。
