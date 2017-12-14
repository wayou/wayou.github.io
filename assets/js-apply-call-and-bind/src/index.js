var name = 'foo',
    obj = {
        name: 'bar',
        sayHello: function () {
            console.log(this.name);
        }
    };

obj.sayHello(); //bar
obj.sayHello.apply(this); //foo
obj.sayHello.call(this); //foo
obj.sayHello.bind(this)(); //foo

var $ = document.querSelector.bind(document);
$('body');

var o = { a: 1 },
    a = 2;

function log() {
    console.log(this.a);
}

setTimeout(log.bind(o), 1000);
