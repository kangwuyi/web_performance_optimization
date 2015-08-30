前端性能优化指南
===================
###目录结构
----------
> 	1 Start from Server 从服务器着手
	- 1.1 Reduce TCP Connection by Keep-alive 通过Keep-alive机制减少TCP连接
	- 1.2 Fix Latency Problems with a CDN 通过CDN减少延时
	- 1.3 Configure Entity Tags 配置Entity标签
	- 1.4 Set an Expires or Cache Control Headers 在Headers里面设置Expires或者Cache Control
	- 1.5 Compress Files in Gzip 通过Gzip压缩文件
	- 1.6 Process Parallely (BigPipe) 平行处理请求（参考BigPipe）
	 
	2 Try the Tricks in Content 尝试优化Content
	- 2.1 Reduce HTTP Request by Combining Files or Image Sprites 通过合并文件或者Image Sprites减少HTTP请求
	- 2.2 Avoiding Redirects（ HTTP 301 and 40x/50x） 减少重定向（ HTTP 301和40x/50x）
	- 2.3 Structure the HTML to Prioritize Critical Content 重构HTML，把重要内容的优先级提高
	- 2.4 Post-load the Not Absolutely Required Content Post-load（次要加载）不是必须的资源
	- 2.5 Take Advantage of Pre-loading 利用预加载优化资源
	- 2.6 Keep Your DOM Simple 合理架构，使DOM结构尽量简单
	- 2.7 Minify Resources by Compressing 压缩资源，减小加载压力
	- 2.8 Use LocalStorage 利用LocalStorage合理缓存资源
	- 2.9 Choose the Right Format for Images 使用格式正确的图片
	 
	3 Optimize Scripts and CSS 优化脚本和CSS
	- 3.1 Inline Small CSS and Javascript Resources 把小的CSS和Js资源放置于行内
	- 3.2 Put Stylesheets at the Top and Scripts at the Bottom 把样式文件放在上端，把脚本放在后面
	- 3.3 Avoid CSS Expressions and Filters 尽量避免CSS表达式和滤镜
	- 3.4 Try Defer Loading of Javascript 尝试使用defer方式加载Js脚本
	- 3.5 Be Cautious to DOM Access 谨慎通过脚本访问DOM
	- 3.6 New Feature: will-change 新特性：will-change，把即将发生的改变预先告诉浏览器
	- 3.7 New Feature: Beacon 新特性Beacon，不堵塞队列的异步数据发送
	 
	4 Paint Faster 实现更快的页面绘制
	- 4.1 Take Advantage of HTML5 New Elements and CSS3 New Features 使用HTML5和CSS3的一些新特性
	- 4.2 Avoid Plugins 避免使用插件
	- 4.3 Avoid Scaling Images in HTML 避免在HTML里面缩放图片
	- 4.4 Make Sure Font Size is Valid 确保使用正确的字体大小
	- 4.5 Page Visibility 决定当前页面是不是能被访问
	 
	5 Think about Mobile 从移动的角度思考
	- 5.1 What's Different? -- Slower Network, Smaller Cache, Unsatisfactory Browser Processing 不同之处：网络缓慢，缓存更小，不令人满意的浏览器处理机制
	- 5.2 Cache as Much as Possible 尽量多地缓存文件
	- 5.3 Use HTML5 Web Workers to Enable Multi-threading 使用HTML5 Web Workers来允许多线程工作
	- 5.4 Use Server-sent Events 使用Server-sent Events
	- 5.4 Include a Meta Viewport 设置一个Meta Viewport
	- 5.5 Size Content to Different Viewports 为不同的Viewports设置不同大小的Content
	- 5.6 Size Tap Targets Properly 正确设置可Tap的目标的大小
	- 5.7 Try Responsively-sized Images 使用响应式图片
	- 5.8 Consider Using Acceleration Hardware 考虑使用可加速硬件
	- 5.9 Support new Protocals (HTTP2) 支持新接口协议（如HTTP2）
	- 5.10 Future of caching/offline: Service Workers 未来的缓存离线机制：Service Workers
	- 5.11 Future Resource Loading Optimization, Resource Hints(preconnect, preload, and prerender) 未来的资源优化Resource Hints(preconnect, preload, 和prerender)
	 
	6 Test Often 经常测试
	- 6.1 Measure all the Optimization by Testing 通过测试来检验你的所有性能优化手段
	- 6.2 Analyze the Waterfall Chart 分析浏览器提供的Waterfall图片来思考优化入口
	- 6.3 Discover Where are the Bottlenecks 发现性能瓶颈处
	- 6.4 Try Some New Testing Methods(Navigation, Resource, and User timing) 新的测试手段（Navigation, Resource, 和User timing, http://www.w3.org/wiki/Web_Performance/Publications）
	- 6.5 requestAnimationFrame(Script-based animations where the user agent is in control of limiting the update rate of the animation) （以脚本为基础的动画，由浏览器控制动画的更新频率）


