/*jshint quotmark:false */
/*jshint white:false */
/*jshint trailing:false */
/*jshint newcap:false */
/*global React, Router*/
var app = app || {};

(function () {
    'use strict';

    var TodoFooter = app.TodoFooter,
        TodoItem = app.TodoItem;

    var ENTER_KEY = 13;

    app.ALL_TODOS = 'ALL_TODOS';
    app.ACTIVE_TODOS = 'ACTIVE_TODOS';
    app.COMPLETED_TODOS = 'COMPLETED_TODOS';

    var TodoApp = React.createClass({
        mixins: [SiestaMixin],
        getInitialState: function () {
            return {
                editing: null,
                nowShowing: app.ALL_TODOS,
                all: [],
                active: [],
                completed: []
            };
        },
        getVisibleTodos: function () {
            switch (this.state.nowShowing) {
                case app.ALL_TODOS:
                    return this.state.all;
                case app.ACTIVE_TODOS:
                    return this.state.active;
                case app.COMPLETED_TODOS:
                    return this.state.completed;
            }
        },
        componentDidMount: function () {
            var setState = this.setState;
            var router = Router({
                '/': setState.bind(this, {nowShowing: app.ALL_TODOS}),
                '/active': setState.bind(this, {nowShowing: app.ACTIVE_TODOS}),
                '/completed': setState.bind(this, {nowShowing: app.COMPLETED_TODOS})
            });
            router.init('/');
            // TODO: Get rid of query & execute + use new mixin feature for listening + updating state

            var handler = function (prop) {
                return function () {
                    var stateChange = {};
                    stateChange[prop] = app[prop].results;
                    this.setState(stateChange);
                }.bind(this)
            };

            app.all.init().then(handler.call(this, 'all'));
            app.all.listen(handler.call(this, 'all'));
            app.completed.init().then(handler.call(this, 'completed'));
            app.completed.listen(handler.call(this, 'completed'));
            app.active.init().then(handler.call(this, 'active'));
            app.active.listen(handler.call(this, 'active'));

        },

        handleNewTodoKeyDown: function (event) {
            if (event.which !== ENTER_KEY) {
                return;
            }

            event.preventDefault();

            var title = this.refs.newField.getDOMNode().value.trim();

            if (title) {
                app.Todo.map({title: title});
            }
        },

        toggleAll: function (event) {
            var checked = event.target.checked;
            this.props.model.toggleAll(checked);
        },

        toggle: function (todoToToggle) {
            this.props.model.toggle(todoToToggle);
        },

        destroy: function (todo) {
            this.props.model.destroy(todo);
        },

        edit: function (todo, callback) {
            // refer to todoItem.js `handleEdit` for the reasoning behind the
            // callback
            this.setState({editing: todo._id}, function () {
                callback();
            });
        },

        save: function (todoToSave, text) {
            this.props.model.save(todoToSave, text);
            this.setState({editing: null});
        },

        cancel: function () {
            this.setState({editing: null});
        },

        clearCompleted: function () {
            this.props.model.clearCompleted();
        },

        render: function () {
            var footer, main, todos = this.getVisibleTodos();

            var todoItems = todos.map(function (todo) {
                return (
                    <TodoItem
                        key={todo._id}
                        todo={todo}
                        onToggle={this.toggle.bind(this, todo)}
                        onDestroy={this.destroy.bind(this, todo)}
                        onEdit={this.edit.bind(this, todo)}
                        editing={this.state.editing === todo._id}
                        onSave={this.save.bind(this, todo)}
                        onCancel={this.cancel}
                    />
                );
            }, this);

            var activeTodoCount = this.state.active.length,
                completedCount = this.state.completed.length;

            if (activeTodoCount || completedCount) {
                footer =
                    <TodoFooter
                        count={activeTodoCount}
                        completedCount={completedCount}
                        nowShowing={this.state.nowShowing}
                        onClearCompleted={this.clearCompleted}
                    />;
            }

            if (todos.length) {
                main = (
                    <section id="main">
                        <input
                            id="toggle-all"
                            type="checkbox"
                            onChange={this.toggleAll}
                            checked={activeTodoCount === 0}
                        />
                        <ul id="todo-list">
							{todoItems}
                        </ul>
                    </section>
                );
            }

            return (
                <div>
                    <header id="header">
                        <h1>todos</h1>
                        <input
                            ref="newField"
                            id="new-todo"
                            placeholder="What needs to be done?"
                            onKeyDown={this.handleNewTodoKeyDown}
                            autoFocus={true}
                        />
                    </header>
					{main}
					{footer}
                </div>
            );
        }
    });


    function render() {
        React.render(
            <TodoApp/>,
            document.getElementById('todoapp')
        );
    }

    render();
})();
