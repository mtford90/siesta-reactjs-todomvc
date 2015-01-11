/*jshint quotmark: false */
/*jshint white: false */
/*jshint trailing: false */
/*jshint newcap: false */
/*global React */
var app = app || {};

(function () {
    'use strict';

    var ESCAPE_KEY = 27;
    var ENTER_KEY = 13;

    app.TodoItem = React.createClass({
        mixins: [SiestaMixin],
        handleSubmit: function (event) {
            var val = this.state.editText.trim();
            if (val) {
                this.props.onSave(val);
                this.setState({editText: val});
            } else {
                this.props.onDestroy();
            }
        },

        handleEdit: function () {
            // react optimizes renders by batching them. This means you can't call
            // parent's `onEdit` (which in this case triggeres a re-render), and
            // immediately manipulate the DOM as if the rendering's over. Put it as a
            // callback. Refer to app.jsx' `edit` method
            this.props.onEdit(function () {
                var node = this.refs.editField.getDOMNode();
                node.focus();
                node.setSelectionRange(node.value.length, node.value.length);
            }.bind(this));
            this.setState({editText: this.props.todo.title});
        },

        handleKeyDown: function (event) {
            if (event.which === ESCAPE_KEY) {
                this.setState({editText: this.props.todo.title});
                this.props.onCancel(event);
            } else if (event.which === ENTER_KEY) {
                this.handleSubmit(event);
            }
        },

        handleChange: function (event) {
            this.setState({editText: event.target.value});
        },

        getInitialState: function () {
            return {editText: this.props.todo.title};
        },

        componentDidMount: function () {
            this.listen(this.props.todo, function (e) {
                if (e.field == 'completed') {
                    // Render
                    this.setState();
                }
            }.bind(this));
        },

        onToggle: function () {
            var todo = this.props.todo;
            todo.completed = !todo.completed;
        },

        onDestroy: function () {
            var todo = this.props.todo;
            todo.remove();
        },

        render: function () {
            return (
                <li className={React.addons.classSet({
                    completed: this.props.todo.completed,
                    editing: this.props.editing
                })}>
                    <div className="view">
                        <input
                            className="toggle"
                            type="checkbox"
                            checked={this.props.todo.completed}
                            onChange={this.onToggle}
                        />
                        <label onDoubleClick={this.handleEdit}>
							{this.props.todo.title}
                        </label>
                        <button className="destroy" onClick={this.onDestroy} />
                    </div>
                    <input
                        ref="editField"
                        className="edit"
                        value={this.state.editText}
                        onBlur={this.handleSubmit}
                        onChange={this.handleChange}
                        onKeyDown={this.handleKeyDown}
                    />
                </li>
            );
        }
    });
})();
