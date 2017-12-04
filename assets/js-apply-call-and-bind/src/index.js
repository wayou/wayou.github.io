var name = 'foo',
    obj = {
        name: 'bar',
        sayHello: function() {
            console.log(this.name);
        }
    };

obj.sayHello(); //bar
obj.sayHello.apply(this); //foo
obj.sayHello.call(this); //foo
obj.sayHello.bind(this)(); //foo

var $ = document.querSelector.bind(document);
$('body');
