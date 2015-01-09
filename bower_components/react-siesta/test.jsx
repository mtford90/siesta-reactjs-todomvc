var assert = chai.assert;

describe('listen', function () {
    var Collection, Model;
    beforeEach(function (done) {
        siesta.reset(done);
    });

    it('instance', function (done) {
        Collection = siesta.collection('Collection');
        Model = Collection.model('Model', {
            attributes: ['x']
        });
        Model.map({x: 1}).then(function (m) {
            var instance = m;
            var Component = React.createClass({
                mixins: [SiestaMixin],
                render: function () {
                    return (<span></span>);
                },
                componentDidMount: function () {
                    var cancelListen;
                    cancelListen = this.listen(instance, function (n) {
                        cancelListen();
                        var numListeners = this.listeners.length;
                        assert(numListeners == 0, 'Should now be 0 listeners but there are ' + numListeners + ' instead');
                        done();
                    }.bind(this));
                    var numListeners = this.listeners.length;
                    assert(numListeners == 1, 'Should now be 1 listener but there are ' + numListeners + ' instead');
                }
            });
            React.render(
                <Component />,
                document.getElementById('react')
            );
            instance.x = 2;
        }).catch(done);
    });

    it('singleton', function (done) {
        Collection = siesta.collection('Collection');
        Model = Collection.model('Model', {
            attributes: ['x'],
            singleton: true
        });
        var Component = React.createClass({
            mixins: [SiestaMixin],
            render: function () {
                return (<span></span>);
            },
            componentDidMount: function () {
                var cancelListen;
                cancelListen = this.listen(Model, function (n) {
                    cancelListen();
                    var numListeners = this.listeners.length;
                    assert(numListeners == 0, 'Should now be 0 listeners but there are ' + numListeners + ' instead');
                    done();
                }.bind(this));
                var numListeners = this.listeners.length;
                assert(numListeners == 1, 'Should now be 1 listener but there are ' + numListeners + ' instead');
            }
        });
        React.render(
            <Component />,
            document.getElementById('react')
        );
        Model.one().execute().then(function (instance) {
            instance.x = 2;
        })
    });

    it('reactive query', function (done) {
        Collection = siesta.collection('Collection');
        Model = Collection.model('Model', {
            attributes: ['x']
        });
        var rq = Model.reactiveQuery();
        rq.init().then(function () {
            var Component = React.createClass({
                mixins: [SiestaMixin],
                render: function () {
                    return (<span></span>);
                },
                componentDidMount: function () {
                    var cancelListen;
                    cancelListen = this.listen(rq, function () {
                        cancelListen();
                        var numListeners = this.listeners.length;
                        assert(numListeners == 0, 'Should now be 0 listeners but there are ' + numListeners + ' instead');
                        done();
                    }.bind(this));
                    var numListeners = this.listeners.length;
                    assert(numListeners == 1, 'Should now be 1 listener but there are ' + numListeners + ' instead');
                }
            });
            React.render(
                <Component />,
                document.getElementById('react')
            );
            Model.map({x: 1});
        });
    });

    it('arranged reactive query', function (done) {
        Collection = siesta.collection('Collection');
        Model = Collection.model('Model', {
            attributes: ['x', 'index']
        });
        var rq = Model.arrangedReactiveQuery();
        rq.init().then(function () {
            var Component = React.createClass({
                mixins: [SiestaMixin],
                render: function () {
                    return (<span></span>);
                },
                componentDidMount: function () {
                    var cancelListen;
                    cancelListen = this.listen(rq, function () {
                        cancelListen();
                        var numListeners = this.listeners.length;
                        assert(numListeners == 0, 'Should now be 0 listeners but there are ' + numListeners + ' instead');
                        done();
                    }.bind(this));
                    var numListeners = this.listeners.length;
                    assert(numListeners == 1, 'Should now be 1 listener but there are ' + numListeners + ' instead');
                }
            });
            React.render(
                <Component />,
                document.getElementById('react')
            );
            Model.map({x: 1});
        });
    });
});
