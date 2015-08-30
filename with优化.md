###`with`优化
----------
>
- 尽可能地少用`with`语句，因为它会增加`with`语句以外的数据的访问代价。
- 避免使用`with`
	>
	`with`语句将一个新的可变对象推入作用域链的头部，函数的所有局部变量现在处于第二个作用域链对象中，从而使局部变量的访问代价提高。
>
		var person = {
		     name: “Nicholas",
		     age: 30
		}
		function displayInfo() {
		     var count = 5;
		     with (person) {
		         alert(name + ' is ' + age);
		         alert( 'count is ' + count);
		     }
		}