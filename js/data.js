/*jshint quotmark:false */
/*jshint white:false */
/*jshint trailing:false */
/*jshint newcap:false */
var app = app || {};

(function () {
    'use strict';

    var Utils = app.Utils;

    app.Todo = siesta.collection('TodoMVC')
        .model('Todo', {
            attributes: [
                'title',
                'index',
                {
                    name: 'completed',
                    default: false
                }
            ]
        });

    // TODO: pass orderBy to opts
    app.all = app.Todo.reactiveQuery();
    app.all.orderBy('index');
    app.completed = app.Todo.reactiveQuery({completed: true});
    app.completed.orderBy('index');
    app.active = app.Todo.reactiveQuery({completed: false});
    app.active.orderBy('index');

})();