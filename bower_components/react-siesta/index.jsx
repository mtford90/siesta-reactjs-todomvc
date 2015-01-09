var SiestaMixin = {
    componentWillMount: function () {
        this.listeners = [];
    },
    _cancelListeners: function () {
        for (var i = 0; i < this.listeners.length; i++) {
            var cancelListener = this.listeners[i];
            cancelListener();
        }
        this.listeners = [];
    },
    componentWillUnmount: function () {
        this._cancelListeners();
    },
    _listenToModel: function (func, Model, fn) {
        var cancelListen;
        if (Model.singleton) {
            Model.one().execute(function (err, singleton) {
                if (!err) {
                    cancelListen = this[func](singleton, function (n) {fn(singleton, n)});
                    this.listeners.push(cancelListen);
                }
                else fn(err);
            }.bind(this));
        }
        else {
            throw new Error('Cannot listen to a Model if it is not a singleton')
        }
        return function () {
            if (cancelListen) {
                var idx = this.listeners.indexOf(cancelListen);
                this.listeners.splice(idx, 1);
                cancelListen();
            }
        }.bind(this);
    },
    wrapCancelListen: function (cancelListen) {
        var wrappedCancelListen;
        if (typeof cancelListen == 'function') {
            wrappedCancelListen = function () {
                var idx = this.listeners.indexOf(cancelListen);
                this.listeners.splice(idx, 1);
                cancelListen();
            }.bind(this)
        }
        return wrappedCancelListen;
    },
    listen: function (o, fn) {
        var cancelListen;
        if (o instanceof siesta._internal.Model) cancelListen = this._listenToModel('listen', o, fn);
        else cancelListen = o.listen(fn);
        if (cancelListen) this.listeners.push(cancelListen);
        return this.wrapCancelListen(cancelListen);
    }
};

if (typeof module !== 'undefined') module.exports = {SiestaMixin: SiestaMixin};
if (typeof window !== 'undefined') window.SiestaMixin = SiestaMixin;