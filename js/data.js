/*jshint quotmark:false */
/*jshint white:false */
/*jshint trailing:false */
/*jshint newcap:false */
var app = app || {};

(function () {
    'use strict';

    var Utils = app.Utils;

    siesta.autosave = true;
    app.Todo = siesta.collection('TodoMVC')
        .model('Todo', {
            attributes: [
                'title',
                'index',
                {
                    name: 'completed',
                    default: false
                }
            ],
            statics: {
                toggleAll: function (checked) {
                    this.all().then(function (ts) {
                         ts.forEach(function (t) {
                             t.completed = checked;
                         })
                    });
                }
            }
        });



})();