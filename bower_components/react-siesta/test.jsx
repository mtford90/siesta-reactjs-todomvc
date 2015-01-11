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
        Model.one().then(function (instance) {
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

    it('query', function (done) {
        Collection = siesta.collection('Collection');
        Model = Collection.model('Model', {
            attributes: ['x']
        });
        Model.map([{x: 2}, {x: 3}])
            .then(function (users) {
                var Component = React.createClass({
                    mixins: [SiestaMixin],
                    render: function () {
                        return (<span></span>);
                    },
                    componentDidMount: function () {
                        this.query(Model, {x: 2}, 'users')
                            .then(function () {
                                assert.equal(this.state.users.length, 1);
                                assert.include(this.state.users, users[0]);
                                done();
                            }.bind(this)).catch(done);
                    }
                });
                React.render(
                    <Component />,
                    document.getElementById('react')
                );
            })
            .catch(done);

    });

    it('all', function (done) {
        Collection = siesta.collection('Collection');
        Model = Collection.model('Model', {
            attributes: ['x']
        });
        Model.map([{x: 2}, {x: 3}])
            .then(function (users) {
                var Component = React.createClass({
                    mixins: [SiestaMixin],
                    render: function () {
                        return (<span></span>);
                    },
                    componentDidMount: function () {
                        this.all(Model, 'users')
                            .then(function () {
                                assert.equal(this.state.users.length, 2);
                                assert.include(this.state.users, users[0]);
                                assert.include(this.state.users, users[1]);
                                done();
                            }.bind(this)).catch(done);
                    }
                });
                React.render(
                    <Component />,
                    document.getElementById('react')
                );
            })
            .catch(done);

    });

    describe('listen and set', function () {
        it('reactive query, initialised', function (done) {
            Collection = siesta.collection('Collection');
            Model = Collection.model('Model', {
                attributes: ['x']
            });
            Model.map([{x: 2}, {x: 3}])
                .then(function (instances) {
                    var rq = Model.reactiveQuery();
                    rq.init().then(function () {
                        var Component = React.createClass({
                            mixins: [SiestaMixin],
                            render: function () {
                                return (<span></span>);
                            },
                            componentDidMount: function () {
                                this.listenAndSet(rq, 'models');
                                assert.equal(this.state.models.length, 2);
                                assert.include(this.state.models, instances[0]);
                                assert.include(this.state.models, instances[1]);
                                done();
                            }
                        });
                        React.render(
                            <Component />,
                            document.getElementById('react')
                        );
                    });
                }).catch(done);

        });
        it('reactive query, not initialised', function (done) {
            Collection = siesta.collection('Collection');
            Model = Collection.model('Model', {
                attributes: ['x']
            });
            Model.map([{x: 2}, {x: 3}])
                .then(function (instances) {
                    console.log('instances', instances);
                    var rq = Model.reactiveQuery();
                    var Component = React.createClass({
                        mixins: [SiestaMixin],
                        render: function () {
                            return (<span></span>);
                        },
                        componentDidMount: function () {
                            this.listenAndSet(rq, 'models')
                                .then(function () {
                                    console.log('state', this.state);
                                    assert.equal(this.state.models.length, 2);
                                    assert.include(this.state.models, instances[0]);
                                    assert.include(this.state.models, instances[1]);
                                    done();
                                }.bind(this)).catch(done)
                        }
                    });
                    React.render(
                        <Component />,
                        document.getElementById('react')
                    );
                }).catch(done);

        });
        it('reactive query, update', function (done) {
            Collection = siesta.collection('Collection');
            Model = Collection.model('Model', {
                attributes: ['x']
            });
            Model.map([{x: 2}, {x: 3}])
                .then(function (instances) {
                    console.log('instances', instances);
                    var rq = Model.reactiveQuery();
                    var Component = React.createClass({
                        mixins: [SiestaMixin],
                        render: function () {
                            return (<span></span>);
                        },
                        componentDidMount: function () {
                            this.listenAndSet(rq, 'models')
                                .then(function () {
                                    Model.map({x: 4}).then(function (instance) {
                                        assert.equal(this.state.models.length, 3);
                                        assert.include(this.state.models, instances[0]);
                                        assert.include(this.state.models, instances[1]);
                                        assert.include(this.state.models, instance);
                                        done();
                                    }.bind(this)).catch(done);
                                }.bind(this)).catch(done)
                        }
                    });
                    React.render(
                        <Component />,
                        document.getElementById('react')
                    );
                }).catch(done);

        });
        it('arranged reactive query, initialised', function (done) {
            Collection = siesta.collection('Collection');
            Model = Collection.model('Model', {
                attributes: ['x', 'index']
            });
            Model.map([{x: 2}, {x: 3}])
                .then(function (instances) {
                    var rq = Model.arrangedReactiveQuery();
                    rq.init().then(function () {
                        var Component = React.createClass({
                            mixins: [SiestaMixin],
                            render: function () {
                                return (<span></span>);
                            },
                            componentDidMount: function () {
                                this.listenAndSet(rq, 'models');
                                assert.equal(this.state.models.length, 2);
                                assert.include(this.state.models, instances[0]);
                                assert.include(this.state.models, instances[1]);
                                done();
                            }
                        });
                        React.render(
                            <Component />,
                            document.getElementById('react')
                        );
                    });
                }).catch(done);

        });
        it('arranged reactive query, not initialised', function (done) {
            Collection = siesta.collection('Collection');
            Model = Collection.model('Model', {
                attributes: ['x', 'index']
            });
            Model.map([{x: 2}, {x: 3}])
                .then(function (instances) {
                    console.log('instances', instances);
                    var rq = Model.arrangedReactiveQuery();
                    var Component = React.createClass({
                        mixins: [SiestaMixin],
                        render: function () {
                            return (<span></span>);
                        },
                        componentDidMount: function () {
                            this.listenAndSet(rq, 'models')
                                .then(function () {
                                    assert.equal(this.state.models.length, 2);
                                    assert.include(this.state.models, instances[0]);
                                    assert.include(this.state.models, instances[1]);
                                    done();
                                }.bind(this)).catch(done)
                        }
                    });
                    React.render(
                        <Component />,
                        document.getElementById('react')
                    );
                }).catch(done);

        });
        it('arranged reactive query, update', function (done) {
            Collection = siesta.collection('Collection');
            Model = Collection.model('Model', {
                attributes: ['x']
            });
            Model.map([{x: 2}, {x: 3}])
                .then(function (instances) {
                    console.log('instances', instances);
                    var rq = Model.arrangedReactiveQuery();
                    var Component = React.createClass({
                        mixins: [SiestaMixin],
                        render: function () {
                            return (<span></span>);
                        },
                        componentDidMount: function () {
                            this.listenAndSet(rq, 'models')
                                .then(function () {
                                    Model.map({x: 4}).then(function (instance) {
                                        assert.equal(this.state.models.length, 3);
                                        assert.include(this.state.models, instances[0]);
                                        assert.include(this.state.models, instances[1]);
                                        assert.include(this.state.models, instance);
                                        done();
                                    }.bind(this)).catch(done);
                                }.bind(this)).catch(done)
                        }
                    });
                    React.render(
                        <Component />,
                        document.getElementById('react')
                    );
                }).catch(done);

        });
        it('singleton', function (done) {
            Collection = siesta.collection('Collection');
            Model = Collection.model('Model', {
                attributes: ['x'],
                singleton: true
            });
            siesta.install().then(function () {
                var Component = React.createClass({
                    mixins: [SiestaMixin],
                    render: function () {
                        return (<span></span>);
                    },
                    componentDidMount: function () {
                        this.listenAndSet(Model, 'singleton')
                            .then(function () {
                                Model.one().then(function (singleton) {
                                    assert.equal(this.state.singleton, singleton);
                                    done();
                                }.bind(this)).catch(done);
                            }.bind(this)).catch(done);
                    }
                });
                React.render(
                    <Component />,
                    document.getElementById('react')
                );
            }).catch(done);
        });
        it('singleton, update', function (done) {
            Collection = siesta.collection('Collection');
            Model = Collection.model('Model', {
                attributes: ['x'],
                singleton: true
            });
            siesta.install().then(function () {
                var Component = React.createClass({
                    mixins: [SiestaMixin],
                    render: function () {
                        return (<span></span>);
                    },
                    shouldComponentUpdate: function (nextProps, nextState) {
                        if (nextState.singleton.x == '123') {
                            done();
                        }
                    },
                    componentDidMount: function () {
                        this.listenAndSet(Model, 'singleton')
                            .then(function () {
                                Model.one().then(function (singleton) {
                                    singleton.x = '123';
                                    siesta.notify();
                                }.bind(this)).catch(done);
                            }.bind(this)).catch(done);
                    }
                });
                React.render(
                    <Component />,
                    document.getElementById('react')
                );
            }).catch(done);
        });

    });


});
