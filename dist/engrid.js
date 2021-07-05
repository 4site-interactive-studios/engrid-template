/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 110:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DispatchError = void 0;
/**
 * Indicates an error with dispatching.
 *
 * @export
 * @class DispatchError
 * @extends {Error}
 */
class DispatchError extends Error {
    constructor(message) {
        super(message);
    }
}
exports.DispatchError = DispatchError;


/***/ }),

/***/ 53:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DispatcherBase = void 0;
const __1 = __webpack_require__(233);
/**
 * Base class for implementation of the dispatcher. It facilitates the subscribe
 * and unsubscribe methods based on generic handlers. The TEventType specifies
 * the type of event that should be exposed. Use the asEvent to expose the
 * dispatcher as event.
 */
class DispatcherBase {
    constructor() {
        this._wrap = new __1.DispatcherWrapper(this);
        this._subscriptions = new Array();
    }
    /**
     * Returns the number of subscriptions.
     *
     * @readonly
     *
     * @memberOf DispatcherBase
     */
    get count() {
        return this._subscriptions.length;
    }
    /**
     * Subscribe to the event dispatcher.
     * @param fn The event handler that is called when the event is dispatched.
     * @returns A function that unsubscribes the event handler from the event.
     */
    subscribe(fn) {
        if (fn) {
            this._subscriptions.push(this.createSubscription(fn, false));
        }
        return () => {
            this.unsubscribe(fn);
        };
    }
    /**
     * Subscribe to the event dispatcher.
     * @param fn The event handler that is called when the event is dispatched.
     * @returns A function that unsubscribes the event handler from the event.
     */
    sub(fn) {
        return this.subscribe(fn);
    }
    /**
     * Subscribe once to the event with the specified name.
     * @param fn The event handler that is called when the event is dispatched.
     * @returns A function that unsubscribes the event handler from the event.
     */
    one(fn) {
        if (fn) {
            this._subscriptions.push(this.createSubscription(fn, true));
        }
        return () => {
            this.unsubscribe(fn);
        };
    }
    /**
     * Checks it the event has a subscription for the specified handler.
     * @param fn The event handler.
     */
    has(fn) {
        if (!fn)
            return false;
        return this._subscriptions.some((sub) => sub.handler == fn);
    }
    /**
     * Unsubscribes the handler from the dispatcher.
     * @param fn The event handler.
     */
    unsubscribe(fn) {
        if (!fn)
            return;
        for (let i = 0; i < this._subscriptions.length; i++) {
            if (this._subscriptions[i].handler == fn) {
                this._subscriptions.splice(i, 1);
                break;
            }
        }
    }
    /**
     * Unsubscribes the handler from the dispatcher.
     * @param fn The event handler.
     */
    unsub(fn) {
        this.unsubscribe(fn);
    }
    /**
     * Generic dispatch will dispatch the handlers with the given arguments.
     *
     * @protected
     * @param {boolean} executeAsync `True` if the even should be executed async.
     * @param {*} scrop The scope of the event. The scope becomes the `this` for handler.
     * @param {IArguments} args The arguments for the event.
     * @returns {(IPropagationStatus | null)} The propagation status, or if an `executeAsync` is used `null`.
     *
     * @memberOf DispatcherBase
     */
    _dispatch(executeAsync, scope, args) {
        //execute on a copy because of bug #9
        for (let sub of [...this._subscriptions]) {
            let ev = new __1.EventManagement(() => this.unsub(sub.handler));
            let nargs = Array.prototype.slice.call(args);
            nargs.push(ev);
            let s = sub;
            s.execute(executeAsync, scope, nargs);
            //cleanup subs that are no longer needed
            this.cleanup(sub);
            if (!executeAsync && ev.propagationStopped) {
                return { propagationStopped: true };
            }
        }
        if (executeAsync) {
            return null;
        }
        return { propagationStopped: false };
    }
    createSubscription(handler, isOnce) {
        return new __1.Subscription(handler, isOnce);
    }
    /**
     * Cleans up subs that ran and should run only once.
     */
    cleanup(sub) {
        if (sub.isOnce && sub.isExecuted) {
            let i = this._subscriptions.indexOf(sub);
            if (i > -1) {
                this._subscriptions.splice(i, 1);
            }
        }
    }
    /**
     * Creates an event from the dispatcher. Will return the dispatcher
     * in a wrapper. This will prevent exposure of any dispatcher methods.
     */
    asEvent() {
        return this._wrap;
    }
    /**
     * Clears all the subscriptions.
     */
    clear() {
        this._subscriptions.splice(0, this._subscriptions.length);
    }
}
exports.DispatcherBase = DispatcherBase;


/***/ }),

/***/ 207:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DispatcherWrapper = void 0;
/**
 * Hides the implementation of the event dispatcher. Will expose methods that
 * are relevent to the event.
 */
class DispatcherWrapper {
    /**
     * Creates a new EventDispatcherWrapper instance.
     * @param dispatcher The dispatcher.
     */
    constructor(dispatcher) {
        this._subscribe = (fn) => dispatcher.subscribe(fn);
        this._unsubscribe = (fn) => dispatcher.unsubscribe(fn);
        this._one = (fn) => dispatcher.one(fn);
        this._has = (fn) => dispatcher.has(fn);
        this._clear = () => dispatcher.clear();
        this._count = () => dispatcher.count;
    }
    /**
     * Returns the number of subscriptions.
     *
     * @readonly
     * @type {number}
     * @memberOf DispatcherWrapper
     */
    get count() {
        return this._count();
    }
    /**
     * Subscribe to the event dispatcher.
     * @param fn The event handler that is called when the event is dispatched.
     * @returns A function that unsubscribes the event handler from the event.
     */
    subscribe(fn) {
        return this._subscribe(fn);
    }
    /**
     * Subscribe to the event dispatcher.
     * @param fn The event handler that is called when the event is dispatched.
     * @returns A function that unsubscribes the event handler from the event.
     */
    sub(fn) {
        return this.subscribe(fn);
    }
    /**
     * Unsubscribe from the event dispatcher.
     * @param fn The event handler that is called when the event is dispatched.
     */
    unsubscribe(fn) {
        this._unsubscribe(fn);
    }
    /**
     * Unsubscribe from the event dispatcher.
     * @param fn The event handler that is called when the event is dispatched.
     */
    unsub(fn) {
        this.unsubscribe(fn);
    }
    /**
     * Subscribe once to the event with the specified name.
     * @param fn The event handler that is called when the event is dispatched.
     */
    one(fn) {
        return this._one(fn);
    }
    /**
     * Checks it the event has a subscription for the specified handler.
     * @param fn The event handler.
     */
    has(fn) {
        return this._has(fn);
    }
    /**
     * Clears all the subscriptions.
     */
    clear() {
        this._clear();
    }
}
exports.DispatcherWrapper = DispatcherWrapper;


/***/ }),

/***/ 685:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EventListBase = void 0;
/**
 * Base class for event lists classes. Implements the get and remove.
 */
class EventListBase {
    constructor() {
        this._events = {};
    }
    /**
     * Gets the dispatcher associated with the name.
     * @param name The name of the event.
     */
    get(name) {
        let event = this._events[name];
        if (event) {
            return event;
        }
        event = this.createDispatcher();
        this._events[name] = event;
        return event;
    }
    /**
     * Removes the dispatcher associated with the name.
     * @param name The name of the event.
     */
    remove(name) {
        delete this._events[name];
    }
}
exports.EventListBase = EventListBase;


/***/ }),

/***/ 928:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PromiseDispatcherBase = void 0;
const __1 = __webpack_require__(233);
class PromiseDispatcherBase extends __1.DispatcherBase {
    constructor() {
        super();
    }
    _dispatch(executeAsync, scope, args) {
        throw new __1.DispatchError("_dispatch not supported. Use _dispatchAsPromise.");
    }
    createSubscription(handler, isOnce) {
        return new __1.PromiseSubscription(handler, isOnce);
    }
    /**
     * Generic dispatch will dispatch the handlers with the given arguments.
     *
     * @protected
     * @param {boolean} executeAsync `True` if the even should be executed async.
     * @param {*} scrop The scope of the event. The scope becomes the `this` for handler.
     * @param {IArguments} args The arguments for the event.
     * @returns {(IPropagationStatus | null)} The propagation status, or if an `executeAsync` is used `null`.
     *
     * @memberOf DispatcherBase
     */
    async _dispatchAsPromise(executeAsync, scope, args) {
        //execute on a copy because of bug #9
        for (let sub of [...this._subscriptions]) {
            let ev = new __1.EventManagement(() => this.unsub(sub.handler));
            let nargs = Array.prototype.slice.call(args);
            nargs.push(ev);
            let ps = sub;
            await ps.execute(executeAsync, scope, nargs);
            //cleanup subs that are no longer needed
            this.cleanup(sub);
            if (!executeAsync && ev.propagationStopped) {
                return { propagationStopped: true };
            }
        }
        if (executeAsync) {
            return null;
        }
        return { propagationStopped: false };
    }
}
exports.PromiseDispatcherBase = PromiseDispatcherBase;


/***/ }),

/***/ 622:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PromiseSubscription = void 0;
class PromiseSubscription {
    /**
     * Creates an instance of Subscription.
     *
     * @param {TEventHandler} handler The handler for the subscription.
     * @param {boolean} isOnce Indicates if the handler should only be executed once.
     */
    constructor(handler, isOnce) {
        this.handler = handler;
        this.isOnce = isOnce;
        /**
         * Indicates if the subscription has been executed before.
         */
        this.isExecuted = false;
    }
    /**
     * Executes the handler.
     *
     * @param {boolean} executeAsync True if the even should be executed async.
     * @param {*} scope The scope the scope of the event.
     * @param {IArguments} args The arguments for the event.
     */
    async execute(executeAsync, scope, args) {
        if (!this.isOnce || !this.isExecuted) {
            this.isExecuted = true;
            //TODO: do we need to cast to any -- seems yuck
            var fn = this.handler;
            if (executeAsync) {
                setTimeout(() => {
                    fn.apply(scope, args);
                }, 1);
                return;
            }
            let result = fn.apply(scope, args);
            await result;
        }
    }
}
exports.PromiseSubscription = PromiseSubscription;


/***/ }),

/***/ 84:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Subscription = void 0;
/**
 * Stores a handler. Manages execution meta data.
 * @class Subscription
 * @template TEventHandler
 */
class Subscription {
    /**
     * Creates an instance of Subscription.
     *
     * @param {TEventHandler} handler The handler for the subscription.
     * @param {boolean} isOnce Indicates if the handler should only be executed once.
     */
    constructor(handler, isOnce) {
        this.handler = handler;
        this.isOnce = isOnce;
        /**
         * Indicates if the subscription has been executed before.
         */
        this.isExecuted = false;
    }
    /**
     * Executes the handler.
     *
     * @param {boolean} executeAsync True if the even should be executed async.
     * @param {*} scope The scope the scope of the event.
     * @param {IArguments} args The arguments for the event.
     */
    execute(executeAsync, scope, args) {
        if (!this.isOnce || !this.isExecuted) {
            this.isExecuted = true;
            var fn = this.handler;
            if (executeAsync) {
                setTimeout(() => {
                    fn.apply(scope, args);
                }, 1);
            }
            else {
                fn.apply(scope, args);
            }
        }
    }
}
exports.Subscription = Subscription;


/***/ }),

/***/ 114:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HandlingBase = void 0;
/**
 * Base class that implements event handling. With a an
 * event list this base class will expose events that can be
 * subscribed to. This will give your class generic events.
 *
 * @export
 * @abstract
 * @class HandlingBase
 * @template TEventHandler
 * @template TDispatcher
 * @template TList
 */
class HandlingBase {
    constructor(events) {
        this.events = events;
    }
    /**
     * Subscribes once to the event with the specified name.
     * @param name The name of the event.
     * @param fn The event handler.
     */
    one(name, fn) {
        this.events.get(name).one(fn);
    }
    /**
     * Checks it the event has a subscription for the specified handler.
     * @param name The name of the event.
     * @param fn The event handler.
     */
    has(name, fn) {
        return this.events.get(name).has(fn);
    }
    /**
     * Subscribes to the event with the specified name.
     * @param name The name of the event.
     * @param fn The event handler.
     */
    subscribe(name, fn) {
        this.events.get(name).subscribe(fn);
    }
    /**
     * Subscribes to the event with the specified name.
     * @param name The name of the event.
     * @param fn The event handler.
     */
    sub(name, fn) {
        this.subscribe(name, fn);
    }
    /**
     * Unsubscribes from the event with the specified name.
     * @param name The name of the event.
     * @param fn The event handler.
     */
    unsubscribe(name, fn) {
        this.events.get(name).unsubscribe(fn);
    }
    /**
     * Unsubscribes from the event with the specified name.
     * @param name The name of the event.
     * @param fn The event handler.
     */
    unsub(name, fn) {
        this.unsubscribe(name, fn);
    }
}
exports.HandlingBase = HandlingBase;


/***/ }),

/***/ 233:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


/*!
 * Strongly Typed Events for TypeScript - Core
 * https://github.com/KeesCBakker/StronlyTypedEvents/
 * http://keestalkstech.com
 *
 * Copyright Kees C. Bakker / KeesTalksTech
 * Released under the MIT license
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HandlingBase = exports.PromiseDispatcherBase = exports.PromiseSubscription = exports.DispatchError = exports.EventManagement = exports.EventListBase = exports.DispatcherWrapper = exports.DispatcherBase = exports.Subscription = void 0;
const DispatcherBase_1 = __webpack_require__(53);
Object.defineProperty(exports, "DispatcherBase", ({ enumerable: true, get: function () { return DispatcherBase_1.DispatcherBase; } }));
const DispatchError_1 = __webpack_require__(110);
Object.defineProperty(exports, "DispatchError", ({ enumerable: true, get: function () { return DispatchError_1.DispatchError; } }));
const DispatcherWrapper_1 = __webpack_require__(207);
Object.defineProperty(exports, "DispatcherWrapper", ({ enumerable: true, get: function () { return DispatcherWrapper_1.DispatcherWrapper; } }));
const EventListBase_1 = __webpack_require__(685);
Object.defineProperty(exports, "EventListBase", ({ enumerable: true, get: function () { return EventListBase_1.EventListBase; } }));
const EventManagement_1 = __webpack_require__(824);
Object.defineProperty(exports, "EventManagement", ({ enumerable: true, get: function () { return EventManagement_1.EventManagement; } }));
const HandlingBase_1 = __webpack_require__(114);
Object.defineProperty(exports, "HandlingBase", ({ enumerable: true, get: function () { return HandlingBase_1.HandlingBase; } }));
const PromiseDispatcherBase_1 = __webpack_require__(928);
Object.defineProperty(exports, "PromiseDispatcherBase", ({ enumerable: true, get: function () { return PromiseDispatcherBase_1.PromiseDispatcherBase; } }));
const PromiseSubscription_1 = __webpack_require__(622);
Object.defineProperty(exports, "PromiseSubscription", ({ enumerable: true, get: function () { return PromiseSubscription_1.PromiseSubscription; } }));
const Subscription_1 = __webpack_require__(84);
Object.defineProperty(exports, "Subscription", ({ enumerable: true, get: function () { return Subscription_1.Subscription; } }));


/***/ }),

/***/ 824:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EventManagement = void 0;
/**
 * Allows the user to interact with the event.
 *
 * @class EventManagement
 * @implements {IEventManagement}
 */
class EventManagement {
    constructor(unsub) {
        this.unsub = unsub;
        this.propagationStopped = false;
    }
    stopPropagation() {
        this.propagationStopped = true;
    }
}
exports.EventManagement = EventManagement;


/***/ }),

/***/ 608:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EventDispatcher = void 0;
const ste_core_1 = __webpack_require__(233);
/**
 * Dispatcher implementation for events. Can be used to subscribe, unsubscribe
 * or dispatch events. Use the ToEvent() method to expose the event.
 *
 * @export
 * @class EventDispatcher
 * @extends {DispatcherBase<IEventHandler<TSender, TArgs>>}
 * @implements {IEvent<TSender, TArgs>}
 * @template TSender
 * @template TArgs
 */
class EventDispatcher extends ste_core_1.DispatcherBase {
    /**
     * Creates an instance of EventDispatcher.
     *
     * @memberOf EventDispatcher
     */
    constructor() {
        super();
    }
    /**
     * Dispatches the event.
     *
     * @param {TSender} sender The sender object.
     * @param {TArgs} args The arguments object.
     * @returns {IPropagationStatus} The event status.
     *
     * @memberOf EventDispatcher
     */
    dispatch(sender, args) {
        const result = this._dispatch(false, this, arguments);
        if (result == null) {
            throw new ste_core_1.DispatchError("Got `null` back from dispatch.");
        }
        return result;
    }
    /**
     * Dispatches the events thread.
     * @param sender The sender.
     * @param args The arguments object.
     */
    dispatchAsync(sender, args) {
        this._dispatch(true, this, arguments);
    }
    /**
     * Creates an event from the dispatcher. Will return the dispatcher
     * in a wrapper. This will prevent exposure of any dispatcher methods.
     *
     * @returns {IEvent<TSender, TArgs>} The event.
     *
     * @memberOf EventDispatcher
     */
    asEvent() {
        return super.asEvent();
    }
}
exports.EventDispatcher = EventDispatcher;


/***/ }),

/***/ 164:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EventHandlingBase = void 0;
const ste_core_1 = __webpack_require__(233);
const EventList_1 = __webpack_require__(594);
/**
 * Extends objects with signal event handling capabilities.
 */
class EventHandlingBase extends ste_core_1.HandlingBase {
    constructor() {
        super(new EventList_1.EventList());
    }
}
exports.EventHandlingBase = EventHandlingBase;


/***/ }),

/***/ 594:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EventList = void 0;
const ste_core_1 = __webpack_require__(233);
const EventDispatcher_1 = __webpack_require__(608);
/**
 * Storage class for multiple events that are accessible by name.
 * Events dispatchers are automatically created.
 */
class EventList extends ste_core_1.EventListBase {
    /**
     * Creates a new EventList instance.
     */
    constructor() {
        super();
    }
    /**
     * Creates a new dispatcher instance.
     */
    createDispatcher() {
        return new EventDispatcher_1.EventDispatcher();
    }
}
exports.EventList = EventList;


/***/ }),

/***/ 107:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NonUniformEventList = void 0;
const EventDispatcher_1 = __webpack_require__(608);
/**
 * Similar to EventList, but instead of TArgs, a map of event names ang argument types is provided with TArgsMap.
 */
class NonUniformEventList {
    constructor() {
        this._events = {};
    }
    /**
     * Gets the dispatcher associated with the name.
     * @param name The name of the event.
     */
    get(name) {
        if (this._events[name]) {
            // @TODO avoid typecasting. Not sure why TS thinks this._events[name] could still be undefined.
            return this._events[name];
        }
        const event = this.createDispatcher();
        this._events[name] = event;
        return event;
    }
    /**
     * Removes the dispatcher associated with the name.
     * @param name The name of the event.
     */
    remove(name) {
        delete this._events[name];
    }
    /**
     * Creates a new dispatcher instance.
     */
    createDispatcher() {
        return new EventDispatcher_1.EventDispatcher();
    }
}
exports.NonUniformEventList = NonUniformEventList;


/***/ }),

/***/ 851:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


/*!
 * Strongly Typed Events for TypeScript - Core
 * https://github.com/KeesCBakker/StronlyTypedEvents/
 * http://keestalkstech.com
 *
 * Copyright Kees C. Bakker / KeesTalksTech
 * Released under the MIT license
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NonUniformEventList = exports.EventList = exports.EventHandlingBase = exports.EventDispatcher = void 0;
const EventDispatcher_1 = __webpack_require__(608);
Object.defineProperty(exports, "EventDispatcher", ({ enumerable: true, get: function () { return EventDispatcher_1.EventDispatcher; } }));
const EventHandlingBase_1 = __webpack_require__(164);
Object.defineProperty(exports, "EventHandlingBase", ({ enumerable: true, get: function () { return EventHandlingBase_1.EventHandlingBase; } }));
const EventList_1 = __webpack_require__(594);
Object.defineProperty(exports, "EventList", ({ enumerable: true, get: function () { return EventList_1.EventList; } }));
const NonUniformEventList_1 = __webpack_require__(107);
Object.defineProperty(exports, "NonUniformEventList", ({ enumerable: true, get: function () { return NonUniformEventList_1.NonUniformEventList; } }));


/***/ }),

/***/ 253:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NonUniformPromiseEventList = void 0;
const PromiseEventDispatcher_1 = __webpack_require__(933);
/**
 * Similar to EventList, but instead of TArgs, a map of event names ang argument types is provided with TArgsMap.
 */
class NonUniformPromiseEventList {
    constructor() {
        this._events = {};
    }
    /**
     * Gets the dispatcher associated with the name.
     * @param name The name of the event.
     */
    get(name) {
        if (this._events[name]) {
            // @TODO avoid typecasting. Not sure why TS thinks this._events[name] could still be undefined.
            return this._events[name];
        }
        const event = this.createDispatcher();
        this._events[name] = event;
        return event;
    }
    /**
     * Removes the dispatcher associated with the name.
     * @param name The name of the event.
     */
    remove(name) {
        delete this._events[name];
    }
    /**
     * Creates a new dispatcher instance.
     */
    createDispatcher() {
        return new PromiseEventDispatcher_1.PromiseEventDispatcher();
    }
}
exports.NonUniformPromiseEventList = NonUniformPromiseEventList;


/***/ }),

/***/ 933:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PromiseEventDispatcher = void 0;
const ste_core_1 = __webpack_require__(233);
/**
 * Dispatcher implementation for events. Can be used to subscribe, unsubscribe
 * or dispatch events. Use the ToEvent() method to expose the event.
 *
 * @export
 * @class PromiseEventDispatcher
 * @extends {PromiseDispatcherBase<IPromiseEventHandler<TSender, TArgs>>}
 * @implements {IPromiseEvent<TSender, TArgs>}
 * @template TSender
 * @template TArgs
 */
class PromiseEventDispatcher extends ste_core_1.PromiseDispatcherBase {
    /**
     * Creates a new EventDispatcher instance.
     */
    constructor() {
        super();
    }
    /**
     * Dispatches the event.
     *
     * @param {TSender} sender The sender object.
     * @param {TArgs} args The argument object.
     * @returns {Promise<IPropagationStatus>} The status.
     *
     * @memberOf PromiseEventDispatcher
     */
    async dispatch(sender, args) {
        const result = await this._dispatchAsPromise(false, this, arguments);
        if (result == null) {
            throw new ste_core_1.DispatchError("Got `null` back from dispatch.");
        }
        return result;
    }
    /**
     * Dispatches the event without waiting for the result.
     *
     * @param {TSender} sender The sender object.
     * @param {TArgs} args The argument object.
     *
     * @memberOf PromiseEventDispatcher
     */
    dispatchAsync(sender, args) {
        this._dispatchAsPromise(true, this, arguments);
    }
    /**
     * Creates an event from the dispatcher. Will return the dispatcher
     * in a wrapper. This will prevent exposure of any dispatcher methods.
     */
    asEvent() {
        return super.asEvent();
    }
}
exports.PromiseEventDispatcher = PromiseEventDispatcher;


/***/ }),

/***/ 238:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PromiseEventHandlingBase = void 0;
const ste_core_1 = __webpack_require__(233);
const PromiseEventList_1 = __webpack_require__(930);
/**
 * Extends objects with signal event handling capabilities.
 */
class PromiseEventHandlingBase extends ste_core_1.HandlingBase {
    constructor() {
        super(new PromiseEventList_1.PromiseEventList());
    }
}
exports.PromiseEventHandlingBase = PromiseEventHandlingBase;


/***/ }),

/***/ 930:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PromiseEventList = void 0;
const ste_core_1 = __webpack_require__(233);
const PromiseEventDispatcher_1 = __webpack_require__(933);
/**
 * Storage class for multiple events that are accessible by name.
 * Events dispatchers are automatically created.
 */
class PromiseEventList extends ste_core_1.EventListBase {
    /**
     * Creates a new EventList instance.
     */
    constructor() {
        super();
    }
    /**
     * Creates a new dispatcher instance.
     */
    createDispatcher() {
        return new PromiseEventDispatcher_1.PromiseEventDispatcher();
    }
}
exports.PromiseEventList = PromiseEventList;


/***/ }),

/***/ 129:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


/*!
 * Strongly Typed Events for TypeScript - Core
 * https://github.com/KeesCBakker/StronlyTypedEvents/
 * http://keestalkstech.com
 *
 * Copyright Kees C. Bakker / KeesTalksTech
 * Released under the MIT license
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NonUniformPromiseEventList = exports.PromiseEventList = exports.PromiseEventHandlingBase = exports.PromiseEventDispatcher = void 0;
const PromiseEventDispatcher_1 = __webpack_require__(933);
Object.defineProperty(exports, "PromiseEventDispatcher", ({ enumerable: true, get: function () { return PromiseEventDispatcher_1.PromiseEventDispatcher; } }));
const PromiseEventHandlingBase_1 = __webpack_require__(238);
Object.defineProperty(exports, "PromiseEventHandlingBase", ({ enumerable: true, get: function () { return PromiseEventHandlingBase_1.PromiseEventHandlingBase; } }));
const PromiseEventList_1 = __webpack_require__(930);
Object.defineProperty(exports, "PromiseEventList", ({ enumerable: true, get: function () { return PromiseEventList_1.PromiseEventList; } }));
const NonUniformPromiseEventList_1 = __webpack_require__(253);
Object.defineProperty(exports, "NonUniformPromiseEventList", ({ enumerable: true, get: function () { return NonUniformPromiseEventList_1.NonUniformPromiseEventList; } }));


/***/ }),

/***/ 482:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PromiseSignalDispatcher = void 0;
const ste_core_1 = __webpack_require__(233);
/**
 * The dispatcher handles the storage of subsciptions and facilitates
 * subscription, unsubscription and dispatching of a signal event.
 */
class PromiseSignalDispatcher extends ste_core_1.PromiseDispatcherBase {
    /**
     * Creates a new SignalDispatcher instance.
     */
    constructor() {
        super();
    }
    /**
     * Dispatches the signal.
     *
     * @returns {IPropagationStatus} The status of the dispatch.
     *
     * @memberOf SignalDispatcher
     */
    async dispatch() {
        const result = await this._dispatchAsPromise(false, this, arguments);
        if (result == null) {
            throw new ste_core_1.DispatchError("Got `null` back from dispatch.");
        }
        return result;
    }
    /**
     * Dispatches the signal threaded.
     */
    dispatchAsync() {
        this._dispatchAsPromise(true, this, arguments);
    }
    /**
     * Creates an event from the dispatcher. Will return the dispatcher
     * in a wrapper. This will prevent exposure of any dispatcher methods.
     */
    asEvent() {
        return super.asEvent();
    }
}
exports.PromiseSignalDispatcher = PromiseSignalDispatcher;


/***/ }),

/***/ 948:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PromiseSignalHandlingBase = void 0;
const ste_core_1 = __webpack_require__(233);
const PromiseSignalList_1 = __webpack_require__(758);
/**
 * Extends objects with signal event handling capabilities.
 */
class PromiseSignalHandlingBase extends ste_core_1.HandlingBase {
    constructor() {
        super(new PromiseSignalList_1.PromiseSignalList());
    }
}
exports.PromiseSignalHandlingBase = PromiseSignalHandlingBase;


/***/ }),

/***/ 758:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PromiseSignalList = void 0;
const ste_core_1 = __webpack_require__(233);
const _1 = __webpack_require__(559);
/**
 * Storage class for multiple signal events that are accessible by name.
 * Events dispatchers are automatically created.
 */
class PromiseSignalList extends ste_core_1.EventListBase {
    /**
     * Creates a new SignalList instance.
     */
    constructor() {
        super();
    }
    /**
     * Creates a new dispatcher instance.
     */
    createDispatcher() {
        return new _1.PromiseSignalDispatcher();
    }
}
exports.PromiseSignalList = PromiseSignalList;


/***/ }),

/***/ 559:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


/*!
 * Strongly Typed Events for TypeScript - Promise Signals
 * https://github.com/KeesCBakker/StronlyTypedEvents/
 * http://keestalkstech.com
 *
 * Copyright Kees C. Bakker / KeesTalksTech
 * Released under the MIT license
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PromiseSignalList = exports.PromiseSignalHandlingBase = exports.PromiseSignalDispatcher = void 0;
const PromiseSignalDispatcher_1 = __webpack_require__(482);
Object.defineProperty(exports, "PromiseSignalDispatcher", ({ enumerable: true, get: function () { return PromiseSignalDispatcher_1.PromiseSignalDispatcher; } }));
const PromiseSignalHandlingBase_1 = __webpack_require__(948);
Object.defineProperty(exports, "PromiseSignalHandlingBase", ({ enumerable: true, get: function () { return PromiseSignalHandlingBase_1.PromiseSignalHandlingBase; } }));
const PromiseSignalList_1 = __webpack_require__(758);
Object.defineProperty(exports, "PromiseSignalList", ({ enumerable: true, get: function () { return PromiseSignalList_1.PromiseSignalList; } }));


/***/ }),

/***/ 841:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NonUniformPromiseSimpleEventList = void 0;
const PromiseSimpleEventDispatcher_1 = __webpack_require__(550);
/**
 * Similar to EventList, but instead of TArgs, a map of event names ang argument types is provided with TArgsMap.
 */
class NonUniformPromiseSimpleEventList {
    constructor() {
        this._events = {};
    }
    /**
     * Gets the dispatcher associated with the name.
     * @param name The name of the event.
     */
    get(name) {
        if (this._events[name]) {
            // @TODO avoid typecasting. Not sure why TS thinks this._events[name] could still be undefined.
            return this._events[name];
        }
        const event = this.createDispatcher();
        this._events[name] = event;
        return event;
    }
    /**
     * Removes the dispatcher associated with the name.
     * @param name The name of the event.
     */
    remove(name) {
        delete this._events[name];
    }
    /**
     * Creates a new dispatcher instance.
     */
    createDispatcher() {
        return new PromiseSimpleEventDispatcher_1.PromiseSimpleEventDispatcher();
    }
}
exports.NonUniformPromiseSimpleEventList = NonUniformPromiseSimpleEventList;


/***/ }),

/***/ 550:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PromiseSimpleEventDispatcher = void 0;
const ste_core_1 = __webpack_require__(233);
/**
 * The dispatcher handles the storage of subsciptions and facilitates
 * subscription, unsubscription and dispatching of a simple event
 *
 * @export
 * @class PromiseSimpleEventDispatcher
 * @extends {PromiseDispatcherBase<IPromiseSimpleEventHandler<TArgs>>}
 * @implements {IPromiseSimpleEvent<TArgs>}
 * @template TArgs
 */
class PromiseSimpleEventDispatcher extends ste_core_1.PromiseDispatcherBase {
    /**
     * Creates a new SimpleEventDispatcher instance.
     */
    constructor() {
        super();
    }
    /**
     * Dispatches the event.
     * @param args The arguments object.
     * @returns {IPropagationStatus} The status of the dispatch.
     * @memberOf PromiseSimpleEventDispatcher
     */
    async dispatch(args) {
        const result = await this._dispatchAsPromise(false, this, arguments);
        if (result == null) {
            throw new ste_core_1.DispatchError("Got `null` back from dispatch.");
        }
        return result;
    }
    /**
     * Dispatches the event without waiting for it to complete.
     * @param args The argument object.
     * @memberOf PromiseSimpleEventDispatcher
     */
    dispatchAsync(args) {
        this._dispatchAsPromise(true, this, arguments);
    }
    /**
     * Creates an event from the dispatcher. Will return the dispatcher
     * in a wrapper. This will prevent exposure of any dispatcher methods.
     */
    asEvent() {
        return super.asEvent();
    }
}
exports.PromiseSimpleEventDispatcher = PromiseSimpleEventDispatcher;


/***/ }),

/***/ 511:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PromiseSimpleEventHandlingBase = void 0;
const ste_core_1 = __webpack_require__(233);
const PromiseSimpleEventList_1 = __webpack_require__(879);
/**
 * Extends objects with signal event handling capabilities.
 */
class PromiseSimpleEventHandlingBase extends ste_core_1.HandlingBase {
    constructor() {
        super(new PromiseSimpleEventList_1.PromiseSimpleEventList());
    }
}
exports.PromiseSimpleEventHandlingBase = PromiseSimpleEventHandlingBase;


/***/ }),

/***/ 879:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PromiseSimpleEventList = void 0;
const ste_core_1 = __webpack_require__(233);
const PromiseSimpleEventDispatcher_1 = __webpack_require__(550);
/**
 * Storage class for multiple simple events that are accessible by name.
 * Events dispatchers are automatically created.
 */
class PromiseSimpleEventList extends ste_core_1.EventListBase {
    /**
     * Creates a new SimpleEventList instance.
     */
    constructor() {
        super();
    }
    /**
     * Creates a new dispatcher instance.
     */
    createDispatcher() {
        return new PromiseSimpleEventDispatcher_1.PromiseSimpleEventDispatcher();
    }
}
exports.PromiseSimpleEventList = PromiseSimpleEventList;


/***/ }),

/***/ 817:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


/*!
 * Strongly Typed Events for TypeScript - Core
 * https://github.com/KeesCBakker/StronlyTypedEvents/
 * http://keestalkstech.com
 *
 * Copyright Kees C. Bakker / KeesTalksTech
 * Released under the MIT license
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NonUniformPromiseSimpleEventList = exports.PromiseSimpleEventList = exports.PromiseSimpleEventHandlingBase = exports.PromiseSimpleEventDispatcher = void 0;
const NonUniformPromiseSimpleEventList_1 = __webpack_require__(841);
Object.defineProperty(exports, "NonUniformPromiseSimpleEventList", ({ enumerable: true, get: function () { return NonUniformPromiseSimpleEventList_1.NonUniformPromiseSimpleEventList; } }));
const PromiseSimpleEventDispatcher_1 = __webpack_require__(550);
Object.defineProperty(exports, "PromiseSimpleEventDispatcher", ({ enumerable: true, get: function () { return PromiseSimpleEventDispatcher_1.PromiseSimpleEventDispatcher; } }));
const PromiseSimpleEventHandlingBase_1 = __webpack_require__(511);
Object.defineProperty(exports, "PromiseSimpleEventHandlingBase", ({ enumerable: true, get: function () { return PromiseSimpleEventHandlingBase_1.PromiseSimpleEventHandlingBase; } }));
const PromiseSimpleEventList_1 = __webpack_require__(879);
Object.defineProperty(exports, "PromiseSimpleEventList", ({ enumerable: true, get: function () { return PromiseSimpleEventList_1.PromiseSimpleEventList; } }));


/***/ }),

/***/ 275:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SignalDispatcher = void 0;
const ste_core_1 = __webpack_require__(233);
/**
 * The dispatcher handles the storage of subsciptions and facilitates
 * subscription, unsubscription and dispatching of a signal event.
 *
 * @export
 * @class SignalDispatcher
 * @extends {DispatcherBase<ISignalHandler>}
 * @implements {ISignal}
 */
class SignalDispatcher extends ste_core_1.DispatcherBase {
    /**
     * Creates an instance of SignalDispatcher.
     *
     * @memberOf SignalDispatcher
     */
    constructor() {
        super();
    }
    /**
     * Dispatches the signal.
     *
     * @returns {IPropagationStatus} The status of the signal.
     *
     * @memberOf SignalDispatcher
     */
    dispatch() {
        const result = this._dispatch(false, this, arguments);
        if (result == null) {
            throw new ste_core_1.DispatchError("Got `null` back from dispatch.");
        }
        return result;
    }
    /**
     * Dispatches the signal without waiting for the result.
     *
     * @memberOf SignalDispatcher
     */
    dispatchAsync() {
        this._dispatch(true, this, arguments);
    }
    /**
     * Creates an event from the dispatcher. Will return the dispatcher
     * in a wrapper. This will prevent exposure of any dispatcher methods.
     *
     * @returns {ISignal} The signal.
     *
     * @memberOf SignalDispatcher
     */
    asEvent() {
        return super.asEvent();
    }
}
exports.SignalDispatcher = SignalDispatcher;


/***/ }),

/***/ 36:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SignalHandlingBase = void 0;
const ste_core_1 = __webpack_require__(233);
const SignalList_1 = __webpack_require__(80);
/**
 * Extends objects with signal event handling capabilities.
 */
class SignalHandlingBase extends ste_core_1.HandlingBase {
    constructor() {
        super(new SignalList_1.SignalList());
    }
}
exports.SignalHandlingBase = SignalHandlingBase;


/***/ }),

/***/ 80:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SignalList = void 0;
const ste_core_1 = __webpack_require__(233);
const SignalDispatcher_1 = __webpack_require__(275);
/**
 * Storage class for multiple signal events that are accessible by name.
 * Events dispatchers are automatically created.
 */
class SignalList extends ste_core_1.EventListBase {
    /**
     * Creates a new SignalList instance.
     */
    constructor() {
        super();
    }
    /**
     * Creates a new dispatcher instance.
     */
    createDispatcher() {
        return new SignalDispatcher_1.SignalDispatcher();
    }
}
exports.SignalList = SignalList;


/***/ }),

/***/ 350:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


/*!
 * Strongly Typed Events for TypeScript - Promise Signals
 * https://github.com/KeesCBakker/StronlyTypedEvents/
 * http://keestalkstech.com
 *
 * Copyright Kees C. Bakker / KeesTalksTech
 * Released under the MIT license
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SignalList = exports.SignalHandlingBase = exports.SignalDispatcher = void 0;
const SignalDispatcher_1 = __webpack_require__(275);
Object.defineProperty(exports, "SignalDispatcher", ({ enumerable: true, get: function () { return SignalDispatcher_1.SignalDispatcher; } }));
const SignalHandlingBase_1 = __webpack_require__(36);
Object.defineProperty(exports, "SignalHandlingBase", ({ enumerable: true, get: function () { return SignalHandlingBase_1.SignalHandlingBase; } }));
const SignalList_1 = __webpack_require__(80);
Object.defineProperty(exports, "SignalList", ({ enumerable: true, get: function () { return SignalList_1.SignalList; } }));


/***/ }),

/***/ 335:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NonUniformSimpleEventList = void 0;
const SimpleEventDispatcher_1 = __webpack_require__(120);
/**
 * Similar to EventList, but instead of TArgs, a map of event names ang argument types is provided with TArgsMap.
 */
class NonUniformSimpleEventList {
    constructor() {
        this._events = {};
    }
    /**
     * Gets the dispatcher associated with the name.
     * @param name The name of the event.
     */
    get(name) {
        if (this._events[name]) {
            // @TODO avoid typecasting. Not sure why TS thinks this._events[name] could still be undefined.
            return this._events[name];
        }
        const event = this.createDispatcher();
        this._events[name] = event;
        return event;
    }
    /**
     * Removes the dispatcher associated with the name.
     * @param name The name of the event.
     */
    remove(name) {
        delete this._events[name];
    }
    /**
     * Creates a new dispatcher instance.
     */
    createDispatcher() {
        return new SimpleEventDispatcher_1.SimpleEventDispatcher();
    }
}
exports.NonUniformSimpleEventList = NonUniformSimpleEventList;


/***/ }),

/***/ 120:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SimpleEventDispatcher = void 0;
const ste_core_1 = __webpack_require__(233);
/**
 * The dispatcher handles the storage of subsciptions and facilitates
 * subscription, unsubscription and dispatching of a simple event
 *
 * @export
 * @class SimpleEventDispatcher
 * @extends {DispatcherBase<ISimpleEventHandler<TArgs>>}
 * @implements {ISimpleEvent<TArgs>}
 * @template TArgs
 */
class SimpleEventDispatcher extends ste_core_1.DispatcherBase {
    /**
     * Creates an instance of SimpleEventDispatcher.
     *
     * @memberOf SimpleEventDispatcher
     */
    constructor() {
        super();
    }
    /**
     * Dispatches the event.
     *
     * @param {TArgs} args The arguments object.
     * @returns {IPropagationStatus} The status of the event.
     *
     * @memberOf SimpleEventDispatcher
     */
    dispatch(args) {
        const result = this._dispatch(false, this, arguments);
        if (result == null) {
            throw new ste_core_1.DispatchError("Got `null` back from dispatch.");
        }
        return result;
    }
    /**
     * Dispatches the event without waiting for the result.
     *
     * @param {TArgs} args The arguments object.
     *
     * @memberOf SimpleEventDispatcher
     */
    dispatchAsync(args) {
        this._dispatch(true, this, arguments);
    }
    /**
     * Creates an event from the dispatcher. Will return the dispatcher
     * in a wrapper. This will prevent exposure of any dispatcher methods.
     *
     * @returns {ISimpleEvent<TArgs>} The event.
     *
     * @memberOf SimpleEventDispatcher
     */
    asEvent() {
        return super.asEvent();
    }
}
exports.SimpleEventDispatcher = SimpleEventDispatcher;


/***/ }),

/***/ 229:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SimpleEventHandlingBase = void 0;
const ste_core_1 = __webpack_require__(233);
const SimpleEventList_1 = __webpack_require__(222);
/**
 * Extends objects with signal event handling capabilities.
 */
class SimpleEventHandlingBase extends ste_core_1.HandlingBase {
    constructor() {
        super(new SimpleEventList_1.SimpleEventList());
    }
}
exports.SimpleEventHandlingBase = SimpleEventHandlingBase;


/***/ }),

/***/ 222:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SimpleEventList = void 0;
const ste_core_1 = __webpack_require__(233);
const SimpleEventDispatcher_1 = __webpack_require__(120);
/**
 * Storage class for multiple simple events that are accessible by name.
 * Events dispatchers are automatically created.
 */
class SimpleEventList extends ste_core_1.EventListBase {
    /**
     * Creates a new SimpleEventList instance.
     */
    constructor() {
        super();
    }
    /**
     * Creates a new dispatcher instance.
     */
    createDispatcher() {
        return new SimpleEventDispatcher_1.SimpleEventDispatcher();
    }
}
exports.SimpleEventList = SimpleEventList;


/***/ }),

/***/ 844:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NonUniformSimpleEventList = exports.SimpleEventList = exports.SimpleEventHandlingBase = exports.SimpleEventDispatcher = void 0;
const SimpleEventDispatcher_1 = __webpack_require__(120);
Object.defineProperty(exports, "SimpleEventDispatcher", ({ enumerable: true, get: function () { return SimpleEventDispatcher_1.SimpleEventDispatcher; } }));
const SimpleEventHandlingBase_1 = __webpack_require__(229);
Object.defineProperty(exports, "SimpleEventHandlingBase", ({ enumerable: true, get: function () { return SimpleEventHandlingBase_1.SimpleEventHandlingBase; } }));
const NonUniformSimpleEventList_1 = __webpack_require__(335);
Object.defineProperty(exports, "NonUniformSimpleEventList", ({ enumerable: true, get: function () { return NonUniformSimpleEventList_1.NonUniformSimpleEventList; } }));
const SimpleEventList_1 = __webpack_require__(222);
Object.defineProperty(exports, "SimpleEventList", ({ enumerable: true, get: function () { return SimpleEventList_1.SimpleEventList; } }));


/***/ }),

/***/ 590:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

var __webpack_unused_export__;

/*!
 * Strongly Typed Events for TypeScript
 * https://github.com/KeesCBakker/StronlyTypedEvents/
 * http://keestalkstech.com
 *
 * Copyright Kees C. Bakker / KeesTalksTech
 * Released under the MIT license
 */
__webpack_unused_export__ = ({ value: true });
__webpack_unused_export__ = __webpack_unused_export__ = __webpack_unused_export__ = __webpack_unused_export__ = __webpack_unused_export__ = __webpack_unused_export__ = __webpack_unused_export__ = __webpack_unused_export__ = __webpack_unused_export__ = __webpack_unused_export__ = __webpack_unused_export__ = __webpack_unused_export__ = __webpack_unused_export__ = exports.nz = __webpack_unused_export__ = __webpack_unused_export__ = __webpack_unused_export__ = exports.FK = __webpack_unused_export__ = __webpack_unused_export__ = __webpack_unused_export__ = __webpack_unused_export__ = __webpack_unused_export__ = __webpack_unused_export__ = __webpack_unused_export__ = __webpack_unused_export__ = __webpack_unused_export__ = __webpack_unused_export__ = __webpack_unused_export__ = __webpack_unused_export__ = __webpack_unused_export__ = void 0;
var ste_core_1 = __webpack_require__(233);
__webpack_unused_export__ = ({ enumerable: true, get: function () { return ste_core_1.Subscription; } });
__webpack_unused_export__ = ({ enumerable: true, get: function () { return ste_core_1.DispatcherBase; } });
__webpack_unused_export__ = ({ enumerable: true, get: function () { return ste_core_1.DispatcherWrapper; } });
__webpack_unused_export__ = ({ enumerable: true, get: function () { return ste_core_1.EventListBase; } });
__webpack_unused_export__ = ({ enumerable: true, get: function () { return ste_core_1.EventManagement; } });
__webpack_unused_export__ = ({ enumerable: true, get: function () { return ste_core_1.DispatchError; } });
__webpack_unused_export__ = ({ enumerable: true, get: function () { return ste_core_1.PromiseSubscription; } });
__webpack_unused_export__ = ({ enumerable: true, get: function () { return ste_core_1.PromiseDispatcherBase; } });
__webpack_unused_export__ = ({ enumerable: true, get: function () { return ste_core_1.HandlingBase; } });
var ste_events_1 = __webpack_require__(851);
__webpack_unused_export__ = ({ enumerable: true, get: function () { return ste_events_1.EventDispatcher; } });
__webpack_unused_export__ = ({ enumerable: true, get: function () { return ste_events_1.EventHandlingBase; } });
__webpack_unused_export__ = ({ enumerable: true, get: function () { return ste_events_1.EventList; } });
__webpack_unused_export__ = ({ enumerable: true, get: function () { return ste_events_1.NonUniformEventList; } });
var ste_simple_events_1 = __webpack_require__(844);
Object.defineProperty(exports, "FK", ({ enumerable: true, get: function () { return ste_simple_events_1.SimpleEventDispatcher; } }));
__webpack_unused_export__ = ({ enumerable: true, get: function () { return ste_simple_events_1.SimpleEventHandlingBase; } });
__webpack_unused_export__ = ({ enumerable: true, get: function () { return ste_simple_events_1.SimpleEventList; } });
__webpack_unused_export__ = ({ enumerable: true, get: function () { return ste_simple_events_1.NonUniformSimpleEventList; } });
var ste_signals_1 = __webpack_require__(350);
Object.defineProperty(exports, "nz", ({ enumerable: true, get: function () { return ste_signals_1.SignalDispatcher; } }));
__webpack_unused_export__ = ({ enumerable: true, get: function () { return ste_signals_1.SignalHandlingBase; } });
__webpack_unused_export__ = ({ enumerable: true, get: function () { return ste_signals_1.SignalList; } });
var ste_promise_events_1 = __webpack_require__(129);
__webpack_unused_export__ = ({ enumerable: true, get: function () { return ste_promise_events_1.PromiseEventDispatcher; } });
__webpack_unused_export__ = ({ enumerable: true, get: function () { return ste_promise_events_1.PromiseEventHandlingBase; } });
__webpack_unused_export__ = ({ enumerable: true, get: function () { return ste_promise_events_1.PromiseEventList; } });
__webpack_unused_export__ = ({ enumerable: true, get: function () { return ste_promise_events_1.NonUniformPromiseEventList; } });
var ste_promise_signals_1 = __webpack_require__(559);
__webpack_unused_export__ = ({ enumerable: true, get: function () { return ste_promise_signals_1.PromiseSignalDispatcher; } });
__webpack_unused_export__ = ({ enumerable: true, get: function () { return ste_promise_signals_1.PromiseSignalHandlingBase; } });
__webpack_unused_export__ = ({ enumerable: true, get: function () { return ste_promise_signals_1.PromiseSignalList; } });
var ste_promise_simple_events_1 = __webpack_require__(817);
__webpack_unused_export__ = ({ enumerable: true, get: function () { return ste_promise_simple_events_1.PromiseSimpleEventDispatcher; } });
__webpack_unused_export__ = ({ enumerable: true, get: function () { return ste_promise_simple_events_1.PromiseSimpleEventHandlingBase; } });
__webpack_unused_export__ = ({ enumerable: true, get: function () { return ste_promise_simple_events_1.PromiseSimpleEventList; } });
__webpack_unused_export__ = ({ enumerable: true, get: function () { return ste_promise_simple_events_1.NonUniformPromiseSimpleEventList; } });


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {

;// CONCATENATED MODULE: ../engrid-scripts/packages/common/dist/deprecated.js
// A way to gracefully handle deprecation.
// Find and replace HTML Elements, Classes, and more after the DOM is loaded but before any other Javascript fires.

class Deprecated {
  constructor() {
    let deprecated;
    let replacement; // Checks for body-side class

    deprecated = document.querySelector(".body-side");

    if (deprecated) {
      this.warning(deprecated);
    } // Checks for backgroundImage class


    deprecated = document.querySelector(".backgroundImage");

    if (deprecated) {
      replacement = "background-image";
      this.replace(deprecated, replacement);
    } // Checks for backgroundImageOverlay class


    deprecated = document.querySelector(".backgroundImageOverlay");

    if (deprecated) {
      replacement = "background-image-overlay";
      this.replace(deprecated, replacement);
    }
  }

  warning(deprecated) {
    if (ENGrid.debug) console.log("Deprecated: '" + deprecated + "' was detected and nothing was done.");
  }

  replace(deprecated, replacement) {
    if (ENGrid.debug) console.log("Deprecated: '" + deprecated + "' was detected and replaced with '" + replacement + "'.");
    deprecated.classList.add(replacement);
    deprecated.classList.remove(deprecated);
  }

}
;// CONCATENATED MODULE: ../engrid-scripts/packages/common/dist/interfaces/options.js
const OptionsDefaults = {
  backgroundImage: '',
  MediaAttribution: true,
  applePay: false,
  CapitalizeFields: false,
  ClickToExpand: true,
  CurrencySymbol: '$',
  CurrencySeparator: '.',
  SkipToMainContentLink: true,
  SrcDefer: true,
  NeverBounceAPI: null,
  NeverBounceDateField: null,
  NeverBounceStatusField: null,
  Debug: false
};
;// CONCATENATED MODULE: ../engrid-scripts/packages/common/dist/interfaces/upsell-options.js
const UpsellOptionsDefaults = {
  image: "https://picsum.photos/480/650",
  imagePosition: "left",
  title: "Will you change your gift to just {new-amount} a month to boost your impact?",
  paragraph: "Make a monthly pledge today to support us with consistent, reliable resources during emergency moments.",
  yesLabel: "Yes! Process My <br> {new-amount} monthly gift",
  noLabel: "No, thanks. Continue with my <br> {old-amount} one-time gift",
  otherAmount: true,
  otherLabel: "Or enter a different monthly amount:",
  upsellOriginalGiftAmountFieldName: '',
  amountRange: [{
    max: 10,
    suggestion: 5
  }, {
    max: 15,
    suggestion: 7
  }, {
    max: 20,
    suggestion: 8
  }, {
    max: 25,
    suggestion: 9
  }, {
    max: 30,
    suggestion: 10
  }, {
    max: 35,
    suggestion: 11
  }, {
    max: 40,
    suggestion: 12
  }, {
    max: 50,
    suggestion: 14
  }, {
    max: 100,
    suggestion: 15
  }, {
    max: 200,
    suggestion: 19
  }, {
    max: 300,
    suggestion: 29
  }, {
    max: 500,
    suggestion: "Math.ceil((amount / 12)/5)*5"
  }],
  canClose: true,
  submitOnClose: false
};
// EXTERNAL MODULE: ../engrid-scripts/packages/common/node_modules/strongly-typed-events/dist/index.js
var dist = __webpack_require__(590);
;// CONCATENATED MODULE: ../engrid-scripts/packages/common/dist/events/en-form.js


class EnForm {
  constructor() {
    this._onSubmit = new dist/* SignalDispatcher */.nz();
    this._onValidate = new dist/* SignalDispatcher */.nz();
    this._onError = new dist/* SignalDispatcher */.nz();
    this.submit = true;
    this.validate = true;
  }

  static getInstance() {
    if (!EnForm.instance) {
      EnForm.instance = new EnForm();
    }

    return EnForm.instance;
  }

  dispatchSubmit() {
    this._onSubmit.dispatch();

    if (engrid_ENGrid.debug) console.log("dispatchSubmit");
  }

  dispatchValidate() {
    this._onValidate.dispatch();

    if (engrid_ENGrid.debug) console.log("dispatchValidate");
  }

  dispatchError() {
    this._onError.dispatch();

    if (engrid_ENGrid.debug) console.log("dispatchError");
  }

  submitForm() {
    const enForm = document.querySelector("form .en__submit button");

    if (enForm) {
      // Add submitting class to modal
      const enModal = document.getElementById("enModal");
      if (enModal) enModal.classList.add("is-submitting");
      enForm.click();
      if (engrid_ENGrid.debug) console.log("submitForm");
    }
  }

  get onSubmit() {
    // if(ENGrid.debug) console.log("onSubmit");
    return this._onSubmit.asEvent();
  }

  get onError() {
    // if(ENGrid.debug) console.log("onError");
    return this._onError.asEvent();
  }

  get onValidate() {
    // if(ENGrid.debug) console.log("onError");
    return this._onValidate.asEvent();
  }

}
;// CONCATENATED MODULE: ../engrid-scripts/packages/common/dist/events/donation-amount.js

class DonationAmount {
  constructor(radios = "transaction.donationAmt", other = "transaction.donationAmt.other") {
    this._onAmountChange = new dist/* SimpleEventDispatcher */.FK();
    this._amount = 0;
    this._radios = "";
    this._other = "";
    this._dispatch = true;
    this._other = other;
    this._radios = radios; // Watch Radios Inputs for Changes

    document.addEventListener("change", e => {
      const element = e.target;

      if (element && element.name == radios) {
        element.value = this.removeCommas(element.value);
        this.amount = parseFloat(element.value);
      }
    }); // Watch Other Amount Field

    const otherField = document.querySelector(`[name='${this._other}']`);

    if (otherField) {
      otherField.addEventListener("keyup", e => {
        otherField.value = this.removeCommas(otherField.value);
        this.amount = parseFloat(otherField.value);
      });
    }
  }

  static getInstance(radios = "transaction.donationAmt", other = "transaction.donationAmt.other") {
    if (!DonationAmount.instance) {
      DonationAmount.instance = new DonationAmount(radios, other);
    }

    return DonationAmount.instance;
  }

  get amount() {
    return this._amount;
  } // Every time we set an amount, trigger the onAmountChange event


  set amount(value) {
    this._amount = value || 0;
    if (this._dispatch) this._onAmountChange.dispatch(this._amount);
  }

  get onAmountChange() {
    return this._onAmountChange.asEvent();
  } // Set amount var with currently selected amount


  load() {
    const currentAmountField = document.querySelector('input[name="' + this._radios + '"]:checked');

    if (currentAmountField && currentAmountField.value) {
      let currentAmountValue = parseFloat(currentAmountField.value);

      if (currentAmountValue > 0) {
        this.amount = parseFloat(currentAmountField.value);
      } else {
        const otherField = document.querySelector('input[name="' + this._other + '"]');
        currentAmountValue = parseFloat(otherField.value);
        this.amount = parseFloat(otherField.value);
      }
    }
  } // Force a new amount


  setAmount(amount, dispatch = true) {
    // Run only if it is a Donation Page with a Donation Amount field
    if (!document.getElementsByName(this._radios).length) {
      return;
    } // Set dispatch to be checked by the SET method


    this._dispatch = dispatch; // Search for the current amount on radio boxes

    let found = Array.from(document.querySelectorAll('input[name="' + this._radios + '"]')).filter(el => el instanceof HTMLInputElement && parseInt(el.value) == amount); // We found the amount on the radio boxes, so check it

    if (found.length) {
      const amountField = found[0];
      amountField.checked = true; // Clear OTHER text field

      this.clearOther();
    } else {
      const otherField = document.querySelector('input[name="' + this._other + '"]');
      otherField.focus();
      otherField.value = parseFloat(amount.toString()).toFixed(2);
    } // Set the new amount and trigger all live variables


    this.amount = amount; // Revert dispatch to default value (true)

    this._dispatch = true;
  } // Clear Other Field


  clearOther() {
    const otherField = document.querySelector('input[name="' + this._other + '"]');
    otherField.value = "";
    const otherWrapper = otherField.parentNode;
    otherWrapper.classList.add("en__field__item--hidden");
  } // Remove commas


  removeCommas(v) {
    // replace 5,00 with 5.00
    if (v.length > 3 && v.charAt(v.length - 3) == ',') {
      v = v.substr(0, v.length - 3) + "." + v.substr(v.length - 2, 2);
    } else if (v.length > 2 && v.charAt(v.length - 2) == ',') {
      v = v.substr(0, v.length - 2) + "." + v.substr(v.length - 1, 1);
    } // replace any remaining commas


    return v.replace(/,/g, '');
  }

}
;// CONCATENATED MODULE: ../engrid-scripts/packages/common/dist/engrid.js
class engrid_ENGrid {
  constructor() {
    if (!engrid_ENGrid.enForm) {
      throw new Error('Engaging Networks Form Not Found!');
    }
  }

  static get enForm() {
    return document.querySelector("form.en__component");
  }

  static get debug() {
    return !!this.getOption('Debug');
  } // Return any parameter from the URL


  static getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
  } // Return the field value from its name. It works on any field type.
  // Multiple values (from checkboxes or multi-select) are returned as single string
  // Separated by ,


  static getFieldValue(name) {
    return new FormData(this.enForm).getAll(name).join(',');
  } // Set a value to any field. If it's a dropdown, radio or checkbox, it selects the proper option matching the value


  static setFieldValue(name, value) {
    document.getElementsByName(name).forEach(field => {
      if ('type' in field) {
        switch (field.type) {
          case 'select-one':
          case 'select-multiple':
            for (const option of field.options) {
              if (option.value == value) {
                option.selected = true;
              }
            }

            break;

          case 'checkbox':
          case 'radio':
            // @TODO: Try to trigger the onChange event
            if (field.value == value) {
              field.checked = true;
            }

            break;

          case 'textarea':
          case 'text':
          default:
            field.value = value;
        }
      }
    });
    this.enParseDependencies();
    return;
  } // Trigger EN Dependencies


  static enParseDependencies() {
    var _a, _b, _c, _d, _e;

    if (window.EngagingNetworks && typeof ((_e = (_d = (_c = (_b = (_a = window.EngagingNetworks) === null || _a === void 0 ? void 0 : _a.require) === null || _b === void 0 ? void 0 : _b._defined) === null || _c === void 0 ? void 0 : _c.enDependencies) === null || _d === void 0 ? void 0 : _d.dependencies) === null || _e === void 0 ? void 0 : _e.parseDependencies) === "function") {
      window.EngagingNetworks.require._defined.enDependencies.dependencies.parseDependencies(window.EngagingNetworks.dependencies);

      if (engrid_ENGrid.getOption('Debug')) console.trace('EN Dependencies Triggered');
    }
  } // Return the status of the gift process (true if a donation has been made, otherwise false)


  static getGiftProcess() {
    if ('pageJson' in window) return window.pageJson.giftProcess;
    return null;
  } // Return the page count


  static getPageCount() {
    if ('pageJson' in window) return window.pageJson.pageCount;
    return null;
  } // Return the current page number


  static getPageNumber() {
    if ('pageJson' in window) return window.pageJson.pageNumber;
    return null;
  } // Return the current page ID


  static getPageID() {
    if ('pageJson' in window) return window.pageJson.campaignPageId;
    return 0;
  } // Return the current page type


  static getPageType() {
    if ('pageJson' in window && 'pageType' in window.pageJson) {
      switch (window.pageJson.pageType) {
        case "e-card":
          return "ECARD";
          break;

        case "otherdatacapture":
          return "SURVEY";
          break;

        case "emailtotarget":
        case "advocacypetition":
          return "ADVOCACY";
          break;

        case "emailsubscribeform":
          return "SUBSCRIBEFORM";
          break;

        default:
          return "DONATION";
      }
    } else {
      return "DONATION";
    }
  } // Set body engrid data attributes


  static setBodyData(dataName, value) {
    const body = document.querySelector('body');
    body.setAttribute(`data-engrid-${dataName}`, value);
  } // Get body engrid data attributes


  static getBodyData(dataName) {
    const body = document.querySelector('body');
    return body.getAttribute(`data-engrid-${dataName}`);
  } // Return the option value


  static getOption(key) {
    return window.EngridOptions[key] || null;
  } // Load an external script


  static loadJS(url, onload = null, head = true) {
    const scriptTag = document.createElement('script');
    scriptTag.src = url;
    scriptTag.onload = onload;

    if (head) {
      document.getElementsByTagName("head")[0].appendChild(scriptTag);
      return;
    }

    document.getElementsByTagName("body")[0].appendChild(scriptTag);
    return;
  }

}
;// CONCATENATED MODULE: ../engrid-scripts/packages/common/dist/events/donation-frequency.js


class DonationFrequency {
  constructor() {
    this._onFrequencyChange = new dist/* SimpleEventDispatcher */.FK();
    this._frequency = "onetime";
    this._recurring = "n";
    this._dispatch = true; // Watch the Radios for Changes

    document.addEventListener("change", e => {
      const element = e.target;

      if (element && element.name == "transaction.recurrpay") {
        this.recurring = element.value; // When this element is a radio, that means you're between onetime and monthly only

        if (element.type == 'radio') {
          this.frequency = element.value.toLowerCase() == 'n' ? 'onetime' : 'monthly'; // This field is hidden when transaction.recurrpay is radio

          engrid_ENGrid.setFieldValue('transaction.recurrfreq', this.frequency.toUpperCase());
        }
      }

      if (element && element.name == "transaction.recurrfreq") {
        this.frequency = element.value;
      }
    });
  }

  static getInstance() {
    if (!DonationFrequency.instance) {
      DonationFrequency.instance = new DonationFrequency();
    }

    return DonationFrequency.instance;
  }

  get frequency() {
    return this._frequency;
  } // Every time we set a frequency, trigger the onFrequencyChange event


  set frequency(value) {
    this._frequency = value.toLowerCase() || 'onetime';
    if (this._dispatch) this._onFrequencyChange.dispatch(this._frequency);
    engrid_ENGrid.setBodyData('transaction-recurring-frequency', this._frequency);
  }

  get recurring() {
    return this._recurring;
  }

  set recurring(value) {
    this._recurring = value.toLowerCase() || 'n';
    engrid_ENGrid.setBodyData('transaction-recurring', this._recurring);
  }

  get onFrequencyChange() {
    return this._onFrequencyChange.asEvent();
  } // Set amount var with currently selected amount


  load() {
    this.frequency = engrid_ENGrid.getFieldValue('transaction.recurrfreq');
    this.recurring = engrid_ENGrid.getFieldValue('transaction.recurrpay'); // ENGrid.enParseDependencies();
  } // Force a new recurrency


  setRecurrency(recurr, dispatch = true) {
    // Run only if it is a Donation Page with a Recurrency
    if (!document.getElementsByName("transaction.recurrpay").length) {
      return;
    } // Set dispatch to be checked by the SET method


    this._dispatch = dispatch;
    engrid_ENGrid.setFieldValue("transaction.recurrpay", recurr.toUpperCase()); // Revert dispatch to default value (true)

    this._dispatch = true;
  } // Force a new frequency


  setFrequency(freq, dispatch = true) {
    // Run only if it is a Donation Page with a Frequency
    if (!document.getElementsByName("transaction.recurrfreq").length) {
      return;
    } // Set dispatch to be checked by the SET method


    this._dispatch = dispatch; // Search for the current amount on radio boxes

    let found = Array.from(document.querySelectorAll('input[name="transaction.recurrfreq"]')).filter(el => el instanceof HTMLInputElement && el.value == freq.toUpperCase()); // We found the amount on the radio boxes, so check it

    if (found.length) {
      const freqField = found[0];
      freqField.checked = true;
      this.frequency = freq.toLowerCase();

      if (this.frequency === 'onetime') {
        this.setRecurrency("N", dispatch);
      } else {
        this.setRecurrency("Y", dispatch);
      }
    } // Revert dispatch to default value (true)


    this._dispatch = true;
  }

}
;// CONCATENATED MODULE: ../engrid-scripts/packages/common/dist/events/processing-fees.js



class ProcessingFees {
  constructor() {
    this._onFeeChange = new dist/* SimpleEventDispatcher */.FK();
    this._amount = DonationAmount.getInstance();
    this._form = EnForm.getInstance();
    this._fee = 0;
    this._field = document.querySelector('input[name="supporter.processing_fees"]'); // console.log('%c Processing Fees Constructor', 'font-size: 30px; background-color: #000; color: #FF0');
    // Run only if it is a Donation Page with a Donation Amount field

    if (!document.getElementsByName("transaction.donationAmt").length) {
      return;
    } // Watch the Radios for Changes


    if (this._field instanceof HTMLInputElement) {
      // console.log('%c Processing Fees Start', 'font-size: 30px; background-color: #000; color: #FF0');
      this._field.addEventListener("change", e => {
        if (this._field instanceof HTMLInputElement && this._field.checked && !this._subscribe) {
          this._subscribe = this._form.onSubmit.subscribe(() => this.addFees());
        }

        this._onFeeChange.dispatch(this.fee); // // console.log('%c Processing Fees Script Applied', 'font-size: 30px; background-color: #000; color: #FF0');

      });
    } // this._amount = amount;

  }

  static getInstance() {
    if (!ProcessingFees.instance) {
      ProcessingFees.instance = new ProcessingFees();
    }

    return ProcessingFees.instance;
  }

  get onFeeChange() {
    return this._onFeeChange.asEvent();
  }

  get fee() {
    return this.calculateFees();
  } // Every time we set a frequency, trigger the onFrequencyChange event


  set fee(value) {
    this._fee = value;

    this._onFeeChange.dispatch(this._fee);
  }

  calculateFees() {
    if (this._field instanceof HTMLInputElement && this._field.checked && "dataset" in this._field) {
      const fees = Object.assign({
        processingfeepercentadded: "0",
        processingfeefixedamountadded: "0"
      }, this._field.dataset);
      const processing_fee = parseFloat(fees.processingfeepercentadded) / 100 * this._amount.amount + parseFloat(fees.processingfeefixedamountadded);
      return Math.round(processing_fee * 100) / 100;
    }

    return 0;
  } // Add Fees to Amount


  addFees() {
    if (this._form.submit) {
      this._amount.setAmount(this._amount.amount + this.fee, false);
    }
  } // Remove Fees From Amount


  removeFees() {
    this._amount.setAmount(this._amount.amount - this.fee);
  }

}
;// CONCATENATED MODULE: ../engrid-scripts/packages/common/dist/events/index.js




;// CONCATENATED MODULE: ../engrid-scripts/packages/common/dist/app.js


class App extends engrid_ENGrid {
  constructor(options) {
    super(); // Events

    this._form = EnForm.getInstance();
    this._fees = ProcessingFees.getInstance();
    this._amount = DonationAmount.getInstance("transaction.donationAmt", "transaction.donationAmt.other");
    this._frequency = DonationFrequency.getInstance();

    this.shouldScroll = () => {
      // If you find a error, scroll
      if (document.querySelector('.en__errorHeader')) {
        return true;
      } // Try to match the iframe referrer URL by testing valid EN Page URLs


      let referrer = document.referrer;
      let enURLPattern = new RegExp(/^(.*)\/(page)\/(\d+.*)/); // Scroll if the Regex matches, don't scroll otherwise

      return enURLPattern.test(referrer);
    };

    this.options = Object.assign(Object.assign({}, OptionsDefaults), options); // Add Options to window

    window.EngridOptions = this.options; // Document Load

    if (document.readyState !== "loading") {
      this.run();
    } else {
      document.addEventListener("DOMContentLoaded", () => {
        this.run();
      });
    } // Window Load


    window.onload = () => {
      this.onLoad();
    }; // Window Resize


    window.onresize = () => {
      this.onResize();
    };
  }

  run() {
    // Enable debug if available is the first thing
    if (this.options.Debug || App.getUrlParameter('debug') == 'true') App.setBodyData('debug', ''); // IE Warning

    new IE(); // Page Background

    new PageBackground(); // TODO: Abstract everything to the App class so we can remove custom-methods

    inputPlaceholder();
    watchInmemField();
    watchGiveBySelectField();
    SetEnFieldOtherAmountRadioStepValue();
    simpleUnsubscribe();
    contactDetailLabels();
    easyEdit();
    enInput.init();
    new ShowHideRadioCheckboxes("transaction.giveBySelect", "giveBySelect-");
    new ShowHideRadioCheckboxes("transaction.inmem", "inmem-");
    new ShowHideRadioCheckboxes("transaction.recurrpay", "recurrpay-"); // Controls if the Theme has a the "Debug Bar"
    // legacy.debugBar();
    // Client onSubmit and onError functions

    this._form.onSubmit.subscribe(() => this.onSubmit());

    this._form.onError.subscribe(() => this.onError());

    this._form.onValidate.subscribe(() => this.onValidate()); // Event Listener Examples


    this._amount.onAmountChange.subscribe(s => console.log(`Live Amount: ${s}`));

    this._frequency.onFrequencyChange.subscribe(s => console.log(`Live Frequency: ${s}`));

    this._form.onSubmit.subscribe(s => console.log('Submit: ', s));

    this._form.onError.subscribe(s => console.log('Error:', s));

    window.enOnSubmit = () => {
      this._form.dispatchSubmit();

      return this._form.submit;
    };

    window.enOnError = () => {
      this._form.dispatchError();
    };

    window.enOnValidate = () => {
      this._form.dispatchValidate();

      return this._form.validate;
    }; // iFrame Logic


    this.loadIFrame(); // Live Variables

    new LiveVariables(this.options); // Dynamically set Recurrency Frequency

    new setRecurrFreq(); // Upsell Lightbox

    new UpsellLightbox(); // On the end of the script, after all subscribers defined, let's load the current value

    this._amount.load();

    this._frequency.load(); // Simple Country Select


    new SimpleCountrySelect(); // Add Image Attribution

    if (this.options.MediaAttribution) new MediaAttribution(); // Apple Pay

    if (this.options.applePay) new ApplePay(); // Capitalize Fields

    if (this.options.CapitalizeFields) new CapitalizeFields(); // Click To Expand

    if (this.options.ClickToExpand) new ClickToExpand();
    if (this.options.SkipToMainContentLink) new SkipToMainContentLink();
    if (this.options.SrcDefer) new SrcDefer();
    if (this.options.NeverBounceAPI) new NeverBounce(this.options.NeverBounceAPI, this.options.NeverBounceDateField, this.options.NeverBounceStatusField);
    this.setDataAttributes();
  }

  onLoad() {
    if (this.options.onLoad) {
      this.options.onLoad();
    }

    if (this.inIframe()) {
      // Scroll to top of iFrame
      if (App.debug) console.log("iFrame Event - window.onload");
      sendIframeHeight();
      window.parent.postMessage({
        scroll: this.shouldScroll()
      }, "*"); // On click fire the resize event

      document.addEventListener("click", e => {
        if (App.debug) console.log("iFrame Event - click");
        setTimeout(() => {
          sendIframeHeight();
        }, 100);
      });
    }
  }

  onResize() {
    if (this.options.onResize) {
      this.options.onResize();
    }

    if (this.inIframe()) {
      if (App.debug) console.log("iFrame Event - window.onload");
      sendIframeHeight();
    }
  }

  onValidate() {
    if (this.options.onValidate) {
      if (App.debug) console.log("Client onValidate Triggered");
      this.options.onValidate();
    }
  }

  onSubmit() {
    if (this.options.onSubmit) {
      if (App.debug) console.log("Client onSubmit Triggered");
      this.options.onSubmit();
    }

    if (this.inIframe()) {
      sendIframeFormStatus('submit');
    }
  }

  onError() {
    if (this.options.onError) {
      if (App.debug) console.log("Client onError Triggered");
      this.options.onError();
    }
  }

  inIframe() {
    try {
      return window.self !== window.top;
    } catch (e) {
      return true;
    }
  }

  loadIFrame() {
    if (this.inIframe()) {
      // Add the data-engrid-embedded attribute when inside an iFrame if it wasn't already added by a script in the Page Template
      App.setBodyData("embedded", ""); // Fire the resize event

      if (App.debug) console.log("iFrame Event - First Resize");
      sendIframeHeight();
    }
  } // Use this function to add any Data Attributes to the Body tag


  setDataAttributes() {
    // Add a body banner data attribute if it's empty
    if (!document.querySelector('.body-banner img')) {
      App.setBodyData('body-banner', 'empty');
    }
  }

}
;// CONCATENATED MODULE: ../engrid-scripts/packages/common/dist/apple-pay.js
var __awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};



/*global window */

const ApplePaySession = window.ApplePaySession;
const merchantIdentifier = window.merchantIdentifier;
const merchantDomainName = window.merchantDomainName;
const merchantDisplayName = window.merchantDisplayName;
const merchantSessionIdentifier = window.merchantSessionIdentifier;
const merchantNonce = window.merchantNonce;
const merchantEpochTimestamp = window.merchantEpochTimestamp;
const merchantSignature = window.merchantSignature;
const merchantCountryCode = window.merchantCountryCode;
const merchantCurrencyCode = window.merchantCurrencyCode;
const merchantSupportedNetworks = window.merchantSupportedNetworks;
const merchantCapabilities = window.merchantCapabilities;
const merchantTotalLabel = window.merchantTotalLabel;
class ApplePay {
  constructor() {
    this.applePay = document.querySelector('.en__field__input.en__field__input--radio[value="applepay"]');
    this._amount = DonationAmount.getInstance();
    this._form = EnForm.getInstance();
    this.checkApplePay();
  }

  checkApplePay() {
    return __awaiter(this, void 0, void 0, function* () {
      const pageform = document.querySelector("form.en__component--page");

      if (!this.applePay || !window.hasOwnProperty('ApplePaySession')) {
        if (engrid_ENGrid.debug) console.log('Apple Pay DISABLED');
        return false;
      }

      const promise = ApplePaySession.canMakePaymentsWithActiveCard(merchantIdentifier);
      let applePayEnabled = false;
      yield promise.then(canMakePayments => {
        applePayEnabled = canMakePayments;

        if (canMakePayments) {
          let input = document.createElement("input");
          input.setAttribute("type", "hidden");
          input.setAttribute("name", "PkPaymentToken");
          input.setAttribute("id", "applePayToken");
          pageform.appendChild(input);

          this._form.onSubmit.subscribe(() => this.onPayClicked());
        }
      });
      if (engrid_ENGrid.debug) console.log('applePayEnabled', applePayEnabled);
      let applePayWrapper = this.applePay.closest('.en__field__item');

      if (applePayEnabled) {
        // Set Apple Pay Class
        applePayWrapper === null || applePayWrapper === void 0 ? void 0 : applePayWrapper.classList.add('applePayWrapper');
      } else {
        // Hide Apple Pay Wrapper
        if (applePayWrapper) applePayWrapper.style.display = 'none';
      }

      return applePayEnabled;
    });
  }

  performValidation(url) {
    return new Promise(function (resolve, reject) {
      var merchantSession = {};
      merchantSession.merchantIdentifier = merchantIdentifier;
      merchantSession.merchantSessionIdentifier = merchantSessionIdentifier;
      merchantSession.nonce = merchantNonce;
      merchantSession.domainName = merchantDomainName;
      merchantSession.epochTimestamp = merchantEpochTimestamp;
      merchantSession.signature = merchantSignature;
      var validationData = "&merchantIdentifier=" + merchantIdentifier + "&merchantDomain=" + merchantDomainName + "&displayName=" + merchantDisplayName;
      var validationUrl = '/ea-dataservice/rest/applepay/validateurl?url=' + url + validationData;
      var xhr = new XMLHttpRequest();

      xhr.onload = function () {
        var data = JSON.parse(this.responseText);
        if (engrid_ENGrid.debug) console.log('Apple Pay Validation', data);
        resolve(data);
      };

      xhr.onerror = reject;
      xhr.open('GET', validationUrl);
      xhr.send();
    });
  }

  log(name, msg) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/ea-dataservice/rest/applepay/log?name=' + name + '&msg=' + msg);
    xhr.send();
  }

  sendPaymentToken(token) {
    return new Promise(function (resolve, reject) {
      resolve(true);
    });
  }

  onPayClicked() {
    const enFieldPaymentType = document.querySelector("#en__field_transaction_paymenttype");
    const applePayToken = document.getElementById("applePayToken");
    const formClass = this._form; // Only work if Payment Type is Apple Pay

    if (enFieldPaymentType.value == 'applepay' && applePayToken.value == '') {
      try {
        let donationAmount = this._amount.amount;
        var request = {
          supportedNetworks: merchantSupportedNetworks,
          merchantCapabilities: merchantCapabilities,
          countryCode: merchantCountryCode,
          currencyCode: merchantCurrencyCode,
          total: {
            label: merchantTotalLabel,
            amount: donationAmount
          }
        };
        var session = new ApplePaySession(1, request);
        var thisClass = this;

        session.onvalidatemerchant = function (event) {
          thisClass.performValidation(event.validationURL).then(function (merchantSession) {
            if (engrid_ENGrid.debug) console.log('Apple Pay merchantSession', merchantSession);
            session.completeMerchantValidation(merchantSession);
          });
        };

        session.onpaymentauthorized = function (event) {
          thisClass.sendPaymentToken(event.payment.token).then(function (success) {
            if (engrid_ENGrid.debug) console.log('Apple Pay Token', event.payment.token);
            document.getElementById("applePayToken").value = JSON.stringify(event.payment.token);
            formClass.submitForm();
          });
        };

        session.oncancel = function (event) {
          if (engrid_ENGrid.debug) console.log('Cancelled', event);
          alert("You cancelled. Sorry it didn't work out.");
          formClass.dispatchError();
        };

        session.begin();
        this._form.submit = false;
        return false;
      } catch (e) {
        alert("Developer mistake: '" + e.message + "'");
        formClass.dispatchError();
      }
    }

    this._form.submit = true;
    return true;
  }

}
;// CONCATENATED MODULE: ../engrid-scripts/packages/common/dist/capitalize-fields.js


class CapitalizeFields {
  constructor() {
    this._form = EnForm.getInstance();

    this._form.onSubmit.subscribe(() => this.capitalizeFields('en__field_supporter_firstName', 'en__field_supporter_lastName', 'en__field_supporter_address1', 'en__field_supporter_city'));
  }

  capitalizeFields(...fields) {
    fields.forEach(f => this.capitalize(f));
  }

  capitalize(f) {
    let field = document.getElementById(f);

    if (field) {
      field.value = field.value.replace(/\w\S*/g, w => w.replace(/^\w/, c => c.toUpperCase()));
      if (engrid_ENGrid.debug) console.log('Capitalized', field.value);
    }

    return true;
  }

}
;// CONCATENATED MODULE: ../engrid-scripts/packages/common/dist/click-to-expand.js
// Depends on engrid-click-to-expand.scss to work
 // Works when the user has adds ".click-to-expand" as a class to any field

class ClickToExpand {
  constructor() {
    this.clickToExpandWrapper = document.querySelectorAll('div.click-to-expand');

    if (this.clickToExpandWrapper.length) {
      this.clickToExpandWrapper.forEach(element => {
        const content = element.innerHTML;
        const wrapper_html = '<div class="click-to-expand-cta"></div><div class="click-to-expand-text-wrapper" tabindex="0">' + content + '</div>';
        element.innerHTML = wrapper_html;
        element.addEventListener("click", event => {
          if (event) {
            if (engrid_ENGrid.debug) console.log("A click-to-expand div was clicked");
            element.classList.add("expanded");
          }
        });
        element.addEventListener("keydown", event => {
          if (event.key === 'Enter') {
            if (engrid_ENGrid.debug) console.log("A click-to-expand div had the 'Enter' key pressed on it");
            element.classList.add("expanded");
          } else if (event.key === ' ') {
            if (engrid_ENGrid.debug) console.log("A click-to-expand div had the 'Spacebar' key pressed on it");
            element.classList.add("expanded");
            event.preventDefault(); // Prevents the page from scrolling

            event.stopPropagation(); // Prevent a console error generated by LastPass https://github.com/KillerCodeMonkey/ngx-quill/issues/351#issuecomment-476017960
          }
        });
      });
    }
  }

}
;// CONCATENATED MODULE: ../engrid-scripts/packages/common/dist/custom-methods.js
const body = document.body;
const enGrid = document.getElementById("engrid");
const enInput = (() => {
  /* @TODO */

  /************************************
   * Globablly Scoped Constants and Variables
   ***********************************/
  // @TODO Needs to be expanded to bind other EN elements (checkbox, radio) and compound elements (split-text, split-select, select with other input, etc...)
  // @TODO A "Not" condition is needed for #en__field_transaction_email because someone could name their email opt in "Email" and it will get the .en_field--email class generated for it
  // get DOM elements
  const init = () => {
    const formInput = document.querySelectorAll(".en__field--text, .en__field--email:not(.en__field--checkbox), .en__field--telephone, .en__field--number, .en__field--textarea, .en__field--select, .en__field--checkbox");
    const otherInputs = document.querySelectorAll(".en__field__input--other");
    Array.from(formInput).forEach(e => {
      // @TODO Currently checkboxes always return as having a value, since they do but they're just not checked. Need to update and account for that, should also do Radio's while we're at it
      let element = e.querySelector("input, textarea, select");

      if (element && element.value) {
        e.classList.add("has-value");
      }

      bindEvents(e);
    });
    /* @TODO Review Engaging Networks to see if this is still needed */

    /************************************
     * Automatically select other radio input when an amount is entered into it.
     ***********************************/

    Array.from(otherInputs).forEach(e => {
      ["focus", "input"].forEach(evt => {
        e.addEventListener(evt, ev => {
          const target = ev.target;

          if (target && target.parentNode && target.parentNode.parentNode) {
            const targetWrapper = target.parentNode;
            targetWrapper.classList.remove("en__field__item--hidden");

            if (targetWrapper.parentNode) {
              const lastRadioInput = targetWrapper.parentNode.querySelector(".en__field__item:nth-last-child(2) input");
              lastRadioInput.checked = !0;
            }
          }
        }, false);
      });
    });
  };

  return {
    init: init
  };
})();
const bindEvents = e => {
  /* @TODO */

  /************************************
   * INPUT, TEXTAREA, AND SELECT ACTIVITY CLASSES (FOCUS AND BLUR)
   * NOTE: STILL NEEDS WORK TO FUNCTION ON "SPLIT" CUSTOM EN FIELDS
   * REF: https://developer.mozilla.org/en-US/docs/Web/API/Element/blur_event
   ***********************************/
  // Occurs when an input field gets focus
  const handleFocus = e => {
    const target = e.target;

    if (target && target.parentNode && target.parentNode.parentNode) {
      const targetWrapper = target.parentNode.parentNode;
      targetWrapper.classList.add("has-focus");
    }
  }; // Occurs when a user leaves an input field


  const handleBlur = e => {
    const target = e.target;

    if (target && target.parentNode && target.parentNode.parentNode) {
      const targetWrapper = target.parentNode.parentNode;
      targetWrapper.classList.remove("has-focus");

      if (target.value) {
        targetWrapper.classList.add("has-value");
      } else {
        targetWrapper.classList.remove("has-value");
      }
    }
  }; // Occurs when a user changes the selected option of a <select> element


  const handleChange = e => {
    const target = e.target;

    if (target && target.parentNode && target.parentNode.parentNode) {
      const targetWrapper = target.parentNode.parentNode;
      targetWrapper.classList.add("has-value");
    }
  }; // Occurs when a text or textarea element gets user input


  const handleInput = e => {
    const target = e.target;

    if (target && target.parentNode && target.parentNode.parentNode) {
      const targetWrapper = target.parentNode.parentNode;
      targetWrapper.classList.add("has-value");
    }
  }; // Occurs when the web browser autofills a form fields
  // REF: engrid-autofill.scss
  // REF: https://medium.com/@brunn/detecting-autofilled-fields-in-javascript-aed598d25da7


  const onAutoFillStart = e => {
    e.parentNode.parentNode.classList.add("is-autofilled", "has-value");
  };

  const onAutoFillCancel = e => e.parentNode.parentNode.classList.remove("is-autofilled", "has-value");

  const onAnimationStart = e => {
    const target = e.target;
    const animation = e.animationName;

    switch (animation) {
      case "onAutoFillStart":
        return onAutoFillStart(target);

      case "onAutoFillCancel":
        return onAutoFillCancel(target);
    }
  };

  const enField = e.querySelector("input, textarea, select");

  if (enField) {
    enField.addEventListener("focus", handleFocus);
    enField.addEventListener("blur", handleBlur);
    enField.addEventListener("change", handleChange);
    enField.addEventListener("input", handleInput);
    enField.addEventListener("animationstart", onAnimationStart);
  }
};
const removeClassesByPrefix = (el, prefix) => {
  for (var i = el.classList.length - 1; i >= 0; i--) {
    if (el.classList[i].startsWith(prefix)) {
      el.classList.remove(el.classList[i]);
    }
  }
};
const debugBar = () => {
  if (window.location.href.indexOf("debug") != -1 || location.hostname === "localhost" || location.hostname === "127.0.0.1") {
    body.classList.add("debug");

    if (enGrid) {
      enGrid.insertAdjacentHTML("beforebegin", '<span id="debug-bar">' + '<span id="info-wrapper">' + "<span>DEBUG BAR</span>" + "</span>" + '<span id="buttons-wrapper">' + '<span id="debug-close">X</span>' + "</span>" + "</span>");
    }

    if (window.location.search.indexOf("mode=DEMO") > -1) {
      const infoWrapper = document.getElementById("info-wrapper");
      const buttonsWrapper = document.getElementById("buttons-wrapper");

      if (infoWrapper) {
        // console.log(window.performance);
        const now = new Date().getTime();
        const initialPageLoad = (now - performance.timing.navigationStart) / 1000;
        const domInteractive = initialPageLoad + (now - performance.timing.domInteractive) / 1000;
        infoWrapper.insertAdjacentHTML("beforeend", "<span>Initial Load: " + initialPageLoad + "s</span>" + "<span>DOM Interactive: " + domInteractive + "s</span>");

        if (buttonsWrapper) {
          buttonsWrapper.insertAdjacentHTML("afterbegin", '<button id="layout-toggle" type="button">Layout Toggle</button>' + '<button id="page-edit" type="button">Edit in PageBuilder (BETA)</button>');
        }
      }
    }

    if (window.location.href.indexOf("debug") != -1 || location.hostname === "localhost" || location.hostname === "127.0.0.1") {
      const buttonsWrapper = document.getElementById("buttons-wrapper");

      if (buttonsWrapper) {
        buttonsWrapper.insertAdjacentHTML("afterbegin", '<button id="layout-toggle" type="button">Layout Toggle</button>' + '<button id="fancy-errors-toggle" type="button">Toggle Fancy Errors</button>');
      }
    }

    if (document.getElementById("fancy-errors-toggle")) {
      const debugTemplateButton = document.getElementById("fancy-errors-toggle");

      if (debugTemplateButton) {
        debugTemplateButton.addEventListener("click", function () {
          fancyErrorsToggle();
        }, false);
      }
    }

    if (document.getElementById("layout-toggle")) {
      const debugTemplateButton = document.getElementById("layout-toggle");

      if (debugTemplateButton) {
        debugTemplateButton.addEventListener("click", function () {
          layoutToggle();
        }, false);
      }
    }

    if (document.getElementById("page-edit")) {
      const debugTemplateButton = document.getElementById("page-edit");

      if (debugTemplateButton) {
        debugTemplateButton.addEventListener("click", function () {
          pageEdit();
        }, false);
      }
    }

    if (document.getElementById("debug-close")) {
      const debugTemplateButton = document.getElementById("debug-close");

      if (debugTemplateButton) {
        debugTemplateButton.addEventListener("click", function () {
          debugClose();
        }, false);
      }
    }

    const fancyErrorsToggle = () => {
      if (enGrid) {
        enGrid.classList.toggle("fancy-errors");
      }
    };

    const pageEdit = () => {
      window.location.href = window.location.href + "?edit";
    };

    const layoutToggle = () => {
      if (enGrid) {
        if (enGrid.classList.contains("layout-centercenter1col")) {
          removeClassesByPrefix(enGrid, "layout-");
          enGrid.classList.add("layout-centercenter1col-wide");
        } else if (enGrid.classList.contains("layout-centercenter1col-wide")) {
          removeClassesByPrefix(enGrid, "layout-");
          enGrid.classList.add("layout-centerright1col");
        } else if (enGrid.classList.contains("layout-centerright1col")) {
          removeClassesByPrefix(enGrid, "layout-");
          enGrid.classList.add("layout-centerleft1col");
        } else if (enGrid.classList.contains("layout-centerleft1col")) {
          removeClassesByPrefix(enGrid, "layout-");
          enGrid.classList.add("layout-embedded");
        } else if (enGrid.classList.contains("layout-embedded")) {
          removeClassesByPrefix(enGrid, "layout-");
          enGrid.classList.add("layout-centercenter1col");
        } else {
          console.log("While trying to switch layouts, something unexpected happen.");
        }
      }
    };

    const debugClose = () => {
      body.classList.remove("debug");
      const debugBar = document.getElementById("debug-bar");

      if (debugBar) {
        debugBar.style.display = "none";
      }
    };
  }
};
const inputPlaceholder = () => {
  // FIND ALL COMMON INPUT FIELDS
  let enFieldDonationAmt = document.querySelector(".en__field--donationAmt.en__field--withOther .en__field__input--other");
  let enFieldFirstName = document.querySelector("input#en__field_supporter_firstName");
  let enFieldLastName = document.querySelector("input#en__field_supporter_lastName");
  let enFieldEmailAddress = document.querySelector("input#en__field_supporter_emailAddress");
  let enFieldPhoneNumber = document.querySelector("#inputen__field_supporter_phoneNumber");
  let enFieldPhoneNumber2 = document.querySelector("input#en__field_supporter_phoneNumber2");
  let enFieldCountry = document.querySelector("input#en__field_supporter_country");
  let enFieldAddress1 = document.querySelector("input#en__field_supporter_address1");
  let enFieldAddress2 = document.querySelector("input#en__field_supporter_address2");
  let enFieldCity = document.querySelector("input#en__field_supporter_city"); // let enFieldRegion = document.querySelector("input#en__field_supporter_region") as HTMLInputElement

  let enFieldPostcode = document.querySelector("input#en__field_supporter_postcode");
  let enFieldHonname = document.querySelector("input#en__field_transaction_honname");
  let enFieldInfname = document.querySelector("input#en__field_transaction_infname");
  let enFieldInfemail = document.querySelector("input#en__field_transaction_infemail");
  let enFieldInfcountry = document.querySelector("input#en__field_transaction_infcountry");
  let enFieldInfadd1 = document.querySelector("input#en__field_transaction_infadd1");
  let enFieldInfadd2 = document.querySelector("input#en__field_transaction_infadd2");
  let enFieldInfcity = document.querySelector("input#en__field_transaction_infcity");
  let enFieldInfpostcd = document.querySelector("input#en__field_transaction_infpostcd");
  let enFieldGftrsn = document.querySelector("input#en__field_transaction_gftrsn");
  let enFieldCcnumber = document.querySelector("input#en__field_transaction_ccnumber");
  let enFieldCcexpire = document.querySelector("input#en__field_transaction_ccexpire");
  let enFieldCcvv = document.querySelector("input#en__field_transaction_ccvv");
  let enFieldBankAccountNumber = document.querySelector("input#en__field_supporter_bankAccountNumber");
  let enFieldBankRoutingNumber = document.querySelector("input#en__field_supporter_bankRoutingNumber"); // CHANGE FIELD INPUT TYPES

  if (enFieldDonationAmt) {
    enFieldDonationAmt.setAttribute("inputmode", "numeric");
  } // ADD FIELD PLACEHOLDERS


  const enAddInputPlaceholder = document.querySelector("[data-engrid-add-input-placeholders]");

  if (enAddInputPlaceholder && enFieldDonationAmt) {
    enFieldDonationAmt.placeholder = "Other Amount";
  }

  if (enAddInputPlaceholder && enFieldFirstName) {
    enFieldFirstName.placeholder = "First Name";
  }

  if (enAddInputPlaceholder && enFieldLastName) {
    enFieldLastName.placeholder = "Last Name";
  }

  if (enAddInputPlaceholder && enFieldEmailAddress) {
    enFieldEmailAddress.placeholder = "Email Address";
  }

  if (enAddInputPlaceholder && enFieldPhoneNumber) {
    enFieldPhoneNumber.placeholder = "Phone Number";
  }

  if (enAddInputPlaceholder && enFieldPhoneNumber2) {
    enFieldPhoneNumber2.placeholder = "000-000-0000 (Optional)";
  }

  if (enAddInputPlaceholder && enFieldCountry) {
    enFieldCountry.placeholder = "Country";
  }

  if (enAddInputPlaceholder && enFieldAddress1) {
    enFieldAddress1.placeholder = "Street Address";
  }

  if (enAddInputPlaceholder && enFieldAddress2) {
    enFieldAddress2.placeholder = "Apt., ste., bldg.";
  }

  if (enAddInputPlaceholder && enFieldCity) {
    enFieldCity.placeholder = "City";
  } // if (enAddInputPlaceholder && enFieldRegion){enFieldRegion.placeholder = "TBD";}


  if (enAddInputPlaceholder && enFieldPostcode) {
    enFieldPostcode.placeholder = "Postal Code";
  }

  if (enAddInputPlaceholder && enFieldHonname) {
    enFieldHonname.placeholder = "Honoree Name";
  }

  if (enAddInputPlaceholder && enFieldInfname) {
    enFieldInfname.placeholder = "Recipient Name";
  }

  if (enAddInputPlaceholder && enFieldInfemail) {
    enFieldInfemail.placeholder = "Recipient Email Address";
  }

  if (enAddInputPlaceholder && enFieldInfcountry) {
    enFieldInfcountry.placeholder = "TBD";
  }

  if (enAddInputPlaceholder && enFieldInfadd1) {
    enFieldInfadd1.placeholder = "Recipient Street Address";
  }

  if (enAddInputPlaceholder && enFieldInfadd2) {
    enFieldInfadd2.placeholder = "Recipient Apt., ste., bldg.";
  }

  if (enAddInputPlaceholder && enFieldInfcity) {
    enFieldInfcity.placeholder = "Recipient City";
  }

  if (enAddInputPlaceholder && enFieldInfpostcd) {
    enFieldInfpostcd.placeholder = "Recipient Postal Code";
  }

  if (enAddInputPlaceholder && enFieldGftrsn) {
    enFieldGftrsn.placeholder = "Reason for your gift";
  }

  if (enAddInputPlaceholder && enFieldCcnumber) {
    enFieldCcnumber.placeholder = "•••• •••• •••• ••••";
  }

  if (enAddInputPlaceholder && enFieldCcexpire) {
    enFieldCcexpire.placeholder = "MM / YY";
  }

  if (enAddInputPlaceholder && enFieldCcvv) {
    enFieldCcvv.placeholder = "CVV";
  }

  if (enAddInputPlaceholder && enFieldBankAccountNumber) {
    enFieldBankAccountNumber.placeholder = "Bank Account Number";
  }

  if (enAddInputPlaceholder && enFieldBankRoutingNumber) {
    enFieldBankRoutingNumber.placeholder = "Bank Routing Number";
  }
};
const watchInmemField = () => {
  const enFieldTransactionInmem = document.getElementById("en__field_transaction_inmem");

  const handleEnFieldTransactionInmemChange = e => {
    if (enGrid) {
      if (enFieldTransactionInmem.checked) {
        enGrid.classList.add("has-give-in-honor");
      } else {
        enGrid.classList.remove("has-give-in-honor");
      }
    }
  }; // Check Give In Honor State on Page Load


  if (enFieldTransactionInmem && enGrid) {
    // Run on page load
    if (enFieldTransactionInmem.checked) {
      enGrid.classList.add("has-give-in-honor");
    } else {
      enGrid.classList.remove("has-give-in-honor");
    } // Run on change


    enFieldTransactionInmem.addEventListener("change", handleEnFieldTransactionInmemChange);
  }
}; // @TODO Refactor (low priority)

const watchGiveBySelectField = () => {
  const enFieldGiveBySelect = document.querySelector(".en__field--give-by-select");
  const transactionGiveBySelect = document.getElementsByName("transaction.giveBySelect");
  const enFieldPaymentType = document.querySelector("#en__field_transaction_paymenttype");
  let enFieldGiveBySelectCurrentValue = document.querySelector('input[name="transaction.giveBySelect"]:checked');
  const prefix = "has-give-by-";

  const handleEnFieldGiveBySelect = e => {
    enFieldGiveBySelectCurrentValue = document.querySelector('input[name="transaction.giveBySelect"]:checked');
    console.log("enFieldGiveBySelectCurrentValue:", enFieldGiveBySelectCurrentValue);

    if (enFieldGiveBySelectCurrentValue && enFieldGiveBySelectCurrentValue.value.toLowerCase() == "card") {
      if (enGrid) {
        removeClassesByPrefix(enGrid, prefix);
        enGrid.classList.add("has-give-by-card");
      } // enFieldPaymentType.value = "card";


      handleCCUpdate();
    } else if (enFieldGiveBySelectCurrentValue && enFieldGiveBySelectCurrentValue.value.toLowerCase() == "ach") {
      if (enGrid) {
        removeClassesByPrefix(enGrid, prefix);
        enGrid.classList.add("has-give-by-ach");
      }

      enFieldPaymentType.value = "ach";
      enFieldPaymentType.value = "ACH";
    } else if (enFieldGiveBySelectCurrentValue && enFieldGiveBySelectCurrentValue.value.toLowerCase() == "paypal") {
      if (enGrid) {
        removeClassesByPrefix(enGrid, prefix);
        enGrid.classList.add("has-give-by-paypal");
      }

      enFieldPaymentType.value = "paypal";
    } else if (enFieldGiveBySelectCurrentValue && enFieldGiveBySelectCurrentValue.value.toLowerCase() == "applepay") {
      if (enGrid) {
        removeClassesByPrefix(enGrid, prefix);
        enGrid.classList.add("has-give-by-applepay");
      }

      enFieldPaymentType.value = "applepay";
    }
  }; // Check Giving Frequency on page load


  if (enFieldGiveBySelect) {
    enFieldGiveBySelectCurrentValue = document.querySelector('input[name="transaction.giveBySelect"]:checked');

    if (enFieldGiveBySelectCurrentValue && enFieldGiveBySelectCurrentValue.value.toLowerCase() == "card") {
      if (enGrid) {
        removeClassesByPrefix(enGrid, prefix);
        enGrid.classList.add("has-give-by-card");
      } // enFieldPaymentType.value = "card";


      handleCCUpdate();
    } else if (enFieldGiveBySelectCurrentValue && enFieldGiveBySelectCurrentValue.value.toLowerCase() == "ach") {
      if (enGrid) {
        removeClassesByPrefix(enGrid, prefix);
        enGrid.classList.add("has-give-by-check");
      }

      enFieldPaymentType.value = "ach";
      enFieldPaymentType.value = "ACH";
    } else if (enFieldGiveBySelectCurrentValue && enFieldGiveBySelectCurrentValue.value.toLowerCase() == "paypal") {
      if (enGrid) {
        removeClassesByPrefix(enGrid, prefix);
        enGrid.classList.add("has-give-by-paypal");
      }

      enFieldPaymentType.value = "paypal";
      enFieldPaymentType.value = "Paypal";
    } else if (enFieldGiveBySelectCurrentValue && enFieldGiveBySelectCurrentValue.value.toLowerCase() == "applepay") {
      if (enGrid) {
        removeClassesByPrefix(enGrid, prefix);
        enGrid.classList.add("has-give-by-applepay");
      }

      enFieldPaymentType.value = "applepay";
    }
  } // Watch each Giving Frequency radio input for a change


  if (transactionGiveBySelect) {
    Array.from(transactionGiveBySelect).forEach(e => {
      let element = e;
      element.addEventListener("change", handleEnFieldGiveBySelect);
    });
  }
};
/*
 * Input fields as reference variables
 */

const field_credit_card = document.getElementById("en__field_transaction_ccnumber");
const field_payment_type = document.getElementById("en__field_transaction_paymenttype");
let field_expiration_parts = document.querySelectorAll(".en__field--ccexpire .en__field__input--splitselect");
const field_country = document.getElementById("en__field_supporter_country");
let field_expiration_month = field_expiration_parts[0];
let field_expiration_year = field_expiration_parts[1];
/* The Donation Other Giving Amount is a "Number" type input field.
   It also has its step value set to .01 so it increments up/down by once whole cent.
   This step also client-side prevents users from entering a fraction of a penny.
   And it has a min set to 5 so nothing less can be submitted
*/

const SetEnFieldOtherAmountRadioStepValue = () => {
  const enFieldOtherAmountRadio = document.querySelector(".en__field--donationAmt .en__field__input--other");

  if (enFieldOtherAmountRadio) {
    enFieldOtherAmountRadio.setAttribute("step", ".01");
    enFieldOtherAmountRadio.setAttribute("type", "number");
    enFieldOtherAmountRadio.setAttribute("min", "5");
  }
};
/*
 * Helpers
 */
// current_month and current_year used by handleExpUpdate()

let d = new Date();
var current_month = d.getMonth() + 1; // month options in expiration dropdown are indexed from 1

var current_year = d.getFullYear() - 2000; // getCardType used by handleCCUpdate()

const getCardType = cc_partial => {
  let key_character = cc_partial.charAt(0);
  const prefix = "live-card-type-";
  const field_credit_card_classes = field_credit_card.className.split(" ").filter(c => !c.startsWith(prefix));

  switch (key_character) {
    case "0":
      field_credit_card.className = field_credit_card_classes.join(" ").trim();
      field_credit_card.classList.add("live-card-type-invalid");
      return false;

    case "1":
      field_credit_card.className = field_credit_card_classes.join(" ").trim();
      field_credit_card.classList.add("live-card-type-invalid");
      return false;

    case "2":
      field_credit_card.className = field_credit_card_classes.join(" ").trim();
      field_credit_card.classList.add("live-card-type-invalid");
      return false;

    case "3":
      field_credit_card.className = field_credit_card_classes.join(" ").trim();
      field_credit_card.classList.add("live-card-type-amex");
      return "amex";

    case "4":
      field_credit_card.className = field_credit_card_classes.join(" ").trim();
      field_credit_card.classList.add("live-card-type-visa");
      return "visa";

    case "5":
      field_credit_card.className = field_credit_card_classes.join(" ").trim();
      field_credit_card.classList.add("live-card-type-mastercard");
      return "mastercard";

    case "6":
      field_credit_card.className = field_credit_card_classes.join(" ").trim();
      field_credit_card.classList.add("live-card-type-discover");
      return "discover";

    case "7":
      field_credit_card.className = field_credit_card_classes.join(" ").trim();
      field_credit_card.classList.add("live-card-type-invalid");
      return false;

    case "8":
      field_credit_card.className = field_credit_card_classes.join(" ").trim();
      field_credit_card.classList.add("live-card-type-invalid");
      return false;

    case "9":
      field_credit_card.className = field_credit_card_classes.join(" ").trim();
      field_credit_card.classList.add("live-card-type-invalid");
      return false;

    default:
      field_credit_card.className = field_credit_card_classes.join(" ").trim();
      field_credit_card.classList.add("live-card-type-na");
      return false;
  }
};
/*
 * Handlers
 */


const handleCCUpdate = () => {
  const card_type = getCardType(field_credit_card.value);
  const card_values = {
    amex: ['amex', 'american express', 'americanexpress', 'amx', 'ax'],
    visa: ['visa', 'vi'],
    mastercard: ['mastercard', 'master card', 'mc'],
    discover: ['discover', 'di']
  };
  const payment_text = field_payment_type.options[field_payment_type.selectedIndex].text;

  if (card_type && payment_text != card_type) {
    field_payment_type.value = Array.from(field_payment_type.options).filter(d => card_values[card_type].includes(d.value.toLowerCase()))[0].value;
  }
};

const handleExpUpdate = e => {
  // handle if year is changed to current year (disable all months less than current month)
  // handle if month is changed to less than current month (disable current year)
  if (e == "month") {
    let selected_month = parseInt(field_expiration_month.value);
    let disable = selected_month < current_month;
    console.log("month disable", disable, typeof disable, selected_month, current_month);

    for (let i = 0; i < field_expiration_year.options.length; i++) {
      // disable or enable current year
      if (parseInt(field_expiration_year.options[i].value) <= current_year) {
        if (disable) {
          //@TODO Couldn't get working in TypeScript
          field_expiration_year.options[i].setAttribute("disabled", "disabled");
        } else {
          field_expiration_year.options[i].disabled = false;
        }
      }
    }
  } else if (e == "year") {
    let selected_year = parseInt(field_expiration_year.value);
    let disable = selected_year == current_year;
    console.log("year disable", disable, typeof disable, selected_year, current_year);

    for (let i = 0; i < field_expiration_month.options.length; i++) {
      // disable or enable all months less than current month
      if (parseInt(field_expiration_month.options[i].value) < current_month) {
        if (disable) {
          //@TODO Couldn't get working in TypeScript
          field_expiration_month.options[i].setAttribute("disabled", "disabled");
        } else {
          field_expiration_month.options[i].disabled = false;
        }
      }
    }
  }
};
/*
 * Event Listeners
 */


if (field_credit_card) {
  field_credit_card.addEventListener("keyup", function () {
    handleCCUpdate();
  });
  field_credit_card.addEventListener("paste", function () {
    handleCCUpdate();
  });
  field_credit_card.addEventListener("blur", function () {
    handleCCUpdate();
  });
}

if (field_expiration_month && field_expiration_year) {
  field_expiration_month.addEventListener("change", function () {
    handleExpUpdate("month");
  });
  field_expiration_year.addEventListener("change", function () {
    handleExpUpdate("year");
  });
} // EN Polyfill to support "label" clicking on Advocacy Recipient "labels"


const contactDetailLabels = () => {
  const contact = document.querySelectorAll(".en__contactDetails__rows"); // @TODO Needs refactoring. Has to be a better way to do this.

  const recipientChange = e => {
    let recipientRow = e.target; // console.log("recipientChange: recipientRow: ", recipientRow);

    let recipientRowWrapper = recipientRow.parentNode; // console.log("recipientChange: recipientRowWrapper: ", recipientRowWrapper);

    let recipientRowsWrapper = recipientRowWrapper.parentNode; // console.log("recipientChange: recipientRowsWrapper: ", recipientRowsWrapper);

    let contactDetails = recipientRowsWrapper.parentNode; // console.log("recipientChange: contactDetails: ", contactDetails);

    let contactDetailsCheckbox = contactDetails.querySelector("input"); // console.log("recipientChange: contactDetailsCheckbox: ", contactDetailsCheckbox);

    if (contactDetailsCheckbox.checked) {
      contactDetailsCheckbox.checked = false;
    } else {
      contactDetailsCheckbox.checked = true;
    }
  };

  if (contact) {
    Array.from(contact).forEach(e => {
      let element = e;
      element.addEventListener("click", recipientChange);
    });
  }
}; // @TODO Adds a URL path "/edit" that can be used to easily arrive at the editable version of the current page. Should automatically detect if the client is using us.e-activist or e-activist and adjust accoridngly. Should also pass in page number and work for all page types without each needing to be specified.
// @TODO Remove hard coded client values

const easyEdit = () => {
  const liveURL = window.location.href;
  let editURL = "";

  if (liveURL.search("edit") !== -1) {
    if (liveURL.includes("https://act.ran.org/page/")) {
      editURL = liveURL.replace("https://act.ran.org/page/", "https://us.e-activist.com/index.html#pages/");
      editURL = editURL.replace("/donate/1", "/edit");
      editURL = editURL.replace("/action/1", "/edit");
      editURL = editURL.replace("/data/1", "/edit");
      window.location.href = editURL;
    }
  }
}; // If you go to and Engaging Networks Unsubscribe page anonymously
// then the fields are in their default states. If you go to it via an email
// link that authenticates who you are, it then populates the fields with corresponding
// values from your account. This means to unsubscribe the user has to uncheck the
// newsletter checkbox(s) before submitting.

const simpleUnsubscribe = () => {
  // console.log("simpleUnsubscribe fired");
  // Check if we're on an Unsubscribe / Manage Subscriptions page
  if (window.location.href.indexOf("/subscriptions") != -1) {
    // console.log("On an subscription management page");
    // Check if any form elements on this page have the "forceUncheck" class
    const forceUncheck = document.querySelectorAll(".forceUncheck");

    if (forceUncheck) {
      // console.log("Found forceUnchecl dom elements", forceUncheck);
      // Step through each DOM element with forceUncheck looking for checkboxes
      Array.from(forceUncheck).forEach(e => {
        let element = e; // console.log("Checking this formComponent for checkboxes", element);
        // In the forceUncheck form component, find any checboxes

        let uncheckCheckbox = element.querySelectorAll("input[type='checkbox']");

        if (uncheckCheckbox) {
          // Step through each Checkbox in the forceUncheck form component
          Array.from(uncheckCheckbox).forEach(f => {
            let checkbox = f; // console.log("Unchecking this checkbox", checkbox);
            // Uncheck the checbox

            checkbox.checked = false;
          });
        }
      });
    }
  }
}; // Watch the Region Field for changes. If there is only one option, hide it.
// @TODO Should this be expanded where if a select only has one option it's always hidden?

const country_select = document.getElementById("en__field_supporter_country");
const region_select = document.getElementById("en__field_supporter_region");

if (country_select) {
  country_select.addEventListener("change", () => {
    setTimeout(() => {
      if (region_select.options.length == 1 && region_select.options[0].value == "other") {
        region_select.classList.add("hide");
      } else {
        region_select.classList.remove("hide");
      }
    }, 100);
  });
} // @TODO "Footer in Viewport Check" should be made its own TS file


const contentFooter = document.querySelector(".content-footer");

const isInViewport = e => {
  const distance = e.getBoundingClientRect(); // console.log("Footer: ", distance);

  return distance.top >= 0 && distance.left >= 0 && distance.bottom <= (window.innerHeight || document.documentElement.clientHeight) && distance.right <= (window.innerWidth || document.documentElement.clientWidth);
}; // Checks to see if the page is so short, the footer is above the fold. If the footer is above the folde we'll use this class to ensure at a minimum the page fills the full viewport height.


if (contentFooter && isInViewport(contentFooter)) {
  document.getElementsByTagName("BODY")[0].setAttribute("data-engrid-footer-above-fold", "");
} else {
  document.getElementsByTagName("BODY")[0].setAttribute("data-engrid-footer-below-fold", "");
}
;// CONCATENATED MODULE: ../engrid-scripts/packages/common/dist/cookie.js
/**
Example:
import * as cookie from "./cookie";

cookie.set('name', 'value');
cookie.get('name'); // => 'value'
cookie.remove('name');
cookie.set('name', 'value', { expires: 7 }); // 7 Days cookie
cookie.set('name', 'value', { expires: 7, path: '' }); // Set Path
cookie.remove('name', { path: '' });
 */
function stringifyAttribute(name, value) {
  if (!value) {
    return "";
  }

  let stringified = "; " + name;

  if (value === true) {
    return stringified; // boolean attributes shouldn't have a value
  }

  return stringified + "=" + value;
}

function stringifyAttributes(attributes) {
  if (typeof attributes.expires === "number") {
    let expires = new Date();
    expires.setMilliseconds(expires.getMilliseconds() + attributes.expires * 864e5);
    attributes.expires = expires;
  }

  return stringifyAttribute("Expires", attributes.expires ? attributes.expires.toUTCString() : "") + stringifyAttribute("Domain", attributes.domain) + stringifyAttribute("Path", attributes.path) + stringifyAttribute("Secure", attributes.secure) + stringifyAttribute("SameSite", attributes.sameSite);
}

function encode(name, value, attributes) {
  return encodeURIComponent(name).replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent) // allowed special characters
  .replace(/\(/g, "%28").replace(/\)/g, "%29") + // replace opening and closing parens
  "=" + encodeURIComponent(value) // allowed special characters
  .replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent) + stringifyAttributes(attributes);
}
function parse(cookieString) {
  let result = {};
  let cookies = cookieString ? cookieString.split("; ") : [];
  let rdecode = /(%[\dA-F]{2})+/gi;

  for (let i = 0; i < cookies.length; i++) {
    let parts = cookies[i].split("=");
    let cookie = parts.slice(1).join("=");

    if (cookie.charAt(0) === '"') {
      cookie = cookie.slice(1, -1);
    }

    try {
      let name = parts[0].replace(rdecode, decodeURIComponent);
      result[name] = cookie.replace(rdecode, decodeURIComponent);
    } catch (e) {// ignore cookies with invalid name/value encoding
    }
  }

  return result;
}
function getAll() {
  return parse(document.cookie);
}
function get(name) {
  return getAll()[name];
}
function set(name, value, attributes) {
  document.cookie = encode(name, value, Object.assign({
    path: "/"
  }, attributes));
}
function remove(name, attributes) {
  set(name, "", Object.assign(Object.assign({}, attributes), {
    expires: -1
  }));
}
;// CONCATENATED MODULE: ../engrid-scripts/packages/common/dist/ie.js

class IE {
  constructor() {
    this.debug = false;
    this.overlay = document.createElement("div");

    const isIE = () => {
      return navigator.userAgent.indexOf('MSIE') !== -1 || navigator.appVersion.indexOf('Trident/') > -1;
    }; // If it's not IE, get out!


    if (!isIE()) return;
    const markup = `
    <div class="ieModal-container">
        <a href="#" class="button-close"></a>
        <div id="ieModalContent">
        <strong>Attention: </strong>
        Your browser is no longer supported and will not receive any further security updates. Websites may no longer display or behave correctly as they have in the past. 
        Please transition to using <a href="https://www.microsoft.com/edge">Microsoft Edge</a>, Microsoft's latest browser, to continue enjoying the modern web.
        </div>
    </div>`;
    let overlay = document.createElement("div");
    overlay.id = "ieModal";
    overlay.classList.add("is-hidden");
    overlay.innerHTML = markup;
    const closeButton = overlay.querySelector(".button-close");
    closeButton.addEventListener("click", this.close.bind(this));
    document.addEventListener("keyup", e => {
      if (e.key === "Escape") {
        closeButton.click();
      }
    });
    this.overlay = overlay;
    document.body.appendChild(overlay);
    this.open();
  }

  open() {
    const hideModal = get("hide_ieModal"); // Get cookie
    // If we have a cookie AND no Debug, get out

    if (hideModal && !this.debug) return; // Show Modal

    this.overlay.classList.remove("is-hidden");
  }

  close(e) {
    e.preventDefault();
    set("hide_ieModal", "1", {
      expires: 1
    }); // Create one day cookie

    this.overlay.classList.add("is-hidden");
  }

}
;// CONCATENATED MODULE: ../engrid-scripts/packages/common/dist/iframe.js

const sendIframeHeight = () => {
  let height = document.body.offsetHeight;
  console.log("Sending iFrame height of: ", height, "px"); // check the message is being sent correctly

  window.parent.postMessage({
    frameHeight: height,
    pageNumber: engrid_ENGrid.getPageNumber(),
    pageCount: engrid_ENGrid.getPageCount(),
    giftProcess: engrid_ENGrid.getGiftProcess()
  }, "*");
};
const sendIframeFormStatus = status => {
  window.parent.postMessage({
    status: status,
    pageNumber: engrid_ENGrid.getPageNumber(),
    pageCount: engrid_ENGrid.getPageCount(),
    giftProcess: engrid_ENGrid.getGiftProcess()
  }, "*");
};
;// CONCATENATED MODULE: ../engrid-scripts/packages/common/dist/media-attribution.js
/*
  Looks for specially crafted <img> links and will transform its markup to display an attribution overlay on top of the image
  Depends on "_engrid-media-attribution.scss" for styling
  
  Example Image Input
  <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAABCAQAAABeK7cBAAAADUlEQVR42mO8/5+BAQAGgwHgbKwW2QAAAABJRU5ErkJggg==" data-src="https://via.placeholder.com/300x300" data-attribution-source="© Jane Doe 1">
  <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAABCAQAAABeK7cBAAAADUlEQVR42mO8/5+BAQAGgwHgbKwW2QAAAABJRU5ErkJggg==" data-src="https://via.placeholder.com/300x300" data-attribution-source="© John Doe 2" data-attribution-source-link="https://www.google.com/">
  <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAABCAQAAABeK7cBAAAADUlEQVR42mO8/5+BAQAGgwHgbKwW2QAAAABJRU5ErkJggg==" data-src="https://via.placeholder.com/300x300" data-attribution-source="© Max Doe 3" data-attribution-source-link="https://www.google.com/" data-attribution-hide-overlay>

  Example Video Input (Doesn't currently visually display)
  @TODO Video tags are processed but their <figcaption> is not visually displayed. Need to update "_engrid-media-attribution.scss"
  <video poster="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAABCAQAAABeK7cBAAAADUlEQVR42mO8/5+BAQAGgwHgbKwW2QAAAABJRU5ErkJggg==" data-attribution-source="© Jane Doe 1" data-attribution-source-link="https://www.google.com/"> <source data-src="https://player.vimeo.com/external/123456789.hd.mp4?s=987654321&amp;profile_id=123" type="video/mp4"></video>

  Example Image Output
  <figure class="media-with-attribution"><img src="https://via.placeholder.com/300x300" data-src="https://via.placeholder.com/300x300" data-attribution-source="Jane Doe 1"><figattribution class="attribution-bottomright">Jane Doe 1</figattribution></figure>
*/

class MediaAttribution {
  constructor() {
    // Find all images with attribution but not with the "data-attribution-hide-overlay" attribute
    this.mediaWithAttribution = document.querySelectorAll("img[data-attribution-source]:not([data-attribution-hide-overlay]), video[data-attribution-source]:not([data-attribution-hide-overlay])");
    this.mediaWithAttribution.forEach(element => {
      if (engrid_ENGrid.debug) console.log("The following image was found with data attribution fields on it. It's markup will be changed to add caption support.", element); // Creates the wapping <figure> element

      let figure = document.createElement('figure');
      figure.classList.add("media-with-attribution"); // Moves the <img> inside its <figure> element

      let mediaWithAttributionParent = element.parentNode;

      if (mediaWithAttributionParent) {
        mediaWithAttributionParent.insertBefore(figure, element);
        figure.appendChild(element);
        let mediaWithAttributionElement = element; // Append the <figcaption> element after the <img> and conditionally add the Source's Link to it

        let attributionSource = mediaWithAttributionElement.dataset.attributionSource;

        if (attributionSource) {
          let attributionSourceLink = mediaWithAttributionElement.dataset.attributionSourceLink;

          if (attributionSourceLink) {
            mediaWithAttributionElement.insertAdjacentHTML('afterend', '<figattribution><a href="' + decodeURIComponent(attributionSourceLink) + '" target="_blank" tabindex="-1">' + attributionSource + '</a></figure>');
          } else {
            mediaWithAttributionElement.insertAdjacentHTML('afterend', '<figattribution>' + attributionSource + '</figure>');
          }
        }
      }
    });
  }

}
;// CONCATENATED MODULE: ../engrid-scripts/packages/common/dist/live-variables.js


class LiveVariables {
  constructor(options) {
    var _a;

    this._amount = DonationAmount.getInstance();
    this._fees = ProcessingFees.getInstance();
    this._frequency = DonationFrequency.getInstance();
    this._form = EnForm.getInstance();
    this.multiplier = 1 / 12;
    this.options = Object.assign(Object.assign({}, OptionsDefaults), options);
    this.submitLabel = ((_a = document.querySelector(".en__submit button")) === null || _a === void 0 ? void 0 : _a.innerHTML) || "Donate";

    this._amount.onAmountChange.subscribe(() => this.changeSubmitButton());

    this._amount.onAmountChange.subscribe(() => this.changeLiveAmount());

    this._amount.onAmountChange.subscribe(() => this.changeLiveUpsellAmount());

    this._fees.onFeeChange.subscribe(() => this.changeLiveAmount());

    this._fees.onFeeChange.subscribe(() => this.changeLiveUpsellAmount());

    this._fees.onFeeChange.subscribe(() => this.changeSubmitButton());

    this._frequency.onFrequencyChange.subscribe(() => this.swapAmounts());

    this._frequency.onFrequencyChange.subscribe(() => this.changeLiveFrequency());

    this._frequency.onFrequencyChange.subscribe(() => this.changeRecurrency());

    this._frequency.onFrequencyChange.subscribe(() => this.changeSubmitButton());

    this._form.onSubmit.subscribe(() => this.loadingSubmitButton());

    this._form.onError.subscribe(() => this.changeSubmitButton()); // Watch the monthly-upsell links


    document.addEventListener("click", e => {
      const element = e.target;

      if (element) {
        if (element.classList.contains("monthly-upsell")) {
          this.upsold(e);
        } else if (element.classList.contains("form-submit")) {
          e.preventDefault();

          this._form.submitForm();
        }
      }
    });
  }

  getAmountTxt(amount = 0) {
    var _a, _b;

    const symbol = (_a = this.options.CurrencySymbol) !== null && _a !== void 0 ? _a : '$';
    const separator = (_b = this.options.CurrencySeparator) !== null && _b !== void 0 ? _b : '.';
    const amountTxt = Number.isInteger(amount) ? symbol + amount : symbol + amount.toFixed(2).replace('.', separator);
    return amount > 0 ? amountTxt : "";
  }

  getUpsellAmountTxt(amount = 0) {
    const amountTxt = this.options.CurrencySymbol + Math.ceil(amount / 5) * 5;
    return amount > 0 ? amountTxt : "";
  }

  getUpsellAmountRaw(amount = 0) {
    const amountRaw = Math.ceil(amount / 5) * 5;
    return amount > 0 ? amountRaw.toString() : "";
  }

  changeSubmitButton() {
    const submit = document.querySelector(".en__submit button");
    const amount = this.getAmountTxt(this._amount.amount + this._fees.fee);
    const frequency = this._frequency.frequency == "onetime" ? "" : this._frequency.frequency == "annual" ? "annually" : this._frequency.frequency;
    let label = this.submitLabel;

    if (amount) {
      label = label.replace("$AMOUNT", amount);
      label = label.replace("$FREQUENCY", frequency);
    } else {
      label = label.replace("$AMOUNT", '');
      label = label.replace("$FREQUENCY", '');
    }

    if (submit && label) {
      submit.innerHTML = label;
    }
  }

  loadingSubmitButton() {
    const submit = document.querySelector(".en__submit button");
    let submitButtonOriginalHTML = submit.innerHTML;
    let submitButtonProcessingHTML = "<span class='loader-wrapper'><span class='loader loader-quart'></span><span class='submit-button-text-wrapper'>" + submitButtonOriginalHTML + "</span></span>";
    submitButtonOriginalHTML = submit.innerHTML;
    submit.innerHTML = submitButtonProcessingHTML;
    return true;
  }

  changeLiveAmount() {
    const value = this._amount.amount + this._fees.fee;
    const live_amount = document.querySelectorAll(".live-giving-amount");
    live_amount.forEach(elem => elem.innerHTML = this.getAmountTxt(value));
  }

  changeLiveUpsellAmount() {
    const value = (this._amount.amount + this._fees.fee) * this.multiplier;
    const live_upsell_amount = document.querySelectorAll(".live-giving-upsell-amount");
    live_upsell_amount.forEach(elem => elem.innerHTML = this.getUpsellAmountTxt(value));
    const live_upsell_amount_raw = document.querySelectorAll(".live-giving-upsell-amount-raw");
    live_upsell_amount_raw.forEach(elem => elem.innerHTML = this.getUpsellAmountRaw(value));
  }

  changeLiveFrequency() {
    const live_frequency = document.querySelectorAll(".live-giving-frequency");
    live_frequency.forEach(elem => elem.innerHTML = this._frequency.frequency == "onetime" ? "" : this._frequency.frequency);
  }

  changeRecurrency() {
    const recurrpay = document.querySelector("[name='transaction.recurrpay']");

    if (recurrpay && recurrpay.type != 'radio') {
      recurrpay.value = this._frequency.frequency == 'onetime' ? 'N' : 'Y';
      this._frequency.recurring = recurrpay.value;
      if (engrid_ENGrid.getOption('Debug')) console.log('Recurpay Changed!');
    }
  }

  swapAmounts() {
    if ("EngridAmounts" in window && this._frequency.frequency in window.EngridAmounts) {
      const loadEnAmounts = amountArray => {
        let ret = [];

        for (let amount in amountArray.amounts) {
          ret.push({
            selected: amountArray.amounts[amount] === amountArray.default,
            label: amount,
            value: amountArray.amounts[amount].toString()
          });
        }

        return ret;
      };

      window.EngagingNetworks.require._defined.enjs.swapList("donationAmt", loadEnAmounts(window.EngridAmounts[this._frequency.frequency]), {
        ignoreCurrentValue: !window.EngagingNetworks.require._defined.enjs.checkSubmissionFailed()
      });

      this._amount.load();

      if (engrid_ENGrid.getOption('Debug')) console.log("Amounts Swapped To", window.EngridAmounts[this._frequency.frequency]);
    }
  } // Watch for a clicks on monthly-upsell link


  upsold(e) {
    // Find and select monthly giving
    const enFieldRecurrpay = document.querySelector(".en__field--recurrpay input[value='Y']");

    if (enFieldRecurrpay) {
      enFieldRecurrpay.checked = true;
    } // Find the hidden radio select that needs to be selected when entering an "Other" amount


    const enFieldOtherAmountRadio = document.querySelector(".en__field--donationAmt input[value='other']");

    if (enFieldOtherAmountRadio) {
      enFieldOtherAmountRadio.checked = true;
    } // Enter the other amount and remove the "en__field__item--hidden" class from the input's parent


    const enFieldOtherAmount = document.querySelector("input[name='transaction.donationAmt.other']");

    if (enFieldOtherAmount) {
      enFieldOtherAmount.value = this.getUpsellAmountRaw(this._amount.amount * this.multiplier);

      this._amount.load();

      this._frequency.load();

      if (enFieldOtherAmount.parentElement) {
        enFieldOtherAmount.parentElement.classList.remove("en__field__item--hidden");
      }
    }

    const target = e.target;

    if (target && target.classList.contains("form-submit")) {
      e.preventDefault(); // Form submit

      this._form.submitForm();
    }
  }

}
;// CONCATENATED MODULE: ../engrid-scripts/packages/common/dist/upsell-lightbox.js


class UpsellLightbox {
  constructor() {
    this.overlay = document.createElement("div");
    this._form = EnForm.getInstance();
    this._amount = DonationAmount.getInstance();
    this._frequency = DonationFrequency.getInstance();
    let options = "EngridUpsell" in window ? window.EngridUpsell : {};
    this.options = Object.assign(Object.assign({}, UpsellOptionsDefaults), options);

    if (!this.shouldRun()) {
      if (engrid_ENGrid.debug) console.log("Upsell script should NOT run"); // If we're not on a Donation Page, get out

      return;
    }

    this.overlay.id = "enModal";
    this.overlay.classList.add("is-hidden");
    this.overlay.classList.add("image-" + this.options.imagePosition);
    this.renderLightbox();

    this._form.onSubmit.subscribe(() => this.open());
  }

  renderLightbox() {
    const title = this.options.title.replace("{new-amount}", "<span class='upsell_suggestion'></span>").replace("{old-amount}", "<span class='upsell_amount'></span>");
    const paragraph = this.options.paragraph.replace("{new-amount}", "<span class='upsell_suggestion'></span>").replace("{old-amount}", "<span class='upsell_amount'></span>");
    const yes = this.options.yesLabel.replace("{new-amount}", "<span class='upsell_suggestion'></span>").replace("{old-amount}", "<span class='upsell_amount'></span>");
    const no = this.options.noLabel.replace("{new-amount}", "<span class='upsell_suggestion'></span>").replace("{old-amount}", "<span class='upsell_amount'></span>");
    const markup = `
            <div class="upsellLightboxContainer" id="goMonthly">
              <!-- ideal image size is 480x650 pixels -->
              <div class="background" style="background-image: url('${this.options.image}');"></div>
              <div class="upsellLightboxContent">
              ${this.options.canClose ? `<span id="goMonthlyClose"></span>` : ``}
                <h1>
                  ${title}
                </h1>
                ${this.options.otherAmount ? `
                <p>
                  <span>${this.options.otherLabel}</span>
                  <input href="#" id="secondOtherField" name="secondOtherField" size="12" type="number" inputmode="numeric" step="1" value="">
                </p>
                ` : ``}

                <p>
                  ${paragraph}
                </p>
                <!-- YES BUTTON -->
                <div id="upsellYesButton">
                  <a href="#">
                    <div>
                    <span class='loader-wrapper'><span class='loader loader-quart'></span></span>
                    <span class='label'>${yes}</span>
                    </div>
                  </a>
                </div>
                <!-- NO BUTTON -->
                <div id="upsellNoButton">
                  <button title="Close (Esc)" type="button">
                    <div>
                    <span class='loader-wrapper'><span class='loader loader-quart'></span></span>
                    <span class='label'>${no}</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
            `;
    this.overlay.innerHTML = markup;
    const closeButton = this.overlay.querySelector("#goMonthlyClose");
    const yesButton = this.overlay.querySelector("#upsellYesButton a");
    const noButton = this.overlay.querySelector("#upsellNoButton button");
    yesButton.addEventListener("click", this.continue.bind(this));
    noButton.addEventListener("click", this.continue.bind(this));
    if (closeButton) closeButton.addEventListener("click", this.close.bind(this));
    this.overlay.addEventListener("click", e => {
      if (e.target instanceof Element && e.target.id == this.overlay.id && this.options.canClose) {
        this.close(e);
      }
    });
    document.addEventListener("keyup", e => {
      if (e.key === "Escape" && closeButton) {
        closeButton.click();
      }
    });
    document.body.appendChild(this.overlay);
    const otherField = document.querySelector("#secondOtherField");

    if (otherField) {
      otherField.addEventListener("keyup", this.popupOtherField.bind(this));
    }

    if (engrid_ENGrid.debug) console.log("Upsell script rendered");
  } // Should we run the script?


  shouldRun() {
    // const hideModal = cookie.get("hideUpsell"); // Get cookie
    // if it's a first page of a Donation page
    return (// !hideModal &&
      'EngridUpsell' in window && !!window.pageJson && window.pageJson.pageNumber == 1 && window.pageJson.pageType == "donation"
    );
  }

  popupOtherField() {
    var _a, _b;

    const value = parseFloat((_b = (_a = this.overlay.querySelector("#secondOtherField")) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : "");
    const live_upsell_amount = document.querySelectorAll("#upsellYesButton .upsell_suggestion");

    if (!isNaN(value) && value > 0) {
      live_upsell_amount.forEach(elem => elem.innerHTML = "$" + value.toFixed(2));
    } else {
      live_upsell_amount.forEach(elem => elem.innerHTML = "$" + this.getUpsellAmount().toFixed(2));
    }
  }

  liveAmounts() {
    const live_upsell_amount = document.querySelectorAll(".upsell_suggestion");
    const live_amount = document.querySelectorAll(".upsell_amount");
    const suggestedAmount = this.getUpsellAmount();
    live_upsell_amount.forEach(elem => elem.innerHTML = "$" + suggestedAmount.toFixed(2));
    live_amount.forEach(elem => elem.innerHTML = "$" + this._amount.amount.toFixed(2));
  } // Return the Suggested Upsell Amount


  getUpsellAmount() {
    var _a, _b;

    const amount = this._amount.amount;
    const otherAmount = parseFloat((_b = (_a = this.overlay.querySelector("#secondOtherField")) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : "");

    if (otherAmount > 0) {
      return otherAmount;
    }

    let upsellAmount = 0;

    for (let i = 0; i < this.options.amountRange.length; i++) {
      let val = this.options.amountRange[i];

      if (upsellAmount == 0 && amount <= val.max) {
        upsellAmount = val.suggestion;

        if (typeof upsellAmount !== 'number') {
          const suggestionMath = upsellAmount.replace("amount", amount.toFixed(2));
          upsellAmount = parseFloat(Function('"use strict";return (' + suggestionMath + ')')());
        }

        break;
      }
    }

    return upsellAmount;
  }

  shouldOpen() {
    const freq = this._frequency.frequency;
    const upsellAmount = this.getUpsellAmount(); // If frequency is not onetime or
    // the modal is already opened or
    // there's no suggestion for this donation amount,
    // we should not open

    if (freq == "onetime" && !this.overlay.classList.contains("is-submitting") && upsellAmount > 0) {
      if (engrid_ENGrid.debug) {
        console.log("Upsell Frequency", this._frequency.frequency);
        console.log("Upsell Amount", this._amount.amount);
        console.log("Upsell Suggested Amount", upsellAmount);
      }

      return true;
    }

    return false;
  }

  open() {
    if (engrid_ENGrid.debug) console.log("Upsell Script Triggered");

    if (!this.shouldOpen()) {
      // In the circumstance when the form fails to validate via server-side validation, the page will reload
      // When that happens, we should place the original amount saved in sessionStorage into the upsell original amount field
      let original = window.sessionStorage.getItem('original');

      if (original && document.querySelectorAll('.en__errorList .en__error').length > 0) {
        this.setOriginalAmount(original);
      } // Returning true will give the "go ahead" to submit the form


      this._form.submit = true;
      return true;
    }

    this.liveAmounts();
    this.overlay.classList.remove("is-hidden");
    this._form.submit = false;
    return false;
  } // Set the original amount into a hidden field using the upsellOriginalGiftAmountFieldName, if provided


  setOriginalAmount(original) {
    if (this.options.upsellOriginalGiftAmountFieldName) {
      let enFieldUpsellOriginalAmount = document.querySelector(".en__field__input.en__field__input--hidden[name='" + this.options.upsellOriginalGiftAmountFieldName + "']");

      if (!enFieldUpsellOriginalAmount) {
        let pageform = document.querySelector("form.en__component--page");

        if (pageform) {
          let input = document.createElement("input");
          input.setAttribute("type", "hidden");
          input.setAttribute("name", this.options.upsellOriginalGiftAmountFieldName);
          input.classList.add('en__field__input', 'en__field__input--hidden');
          pageform.appendChild(input);
          enFieldUpsellOriginalAmount = document.querySelector('.en__field__input.en__field__input--hidden[name="' + this.options.upsellOriginalGiftAmountFieldName + '"]');
        }
      }

      if (enFieldUpsellOriginalAmount) {
        // save it to a session variable just in case this page reloaded due to server-side validation error
        window.sessionStorage.setItem('original', original);
        enFieldUpsellOriginalAmount.setAttribute("value", original);
      }
    }
  } // Proceed to the next page (upsold or not)


  continue(e) {
    var _a;

    e.preventDefault();

    if (e.target instanceof Element && ((_a = document.querySelector("#upsellYesButton")) === null || _a === void 0 ? void 0 : _a.contains(e.target))) {
      if (engrid_ENGrid.debug) console.log("Upsold");
      this.setOriginalAmount(this._amount.amount.toString());

      this._frequency.setFrequency("monthly");

      this._amount.setAmount(this.getUpsellAmount());
    } else {
      this.setOriginalAmount('');
      window.sessionStorage.removeItem('original');
    }

    this._form.submitForm();
  } // Close the lightbox (no cookies)


  close(e) {
    e.preventDefault(); // cookie.set("hideUpsell", "1", { expires: 1 }); // Create one day cookie

    this.overlay.classList.add("is-hidden");

    if (this.options.submitOnClose) {
      this._form.submitForm();
    } else {
      this._form.dispatchError();
    }
  }

}
;// CONCATENATED MODULE: ../engrid-scripts/packages/common/dist/show-hide-radio-checkboxes.js
class ShowHideRadioCheckboxes {
  constructor(elements, classes) {
    this.elements = document.getElementsByName(elements);
    this.classes = classes;
    this.hideAll();

    for (let i = 0; i < this.elements.length; i++) {
      let element = this.elements[i];

      if (element.checked) {
        this.show(element);
      }

      element.addEventListener("change", e => {
        this.hideAll();
        this.show(element);
      });
    }
  } // Hide All Divs


  hideAll() {
    this.elements.forEach((item, index) => {
      if (item instanceof HTMLInputElement) this.hide(item);
    });
  } // Hide Single Element Div


  hide(item) {
    let inputValue = item.value;
    document.querySelectorAll("." + this.classes + inputValue).forEach(el => {
      // Consider toggling "hide" class so these fields can be displayed when in a debug state
      if (el instanceof HTMLElement) el.style.display = "none";
    });
  } // Show Single Element Div


  show(item) {
    let inputValue = item.value;
    document.querySelectorAll("." + this.classes + inputValue).forEach(el => {
      // Consider toggling "hide" class so these fields can be displayed when in a debug state
      if (el instanceof HTMLElement) el.style.display = "";
    });

    if (item.type == "checkbox" && !item.checked) {
      this.hide(item);
    }
  }

}
;// CONCATENATED MODULE: ../engrid-scripts/packages/common/dist/simple-country-select.js
// This class works when the user has added ".simple_country_select" as a class in page builder for the Country select
class SimpleCountrySelect {
  constructor() {
    var _a;

    this.countryWrapper = document.querySelector('.simple_country_select');
    this.countrySelect = document.querySelector('#en__field_supporter_country');

    if (this.countrySelect) {
      let countrySelecLabel = this.countrySelect.options[this.countrySelect.selectedIndex].innerHTML;
      let countrySelecValue = this.countrySelect.options[this.countrySelect.selectedIndex].value;

      if (countrySelecValue == "US") {
        countrySelecValue = " US";
      }

      if (countrySelecLabel == "United States") {
        countrySelecLabel = "the United States";
      }

      let countryWrapper = document.querySelector('.simple_country_select');

      if (countryWrapper) {
        // Remove Country Select tab index
        this.countrySelect.tabIndex = -1; // Find the address label

        let addressLabel = document.querySelector('.en__field--address1 label');
        let addressWrapper = (_a = addressLabel.parentElement) === null || _a === void 0 ? void 0 : _a.parentElement; // EN does not enforce a labels on fields so we have to check for it

        if (addressLabel) {
          // Wrap the address label in a div to break out of the flexbox
          this.wrap(addressLabel, document.createElement('div')); // Add our link after the address label
          // Includes both long form and short form variants

          let newEl = document.createElement('span');
          newEl.innerHTML = ' <label id="en_custom_field_simple_country_select_long" class="en__field__label"><a href="javascript:void(0)">(Outside ' + countrySelecLabel + '?)</a></label><label id="en_custom_field_simple_country_select_short" class="en__field__label"><a href="javascript:void(0)">(Outside ' + countrySelecValue + '?)</a></label>';
          newEl.querySelectorAll("a").forEach(el => {
            el.addEventListener("click", this.showCountrySelect.bind(this));
          });
          this.insertAfter(newEl, addressLabel);
        }
      }
    }
  } // Helper function to insert HTML after a node


  insertAfter(el, referenceNode) {
    const parentElement = referenceNode.parentNode;
    parentElement.insertBefore(el, referenceNode.nextSibling);
  } // Helper function to wrap a target in a new element


  wrap(el, wrapper) {
    const parentElement = el.parentNode;
    parentElement.insertBefore(wrapper, el);
    wrapper.appendChild(el);
  }

  showCountrySelect(e) {
    var _a;

    e.preventDefault();
    this.countryWrapper.classList.add("country-select-visible");
    let addressLabel = document.querySelector('.en__field--address1 label');
    let addressWrapper = (_a = addressLabel.parentElement) === null || _a === void 0 ? void 0 : _a.parentElement;
    addressWrapper.classList.add("country-select-visible");
    this.countrySelect.focus(); // Reinstate Country Select tab index

    this.countrySelect.removeAttribute("tabIndex");
  }

}
;// CONCATENATED MODULE: ../engrid-scripts/packages/common/dist/skip-link.js
// Javascript that adds an accessible "Skip Link" button after the <body> opening that jumps to
// the first <title> or <h1> field in a "body-" section, or the first <h1> if none are found
// in those sections
// Depends on _engrid-skip-link.scss

class SkipToMainContentLink {
  constructor() {
    const firstTitleInEngridBody = document.querySelector("div[class*='body-'] title");
    const firstH1InEngridBody = document.querySelector("div[class*='body-'] h1");
    const firstTitle = document.querySelector("title");
    const firstH1 = document.querySelector("h1");

    if (firstTitleInEngridBody && firstTitleInEngridBody.parentElement) {
      firstTitleInEngridBody.parentElement.insertAdjacentHTML('beforebegin', '<span id="skip-link"></span>');
      this.insertSkipLinkSpan();
    } else if (firstH1InEngridBody && firstH1InEngridBody.parentElement) {
      firstH1InEngridBody.parentElement.insertAdjacentHTML('beforebegin', '<span id="skip-link"></span>');
      this.insertSkipLinkSpan();
    } else if (firstTitle && firstTitle.parentElement) {
      firstTitle.parentElement.insertAdjacentHTML('beforebegin', '<span id="skip-link"></span>');
      this.insertSkipLinkSpan();
    } else if (firstH1 && firstH1.parentElement) {
      firstH1.parentElement.insertAdjacentHTML('beforebegin', '<span id="skip-link"></span>');
      this.insertSkipLinkSpan();
    } else {
      if (engrid_ENGrid.debug) console.log("This page contains no <title> or <h1> and a 'Skip to main content' link was not added");
    }
  }

  insertSkipLinkSpan() {
    document.body.insertAdjacentHTML('afterbegin', '<a class="skip-link" href="#skip-link">Skip to main content</a>');
  }

}
;// CONCATENATED MODULE: ../engrid-scripts/packages/common/dist/src-defer.js
// Build Notes: Add the vanilla Javascript version inline inside the page template right before </body>
// In the event the vanilla javascript is not inlined we should still process any assets with a data-src still defined on it. Plus we only process background video via this JS file as to not block the page with a large video file downloading.
// // 4Site's simplified image lazy loader
// var srcDefer = document.querySelectorAll("img[data-src]");
// window.addEventListener('DOMContentLoaded', (event) => {
//   for (var i = 0; i < srcDefer.length; i++) {
//     let dataSrc = srcDefer[i].getAttribute("data-src");
//     if (dataSrc) {
//       srcDefer[i].setAttribute("decoding", "async"); // Gets image processing off the main working thread
//       srcDefer[i].setAttribute("loading", "lazy"); // Lets the browser determine when the asset should be downloaded
//       srcDefer[i].setAttribute("src", dataSrc); // Sets the src which will cause the browser to retrieve the asset
//       srcDefer[i].setAttribute("data-engrid-data-src-processed", "true"); // Sets an attribute to mark that it has been processed by ENGrid
//       srcDefer[i].removeAttribute("data-src"); // Removes the data-source
//     }
//   }
// });
class SrcDefer {
  constructor() {
    // Find all images and videos with a data-src defined
    this.imgSrcDefer = document.querySelectorAll("img[data-src]");
    this.videoBackground = document.querySelectorAll("video");
    this.videoBackgroundSource = document.querySelectorAll("video source"); // Process images

    for (let i = 0; i < this.imgSrcDefer.length; i++) {
      let img = this.imgSrcDefer[i];

      if (img) {
        img.setAttribute("decoding", "async"); // Gets image processing off the main working thread, and decodes the image asynchronously to reduce delay in presenting other content

        img.setAttribute("loading", "lazy"); // Lets the browser determine when the asset should be downloaded using it's native lazy loading

        let imgDataSrc = img.getAttribute("data-src");

        if (imgDataSrc) {
          img.setAttribute("src", imgDataSrc); // Sets the src which will cause the browser to retrieve the asset
        }

        img.setAttribute("data-engrid-data-src-processed", "true"); // Sets an attribute to mark that it has been processed by ENGrid

        img.removeAttribute("data-src"); // Removes the data-source
      }
    } // Process video


    for (let i = 0; i < this.videoBackground.length; i++) {
      let video = this.videoBackground[i];
      video.setAttribute("loading", "lazy"); // Lets the browser determine when the asset should be downloaded
      // Process one or more defined sources in the <video> tag

      let videoBackgroundSource = video.querySelectorAll("source");
      let videoBackgroundSourcedDataSrc = this.videoBackgroundSource[i].getAttribute("data-src");

      if (videoBackgroundSource) {
        for (let i = 0; i < this.videoBackgroundSource.length; i++) {
          // Construct the <video> tags new <source>
          if (videoBackgroundSourcedDataSrc) {
            this.videoBackgroundSource[i].setAttribute("src", videoBackgroundSourcedDataSrc);
            this.videoBackgroundSource[i].setAttribute("data-engrid-data-src-processed", "true"); // Sets an attribute to mark that it has been processed by ENGrid

            this.videoBackgroundSource[i].removeAttribute("data-src"); // Removes the data-source
          } // To get the browser to request the video asset defined we need to remove the <video> tag and re-add it


          let videoBackgroundParent = video.parentNode; // Determine the parent of the <video> tag

          let copyOfVideoBackground = video; // Copy the <video> tag

          if (videoBackgroundParent && copyOfVideoBackground) {
            videoBackgroundParent.replaceChild(copyOfVideoBackground, this.videoBackground[i]); // Replace the <video> with the copy of itself
            // Update the video to auto play, mute, loop

            video.muted = true; // Mute the video by default

            video.controls = false; // Hide the browser controls

            video.loop = true; // Loop the video

            video.playsInline = true; // Encourage the user agent to display video content within the element's playback area

            video.play(); // Plays the video
          }
        }
      }
    }
  }

}
;// CONCATENATED MODULE: ../engrid-scripts/packages/common/dist/set-recurr-freq.js


class setRecurrFreq {
  constructor() {
    this._frequency = DonationFrequency.getInstance();
    this.linkClass = 'setRecurrFreq-';
    this.checkboxName = 'engrid.recurrfreq'; // Watch the links that starts with linkClass

    document.querySelectorAll(`a[class^="${this.linkClass}"]`).forEach(element => {
      element.addEventListener("click", e => {
        // Get the right class
        const setRecurrFreqClass = element.className.split(' ').filter(linkClass => linkClass.startsWith(this.linkClass));
        if (engrid_ENGrid.debug) console.log(setRecurrFreqClass);

        if (setRecurrFreqClass.length) {
          e.preventDefault();
          engrid_ENGrid.setFieldValue('transaction.recurrfreq', setRecurrFreqClass[0].substring(this.linkClass.length).toUpperCase());

          this._frequency.load();
        }
      });
    }); // Watch checkboxes with the name checkboxName

    document.getElementsByName(this.checkboxName).forEach(element => {
      element.addEventListener("change", () => {
        if (element.checked) {
          engrid_ENGrid.setFieldValue('transaction.recurrfreq', element.value.toUpperCase());

          this._frequency.load();
        }
      });
    }); // Uncheck the checkbox when frequency != checkbox value

    this._frequency.onFrequencyChange.subscribe(() => {
      const freq = this._frequency.frequency.toUpperCase();

      document.getElementsByName(this.checkboxName).forEach(element => {
        if (element.checked && element.value != freq) {
          element.checked = false;
        }
      });
    });
  }

}
;// CONCATENATED MODULE: ../engrid-scripts/packages/common/dist/page-background.js

class PageBackground {
  constructor() {
    // @TODO: Change page-backgroundImage to page-background
    this.pageBackground = document.querySelector(".page-backgroundImage"); // Finds any <img> added to the "backgroundImage" ENGRid section and sets it as the "--engrid__page-backgroundImage_url" CSS Custom Property

    if (this.pageBackground) {
      const pageBackgroundImg = this.pageBackground.querySelector("img");
      let pageBackgroundImgDataSrc = pageBackgroundImg === null || pageBackgroundImg === void 0 ? void 0 : pageBackgroundImg.getAttribute("data-src");
      let pageBackgroundImgSrc = pageBackgroundImg === null || pageBackgroundImg === void 0 ? void 0 : pageBackgroundImg.src;

      if (this.pageBackground && pageBackgroundImgDataSrc) {
        if (engrid_ENGrid.debug) console.log("A background image set in the page was found with a data-src value, setting it as --engrid__page-backgroundImage_url", pageBackgroundImgDataSrc);
        pageBackgroundImgDataSrc = "url('" + pageBackgroundImgDataSrc + "')";
        this.pageBackground.style.setProperty('--engrid__page-backgroundImage_url', pageBackgroundImgDataSrc);
      } else if (this.pageBackground && pageBackgroundImgSrc) {
        if (engrid_ENGrid.debug) console.log("A background image set in the page was found with a src value, setting it as --engrid__page-backgroundImage_url", pageBackgroundImgSrc);
        pageBackgroundImgSrc = "url('" + pageBackgroundImgSrc + "')";
        this.pageBackground.style.setProperty('--engrid__page-backgroundImage_url', pageBackgroundImgSrc);
      } else if (pageBackgroundImg) {
        if (engrid_ENGrid.debug) console.log("A background image set in the page was found but without a data-src or src value, no action taken", pageBackgroundImg);
      } else {
        if (engrid_ENGrid.debug) console.log("A background image set in the page was not found, any default image set in the theme on --engrid__page-backgroundImage_url will be used");
      }
    } else {
      if (engrid_ENGrid.debug) console.log("A background image set in the page was not found, any default image set in the theme on --engrid__page-backgroundImage_url will be used");
    }

    this.setDataAttributes();
  }

  setDataAttributes() {
    if (this.hasVideoBackground()) return engrid_ENGrid.setBodyData('page-background', 'video');
    if (this.hasImageBackground()) return engrid_ENGrid.setBodyData('page-background', 'image');
    return engrid_ENGrid.setBodyData('page-background', 'empty');
  }

  hasVideoBackground() {
    return !!this.pageBackground.querySelector('video');
  }

  hasImageBackground() {
    return !this.hasVideoBackground() && !!this.pageBackground.querySelector('img');
  }

}
;// CONCATENATED MODULE: ../engrid-scripts/packages/common/dist/neverbounce.js


class NeverBounce {
  constructor(apiKey, dateField = null, statusField = null) {
    this.apiKey = apiKey;
    this.dateField = dateField;
    this.statusField = statusField;
    this.form = EnForm.getInstance();
    this.emailField = null;
    this.emailWrapper = document.querySelector(".en__field--emailAddress");
    this.nbDate = null;
    this.nbStatus = null;
    window._NBSettings = {
      apiKey: this.apiKey,
      autoFieldHookup: false,
      inputLatency: 500,
      displayPoweredBy: false,
      loadingMessage: "Validating...",
      softRejectMessage: "Invalid email",
      acceptedMessage: "Email validated!",
      feedback: false
    };
    engrid_ENGrid.loadJS('https://cdn.neverbounce.com/widget/dist/NeverBounce.js');
    this.init();
    this.form.onValidate.subscribe(() => this.form.validate = this.validate());
  }

  init() {
    this.emailField = document.getElementById("en__field_supporter_emailAddress");
    if (this.dateField && document.getElementsByName(this.dateField).length) this.nbDate = document.querySelector("[name='" + this.dateField + "']");
    if (this.statusField && document.getElementsByName(this.statusField).length) this.nbStatus = document.querySelector("[name='" + this.statusField + "']");

    if (!this.emailField) {
      if (engrid_ENGrid.debug) console.log('Engrid Neverbounce: E-mail Field Not Found');
      return;
    }

    if (!this.emailField) {
      if (engrid_ENGrid.debug) console.log('Engrid Neverbounce: E-mail Field Not Found', this.emailField);
      return;
    }

    if (engrid_ENGrid.debug) console.log('Engrid Neverbounce External Script Loaded');
    this.wrap(this.emailField, document.createElement("div"));
    const parentNode = this.emailField.parentNode;
    parentNode.id = "nb-wrapper"; // Define HTML structure for a Custom NB Message and insert it after Email field

    const nbCustomMessageHTML = document.createElement("div");
    nbCustomMessageHTML.innerHTML = '<div id="nb-feedback" class="en__field__error nb-hidden">Enter a valid email.</div>';
    this.insertAfter(nbCustomMessageHTML, this.emailField);
    const NBClass = this;
    window.addEventListener("load", function () {
      document.getElementsByTagName("body")[0].addEventListener("nb:registered", function (event) {
        const field = document.querySelector('[data-nb-id="' + event.detail.id + '"]'); // Never Bounce: Do work when input changes or when API responds with an error

        field.addEventListener("nb:clear", function (e) {
          NBClass.setEmailStatus("clear");
          if (NBClass.nbDate) NBClass.nbDate.value = "";
          if (NBClass.nbStatus) NBClass.nbStatus.value = "";
        }); // Never Bounce: Do work when results have an input that does not look like an email (i.e. missing @ or no .com/.net/etc...)

        field.addEventListener("nb:soft-result", function (e) {
          NBClass.setEmailStatus("soft-result");
          if (NBClass.nbDate) NBClass.nbDate.value = "";
          if (NBClass.nbStatus) NBClass.nbStatus.value = "";
        }); // Never Bounce: When results have been received

        field.addEventListener("nb:result", function (e) {
          if (e.detail.result.is(window._nb.settings.getAcceptedStatusCodes())) {
            NBClass.setEmailStatus("valid");
            if (NBClass.nbDate) NBClass.nbDate.value = new Date().toLocaleDateString();
          } else {
            NBClass.setEmailStatus("invalid");
            if (NBClass.nbDate) NBClass.nbDate.value = "";
          }
        });
      }); // Never Bounce: Register field with the widget and broadcast nb:registration event

      window._nb.fields.registerListener(NBClass.emailField, true);
    });
  }

  clearStatus() {
    if (!this.emailField) {
      if (engrid_ENGrid.debug) console.log('Engrid Neverbounce: E-mail Field Not Found');
      return;
    }

    this.emailField.classList.remove("rm-error"); // Search page for the NB Wrapper div and set as variable

    const nb_email_field_wrapper = document.getElementById("nb-wrapper"); // Search page for the NB Feedback div and set as variable

    const nb_email_feedback_field = document.getElementById("nb-feedback");
    nb_email_field_wrapper.className = "";
    nb_email_feedback_field.className = "en__field__error nb-hidden";
    nb_email_feedback_field.innerHTML = "";
    this.emailWrapper.classList.remove("en__field--validationFailed");
  }

  deleteENFieldError() {
    const errorField = document.querySelector(".en__field--emailAddress>div.en__field__error");
    if (errorField) errorField.remove();
  }

  setEmailStatus(status) {
    if (engrid_ENGrid.debug) console.log("Neverbounce Status:", status);

    if (!this.emailField) {
      if (engrid_ENGrid.debug) console.log('Engrid Neverbounce: E-mail Field Not Found');
      return;
    } // Search page for the NB Wrapper div and set as variable


    const nb_email_field_wrapper = document.getElementById("nb-wrapper"); // Search page for the NB Feedback div and set as variable

    const nb_email_feedback_field = document.getElementById("nb-feedback"); // classes to add or remove based on neverbounce results

    const nb_email_field_wrapper_success = "nb-success";
    const nb_email_field_wrapper_error = "nb-error";
    const nb_email_feedback_hidden = "nb-hidden";
    const nb_email_feedback_loading = "nb-loading";
    const nb_email_field_error = "rm-error";

    if (!nb_email_feedback_field) {
      const nbWrapperDiv = nb_email_field_wrapper.querySelector('div');
      if (nbWrapperDiv) nbWrapperDiv.innerHTML = '<div id="nb-feedback" class="en__field__error nb-hidden">Enter a valid email.</div>';
    }

    if (status == "valid") {
      this.clearStatus();
    } else {
      nb_email_field_wrapper.classList.remove(nb_email_field_wrapper_success);
      nb_email_field_wrapper.classList.add(nb_email_field_wrapper_error);

      switch (status) {
        case "required":
          // special case status that we added ourselves -- doesn't come from NB
          this.deleteENFieldError();
          nb_email_feedback_field.innerHTML = "A valid email is required";
          nb_email_feedback_field.classList.remove(nb_email_feedback_loading);
          nb_email_feedback_field.classList.remove(nb_email_feedback_hidden);
          this.emailField.classList.add(nb_email_field_error);
          break;

        case "soft-result":
          if (this.emailField.value) {
            this.deleteENFieldError();
            nb_email_feedback_field.innerHTML = "Invalid email";
            nb_email_feedback_field.classList.remove(nb_email_feedback_hidden);
            this.emailField.classList.add(nb_email_field_error);
          } else {
            this.clearStatus();
          }

          break;

        case "invalid":
          this.deleteENFieldError();
          nb_email_feedback_field.innerHTML = "Invalid email";
          nb_email_feedback_field.classList.remove(nb_email_feedback_loading);
          nb_email_feedback_field.classList.remove(nb_email_feedback_hidden);
          this.emailField.classList.add(nb_email_field_error);
          break;

        case "loading":
        case "clear":
        default:
          this.clearStatus();
          break;
      }
    }
  } // Function to insert HTML after a DIV


  insertAfter(el, referenceNode) {
    var _a;

    (_a = referenceNode === null || referenceNode === void 0 ? void 0 : referenceNode.parentNode) === null || _a === void 0 ? void 0 : _a.insertBefore(el, referenceNode.nextSibling);
  } //  to insert HTML before a DIV


  insertBefore(el, referenceNode) {
    var _a;

    (_a = referenceNode === null || referenceNode === void 0 ? void 0 : referenceNode.parentNode) === null || _a === void 0 ? void 0 : _a.insertBefore(el, referenceNode);
  } //  to Wrap HTML around a DIV


  wrap(el, wrapper) {
    var _a;

    (_a = el.parentNode) === null || _a === void 0 ? void 0 : _a.insertBefore(wrapper, el);
    wrapper.appendChild(el);
  }

  validate() {
    var _a;

    if (!this.emailField) {
      if (engrid_ENGrid.debug) console.log('Engrid Neverbounce validate(): E-mail Field Not Found. Returning true.');
      return true;
    }

    if (this.nbStatus) {
      this.nbStatus.value = engrid_ENGrid.getFieldValue("nb-result");
    }

    if (!['catchall', 'valid'].includes(engrid_ENGrid.getFieldValue('nb-result'))) {
      this.setEmailStatus("required");
      (_a = this.emailField) === null || _a === void 0 ? void 0 : _a.focus();
      return false;
    }

    return true;
  }

}
;// CONCATENATED MODULE: ../engrid-scripts/packages/common/dist/index.js
 // Runs first so it can change the DOM markup before any markup dependent code fires






















;// CONCATENATED MODULE: ./src/index.ts
// import { Options, App } from "@4site/engrid-common"; // Uses ENGrid via NPM
 // Uses ENGrid via Visual Studio Workspace


const options = {
  applePay: false,
  CapitalizeFields: true,
  ClickToExpand: true,
  CurrencySymbol: '$',
  CurrencySeparator: '.',
  MediaAttribution: true,
  SkipToMainContentLink: true,
  SrcDefer: true,
  // ProgressBar: true,
  Debug: App.getUrlParameter('debug') == 'true' ? true : false,
  onLoad: () => console.log("Starter Theme Loaded"),
  onResize: () => console.log("Starter Theme Window Resized")
};
new App(options);
})();

/******/ })()
;