Virtual DOM 是一个模拟 DOM 树的 JavaScript 对象。 React 使用 Virtual DOM 来渲染 UI，当组件状态 state 有更改的时候，React 会自动调用组件的 render 方法重新渲染整个组件的 UI。

React 主要的目标是提供一套不同的, 高效的方案来更新 DOM.不是通过直接把 DOM 变成可变的数据, 而是通过构建 “Virtual DOM”, 虚拟的 DOM, 随后 React 处理真实的 DOM 上的更新来进行模拟相应的更新。

引入额外的一个层怎么就更快了呢?
那不是意味着浏览器的 DOM 操作不是最优的, 如果在上边加上一层能让整体变快的话?是有这个意思, 只不过 virtual DOM 在语义上和真实的 DOM 有所差别.最主要的是, virtual DOM 的操作, 不保证马上就会产生真实的效果.这样就使得 React 能够等到事件循环的结尾, 而在之前完全不用操作真实的 DOM。在这基础上, React 计算出几乎最小的 diff, 以最小的步骤将 diff 作用到真实的 DOM 上。批量处理 DOM 操作和作用最少的 diff 是应用自身都能做到的.任何应用做了这个, 都能变得跟 React 一样地高效。但人工处理出来非常繁琐, 而且容易出错. React 可以替你做到。

前面提到 virtual DOM 和真实的 DOM 有着不用的语义, 但同时也有明显不同的 API。

DOM 树上的节点被称为元素, 而 virtual DOM 是完全不同的抽象, 叫做 components。

component 的使用在 React 里极为重要, 因为 components 的存在让计算 DOM diff 更高效。

简单的说就是：
当然如果真的这样大面积的操作 DOM，性能会是一个很大的问题，所以 React 实现了一个虚拟 DOM，组件 DOM 结构就是映射到这个虚拟 DOM 上，React 在这个虚拟 DOM 上实现了一个 diff 算法，当要更新组件的时候，会通过 diff 寻找到要变更的 DOM 节点，再把这个修改更新到浏览器实际的 DOM 节点上，所以实际上不是真的渲染整个 DOM 树。这个虚拟 DOM 是一个纯粹的 JS 数据结构，所以性能会比原生 DOM 快很多。