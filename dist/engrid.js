/*!
 * 
 *                ((((
 *          ((((((((
 *       (((((((
 *     (((((((           ****
 *   (((((((          *******
 *  ((((((((       **********     *********       ****    ***
 *  ((((((((    ************   **************     ***    ****
 *  ((((((   *******  *****   *****        *     **    ******        *****
 *  (((   *******    ******   ******            ****  ********   ************
 *      *******      *****     **********      ****    ****     ****      ****
 *    *********************         *******   *****   ****     ***************
 *     ********************            ****   ****    ****    ****
 *                 *****    *****   *******  *****   *****     *****     **
 *                *****     *************    ****    *******     **********
 *
 *  ENGRID PAGE TEMPLATE ASSETS
 *
 *  Date: Thursday, January 27, 2022 @ 15:28:31 ET
 *  By: fernando
 *  ENGrid styles: v0.8.3
 *  ENGrid scripts: v0.8.4
 *
 *  Created by 4Site Studios
 *  Come work with us or join our team, we would love to hear from you
 *  https://www.4sitestudios.com/en
 *
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 2705:
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
    /**
     * Creates an instance of DispatchError.
     * @param {string} message The message.
     *
     * @memberOf DispatchError
     */
    constructor(message) {
        super(message);
    }
}
exports.DispatchError = DispatchError;


/***/ }),

/***/ 9885:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DispatcherBase = void 0;
const __1 = __webpack_require__(4844);
/**
 * Base class for implementation of the dispatcher. It facilitates the subscribe
 * and unsubscribe methods based on generic handlers. The TEventType specifies
 * the type of event that should be exposed. Use the asEvent to expose the
 * dispatcher as event.
 *
 * @export
 * @abstract
 * @class DispatcherBase
 * @implements {ISubscribable<TEventHandler>}
 * @template TEventHandler The type of event handler.
 */
class DispatcherBase {
    constructor() {
        /**
         * The subscriptions.
         *
         * @protected
         *
         * @memberOf DispatcherBase
         */
        this._subscriptions = new Array();
    }
    /**
     * Returns the number of subscriptions.
     *
     * @readonly
     * @type {number}
     * @memberOf DispatcherBase
     */
    get count() {
        return this._subscriptions.length;
    }
    /**
     * Triggered when subscriptions are changed (added or removed).
     *
     * @readonly
     * @type {ISubscribable<SubscriptionChangeEventHandler>}
     * @memberOf DispatcherBase
     */
    get onSubscriptionChange() {
        if (this._onSubscriptionChange == null) {
            this._onSubscriptionChange = new __1.SubscriptionChangeEventDispatcher();
        }
        return this._onSubscriptionChange.asEvent();
    }
    /**
     * Subscribe to the event dispatcher.
     *
     * @param {TEventHandler} fn The event handler that is called when the event is dispatched.
     * @returns A function that unsubscribes the event handler from the event.
     *
     * @memberOf DispatcherBase
     */
    subscribe(fn) {
        if (fn) {
            this._subscriptions.push(this.createSubscription(fn, false));
            this.triggerSubscriptionChange();
        }
        return () => {
            this.unsubscribe(fn);
        };
    }
    /**
     * Subscribe to the event dispatcher.
     *
     * @param {TEventHandler} fn The event handler that is called when the event is dispatched.
     * @returns A function that unsubscribes the event handler from the event.
     *
     * @memberOf DispatcherBase
     */
    sub(fn) {
        return this.subscribe(fn);
    }
    /**
     * Subscribe once to the event with the specified name.
     *
     * @param {TEventHandler} fn The event handler that is called when the event is dispatched.
     * @returns A function that unsubscribes the event handler from the event.
     *
     * @memberOf DispatcherBase
     */
    one(fn) {
        if (fn) {
            this._subscriptions.push(this.createSubscription(fn, true));
            this.triggerSubscriptionChange();
        }
        return () => {
            this.unsubscribe(fn);
        };
    }
    /**
     * Checks it the event has a subscription for the specified handler.
     *
     * @param {TEventHandler} fn The event handler.
     *
     * @memberOf DispatcherBase
     */
    has(fn) {
        if (!fn)
            return false;
        return this._subscriptions.some((sub) => sub.handler == fn);
    }
    /**
     * Unsubscribes the handler from the dispatcher.
     *
     * @param {TEventHandler} fn The event handler.
     *
     * @memberOf DispatcherBase
     */
    unsubscribe(fn) {
        if (!fn)
            return;
        let changes = false;
        for (let i = 0; i < this._subscriptions.length; i++) {
            if (this._subscriptions[i].handler == fn) {
                this._subscriptions.splice(i, 1);
                changes = true;
                break;
            }
        }
        if (changes) {
            this.triggerSubscriptionChange();
        }
    }
    /**
     * Unsubscribes the handler from the dispatcher.
     *
     * @param {TEventHandler} fn The event handler.
     *
     * @memberOf DispatcherBase
     */
    unsub(fn) {
        this.unsubscribe(fn);
    }
    /**
     * Generic dispatch will dispatch the handlers with the given arguments.
     *
     * @protected
     * @param {boolean} executeAsync `True` if the even should be executed async.
     * @param {*} scope The scope of the event. The scope becomes the `this` for handler.
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
    /**
     * Creates a subscription.
     *
     * @protected
     * @param {TEventHandler} handler The handler.
     * @param {boolean} isOnce True if the handler should run only one.
     * @returns {ISubscription<TEventHandler>} The subscription.
     *
     * @memberOf DispatcherBase
     */
    createSubscription(handler, isOnce) {
        return new __1.Subscription(handler, isOnce);
    }
    /**
     * Cleans up subs that ran and should run only once.
     *
     * @protected
     * @param {ISubscription<TEventHandler>} sub The subscription.
     *
     * @memberOf DispatcherBase
     */
    cleanup(sub) {
        let changes = false;
        if (sub.isOnce && sub.isExecuted) {
            let i = this._subscriptions.indexOf(sub);
            if (i > -1) {
                this._subscriptions.splice(i, 1);
                changes = true;
            }
        }
        if (changes) {
            this.triggerSubscriptionChange();
        }
    }
    /**
     * Creates an event from the dispatcher. Will return the dispatcher
     * in a wrapper. This will prevent exposure of any dispatcher methods.
     *
     * @returns {ISubscribable<TEventHandler>}
     *
     * @memberOf DispatcherBase
     */
    asEvent() {
        if (this._wrap == null) {
            this._wrap = new __1.DispatcherWrapper(this);
        }
        return this._wrap;
    }
    /**
     * Clears the subscriptions.
     *
     * @memberOf DispatcherBase
     */
    clear() {
        if (this._subscriptions.length != 0) {
            this._subscriptions.splice(0, this._subscriptions.length);
            this.triggerSubscriptionChange();
        }
    }
    /**
     * Triggers the subscription change event.
     *
     * @private
     *
     * @memberOf DispatcherBase
     */
    triggerSubscriptionChange() {
        if (this._onSubscriptionChange != null) {
            this._onSubscriptionChange.dispatch(this.count);
        }
    }
}
exports.DispatcherBase = DispatcherBase;


/***/ }),

/***/ 1637:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DispatcherWrapper = void 0;
/**
 * Hides the implementation of the event dispatcher. Will expose methods that
 * are relevent to the event.
 *
 * @export
 * @class DispatcherWrapper
 * @implements {ISubscribable<TEventHandler>}
 * @template TEventHandler The type of event handler.
 */
class DispatcherWrapper {
    /**
     * Creates an instance of DispatcherWrapper.
     * @param {ISubscribable<TEventHandler>} dispatcher
     *
     * @memberOf DispatcherWrapper
     */
    constructor(dispatcher) {
        this._subscribe = (fn) => dispatcher.subscribe(fn);
        this._unsubscribe = (fn) => dispatcher.unsubscribe(fn);
        this._one = (fn) => dispatcher.one(fn);
        this._has = (fn) => dispatcher.has(fn);
        this._clear = () => dispatcher.clear();
        this._count = () => dispatcher.count;
        this._onSubscriptionChange = () => dispatcher.onSubscriptionChange;
    }
    /**
     * Triggered when subscriptions are changed (added or removed).
     *
     * @readonly
     * @type {ISubscribable<SubscriptionChangeEventHandler>}
     * @memberOf DispatcherWrapper
     */
    get onSubscriptionChange() {
        return this._onSubscriptionChange();
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
     *
     * @param {TEventHandler} fn The event handler that is called when the event is dispatched.
     * @returns {() => void} A function that unsubscribes the event handler from the event.
     *
     * @memberOf DispatcherWrapper
     */
    subscribe(fn) {
        return this._subscribe(fn);
    }
    /**
     * Subscribe to the event dispatcher.
     *
     * @param {TEventHandler} fn The event handler that is called when the event is dispatched.
     * @returns {() => void} A function that unsubscribes the event handler from the event.
     *
     * @memberOf DispatcherWrapper
     */
    sub(fn) {
        return this.subscribe(fn);
    }
    /**
     * Unsubscribe from the event dispatcher.
     *
     * @param {TEventHandler} fn The event handler that is called when the event is dispatched.
     *
     * @memberOf DispatcherWrapper
     */
    unsubscribe(fn) {
        this._unsubscribe(fn);
    }
    /**
     * Unsubscribe from the event dispatcher.
     *
     * @param {TEventHandler} fn The event handler that is called when the event is dispatched.
     *
     * @memberOf DispatcherWrapper
     */
    unsub(fn) {
        this.unsubscribe(fn);
    }
    /**
     * Subscribe once to the event with the specified name.
     *
     * @returns {() => void} A function that unsubscribes the event handler from the event.
     *
     * @memberOf DispatcherWrapper
     */
    one(fn) {
        return this._one(fn);
    }
    /**
     * Checks it the event has a subscription for the specified handler.
     *
     * @param {TEventHandler} fn The event handler that is called when the event is dispatched.
     *
     * @memberOf DispatcherWrapper
     */
    has(fn) {
        return this._has(fn);
    }
    /**
     * Clears all the subscriptions.
     *
     * @memberOf DispatcherWrapper
     */
    clear() {
        this._clear();
    }
}
exports.DispatcherWrapper = DispatcherWrapper;


/***/ }),

/***/ 4155:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EventListBase = void 0;
/**
 * Base class for event lists classes. Implements the get and remove.
 *
 * @export
 * @abstract
 * @class EventListBaset
 * @template TEventDispatcher The type of event dispatcher.
 */
class EventListBase {
    constructor() {
        this._events = {};
    }
    /**
     * Gets the dispatcher associated with the name.
     *
     * @param {string} name The name of the event.
     * @returns {TEventDispatcher} The disptacher.
     *
     * @memberOf EventListBase
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
     *
     * @param {string} name
     *
     * @memberOf EventListBase
     */
    remove(name) {
        delete this._events[name];
    }
}
exports.EventListBase = EventListBase;


/***/ }),

/***/ 2849:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PromiseDispatcherBase = void 0;
const __1 = __webpack_require__(4844);
/**
 * Dispatcher base for dispatchers that use promises. Each promise
 * is awaited before the next is dispatched, unless the event is
 * dispatched with the executeAsync flag.
 *
 * @export
 * @abstract
 * @class PromiseDispatcherBase
 * @extends {DispatcherBase<TEventHandler>}
 * @template TEventHandler The type of event handler.
 */
class PromiseDispatcherBase extends __1.DispatcherBase {
    /**
     * The normal dispatch cannot be used in this class.
     *
     * @protected
     * @param {boolean} executeAsync `True` if the even should be executed async.
     * @param {*} scope The scope of the event. The scope becomes the `this` for handler.
     * @param {IArguments} args The arguments for the event.
     * @returns {(IPropagationStatus | null)} The propagation status, or if an `executeAsync` is used `null`.
     *
     * @memberOf DispatcherBase
     */
    _dispatch(executeAsync, scope, args) {
        throw new __1.DispatchError("_dispatch not supported. Use _dispatchAsPromise.");
    }
    /**
     * Crates a new subscription.
     *
     * @protected
     * @param {TEventHandler} handler The handler.
     * @param {boolean} isOnce Indicates if the handler should only run once.
     * @returns {ISubscription<TEventHandler>} The subscription.
     *
     * @memberOf PromiseDispatcherBase
     */
    createSubscription(handler, isOnce) {
        return new __1.PromiseSubscription(handler, isOnce);
    }
    /**
     * Generic dispatch will dispatch the handlers with the given arguments.
     *
     * @protected
     * @param {boolean} executeAsync `True` if the even should be executed async.
     * @param {*} scope The scope of the event. The scope becomes the `this` for handler.
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

/***/ 4220:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SubscriptionChangeEventDispatcher = void 0;
const __1 = __webpack_require__(4844);
/**
 * Dispatcher for subscription changes.
 *
 * @export
 * @class SubscriptionChangeEventDispatcher
 * @extends {DispatcherBase<SubscriptionChangeEventHandler>}
 */
class SubscriptionChangeEventDispatcher extends __1.DispatcherBase {
    /**
     * Dispatches the event.
     *
     * @param {number} count The currrent number of subscriptions.
     *
     * @memberOf SubscriptionChangeEventDispatcher
     */
    dispatch(count) {
        this._dispatch(false, this, arguments);
    }
}
exports.SubscriptionChangeEventDispatcher = SubscriptionChangeEventDispatcher;


/***/ }),

/***/ 7278:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PromiseSubscription = void 0;
/**
 * Subscription implementation for events with promises.
 *
 * @export
 * @class PromiseSubscription
 * @implements {ISubscription<TEventHandler>}
 * @template TEventHandler The type of event handler.
 */
class PromiseSubscription {
    /**
     * Creates an instance of PromiseSubscription.
     * @param {TEventHandler} handler The handler for the subscription.
     * @param {boolean} isOnce Indicates if the handler should only be executed once.
     *
     * @memberOf PromiseSubscription
     */
    constructor(handler, isOnce) {
        this.handler = handler;
        this.isOnce = isOnce;
        /**
         * Indicates if the subscription has been executed before.
         *
         * @memberOf PromiseSubscription
         */
        this.isExecuted = false;
    }
    /**
     * Executes the handler.
     *
     * @param {boolean} executeAsync True if the even should be executed async.
     * @param {*} scope The scope the scope of the event.
     * @param {IArguments} args The arguments for the event.
     *
     * @memberOf PromiseSubscription
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

/***/ 8326:
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

/***/ 516:
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
 * @template TEventHandler The type of event handler.
 * @template TDispatcher The type of dispatcher.
 * @template TList The type of event list.
 */
class HandlingBase {
    /**
     * Creates an instance of HandlingBase.
     * @param {TList} events The event list. Used for event management.
     *
     * @memberOf HandlingBase
     */
    constructor(events) {
        this.events = events;
    }
    /**
     * Subscribes once to the event with the specified name.
     * @param {string} name The name of the event.
     * @param {TEventHandler} fn The event handler.
     *
     * @memberOf HandlingBase
     */
    one(name, fn) {
        this.events.get(name).one(fn);
    }
    /**
     * Checks it the event has a subscription for the specified handler.
     * @param {string} name The name of the event.
     * @param {TEventHandler} fn The event handler.
     *
     * @memberOf HandlingBase
     */
    has(name, fn) {
        return this.events.get(name).has(fn);
    }
    /**
     * Subscribes to the event with the specified name.
     * @param {string} name The name of the event.
     * @param {TEventHandler} fn The event handler.
     *
     * @memberOf HandlingBase
     */
    subscribe(name, fn) {
        this.events.get(name).subscribe(fn);
    }
    /**
     * Subscribes to the event with the specified name.
     * @param {string} name The name of the event.
     * @param {TEventHandler} fn The event handler.
     *
     * @memberOf HandlingBase
     */
    sub(name, fn) {
        this.subscribe(name, fn);
    }
    /**
     * Unsubscribes from the event with the specified name.
     * @param {string} name The name of the event.
     * @param {TEventHandler} fn The event handler.
     *
     * @memberOf HandlingBase
     */
    unsubscribe(name, fn) {
        this.events.get(name).unsubscribe(fn);
    }
    /**
     * Unsubscribes from the event with the specified name.
     * @param {string} name The name of the event.
     * @param {TEventHandler} fn The event handler.
     *
     * @memberOf HandlingBase
     */
    unsub(name, fn) {
        this.unsubscribe(name, fn);
    }
}
exports.HandlingBase = HandlingBase;


/***/ }),

/***/ 4844:
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
exports.SubscriptionChangeEventDispatcher = exports.HandlingBase = exports.PromiseDispatcherBase = exports.PromiseSubscription = exports.DispatchError = exports.EventManagement = exports.EventListBase = exports.DispatcherWrapper = exports.DispatcherBase = exports.Subscription = void 0;
const DispatcherBase_1 = __webpack_require__(9885);
Object.defineProperty(exports, "DispatcherBase", ({ enumerable: true, get: function () { return DispatcherBase_1.DispatcherBase; } }));
const DispatchError_1 = __webpack_require__(2705);
Object.defineProperty(exports, "DispatchError", ({ enumerable: true, get: function () { return DispatchError_1.DispatchError; } }));
const DispatcherWrapper_1 = __webpack_require__(1637);
Object.defineProperty(exports, "DispatcherWrapper", ({ enumerable: true, get: function () { return DispatcherWrapper_1.DispatcherWrapper; } }));
const EventListBase_1 = __webpack_require__(4155);
Object.defineProperty(exports, "EventListBase", ({ enumerable: true, get: function () { return EventListBase_1.EventListBase; } }));
const EventManagement_1 = __webpack_require__(5638);
Object.defineProperty(exports, "EventManagement", ({ enumerable: true, get: function () { return EventManagement_1.EventManagement; } }));
const HandlingBase_1 = __webpack_require__(516);
Object.defineProperty(exports, "HandlingBase", ({ enumerable: true, get: function () { return HandlingBase_1.HandlingBase; } }));
const PromiseDispatcherBase_1 = __webpack_require__(2849);
Object.defineProperty(exports, "PromiseDispatcherBase", ({ enumerable: true, get: function () { return PromiseDispatcherBase_1.PromiseDispatcherBase; } }));
const PromiseSubscription_1 = __webpack_require__(7278);
Object.defineProperty(exports, "PromiseSubscription", ({ enumerable: true, get: function () { return PromiseSubscription_1.PromiseSubscription; } }));
const Subscription_1 = __webpack_require__(8326);
Object.defineProperty(exports, "Subscription", ({ enumerable: true, get: function () { return Subscription_1.Subscription; } }));
const SubscriptionChangeEventHandler_1 = __webpack_require__(4220);
Object.defineProperty(exports, "SubscriptionChangeEventDispatcher", ({ enumerable: true, get: function () { return SubscriptionChangeEventHandler_1.SubscriptionChangeEventDispatcher; } }));


/***/ }),

/***/ 5638:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EventManagement = void 0;
/**
 * Allows the user to interact with the event.
 *
 * @export
 * @class EventManagement
 * @implements {IEventManagement}
 */
class EventManagement {
    /**
     * Creates an instance of EventManagement.
     * @param {() => void} unsub An unsubscribe handler.
     *
     * @memberOf EventManagement
     */
    constructor(unsub) {
        this.unsub = unsub;
        this.propagationStopped = false;
    }
    /**
     * Stops the propagation of the event.
     * Cannot be used when async dispatch is done.
     *
     * @memberOf EventManagement
     */
    stopPropagation() {
        this.propagationStopped = true;
    }
}
exports.EventManagement = EventManagement;


/***/ }),

/***/ 4402:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EventDispatcher = void 0;
const ste_core_1 = __webpack_require__(4844);
/**
 * Dispatcher implementation for events. Can be used to subscribe, unsubscribe
 * or dispatch events. Use the ToEvent() method to expose the event.
 *
 * @export
 * @class EventDispatcher
 * @extends {DispatcherBase<IEventHandler<TSender, TArgs>>}
 * @implements {IEvent<TSender, TArgs>}
 * @template TSender The sender type.
 * @template TArgs The event arguments type.
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
     * @param {TSender} sender The sender.
     * @param {TArgs} args The arguments.
     * @returns {IPropagationStatus} The propagation status to interact with the event
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
     * Dispatches the event in an async way. Does not support event interaction.
     *
     * @param {TSender} sender The sender.
     * @param {TArgs} args The arguments.
     *
     * @memberOf EventDispatcher
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

/***/ 9411:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EventHandlingBase = void 0;
const ste_core_1 = __webpack_require__(4844);
const EventList_1 = __webpack_require__(2453);
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

/***/ 2453:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EventList = void 0;
const ste_core_1 = __webpack_require__(4844);
const EventDispatcher_1 = __webpack_require__(4402);
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

/***/ 7891:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NonUniformEventList = void 0;
const EventDispatcher_1 = __webpack_require__(4402);
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

/***/ 3111:
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
const EventDispatcher_1 = __webpack_require__(4402);
Object.defineProperty(exports, "EventDispatcher", ({ enumerable: true, get: function () { return EventDispatcher_1.EventDispatcher; } }));
const EventHandlingBase_1 = __webpack_require__(9411);
Object.defineProperty(exports, "EventHandlingBase", ({ enumerable: true, get: function () { return EventHandlingBase_1.EventHandlingBase; } }));
const EventList_1 = __webpack_require__(2453);
Object.defineProperty(exports, "EventList", ({ enumerable: true, get: function () { return EventList_1.EventList; } }));
const NonUniformEventList_1 = __webpack_require__(7891);
Object.defineProperty(exports, "NonUniformEventList", ({ enumerable: true, get: function () { return NonUniformEventList_1.NonUniformEventList; } }));


/***/ }),

/***/ 4729:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SignalDispatcher = void 0;
const ste_core_1 = __webpack_require__(4844);
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

/***/ 4243:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SignalHandlingBase = void 0;
const ste_core_1 = __webpack_require__(4844);
const _1 = __webpack_require__(1254);
/**
 * Extends objects with signal event handling capabilities.
 *
 * @export
 * @abstract
 * @class SignalHandlingBase
 * @extends {HandlingBase<ISignalHandler, SignalDispatcher, SignalList>}
 * @implements {ISignalHandling}
 */
class SignalHandlingBase extends ste_core_1.HandlingBase {
    /**
     * Creates an instance of SignalHandlingBase.
     *
     * @memberOf SignalHandlingBase
     */
    constructor() {
        super(new _1.SignalList());
    }
}
exports.SignalHandlingBase = SignalHandlingBase;


/***/ }),

/***/ 7991:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SignalList = void 0;
const ste_core_1 = __webpack_require__(4844);
const _1 = __webpack_require__(1254);
/**
 * Storage class for multiple signal events that are accessible by name.
 * Events dispatchers are automatically created.
 *
 * @export
 * @class SignalList
 * @extends {EventListBase<SignalDispatcher>}
 */
class SignalList extends ste_core_1.EventListBase {
    /**
     * Creates an instance of SignalList.
     *
     * @memberOf SignalList
     */
    constructor() {
        super();
    }
    /**
     * Creates a new dispatcher instance.
     *
     * @protected
     * @returns {SignalDispatcher}
     *
     * @memberOf SignalList
     */
    createDispatcher() {
        return new _1.SignalDispatcher();
    }
}
exports.SignalList = SignalList;


/***/ }),

/***/ 1254:
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
const SignalDispatcher_1 = __webpack_require__(4729);
Object.defineProperty(exports, "SignalDispatcher", ({ enumerable: true, get: function () { return SignalDispatcher_1.SignalDispatcher; } }));
const SignalHandlingBase_1 = __webpack_require__(4243);
Object.defineProperty(exports, "SignalHandlingBase", ({ enumerable: true, get: function () { return SignalHandlingBase_1.SignalHandlingBase; } }));
const SignalList_1 = __webpack_require__(7991);
Object.defineProperty(exports, "SignalList", ({ enumerable: true, get: function () { return SignalList_1.SignalList; } }));


/***/ }),

/***/ 9360:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NonUniformSimpleEventList = void 0;
const SimpleEventDispatcher_1 = __webpack_require__(4624);
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

/***/ 4624:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SimpleEventDispatcher = void 0;
const ste_core_1 = __webpack_require__(4844);
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

/***/ 1269:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SimpleEventHandlingBase = void 0;
const ste_core_1 = __webpack_require__(4844);
const SimpleEventList_1 = __webpack_require__(5570);
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

/***/ 5570:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SimpleEventList = void 0;
const ste_core_1 = __webpack_require__(4844);
const SimpleEventDispatcher_1 = __webpack_require__(4624);
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

/***/ 5931:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NonUniformSimpleEventList = exports.SimpleEventList = exports.SimpleEventHandlingBase = exports.SimpleEventDispatcher = void 0;
const SimpleEventDispatcher_1 = __webpack_require__(4624);
Object.defineProperty(exports, "SimpleEventDispatcher", ({ enumerable: true, get: function () { return SimpleEventDispatcher_1.SimpleEventDispatcher; } }));
const SimpleEventHandlingBase_1 = __webpack_require__(1269);
Object.defineProperty(exports, "SimpleEventHandlingBase", ({ enumerable: true, get: function () { return SimpleEventHandlingBase_1.SimpleEventHandlingBase; } }));
const NonUniformSimpleEventList_1 = __webpack_require__(9360);
Object.defineProperty(exports, "NonUniformSimpleEventList", ({ enumerable: true, get: function () { return NonUniformSimpleEventList_1.NonUniformSimpleEventList; } }));
const SimpleEventList_1 = __webpack_require__(5570);
Object.defineProperty(exports, "SimpleEventList", ({ enumerable: true, get: function () { return SimpleEventList_1.SimpleEventList; } }));


/***/ }),

/***/ 5363:
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
var ste_core_1 = __webpack_require__(4844);
__webpack_unused_export__ = ({ enumerable: true, get: function () { return ste_core_1.Subscription; } });
__webpack_unused_export__ = ({ enumerable: true, get: function () { return ste_core_1.DispatcherBase; } });
__webpack_unused_export__ = ({ enumerable: true, get: function () { return ste_core_1.DispatcherWrapper; } });
__webpack_unused_export__ = ({ enumerable: true, get: function () { return ste_core_1.EventListBase; } });
__webpack_unused_export__ = ({ enumerable: true, get: function () { return ste_core_1.EventManagement; } });
__webpack_unused_export__ = ({ enumerable: true, get: function () { return ste_core_1.DispatchError; } });
__webpack_unused_export__ = ({ enumerable: true, get: function () { return ste_core_1.PromiseSubscription; } });
__webpack_unused_export__ = ({ enumerable: true, get: function () { return ste_core_1.PromiseDispatcherBase; } });
__webpack_unused_export__ = ({ enumerable: true, get: function () { return ste_core_1.HandlingBase; } });
var ste_events_1 = __webpack_require__(3111);
__webpack_unused_export__ = ({ enumerable: true, get: function () { return ste_events_1.EventDispatcher; } });
__webpack_unused_export__ = ({ enumerable: true, get: function () { return ste_events_1.EventHandlingBase; } });
__webpack_unused_export__ = ({ enumerable: true, get: function () { return ste_events_1.EventList; } });
__webpack_unused_export__ = ({ enumerable: true, get: function () { return ste_events_1.NonUniformEventList; } });
var ste_simple_events_1 = __webpack_require__(5931);
Object.defineProperty(exports, "FK", ({ enumerable: true, get: function () { return ste_simple_events_1.SimpleEventDispatcher; } }));
__webpack_unused_export__ = ({ enumerable: true, get: function () { return ste_simple_events_1.SimpleEventHandlingBase; } });
__webpack_unused_export__ = ({ enumerable: true, get: function () { return ste_simple_events_1.SimpleEventList; } });
__webpack_unused_export__ = ({ enumerable: true, get: function () { return ste_simple_events_1.NonUniformSimpleEventList; } });
var ste_signals_1 = __webpack_require__(1254);
Object.defineProperty(exports, "nz", ({ enumerable: true, get: function () { return ste_signals_1.SignalDispatcher; } }));
__webpack_unused_export__ = ({ enumerable: true, get: function () { return ste_signals_1.SignalHandlingBase; } });
__webpack_unused_export__ = ({ enumerable: true, get: function () { return ste_signals_1.SignalList; } });
var ste_promise_events_1 = __webpack_require__(6586);
__webpack_unused_export__ = ({ enumerable: true, get: function () { return ste_promise_events_1.PromiseEventDispatcher; } });
__webpack_unused_export__ = ({ enumerable: true, get: function () { return ste_promise_events_1.PromiseEventHandlingBase; } });
__webpack_unused_export__ = ({ enumerable: true, get: function () { return ste_promise_events_1.PromiseEventList; } });
__webpack_unused_export__ = ({ enumerable: true, get: function () { return ste_promise_events_1.NonUniformPromiseEventList; } });
var ste_promise_signals_1 = __webpack_require__(6838);
__webpack_unused_export__ = ({ enumerable: true, get: function () { return ste_promise_signals_1.PromiseSignalDispatcher; } });
__webpack_unused_export__ = ({ enumerable: true, get: function () { return ste_promise_signals_1.PromiseSignalHandlingBase; } });
__webpack_unused_export__ = ({ enumerable: true, get: function () { return ste_promise_signals_1.PromiseSignalList; } });
var ste_promise_simple_events_1 = __webpack_require__(9176);
__webpack_unused_export__ = ({ enumerable: true, get: function () { return ste_promise_simple_events_1.PromiseSimpleEventDispatcher; } });
__webpack_unused_export__ = ({ enumerable: true, get: function () { return ste_promise_simple_events_1.PromiseSimpleEventHandlingBase; } });
__webpack_unused_export__ = ({ enumerable: true, get: function () { return ste_promise_simple_events_1.PromiseSimpleEventList; } });
__webpack_unused_export__ = ({ enumerable: true, get: function () { return ste_promise_simple_events_1.NonUniformPromiseSimpleEventList; } });


/***/ }),

/***/ 6357:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NonUniformPromiseEventList = void 0;
const PromiseEventDispatcher_1 = __webpack_require__(5072);
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

/***/ 5072:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PromiseEventDispatcher = void 0;
const ste_core_1 = __webpack_require__(2874);
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

/***/ 7873:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PromiseEventHandlingBase = void 0;
const ste_core_1 = __webpack_require__(2874);
const PromiseEventList_1 = __webpack_require__(4414);
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

/***/ 4414:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PromiseEventList = void 0;
const ste_core_1 = __webpack_require__(2874);
const PromiseEventDispatcher_1 = __webpack_require__(5072);
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

/***/ 6586:
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
const PromiseEventDispatcher_1 = __webpack_require__(5072);
Object.defineProperty(exports, "PromiseEventDispatcher", ({ enumerable: true, get: function () { return PromiseEventDispatcher_1.PromiseEventDispatcher; } }));
const PromiseEventHandlingBase_1 = __webpack_require__(7873);
Object.defineProperty(exports, "PromiseEventHandlingBase", ({ enumerable: true, get: function () { return PromiseEventHandlingBase_1.PromiseEventHandlingBase; } }));
const PromiseEventList_1 = __webpack_require__(4414);
Object.defineProperty(exports, "PromiseEventList", ({ enumerable: true, get: function () { return PromiseEventList_1.PromiseEventList; } }));
const NonUniformPromiseEventList_1 = __webpack_require__(6357);
Object.defineProperty(exports, "NonUniformPromiseEventList", ({ enumerable: true, get: function () { return NonUniformPromiseEventList_1.NonUniformPromiseEventList; } }));


/***/ }),

/***/ 4383:
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
    /**
     * Creates an instance of DispatchError.
     * @param {string} message The message.
     *
     * @memberOf DispatchError
     */
    constructor(message) {
        super(message);
    }
}
exports.DispatchError = DispatchError;


/***/ }),

/***/ 894:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DispatcherBase = void 0;
const __1 = __webpack_require__(2874);
/**
 * Base class for implementation of the dispatcher. It facilitates the subscribe
 * and unsubscribe methods based on generic handlers. The TEventType specifies
 * the type of event that should be exposed. Use the asEvent to expose the
 * dispatcher as event.
 *
 * @export
 * @abstract
 * @class DispatcherBase
 * @implements {ISubscribable<TEventHandler>}
 * @template TEventHandler The type of event handler.
 */
class DispatcherBase {
    constructor() {
        /**
         * The subscriptions.
         *
         * @protected
         *
         * @memberOf DispatcherBase
         */
        this._subscriptions = new Array();
    }
    /**
     * Returns the number of subscriptions.
     *
     * @readonly
     * @type {number}
     * @memberOf DispatcherBase
     */
    get count() {
        return this._subscriptions.length;
    }
    /**
     * Triggered when subscriptions are changed (added or removed).
     *
     * @readonly
     * @type {ISubscribable<SubscriptionChangeEventHandler>}
     * @memberOf DispatcherBase
     */
    get onSubscriptionChange() {
        if (this._onSubscriptionChange == null) {
            this._onSubscriptionChange = new __1.SubscriptionChangeEventDispatcher();
        }
        return this._onSubscriptionChange.asEvent();
    }
    /**
     * Subscribe to the event dispatcher.
     *
     * @param {TEventHandler} fn The event handler that is called when the event is dispatched.
     * @returns A function that unsubscribes the event handler from the event.
     *
     * @memberOf DispatcherBase
     */
    subscribe(fn) {
        if (fn) {
            this._subscriptions.push(this.createSubscription(fn, false));
            this.triggerSubscriptionChange();
        }
        return () => {
            this.unsubscribe(fn);
        };
    }
    /**
     * Subscribe to the event dispatcher.
     *
     * @param {TEventHandler} fn The event handler that is called when the event is dispatched.
     * @returns A function that unsubscribes the event handler from the event.
     *
     * @memberOf DispatcherBase
     */
    sub(fn) {
        return this.subscribe(fn);
    }
    /**
     * Subscribe once to the event with the specified name.
     *
     * @param {TEventHandler} fn The event handler that is called when the event is dispatched.
     * @returns A function that unsubscribes the event handler from the event.
     *
     * @memberOf DispatcherBase
     */
    one(fn) {
        if (fn) {
            this._subscriptions.push(this.createSubscription(fn, true));
            this.triggerSubscriptionChange();
        }
        return () => {
            this.unsubscribe(fn);
        };
    }
    /**
     * Checks it the event has a subscription for the specified handler.
     *
     * @param {TEventHandler} fn The event handler.
     *
     * @memberOf DispatcherBase
     */
    has(fn) {
        if (!fn)
            return false;
        return this._subscriptions.some((sub) => sub.handler == fn);
    }
    /**
     * Unsubscribes the handler from the dispatcher.
     *
     * @param {TEventHandler} fn The event handler.
     *
     * @memberOf DispatcherBase
     */
    unsubscribe(fn) {
        if (!fn)
            return;
        let changes = false;
        for (let i = 0; i < this._subscriptions.length; i++) {
            if (this._subscriptions[i].handler == fn) {
                this._subscriptions.splice(i, 1);
                changes = true;
                break;
            }
        }
        if (changes) {
            this.triggerSubscriptionChange();
        }
    }
    /**
     * Unsubscribes the handler from the dispatcher.
     *
     * @param {TEventHandler} fn The event handler.
     *
     * @memberOf DispatcherBase
     */
    unsub(fn) {
        this.unsubscribe(fn);
    }
    /**
     * Generic dispatch will dispatch the handlers with the given arguments.
     *
     * @protected
     * @param {boolean} executeAsync `True` if the even should be executed async.
     * @param {*} scope The scope of the event. The scope becomes the `this` for handler.
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
    /**
     * Creates a subscription.
     *
     * @protected
     * @param {TEventHandler} handler The handler.
     * @param {boolean} isOnce True if the handler should run only one.
     * @returns {ISubscription<TEventHandler>} The subscription.
     *
     * @memberOf DispatcherBase
     */
    createSubscription(handler, isOnce) {
        return new __1.Subscription(handler, isOnce);
    }
    /**
     * Cleans up subs that ran and should run only once.
     *
     * @protected
     * @param {ISubscription<TEventHandler>} sub The subscription.
     *
     * @memberOf DispatcherBase
     */
    cleanup(sub) {
        let changes = false;
        if (sub.isOnce && sub.isExecuted) {
            let i = this._subscriptions.indexOf(sub);
            if (i > -1) {
                this._subscriptions.splice(i, 1);
                changes = true;
            }
        }
        if (changes) {
            this.triggerSubscriptionChange();
        }
    }
    /**
     * Creates an event from the dispatcher. Will return the dispatcher
     * in a wrapper. This will prevent exposure of any dispatcher methods.
     *
     * @returns {ISubscribable<TEventHandler>}
     *
     * @memberOf DispatcherBase
     */
    asEvent() {
        if (this._wrap == null) {
            this._wrap = new __1.DispatcherWrapper(this);
        }
        return this._wrap;
    }
    /**
     * Clears the subscriptions.
     *
     * @memberOf DispatcherBase
     */
    clear() {
        if (this._subscriptions.length != 0) {
            this._subscriptions.splice(0, this._subscriptions.length);
            this.triggerSubscriptionChange();
        }
    }
    /**
     * Triggers the subscription change event.
     *
     * @private
     *
     * @memberOf DispatcherBase
     */
    triggerSubscriptionChange() {
        if (this._onSubscriptionChange != null) {
            this._onSubscriptionChange.dispatch(this.count);
        }
    }
}
exports.DispatcherBase = DispatcherBase;


/***/ }),

/***/ 9757:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DispatcherWrapper = void 0;
/**
 * Hides the implementation of the event dispatcher. Will expose methods that
 * are relevent to the event.
 *
 * @export
 * @class DispatcherWrapper
 * @implements {ISubscribable<TEventHandler>}
 * @template TEventHandler The type of event handler.
 */
class DispatcherWrapper {
    /**
     * Creates an instance of DispatcherWrapper.
     * @param {ISubscribable<TEventHandler>} dispatcher
     *
     * @memberOf DispatcherWrapper
     */
    constructor(dispatcher) {
        this._subscribe = (fn) => dispatcher.subscribe(fn);
        this._unsubscribe = (fn) => dispatcher.unsubscribe(fn);
        this._one = (fn) => dispatcher.one(fn);
        this._has = (fn) => dispatcher.has(fn);
        this._clear = () => dispatcher.clear();
        this._count = () => dispatcher.count;
        this._onSubscriptionChange = () => dispatcher.onSubscriptionChange;
    }
    /**
     * Triggered when subscriptions are changed (added or removed).
     *
     * @readonly
     * @type {ISubscribable<SubscriptionChangeEventHandler>}
     * @memberOf DispatcherWrapper
     */
    get onSubscriptionChange() {
        return this._onSubscriptionChange();
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
     *
     * @param {TEventHandler} fn The event handler that is called when the event is dispatched.
     * @returns {() => void} A function that unsubscribes the event handler from the event.
     *
     * @memberOf DispatcherWrapper
     */
    subscribe(fn) {
        return this._subscribe(fn);
    }
    /**
     * Subscribe to the event dispatcher.
     *
     * @param {TEventHandler} fn The event handler that is called when the event is dispatched.
     * @returns {() => void} A function that unsubscribes the event handler from the event.
     *
     * @memberOf DispatcherWrapper
     */
    sub(fn) {
        return this.subscribe(fn);
    }
    /**
     * Unsubscribe from the event dispatcher.
     *
     * @param {TEventHandler} fn The event handler that is called when the event is dispatched.
     *
     * @memberOf DispatcherWrapper
     */
    unsubscribe(fn) {
        this._unsubscribe(fn);
    }
    /**
     * Unsubscribe from the event dispatcher.
     *
     * @param {TEventHandler} fn The event handler that is called when the event is dispatched.
     *
     * @memberOf DispatcherWrapper
     */
    unsub(fn) {
        this.unsubscribe(fn);
    }
    /**
     * Subscribe once to the event with the specified name.
     *
     * @returns {() => void} A function that unsubscribes the event handler from the event.
     *
     * @memberOf DispatcherWrapper
     */
    one(fn) {
        return this._one(fn);
    }
    /**
     * Checks it the event has a subscription for the specified handler.
     *
     * @param {TEventHandler} fn The event handler that is called when the event is dispatched.
     *
     * @memberOf DispatcherWrapper
     */
    has(fn) {
        return this._has(fn);
    }
    /**
     * Clears all the subscriptions.
     *
     * @memberOf DispatcherWrapper
     */
    clear() {
        this._clear();
    }
}
exports.DispatcherWrapper = DispatcherWrapper;


/***/ }),

/***/ 5930:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EventListBase = void 0;
/**
 * Base class for event lists classes. Implements the get and remove.
 *
 * @export
 * @abstract
 * @class EventListBaset
 * @template TEventDispatcher The type of event dispatcher.
 */
class EventListBase {
    constructor() {
        this._events = {};
    }
    /**
     * Gets the dispatcher associated with the name.
     *
     * @param {string} name The name of the event.
     * @returns {TEventDispatcher} The disptacher.
     *
     * @memberOf EventListBase
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
     *
     * @param {string} name
     *
     * @memberOf EventListBase
     */
    remove(name) {
        delete this._events[name];
    }
}
exports.EventListBase = EventListBase;


/***/ }),

/***/ 7541:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PromiseDispatcherBase = void 0;
const __1 = __webpack_require__(2874);
/**
 * Dispatcher base for dispatchers that use promises. Each promise
 * is awaited before the next is dispatched, unless the event is
 * dispatched with the executeAsync flag.
 *
 * @export
 * @abstract
 * @class PromiseDispatcherBase
 * @extends {DispatcherBase<TEventHandler>}
 * @template TEventHandler The type of event handler.
 */
class PromiseDispatcherBase extends __1.DispatcherBase {
    /**
     * The normal dispatch cannot be used in this class.
     *
     * @protected
     * @param {boolean} executeAsync `True` if the even should be executed async.
     * @param {*} scope The scope of the event. The scope becomes the `this` for handler.
     * @param {IArguments} args The arguments for the event.
     * @returns {(IPropagationStatus | null)} The propagation status, or if an `executeAsync` is used `null`.
     *
     * @memberOf DispatcherBase
     */
    _dispatch(executeAsync, scope, args) {
        throw new __1.DispatchError("_dispatch not supported. Use _dispatchAsPromise.");
    }
    /**
     * Crates a new subscription.
     *
     * @protected
     * @param {TEventHandler} handler The handler.
     * @param {boolean} isOnce Indicates if the handler should only run once.
     * @returns {ISubscription<TEventHandler>} The subscription.
     *
     * @memberOf PromiseDispatcherBase
     */
    createSubscription(handler, isOnce) {
        return new __1.PromiseSubscription(handler, isOnce);
    }
    /**
     * Generic dispatch will dispatch the handlers with the given arguments.
     *
     * @protected
     * @param {boolean} executeAsync `True` if the even should be executed async.
     * @param {*} scope The scope of the event. The scope becomes the `this` for handler.
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

/***/ 2545:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SubscriptionChangeEventDispatcher = void 0;
const __1 = __webpack_require__(2874);
/**
 * Dispatcher for subscription changes.
 *
 * @export
 * @class SubscriptionChangeEventDispatcher
 * @extends {DispatcherBase<SubscriptionChangeEventHandler>}
 */
class SubscriptionChangeEventDispatcher extends __1.DispatcherBase {
    /**
     * Dispatches the event.
     *
     * @param {number} count The currrent number of subscriptions.
     *
     * @memberOf SubscriptionChangeEventDispatcher
     */
    dispatch(count) {
        this._dispatch(false, this, arguments);
    }
}
exports.SubscriptionChangeEventDispatcher = SubscriptionChangeEventDispatcher;


/***/ }),

/***/ 8452:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PromiseSubscription = void 0;
/**
 * Subscription implementation for events with promises.
 *
 * @export
 * @class PromiseSubscription
 * @implements {ISubscription<TEventHandler>}
 * @template TEventHandler The type of event handler.
 */
class PromiseSubscription {
    /**
     * Creates an instance of PromiseSubscription.
     * @param {TEventHandler} handler The handler for the subscription.
     * @param {boolean} isOnce Indicates if the handler should only be executed once.
     *
     * @memberOf PromiseSubscription
     */
    constructor(handler, isOnce) {
        this.handler = handler;
        this.isOnce = isOnce;
        /**
         * Indicates if the subscription has been executed before.
         *
         * @memberOf PromiseSubscription
         */
        this.isExecuted = false;
    }
    /**
     * Executes the handler.
     *
     * @param {boolean} executeAsync True if the even should be executed async.
     * @param {*} scope The scope the scope of the event.
     * @param {IArguments} args The arguments for the event.
     *
     * @memberOf PromiseSubscription
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

/***/ 365:
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

/***/ 954:
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
 * @template TEventHandler The type of event handler.
 * @template TDispatcher The type of dispatcher.
 * @template TList The type of event list.
 */
class HandlingBase {
    /**
     * Creates an instance of HandlingBase.
     * @param {TList} events The event list. Used for event management.
     *
     * @memberOf HandlingBase
     */
    constructor(events) {
        this.events = events;
    }
    /**
     * Subscribes once to the event with the specified name.
     * @param {string} name The name of the event.
     * @param {TEventHandler} fn The event handler.
     *
     * @memberOf HandlingBase
     */
    one(name, fn) {
        this.events.get(name).one(fn);
    }
    /**
     * Checks it the event has a subscription for the specified handler.
     * @param {string} name The name of the event.
     * @param {TEventHandler} fn The event handler.
     *
     * @memberOf HandlingBase
     */
    has(name, fn) {
        return this.events.get(name).has(fn);
    }
    /**
     * Subscribes to the event with the specified name.
     * @param {string} name The name of the event.
     * @param {TEventHandler} fn The event handler.
     *
     * @memberOf HandlingBase
     */
    subscribe(name, fn) {
        this.events.get(name).subscribe(fn);
    }
    /**
     * Subscribes to the event with the specified name.
     * @param {string} name The name of the event.
     * @param {TEventHandler} fn The event handler.
     *
     * @memberOf HandlingBase
     */
    sub(name, fn) {
        this.subscribe(name, fn);
    }
    /**
     * Unsubscribes from the event with the specified name.
     * @param {string} name The name of the event.
     * @param {TEventHandler} fn The event handler.
     *
     * @memberOf HandlingBase
     */
    unsubscribe(name, fn) {
        this.events.get(name).unsubscribe(fn);
    }
    /**
     * Unsubscribes from the event with the specified name.
     * @param {string} name The name of the event.
     * @param {TEventHandler} fn The event handler.
     *
     * @memberOf HandlingBase
     */
    unsub(name, fn) {
        this.unsubscribe(name, fn);
    }
}
exports.HandlingBase = HandlingBase;


/***/ }),

/***/ 2874:
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
exports.SubscriptionChangeEventDispatcher = exports.HandlingBase = exports.PromiseDispatcherBase = exports.PromiseSubscription = exports.DispatchError = exports.EventManagement = exports.EventListBase = exports.DispatcherWrapper = exports.DispatcherBase = exports.Subscription = void 0;
const DispatcherBase_1 = __webpack_require__(894);
Object.defineProperty(exports, "DispatcherBase", ({ enumerable: true, get: function () { return DispatcherBase_1.DispatcherBase; } }));
const DispatchError_1 = __webpack_require__(4383);
Object.defineProperty(exports, "DispatchError", ({ enumerable: true, get: function () { return DispatchError_1.DispatchError; } }));
const DispatcherWrapper_1 = __webpack_require__(9757);
Object.defineProperty(exports, "DispatcherWrapper", ({ enumerable: true, get: function () { return DispatcherWrapper_1.DispatcherWrapper; } }));
const EventListBase_1 = __webpack_require__(5930);
Object.defineProperty(exports, "EventListBase", ({ enumerable: true, get: function () { return EventListBase_1.EventListBase; } }));
const EventManagement_1 = __webpack_require__(4796);
Object.defineProperty(exports, "EventManagement", ({ enumerable: true, get: function () { return EventManagement_1.EventManagement; } }));
const HandlingBase_1 = __webpack_require__(954);
Object.defineProperty(exports, "HandlingBase", ({ enumerable: true, get: function () { return HandlingBase_1.HandlingBase; } }));
const PromiseDispatcherBase_1 = __webpack_require__(7541);
Object.defineProperty(exports, "PromiseDispatcherBase", ({ enumerable: true, get: function () { return PromiseDispatcherBase_1.PromiseDispatcherBase; } }));
const PromiseSubscription_1 = __webpack_require__(8452);
Object.defineProperty(exports, "PromiseSubscription", ({ enumerable: true, get: function () { return PromiseSubscription_1.PromiseSubscription; } }));
const Subscription_1 = __webpack_require__(365);
Object.defineProperty(exports, "Subscription", ({ enumerable: true, get: function () { return Subscription_1.Subscription; } }));
const SubscriptionChangeEventHandler_1 = __webpack_require__(2545);
Object.defineProperty(exports, "SubscriptionChangeEventDispatcher", ({ enumerable: true, get: function () { return SubscriptionChangeEventHandler_1.SubscriptionChangeEventDispatcher; } }));


/***/ }),

/***/ 4796:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EventManagement = void 0;
/**
 * Allows the user to interact with the event.
 *
 * @export
 * @class EventManagement
 * @implements {IEventManagement}
 */
class EventManagement {
    /**
     * Creates an instance of EventManagement.
     * @param {() => void} unsub An unsubscribe handler.
     *
     * @memberOf EventManagement
     */
    constructor(unsub) {
        this.unsub = unsub;
        this.propagationStopped = false;
    }
    /**
     * Stops the propagation of the event.
     * Cannot be used when async dispatch is done.
     *
     * @memberOf EventManagement
     */
    stopPropagation() {
        this.propagationStopped = true;
    }
}
exports.EventManagement = EventManagement;


/***/ }),

/***/ 5890:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PromiseSignalDispatcher = void 0;
const ste_core_1 = __webpack_require__(8486);
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

/***/ 205:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PromiseSignalHandlingBase = void 0;
const ste_core_1 = __webpack_require__(8486);
const PromiseSignalList_1 = __webpack_require__(3146);
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

/***/ 3146:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PromiseSignalList = void 0;
const ste_core_1 = __webpack_require__(8486);
const _1 = __webpack_require__(6838);
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

/***/ 6838:
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
const PromiseSignalDispatcher_1 = __webpack_require__(5890);
Object.defineProperty(exports, "PromiseSignalDispatcher", ({ enumerable: true, get: function () { return PromiseSignalDispatcher_1.PromiseSignalDispatcher; } }));
const PromiseSignalHandlingBase_1 = __webpack_require__(205);
Object.defineProperty(exports, "PromiseSignalHandlingBase", ({ enumerable: true, get: function () { return PromiseSignalHandlingBase_1.PromiseSignalHandlingBase; } }));
const PromiseSignalList_1 = __webpack_require__(3146);
Object.defineProperty(exports, "PromiseSignalList", ({ enumerable: true, get: function () { return PromiseSignalList_1.PromiseSignalList; } }));


/***/ }),

/***/ 6463:
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
    /**
     * Creates an instance of DispatchError.
     * @param {string} message The message.
     *
     * @memberOf DispatchError
     */
    constructor(message) {
        super(message);
    }
}
exports.DispatchError = DispatchError;


/***/ }),

/***/ 1368:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DispatcherBase = void 0;
const __1 = __webpack_require__(8486);
/**
 * Base class for implementation of the dispatcher. It facilitates the subscribe
 * and unsubscribe methods based on generic handlers. The TEventType specifies
 * the type of event that should be exposed. Use the asEvent to expose the
 * dispatcher as event.
 *
 * @export
 * @abstract
 * @class DispatcherBase
 * @implements {ISubscribable<TEventHandler>}
 * @template TEventHandler The type of event handler.
 */
class DispatcherBase {
    constructor() {
        /**
         * The subscriptions.
         *
         * @protected
         *
         * @memberOf DispatcherBase
         */
        this._subscriptions = new Array();
    }
    /**
     * Returns the number of subscriptions.
     *
     * @readonly
     * @type {number}
     * @memberOf DispatcherBase
     */
    get count() {
        return this._subscriptions.length;
    }
    /**
     * Triggered when subscriptions are changed (added or removed).
     *
     * @readonly
     * @type {ISubscribable<SubscriptionChangeEventHandler>}
     * @memberOf DispatcherBase
     */
    get onSubscriptionChange() {
        if (this._onSubscriptionChange == null) {
            this._onSubscriptionChange = new __1.SubscriptionChangeEventDispatcher();
        }
        return this._onSubscriptionChange.asEvent();
    }
    /**
     * Subscribe to the event dispatcher.
     *
     * @param {TEventHandler} fn The event handler that is called when the event is dispatched.
     * @returns A function that unsubscribes the event handler from the event.
     *
     * @memberOf DispatcherBase
     */
    subscribe(fn) {
        if (fn) {
            this._subscriptions.push(this.createSubscription(fn, false));
            this.triggerSubscriptionChange();
        }
        return () => {
            this.unsubscribe(fn);
        };
    }
    /**
     * Subscribe to the event dispatcher.
     *
     * @param {TEventHandler} fn The event handler that is called when the event is dispatched.
     * @returns A function that unsubscribes the event handler from the event.
     *
     * @memberOf DispatcherBase
     */
    sub(fn) {
        return this.subscribe(fn);
    }
    /**
     * Subscribe once to the event with the specified name.
     *
     * @param {TEventHandler} fn The event handler that is called when the event is dispatched.
     * @returns A function that unsubscribes the event handler from the event.
     *
     * @memberOf DispatcherBase
     */
    one(fn) {
        if (fn) {
            this._subscriptions.push(this.createSubscription(fn, true));
            this.triggerSubscriptionChange();
        }
        return () => {
            this.unsubscribe(fn);
        };
    }
    /**
     * Checks it the event has a subscription for the specified handler.
     *
     * @param {TEventHandler} fn The event handler.
     *
     * @memberOf DispatcherBase
     */
    has(fn) {
        if (!fn)
            return false;
        return this._subscriptions.some((sub) => sub.handler == fn);
    }
    /**
     * Unsubscribes the handler from the dispatcher.
     *
     * @param {TEventHandler} fn The event handler.
     *
     * @memberOf DispatcherBase
     */
    unsubscribe(fn) {
        if (!fn)
            return;
        let changes = false;
        for (let i = 0; i < this._subscriptions.length; i++) {
            if (this._subscriptions[i].handler == fn) {
                this._subscriptions.splice(i, 1);
                changes = true;
                break;
            }
        }
        if (changes) {
            this.triggerSubscriptionChange();
        }
    }
    /**
     * Unsubscribes the handler from the dispatcher.
     *
     * @param {TEventHandler} fn The event handler.
     *
     * @memberOf DispatcherBase
     */
    unsub(fn) {
        this.unsubscribe(fn);
    }
    /**
     * Generic dispatch will dispatch the handlers with the given arguments.
     *
     * @protected
     * @param {boolean} executeAsync `True` if the even should be executed async.
     * @param {*} scope The scope of the event. The scope becomes the `this` for handler.
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
    /**
     * Creates a subscription.
     *
     * @protected
     * @param {TEventHandler} handler The handler.
     * @param {boolean} isOnce True if the handler should run only one.
     * @returns {ISubscription<TEventHandler>} The subscription.
     *
     * @memberOf DispatcherBase
     */
    createSubscription(handler, isOnce) {
        return new __1.Subscription(handler, isOnce);
    }
    /**
     * Cleans up subs that ran and should run only once.
     *
     * @protected
     * @param {ISubscription<TEventHandler>} sub The subscription.
     *
     * @memberOf DispatcherBase
     */
    cleanup(sub) {
        let changes = false;
        if (sub.isOnce && sub.isExecuted) {
            let i = this._subscriptions.indexOf(sub);
            if (i > -1) {
                this._subscriptions.splice(i, 1);
                changes = true;
            }
        }
        if (changes) {
            this.triggerSubscriptionChange();
        }
    }
    /**
     * Creates an event from the dispatcher. Will return the dispatcher
     * in a wrapper. This will prevent exposure of any dispatcher methods.
     *
     * @returns {ISubscribable<TEventHandler>}
     *
     * @memberOf DispatcherBase
     */
    asEvent() {
        if (this._wrap == null) {
            this._wrap = new __1.DispatcherWrapper(this);
        }
        return this._wrap;
    }
    /**
     * Clears the subscriptions.
     *
     * @memberOf DispatcherBase
     */
    clear() {
        if (this._subscriptions.length != 0) {
            this._subscriptions.splice(0, this._subscriptions.length);
            this.triggerSubscriptionChange();
        }
    }
    /**
     * Triggers the subscription change event.
     *
     * @private
     *
     * @memberOf DispatcherBase
     */
    triggerSubscriptionChange() {
        if (this._onSubscriptionChange != null) {
            this._onSubscriptionChange.dispatch(this.count);
        }
    }
}
exports.DispatcherBase = DispatcherBase;


/***/ }),

/***/ 6982:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DispatcherWrapper = void 0;
/**
 * Hides the implementation of the event dispatcher. Will expose methods that
 * are relevent to the event.
 *
 * @export
 * @class DispatcherWrapper
 * @implements {ISubscribable<TEventHandler>}
 * @template TEventHandler The type of event handler.
 */
class DispatcherWrapper {
    /**
     * Creates an instance of DispatcherWrapper.
     * @param {ISubscribable<TEventHandler>} dispatcher
     *
     * @memberOf DispatcherWrapper
     */
    constructor(dispatcher) {
        this._subscribe = (fn) => dispatcher.subscribe(fn);
        this._unsubscribe = (fn) => dispatcher.unsubscribe(fn);
        this._one = (fn) => dispatcher.one(fn);
        this._has = (fn) => dispatcher.has(fn);
        this._clear = () => dispatcher.clear();
        this._count = () => dispatcher.count;
        this._onSubscriptionChange = () => dispatcher.onSubscriptionChange;
    }
    /**
     * Triggered when subscriptions are changed (added or removed).
     *
     * @readonly
     * @type {ISubscribable<SubscriptionChangeEventHandler>}
     * @memberOf DispatcherWrapper
     */
    get onSubscriptionChange() {
        return this._onSubscriptionChange();
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
     *
     * @param {TEventHandler} fn The event handler that is called when the event is dispatched.
     * @returns {() => void} A function that unsubscribes the event handler from the event.
     *
     * @memberOf DispatcherWrapper
     */
    subscribe(fn) {
        return this._subscribe(fn);
    }
    /**
     * Subscribe to the event dispatcher.
     *
     * @param {TEventHandler} fn The event handler that is called when the event is dispatched.
     * @returns {() => void} A function that unsubscribes the event handler from the event.
     *
     * @memberOf DispatcherWrapper
     */
    sub(fn) {
        return this.subscribe(fn);
    }
    /**
     * Unsubscribe from the event dispatcher.
     *
     * @param {TEventHandler} fn The event handler that is called when the event is dispatched.
     *
     * @memberOf DispatcherWrapper
     */
    unsubscribe(fn) {
        this._unsubscribe(fn);
    }
    /**
     * Unsubscribe from the event dispatcher.
     *
     * @param {TEventHandler} fn The event handler that is called when the event is dispatched.
     *
     * @memberOf DispatcherWrapper
     */
    unsub(fn) {
        this.unsubscribe(fn);
    }
    /**
     * Subscribe once to the event with the specified name.
     *
     * @returns {() => void} A function that unsubscribes the event handler from the event.
     *
     * @memberOf DispatcherWrapper
     */
    one(fn) {
        return this._one(fn);
    }
    /**
     * Checks it the event has a subscription for the specified handler.
     *
     * @param {TEventHandler} fn The event handler that is called when the event is dispatched.
     *
     * @memberOf DispatcherWrapper
     */
    has(fn) {
        return this._has(fn);
    }
    /**
     * Clears all the subscriptions.
     *
     * @memberOf DispatcherWrapper
     */
    clear() {
        this._clear();
    }
}
exports.DispatcherWrapper = DispatcherWrapper;


/***/ }),

/***/ 2177:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EventListBase = void 0;
/**
 * Base class for event lists classes. Implements the get and remove.
 *
 * @export
 * @abstract
 * @class EventListBaset
 * @template TEventDispatcher The type of event dispatcher.
 */
class EventListBase {
    constructor() {
        this._events = {};
    }
    /**
     * Gets the dispatcher associated with the name.
     *
     * @param {string} name The name of the event.
     * @returns {TEventDispatcher} The disptacher.
     *
     * @memberOf EventListBase
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
     *
     * @param {string} name
     *
     * @memberOf EventListBase
     */
    remove(name) {
        delete this._events[name];
    }
}
exports.EventListBase = EventListBase;


/***/ }),

/***/ 2300:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PromiseDispatcherBase = void 0;
const __1 = __webpack_require__(8486);
/**
 * Dispatcher base for dispatchers that use promises. Each promise
 * is awaited before the next is dispatched, unless the event is
 * dispatched with the executeAsync flag.
 *
 * @export
 * @abstract
 * @class PromiseDispatcherBase
 * @extends {DispatcherBase<TEventHandler>}
 * @template TEventHandler The type of event handler.
 */
class PromiseDispatcherBase extends __1.DispatcherBase {
    /**
     * The normal dispatch cannot be used in this class.
     *
     * @protected
     * @param {boolean} executeAsync `True` if the even should be executed async.
     * @param {*} scope The scope of the event. The scope becomes the `this` for handler.
     * @param {IArguments} args The arguments for the event.
     * @returns {(IPropagationStatus | null)} The propagation status, or if an `executeAsync` is used `null`.
     *
     * @memberOf DispatcherBase
     */
    _dispatch(executeAsync, scope, args) {
        throw new __1.DispatchError("_dispatch not supported. Use _dispatchAsPromise.");
    }
    /**
     * Crates a new subscription.
     *
     * @protected
     * @param {TEventHandler} handler The handler.
     * @param {boolean} isOnce Indicates if the handler should only run once.
     * @returns {ISubscription<TEventHandler>} The subscription.
     *
     * @memberOf PromiseDispatcherBase
     */
    createSubscription(handler, isOnce) {
        return new __1.PromiseSubscription(handler, isOnce);
    }
    /**
     * Generic dispatch will dispatch the handlers with the given arguments.
     *
     * @protected
     * @param {boolean} executeAsync `True` if the even should be executed async.
     * @param {*} scope The scope of the event. The scope becomes the `this` for handler.
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

/***/ 4303:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SubscriptionChangeEventDispatcher = void 0;
const __1 = __webpack_require__(8486);
/**
 * Dispatcher for subscription changes.
 *
 * @export
 * @class SubscriptionChangeEventDispatcher
 * @extends {DispatcherBase<SubscriptionChangeEventHandler>}
 */
class SubscriptionChangeEventDispatcher extends __1.DispatcherBase {
    /**
     * Dispatches the event.
     *
     * @param {number} count The currrent number of subscriptions.
     *
     * @memberOf SubscriptionChangeEventDispatcher
     */
    dispatch(count) {
        this._dispatch(false, this, arguments);
    }
}
exports.SubscriptionChangeEventDispatcher = SubscriptionChangeEventDispatcher;


/***/ }),

/***/ 9703:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PromiseSubscription = void 0;
/**
 * Subscription implementation for events with promises.
 *
 * @export
 * @class PromiseSubscription
 * @implements {ISubscription<TEventHandler>}
 * @template TEventHandler The type of event handler.
 */
class PromiseSubscription {
    /**
     * Creates an instance of PromiseSubscription.
     * @param {TEventHandler} handler The handler for the subscription.
     * @param {boolean} isOnce Indicates if the handler should only be executed once.
     *
     * @memberOf PromiseSubscription
     */
    constructor(handler, isOnce) {
        this.handler = handler;
        this.isOnce = isOnce;
        /**
         * Indicates if the subscription has been executed before.
         *
         * @memberOf PromiseSubscription
         */
        this.isExecuted = false;
    }
    /**
     * Executes the handler.
     *
     * @param {boolean} executeAsync True if the even should be executed async.
     * @param {*} scope The scope the scope of the event.
     * @param {IArguments} args The arguments for the event.
     *
     * @memberOf PromiseSubscription
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

/***/ 4683:
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

/***/ 5673:
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
 * @template TEventHandler The type of event handler.
 * @template TDispatcher The type of dispatcher.
 * @template TList The type of event list.
 */
class HandlingBase {
    /**
     * Creates an instance of HandlingBase.
     * @param {TList} events The event list. Used for event management.
     *
     * @memberOf HandlingBase
     */
    constructor(events) {
        this.events = events;
    }
    /**
     * Subscribes once to the event with the specified name.
     * @param {string} name The name of the event.
     * @param {TEventHandler} fn The event handler.
     *
     * @memberOf HandlingBase
     */
    one(name, fn) {
        this.events.get(name).one(fn);
    }
    /**
     * Checks it the event has a subscription for the specified handler.
     * @param {string} name The name of the event.
     * @param {TEventHandler} fn The event handler.
     *
     * @memberOf HandlingBase
     */
    has(name, fn) {
        return this.events.get(name).has(fn);
    }
    /**
     * Subscribes to the event with the specified name.
     * @param {string} name The name of the event.
     * @param {TEventHandler} fn The event handler.
     *
     * @memberOf HandlingBase
     */
    subscribe(name, fn) {
        this.events.get(name).subscribe(fn);
    }
    /**
     * Subscribes to the event with the specified name.
     * @param {string} name The name of the event.
     * @param {TEventHandler} fn The event handler.
     *
     * @memberOf HandlingBase
     */
    sub(name, fn) {
        this.subscribe(name, fn);
    }
    /**
     * Unsubscribes from the event with the specified name.
     * @param {string} name The name of the event.
     * @param {TEventHandler} fn The event handler.
     *
     * @memberOf HandlingBase
     */
    unsubscribe(name, fn) {
        this.events.get(name).unsubscribe(fn);
    }
    /**
     * Unsubscribes from the event with the specified name.
     * @param {string} name The name of the event.
     * @param {TEventHandler} fn The event handler.
     *
     * @memberOf HandlingBase
     */
    unsub(name, fn) {
        this.unsubscribe(name, fn);
    }
}
exports.HandlingBase = HandlingBase;


/***/ }),

/***/ 8486:
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
exports.SubscriptionChangeEventDispatcher = exports.HandlingBase = exports.PromiseDispatcherBase = exports.PromiseSubscription = exports.DispatchError = exports.EventManagement = exports.EventListBase = exports.DispatcherWrapper = exports.DispatcherBase = exports.Subscription = void 0;
const DispatcherBase_1 = __webpack_require__(1368);
Object.defineProperty(exports, "DispatcherBase", ({ enumerable: true, get: function () { return DispatcherBase_1.DispatcherBase; } }));
const DispatchError_1 = __webpack_require__(6463);
Object.defineProperty(exports, "DispatchError", ({ enumerable: true, get: function () { return DispatchError_1.DispatchError; } }));
const DispatcherWrapper_1 = __webpack_require__(6982);
Object.defineProperty(exports, "DispatcherWrapper", ({ enumerable: true, get: function () { return DispatcherWrapper_1.DispatcherWrapper; } }));
const EventListBase_1 = __webpack_require__(2177);
Object.defineProperty(exports, "EventListBase", ({ enumerable: true, get: function () { return EventListBase_1.EventListBase; } }));
const EventManagement_1 = __webpack_require__(8209);
Object.defineProperty(exports, "EventManagement", ({ enumerable: true, get: function () { return EventManagement_1.EventManagement; } }));
const HandlingBase_1 = __webpack_require__(5673);
Object.defineProperty(exports, "HandlingBase", ({ enumerable: true, get: function () { return HandlingBase_1.HandlingBase; } }));
const PromiseDispatcherBase_1 = __webpack_require__(2300);
Object.defineProperty(exports, "PromiseDispatcherBase", ({ enumerable: true, get: function () { return PromiseDispatcherBase_1.PromiseDispatcherBase; } }));
const PromiseSubscription_1 = __webpack_require__(9703);
Object.defineProperty(exports, "PromiseSubscription", ({ enumerable: true, get: function () { return PromiseSubscription_1.PromiseSubscription; } }));
const Subscription_1 = __webpack_require__(4683);
Object.defineProperty(exports, "Subscription", ({ enumerable: true, get: function () { return Subscription_1.Subscription; } }));
const SubscriptionChangeEventHandler_1 = __webpack_require__(4303);
Object.defineProperty(exports, "SubscriptionChangeEventDispatcher", ({ enumerable: true, get: function () { return SubscriptionChangeEventHandler_1.SubscriptionChangeEventDispatcher; } }));


/***/ }),

/***/ 8209:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EventManagement = void 0;
/**
 * Allows the user to interact with the event.
 *
 * @export
 * @class EventManagement
 * @implements {IEventManagement}
 */
class EventManagement {
    /**
     * Creates an instance of EventManagement.
     * @param {() => void} unsub An unsubscribe handler.
     *
     * @memberOf EventManagement
     */
    constructor(unsub) {
        this.unsub = unsub;
        this.propagationStopped = false;
    }
    /**
     * Stops the propagation of the event.
     * Cannot be used when async dispatch is done.
     *
     * @memberOf EventManagement
     */
    stopPropagation() {
        this.propagationStopped = true;
    }
}
exports.EventManagement = EventManagement;


/***/ }),

/***/ 4537:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NonUniformPromiseSimpleEventList = void 0;
const PromiseSimpleEventDispatcher_1 = __webpack_require__(8921);
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

/***/ 8921:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PromiseSimpleEventDispatcher = void 0;
const ste_core_1 = __webpack_require__(3310);
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

/***/ 532:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PromiseSimpleEventHandlingBase = void 0;
const ste_core_1 = __webpack_require__(3310);
const PromiseSimpleEventList_1 = __webpack_require__(7929);
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

/***/ 7929:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PromiseSimpleEventList = void 0;
const ste_core_1 = __webpack_require__(3310);
const PromiseSimpleEventDispatcher_1 = __webpack_require__(8921);
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

/***/ 9176:
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
const NonUniformPromiseSimpleEventList_1 = __webpack_require__(4537);
Object.defineProperty(exports, "NonUniformPromiseSimpleEventList", ({ enumerable: true, get: function () { return NonUniformPromiseSimpleEventList_1.NonUniformPromiseSimpleEventList; } }));
const PromiseSimpleEventDispatcher_1 = __webpack_require__(8921);
Object.defineProperty(exports, "PromiseSimpleEventDispatcher", ({ enumerable: true, get: function () { return PromiseSimpleEventDispatcher_1.PromiseSimpleEventDispatcher; } }));
const PromiseSimpleEventHandlingBase_1 = __webpack_require__(532);
Object.defineProperty(exports, "PromiseSimpleEventHandlingBase", ({ enumerable: true, get: function () { return PromiseSimpleEventHandlingBase_1.PromiseSimpleEventHandlingBase; } }));
const PromiseSimpleEventList_1 = __webpack_require__(7929);
Object.defineProperty(exports, "PromiseSimpleEventList", ({ enumerable: true, get: function () { return PromiseSimpleEventList_1.PromiseSimpleEventList; } }));


/***/ }),

/***/ 8181:
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
    /**
     * Creates an instance of DispatchError.
     * @param {string} message The message.
     *
     * @memberOf DispatchError
     */
    constructor(message) {
        super(message);
    }
}
exports.DispatchError = DispatchError;


/***/ }),

/***/ 3040:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DispatcherBase = void 0;
const __1 = __webpack_require__(3310);
/**
 * Base class for implementation of the dispatcher. It facilitates the subscribe
 * and unsubscribe methods based on generic handlers. The TEventType specifies
 * the type of event that should be exposed. Use the asEvent to expose the
 * dispatcher as event.
 *
 * @export
 * @abstract
 * @class DispatcherBase
 * @implements {ISubscribable<TEventHandler>}
 * @template TEventHandler The type of event handler.
 */
class DispatcherBase {
    constructor() {
        /**
         * The subscriptions.
         *
         * @protected
         *
         * @memberOf DispatcherBase
         */
        this._subscriptions = new Array();
    }
    /**
     * Returns the number of subscriptions.
     *
     * @readonly
     * @type {number}
     * @memberOf DispatcherBase
     */
    get count() {
        return this._subscriptions.length;
    }
    /**
     * Triggered when subscriptions are changed (added or removed).
     *
     * @readonly
     * @type {ISubscribable<SubscriptionChangeEventHandler>}
     * @memberOf DispatcherBase
     */
    get onSubscriptionChange() {
        if (this._onSubscriptionChange == null) {
            this._onSubscriptionChange = new __1.SubscriptionChangeEventDispatcher();
        }
        return this._onSubscriptionChange.asEvent();
    }
    /**
     * Subscribe to the event dispatcher.
     *
     * @param {TEventHandler} fn The event handler that is called when the event is dispatched.
     * @returns A function that unsubscribes the event handler from the event.
     *
     * @memberOf DispatcherBase
     */
    subscribe(fn) {
        if (fn) {
            this._subscriptions.push(this.createSubscription(fn, false));
            this.triggerSubscriptionChange();
        }
        return () => {
            this.unsubscribe(fn);
        };
    }
    /**
     * Subscribe to the event dispatcher.
     *
     * @param {TEventHandler} fn The event handler that is called when the event is dispatched.
     * @returns A function that unsubscribes the event handler from the event.
     *
     * @memberOf DispatcherBase
     */
    sub(fn) {
        return this.subscribe(fn);
    }
    /**
     * Subscribe once to the event with the specified name.
     *
     * @param {TEventHandler} fn The event handler that is called when the event is dispatched.
     * @returns A function that unsubscribes the event handler from the event.
     *
     * @memberOf DispatcherBase
     */
    one(fn) {
        if (fn) {
            this._subscriptions.push(this.createSubscription(fn, true));
            this.triggerSubscriptionChange();
        }
        return () => {
            this.unsubscribe(fn);
        };
    }
    /**
     * Checks it the event has a subscription for the specified handler.
     *
     * @param {TEventHandler} fn The event handler.
     *
     * @memberOf DispatcherBase
     */
    has(fn) {
        if (!fn)
            return false;
        return this._subscriptions.some((sub) => sub.handler == fn);
    }
    /**
     * Unsubscribes the handler from the dispatcher.
     *
     * @param {TEventHandler} fn The event handler.
     *
     * @memberOf DispatcherBase
     */
    unsubscribe(fn) {
        if (!fn)
            return;
        let changes = false;
        for (let i = 0; i < this._subscriptions.length; i++) {
            if (this._subscriptions[i].handler == fn) {
                this._subscriptions.splice(i, 1);
                changes = true;
                break;
            }
        }
        if (changes) {
            this.triggerSubscriptionChange();
        }
    }
    /**
     * Unsubscribes the handler from the dispatcher.
     *
     * @param {TEventHandler} fn The event handler.
     *
     * @memberOf DispatcherBase
     */
    unsub(fn) {
        this.unsubscribe(fn);
    }
    /**
     * Generic dispatch will dispatch the handlers with the given arguments.
     *
     * @protected
     * @param {boolean} executeAsync `True` if the even should be executed async.
     * @param {*} scope The scope of the event. The scope becomes the `this` for handler.
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
    /**
     * Creates a subscription.
     *
     * @protected
     * @param {TEventHandler} handler The handler.
     * @param {boolean} isOnce True if the handler should run only one.
     * @returns {ISubscription<TEventHandler>} The subscription.
     *
     * @memberOf DispatcherBase
     */
    createSubscription(handler, isOnce) {
        return new __1.Subscription(handler, isOnce);
    }
    /**
     * Cleans up subs that ran and should run only once.
     *
     * @protected
     * @param {ISubscription<TEventHandler>} sub The subscription.
     *
     * @memberOf DispatcherBase
     */
    cleanup(sub) {
        let changes = false;
        if (sub.isOnce && sub.isExecuted) {
            let i = this._subscriptions.indexOf(sub);
            if (i > -1) {
                this._subscriptions.splice(i, 1);
                changes = true;
            }
        }
        if (changes) {
            this.triggerSubscriptionChange();
        }
    }
    /**
     * Creates an event from the dispatcher. Will return the dispatcher
     * in a wrapper. This will prevent exposure of any dispatcher methods.
     *
     * @returns {ISubscribable<TEventHandler>}
     *
     * @memberOf DispatcherBase
     */
    asEvent() {
        if (this._wrap == null) {
            this._wrap = new __1.DispatcherWrapper(this);
        }
        return this._wrap;
    }
    /**
     * Clears the subscriptions.
     *
     * @memberOf DispatcherBase
     */
    clear() {
        if (this._subscriptions.length != 0) {
            this._subscriptions.splice(0, this._subscriptions.length);
            this.triggerSubscriptionChange();
        }
    }
    /**
     * Triggers the subscription change event.
     *
     * @private
     *
     * @memberOf DispatcherBase
     */
    triggerSubscriptionChange() {
        if (this._onSubscriptionChange != null) {
            this._onSubscriptionChange.dispatch(this.count);
        }
    }
}
exports.DispatcherBase = DispatcherBase;


/***/ }),

/***/ 3122:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DispatcherWrapper = void 0;
/**
 * Hides the implementation of the event dispatcher. Will expose methods that
 * are relevent to the event.
 *
 * @export
 * @class DispatcherWrapper
 * @implements {ISubscribable<TEventHandler>}
 * @template TEventHandler The type of event handler.
 */
class DispatcherWrapper {
    /**
     * Creates an instance of DispatcherWrapper.
     * @param {ISubscribable<TEventHandler>} dispatcher
     *
     * @memberOf DispatcherWrapper
     */
    constructor(dispatcher) {
        this._subscribe = (fn) => dispatcher.subscribe(fn);
        this._unsubscribe = (fn) => dispatcher.unsubscribe(fn);
        this._one = (fn) => dispatcher.one(fn);
        this._has = (fn) => dispatcher.has(fn);
        this._clear = () => dispatcher.clear();
        this._count = () => dispatcher.count;
        this._onSubscriptionChange = () => dispatcher.onSubscriptionChange;
    }
    /**
     * Triggered when subscriptions are changed (added or removed).
     *
     * @readonly
     * @type {ISubscribable<SubscriptionChangeEventHandler>}
     * @memberOf DispatcherWrapper
     */
    get onSubscriptionChange() {
        return this._onSubscriptionChange();
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
     *
     * @param {TEventHandler} fn The event handler that is called when the event is dispatched.
     * @returns {() => void} A function that unsubscribes the event handler from the event.
     *
     * @memberOf DispatcherWrapper
     */
    subscribe(fn) {
        return this._subscribe(fn);
    }
    /**
     * Subscribe to the event dispatcher.
     *
     * @param {TEventHandler} fn The event handler that is called when the event is dispatched.
     * @returns {() => void} A function that unsubscribes the event handler from the event.
     *
     * @memberOf DispatcherWrapper
     */
    sub(fn) {
        return this.subscribe(fn);
    }
    /**
     * Unsubscribe from the event dispatcher.
     *
     * @param {TEventHandler} fn The event handler that is called when the event is dispatched.
     *
     * @memberOf DispatcherWrapper
     */
    unsubscribe(fn) {
        this._unsubscribe(fn);
    }
    /**
     * Unsubscribe from the event dispatcher.
     *
     * @param {TEventHandler} fn The event handler that is called when the event is dispatched.
     *
     * @memberOf DispatcherWrapper
     */
    unsub(fn) {
        this.unsubscribe(fn);
    }
    /**
     * Subscribe once to the event with the specified name.
     *
     * @returns {() => void} A function that unsubscribes the event handler from the event.
     *
     * @memberOf DispatcherWrapper
     */
    one(fn) {
        return this._one(fn);
    }
    /**
     * Checks it the event has a subscription for the specified handler.
     *
     * @param {TEventHandler} fn The event handler that is called when the event is dispatched.
     *
     * @memberOf DispatcherWrapper
     */
    has(fn) {
        return this._has(fn);
    }
    /**
     * Clears all the subscriptions.
     *
     * @memberOf DispatcherWrapper
     */
    clear() {
        this._clear();
    }
}
exports.DispatcherWrapper = DispatcherWrapper;


/***/ }),

/***/ 7955:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EventListBase = void 0;
/**
 * Base class for event lists classes. Implements the get and remove.
 *
 * @export
 * @abstract
 * @class EventListBaset
 * @template TEventDispatcher The type of event dispatcher.
 */
class EventListBase {
    constructor() {
        this._events = {};
    }
    /**
     * Gets the dispatcher associated with the name.
     *
     * @param {string} name The name of the event.
     * @returns {TEventDispatcher} The disptacher.
     *
     * @memberOf EventListBase
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
     *
     * @param {string} name
     *
     * @memberOf EventListBase
     */
    remove(name) {
        delete this._events[name];
    }
}
exports.EventListBase = EventListBase;


/***/ }),

/***/ 2490:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PromiseDispatcherBase = void 0;
const __1 = __webpack_require__(3310);
/**
 * Dispatcher base for dispatchers that use promises. Each promise
 * is awaited before the next is dispatched, unless the event is
 * dispatched with the executeAsync flag.
 *
 * @export
 * @abstract
 * @class PromiseDispatcherBase
 * @extends {DispatcherBase<TEventHandler>}
 * @template TEventHandler The type of event handler.
 */
class PromiseDispatcherBase extends __1.DispatcherBase {
    /**
     * The normal dispatch cannot be used in this class.
     *
     * @protected
     * @param {boolean} executeAsync `True` if the even should be executed async.
     * @param {*} scope The scope of the event. The scope becomes the `this` for handler.
     * @param {IArguments} args The arguments for the event.
     * @returns {(IPropagationStatus | null)} The propagation status, or if an `executeAsync` is used `null`.
     *
     * @memberOf DispatcherBase
     */
    _dispatch(executeAsync, scope, args) {
        throw new __1.DispatchError("_dispatch not supported. Use _dispatchAsPromise.");
    }
    /**
     * Crates a new subscription.
     *
     * @protected
     * @param {TEventHandler} handler The handler.
     * @param {boolean} isOnce Indicates if the handler should only run once.
     * @returns {ISubscription<TEventHandler>} The subscription.
     *
     * @memberOf PromiseDispatcherBase
     */
    createSubscription(handler, isOnce) {
        return new __1.PromiseSubscription(handler, isOnce);
    }
    /**
     * Generic dispatch will dispatch the handlers with the given arguments.
     *
     * @protected
     * @param {boolean} executeAsync `True` if the even should be executed async.
     * @param {*} scope The scope of the event. The scope becomes the `this` for handler.
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

/***/ 1002:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SubscriptionChangeEventDispatcher = void 0;
const __1 = __webpack_require__(3310);
/**
 * Dispatcher for subscription changes.
 *
 * @export
 * @class SubscriptionChangeEventDispatcher
 * @extends {DispatcherBase<SubscriptionChangeEventHandler>}
 */
class SubscriptionChangeEventDispatcher extends __1.DispatcherBase {
    /**
     * Dispatches the event.
     *
     * @param {number} count The currrent number of subscriptions.
     *
     * @memberOf SubscriptionChangeEventDispatcher
     */
    dispatch(count) {
        this._dispatch(false, this, arguments);
    }
}
exports.SubscriptionChangeEventDispatcher = SubscriptionChangeEventDispatcher;


/***/ }),

/***/ 9347:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PromiseSubscription = void 0;
/**
 * Subscription implementation for events with promises.
 *
 * @export
 * @class PromiseSubscription
 * @implements {ISubscription<TEventHandler>}
 * @template TEventHandler The type of event handler.
 */
class PromiseSubscription {
    /**
     * Creates an instance of PromiseSubscription.
     * @param {TEventHandler} handler The handler for the subscription.
     * @param {boolean} isOnce Indicates if the handler should only be executed once.
     *
     * @memberOf PromiseSubscription
     */
    constructor(handler, isOnce) {
        this.handler = handler;
        this.isOnce = isOnce;
        /**
         * Indicates if the subscription has been executed before.
         *
         * @memberOf PromiseSubscription
         */
        this.isExecuted = false;
    }
    /**
     * Executes the handler.
     *
     * @param {boolean} executeAsync True if the even should be executed async.
     * @param {*} scope The scope the scope of the event.
     * @param {IArguments} args The arguments for the event.
     *
     * @memberOf PromiseSubscription
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

/***/ 2229:
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

/***/ 1605:
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
 * @template TEventHandler The type of event handler.
 * @template TDispatcher The type of dispatcher.
 * @template TList The type of event list.
 */
class HandlingBase {
    /**
     * Creates an instance of HandlingBase.
     * @param {TList} events The event list. Used for event management.
     *
     * @memberOf HandlingBase
     */
    constructor(events) {
        this.events = events;
    }
    /**
     * Subscribes once to the event with the specified name.
     * @param {string} name The name of the event.
     * @param {TEventHandler} fn The event handler.
     *
     * @memberOf HandlingBase
     */
    one(name, fn) {
        this.events.get(name).one(fn);
    }
    /**
     * Checks it the event has a subscription for the specified handler.
     * @param {string} name The name of the event.
     * @param {TEventHandler} fn The event handler.
     *
     * @memberOf HandlingBase
     */
    has(name, fn) {
        return this.events.get(name).has(fn);
    }
    /**
     * Subscribes to the event with the specified name.
     * @param {string} name The name of the event.
     * @param {TEventHandler} fn The event handler.
     *
     * @memberOf HandlingBase
     */
    subscribe(name, fn) {
        this.events.get(name).subscribe(fn);
    }
    /**
     * Subscribes to the event with the specified name.
     * @param {string} name The name of the event.
     * @param {TEventHandler} fn The event handler.
     *
     * @memberOf HandlingBase
     */
    sub(name, fn) {
        this.subscribe(name, fn);
    }
    /**
     * Unsubscribes from the event with the specified name.
     * @param {string} name The name of the event.
     * @param {TEventHandler} fn The event handler.
     *
     * @memberOf HandlingBase
     */
    unsubscribe(name, fn) {
        this.events.get(name).unsubscribe(fn);
    }
    /**
     * Unsubscribes from the event with the specified name.
     * @param {string} name The name of the event.
     * @param {TEventHandler} fn The event handler.
     *
     * @memberOf HandlingBase
     */
    unsub(name, fn) {
        this.unsubscribe(name, fn);
    }
}
exports.HandlingBase = HandlingBase;


/***/ }),

/***/ 3310:
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
exports.SubscriptionChangeEventDispatcher = exports.HandlingBase = exports.PromiseDispatcherBase = exports.PromiseSubscription = exports.DispatchError = exports.EventManagement = exports.EventListBase = exports.DispatcherWrapper = exports.DispatcherBase = exports.Subscription = void 0;
const DispatcherBase_1 = __webpack_require__(3040);
Object.defineProperty(exports, "DispatcherBase", ({ enumerable: true, get: function () { return DispatcherBase_1.DispatcherBase; } }));
const DispatchError_1 = __webpack_require__(8181);
Object.defineProperty(exports, "DispatchError", ({ enumerable: true, get: function () { return DispatchError_1.DispatchError; } }));
const DispatcherWrapper_1 = __webpack_require__(3122);
Object.defineProperty(exports, "DispatcherWrapper", ({ enumerable: true, get: function () { return DispatcherWrapper_1.DispatcherWrapper; } }));
const EventListBase_1 = __webpack_require__(7955);
Object.defineProperty(exports, "EventListBase", ({ enumerable: true, get: function () { return EventListBase_1.EventListBase; } }));
const EventManagement_1 = __webpack_require__(2234);
Object.defineProperty(exports, "EventManagement", ({ enumerable: true, get: function () { return EventManagement_1.EventManagement; } }));
const HandlingBase_1 = __webpack_require__(1605);
Object.defineProperty(exports, "HandlingBase", ({ enumerable: true, get: function () { return HandlingBase_1.HandlingBase; } }));
const PromiseDispatcherBase_1 = __webpack_require__(2490);
Object.defineProperty(exports, "PromiseDispatcherBase", ({ enumerable: true, get: function () { return PromiseDispatcherBase_1.PromiseDispatcherBase; } }));
const PromiseSubscription_1 = __webpack_require__(9347);
Object.defineProperty(exports, "PromiseSubscription", ({ enumerable: true, get: function () { return PromiseSubscription_1.PromiseSubscription; } }));
const Subscription_1 = __webpack_require__(2229);
Object.defineProperty(exports, "Subscription", ({ enumerable: true, get: function () { return Subscription_1.Subscription; } }));
const SubscriptionChangeEventHandler_1 = __webpack_require__(1002);
Object.defineProperty(exports, "SubscriptionChangeEventDispatcher", ({ enumerable: true, get: function () { return SubscriptionChangeEventHandler_1.SubscriptionChangeEventDispatcher; } }));


/***/ }),

/***/ 2234:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EventManagement = void 0;
/**
 * Allows the user to interact with the event.
 *
 * @export
 * @class EventManagement
 * @implements {IEventManagement}
 */
class EventManagement {
    /**
     * Creates an instance of EventManagement.
     * @param {() => void} unsub An unsubscribe handler.
     *
     * @memberOf EventManagement
     */
    constructor(unsub) {
        this.unsub = unsub;
        this.propagationStopped = false;
    }
    /**
     * Stops the propagation of the event.
     * Cannot be used when async dispatch is done.
     *
     * @memberOf EventManagement
     */
    stopPropagation() {
        this.propagationStopped = true;
    }
}
exports.EventManagement = EventManagement;


/***/ }),

/***/ 3861:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "ZP": () => (/* binding */ tippy_esm)
});

// UNUSED EXPORTS: animateFill, createSingleton, delegate, followCursor, hideAll, inlinePositioning, roundArrow, sticky

;// CONCATENATED MODULE: ./node_modules/@popperjs/core/lib/dom-utils/getWindow.js
function getWindow(node) {
  if (node == null) {
    return window;
  }

  if (node.toString() !== '[object Window]') {
    var ownerDocument = node.ownerDocument;
    return ownerDocument ? ownerDocument.defaultView || window : window;
  }

  return node;
}
;// CONCATENATED MODULE: ./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js


function isElement(node) {
  var OwnElement = getWindow(node).Element;
  return node instanceof OwnElement || node instanceof Element;
}

function isHTMLElement(node) {
  var OwnElement = getWindow(node).HTMLElement;
  return node instanceof OwnElement || node instanceof HTMLElement;
}

function isShadowRoot(node) {
  // IE 11 has no ShadowRoot
  if (typeof ShadowRoot === 'undefined') {
    return false;
  }

  var OwnElement = getWindow(node).ShadowRoot;
  return node instanceof OwnElement || node instanceof ShadowRoot;
}


;// CONCATENATED MODULE: ./node_modules/@popperjs/core/lib/utils/math.js
var math_max = Math.max;
var math_min = Math.min;
var round = Math.round;
;// CONCATENATED MODULE: ./node_modules/@popperjs/core/lib/dom-utils/getBoundingClientRect.js


function getBoundingClientRect(element, includeScale) {
  if (includeScale === void 0) {
    includeScale = false;
  }

  var rect = element.getBoundingClientRect();
  var scaleX = 1;
  var scaleY = 1;

  if (isHTMLElement(element) && includeScale) {
    var offsetHeight = element.offsetHeight;
    var offsetWidth = element.offsetWidth; // Do not attempt to divide by 0, otherwise we get `Infinity` as scale
    // Fallback to 1 in case both values are `0`

    if (offsetWidth > 0) {
      scaleX = round(rect.width) / offsetWidth || 1;
    }

    if (offsetHeight > 0) {
      scaleY = round(rect.height) / offsetHeight || 1;
    }
  }

  return {
    width: rect.width / scaleX,
    height: rect.height / scaleY,
    top: rect.top / scaleY,
    right: rect.right / scaleX,
    bottom: rect.bottom / scaleY,
    left: rect.left / scaleX,
    x: rect.left / scaleX,
    y: rect.top / scaleY
  };
}
;// CONCATENATED MODULE: ./node_modules/@popperjs/core/lib/dom-utils/getWindowScroll.js

function getWindowScroll(node) {
  var win = getWindow(node);
  var scrollLeft = win.pageXOffset;
  var scrollTop = win.pageYOffset;
  return {
    scrollLeft: scrollLeft,
    scrollTop: scrollTop
  };
}
;// CONCATENATED MODULE: ./node_modules/@popperjs/core/lib/dom-utils/getHTMLElementScroll.js
function getHTMLElementScroll(element) {
  return {
    scrollLeft: element.scrollLeft,
    scrollTop: element.scrollTop
  };
}
;// CONCATENATED MODULE: ./node_modules/@popperjs/core/lib/dom-utils/getNodeScroll.js




function getNodeScroll(node) {
  if (node === getWindow(node) || !isHTMLElement(node)) {
    return getWindowScroll(node);
  } else {
    return getHTMLElementScroll(node);
  }
}
;// CONCATENATED MODULE: ./node_modules/@popperjs/core/lib/dom-utils/getNodeName.js
function getNodeName(element) {
  return element ? (element.nodeName || '').toLowerCase() : null;
}
;// CONCATENATED MODULE: ./node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js

function getDocumentElement(element) {
  // $FlowFixMe[incompatible-return]: assume body is always available
  return ((isElement(element) ? element.ownerDocument : // $FlowFixMe[prop-missing]
  element.document) || window.document).documentElement;
}
;// CONCATENATED MODULE: ./node_modules/@popperjs/core/lib/dom-utils/getWindowScrollBarX.js



function getWindowScrollBarX(element) {
  // If <html> has a CSS width greater than the viewport, then this will be
  // incorrect for RTL.
  // Popper 1 is broken in this case and never had a bug report so let's assume
  // it's not an issue. I don't think anyone ever specifies width on <html>
  // anyway.
  // Browsers where the left scrollbar doesn't cause an issue report `0` for
  // this (e.g. Edge 2019, IE11, Safari)
  return getBoundingClientRect(getDocumentElement(element)).left + getWindowScroll(element).scrollLeft;
}
;// CONCATENATED MODULE: ./node_modules/@popperjs/core/lib/dom-utils/getComputedStyle.js

function getComputedStyle(element) {
  return getWindow(element).getComputedStyle(element);
}
;// CONCATENATED MODULE: ./node_modules/@popperjs/core/lib/dom-utils/isScrollParent.js

function isScrollParent(element) {
  // Firefox wants us to check `-x` and `-y` variations as well
  var _getComputedStyle = getComputedStyle(element),
      overflow = _getComputedStyle.overflow,
      overflowX = _getComputedStyle.overflowX,
      overflowY = _getComputedStyle.overflowY;

  return /auto|scroll|overlay|hidden/.test(overflow + overflowY + overflowX);
}
;// CONCATENATED MODULE: ./node_modules/@popperjs/core/lib/dom-utils/getCompositeRect.js









function isElementScaled(element) {
  var rect = element.getBoundingClientRect();
  var scaleX = round(rect.width) / element.offsetWidth || 1;
  var scaleY = round(rect.height) / element.offsetHeight || 1;
  return scaleX !== 1 || scaleY !== 1;
} // Returns the composite rect of an element relative to its offsetParent.
// Composite means it takes into account transforms as well as layout.


function getCompositeRect(elementOrVirtualElement, offsetParent, isFixed) {
  if (isFixed === void 0) {
    isFixed = false;
  }

  var isOffsetParentAnElement = isHTMLElement(offsetParent);
  var offsetParentIsScaled = isHTMLElement(offsetParent) && isElementScaled(offsetParent);
  var documentElement = getDocumentElement(offsetParent);
  var rect = getBoundingClientRect(elementOrVirtualElement, offsetParentIsScaled);
  var scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  var offsets = {
    x: 0,
    y: 0
  };

  if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
    if (getNodeName(offsetParent) !== 'body' || // https://github.com/popperjs/popper-core/issues/1078
    isScrollParent(documentElement)) {
      scroll = getNodeScroll(offsetParent);
    }

    if (isHTMLElement(offsetParent)) {
      offsets = getBoundingClientRect(offsetParent, true);
      offsets.x += offsetParent.clientLeft;
      offsets.y += offsetParent.clientTop;
    } else if (documentElement) {
      offsets.x = getWindowScrollBarX(documentElement);
    }
  }

  return {
    x: rect.left + scroll.scrollLeft - offsets.x,
    y: rect.top + scroll.scrollTop - offsets.y,
    width: rect.width,
    height: rect.height
  };
}
;// CONCATENATED MODULE: ./node_modules/@popperjs/core/lib/dom-utils/getLayoutRect.js
 // Returns the layout rect of an element relative to its offsetParent. Layout
// means it doesn't take into account transforms.

function getLayoutRect(element) {
  var clientRect = getBoundingClientRect(element); // Use the clientRect sizes if it's not been transformed.
  // Fixes https://github.com/popperjs/popper-core/issues/1223

  var width = element.offsetWidth;
  var height = element.offsetHeight;

  if (Math.abs(clientRect.width - width) <= 1) {
    width = clientRect.width;
  }

  if (Math.abs(clientRect.height - height) <= 1) {
    height = clientRect.height;
  }

  return {
    x: element.offsetLeft,
    y: element.offsetTop,
    width: width,
    height: height
  };
}
;// CONCATENATED MODULE: ./node_modules/@popperjs/core/lib/dom-utils/getParentNode.js



function getParentNode(element) {
  if (getNodeName(element) === 'html') {
    return element;
  }

  return (// this is a quicker (but less type safe) way to save quite some bytes from the bundle
    // $FlowFixMe[incompatible-return]
    // $FlowFixMe[prop-missing]
    element.assignedSlot || // step into the shadow DOM of the parent of a slotted node
    element.parentNode || ( // DOM Element detected
    isShadowRoot(element) ? element.host : null) || // ShadowRoot detected
    // $FlowFixMe[incompatible-call]: HTMLElement is a Node
    getDocumentElement(element) // fallback

  );
}
;// CONCATENATED MODULE: ./node_modules/@popperjs/core/lib/dom-utils/getScrollParent.js




function getScrollParent(node) {
  if (['html', 'body', '#document'].indexOf(getNodeName(node)) >= 0) {
    // $FlowFixMe[incompatible-return]: assume body is always available
    return node.ownerDocument.body;
  }

  if (isHTMLElement(node) && isScrollParent(node)) {
    return node;
  }

  return getScrollParent(getParentNode(node));
}
;// CONCATENATED MODULE: ./node_modules/@popperjs/core/lib/dom-utils/listScrollParents.js




/*
given a DOM element, return the list of all scroll parents, up the list of ancesors
until we get to the top window object. This list is what we attach scroll listeners
to, because if any of these parent elements scroll, we'll need to re-calculate the
reference element's position.
*/

function listScrollParents(element, list) {
  var _element$ownerDocumen;

  if (list === void 0) {
    list = [];
  }

  var scrollParent = getScrollParent(element);
  var isBody = scrollParent === ((_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body);
  var win = getWindow(scrollParent);
  var target = isBody ? [win].concat(win.visualViewport || [], isScrollParent(scrollParent) ? scrollParent : []) : scrollParent;
  var updatedList = list.concat(target);
  return isBody ? updatedList : // $FlowFixMe[incompatible-call]: isBody tells us target will be an HTMLElement here
  updatedList.concat(listScrollParents(getParentNode(target)));
}
;// CONCATENATED MODULE: ./node_modules/@popperjs/core/lib/dom-utils/isTableElement.js

function isTableElement(element) {
  return ['table', 'td', 'th'].indexOf(getNodeName(element)) >= 0;
}
;// CONCATENATED MODULE: ./node_modules/@popperjs/core/lib/dom-utils/getOffsetParent.js







function getTrueOffsetParent(element) {
  if (!isHTMLElement(element) || // https://github.com/popperjs/popper-core/issues/837
  getComputedStyle(element).position === 'fixed') {
    return null;
  }

  return element.offsetParent;
} // `.offsetParent` reports `null` for fixed elements, while absolute elements
// return the containing block


function getContainingBlock(element) {
  var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') !== -1;
  var isIE = navigator.userAgent.indexOf('Trident') !== -1;

  if (isIE && isHTMLElement(element)) {
    // In IE 9, 10 and 11 fixed elements containing block is always established by the viewport
    var elementCss = getComputedStyle(element);

    if (elementCss.position === 'fixed') {
      return null;
    }
  }

  var currentNode = getParentNode(element);

  while (isHTMLElement(currentNode) && ['html', 'body'].indexOf(getNodeName(currentNode)) < 0) {
    var css = getComputedStyle(currentNode); // This is non-exhaustive but covers the most common CSS properties that
    // create a containing block.
    // https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block

    if (css.transform !== 'none' || css.perspective !== 'none' || css.contain === 'paint' || ['transform', 'perspective'].indexOf(css.willChange) !== -1 || isFirefox && css.willChange === 'filter' || isFirefox && css.filter && css.filter !== 'none') {
      return currentNode;
    } else {
      currentNode = currentNode.parentNode;
    }
  }

  return null;
} // Gets the closest ancestor positioned element. Handles some edge cases,
// such as table ancestors and cross browser bugs.


function getOffsetParent(element) {
  var window = getWindow(element);
  var offsetParent = getTrueOffsetParent(element);

  while (offsetParent && isTableElement(offsetParent) && getComputedStyle(offsetParent).position === 'static') {
    offsetParent = getTrueOffsetParent(offsetParent);
  }

  if (offsetParent && (getNodeName(offsetParent) === 'html' || getNodeName(offsetParent) === 'body' && getComputedStyle(offsetParent).position === 'static')) {
    return window;
  }

  return offsetParent || getContainingBlock(element) || window;
}
;// CONCATENATED MODULE: ./node_modules/@popperjs/core/lib/enums.js
var enums_top = 'top';
var bottom = 'bottom';
var right = 'right';
var left = 'left';
var auto = 'auto';
var basePlacements = [enums_top, bottom, right, left];
var start = 'start';
var end = 'end';
var clippingParents = 'clippingParents';
var viewport = 'viewport';
var popper = 'popper';
var reference = 'reference';
var variationPlacements = /*#__PURE__*/basePlacements.reduce(function (acc, placement) {
  return acc.concat([placement + "-" + start, placement + "-" + end]);
}, []);
var enums_placements = /*#__PURE__*/[].concat(basePlacements, [auto]).reduce(function (acc, placement) {
  return acc.concat([placement, placement + "-" + start, placement + "-" + end]);
}, []); // modifiers that need to read the DOM

var beforeRead = 'beforeRead';
var read = 'read';
var afterRead = 'afterRead'; // pure-logic modifiers

var beforeMain = 'beforeMain';
var main = 'main';
var afterMain = 'afterMain'; // modifier with the purpose to write to the DOM (or write into a framework state)

var beforeWrite = 'beforeWrite';
var write = 'write';
var afterWrite = 'afterWrite';
var modifierPhases = [beforeRead, read, afterRead, beforeMain, main, afterMain, beforeWrite, write, afterWrite];
;// CONCATENATED MODULE: ./node_modules/@popperjs/core/lib/utils/orderModifiers.js
 // source: https://stackoverflow.com/questions/49875255

function order(modifiers) {
  var map = new Map();
  var visited = new Set();
  var result = [];
  modifiers.forEach(function (modifier) {
    map.set(modifier.name, modifier);
  }); // On visiting object, check for its dependencies and visit them recursively

  function sort(modifier) {
    visited.add(modifier.name);
    var requires = [].concat(modifier.requires || [], modifier.requiresIfExists || []);
    requires.forEach(function (dep) {
      if (!visited.has(dep)) {
        var depModifier = map.get(dep);

        if (depModifier) {
          sort(depModifier);
        }
      }
    });
    result.push(modifier);
  }

  modifiers.forEach(function (modifier) {
    if (!visited.has(modifier.name)) {
      // check for visited object
      sort(modifier);
    }
  });
  return result;
}

function orderModifiers(modifiers) {
  // order based on dependencies
  var orderedModifiers = order(modifiers); // order based on phase

  return modifierPhases.reduce(function (acc, phase) {
    return acc.concat(orderedModifiers.filter(function (modifier) {
      return modifier.phase === phase;
    }));
  }, []);
}
;// CONCATENATED MODULE: ./node_modules/@popperjs/core/lib/utils/debounce.js
function debounce(fn) {
  var pending;
  return function () {
    if (!pending) {
      pending = new Promise(function (resolve) {
        Promise.resolve().then(function () {
          pending = undefined;
          resolve(fn());
        });
      });
    }

    return pending;
  };
}
;// CONCATENATED MODULE: ./node_modules/@popperjs/core/lib/utils/mergeByName.js
function mergeByName(modifiers) {
  var merged = modifiers.reduce(function (merged, current) {
    var existing = merged[current.name];
    merged[current.name] = existing ? Object.assign({}, existing, current, {
      options: Object.assign({}, existing.options, current.options),
      data: Object.assign({}, existing.data, current.data)
    }) : current;
    return merged;
  }, {}); // IE11 does not support Object.values

  return Object.keys(merged).map(function (key) {
    return merged[key];
  });
}
;// CONCATENATED MODULE: ./node_modules/@popperjs/core/lib/createPopper.js














var INVALID_ELEMENT_ERROR = 'Popper: Invalid reference or popper argument provided. They must be either a DOM element or virtual element.';
var INFINITE_LOOP_ERROR = 'Popper: An infinite loop in the modifiers cycle has been detected! The cycle has been interrupted to prevent a browser crash.';
var DEFAULT_OPTIONS = {
  placement: 'bottom',
  modifiers: [],
  strategy: 'absolute'
};

function areValidElements() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return !args.some(function (element) {
    return !(element && typeof element.getBoundingClientRect === 'function');
  });
}

function popperGenerator(generatorOptions) {
  if (generatorOptions === void 0) {
    generatorOptions = {};
  }

  var _generatorOptions = generatorOptions,
      _generatorOptions$def = _generatorOptions.defaultModifiers,
      defaultModifiers = _generatorOptions$def === void 0 ? [] : _generatorOptions$def,
      _generatorOptions$def2 = _generatorOptions.defaultOptions,
      defaultOptions = _generatorOptions$def2 === void 0 ? DEFAULT_OPTIONS : _generatorOptions$def2;
  return function createPopper(reference, popper, options) {
    if (options === void 0) {
      options = defaultOptions;
    }

    var state = {
      placement: 'bottom',
      orderedModifiers: [],
      options: Object.assign({}, DEFAULT_OPTIONS, defaultOptions),
      modifiersData: {},
      elements: {
        reference: reference,
        popper: popper
      },
      attributes: {},
      styles: {}
    };
    var effectCleanupFns = [];
    var isDestroyed = false;
    var instance = {
      state: state,
      setOptions: function setOptions(setOptionsAction) {
        var options = typeof setOptionsAction === 'function' ? setOptionsAction(state.options) : setOptionsAction;
        cleanupModifierEffects();
        state.options = Object.assign({}, defaultOptions, state.options, options);
        state.scrollParents = {
          reference: isElement(reference) ? listScrollParents(reference) : reference.contextElement ? listScrollParents(reference.contextElement) : [],
          popper: listScrollParents(popper)
        }; // Orders the modifiers based on their dependencies and `phase`
        // properties

        var orderedModifiers = orderModifiers(mergeByName([].concat(defaultModifiers, state.options.modifiers))); // Strip out disabled modifiers

        state.orderedModifiers = orderedModifiers.filter(function (m) {
          return m.enabled;
        }); // Validate the provided modifiers so that the consumer will get warned
        // if one of the modifiers is invalid for any reason

        if (false) { var _getComputedStyle, marginTop, marginRight, marginBottom, marginLeft, flipModifier, modifiers; }

        runModifierEffects();
        return instance.update();
      },
      // Sync update – it will always be executed, even if not necessary. This
      // is useful for low frequency updates where sync behavior simplifies the
      // logic.
      // For high frequency updates (e.g. `resize` and `scroll` events), always
      // prefer the async Popper#update method
      forceUpdate: function forceUpdate() {
        if (isDestroyed) {
          return;
        }

        var _state$elements = state.elements,
            reference = _state$elements.reference,
            popper = _state$elements.popper; // Don't proceed if `reference` or `popper` are not valid elements
        // anymore

        if (!areValidElements(reference, popper)) {
          if (false) {}

          return;
        } // Store the reference and popper rects to be read by modifiers


        state.rects = {
          reference: getCompositeRect(reference, getOffsetParent(popper), state.options.strategy === 'fixed'),
          popper: getLayoutRect(popper)
        }; // Modifiers have the ability to reset the current update cycle. The
        // most common use case for this is the `flip` modifier changing the
        // placement, which then needs to re-run all the modifiers, because the
        // logic was previously ran for the previous placement and is therefore
        // stale/incorrect

        state.reset = false;
        state.placement = state.options.placement; // On each update cycle, the `modifiersData` property for each modifier
        // is filled with the initial data specified by the modifier. This means
        // it doesn't persist and is fresh on each update.
        // To ensure persistent data, use `${name}#persistent`

        state.orderedModifiers.forEach(function (modifier) {
          return state.modifiersData[modifier.name] = Object.assign({}, modifier.data);
        });
        var __debug_loops__ = 0;

        for (var index = 0; index < state.orderedModifiers.length; index++) {
          if (false) {}

          if (state.reset === true) {
            state.reset = false;
            index = -1;
            continue;
          }

          var _state$orderedModifie = state.orderedModifiers[index],
              fn = _state$orderedModifie.fn,
              _state$orderedModifie2 = _state$orderedModifie.options,
              _options = _state$orderedModifie2 === void 0 ? {} : _state$orderedModifie2,
              name = _state$orderedModifie.name;

          if (typeof fn === 'function') {
            state = fn({
              state: state,
              options: _options,
              name: name,
              instance: instance
            }) || state;
          }
        }
      },
      // Async and optimistically optimized update – it will not be executed if
      // not necessary (debounced to run at most once-per-tick)
      update: debounce(function () {
        return new Promise(function (resolve) {
          instance.forceUpdate();
          resolve(state);
        });
      }),
      destroy: function destroy() {
        cleanupModifierEffects();
        isDestroyed = true;
      }
    };

    if (!areValidElements(reference, popper)) {
      if (false) {}

      return instance;
    }

    instance.setOptions(options).then(function (state) {
      if (!isDestroyed && options.onFirstUpdate) {
        options.onFirstUpdate(state);
      }
    }); // Modifiers have the ability to execute arbitrary code before the first
    // update cycle runs. They will be executed in the same order as the update
    // cycle. This is useful when a modifier adds some persistent data that
    // other modifiers need to use, but the modifier is run after the dependent
    // one.

    function runModifierEffects() {
      state.orderedModifiers.forEach(function (_ref3) {
        var name = _ref3.name,
            _ref3$options = _ref3.options,
            options = _ref3$options === void 0 ? {} : _ref3$options,
            effect = _ref3.effect;

        if (typeof effect === 'function') {
          var cleanupFn = effect({
            state: state,
            name: name,
            instance: instance,
            options: options
          });

          var noopFn = function noopFn() {};

          effectCleanupFns.push(cleanupFn || noopFn);
        }
      });
    }

    function cleanupModifierEffects() {
      effectCleanupFns.forEach(function (fn) {
        return fn();
      });
      effectCleanupFns = [];
    }

    return instance;
  };
}
var createPopper = /*#__PURE__*/(/* unused pure expression or super */ null && (popperGenerator())); // eslint-disable-next-line import/no-unused-modules


;// CONCATENATED MODULE: ./node_modules/@popperjs/core/lib/modifiers/eventListeners.js
 // eslint-disable-next-line import/no-unused-modules

var passive = {
  passive: true
};

function effect(_ref) {
  var state = _ref.state,
      instance = _ref.instance,
      options = _ref.options;
  var _options$scroll = options.scroll,
      scroll = _options$scroll === void 0 ? true : _options$scroll,
      _options$resize = options.resize,
      resize = _options$resize === void 0 ? true : _options$resize;
  var window = getWindow(state.elements.popper);
  var scrollParents = [].concat(state.scrollParents.reference, state.scrollParents.popper);

  if (scroll) {
    scrollParents.forEach(function (scrollParent) {
      scrollParent.addEventListener('scroll', instance.update, passive);
    });
  }

  if (resize) {
    window.addEventListener('resize', instance.update, passive);
  }

  return function () {
    if (scroll) {
      scrollParents.forEach(function (scrollParent) {
        scrollParent.removeEventListener('scroll', instance.update, passive);
      });
    }

    if (resize) {
      window.removeEventListener('resize', instance.update, passive);
    }
  };
} // eslint-disable-next-line import/no-unused-modules


/* harmony default export */ const eventListeners = ({
  name: 'eventListeners',
  enabled: true,
  phase: 'write',
  fn: function fn() {},
  effect: effect,
  data: {}
});
;// CONCATENATED MODULE: ./node_modules/@popperjs/core/lib/utils/getBasePlacement.js

function getBasePlacement(placement) {
  return placement.split('-')[0];
}
;// CONCATENATED MODULE: ./node_modules/@popperjs/core/lib/utils/getVariation.js
function getVariation(placement) {
  return placement.split('-')[1];
}
;// CONCATENATED MODULE: ./node_modules/@popperjs/core/lib/utils/getMainAxisFromPlacement.js
function getMainAxisFromPlacement(placement) {
  return ['top', 'bottom'].indexOf(placement) >= 0 ? 'x' : 'y';
}
;// CONCATENATED MODULE: ./node_modules/@popperjs/core/lib/utils/computeOffsets.js




function computeOffsets(_ref) {
  var reference = _ref.reference,
      element = _ref.element,
      placement = _ref.placement;
  var basePlacement = placement ? getBasePlacement(placement) : null;
  var variation = placement ? getVariation(placement) : null;
  var commonX = reference.x + reference.width / 2 - element.width / 2;
  var commonY = reference.y + reference.height / 2 - element.height / 2;
  var offsets;

  switch (basePlacement) {
    case enums_top:
      offsets = {
        x: commonX,
        y: reference.y - element.height
      };
      break;

    case bottom:
      offsets = {
        x: commonX,
        y: reference.y + reference.height
      };
      break;

    case right:
      offsets = {
        x: reference.x + reference.width,
        y: commonY
      };
      break;

    case left:
      offsets = {
        x: reference.x - element.width,
        y: commonY
      };
      break;

    default:
      offsets = {
        x: reference.x,
        y: reference.y
      };
  }

  var mainAxis = basePlacement ? getMainAxisFromPlacement(basePlacement) : null;

  if (mainAxis != null) {
    var len = mainAxis === 'y' ? 'height' : 'width';

    switch (variation) {
      case start:
        offsets[mainAxis] = offsets[mainAxis] - (reference[len] / 2 - element[len] / 2);
        break;

      case end:
        offsets[mainAxis] = offsets[mainAxis] + (reference[len] / 2 - element[len] / 2);
        break;

      default:
    }
  }

  return offsets;
}
;// CONCATENATED MODULE: ./node_modules/@popperjs/core/lib/modifiers/popperOffsets.js


function popperOffsets(_ref) {
  var state = _ref.state,
      name = _ref.name;
  // Offsets are the actual position the popper needs to have to be
  // properly positioned near its reference element
  // This is the most basic placement, and will be adjusted by
  // the modifiers in the next step
  state.modifiersData[name] = computeOffsets({
    reference: state.rects.reference,
    element: state.rects.popper,
    strategy: 'absolute',
    placement: state.placement
  });
} // eslint-disable-next-line import/no-unused-modules


/* harmony default export */ const modifiers_popperOffsets = ({
  name: 'popperOffsets',
  enabled: true,
  phase: 'read',
  fn: popperOffsets,
  data: {}
});
;// CONCATENATED MODULE: ./node_modules/@popperjs/core/lib/modifiers/computeStyles.js







 // eslint-disable-next-line import/no-unused-modules

var unsetSides = {
  top: 'auto',
  right: 'auto',
  bottom: 'auto',
  left: 'auto'
}; // Round the offsets to the nearest suitable subpixel based on the DPR.
// Zooming can change the DPR, but it seems to report a value that will
// cleanly divide the values into the appropriate subpixels.

function roundOffsetsByDPR(_ref) {
  var x = _ref.x,
      y = _ref.y;
  var win = window;
  var dpr = win.devicePixelRatio || 1;
  return {
    x: round(x * dpr) / dpr || 0,
    y: round(y * dpr) / dpr || 0
  };
}

function mapToStyles(_ref2) {
  var _Object$assign2;

  var popper = _ref2.popper,
      popperRect = _ref2.popperRect,
      placement = _ref2.placement,
      variation = _ref2.variation,
      offsets = _ref2.offsets,
      position = _ref2.position,
      gpuAcceleration = _ref2.gpuAcceleration,
      adaptive = _ref2.adaptive,
      roundOffsets = _ref2.roundOffsets,
      isFixed = _ref2.isFixed;
  var _offsets$x = offsets.x,
      x = _offsets$x === void 0 ? 0 : _offsets$x,
      _offsets$y = offsets.y,
      y = _offsets$y === void 0 ? 0 : _offsets$y;

  var _ref3 = typeof roundOffsets === 'function' ? roundOffsets({
    x: x,
    y: y
  }) : {
    x: x,
    y: y
  };

  x = _ref3.x;
  y = _ref3.y;
  var hasX = offsets.hasOwnProperty('x');
  var hasY = offsets.hasOwnProperty('y');
  var sideX = left;
  var sideY = enums_top;
  var win = window;

  if (adaptive) {
    var offsetParent = getOffsetParent(popper);
    var heightProp = 'clientHeight';
    var widthProp = 'clientWidth';

    if (offsetParent === getWindow(popper)) {
      offsetParent = getDocumentElement(popper);

      if (getComputedStyle(offsetParent).position !== 'static' && position === 'absolute') {
        heightProp = 'scrollHeight';
        widthProp = 'scrollWidth';
      }
    } // $FlowFixMe[incompatible-cast]: force type refinement, we compare offsetParent with window above, but Flow doesn't detect it


    offsetParent = offsetParent;

    if (placement === enums_top || (placement === left || placement === right) && variation === end) {
      sideY = bottom;
      var offsetY = isFixed && win.visualViewport ? win.visualViewport.height : // $FlowFixMe[prop-missing]
      offsetParent[heightProp];
      y -= offsetY - popperRect.height;
      y *= gpuAcceleration ? 1 : -1;
    }

    if (placement === left || (placement === enums_top || placement === bottom) && variation === end) {
      sideX = right;
      var offsetX = isFixed && win.visualViewport ? win.visualViewport.width : // $FlowFixMe[prop-missing]
      offsetParent[widthProp];
      x -= offsetX - popperRect.width;
      x *= gpuAcceleration ? 1 : -1;
    }
  }

  var commonStyles = Object.assign({
    position: position
  }, adaptive && unsetSides);

  var _ref4 = roundOffsets === true ? roundOffsetsByDPR({
    x: x,
    y: y
  }) : {
    x: x,
    y: y
  };

  x = _ref4.x;
  y = _ref4.y;

  if (gpuAcceleration) {
    var _Object$assign;

    return Object.assign({}, commonStyles, (_Object$assign = {}, _Object$assign[sideY] = hasY ? '0' : '', _Object$assign[sideX] = hasX ? '0' : '', _Object$assign.transform = (win.devicePixelRatio || 1) <= 1 ? "translate(" + x + "px, " + y + "px)" : "translate3d(" + x + "px, " + y + "px, 0)", _Object$assign));
  }

  return Object.assign({}, commonStyles, (_Object$assign2 = {}, _Object$assign2[sideY] = hasY ? y + "px" : '', _Object$assign2[sideX] = hasX ? x + "px" : '', _Object$assign2.transform = '', _Object$assign2));
}

function computeStyles(_ref5) {
  var state = _ref5.state,
      options = _ref5.options;
  var _options$gpuAccelerat = options.gpuAcceleration,
      gpuAcceleration = _options$gpuAccelerat === void 0 ? true : _options$gpuAccelerat,
      _options$adaptive = options.adaptive,
      adaptive = _options$adaptive === void 0 ? true : _options$adaptive,
      _options$roundOffsets = options.roundOffsets,
      roundOffsets = _options$roundOffsets === void 0 ? true : _options$roundOffsets;

  if (false) { var transitionProperty; }

  var commonStyles = {
    placement: getBasePlacement(state.placement),
    variation: getVariation(state.placement),
    popper: state.elements.popper,
    popperRect: state.rects.popper,
    gpuAcceleration: gpuAcceleration,
    isFixed: state.options.strategy === 'fixed'
  };

  if (state.modifiersData.popperOffsets != null) {
    state.styles.popper = Object.assign({}, state.styles.popper, mapToStyles(Object.assign({}, commonStyles, {
      offsets: state.modifiersData.popperOffsets,
      position: state.options.strategy,
      adaptive: adaptive,
      roundOffsets: roundOffsets
    })));
  }

  if (state.modifiersData.arrow != null) {
    state.styles.arrow = Object.assign({}, state.styles.arrow, mapToStyles(Object.assign({}, commonStyles, {
      offsets: state.modifiersData.arrow,
      position: 'absolute',
      adaptive: false,
      roundOffsets: roundOffsets
    })));
  }

  state.attributes.popper = Object.assign({}, state.attributes.popper, {
    'data-popper-placement': state.placement
  });
} // eslint-disable-next-line import/no-unused-modules


/* harmony default export */ const modifiers_computeStyles = ({
  name: 'computeStyles',
  enabled: true,
  phase: 'beforeWrite',
  fn: computeStyles,
  data: {}
});
;// CONCATENATED MODULE: ./node_modules/@popperjs/core/lib/modifiers/applyStyles.js

 // This modifier takes the styles prepared by the `computeStyles` modifier
// and applies them to the HTMLElements such as popper and arrow

function applyStyles(_ref) {
  var state = _ref.state;
  Object.keys(state.elements).forEach(function (name) {
    var style = state.styles[name] || {};
    var attributes = state.attributes[name] || {};
    var element = state.elements[name]; // arrow is optional + virtual elements

    if (!isHTMLElement(element) || !getNodeName(element)) {
      return;
    } // Flow doesn't support to extend this property, but it's the most
    // effective way to apply styles to an HTMLElement
    // $FlowFixMe[cannot-write]


    Object.assign(element.style, style);
    Object.keys(attributes).forEach(function (name) {
      var value = attributes[name];

      if (value === false) {
        element.removeAttribute(name);
      } else {
        element.setAttribute(name, value === true ? '' : value);
      }
    });
  });
}

function applyStyles_effect(_ref2) {
  var state = _ref2.state;
  var initialStyles = {
    popper: {
      position: state.options.strategy,
      left: '0',
      top: '0',
      margin: '0'
    },
    arrow: {
      position: 'absolute'
    },
    reference: {}
  };
  Object.assign(state.elements.popper.style, initialStyles.popper);
  state.styles = initialStyles;

  if (state.elements.arrow) {
    Object.assign(state.elements.arrow.style, initialStyles.arrow);
  }

  return function () {
    Object.keys(state.elements).forEach(function (name) {
      var element = state.elements[name];
      var attributes = state.attributes[name] || {};
      var styleProperties = Object.keys(state.styles.hasOwnProperty(name) ? state.styles[name] : initialStyles[name]); // Set all values to an empty string to unset them

      var style = styleProperties.reduce(function (style, property) {
        style[property] = '';
        return style;
      }, {}); // arrow is optional + virtual elements

      if (!isHTMLElement(element) || !getNodeName(element)) {
        return;
      }

      Object.assign(element.style, style);
      Object.keys(attributes).forEach(function (attribute) {
        element.removeAttribute(attribute);
      });
    });
  };
} // eslint-disable-next-line import/no-unused-modules


/* harmony default export */ const modifiers_applyStyles = ({
  name: 'applyStyles',
  enabled: true,
  phase: 'write',
  fn: applyStyles,
  effect: applyStyles_effect,
  requires: ['computeStyles']
});
;// CONCATENATED MODULE: ./node_modules/@popperjs/core/lib/modifiers/offset.js

 // eslint-disable-next-line import/no-unused-modules

function distanceAndSkiddingToXY(placement, rects, offset) {
  var basePlacement = getBasePlacement(placement);
  var invertDistance = [left, enums_top].indexOf(basePlacement) >= 0 ? -1 : 1;

  var _ref = typeof offset === 'function' ? offset(Object.assign({}, rects, {
    placement: placement
  })) : offset,
      skidding = _ref[0],
      distance = _ref[1];

  skidding = skidding || 0;
  distance = (distance || 0) * invertDistance;
  return [left, right].indexOf(basePlacement) >= 0 ? {
    x: distance,
    y: skidding
  } : {
    x: skidding,
    y: distance
  };
}

function offset(_ref2) {
  var state = _ref2.state,
      options = _ref2.options,
      name = _ref2.name;
  var _options$offset = options.offset,
      offset = _options$offset === void 0 ? [0, 0] : _options$offset;
  var data = enums_placements.reduce(function (acc, placement) {
    acc[placement] = distanceAndSkiddingToXY(placement, state.rects, offset);
    return acc;
  }, {});
  var _data$state$placement = data[state.placement],
      x = _data$state$placement.x,
      y = _data$state$placement.y;

  if (state.modifiersData.popperOffsets != null) {
    state.modifiersData.popperOffsets.x += x;
    state.modifiersData.popperOffsets.y += y;
  }

  state.modifiersData[name] = data;
} // eslint-disable-next-line import/no-unused-modules


/* harmony default export */ const modifiers_offset = ({
  name: 'offset',
  enabled: true,
  phase: 'main',
  requires: ['popperOffsets'],
  fn: offset
});
;// CONCATENATED MODULE: ./node_modules/@popperjs/core/lib/utils/getOppositePlacement.js
var hash = {
  left: 'right',
  right: 'left',
  bottom: 'top',
  top: 'bottom'
};
function getOppositePlacement(placement) {
  return placement.replace(/left|right|bottom|top/g, function (matched) {
    return hash[matched];
  });
}
;// CONCATENATED MODULE: ./node_modules/@popperjs/core/lib/utils/getOppositeVariationPlacement.js
var getOppositeVariationPlacement_hash = {
  start: 'end',
  end: 'start'
};
function getOppositeVariationPlacement(placement) {
  return placement.replace(/start|end/g, function (matched) {
    return getOppositeVariationPlacement_hash[matched];
  });
}
;// CONCATENATED MODULE: ./node_modules/@popperjs/core/lib/dom-utils/getViewportRect.js



function getViewportRect(element) {
  var win = getWindow(element);
  var html = getDocumentElement(element);
  var visualViewport = win.visualViewport;
  var width = html.clientWidth;
  var height = html.clientHeight;
  var x = 0;
  var y = 0; // NB: This isn't supported on iOS <= 12. If the keyboard is open, the popper
  // can be obscured underneath it.
  // Also, `html.clientHeight` adds the bottom bar height in Safari iOS, even
  // if it isn't open, so if this isn't available, the popper will be detected
  // to overflow the bottom of the screen too early.

  if (visualViewport) {
    width = visualViewport.width;
    height = visualViewport.height; // Uses Layout Viewport (like Chrome; Safari does not currently)
    // In Chrome, it returns a value very close to 0 (+/-) but contains rounding
    // errors due to floating point numbers, so we need to check precision.
    // Safari returns a number <= 0, usually < -1 when pinch-zoomed
    // Feature detection fails in mobile emulation mode in Chrome.
    // Math.abs(win.innerWidth / visualViewport.scale - visualViewport.width) <
    // 0.001
    // Fallback here: "Not Safari" userAgent

    if (!/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
      x = visualViewport.offsetLeft;
      y = visualViewport.offsetTop;
    }
  }

  return {
    width: width,
    height: height,
    x: x + getWindowScrollBarX(element),
    y: y
  };
}
;// CONCATENATED MODULE: ./node_modules/@popperjs/core/lib/dom-utils/getDocumentRect.js




 // Gets the entire size of the scrollable document area, even extending outside
// of the `<html>` and `<body>` rect bounds if horizontally scrollable

function getDocumentRect(element) {
  var _element$ownerDocumen;

  var html = getDocumentElement(element);
  var winScroll = getWindowScroll(element);
  var body = (_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body;
  var width = math_max(html.scrollWidth, html.clientWidth, body ? body.scrollWidth : 0, body ? body.clientWidth : 0);
  var height = math_max(html.scrollHeight, html.clientHeight, body ? body.scrollHeight : 0, body ? body.clientHeight : 0);
  var x = -winScroll.scrollLeft + getWindowScrollBarX(element);
  var y = -winScroll.scrollTop;

  if (getComputedStyle(body || html).direction === 'rtl') {
    x += math_max(html.clientWidth, body ? body.clientWidth : 0) - width;
  }

  return {
    width: width,
    height: height,
    x: x,
    y: y
  };
}
;// CONCATENATED MODULE: ./node_modules/@popperjs/core/lib/dom-utils/contains.js

function contains(parent, child) {
  var rootNode = child.getRootNode && child.getRootNode(); // First, attempt with faster native method

  if (parent.contains(child)) {
    return true;
  } // then fallback to custom implementation with Shadow DOM support
  else if (rootNode && isShadowRoot(rootNode)) {
      var next = child;

      do {
        if (next && parent.isSameNode(next)) {
          return true;
        } // $FlowFixMe[prop-missing]: need a better way to handle this...


        next = next.parentNode || next.host;
      } while (next);
    } // Give up, the result is false


  return false;
}
;// CONCATENATED MODULE: ./node_modules/@popperjs/core/lib/utils/rectToClientRect.js
function rectToClientRect(rect) {
  return Object.assign({}, rect, {
    left: rect.x,
    top: rect.y,
    right: rect.x + rect.width,
    bottom: rect.y + rect.height
  });
}
;// CONCATENATED MODULE: ./node_modules/@popperjs/core/lib/dom-utils/getClippingRect.js















function getInnerBoundingClientRect(element) {
  var rect = getBoundingClientRect(element);
  rect.top = rect.top + element.clientTop;
  rect.left = rect.left + element.clientLeft;
  rect.bottom = rect.top + element.clientHeight;
  rect.right = rect.left + element.clientWidth;
  rect.width = element.clientWidth;
  rect.height = element.clientHeight;
  rect.x = rect.left;
  rect.y = rect.top;
  return rect;
}

function getClientRectFromMixedType(element, clippingParent) {
  return clippingParent === viewport ? rectToClientRect(getViewportRect(element)) : isElement(clippingParent) ? getInnerBoundingClientRect(clippingParent) : rectToClientRect(getDocumentRect(getDocumentElement(element)));
} // A "clipping parent" is an overflowable container with the characteristic of
// clipping (or hiding) overflowing elements with a position different from
// `initial`


function getClippingParents(element) {
  var clippingParents = listScrollParents(getParentNode(element));
  var canEscapeClipping = ['absolute', 'fixed'].indexOf(getComputedStyle(element).position) >= 0;
  var clipperElement = canEscapeClipping && isHTMLElement(element) ? getOffsetParent(element) : element;

  if (!isElement(clipperElement)) {
    return [];
  } // $FlowFixMe[incompatible-return]: https://github.com/facebook/flow/issues/1414


  return clippingParents.filter(function (clippingParent) {
    return isElement(clippingParent) && contains(clippingParent, clipperElement) && getNodeName(clippingParent) !== 'body';
  });
} // Gets the maximum area that the element is visible in due to any number of
// clipping parents


function getClippingRect(element, boundary, rootBoundary) {
  var mainClippingParents = boundary === 'clippingParents' ? getClippingParents(element) : [].concat(boundary);
  var clippingParents = [].concat(mainClippingParents, [rootBoundary]);
  var firstClippingParent = clippingParents[0];
  var clippingRect = clippingParents.reduce(function (accRect, clippingParent) {
    var rect = getClientRectFromMixedType(element, clippingParent);
    accRect.top = math_max(rect.top, accRect.top);
    accRect.right = math_min(rect.right, accRect.right);
    accRect.bottom = math_min(rect.bottom, accRect.bottom);
    accRect.left = math_max(rect.left, accRect.left);
    return accRect;
  }, getClientRectFromMixedType(element, firstClippingParent));
  clippingRect.width = clippingRect.right - clippingRect.left;
  clippingRect.height = clippingRect.bottom - clippingRect.top;
  clippingRect.x = clippingRect.left;
  clippingRect.y = clippingRect.top;
  return clippingRect;
}
;// CONCATENATED MODULE: ./node_modules/@popperjs/core/lib/utils/getFreshSideObject.js
function getFreshSideObject() {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  };
}
;// CONCATENATED MODULE: ./node_modules/@popperjs/core/lib/utils/mergePaddingObject.js

function mergePaddingObject(paddingObject) {
  return Object.assign({}, getFreshSideObject(), paddingObject);
}
;// CONCATENATED MODULE: ./node_modules/@popperjs/core/lib/utils/expandToHashMap.js
function expandToHashMap(value, keys) {
  return keys.reduce(function (hashMap, key) {
    hashMap[key] = value;
    return hashMap;
  }, {});
}
;// CONCATENATED MODULE: ./node_modules/@popperjs/core/lib/utils/detectOverflow.js








 // eslint-disable-next-line import/no-unused-modules

function detectOverflow(state, options) {
  if (options === void 0) {
    options = {};
  }

  var _options = options,
      _options$placement = _options.placement,
      placement = _options$placement === void 0 ? state.placement : _options$placement,
      _options$boundary = _options.boundary,
      boundary = _options$boundary === void 0 ? clippingParents : _options$boundary,
      _options$rootBoundary = _options.rootBoundary,
      rootBoundary = _options$rootBoundary === void 0 ? viewport : _options$rootBoundary,
      _options$elementConte = _options.elementContext,
      elementContext = _options$elementConte === void 0 ? popper : _options$elementConte,
      _options$altBoundary = _options.altBoundary,
      altBoundary = _options$altBoundary === void 0 ? false : _options$altBoundary,
      _options$padding = _options.padding,
      padding = _options$padding === void 0 ? 0 : _options$padding;
  var paddingObject = mergePaddingObject(typeof padding !== 'number' ? padding : expandToHashMap(padding, basePlacements));
  var altContext = elementContext === popper ? reference : popper;
  var popperRect = state.rects.popper;
  var element = state.elements[altBoundary ? altContext : elementContext];
  var clippingClientRect = getClippingRect(isElement(element) ? element : element.contextElement || getDocumentElement(state.elements.popper), boundary, rootBoundary);
  var referenceClientRect = getBoundingClientRect(state.elements.reference);
  var popperOffsets = computeOffsets({
    reference: referenceClientRect,
    element: popperRect,
    strategy: 'absolute',
    placement: placement
  });
  var popperClientRect = rectToClientRect(Object.assign({}, popperRect, popperOffsets));
  var elementClientRect = elementContext === popper ? popperClientRect : referenceClientRect; // positive = overflowing the clipping rect
  // 0 or negative = within the clipping rect

  var overflowOffsets = {
    top: clippingClientRect.top - elementClientRect.top + paddingObject.top,
    bottom: elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom,
    left: clippingClientRect.left - elementClientRect.left + paddingObject.left,
    right: elementClientRect.right - clippingClientRect.right + paddingObject.right
  };
  var offsetData = state.modifiersData.offset; // Offsets can be applied only to the popper element

  if (elementContext === popper && offsetData) {
    var offset = offsetData[placement];
    Object.keys(overflowOffsets).forEach(function (key) {
      var multiply = [right, bottom].indexOf(key) >= 0 ? 1 : -1;
      var axis = [enums_top, bottom].indexOf(key) >= 0 ? 'y' : 'x';
      overflowOffsets[key] += offset[axis] * multiply;
    });
  }

  return overflowOffsets;
}
;// CONCATENATED MODULE: ./node_modules/@popperjs/core/lib/utils/computeAutoPlacement.js




function computeAutoPlacement(state, options) {
  if (options === void 0) {
    options = {};
  }

  var _options = options,
      placement = _options.placement,
      boundary = _options.boundary,
      rootBoundary = _options.rootBoundary,
      padding = _options.padding,
      flipVariations = _options.flipVariations,
      _options$allowedAutoP = _options.allowedAutoPlacements,
      allowedAutoPlacements = _options$allowedAutoP === void 0 ? enums_placements : _options$allowedAutoP;
  var variation = getVariation(placement);
  var placements = variation ? flipVariations ? variationPlacements : variationPlacements.filter(function (placement) {
    return getVariation(placement) === variation;
  }) : basePlacements;
  var allowedPlacements = placements.filter(function (placement) {
    return allowedAutoPlacements.indexOf(placement) >= 0;
  });

  if (allowedPlacements.length === 0) {
    allowedPlacements = placements;

    if (false) {}
  } // $FlowFixMe[incompatible-type]: Flow seems to have problems with two array unions...


  var overflows = allowedPlacements.reduce(function (acc, placement) {
    acc[placement] = detectOverflow(state, {
      placement: placement,
      boundary: boundary,
      rootBoundary: rootBoundary,
      padding: padding
    })[getBasePlacement(placement)];
    return acc;
  }, {});
  return Object.keys(overflows).sort(function (a, b) {
    return overflows[a] - overflows[b];
  });
}
;// CONCATENATED MODULE: ./node_modules/@popperjs/core/lib/modifiers/flip.js






 // eslint-disable-next-line import/no-unused-modules

function getExpandedFallbackPlacements(placement) {
  if (getBasePlacement(placement) === auto) {
    return [];
  }

  var oppositePlacement = getOppositePlacement(placement);
  return [getOppositeVariationPlacement(placement), oppositePlacement, getOppositeVariationPlacement(oppositePlacement)];
}

function flip(_ref) {
  var state = _ref.state,
      options = _ref.options,
      name = _ref.name;

  if (state.modifiersData[name]._skip) {
    return;
  }

  var _options$mainAxis = options.mainAxis,
      checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis,
      _options$altAxis = options.altAxis,
      checkAltAxis = _options$altAxis === void 0 ? true : _options$altAxis,
      specifiedFallbackPlacements = options.fallbackPlacements,
      padding = options.padding,
      boundary = options.boundary,
      rootBoundary = options.rootBoundary,
      altBoundary = options.altBoundary,
      _options$flipVariatio = options.flipVariations,
      flipVariations = _options$flipVariatio === void 0 ? true : _options$flipVariatio,
      allowedAutoPlacements = options.allowedAutoPlacements;
  var preferredPlacement = state.options.placement;
  var basePlacement = getBasePlacement(preferredPlacement);
  var isBasePlacement = basePlacement === preferredPlacement;
  var fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipVariations ? [getOppositePlacement(preferredPlacement)] : getExpandedFallbackPlacements(preferredPlacement));
  var placements = [preferredPlacement].concat(fallbackPlacements).reduce(function (acc, placement) {
    return acc.concat(getBasePlacement(placement) === auto ? computeAutoPlacement(state, {
      placement: placement,
      boundary: boundary,
      rootBoundary: rootBoundary,
      padding: padding,
      flipVariations: flipVariations,
      allowedAutoPlacements: allowedAutoPlacements
    }) : placement);
  }, []);
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var checksMap = new Map();
  var makeFallbackChecks = true;
  var firstFittingPlacement = placements[0];

  for (var i = 0; i < placements.length; i++) {
    var placement = placements[i];

    var _basePlacement = getBasePlacement(placement);

    var isStartVariation = getVariation(placement) === start;
    var isVertical = [enums_top, bottom].indexOf(_basePlacement) >= 0;
    var len = isVertical ? 'width' : 'height';
    var overflow = detectOverflow(state, {
      placement: placement,
      boundary: boundary,
      rootBoundary: rootBoundary,
      altBoundary: altBoundary,
      padding: padding
    });
    var mainVariationSide = isVertical ? isStartVariation ? right : left : isStartVariation ? bottom : enums_top;

    if (referenceRect[len] > popperRect[len]) {
      mainVariationSide = getOppositePlacement(mainVariationSide);
    }

    var altVariationSide = getOppositePlacement(mainVariationSide);
    var checks = [];

    if (checkMainAxis) {
      checks.push(overflow[_basePlacement] <= 0);
    }

    if (checkAltAxis) {
      checks.push(overflow[mainVariationSide] <= 0, overflow[altVariationSide] <= 0);
    }

    if (checks.every(function (check) {
      return check;
    })) {
      firstFittingPlacement = placement;
      makeFallbackChecks = false;
      break;
    }

    checksMap.set(placement, checks);
  }

  if (makeFallbackChecks) {
    // `2` may be desired in some cases – research later
    var numberOfChecks = flipVariations ? 3 : 1;

    var _loop = function _loop(_i) {
      var fittingPlacement = placements.find(function (placement) {
        var checks = checksMap.get(placement);

        if (checks) {
          return checks.slice(0, _i).every(function (check) {
            return check;
          });
        }
      });

      if (fittingPlacement) {
        firstFittingPlacement = fittingPlacement;
        return "break";
      }
    };

    for (var _i = numberOfChecks; _i > 0; _i--) {
      var _ret = _loop(_i);

      if (_ret === "break") break;
    }
  }

  if (state.placement !== firstFittingPlacement) {
    state.modifiersData[name]._skip = true;
    state.placement = firstFittingPlacement;
    state.reset = true;
  }
} // eslint-disable-next-line import/no-unused-modules


/* harmony default export */ const modifiers_flip = ({
  name: 'flip',
  enabled: true,
  phase: 'main',
  fn: flip,
  requiresIfExists: ['offset'],
  data: {
    _skip: false
  }
});
;// CONCATENATED MODULE: ./node_modules/@popperjs/core/lib/utils/getAltAxis.js
function getAltAxis(axis) {
  return axis === 'x' ? 'y' : 'x';
}
;// CONCATENATED MODULE: ./node_modules/@popperjs/core/lib/utils/within.js

function within(min, value, max) {
  return math_max(min, math_min(value, max));
}
function withinMaxClamp(min, value, max) {
  var v = within(min, value, max);
  return v > max ? max : v;
}
;// CONCATENATED MODULE: ./node_modules/@popperjs/core/lib/modifiers/preventOverflow.js












function preventOverflow(_ref) {
  var state = _ref.state,
      options = _ref.options,
      name = _ref.name;
  var _options$mainAxis = options.mainAxis,
      checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis,
      _options$altAxis = options.altAxis,
      checkAltAxis = _options$altAxis === void 0 ? false : _options$altAxis,
      boundary = options.boundary,
      rootBoundary = options.rootBoundary,
      altBoundary = options.altBoundary,
      padding = options.padding,
      _options$tether = options.tether,
      tether = _options$tether === void 0 ? true : _options$tether,
      _options$tetherOffset = options.tetherOffset,
      tetherOffset = _options$tetherOffset === void 0 ? 0 : _options$tetherOffset;
  var overflow = detectOverflow(state, {
    boundary: boundary,
    rootBoundary: rootBoundary,
    padding: padding,
    altBoundary: altBoundary
  });
  var basePlacement = getBasePlacement(state.placement);
  var variation = getVariation(state.placement);
  var isBasePlacement = !variation;
  var mainAxis = getMainAxisFromPlacement(basePlacement);
  var altAxis = getAltAxis(mainAxis);
  var popperOffsets = state.modifiersData.popperOffsets;
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var tetherOffsetValue = typeof tetherOffset === 'function' ? tetherOffset(Object.assign({}, state.rects, {
    placement: state.placement
  })) : tetherOffset;
  var normalizedTetherOffsetValue = typeof tetherOffsetValue === 'number' ? {
    mainAxis: tetherOffsetValue,
    altAxis: tetherOffsetValue
  } : Object.assign({
    mainAxis: 0,
    altAxis: 0
  }, tetherOffsetValue);
  var offsetModifierState = state.modifiersData.offset ? state.modifiersData.offset[state.placement] : null;
  var data = {
    x: 0,
    y: 0
  };

  if (!popperOffsets) {
    return;
  }

  if (checkMainAxis) {
    var _offsetModifierState$;

    var mainSide = mainAxis === 'y' ? enums_top : left;
    var altSide = mainAxis === 'y' ? bottom : right;
    var len = mainAxis === 'y' ? 'height' : 'width';
    var offset = popperOffsets[mainAxis];
    var min = offset + overflow[mainSide];
    var max = offset - overflow[altSide];
    var additive = tether ? -popperRect[len] / 2 : 0;
    var minLen = variation === start ? referenceRect[len] : popperRect[len];
    var maxLen = variation === start ? -popperRect[len] : -referenceRect[len]; // We need to include the arrow in the calculation so the arrow doesn't go
    // outside the reference bounds

    var arrowElement = state.elements.arrow;
    var arrowRect = tether && arrowElement ? getLayoutRect(arrowElement) : {
      width: 0,
      height: 0
    };
    var arrowPaddingObject = state.modifiersData['arrow#persistent'] ? state.modifiersData['arrow#persistent'].padding : getFreshSideObject();
    var arrowPaddingMin = arrowPaddingObject[mainSide];
    var arrowPaddingMax = arrowPaddingObject[altSide]; // If the reference length is smaller than the arrow length, we don't want
    // to include its full size in the calculation. If the reference is small
    // and near the edge of a boundary, the popper can overflow even if the
    // reference is not overflowing as well (e.g. virtual elements with no
    // width or height)

    var arrowLen = within(0, referenceRect[len], arrowRect[len]);
    var minOffset = isBasePlacement ? referenceRect[len] / 2 - additive - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis : minLen - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis;
    var maxOffset = isBasePlacement ? -referenceRect[len] / 2 + additive + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis : maxLen + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis;
    var arrowOffsetParent = state.elements.arrow && getOffsetParent(state.elements.arrow);
    var clientOffset = arrowOffsetParent ? mainAxis === 'y' ? arrowOffsetParent.clientTop || 0 : arrowOffsetParent.clientLeft || 0 : 0;
    var offsetModifierValue = (_offsetModifierState$ = offsetModifierState == null ? void 0 : offsetModifierState[mainAxis]) != null ? _offsetModifierState$ : 0;
    var tetherMin = offset + minOffset - offsetModifierValue - clientOffset;
    var tetherMax = offset + maxOffset - offsetModifierValue;
    var preventedOffset = within(tether ? math_min(min, tetherMin) : min, offset, tether ? math_max(max, tetherMax) : max);
    popperOffsets[mainAxis] = preventedOffset;
    data[mainAxis] = preventedOffset - offset;
  }

  if (checkAltAxis) {
    var _offsetModifierState$2;

    var _mainSide = mainAxis === 'x' ? enums_top : left;

    var _altSide = mainAxis === 'x' ? bottom : right;

    var _offset = popperOffsets[altAxis];

    var _len = altAxis === 'y' ? 'height' : 'width';

    var _min = _offset + overflow[_mainSide];

    var _max = _offset - overflow[_altSide];

    var isOriginSide = [enums_top, left].indexOf(basePlacement) !== -1;

    var _offsetModifierValue = (_offsetModifierState$2 = offsetModifierState == null ? void 0 : offsetModifierState[altAxis]) != null ? _offsetModifierState$2 : 0;

    var _tetherMin = isOriginSide ? _min : _offset - referenceRect[_len] - popperRect[_len] - _offsetModifierValue + normalizedTetherOffsetValue.altAxis;

    var _tetherMax = isOriginSide ? _offset + referenceRect[_len] + popperRect[_len] - _offsetModifierValue - normalizedTetherOffsetValue.altAxis : _max;

    var _preventedOffset = tether && isOriginSide ? withinMaxClamp(_tetherMin, _offset, _tetherMax) : within(tether ? _tetherMin : _min, _offset, tether ? _tetherMax : _max);

    popperOffsets[altAxis] = _preventedOffset;
    data[altAxis] = _preventedOffset - _offset;
  }

  state.modifiersData[name] = data;
} // eslint-disable-next-line import/no-unused-modules


/* harmony default export */ const modifiers_preventOverflow = ({
  name: 'preventOverflow',
  enabled: true,
  phase: 'main',
  fn: preventOverflow,
  requiresIfExists: ['offset']
});
;// CONCATENATED MODULE: ./node_modules/@popperjs/core/lib/modifiers/arrow.js









 // eslint-disable-next-line import/no-unused-modules

var toPaddingObject = function toPaddingObject(padding, state) {
  padding = typeof padding === 'function' ? padding(Object.assign({}, state.rects, {
    placement: state.placement
  })) : padding;
  return mergePaddingObject(typeof padding !== 'number' ? padding : expandToHashMap(padding, basePlacements));
};

function arrow(_ref) {
  var _state$modifiersData$;

  var state = _ref.state,
      name = _ref.name,
      options = _ref.options;
  var arrowElement = state.elements.arrow;
  var popperOffsets = state.modifiersData.popperOffsets;
  var basePlacement = getBasePlacement(state.placement);
  var axis = getMainAxisFromPlacement(basePlacement);
  var isVertical = [left, right].indexOf(basePlacement) >= 0;
  var len = isVertical ? 'height' : 'width';

  if (!arrowElement || !popperOffsets) {
    return;
  }

  var paddingObject = toPaddingObject(options.padding, state);
  var arrowRect = getLayoutRect(arrowElement);
  var minProp = axis === 'y' ? enums_top : left;
  var maxProp = axis === 'y' ? bottom : right;
  var endDiff = state.rects.reference[len] + state.rects.reference[axis] - popperOffsets[axis] - state.rects.popper[len];
  var startDiff = popperOffsets[axis] - state.rects.reference[axis];
  var arrowOffsetParent = getOffsetParent(arrowElement);
  var clientSize = arrowOffsetParent ? axis === 'y' ? arrowOffsetParent.clientHeight || 0 : arrowOffsetParent.clientWidth || 0 : 0;
  var centerToReference = endDiff / 2 - startDiff / 2; // Make sure the arrow doesn't overflow the popper if the center point is
  // outside of the popper bounds

  var min = paddingObject[minProp];
  var max = clientSize - arrowRect[len] - paddingObject[maxProp];
  var center = clientSize / 2 - arrowRect[len] / 2 + centerToReference;
  var offset = within(min, center, max); // Prevents breaking syntax highlighting...

  var axisProp = axis;
  state.modifiersData[name] = (_state$modifiersData$ = {}, _state$modifiersData$[axisProp] = offset, _state$modifiersData$.centerOffset = offset - center, _state$modifiersData$);
}

function arrow_effect(_ref2) {
  var state = _ref2.state,
      options = _ref2.options;
  var _options$element = options.element,
      arrowElement = _options$element === void 0 ? '[data-popper-arrow]' : _options$element;

  if (arrowElement == null) {
    return;
  } // CSS selector


  if (typeof arrowElement === 'string') {
    arrowElement = state.elements.popper.querySelector(arrowElement);

    if (!arrowElement) {
      return;
    }
  }

  if (false) {}

  if (!contains(state.elements.popper, arrowElement)) {
    if (false) {}

    return;
  }

  state.elements.arrow = arrowElement;
} // eslint-disable-next-line import/no-unused-modules


/* harmony default export */ const modifiers_arrow = ({
  name: 'arrow',
  enabled: true,
  phase: 'main',
  fn: arrow,
  effect: arrow_effect,
  requires: ['popperOffsets'],
  requiresIfExists: ['preventOverflow']
});
;// CONCATENATED MODULE: ./node_modules/@popperjs/core/lib/modifiers/hide.js



function getSideOffsets(overflow, rect, preventedOffsets) {
  if (preventedOffsets === void 0) {
    preventedOffsets = {
      x: 0,
      y: 0
    };
  }

  return {
    top: overflow.top - rect.height - preventedOffsets.y,
    right: overflow.right - rect.width + preventedOffsets.x,
    bottom: overflow.bottom - rect.height + preventedOffsets.y,
    left: overflow.left - rect.width - preventedOffsets.x
  };
}

function isAnySideFullyClipped(overflow) {
  return [enums_top, right, bottom, left].some(function (side) {
    return overflow[side] >= 0;
  });
}

function hide(_ref) {
  var state = _ref.state,
      name = _ref.name;
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var preventedOffsets = state.modifiersData.preventOverflow;
  var referenceOverflow = detectOverflow(state, {
    elementContext: 'reference'
  });
  var popperAltOverflow = detectOverflow(state, {
    altBoundary: true
  });
  var referenceClippingOffsets = getSideOffsets(referenceOverflow, referenceRect);
  var popperEscapeOffsets = getSideOffsets(popperAltOverflow, popperRect, preventedOffsets);
  var isReferenceHidden = isAnySideFullyClipped(referenceClippingOffsets);
  var hasPopperEscaped = isAnySideFullyClipped(popperEscapeOffsets);
  state.modifiersData[name] = {
    referenceClippingOffsets: referenceClippingOffsets,
    popperEscapeOffsets: popperEscapeOffsets,
    isReferenceHidden: isReferenceHidden,
    hasPopperEscaped: hasPopperEscaped
  };
  state.attributes.popper = Object.assign({}, state.attributes.popper, {
    'data-popper-reference-hidden': isReferenceHidden,
    'data-popper-escaped': hasPopperEscaped
  });
} // eslint-disable-next-line import/no-unused-modules


/* harmony default export */ const modifiers_hide = ({
  name: 'hide',
  enabled: true,
  phase: 'main',
  requiresIfExists: ['preventOverflow'],
  fn: hide
});
;// CONCATENATED MODULE: ./node_modules/@popperjs/core/lib/popper.js










var defaultModifiers = [eventListeners, modifiers_popperOffsets, modifiers_computeStyles, modifiers_applyStyles, modifiers_offset, modifiers_flip, modifiers_preventOverflow, modifiers_arrow, modifiers_hide];
var popper_createPopper = /*#__PURE__*/popperGenerator({
  defaultModifiers: defaultModifiers
}); // eslint-disable-next-line import/no-unused-modules

 // eslint-disable-next-line import/no-unused-modules

 // eslint-disable-next-line import/no-unused-modules


;// CONCATENATED MODULE: ./node_modules/tippy.js/dist/tippy.esm.js
/**!
* tippy.js v6.3.7
* (c) 2017-2021 atomiks
* MIT License
*/


var ROUND_ARROW = '<svg width="16" height="6" xmlns="http://www.w3.org/2000/svg"><path d="M0 6s1.796-.013 4.67-3.615C5.851.9 6.93.006 8 0c1.07-.006 2.148.887 3.343 2.385C14.233 6.005 16 6 16 6H0z"></svg>';
var BOX_CLASS = "tippy-box";
var CONTENT_CLASS = "tippy-content";
var BACKDROP_CLASS = "tippy-backdrop";
var ARROW_CLASS = "tippy-arrow";
var SVG_ARROW_CLASS = "tippy-svg-arrow";
var TOUCH_OPTIONS = {
  passive: true,
  capture: true
};
var TIPPY_DEFAULT_APPEND_TO = function TIPPY_DEFAULT_APPEND_TO() {
  return document.body;
};

function tippy_esm_hasOwnProperty(obj, key) {
  return {}.hasOwnProperty.call(obj, key);
}
function getValueAtIndexOrReturn(value, index, defaultValue) {
  if (Array.isArray(value)) {
    var v = value[index];
    return v == null ? Array.isArray(defaultValue) ? defaultValue[index] : defaultValue : v;
  }

  return value;
}
function isType(value, type) {
  var str = {}.toString.call(value);
  return str.indexOf('[object') === 0 && str.indexOf(type + "]") > -1;
}
function invokeWithArgsOrReturn(value, args) {
  return typeof value === 'function' ? value.apply(void 0, args) : value;
}
function tippy_esm_debounce(fn, ms) {
  // Avoid wrapping in `setTimeout` if ms is 0 anyway
  if (ms === 0) {
    return fn;
  }

  var timeout;
  return function (arg) {
    clearTimeout(timeout);
    timeout = setTimeout(function () {
      fn(arg);
    }, ms);
  };
}
function removeProperties(obj, keys) {
  var clone = Object.assign({}, obj);
  keys.forEach(function (key) {
    delete clone[key];
  });
  return clone;
}
function splitBySpaces(value) {
  return value.split(/\s+/).filter(Boolean);
}
function normalizeToArray(value) {
  return [].concat(value);
}
function pushIfUnique(arr, value) {
  if (arr.indexOf(value) === -1) {
    arr.push(value);
  }
}
function unique(arr) {
  return arr.filter(function (item, index) {
    return arr.indexOf(item) === index;
  });
}
function tippy_esm_getBasePlacement(placement) {
  return placement.split('-')[0];
}
function arrayFrom(value) {
  return [].slice.call(value);
}
function removeUndefinedProps(obj) {
  return Object.keys(obj).reduce(function (acc, key) {
    if (obj[key] !== undefined) {
      acc[key] = obj[key];
    }

    return acc;
  }, {});
}

function div() {
  return document.createElement('div');
}
function tippy_esm_isElement(value) {
  return ['Element', 'Fragment'].some(function (type) {
    return isType(value, type);
  });
}
function isNodeList(value) {
  return isType(value, 'NodeList');
}
function isMouseEvent(value) {
  return isType(value, 'MouseEvent');
}
function isReferenceElement(value) {
  return !!(value && value._tippy && value._tippy.reference === value);
}
function getArrayOfElements(value) {
  if (tippy_esm_isElement(value)) {
    return [value];
  }

  if (isNodeList(value)) {
    return arrayFrom(value);
  }

  if (Array.isArray(value)) {
    return value;
  }

  return arrayFrom(document.querySelectorAll(value));
}
function setTransitionDuration(els, value) {
  els.forEach(function (el) {
    if (el) {
      el.style.transitionDuration = value + "ms";
    }
  });
}
function setVisibilityState(els, state) {
  els.forEach(function (el) {
    if (el) {
      el.setAttribute('data-state', state);
    }
  });
}
function getOwnerDocument(elementOrElements) {
  var _element$ownerDocumen;

  var _normalizeToArray = normalizeToArray(elementOrElements),
      element = _normalizeToArray[0]; // Elements created via a <template> have an ownerDocument with no reference to the body


  return element != null && (_element$ownerDocumen = element.ownerDocument) != null && _element$ownerDocumen.body ? element.ownerDocument : document;
}
function isCursorOutsideInteractiveBorder(popperTreeData, event) {
  var clientX = event.clientX,
      clientY = event.clientY;
  return popperTreeData.every(function (_ref) {
    var popperRect = _ref.popperRect,
        popperState = _ref.popperState,
        props = _ref.props;
    var interactiveBorder = props.interactiveBorder;
    var basePlacement = tippy_esm_getBasePlacement(popperState.placement);
    var offsetData = popperState.modifiersData.offset;

    if (!offsetData) {
      return true;
    }

    var topDistance = basePlacement === 'bottom' ? offsetData.top.y : 0;
    var bottomDistance = basePlacement === 'top' ? offsetData.bottom.y : 0;
    var leftDistance = basePlacement === 'right' ? offsetData.left.x : 0;
    var rightDistance = basePlacement === 'left' ? offsetData.right.x : 0;
    var exceedsTop = popperRect.top - clientY + topDistance > interactiveBorder;
    var exceedsBottom = clientY - popperRect.bottom - bottomDistance > interactiveBorder;
    var exceedsLeft = popperRect.left - clientX + leftDistance > interactiveBorder;
    var exceedsRight = clientX - popperRect.right - rightDistance > interactiveBorder;
    return exceedsTop || exceedsBottom || exceedsLeft || exceedsRight;
  });
}
function updateTransitionEndListener(box, action, listener) {
  var method = action + "EventListener"; // some browsers apparently support `transition` (unprefixed) but only fire
  // `webkitTransitionEnd`...

  ['transitionend', 'webkitTransitionEnd'].forEach(function (event) {
    box[method](event, listener);
  });
}
/**
 * Compared to xxx.contains, this function works for dom structures with shadow
 * dom
 */

function actualContains(parent, child) {
  var target = child;

  while (target) {
    var _target$getRootNode;

    if (parent.contains(target)) {
      return true;
    }

    target = target.getRootNode == null ? void 0 : (_target$getRootNode = target.getRootNode()) == null ? void 0 : _target$getRootNode.host;
  }

  return false;
}

var currentInput = {
  isTouch: false
};
var lastMouseMoveTime = 0;
/**
 * When a `touchstart` event is fired, it's assumed the user is using touch
 * input. We'll bind a `mousemove` event listener to listen for mouse input in
 * the future. This way, the `isTouch` property is fully dynamic and will handle
 * hybrid devices that use a mix of touch + mouse input.
 */

function onDocumentTouchStart() {
  if (currentInput.isTouch) {
    return;
  }

  currentInput.isTouch = true;

  if (window.performance) {
    document.addEventListener('mousemove', onDocumentMouseMove);
  }
}
/**
 * When two `mousemove` event are fired consecutively within 20ms, it's assumed
 * the user is using mouse input again. `mousemove` can fire on touch devices as
 * well, but very rarely that quickly.
 */

function onDocumentMouseMove() {
  var now = performance.now();

  if (now - lastMouseMoveTime < 20) {
    currentInput.isTouch = false;
    document.removeEventListener('mousemove', onDocumentMouseMove);
  }

  lastMouseMoveTime = now;
}
/**
 * When an element is in focus and has a tippy, leaving the tab/window and
 * returning causes it to show again. For mouse users this is unexpected, but
 * for keyboard use it makes sense.
 * TODO: find a better technique to solve this problem
 */

function onWindowBlur() {
  var activeElement = document.activeElement;

  if (isReferenceElement(activeElement)) {
    var instance = activeElement._tippy;

    if (activeElement.blur && !instance.state.isVisible) {
      activeElement.blur();
    }
  }
}
function bindGlobalEventListeners() {
  document.addEventListener('touchstart', onDocumentTouchStart, TOUCH_OPTIONS);
  window.addEventListener('blur', onWindowBlur);
}

var isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';
var isIE11 = isBrowser ? // @ts-ignore
!!window.msCrypto : false;

function createMemoryLeakWarning(method) {
  var txt = method === 'destroy' ? 'n already-' : ' ';
  return [method + "() was called on a" + txt + "destroyed instance. This is a no-op but", 'indicates a potential memory leak.'].join(' ');
}
function clean(value) {
  var spacesAndTabs = /[ \t]{2,}/g;
  var lineStartWithSpaces = /^[ \t]*/gm;
  return value.replace(spacesAndTabs, ' ').replace(lineStartWithSpaces, '').trim();
}

function getDevMessage(message) {
  return clean("\n  %ctippy.js\n\n  %c" + clean(message) + "\n\n  %c\uD83D\uDC77\u200D This is a development-only message. It will be removed in production.\n  ");
}

function getFormattedMessage(message) {
  return [getDevMessage(message), // title
  'color: #00C584; font-size: 1.3em; font-weight: bold;', // message
  'line-height: 1.5', // footer
  'color: #a6a095;'];
} // Assume warnings and errors never have the same message

var visitedMessages;

if (false) {}

function resetVisitedMessages() {
  visitedMessages = new Set();
}
function warnWhen(condition, message) {
  if (condition && !visitedMessages.has(message)) {
    var _console;

    visitedMessages.add(message);

    (_console = console).warn.apply(_console, getFormattedMessage(message));
  }
}
function errorWhen(condition, message) {
  if (condition && !visitedMessages.has(message)) {
    var _console2;

    visitedMessages.add(message);

    (_console2 = console).error.apply(_console2, getFormattedMessage(message));
  }
}
function validateTargets(targets) {
  var didPassFalsyValue = !targets;
  var didPassPlainObject = Object.prototype.toString.call(targets) === '[object Object]' && !targets.addEventListener;
  errorWhen(didPassFalsyValue, ['tippy() was passed', '`' + String(targets) + '`', 'as its targets (first) argument. Valid types are: String, Element,', 'Element[], or NodeList.'].join(' '));
  errorWhen(didPassPlainObject, ['tippy() was passed a plain object which is not supported as an argument', 'for virtual positioning. Use props.getReferenceClientRect instead.'].join(' '));
}

var pluginProps = {
  animateFill: false,
  followCursor: false,
  inlinePositioning: false,
  sticky: false
};
var renderProps = {
  allowHTML: false,
  animation: 'fade',
  arrow: true,
  content: '',
  inertia: false,
  maxWidth: 350,
  role: 'tooltip',
  theme: '',
  zIndex: 9999
};
var defaultProps = Object.assign({
  appendTo: TIPPY_DEFAULT_APPEND_TO,
  aria: {
    content: 'auto',
    expanded: 'auto'
  },
  delay: 0,
  duration: [300, 250],
  getReferenceClientRect: null,
  hideOnClick: true,
  ignoreAttributes: false,
  interactive: false,
  interactiveBorder: 2,
  interactiveDebounce: 0,
  moveTransition: '',
  offset: [0, 10],
  onAfterUpdate: function onAfterUpdate() {},
  onBeforeUpdate: function onBeforeUpdate() {},
  onCreate: function onCreate() {},
  onDestroy: function onDestroy() {},
  onHidden: function onHidden() {},
  onHide: function onHide() {},
  onMount: function onMount() {},
  onShow: function onShow() {},
  onShown: function onShown() {},
  onTrigger: function onTrigger() {},
  onUntrigger: function onUntrigger() {},
  onClickOutside: function onClickOutside() {},
  placement: 'top',
  plugins: [],
  popperOptions: {},
  render: null,
  showOnCreate: false,
  touch: true,
  trigger: 'mouseenter focus',
  triggerTarget: null
}, pluginProps, renderProps);
var defaultKeys = Object.keys(defaultProps);
var setDefaultProps = function setDefaultProps(partialProps) {
  /* istanbul ignore else */
  if (false) {}

  var keys = Object.keys(partialProps);
  keys.forEach(function (key) {
    defaultProps[key] = partialProps[key];
  });
};
function getExtendedPassedProps(passedProps) {
  var plugins = passedProps.plugins || [];
  var pluginProps = plugins.reduce(function (acc, plugin) {
    var name = plugin.name,
        defaultValue = plugin.defaultValue;

    if (name) {
      var _name;

      acc[name] = passedProps[name] !== undefined ? passedProps[name] : (_name = defaultProps[name]) != null ? _name : defaultValue;
    }

    return acc;
  }, {});
  return Object.assign({}, passedProps, pluginProps);
}
function getDataAttributeProps(reference, plugins) {
  var propKeys = plugins ? Object.keys(getExtendedPassedProps(Object.assign({}, defaultProps, {
    plugins: plugins
  }))) : defaultKeys;
  var props = propKeys.reduce(function (acc, key) {
    var valueAsString = (reference.getAttribute("data-tippy-" + key) || '').trim();

    if (!valueAsString) {
      return acc;
    }

    if (key === 'content') {
      acc[key] = valueAsString;
    } else {
      try {
        acc[key] = JSON.parse(valueAsString);
      } catch (e) {
        acc[key] = valueAsString;
      }
    }

    return acc;
  }, {});
  return props;
}
function evaluateProps(reference, props) {
  var out = Object.assign({}, props, {
    content: invokeWithArgsOrReturn(props.content, [reference])
  }, props.ignoreAttributes ? {} : getDataAttributeProps(reference, props.plugins));
  out.aria = Object.assign({}, defaultProps.aria, out.aria);
  out.aria = {
    expanded: out.aria.expanded === 'auto' ? props.interactive : out.aria.expanded,
    content: out.aria.content === 'auto' ? props.interactive ? null : 'describedby' : out.aria.content
  };
  return out;
}
function validateProps(partialProps, plugins) {
  if (partialProps === void 0) {
    partialProps = {};
  }

  if (plugins === void 0) {
    plugins = [];
  }

  var keys = Object.keys(partialProps);
  keys.forEach(function (prop) {
    var nonPluginProps = removeProperties(defaultProps, Object.keys(pluginProps));
    var didPassUnknownProp = !tippy_esm_hasOwnProperty(nonPluginProps, prop); // Check if the prop exists in `plugins`

    if (didPassUnknownProp) {
      didPassUnknownProp = plugins.filter(function (plugin) {
        return plugin.name === prop;
      }).length === 0;
    }

    warnWhen(didPassUnknownProp, ["`" + prop + "`", "is not a valid prop. You may have spelled it incorrectly, or if it's", 'a plugin, forgot to pass it in an array as props.plugins.', '\n\n', 'All props: https://atomiks.github.io/tippyjs/v6/all-props/\n', 'Plugins: https://atomiks.github.io/tippyjs/v6/plugins/'].join(' '));
  });
}

var innerHTML = function innerHTML() {
  return 'innerHTML';
};

function dangerouslySetInnerHTML(element, html) {
  element[innerHTML()] = html;
}

function createArrowElement(value) {
  var arrow = div();

  if (value === true) {
    arrow.className = ARROW_CLASS;
  } else {
    arrow.className = SVG_ARROW_CLASS;

    if (tippy_esm_isElement(value)) {
      arrow.appendChild(value);
    } else {
      dangerouslySetInnerHTML(arrow, value);
    }
  }

  return arrow;
}

function setContent(content, props) {
  if (tippy_esm_isElement(props.content)) {
    dangerouslySetInnerHTML(content, '');
    content.appendChild(props.content);
  } else if (typeof props.content !== 'function') {
    if (props.allowHTML) {
      dangerouslySetInnerHTML(content, props.content);
    } else {
      content.textContent = props.content;
    }
  }
}
function getChildren(popper) {
  var box = popper.firstElementChild;
  var boxChildren = arrayFrom(box.children);
  return {
    box: box,
    content: boxChildren.find(function (node) {
      return node.classList.contains(CONTENT_CLASS);
    }),
    arrow: boxChildren.find(function (node) {
      return node.classList.contains(ARROW_CLASS) || node.classList.contains(SVG_ARROW_CLASS);
    }),
    backdrop: boxChildren.find(function (node) {
      return node.classList.contains(BACKDROP_CLASS);
    })
  };
}
function render(instance) {
  var popper = div();
  var box = div();
  box.className = BOX_CLASS;
  box.setAttribute('data-state', 'hidden');
  box.setAttribute('tabindex', '-1');
  var content = div();
  content.className = CONTENT_CLASS;
  content.setAttribute('data-state', 'hidden');
  setContent(content, instance.props);
  popper.appendChild(box);
  box.appendChild(content);
  onUpdate(instance.props, instance.props);

  function onUpdate(prevProps, nextProps) {
    var _getChildren = getChildren(popper),
        box = _getChildren.box,
        content = _getChildren.content,
        arrow = _getChildren.arrow;

    if (nextProps.theme) {
      box.setAttribute('data-theme', nextProps.theme);
    } else {
      box.removeAttribute('data-theme');
    }

    if (typeof nextProps.animation === 'string') {
      box.setAttribute('data-animation', nextProps.animation);
    } else {
      box.removeAttribute('data-animation');
    }

    if (nextProps.inertia) {
      box.setAttribute('data-inertia', '');
    } else {
      box.removeAttribute('data-inertia');
    }

    box.style.maxWidth = typeof nextProps.maxWidth === 'number' ? nextProps.maxWidth + "px" : nextProps.maxWidth;

    if (nextProps.role) {
      box.setAttribute('role', nextProps.role);
    } else {
      box.removeAttribute('role');
    }

    if (prevProps.content !== nextProps.content || prevProps.allowHTML !== nextProps.allowHTML) {
      setContent(content, instance.props);
    }

    if (nextProps.arrow) {
      if (!arrow) {
        box.appendChild(createArrowElement(nextProps.arrow));
      } else if (prevProps.arrow !== nextProps.arrow) {
        box.removeChild(arrow);
        box.appendChild(createArrowElement(nextProps.arrow));
      }
    } else if (arrow) {
      box.removeChild(arrow);
    }
  }

  return {
    popper: popper,
    onUpdate: onUpdate
  };
} // Runtime check to identify if the render function is the default one; this
// way we can apply default CSS transitions logic and it can be tree-shaken away

render.$$tippy = true;

var idCounter = 1;
var mouseMoveListeners = []; // Used by `hideAll()`

var mountedInstances = [];
function createTippy(reference, passedProps) {
  var props = evaluateProps(reference, Object.assign({}, defaultProps, getExtendedPassedProps(removeUndefinedProps(passedProps)))); // ===========================================================================
  // 🔒 Private members
  // ===========================================================================

  var showTimeout;
  var hideTimeout;
  var scheduleHideAnimationFrame;
  var isVisibleFromClick = false;
  var didHideDueToDocumentMouseDown = false;
  var didTouchMove = false;
  var ignoreOnFirstUpdate = false;
  var lastTriggerEvent;
  var currentTransitionEndListener;
  var onFirstUpdate;
  var listeners = [];
  var debouncedOnMouseMove = tippy_esm_debounce(onMouseMove, props.interactiveDebounce);
  var currentTarget; // ===========================================================================
  // 🔑 Public members
  // ===========================================================================

  var id = idCounter++;
  var popperInstance = null;
  var plugins = unique(props.plugins);
  var state = {
    // Is the instance currently enabled?
    isEnabled: true,
    // Is the tippy currently showing and not transitioning out?
    isVisible: false,
    // Has the instance been destroyed?
    isDestroyed: false,
    // Is the tippy currently mounted to the DOM?
    isMounted: false,
    // Has the tippy finished transitioning in?
    isShown: false
  };
  var instance = {
    // properties
    id: id,
    reference: reference,
    popper: div(),
    popperInstance: popperInstance,
    props: props,
    state: state,
    plugins: plugins,
    // methods
    clearDelayTimeouts: clearDelayTimeouts,
    setProps: setProps,
    setContent: setContent,
    show: show,
    hide: hide,
    hideWithInteractivity: hideWithInteractivity,
    enable: enable,
    disable: disable,
    unmount: unmount,
    destroy: destroy
  }; // TODO: Investigate why this early return causes a TDZ error in the tests —
  // it doesn't seem to happen in the browser

  /* istanbul ignore if */

  if (!props.render) {
    if (false) {}

    return instance;
  } // ===========================================================================
  // Initial mutations
  // ===========================================================================


  var _props$render = props.render(instance),
      popper = _props$render.popper,
      onUpdate = _props$render.onUpdate;

  popper.setAttribute('data-tippy-root', '');
  popper.id = "tippy-" + instance.id;
  instance.popper = popper;
  reference._tippy = instance;
  popper._tippy = instance;
  var pluginsHooks = plugins.map(function (plugin) {
    return plugin.fn(instance);
  });
  var hasAriaExpanded = reference.hasAttribute('aria-expanded');
  addListeners();
  handleAriaExpandedAttribute();
  handleStyles();
  invokeHook('onCreate', [instance]);

  if (props.showOnCreate) {
    scheduleShow();
  } // Prevent a tippy with a delay from hiding if the cursor left then returned
  // before it started hiding


  popper.addEventListener('mouseenter', function () {
    if (instance.props.interactive && instance.state.isVisible) {
      instance.clearDelayTimeouts();
    }
  });
  popper.addEventListener('mouseleave', function () {
    if (instance.props.interactive && instance.props.trigger.indexOf('mouseenter') >= 0) {
      getDocument().addEventListener('mousemove', debouncedOnMouseMove);
    }
  });
  return instance; // ===========================================================================
  // 🔒 Private methods
  // ===========================================================================

  function getNormalizedTouchSettings() {
    var touch = instance.props.touch;
    return Array.isArray(touch) ? touch : [touch, 0];
  }

  function getIsCustomTouchBehavior() {
    return getNormalizedTouchSettings()[0] === 'hold';
  }

  function getIsDefaultRenderFn() {
    var _instance$props$rende;

    // @ts-ignore
    return !!((_instance$props$rende = instance.props.render) != null && _instance$props$rende.$$tippy);
  }

  function getCurrentTarget() {
    return currentTarget || reference;
  }

  function getDocument() {
    var parent = getCurrentTarget().parentNode;
    return parent ? getOwnerDocument(parent) : document;
  }

  function getDefaultTemplateChildren() {
    return getChildren(popper);
  }

  function getDelay(isShow) {
    // For touch or keyboard input, force `0` delay for UX reasons
    // Also if the instance is mounted but not visible (transitioning out),
    // ignore delay
    if (instance.state.isMounted && !instance.state.isVisible || currentInput.isTouch || lastTriggerEvent && lastTriggerEvent.type === 'focus') {
      return 0;
    }

    return getValueAtIndexOrReturn(instance.props.delay, isShow ? 0 : 1, defaultProps.delay);
  }

  function handleStyles(fromHide) {
    if (fromHide === void 0) {
      fromHide = false;
    }

    popper.style.pointerEvents = instance.props.interactive && !fromHide ? '' : 'none';
    popper.style.zIndex = "" + instance.props.zIndex;
  }

  function invokeHook(hook, args, shouldInvokePropsHook) {
    if (shouldInvokePropsHook === void 0) {
      shouldInvokePropsHook = true;
    }

    pluginsHooks.forEach(function (pluginHooks) {
      if (pluginHooks[hook]) {
        pluginHooks[hook].apply(pluginHooks, args);
      }
    });

    if (shouldInvokePropsHook) {
      var _instance$props;

      (_instance$props = instance.props)[hook].apply(_instance$props, args);
    }
  }

  function handleAriaContentAttribute() {
    var aria = instance.props.aria;

    if (!aria.content) {
      return;
    }

    var attr = "aria-" + aria.content;
    var id = popper.id;
    var nodes = normalizeToArray(instance.props.triggerTarget || reference);
    nodes.forEach(function (node) {
      var currentValue = node.getAttribute(attr);

      if (instance.state.isVisible) {
        node.setAttribute(attr, currentValue ? currentValue + " " + id : id);
      } else {
        var nextValue = currentValue && currentValue.replace(id, '').trim();

        if (nextValue) {
          node.setAttribute(attr, nextValue);
        } else {
          node.removeAttribute(attr);
        }
      }
    });
  }

  function handleAriaExpandedAttribute() {
    if (hasAriaExpanded || !instance.props.aria.expanded) {
      return;
    }

    var nodes = normalizeToArray(instance.props.triggerTarget || reference);
    nodes.forEach(function (node) {
      if (instance.props.interactive) {
        node.setAttribute('aria-expanded', instance.state.isVisible && node === getCurrentTarget() ? 'true' : 'false');
      } else {
        node.removeAttribute('aria-expanded');
      }
    });
  }

  function cleanupInteractiveMouseListeners() {
    getDocument().removeEventListener('mousemove', debouncedOnMouseMove);
    mouseMoveListeners = mouseMoveListeners.filter(function (listener) {
      return listener !== debouncedOnMouseMove;
    });
  }

  function onDocumentPress(event) {
    // Moved finger to scroll instead of an intentional tap outside
    if (currentInput.isTouch) {
      if (didTouchMove || event.type === 'mousedown') {
        return;
      }
    }

    var actualTarget = event.composedPath && event.composedPath()[0] || event.target; // Clicked on interactive popper

    if (instance.props.interactive && actualContains(popper, actualTarget)) {
      return;
    } // Clicked on the event listeners target


    if (normalizeToArray(instance.props.triggerTarget || reference).some(function (el) {
      return actualContains(el, actualTarget);
    })) {
      if (currentInput.isTouch) {
        return;
      }

      if (instance.state.isVisible && instance.props.trigger.indexOf('click') >= 0) {
        return;
      }
    } else {
      invokeHook('onClickOutside', [instance, event]);
    }

    if (instance.props.hideOnClick === true) {
      instance.clearDelayTimeouts();
      instance.hide(); // `mousedown` event is fired right before `focus` if pressing the
      // currentTarget. This lets a tippy with `focus` trigger know that it
      // should not show

      didHideDueToDocumentMouseDown = true;
      setTimeout(function () {
        didHideDueToDocumentMouseDown = false;
      }); // The listener gets added in `scheduleShow()`, but this may be hiding it
      // before it shows, and hide()'s early bail-out behavior can prevent it
      // from being cleaned up

      if (!instance.state.isMounted) {
        removeDocumentPress();
      }
    }
  }

  function onTouchMove() {
    didTouchMove = true;
  }

  function onTouchStart() {
    didTouchMove = false;
  }

  function addDocumentPress() {
    var doc = getDocument();
    doc.addEventListener('mousedown', onDocumentPress, true);
    doc.addEventListener('touchend', onDocumentPress, TOUCH_OPTIONS);
    doc.addEventListener('touchstart', onTouchStart, TOUCH_OPTIONS);
    doc.addEventListener('touchmove', onTouchMove, TOUCH_OPTIONS);
  }

  function removeDocumentPress() {
    var doc = getDocument();
    doc.removeEventListener('mousedown', onDocumentPress, true);
    doc.removeEventListener('touchend', onDocumentPress, TOUCH_OPTIONS);
    doc.removeEventListener('touchstart', onTouchStart, TOUCH_OPTIONS);
    doc.removeEventListener('touchmove', onTouchMove, TOUCH_OPTIONS);
  }

  function onTransitionedOut(duration, callback) {
    onTransitionEnd(duration, function () {
      if (!instance.state.isVisible && popper.parentNode && popper.parentNode.contains(popper)) {
        callback();
      }
    });
  }

  function onTransitionedIn(duration, callback) {
    onTransitionEnd(duration, callback);
  }

  function onTransitionEnd(duration, callback) {
    var box = getDefaultTemplateChildren().box;

    function listener(event) {
      if (event.target === box) {
        updateTransitionEndListener(box, 'remove', listener);
        callback();
      }
    } // Make callback synchronous if duration is 0
    // `transitionend` won't fire otherwise


    if (duration === 0) {
      return callback();
    }

    updateTransitionEndListener(box, 'remove', currentTransitionEndListener);
    updateTransitionEndListener(box, 'add', listener);
    currentTransitionEndListener = listener;
  }

  function on(eventType, handler, options) {
    if (options === void 0) {
      options = false;
    }

    var nodes = normalizeToArray(instance.props.triggerTarget || reference);
    nodes.forEach(function (node) {
      node.addEventListener(eventType, handler, options);
      listeners.push({
        node: node,
        eventType: eventType,
        handler: handler,
        options: options
      });
    });
  }

  function addListeners() {
    if (getIsCustomTouchBehavior()) {
      on('touchstart', onTrigger, {
        passive: true
      });
      on('touchend', onMouseLeave, {
        passive: true
      });
    }

    splitBySpaces(instance.props.trigger).forEach(function (eventType) {
      if (eventType === 'manual') {
        return;
      }

      on(eventType, onTrigger);

      switch (eventType) {
        case 'mouseenter':
          on('mouseleave', onMouseLeave);
          break;

        case 'focus':
          on(isIE11 ? 'focusout' : 'blur', onBlurOrFocusOut);
          break;

        case 'focusin':
          on('focusout', onBlurOrFocusOut);
          break;
      }
    });
  }

  function removeListeners() {
    listeners.forEach(function (_ref) {
      var node = _ref.node,
          eventType = _ref.eventType,
          handler = _ref.handler,
          options = _ref.options;
      node.removeEventListener(eventType, handler, options);
    });
    listeners = [];
  }

  function onTrigger(event) {
    var _lastTriggerEvent;

    var shouldScheduleClickHide = false;

    if (!instance.state.isEnabled || isEventListenerStopped(event) || didHideDueToDocumentMouseDown) {
      return;
    }

    var wasFocused = ((_lastTriggerEvent = lastTriggerEvent) == null ? void 0 : _lastTriggerEvent.type) === 'focus';
    lastTriggerEvent = event;
    currentTarget = event.currentTarget;
    handleAriaExpandedAttribute();

    if (!instance.state.isVisible && isMouseEvent(event)) {
      // If scrolling, `mouseenter` events can be fired if the cursor lands
      // over a new target, but `mousemove` events don't get fired. This
      // causes interactive tooltips to get stuck open until the cursor is
      // moved
      mouseMoveListeners.forEach(function (listener) {
        return listener(event);
      });
    } // Toggle show/hide when clicking click-triggered tooltips


    if (event.type === 'click' && (instance.props.trigger.indexOf('mouseenter') < 0 || isVisibleFromClick) && instance.props.hideOnClick !== false && instance.state.isVisible) {
      shouldScheduleClickHide = true;
    } else {
      scheduleShow(event);
    }

    if (event.type === 'click') {
      isVisibleFromClick = !shouldScheduleClickHide;
    }

    if (shouldScheduleClickHide && !wasFocused) {
      scheduleHide(event);
    }
  }

  function onMouseMove(event) {
    var target = event.target;
    var isCursorOverReferenceOrPopper = getCurrentTarget().contains(target) || popper.contains(target);

    if (event.type === 'mousemove' && isCursorOverReferenceOrPopper) {
      return;
    }

    var popperTreeData = getNestedPopperTree().concat(popper).map(function (popper) {
      var _instance$popperInsta;

      var instance = popper._tippy;
      var state = (_instance$popperInsta = instance.popperInstance) == null ? void 0 : _instance$popperInsta.state;

      if (state) {
        return {
          popperRect: popper.getBoundingClientRect(),
          popperState: state,
          props: props
        };
      }

      return null;
    }).filter(Boolean);

    if (isCursorOutsideInteractiveBorder(popperTreeData, event)) {
      cleanupInteractiveMouseListeners();
      scheduleHide(event);
    }
  }

  function onMouseLeave(event) {
    var shouldBail = isEventListenerStopped(event) || instance.props.trigger.indexOf('click') >= 0 && isVisibleFromClick;

    if (shouldBail) {
      return;
    }

    if (instance.props.interactive) {
      instance.hideWithInteractivity(event);
      return;
    }

    scheduleHide(event);
  }

  function onBlurOrFocusOut(event) {
    if (instance.props.trigger.indexOf('focusin') < 0 && event.target !== getCurrentTarget()) {
      return;
    } // If focus was moved to within the popper


    if (instance.props.interactive && event.relatedTarget && popper.contains(event.relatedTarget)) {
      return;
    }

    scheduleHide(event);
  }

  function isEventListenerStopped(event) {
    return currentInput.isTouch ? getIsCustomTouchBehavior() !== event.type.indexOf('touch') >= 0 : false;
  }

  function createPopperInstance() {
    destroyPopperInstance();
    var _instance$props2 = instance.props,
        popperOptions = _instance$props2.popperOptions,
        placement = _instance$props2.placement,
        offset = _instance$props2.offset,
        getReferenceClientRect = _instance$props2.getReferenceClientRect,
        moveTransition = _instance$props2.moveTransition;
    var arrow = getIsDefaultRenderFn() ? getChildren(popper).arrow : null;
    var computedReference = getReferenceClientRect ? {
      getBoundingClientRect: getReferenceClientRect,
      contextElement: getReferenceClientRect.contextElement || getCurrentTarget()
    } : reference;
    var tippyModifier = {
      name: '$$tippy',
      enabled: true,
      phase: 'beforeWrite',
      requires: ['computeStyles'],
      fn: function fn(_ref2) {
        var state = _ref2.state;

        if (getIsDefaultRenderFn()) {
          var _getDefaultTemplateCh = getDefaultTemplateChildren(),
              box = _getDefaultTemplateCh.box;

          ['placement', 'reference-hidden', 'escaped'].forEach(function (attr) {
            if (attr === 'placement') {
              box.setAttribute('data-placement', state.placement);
            } else {
              if (state.attributes.popper["data-popper-" + attr]) {
                box.setAttribute("data-" + attr, '');
              } else {
                box.removeAttribute("data-" + attr);
              }
            }
          });
          state.attributes.popper = {};
        }
      }
    };
    var modifiers = [{
      name: 'offset',
      options: {
        offset: offset
      }
    }, {
      name: 'preventOverflow',
      options: {
        padding: {
          top: 2,
          bottom: 2,
          left: 5,
          right: 5
        }
      }
    }, {
      name: 'flip',
      options: {
        padding: 5
      }
    }, {
      name: 'computeStyles',
      options: {
        adaptive: !moveTransition
      }
    }, tippyModifier];

    if (getIsDefaultRenderFn() && arrow) {
      modifiers.push({
        name: 'arrow',
        options: {
          element: arrow,
          padding: 3
        }
      });
    }

    modifiers.push.apply(modifiers, (popperOptions == null ? void 0 : popperOptions.modifiers) || []);
    instance.popperInstance = popper_createPopper(computedReference, popper, Object.assign({}, popperOptions, {
      placement: placement,
      onFirstUpdate: onFirstUpdate,
      modifiers: modifiers
    }));
  }

  function destroyPopperInstance() {
    if (instance.popperInstance) {
      instance.popperInstance.destroy();
      instance.popperInstance = null;
    }
  }

  function mount() {
    var appendTo = instance.props.appendTo;
    var parentNode; // By default, we'll append the popper to the triggerTargets's parentNode so
    // it's directly after the reference element so the elements inside the
    // tippy can be tabbed to
    // If there are clipping issues, the user can specify a different appendTo
    // and ensure focus management is handled correctly manually

    var node = getCurrentTarget();

    if (instance.props.interactive && appendTo === TIPPY_DEFAULT_APPEND_TO || appendTo === 'parent') {
      parentNode = node.parentNode;
    } else {
      parentNode = invokeWithArgsOrReturn(appendTo, [node]);
    } // The popper element needs to exist on the DOM before its position can be
    // updated as Popper needs to read its dimensions


    if (!parentNode.contains(popper)) {
      parentNode.appendChild(popper);
    }

    instance.state.isMounted = true;
    createPopperInstance();
    /* istanbul ignore else */

    if (false) {}
  }

  function getNestedPopperTree() {
    return arrayFrom(popper.querySelectorAll('[data-tippy-root]'));
  }

  function scheduleShow(event) {
    instance.clearDelayTimeouts();

    if (event) {
      invokeHook('onTrigger', [instance, event]);
    }

    addDocumentPress();
    var delay = getDelay(true);

    var _getNormalizedTouchSe = getNormalizedTouchSettings(),
        touchValue = _getNormalizedTouchSe[0],
        touchDelay = _getNormalizedTouchSe[1];

    if (currentInput.isTouch && touchValue === 'hold' && touchDelay) {
      delay = touchDelay;
    }

    if (delay) {
      showTimeout = setTimeout(function () {
        instance.show();
      }, delay);
    } else {
      instance.show();
    }
  }

  function scheduleHide(event) {
    instance.clearDelayTimeouts();
    invokeHook('onUntrigger', [instance, event]);

    if (!instance.state.isVisible) {
      removeDocumentPress();
      return;
    } // For interactive tippies, scheduleHide is added to a document.body handler
    // from onMouseLeave so must intercept scheduled hides from mousemove/leave
    // events when trigger contains mouseenter and click, and the tip is
    // currently shown as a result of a click.


    if (instance.props.trigger.indexOf('mouseenter') >= 0 && instance.props.trigger.indexOf('click') >= 0 && ['mouseleave', 'mousemove'].indexOf(event.type) >= 0 && isVisibleFromClick) {
      return;
    }

    var delay = getDelay(false);

    if (delay) {
      hideTimeout = setTimeout(function () {
        if (instance.state.isVisible) {
          instance.hide();
        }
      }, delay);
    } else {
      // Fixes a `transitionend` problem when it fires 1 frame too
      // late sometimes, we don't want hide() to be called.
      scheduleHideAnimationFrame = requestAnimationFrame(function () {
        instance.hide();
      });
    }
  } // ===========================================================================
  // 🔑 Public methods
  // ===========================================================================


  function enable() {
    instance.state.isEnabled = true;
  }

  function disable() {
    // Disabling the instance should also hide it
    // https://github.com/atomiks/tippy.js-react/issues/106
    instance.hide();
    instance.state.isEnabled = false;
  }

  function clearDelayTimeouts() {
    clearTimeout(showTimeout);
    clearTimeout(hideTimeout);
    cancelAnimationFrame(scheduleHideAnimationFrame);
  }

  function setProps(partialProps) {
    /* istanbul ignore else */
    if (false) {}

    if (instance.state.isDestroyed) {
      return;
    }

    invokeHook('onBeforeUpdate', [instance, partialProps]);
    removeListeners();
    var prevProps = instance.props;
    var nextProps = evaluateProps(reference, Object.assign({}, prevProps, removeUndefinedProps(partialProps), {
      ignoreAttributes: true
    }));
    instance.props = nextProps;
    addListeners();

    if (prevProps.interactiveDebounce !== nextProps.interactiveDebounce) {
      cleanupInteractiveMouseListeners();
      debouncedOnMouseMove = tippy_esm_debounce(onMouseMove, nextProps.interactiveDebounce);
    } // Ensure stale aria-expanded attributes are removed


    if (prevProps.triggerTarget && !nextProps.triggerTarget) {
      normalizeToArray(prevProps.triggerTarget).forEach(function (node) {
        node.removeAttribute('aria-expanded');
      });
    } else if (nextProps.triggerTarget) {
      reference.removeAttribute('aria-expanded');
    }

    handleAriaExpandedAttribute();
    handleStyles();

    if (onUpdate) {
      onUpdate(prevProps, nextProps);
    }

    if (instance.popperInstance) {
      createPopperInstance(); // Fixes an issue with nested tippies if they are all getting re-rendered,
      // and the nested ones get re-rendered first.
      // https://github.com/atomiks/tippyjs-react/issues/177
      // TODO: find a cleaner / more efficient solution(!)

      getNestedPopperTree().forEach(function (nestedPopper) {
        // React (and other UI libs likely) requires a rAF wrapper as it flushes
        // its work in one
        requestAnimationFrame(nestedPopper._tippy.popperInstance.forceUpdate);
      });
    }

    invokeHook('onAfterUpdate', [instance, partialProps]);
  }

  function setContent(content) {
    instance.setProps({
      content: content
    });
  }

  function show() {
    /* istanbul ignore else */
    if (false) {} // Early bail-out


    var isAlreadyVisible = instance.state.isVisible;
    var isDestroyed = instance.state.isDestroyed;
    var isDisabled = !instance.state.isEnabled;
    var isTouchAndTouchDisabled = currentInput.isTouch && !instance.props.touch;
    var duration = getValueAtIndexOrReturn(instance.props.duration, 0, defaultProps.duration);

    if (isAlreadyVisible || isDestroyed || isDisabled || isTouchAndTouchDisabled) {
      return;
    } // Normalize `disabled` behavior across browsers.
    // Firefox allows events on disabled elements, but Chrome doesn't.
    // Using a wrapper element (i.e. <span>) is recommended.


    if (getCurrentTarget().hasAttribute('disabled')) {
      return;
    }

    invokeHook('onShow', [instance], false);

    if (instance.props.onShow(instance) === false) {
      return;
    }

    instance.state.isVisible = true;

    if (getIsDefaultRenderFn()) {
      popper.style.visibility = 'visible';
    }

    handleStyles();
    addDocumentPress();

    if (!instance.state.isMounted) {
      popper.style.transition = 'none';
    } // If flipping to the opposite side after hiding at least once, the
    // animation will use the wrong placement without resetting the duration


    if (getIsDefaultRenderFn()) {
      var _getDefaultTemplateCh2 = getDefaultTemplateChildren(),
          box = _getDefaultTemplateCh2.box,
          content = _getDefaultTemplateCh2.content;

      setTransitionDuration([box, content], 0);
    }

    onFirstUpdate = function onFirstUpdate() {
      var _instance$popperInsta2;

      if (!instance.state.isVisible || ignoreOnFirstUpdate) {
        return;
      }

      ignoreOnFirstUpdate = true; // reflow

      void popper.offsetHeight;
      popper.style.transition = instance.props.moveTransition;

      if (getIsDefaultRenderFn() && instance.props.animation) {
        var _getDefaultTemplateCh3 = getDefaultTemplateChildren(),
            _box = _getDefaultTemplateCh3.box,
            _content = _getDefaultTemplateCh3.content;

        setTransitionDuration([_box, _content], duration);
        setVisibilityState([_box, _content], 'visible');
      }

      handleAriaContentAttribute();
      handleAriaExpandedAttribute();
      pushIfUnique(mountedInstances, instance); // certain modifiers (e.g. `maxSize`) require a second update after the
      // popper has been positioned for the first time

      (_instance$popperInsta2 = instance.popperInstance) == null ? void 0 : _instance$popperInsta2.forceUpdate();
      invokeHook('onMount', [instance]);

      if (instance.props.animation && getIsDefaultRenderFn()) {
        onTransitionedIn(duration, function () {
          instance.state.isShown = true;
          invokeHook('onShown', [instance]);
        });
      }
    };

    mount();
  }

  function hide() {
    /* istanbul ignore else */
    if (false) {} // Early bail-out


    var isAlreadyHidden = !instance.state.isVisible;
    var isDestroyed = instance.state.isDestroyed;
    var isDisabled = !instance.state.isEnabled;
    var duration = getValueAtIndexOrReturn(instance.props.duration, 1, defaultProps.duration);

    if (isAlreadyHidden || isDestroyed || isDisabled) {
      return;
    }

    invokeHook('onHide', [instance], false);

    if (instance.props.onHide(instance) === false) {
      return;
    }

    instance.state.isVisible = false;
    instance.state.isShown = false;
    ignoreOnFirstUpdate = false;
    isVisibleFromClick = false;

    if (getIsDefaultRenderFn()) {
      popper.style.visibility = 'hidden';
    }

    cleanupInteractiveMouseListeners();
    removeDocumentPress();
    handleStyles(true);

    if (getIsDefaultRenderFn()) {
      var _getDefaultTemplateCh4 = getDefaultTemplateChildren(),
          box = _getDefaultTemplateCh4.box,
          content = _getDefaultTemplateCh4.content;

      if (instance.props.animation) {
        setTransitionDuration([box, content], duration);
        setVisibilityState([box, content], 'hidden');
      }
    }

    handleAriaContentAttribute();
    handleAriaExpandedAttribute();

    if (instance.props.animation) {
      if (getIsDefaultRenderFn()) {
        onTransitionedOut(duration, instance.unmount);
      }
    } else {
      instance.unmount();
    }
  }

  function hideWithInteractivity(event) {
    /* istanbul ignore else */
    if (false) {}

    getDocument().addEventListener('mousemove', debouncedOnMouseMove);
    pushIfUnique(mouseMoveListeners, debouncedOnMouseMove);
    debouncedOnMouseMove(event);
  }

  function unmount() {
    /* istanbul ignore else */
    if (false) {}

    if (instance.state.isVisible) {
      instance.hide();
    }

    if (!instance.state.isMounted) {
      return;
    }

    destroyPopperInstance(); // If a popper is not interactive, it will be appended outside the popper
    // tree by default. This seems mainly for interactive tippies, but we should
    // find a workaround if possible

    getNestedPopperTree().forEach(function (nestedPopper) {
      nestedPopper._tippy.unmount();
    });

    if (popper.parentNode) {
      popper.parentNode.removeChild(popper);
    }

    mountedInstances = mountedInstances.filter(function (i) {
      return i !== instance;
    });
    instance.state.isMounted = false;
    invokeHook('onHidden', [instance]);
  }

  function destroy() {
    /* istanbul ignore else */
    if (false) {}

    if (instance.state.isDestroyed) {
      return;
    }

    instance.clearDelayTimeouts();
    instance.unmount();
    removeListeners();
    delete reference._tippy;
    instance.state.isDestroyed = true;
    invokeHook('onDestroy', [instance]);
  }
}

function tippy(targets, optionalProps) {
  if (optionalProps === void 0) {
    optionalProps = {};
  }

  var plugins = defaultProps.plugins.concat(optionalProps.plugins || []);
  /* istanbul ignore else */

  if (false) {}

  bindGlobalEventListeners();
  var passedProps = Object.assign({}, optionalProps, {
    plugins: plugins
  });
  var elements = getArrayOfElements(targets);
  /* istanbul ignore else */

  if (false) { var isMoreThanOneReferenceElement, isSingleContentElement; }

  var instances = elements.reduce(function (acc, reference) {
    var instance = reference && createTippy(reference, passedProps);

    if (instance) {
      acc.push(instance);
    }

    return acc;
  }, []);
  return tippy_esm_isElement(targets) ? instances[0] : instances;
}

tippy.defaultProps = defaultProps;
tippy.setDefaultProps = setDefaultProps;
tippy.currentInput = currentInput;
var hideAll = function hideAll(_temp) {
  var _ref = _temp === void 0 ? {} : _temp,
      excludedReferenceOrInstance = _ref.exclude,
      duration = _ref.duration;

  mountedInstances.forEach(function (instance) {
    var isExcluded = false;

    if (excludedReferenceOrInstance) {
      isExcluded = isReferenceElement(excludedReferenceOrInstance) ? instance.reference === excludedReferenceOrInstance : instance.popper === excludedReferenceOrInstance.popper;
    }

    if (!isExcluded) {
      var originalDuration = instance.props.duration;
      instance.setProps({
        duration: duration
      });
      instance.hide();

      if (!instance.state.isDestroyed) {
        instance.setProps({
          duration: originalDuration
        });
      }
    }
  });
};

// every time the popper is destroyed (i.e. a new target), removing the styles
// and causing transitions to break for singletons when the console is open, but
// most notably for non-transform styles being used, `gpuAcceleration: false`.

var applyStylesModifier = Object.assign({}, modifiers_applyStyles, {
  effect: function effect(_ref) {
    var state = _ref.state;
    var initialStyles = {
      popper: {
        position: state.options.strategy,
        left: '0',
        top: '0',
        margin: '0'
      },
      arrow: {
        position: 'absolute'
      },
      reference: {}
    };
    Object.assign(state.elements.popper.style, initialStyles.popper);
    state.styles = initialStyles;

    if (state.elements.arrow) {
      Object.assign(state.elements.arrow.style, initialStyles.arrow);
    } // intentionally return no cleanup function
    // return () => { ... }

  }
});

var createSingleton = function createSingleton(tippyInstances, optionalProps) {
  var _optionalProps$popper;

  if (optionalProps === void 0) {
    optionalProps = {};
  }

  /* istanbul ignore else */
  if (false) {}

  var individualInstances = tippyInstances;
  var references = [];
  var triggerTargets = [];
  var currentTarget;
  var overrides = optionalProps.overrides;
  var interceptSetPropsCleanups = [];
  var shownOnCreate = false;

  function setTriggerTargets() {
    triggerTargets = individualInstances.map(function (instance) {
      return normalizeToArray(instance.props.triggerTarget || instance.reference);
    }).reduce(function (acc, item) {
      return acc.concat(item);
    }, []);
  }

  function setReferences() {
    references = individualInstances.map(function (instance) {
      return instance.reference;
    });
  }

  function enableInstances(isEnabled) {
    individualInstances.forEach(function (instance) {
      if (isEnabled) {
        instance.enable();
      } else {
        instance.disable();
      }
    });
  }

  function interceptSetProps(singleton) {
    return individualInstances.map(function (instance) {
      var originalSetProps = instance.setProps;

      instance.setProps = function (props) {
        originalSetProps(props);

        if (instance.reference === currentTarget) {
          singleton.setProps(props);
        }
      };

      return function () {
        instance.setProps = originalSetProps;
      };
    });
  } // have to pass singleton, as it maybe undefined on first call


  function prepareInstance(singleton, target) {
    var index = triggerTargets.indexOf(target); // bail-out

    if (target === currentTarget) {
      return;
    }

    currentTarget = target;
    var overrideProps = (overrides || []).concat('content').reduce(function (acc, prop) {
      acc[prop] = individualInstances[index].props[prop];
      return acc;
    }, {});
    singleton.setProps(Object.assign({}, overrideProps, {
      getReferenceClientRect: typeof overrideProps.getReferenceClientRect === 'function' ? overrideProps.getReferenceClientRect : function () {
        var _references$index;

        return (_references$index = references[index]) == null ? void 0 : _references$index.getBoundingClientRect();
      }
    }));
  }

  enableInstances(false);
  setReferences();
  setTriggerTargets();
  var plugin = {
    fn: function fn() {
      return {
        onDestroy: function onDestroy() {
          enableInstances(true);
        },
        onHidden: function onHidden() {
          currentTarget = null;
        },
        onClickOutside: function onClickOutside(instance) {
          if (instance.props.showOnCreate && !shownOnCreate) {
            shownOnCreate = true;
            currentTarget = null;
          }
        },
        onShow: function onShow(instance) {
          if (instance.props.showOnCreate && !shownOnCreate) {
            shownOnCreate = true;
            prepareInstance(instance, references[0]);
          }
        },
        onTrigger: function onTrigger(instance, event) {
          prepareInstance(instance, event.currentTarget);
        }
      };
    }
  };
  var singleton = tippy(div(), Object.assign({}, removeProperties(optionalProps, ['overrides']), {
    plugins: [plugin].concat(optionalProps.plugins || []),
    triggerTarget: triggerTargets,
    popperOptions: Object.assign({}, optionalProps.popperOptions, {
      modifiers: [].concat(((_optionalProps$popper = optionalProps.popperOptions) == null ? void 0 : _optionalProps$popper.modifiers) || [], [applyStylesModifier])
    })
  }));
  var originalShow = singleton.show;

  singleton.show = function (target) {
    originalShow(); // first time, showOnCreate or programmatic call with no params
    // default to showing first instance

    if (!currentTarget && target == null) {
      return prepareInstance(singleton, references[0]);
    } // triggered from event (do nothing as prepareInstance already called by onTrigger)
    // programmatic call with no params when already visible (do nothing again)


    if (currentTarget && target == null) {
      return;
    } // target is index of instance


    if (typeof target === 'number') {
      return references[target] && prepareInstance(singleton, references[target]);
    } // target is a child tippy instance


    if (individualInstances.indexOf(target) >= 0) {
      var ref = target.reference;
      return prepareInstance(singleton, ref);
    } // target is a ReferenceElement


    if (references.indexOf(target) >= 0) {
      return prepareInstance(singleton, target);
    }
  };

  singleton.showNext = function () {
    var first = references[0];

    if (!currentTarget) {
      return singleton.show(0);
    }

    var index = references.indexOf(currentTarget);
    singleton.show(references[index + 1] || first);
  };

  singleton.showPrevious = function () {
    var last = references[references.length - 1];

    if (!currentTarget) {
      return singleton.show(last);
    }

    var index = references.indexOf(currentTarget);
    var target = references[index - 1] || last;
    singleton.show(target);
  };

  var originalSetProps = singleton.setProps;

  singleton.setProps = function (props) {
    overrides = props.overrides || overrides;
    originalSetProps(props);
  };

  singleton.setInstances = function (nextInstances) {
    enableInstances(true);
    interceptSetPropsCleanups.forEach(function (fn) {
      return fn();
    });
    individualInstances = nextInstances;
    enableInstances(false);
    setReferences();
    setTriggerTargets();
    interceptSetPropsCleanups = interceptSetProps(singleton);
    singleton.setProps({
      triggerTarget: triggerTargets
    });
  };

  interceptSetPropsCleanups = interceptSetProps(singleton);
  return singleton;
};

var BUBBLING_EVENTS_MAP = {
  mouseover: 'mouseenter',
  focusin: 'focus',
  click: 'click'
};
/**
 * Creates a delegate instance that controls the creation of tippy instances
 * for child elements (`target` CSS selector).
 */

function delegate(targets, props) {
  /* istanbul ignore else */
  if (false) {}

  var listeners = [];
  var childTippyInstances = [];
  var disabled = false;
  var target = props.target;
  var nativeProps = removeProperties(props, ['target']);
  var parentProps = Object.assign({}, nativeProps, {
    trigger: 'manual',
    touch: false
  });
  var childProps = Object.assign({
    touch: defaultProps.touch
  }, nativeProps, {
    showOnCreate: true
  });
  var returnValue = tippy(targets, parentProps);
  var normalizedReturnValue = normalizeToArray(returnValue);

  function onTrigger(event) {
    if (!event.target || disabled) {
      return;
    }

    var targetNode = event.target.closest(target);

    if (!targetNode) {
      return;
    } // Get relevant trigger with fallbacks:
    // 1. Check `data-tippy-trigger` attribute on target node
    // 2. Fallback to `trigger` passed to `delegate()`
    // 3. Fallback to `defaultProps.trigger`


    var trigger = targetNode.getAttribute('data-tippy-trigger') || props.trigger || defaultProps.trigger; // @ts-ignore

    if (targetNode._tippy) {
      return;
    }

    if (event.type === 'touchstart' && typeof childProps.touch === 'boolean') {
      return;
    }

    if (event.type !== 'touchstart' && trigger.indexOf(BUBBLING_EVENTS_MAP[event.type]) < 0) {
      return;
    }

    var instance = tippy(targetNode, childProps);

    if (instance) {
      childTippyInstances = childTippyInstances.concat(instance);
    }
  }

  function on(node, eventType, handler, options) {
    if (options === void 0) {
      options = false;
    }

    node.addEventListener(eventType, handler, options);
    listeners.push({
      node: node,
      eventType: eventType,
      handler: handler,
      options: options
    });
  }

  function addEventListeners(instance) {
    var reference = instance.reference;
    on(reference, 'touchstart', onTrigger, TOUCH_OPTIONS);
    on(reference, 'mouseover', onTrigger);
    on(reference, 'focusin', onTrigger);
    on(reference, 'click', onTrigger);
  }

  function removeEventListeners() {
    listeners.forEach(function (_ref) {
      var node = _ref.node,
          eventType = _ref.eventType,
          handler = _ref.handler,
          options = _ref.options;
      node.removeEventListener(eventType, handler, options);
    });
    listeners = [];
  }

  function applyMutations(instance) {
    var originalDestroy = instance.destroy;
    var originalEnable = instance.enable;
    var originalDisable = instance.disable;

    instance.destroy = function (shouldDestroyChildInstances) {
      if (shouldDestroyChildInstances === void 0) {
        shouldDestroyChildInstances = true;
      }

      if (shouldDestroyChildInstances) {
        childTippyInstances.forEach(function (instance) {
          instance.destroy();
        });
      }

      childTippyInstances = [];
      removeEventListeners();
      originalDestroy();
    };

    instance.enable = function () {
      originalEnable();
      childTippyInstances.forEach(function (instance) {
        return instance.enable();
      });
      disabled = false;
    };

    instance.disable = function () {
      originalDisable();
      childTippyInstances.forEach(function (instance) {
        return instance.disable();
      });
      disabled = true;
    };

    addEventListeners(instance);
  }

  normalizedReturnValue.forEach(applyMutations);
  return returnValue;
}

var animateFill = {
  name: 'animateFill',
  defaultValue: false,
  fn: function fn(instance) {
    var _instance$props$rende;

    // @ts-ignore
    if (!((_instance$props$rende = instance.props.render) != null && _instance$props$rende.$$tippy)) {
      if (false) {}

      return {};
    }

    var _getChildren = getChildren(instance.popper),
        box = _getChildren.box,
        content = _getChildren.content;

    var backdrop = instance.props.animateFill ? createBackdropElement() : null;
    return {
      onCreate: function onCreate() {
        if (backdrop) {
          box.insertBefore(backdrop, box.firstElementChild);
          box.setAttribute('data-animatefill', '');
          box.style.overflow = 'hidden';
          instance.setProps({
            arrow: false,
            animation: 'shift-away'
          });
        }
      },
      onMount: function onMount() {
        if (backdrop) {
          var transitionDuration = box.style.transitionDuration;
          var duration = Number(transitionDuration.replace('ms', '')); // The content should fade in after the backdrop has mostly filled the
          // tooltip element. `clip-path` is the other alternative but is not
          // well-supported and is buggy on some devices.

          content.style.transitionDelay = Math.round(duration / 10) + "ms";
          backdrop.style.transitionDuration = transitionDuration;
          setVisibilityState([backdrop], 'visible');
        }
      },
      onShow: function onShow() {
        if (backdrop) {
          backdrop.style.transitionDuration = '0ms';
        }
      },
      onHide: function onHide() {
        if (backdrop) {
          setVisibilityState([backdrop], 'hidden');
        }
      }
    };
  }
};

function createBackdropElement() {
  var backdrop = div();
  backdrop.className = BACKDROP_CLASS;
  setVisibilityState([backdrop], 'hidden');
  return backdrop;
}

var mouseCoords = {
  clientX: 0,
  clientY: 0
};
var activeInstances = [];

function storeMouseCoords(_ref) {
  var clientX = _ref.clientX,
      clientY = _ref.clientY;
  mouseCoords = {
    clientX: clientX,
    clientY: clientY
  };
}

function addMouseCoordsListener(doc) {
  doc.addEventListener('mousemove', storeMouseCoords);
}

function removeMouseCoordsListener(doc) {
  doc.removeEventListener('mousemove', storeMouseCoords);
}

var followCursor = {
  name: 'followCursor',
  defaultValue: false,
  fn: function fn(instance) {
    var reference = instance.reference;
    var doc = getOwnerDocument(instance.props.triggerTarget || reference);
    var isInternalUpdate = false;
    var wasFocusEvent = false;
    var isUnmounted = true;
    var prevProps = instance.props;

    function getIsInitialBehavior() {
      return instance.props.followCursor === 'initial' && instance.state.isVisible;
    }

    function addListener() {
      doc.addEventListener('mousemove', onMouseMove);
    }

    function removeListener() {
      doc.removeEventListener('mousemove', onMouseMove);
    }

    function unsetGetReferenceClientRect() {
      isInternalUpdate = true;
      instance.setProps({
        getReferenceClientRect: null
      });
      isInternalUpdate = false;
    }

    function onMouseMove(event) {
      // If the instance is interactive, avoid updating the position unless it's
      // over the reference element
      var isCursorOverReference = event.target ? reference.contains(event.target) : true;
      var followCursor = instance.props.followCursor;
      var clientX = event.clientX,
          clientY = event.clientY;
      var rect = reference.getBoundingClientRect();
      var relativeX = clientX - rect.left;
      var relativeY = clientY - rect.top;

      if (isCursorOverReference || !instance.props.interactive) {
        instance.setProps({
          // @ts-ignore - unneeded DOMRect properties
          getReferenceClientRect: function getReferenceClientRect() {
            var rect = reference.getBoundingClientRect();
            var x = clientX;
            var y = clientY;

            if (followCursor === 'initial') {
              x = rect.left + relativeX;
              y = rect.top + relativeY;
            }

            var top = followCursor === 'horizontal' ? rect.top : y;
            var right = followCursor === 'vertical' ? rect.right : x;
            var bottom = followCursor === 'horizontal' ? rect.bottom : y;
            var left = followCursor === 'vertical' ? rect.left : x;
            return {
              width: right - left,
              height: bottom - top,
              top: top,
              right: right,
              bottom: bottom,
              left: left
            };
          }
        });
      }
    }

    function create() {
      if (instance.props.followCursor) {
        activeInstances.push({
          instance: instance,
          doc: doc
        });
        addMouseCoordsListener(doc);
      }
    }

    function destroy() {
      activeInstances = activeInstances.filter(function (data) {
        return data.instance !== instance;
      });

      if (activeInstances.filter(function (data) {
        return data.doc === doc;
      }).length === 0) {
        removeMouseCoordsListener(doc);
      }
    }

    return {
      onCreate: create,
      onDestroy: destroy,
      onBeforeUpdate: function onBeforeUpdate() {
        prevProps = instance.props;
      },
      onAfterUpdate: function onAfterUpdate(_, _ref2) {
        var followCursor = _ref2.followCursor;

        if (isInternalUpdate) {
          return;
        }

        if (followCursor !== undefined && prevProps.followCursor !== followCursor) {
          destroy();

          if (followCursor) {
            create();

            if (instance.state.isMounted && !wasFocusEvent && !getIsInitialBehavior()) {
              addListener();
            }
          } else {
            removeListener();
            unsetGetReferenceClientRect();
          }
        }
      },
      onMount: function onMount() {
        if (instance.props.followCursor && !wasFocusEvent) {
          if (isUnmounted) {
            onMouseMove(mouseCoords);
            isUnmounted = false;
          }

          if (!getIsInitialBehavior()) {
            addListener();
          }
        }
      },
      onTrigger: function onTrigger(_, event) {
        if (isMouseEvent(event)) {
          mouseCoords = {
            clientX: event.clientX,
            clientY: event.clientY
          };
        }

        wasFocusEvent = event.type === 'focus';
      },
      onHidden: function onHidden() {
        if (instance.props.followCursor) {
          unsetGetReferenceClientRect();
          removeListener();
          isUnmounted = true;
        }
      }
    };
  }
};

function getProps(props, modifier) {
  var _props$popperOptions;

  return {
    popperOptions: Object.assign({}, props.popperOptions, {
      modifiers: [].concat((((_props$popperOptions = props.popperOptions) == null ? void 0 : _props$popperOptions.modifiers) || []).filter(function (_ref) {
        var name = _ref.name;
        return name !== modifier.name;
      }), [modifier])
    })
  };
}

var inlinePositioning = {
  name: 'inlinePositioning',
  defaultValue: false,
  fn: function fn(instance) {
    var reference = instance.reference;

    function isEnabled() {
      return !!instance.props.inlinePositioning;
    }

    var placement;
    var cursorRectIndex = -1;
    var isInternalUpdate = false;
    var triedPlacements = [];
    var modifier = {
      name: 'tippyInlinePositioning',
      enabled: true,
      phase: 'afterWrite',
      fn: function fn(_ref2) {
        var state = _ref2.state;

        if (isEnabled()) {
          if (triedPlacements.indexOf(state.placement) !== -1) {
            triedPlacements = [];
          }

          if (placement !== state.placement && triedPlacements.indexOf(state.placement) === -1) {
            triedPlacements.push(state.placement);
            instance.setProps({
              // @ts-ignore - unneeded DOMRect properties
              getReferenceClientRect: function getReferenceClientRect() {
                return _getReferenceClientRect(state.placement);
              }
            });
          }

          placement = state.placement;
        }
      }
    };

    function _getReferenceClientRect(placement) {
      return getInlineBoundingClientRect(tippy_esm_getBasePlacement(placement), reference.getBoundingClientRect(), arrayFrom(reference.getClientRects()), cursorRectIndex);
    }

    function setInternalProps(partialProps) {
      isInternalUpdate = true;
      instance.setProps(partialProps);
      isInternalUpdate = false;
    }

    function addModifier() {
      if (!isInternalUpdate) {
        setInternalProps(getProps(instance.props, modifier));
      }
    }

    return {
      onCreate: addModifier,
      onAfterUpdate: addModifier,
      onTrigger: function onTrigger(_, event) {
        if (isMouseEvent(event)) {
          var rects = arrayFrom(instance.reference.getClientRects());
          var cursorRect = rects.find(function (rect) {
            return rect.left - 2 <= event.clientX && rect.right + 2 >= event.clientX && rect.top - 2 <= event.clientY && rect.bottom + 2 >= event.clientY;
          });
          var index = rects.indexOf(cursorRect);
          cursorRectIndex = index > -1 ? index : cursorRectIndex;
        }
      },
      onHidden: function onHidden() {
        cursorRectIndex = -1;
      }
    };
  }
};
function getInlineBoundingClientRect(currentBasePlacement, boundingRect, clientRects, cursorRectIndex) {
  // Not an inline element, or placement is not yet known
  if (clientRects.length < 2 || currentBasePlacement === null) {
    return boundingRect;
  } // There are two rects and they are disjoined


  if (clientRects.length === 2 && cursorRectIndex >= 0 && clientRects[0].left > clientRects[1].right) {
    return clientRects[cursorRectIndex] || boundingRect;
  }

  switch (currentBasePlacement) {
    case 'top':
    case 'bottom':
      {
        var firstRect = clientRects[0];
        var lastRect = clientRects[clientRects.length - 1];
        var isTop = currentBasePlacement === 'top';
        var top = firstRect.top;
        var bottom = lastRect.bottom;
        var left = isTop ? firstRect.left : lastRect.left;
        var right = isTop ? firstRect.right : lastRect.right;
        var width = right - left;
        var height = bottom - top;
        return {
          top: top,
          bottom: bottom,
          left: left,
          right: right,
          width: width,
          height: height
        };
      }

    case 'left':
    case 'right':
      {
        var minLeft = Math.min.apply(Math, clientRects.map(function (rects) {
          return rects.left;
        }));
        var maxRight = Math.max.apply(Math, clientRects.map(function (rects) {
          return rects.right;
        }));
        var measureRects = clientRects.filter(function (rect) {
          return currentBasePlacement === 'left' ? rect.left === minLeft : rect.right === maxRight;
        });
        var _top = measureRects[0].top;
        var _bottom = measureRects[measureRects.length - 1].bottom;
        var _left = minLeft;
        var _right = maxRight;

        var _width = _right - _left;

        var _height = _bottom - _top;

        return {
          top: _top,
          bottom: _bottom,
          left: _left,
          right: _right,
          width: _width,
          height: _height
        };
      }

    default:
      {
        return boundingRect;
      }
  }
}

var sticky = {
  name: 'sticky',
  defaultValue: false,
  fn: function fn(instance) {
    var reference = instance.reference,
        popper = instance.popper;

    function getReference() {
      return instance.popperInstance ? instance.popperInstance.state.elements.reference : reference;
    }

    function shouldCheck(value) {
      return instance.props.sticky === true || instance.props.sticky === value;
    }

    var prevRefRect = null;
    var prevPopRect = null;

    function updatePosition() {
      var currentRefRect = shouldCheck('reference') ? getReference().getBoundingClientRect() : null;
      var currentPopRect = shouldCheck('popper') ? popper.getBoundingClientRect() : null;

      if (currentRefRect && areRectsDifferent(prevRefRect, currentRefRect) || currentPopRect && areRectsDifferent(prevPopRect, currentPopRect)) {
        if (instance.popperInstance) {
          instance.popperInstance.update();
        }
      }

      prevRefRect = currentRefRect;
      prevPopRect = currentPopRect;

      if (instance.state.isMounted) {
        requestAnimationFrame(updatePosition);
      }
    }

    return {
      onMount: function onMount() {
        if (instance.props.sticky) {
          updatePosition();
        }
      }
    };
  }
};

function areRectsDifferent(rectA, rectB) {
  if (rectA && rectB) {
    return rectA.top !== rectB.top || rectA.right !== rectB.right || rectA.bottom !== rectB.bottom || rectA.left !== rectB.left;
  }

  return true;
}

tippy.setDefaultProps({
  render: render
});

/* harmony default export */ const tippy_esm = (tippy);

//# sourceMappingURL=tippy.esm.js.map


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
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {

;// CONCATENATED MODULE: ./node_modules/@4site/engrid-common/dist/deprecated.js
// A way to gracefully handle deprecation.
// Find and replace HTML Elements, Classes, and more after the DOM is loaded but before any other Javascript fires.

class Deprecated {
    constructor() {
        let deprecated;
        let replacement;
        // Checks for body-side class
        deprecated = document.querySelector(".body-side");
        if (deprecated) {
            this.warning(deprecated);
        }
        // Checks for backgroundImage class
        deprecated = document.querySelector(".backgroundImage");
        if (deprecated) {
            replacement = "background-image";
            this.replace(deprecated, replacement);
        }
        // Checks for backgroundImageOverlay class
        deprecated = document.querySelector(".backgroundImageOverlay");
        if (deprecated) {
            replacement = "background-image-overlay";
            this.replace(deprecated, replacement);
        }
    }
    warning(deprecated) {
        if (ENGrid.debug)
            console.log("Deprecated: '" + deprecated + "' was detected and nothing was done.");
    }
    replace(deprecated, replacement) {
        if (ENGrid.debug)
            console.log("Deprecated: '" +
                deprecated +
                "' was detected and replaced with '" +
                replacement +
                "'.");
        deprecated.classList.add(replacement);
        deprecated.classList.remove(deprecated);
    }
}

;// CONCATENATED MODULE: ./node_modules/@4site/engrid-common/dist/interfaces/options.js
const OptionsDefaults = {
    backgroundImage: "",
    MediaAttribution: true,
    applePay: false,
    CapitalizeFields: false,
    ClickToExpand: true,
    CurrencySymbol: "$",
    ThousandsSeparator: "",
    DecimalSeparator: ".",
    DecimalPlaces: 2,
    SkipToMainContentLink: true,
    SrcDefer: true,
    NeverBounceAPI: null,
    NeverBounceDateField: null,
    NeverBounceStatusField: null,
    NeverBounceDateFormat: "MM/DD/YYYY",
    ProgressBar: false,
    AutoYear: false,
    TranslateFields: true,
    Debug: false,
    RememberMe: false,
};

;// CONCATENATED MODULE: ./node_modules/@4site/engrid-common/dist/interfaces/upsell-options.js
const UpsellOptionsDefaults = {
    image: "https://picsum.photos/480/650",
    imagePosition: "left",
    title: "Will you change your gift to just {new-amount} a month to boost your impact?",
    paragraph: "Make a monthly pledge today to support us with consistent, reliable resources during emergency moments.",
    yesLabel: "Yes! Process My <br> {new-amount} monthly gift",
    noLabel: "No, thanks. Continue with my <br> {old-amount} one-time gift",
    otherAmount: true,
    otherLabel: "Or enter a different monthly amount:",
    upsellOriginalGiftAmountFieldName: "",
    amountRange: [
        { max: 10, suggestion: 5 },
        { max: 15, suggestion: 7 },
        { max: 20, suggestion: 8 },
        { max: 25, suggestion: 9 },
        { max: 30, suggestion: 10 },
        { max: 35, suggestion: 11 },
        { max: 40, suggestion: 12 },
        { max: 50, suggestion: 14 },
        { max: 100, suggestion: 15 },
        { max: 200, suggestion: 19 },
        { max: 300, suggestion: 29 },
        { max: 500, suggestion: "Math.ceil((amount / 12)/5)*5" },
    ],
    minAmount: 0,
    canClose: true,
    submitOnClose: false,
};

;// CONCATENATED MODULE: ./node_modules/@4site/engrid-common/dist/interfaces/translate-options.js
const ptbrTranslation = [
    { field: "supporter.firstName", translation: "Nome" },
    { field: "supporter.lastName", translation: "Sobrenome" },
    { field: "supporter.phoneNumber", translation: "Celular" },
    { field: "supporter.address1", translation: "Endereço" },
    { field: "supporter.address2", translation: "Complemento" },
    { field: "supporter.postcode", translation: "CEP" },
    { field: "supporter.city", translation: "Cidade" },
    { field: "supporter.region", translation: "Estado" },
    { field: "supporter.country", translation: "País" },
];
const deTranslation = [
    { field: "supporter.address1", translation: "Straße, Hausnummer" },
    { field: "supporter.postcode", translation: "Postleitzahl" },
    { field: "supporter.city", translation: "Ort" },
    { field: "supporter.region", translation: "Bundesland" },
    { field: "supporter.country", translation: "Land" },
];
const frTranslation = [
    { field: "supporter.address1", translation: "Adresse" },
    { field: "supporter.postcode", translation: "Code Postal" },
    { field: "supporter.city", translation: "Ville" },
    { field: "supporter.region", translation: "Région" },
    { field: "supporter.country", translation: "Country" },
];
const nlTranslation = [
    { field: "supporter.address1", translation: "Adres" },
    { field: "supporter.postcode", translation: "Postcode" },
    { field: "supporter.city", translation: "Woonplaats" },
    { field: "supporter.region", translation: "Provincie" },
    { field: "supporter.country", translation: "Country" },
];
const TranslateOptionsDefaults = {
    BR: ptbrTranslation,
    BRA: ptbrTranslation,
    DE: deTranslation,
    DEU: deTranslation,
    FR: frTranslation,
    FRA: frTranslation,
    NL: nlTranslation,
    NLD: nlTranslation,
};

;// CONCATENATED MODULE: ./node_modules/@4site/engrid-common/dist/loader.js
// Ref: https://app.getguru.com/card/iMgx968T/ENgrid-Loader

class Loader {
    constructor() {
        this.logger = new EngridLogger("Logger", "gold", "black", "🔁");
        this.cssElement = document.querySelector('link[href*="engrid."][rel="stylesheet"]');
        this.jsElement = document.querySelector('script[src*="engrid."]');
    }
    // Returns true if ENgrid should reload (that means the current ENgrid is not the right one)
    // Returns false if ENgrid should not reload (that means the current ENgrid is the right one)
    reload() {
        var _a, _b, _c;
        const isLoaded = engrid_ENGrid.getBodyData("loaded");
        let assets = this.getOption("assets");
        if (isLoaded || !assets) {
            this.logger.success("ENgrid Loader: LOADED");
            return false;
        }
        // Load the right ENgrid
        this.logger.log("ENgrid Loader: RELOADING");
        engrid_ENGrid.setBodyData("loaded", "true"); // Set the loaded flag, so the next time we don't reload
        // Fetch the desired repo, assets location, and override JS/CSS
        const engrid_repo = this.getOption("repo-name");
        const engrid_repo_owner = this.getOption("repo-owner");
        let engrid_js_url = "";
        let engrid_css_url = "";
        switch (assets) {
            case "local":
                this.logger.log("ENgrid Loader: LOADING LOCAL");
                // Find a way to guess local URL if there's no engrid_repo
                if (!engrid_repo) {
                    const theme = engrid_ENGrid.getBodyData("theme");
                    engrid_js_url = `https://engrid-${theme}.test/dist/engrid.js`;
                    engrid_css_url = `https://engrid-${theme}.test/dist/engrid.css`;
                }
                else {
                    engrid_js_url = `https://engrid-${engrid_repo}.test/dist/engrid.js`;
                    engrid_css_url = `https://engrid-${engrid_repo}.test/dist/engrid.css`;
                }
                break;
            case "flush":
                this.logger.log("ENgrid Loader: FLUSHING CACHE");
                const timestamp = Date.now();
                const jsCurrentURL = new URL(((_a = this.jsElement) === null || _a === void 0 ? void 0 : _a.getAttribute("src")) || "");
                jsCurrentURL.searchParams.set("v", timestamp.toString());
                engrid_js_url = jsCurrentURL.toString();
                const cssCurrentURL = new URL(((_b = this.cssElement) === null || _b === void 0 ? void 0 : _b.getAttribute("href")) || "");
                cssCurrentURL.searchParams.set("v", timestamp.toString());
                engrid_css_url = cssCurrentURL.toString();
                break;
            default:
                this.logger.log("ENgrid Loader: LOADING EXTERNAL");
                engrid_js_url =
                    "https://cdn.jsdelivr.net/gh/" +
                        engrid_repo_owner +
                        "/" +
                        engrid_repo +
                        "@" +
                        assets +
                        "/dist/engrid.js";
                engrid_css_url =
                    "https://cdn.jsdelivr.net/gh/" +
                        engrid_repo_owner +
                        "/" +
                        engrid_repo +
                        "@" +
                        assets +
                        "/dist/engrid.css";
        }
        this.setCssFile(engrid_css_url);
        this.setJsFile(engrid_js_url);
        (_c = this.jsElement) === null || _c === void 0 ? void 0 : _c.remove();
        return true;
    }
    getOption(key) {
        const urlParam = engrid_ENGrid.getUrlParameter(key);
        // Only "assets" can be set in URL
        if (urlParam && key === "assets") {
            return urlParam;
        }
        else if (window.EngridLoader && window.EngridLoader.hasOwnProperty(key)) {
            return window.EngridLoader[key];
        }
        else if (this.jsElement && this.jsElement.hasAttribute("data-" + key)) {
            return this.jsElement.getAttribute("data-" + key);
        }
        return null;
    }
    setCssFile(url) {
        if (this.cssElement) {
            this.cssElement.setAttribute("href", url);
        }
        else {
            const link = document.createElement("link");
            link.setAttribute("rel", "stylesheet");
            link.setAttribute("type", "text/css");
            link.setAttribute("media", "all");
            link.setAttribute("href", url);
            document.head.appendChild(link);
        }
    }
    setJsFile(url) {
        const script = document.createElement("script");
        script.setAttribute("src", url);
        document.head.appendChild(script);
    }
}

// EXTERNAL MODULE: ./node_modules/@4site/engrid-common/node_modules/strongly-typed-events/dist/index.js
var dist = __webpack_require__(5363);
;// CONCATENATED MODULE: ./node_modules/@4site/engrid-common/dist/events/en-form.js


class EnForm {
    constructor() {
        this.logger = new EngridLogger("EnForm");
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
        this.logger.log("dispatchSubmit");
    }
    dispatchValidate() {
        this._onValidate.dispatch();
        this.logger.log("dispatchValidate");
    }
    dispatchError() {
        this._onError.dispatch();
        this.logger.log("dispatchError");
    }
    submitForm() {
        const enForm = document.querySelector("form .en__submit button");
        if (enForm) {
            // Add submitting class to modal
            const enModal = document.getElementById("enModal");
            if (enModal)
                enModal.classList.add("is-submitting");
            enForm.click();
            this.logger.log("submitForm");
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

;// CONCATENATED MODULE: ./node_modules/@4site/engrid-common/dist/events/donation-amount.js

class DonationAmount {
    constructor(radios = "transaction.donationAmt", other = "transaction.donationAmt.other") {
        this._onAmountChange = new dist/* SimpleEventDispatcher */.FK();
        this._amount = 0;
        this._radios = "";
        this._other = "";
        this._dispatch = true;
        this._other = other;
        this._radios = radios;
        // Watch Radios Inputs for Changes
        document.addEventListener("change", (e) => {
            const element = e.target;
            if (element && element.name == radios) {
                element.value = this.removeCommas(element.value);
                this.amount = parseFloat(element.value);
            }
        });
        // Watch Other Amount Field
        const otherField = document.querySelector(`[name='${this._other}']`);
        if (otherField) {
            otherField.addEventListener("keyup", (e) => {
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
    }
    // Every time we set an amount, trigger the onAmountChange event
    set amount(value) {
        this._amount = value || 0;
        if (this._dispatch)
            this._onAmountChange.dispatch(this._amount);
    }
    get onAmountChange() {
        return this._onAmountChange.asEvent();
    }
    // Set amount var with currently selected amount
    load() {
        const currentAmountField = document.querySelector('input[name="' + this._radios + '"]:checked');
        if (currentAmountField && currentAmountField.value) {
            let currentAmountValue = parseFloat(currentAmountField.value);
            if (currentAmountValue > 0) {
                this.amount = parseFloat(currentAmountField.value);
            }
            else {
                const otherField = document.querySelector('input[name="' + this._other + '"]');
                currentAmountValue = parseFloat(otherField.value);
                this.amount = parseFloat(otherField.value);
            }
        }
    }
    // Force a new amount
    setAmount(amount, dispatch = true) {
        // Run only if it is a Donation Page with a Donation Amount field
        if (!document.getElementsByName(this._radios).length) {
            return;
        }
        // Set dispatch to be checked by the SET method
        this._dispatch = dispatch;
        // Search for the current amount on radio boxes
        let found = Array.from(document.querySelectorAll('input[name="' + this._radios + '"]')).filter((el) => el instanceof HTMLInputElement && parseInt(el.value) == amount);
        // We found the amount on the radio boxes, so check it
        if (found.length) {
            const amountField = found[0];
            amountField.checked = true;
            // Clear OTHER text field
            this.clearOther();
        }
        else {
            const otherField = document.querySelector('input[name="' + this._other + '"]');
            otherField.focus();
            otherField.value = parseFloat(amount.toString()).toFixed(2);
        }
        // Set the new amount and trigger all live variables
        this.amount = amount;
        // Revert dispatch to default value (true)
        this._dispatch = true;
    }
    // Clear Other Field
    clearOther() {
        const otherField = document.querySelector('input[name="' + this._other + '"]');
        otherField.value = "";
        const otherWrapper = otherField.parentNode;
        otherWrapper.classList.add("en__field__item--hidden");
    }
    // Remove commas
    removeCommas(v) {
        // replace 5,00 with 5.00
        if (v.length > 3 && v.charAt(v.length - 3) == ",") {
            v = v.substr(0, v.length - 3) + "." + v.substr(v.length - 2, 2);
        }
        else if (v.length > 2 && v.charAt(v.length - 2) == ",") {
            v = v.substr(0, v.length - 2) + "." + v.substr(v.length - 1, 1);
        }
        // replace any remaining commas
        return v.replace(/,/g, "");
    }
}

;// CONCATENATED MODULE: ./node_modules/@4site/engrid-common/dist/engrid.js
class engrid_ENGrid {
    constructor() {
        if (!engrid_ENGrid.enForm) {
            throw new Error("Engaging Networks Form Not Found!");
        }
    }
    static get enForm() {
        return document.querySelector("form.en__component");
    }
    static get debug() {
        return !!this.getOption("Debug");
    }
    // Return any parameter from the URL
    static getUrlParameter(name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
        var results = regex.exec(location.search);
        return results === null
            ? ""
            : decodeURIComponent(results[1].replace(/\+/g, " "));
    }
    // Return the field value from its name. It works on any field type.
    // Multiple values (from checkboxes or multi-select) are returned as single string
    // Separated by ,
    static getFieldValue(name) {
        return new FormData(this.enForm).getAll(name).join(",");
    }
    // Set a value to any field. If it's a dropdown, radio or checkbox, it selects the proper option matching the value
    static setFieldValue(name, value) {
        document.getElementsByName(name).forEach((field) => {
            if ("type" in field) {
                switch (field.type) {
                    case "select-one":
                    case "select-multiple":
                        for (const option of field.options) {
                            if (option.value == value) {
                                option.selected = true;
                            }
                        }
                        break;
                    case "checkbox":
                    case "radio":
                        // @TODO: Try to trigger the onChange event
                        if (field.value == value) {
                            field.checked = true;
                        }
                        break;
                    case "textarea":
                    case "text":
                    default:
                        field.value = value;
                }
            }
        });
        this.enParseDependencies();
        return;
    }
    // Create a hidden input field
    static createHiddenInput(name, value = "") {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = name;
        input.classList.add("en__field__input");
        input.classList.add("en__field__input--text");
        input.classList.add("engrid-added-input");
        input.value = value;
        engrid_ENGrid.enForm.appendChild(input);
        return input;
    }
    // Trigger EN Dependencies
    static enParseDependencies() {
        var _a, _b, _c, _d, _e;
        if (window.EngagingNetworks &&
            typeof ((_e = (_d = (_c = (_b = (_a = window.EngagingNetworks) === null || _a === void 0 ? void 0 : _a.require) === null || _b === void 0 ? void 0 : _b._defined) === null || _c === void 0 ? void 0 : _c.enDependencies) === null || _d === void 0 ? void 0 : _d.dependencies) === null || _e === void 0 ? void 0 : _e.parseDependencies) === "function") {
            window.EngagingNetworks.require._defined.enDependencies.dependencies.parseDependencies(window.EngagingNetworks.dependencies);
            if (engrid_ENGrid.getOption("Debug"))
                console.trace("EN Dependencies Triggered");
        }
    }
    // Return the status of the gift process (true if a donation has been made, otherwise false)
    static getGiftProcess() {
        if ("pageJson" in window)
            return window.pageJson.giftProcess;
        return null;
    }
    // Return the page count
    static getPageCount() {
        if ("pageJson" in window)
            return window.pageJson.pageCount;
        return null;
    }
    // Return the current page number
    static getPageNumber() {
        if ("pageJson" in window)
            return window.pageJson.pageNumber;
        return null;
    }
    // Return the current page ID
    static getPageID() {
        if ("pageJson" in window)
            return window.pageJson.campaignPageId;
        return 0;
    }
    // Return the current page type
    static getPageType() {
        if ("pageJson" in window && "pageType" in window.pageJson) {
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
                case "supporterhub":
                    return "SUPPORTERHUB";
                    break;
                default:
                    return "DONATION";
            }
        }
        else {
            return "DONATION";
        }
    }
    // Set body engrid data attributes
    static setBodyData(dataName, value) {
        const body = document.querySelector("body");
        // If value is boolean
        if (typeof value === "boolean" && value === false) {
            body.removeAttribute(`data-engrid-${dataName}`);
            return;
        }
        body.setAttribute(`data-engrid-${dataName}`, value.toString());
    }
    // Get body engrid data attributes
    static getBodyData(dataName) {
        const body = document.querySelector("body");
        return body.getAttribute(`data-engrid-${dataName}`);
    }
    // Return the option value
    static getOption(key) {
        return window.EngridOptions[key] || null;
    }
    // Load an external script
    static loadJS(url, onload = null, head = true) {
        const scriptTag = document.createElement("script");
        scriptTag.src = url;
        scriptTag.onload = onload;
        if (head) {
            document.getElementsByTagName("head")[0].appendChild(scriptTag);
            return;
        }
        document.getElementsByTagName("body")[0].appendChild(scriptTag);
        return;
    }
    // Format a number
    static formatNumber(number, decimals = 2, dec_point = ".", thousands_sep = ",") {
        // Strip all characters but numerical ones.
        number = (number + "").replace(/[^0-9+\-Ee.]/g, "");
        const n = !isFinite(+number) ? 0 : +number;
        const prec = !isFinite(+decimals) ? 0 : Math.abs(decimals);
        const sep = typeof thousands_sep === "undefined" ? "," : thousands_sep;
        const dec = typeof dec_point === "undefined" ? "." : dec_point;
        let s = [];
        const toFixedFix = function (n, prec) {
            const k = Math.pow(10, prec);
            return "" + Math.round(n * k) / k;
        };
        // Fix for IE parseFloat(0.55).toFixed(0) = 0;
        s = (prec ? toFixedFix(n, prec) : "" + Math.round(n)).split(".");
        if (s[0].length > 3) {
            s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
        }
        if ((s[1] || "").length < prec) {
            s[1] = s[1] || "";
            s[1] += new Array(prec - s[1].length + 1).join("0");
        }
        return s.join(dec);
    }
    static disableSubmit(label = "") {
        const submit = document.querySelector(".en__submit button");
        submit.dataset.originalText = submit.innerText;
        let submitButtonProcessingHTML = "<span class='loader-wrapper'><span class='loader loader-quart'></span><span class='submit-button-text-wrapper'>" +
            label +
            "</span></span>";
        if (submit) {
            submit.disabled = true;
            submit.innerHTML = submitButtonProcessingHTML;
            return true;
        }
        return false;
    }
    static enableSubmit() {
        const submit = document.querySelector(".en__submit button");
        if (submit.dataset.originalText) {
            submit.disabled = false;
            submit.innerText = submit.dataset.originalText;
            delete submit.dataset.originalText;
            return true;
        }
        return false;
    }
    static formatDate(date, format = "MM/DD/YYYY") {
        const dateAray = date
            .toLocaleDateString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        })
            .split("/");
        const dateString = format
            .replace(/YYYY/g, dateAray[2])
            .replace(/MM/g, dateAray[0])
            .replace(/DD/g, dateAray[1])
            .replace(/YY/g, dateAray[2].substr(2, 2));
        return dateString;
    }
    /**
     * Check if the provided object has ALL the provided properties
     * Example: checkNested(EngagingNetworks, 'require', '_defined', 'enjs', 'checkSubmissionFailed')
     * will return true if EngagingNetworks.require._defined.enjs.checkSubmissionFailed is defined
     */
    static checkNested(obj, ...args) {
        for (let i = 0; i < args.length; i++) {
            if (!obj || !obj.hasOwnProperty(args[i])) {
                return false;
            }
            obj = obj[args[i]];
        }
        return true;
    }
}

;// CONCATENATED MODULE: ./node_modules/@4site/engrid-common/dist/events/donation-frequency.js


class DonationFrequency {
    constructor() {
        this._onFrequencyChange = new dist/* SimpleEventDispatcher */.FK();
        this._frequency = "onetime";
        this._recurring = "n";
        this._dispatch = true;
        // Watch the Radios for Changes
        document.addEventListener("change", (e) => {
            const element = e.target;
            if (element && element.name == "transaction.recurrpay") {
                this.recurring = element.value;
                // When this element is a radio, that means you're between onetime and monthly only
                if (element.type == "radio") {
                    this.frequency =
                        element.value.toLowerCase() == "n" ? "onetime" : "monthly";
                    // This field is hidden when transaction.recurrpay is radio
                    engrid_ENGrid.setFieldValue("transaction.recurrfreq", this.frequency.toUpperCase());
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
    }
    // Every time we set a frequency, trigger the onFrequencyChange event
    set frequency(value) {
        this._frequency = value.toLowerCase() || "onetime";
        if (this._dispatch)
            this._onFrequencyChange.dispatch(this._frequency);
        engrid_ENGrid.setBodyData("transaction-recurring-frequency", this._frequency);
    }
    get recurring() {
        return this._recurring;
    }
    set recurring(value) {
        this._recurring = value.toLowerCase() || "n";
        engrid_ENGrid.setBodyData("transaction-recurring", this._recurring);
    }
    get onFrequencyChange() {
        return this._onFrequencyChange.asEvent();
    }
    // Set amount var with currently selected amount
    load() {
        this.frequency = engrid_ENGrid.getFieldValue("transaction.recurrfreq");
        this.recurring = engrid_ENGrid.getFieldValue("transaction.recurrpay");
        // ENGrid.enParseDependencies();
    }
    // Force a new recurrency
    setRecurrency(recurr, dispatch = true) {
        // Run only if it is a Donation Page with a Recurrency
        if (!document.getElementsByName("transaction.recurrpay").length) {
            return;
        }
        // Set dispatch to be checked by the SET method
        this._dispatch = dispatch;
        engrid_ENGrid.setFieldValue("transaction.recurrpay", recurr.toUpperCase());
        // Revert dispatch to default value (true)
        this._dispatch = true;
    }
    // Force a new frequency
    setFrequency(freq, dispatch = true) {
        // Run only if it is a Donation Page with a Frequency
        if (!document.getElementsByName("transaction.recurrfreq").length) {
            return;
        }
        // Set dispatch to be checked by the SET method
        this._dispatch = dispatch;
        // Search for the current amount on radio boxes
        let found = Array.from(document.querySelectorAll('input[name="transaction.recurrfreq"]')).filter((el) => el instanceof HTMLInputElement && el.value == freq.toUpperCase());
        // We found the amount on the radio boxes, so check it
        if (found.length) {
            const freqField = found[0];
            freqField.checked = true;
            this.frequency = freq.toLowerCase();
            if (this.frequency === "onetime") {
                this.setRecurrency("N", dispatch);
            }
            else {
                this.setRecurrency("Y", dispatch);
            }
        }
        // Revert dispatch to default value (true)
        this._dispatch = true;
    }
}

;// CONCATENATED MODULE: ./node_modules/@4site/engrid-common/dist/events/processing-fees.js



class ProcessingFees {
    constructor() {
        this._onFeeChange = new dist/* SimpleEventDispatcher */.FK();
        this._amount = DonationAmount.getInstance();
        this._form = EnForm.getInstance();
        this._fee = 0;
        this._field = null;
        // console.log('%c Processing Fees Constructor', 'font-size: 30px; background-color: #000; color: #FF0');
        // Run only if it is a Donation Page with a Donation Amount field
        if (!document.getElementsByName("transaction.donationAmt").length) {
            return;
        }
        this._field = this.isENfeeCover()
            ? document.querySelector("#en__field_transaction_feeCover")
            : document.querySelector('input[name="supporter.processing_fees"]');
        // Watch the Radios for Changes
        if (this._field instanceof HTMLInputElement) {
            // console.log('%c Processing Fees Start', 'font-size: 30px; background-color: #000; color: #FF0');
            this._field.addEventListener("change", (e) => {
                if (this._field instanceof HTMLInputElement &&
                    this._field.checked &&
                    !this._subscribe) {
                    this._subscribe = this._form.onSubmit.subscribe(() => this.addFees());
                }
                this._onFeeChange.dispatch(this.fee);
                // // console.log('%c Processing Fees Script Applied', 'font-size: 30px; background-color: #000; color: #FF0');
            });
        }
        // this._amount = amount;
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
    }
    // Every time we set a frequency, trigger the onFrequencyChange event
    set fee(value) {
        this._fee = value;
        this._onFeeChange.dispatch(this._fee);
    }
    calculateFees(amount = 0) {
        var _a;
        if (this._field instanceof HTMLInputElement && this._field.checked) {
            if (this.isENfeeCover()) {
                return amount > 0
                    ? window.EngagingNetworks.require._defined.enjs.feeCover.fee(amount)
                    : window.EngagingNetworks.require._defined.enjs.getDonationFee();
            }
            const fees = Object.assign({
                processingfeepercentadded: "0",
                processingfeefixedamountadded: "0",
            }, (_a = this._field) === null || _a === void 0 ? void 0 : _a.dataset);
            const amountToFee = amount > 0 ? amount : this._amount.amount;
            const processing_fee = (parseFloat(fees.processingfeepercentadded) / 100) * amountToFee +
                parseFloat(fees.processingfeefixedamountadded);
            return Math.round(processing_fee * 100) / 100;
        }
        return 0;
    }
    // Add Fees to Amount
    addFees() {
        if (this._form.submit && !this.isENfeeCover()) {
            this._amount.setAmount(this._amount.amount + this.fee, false);
        }
    }
    // Remove Fees From Amount
    removeFees() {
        if (!this.isENfeeCover())
            this._amount.setAmount(this._amount.amount - this.fee);
    }
    // Check if this is a Processing Fee from EN
    isENfeeCover() {
        if ("feeCover" in window.EngagingNetworks) {
            for (const key in window.EngagingNetworks.feeCover) {
                if (window.EngagingNetworks.feeCover.hasOwnProperty(key)) {
                    return true;
                }
            }
        }
        return false;
    }
}

;// CONCATENATED MODULE: ./node_modules/@4site/engrid-common/dist/events/index.js





;// CONCATENATED MODULE: ./node_modules/@4site/engrid-common/dist/app.js


class App extends engrid_ENGrid {
    constructor(options) {
        super();
        // Events
        this._form = EnForm.getInstance();
        this._fees = ProcessingFees.getInstance();
        this._amount = DonationAmount.getInstance("transaction.donationAmt", "transaction.donationAmt.other");
        this._frequency = DonationFrequency.getInstance();
        this.logger = new EngridLogger("App", "black", "white", "🍏");
        this.shouldScroll = () => {
            // If you find a error, scroll
            if (document.querySelector(".en__errorHeader")) {
                return true;
            }
            // Try to match the iframe referrer URL by testing valid EN Page URLs
            let referrer = document.referrer;
            let enURLPattern = new RegExp(/^(.*)\/(page)\/(\d+.*)/);
            // Scroll if the Regex matches, don't scroll otherwise
            return enURLPattern.test(referrer);
        };
        const loader = new Loader();
        this.options = Object.assign(Object.assign({}, OptionsDefaults), options);
        // Add Options to window
        window.EngridOptions = this.options;
        if (loader.reload())
            return;
        // Document Load
        if (document.readyState !== "loading") {
            this.run();
        }
        else {
            document.addEventListener("DOMContentLoaded", () => {
                this.run();
            });
        }
        // Window Load
        let onLoad = typeof window.onload === "function" ? window.onload : null;
        window.onload = (e) => {
            this.onLoad();
            if (onLoad) {
                onLoad.bind(window, e);
            }
        };
        // Window Resize
        window.onresize = () => {
            this.onResize();
        };
    }
    run() {
        if (!engrid_ENGrid.checkNested(window.EngagingNetworks, "require", "_defined", "enjs")) {
            this.logger.danger("Engaging Networks JS Framework NOT FOUND");
            setTimeout(() => {
                this.run();
            }, 10);
            return;
        }
        if (this.options.Debug || App.getUrlParameter("debug") == "true")
            // Enable debug if available is the first thing
            App.setBodyData("debug", "");
        // Page Background
        new PageBackground();
        // TODO: Abstract everything to the App class so we can remove custom-methods
        inputPlaceholder();
        preventAutocomplete();
        watchInmemField();
        watchGiveBySelectField();
        SetEnFieldOtherAmountRadioStepValue();
        simpleUnsubscribe();
        contactDetailLabels();
        easyEdit();
        enInput.init();
        new ShowHideRadioCheckboxes("transaction.giveBySelect", "giveBySelect-");
        new ShowHideRadioCheckboxes("transaction.inmem", "inmem-");
        new ShowHideRadioCheckboxes("transaction.recurrpay", "recurrpay-");
        // Automatically show/hide all radios
        let radioFields = [];
        const allRadios = document.querySelectorAll("input[type=radio]");
        allRadios.forEach((radio) => {
            if ("name" in radio && radioFields.includes(radio.name) === false) {
                radioFields.push(radio.name);
            }
        });
        radioFields.forEach((field) => {
            new ShowHideRadioCheckboxes(field, "engrid__" + field.replace(/\./g, "") + "-");
        });
        // Automatically show/hide all checkboxes
        const allCheckboxes = document.querySelectorAll("input[type=checkbox]");
        allCheckboxes.forEach((checkbox) => {
            if ("name" in checkbox) {
                new ShowHideRadioCheckboxes(checkbox.name, "engrid__" + checkbox.name.replace(/\./g, "") + "-");
            }
        });
        // Controls if the Theme has a the "Debug Bar"
        // legacy.debugBar();
        // Client onSubmit and onError functions
        this._form.onSubmit.subscribe(() => this.onSubmit());
        this._form.onError.subscribe(() => this.onError());
        this._form.onValidate.subscribe(() => this.onValidate());
        // Event Listener Examples
        this._amount.onAmountChange.subscribe((s) => this.logger.success(`Live Amount: ${s}`));
        this._frequency.onFrequencyChange.subscribe((s) => {
            this.logger.success(`Live Frequency: ${s}`);
            setTimeout(() => {
                this._amount.load();
            }, 150);
        });
        this._form.onSubmit.subscribe((s) => this.logger.success("Submit: " + s));
        this._form.onError.subscribe((s) => this.logger.danger("Error: " + s));
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
        };
        // iFrame Logic
        this.loadIFrame();
        // Live Variables
        new LiveVariables(this.options);
        // Dynamically set Recurrency Frequency
        new setRecurrFreq();
        // Upsell Lightbox
        new UpsellLightbox();
        // Amount Labels
        new AmountLabel();
        // On the end of the script, after all subscribers defined, let's load the current value
        this._amount.load();
        this._frequency.load();
        // Translate Fields
        if (this.options.TranslateFields)
            new TranslateFields();
        // Simple Country Select
        new SimpleCountrySelect();
        // Add Image Attribution
        if (this.options.MediaAttribution)
            new MediaAttribution();
        // Apple Pay
        if (this.options.applePay)
            new ApplePay();
        // Capitalize Fields
        if (this.options.CapitalizeFields)
            new CapitalizeFields();
        // Auto Year Class
        if (this.options.AutoYear)
            new AutoYear();
        // Credit Card Numbers Only
        new CreditCardNumbers();
        // Autocomplete Class
        new Autocomplete();
        // Ecard Class
        new Ecard();
        // Click To Expand
        if (this.options.ClickToExpand)
            new ClickToExpand();
        if (this.options.SkipToMainContentLink)
            new SkipToMainContentLink();
        if (this.options.SrcDefer)
            new SrcDefer();
        // Progress Bar
        if (this.options.ProgressBar)
            new ProgressBar();
        // RememberMe
        if (this.options.RememberMe && typeof this.options.RememberMe === "object")
            new RememberMe(this.options.RememberMe);
        if (this.options.NeverBounceAPI)
            new NeverBounce(this.options.NeverBounceAPI, this.options.NeverBounceDateField, this.options.NeverBounceStatusField, this.options.NeverBounceDateFormat);
        new ShowIfAmount();
        new OtherAmount();
        this.setDataAttributes();
    }
    onLoad() {
        if (this.options.onLoad) {
            this.options.onLoad();
        }
        if (this.inIframe()) {
            // Scroll to top of iFrame
            this.logger.log("iFrame Event - window.onload");
            sendIframeHeight();
            window.parent.postMessage({
                scroll: this.shouldScroll(),
            }, "*");
            // On click fire the resize event
            document.addEventListener("click", (e) => {
                this.logger.log("iFrame Event - click");
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
            this.logger.log("iFrame Event - window.onload");
            sendIframeHeight();
        }
    }
    onValidate() {
        if (this.options.onValidate) {
            this.logger.log("Client onValidate Triggered");
            this.options.onValidate();
        }
    }
    onSubmit() {
        if (this.options.onSubmit) {
            this.logger.log("Client onSubmit Triggered");
            this.options.onSubmit();
        }
        if (this.inIframe()) {
            sendIframeFormStatus("submit");
        }
    }
    onError() {
        if (this.options.onError) {
            this.logger.danger("Client onError Triggered");
            this.options.onError();
        }
    }
    inIframe() {
        try {
            return window.self !== window.top;
        }
        catch (e) {
            return true;
        }
    }
    loadIFrame() {
        if (this.inIframe()) {
            // Add the data-engrid-embedded attribute when inside an iFrame if it wasn't already added by a script in the Page Template
            App.setBodyData("embedded", "");
            // Fire the resize event
            this.logger.log("iFrame Event - First Resize");
            sendIframeHeight();
        }
    }
    // Use this function to add any Data Attributes to the Body tag
    setDataAttributes() {
        // Add the Page Type as a Data Attribute on the video
        if (engrid_ENGrid.checkNested(window, "pageJson", "pageType")) {
            App.setBodyData("page-type", window.pageJson.pageType);
            this.logger.log("Page Type: " + window.pageJson.pageType);
        }
        else {
            this.logger.log("Page Type: Not Found");
        }
        // Add a body banner data attribute if the banner contains no image
        // @TODO Should this account for video?
        // @TODO Should we merge this with the script that checks the background image?
        if (!document.querySelector(".body-banner img")) {
            App.setBodyData("body-banner", "empty");
        }
        // Add a page-alert data attribute if it is empty
        if (!document.querySelector(".page-alert *")) {
            App.setBodyData("no-page-alert", "");
        }
        // Add a content-header data attribute if it is empty
        if (!document.querySelector(".content-header *")) {
            App.setBodyData("no-content-header", "");
        }
        // Add a body-headerOutside data attribute if it is empty
        if (!document.querySelector(".body-headerOutside *")) {
            App.setBodyData("no-body-headerOutside", "");
        }
        // Add a body-header data attribute if it is empty
        if (!document.querySelector(".body-header *")) {
            App.setBodyData("no-body-header", "");
        }
        // Add a body-title data attribute if it is empty
        if (!document.querySelector(".body-title *")) {
            App.setBodyData("no-body-title", "");
        }
        // Add a body-banner data attribute if it is empty
        if (!document.querySelector(".body-banner *")) {
            App.setBodyData("no-body-banner", "");
        }
        // Add a body-bannerOverlay data attribute if it is empty
        if (!document.querySelector(".body-bannerOverlay *")) {
            App.setBodyData("no-body-bannerOverlay", "");
        }
        // Add a body-top data attribute if it is empty
        if (!document.querySelector(".body-top *")) {
            App.setBodyData("no-body-top", "");
        }
        // Add a body-main data attribute if it is empty
        if (!document.querySelector(".body-main *")) {
            App.setBodyData("no-body-main", "");
        }
        // Add a body-bottom data attribute if it is empty
        if (!document.querySelector(".body-bottom *")) {
            App.setBodyData("no-body-bottom", "");
        }
        // Add a body-footer data attribute if it is empty
        if (!document.querySelector(".body-footer *")) {
            App.setBodyData("no-body-footer", "");
        }
        // Add a body-footerOutside data attribute if it is empty
        if (!document.querySelector(".body-footerOutside *")) {
            App.setBodyData("no-body-footerOutside", "");
        }
        // Add a content-footerSpacer data attribute if it is empty
        if (!document.querySelector(".content-footerSpacer *")) {
            App.setBodyData("no-content-footerSpacer", "");
        }
        // Add a content-preFooter data attribute if it is empty
        if (!document.querySelector(".content-preFooter *")) {
            App.setBodyData("no-content-preFooter", "");
        }
        // Add a content-footer data attribute if it is empty
        if (!document.querySelector(".content-footer *")) {
            App.setBodyData("no-content-footer", "");
        }
        // Add a page-backgroundImage data attribute if it is empty
        if (!document.querySelector(".page-backgroundImage *")) {
            App.setBodyData("no-page-backgroundImage", "");
        }
        // Add a page-backgroundImageOverlay data attribute if it is empty
        if (!document.querySelector(".page-backgroundImageOverlay *")) {
            App.setBodyData("no-page-backgroundImageOverlay", "");
        }
        // Add a page-customCode data attribute if it is empty
        if (!document.querySelector(".page-customCode *")) {
            App.setBodyData("no-page-customCode", "");
        }
        // Add a country data attribute
        const countrySelect = document.querySelector("#en__field_supporter_country");
        if (countrySelect) {
            App.setBodyData("country", countrySelect.value);
            countrySelect.addEventListener("change", () => {
                App.setBodyData("country", countrySelect.value);
            });
        }
    }
}

;// CONCATENATED MODULE: ./node_modules/@4site/engrid-common/dist/amount-label.js
// This script checks if the donations amounts are numbers and if they are, appends the correct currency symbol

class AmountLabel {
    constructor() {
        this._frequency = DonationFrequency.getInstance();
        if (!this.shouldRun()) {
            // If we're not on a Donation Page, get out
            return;
        }
        this._frequency.onFrequencyChange.subscribe((s) => window.setTimeout(this.fixAmountLabels.bind(this), 100));
        // Run the main function on page load so we can analyze the amounts of the current frequency
        window.setTimeout(this.fixAmountLabels.bind(this), 300);
    }
    // Should we run the script?
    shouldRun() {
        return engrid_ENGrid.getPageType() === "DONATION";
    }
    // Fix Amount Labels
    fixAmountLabels() {
        let amounts = document.querySelectorAll(".en__field--donationAmt label");
        amounts.forEach((element) => {
            if (!isNaN(element.innerText)) {
                element.innerText =
                    engrid_ENGrid.getOption("CurrencySymbol") + element.innerText;
            }
        });
    }
}

;// CONCATENATED MODULE: ./node_modules/@4site/engrid-common/dist/apple-pay.js
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
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
        this._fees = ProcessingFees.getInstance();
        this._form = EnForm.getInstance();
        this.checkApplePay();
    }
    checkApplePay() {
        return __awaiter(this, void 0, void 0, function* () {
            const pageform = document.querySelector("form.en__component--page");
            if (!this.applePay || !window.hasOwnProperty("ApplePaySession")) {
                const applePayContainer = document.querySelector(".en__field__item.applepay");
                if (applePayContainer)
                    applePayContainer.remove();
                if (engrid_ENGrid.debug)
                    console.log("Apple Pay DISABLED");
                return false;
            }
            const promise = ApplePaySession.canMakePaymentsWithActiveCard(merchantIdentifier);
            let applePayEnabled = false;
            yield promise.then((canMakePayments) => {
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
            if (engrid_ENGrid.debug)
                console.log("applePayEnabled", applePayEnabled);
            let applePayWrapper = this.applePay.closest(".en__field__item");
            if (applePayEnabled) {
                // Set Apple Pay Class
                applePayWrapper === null || applePayWrapper === void 0 ? void 0 : applePayWrapper.classList.add("applePayWrapper");
            }
            else {
                // Hide Apple Pay Wrapper
                if (applePayWrapper)
                    applePayWrapper.style.display = "none";
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
            var validationData = "&merchantIdentifier=" +
                merchantIdentifier +
                "&merchantDomain=" +
                merchantDomainName +
                "&displayName=" +
                merchantDisplayName;
            var validationUrl = "/ea-dataservice/rest/applepay/validateurl?url=" + url + validationData;
            var xhr = new XMLHttpRequest();
            xhr.onload = function () {
                var data = JSON.parse(this.responseText);
                if (engrid_ENGrid.debug)
                    console.log("Apple Pay Validation", data);
                resolve(data);
            };
            xhr.onerror = reject;
            xhr.open("GET", validationUrl);
            xhr.send();
        });
    }
    log(name, msg) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "/ea-dataservice/rest/applepay/log?name=" + name + "&msg=" + msg);
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
        const formClass = this._form;
        // Only work if Payment Type is Apple Pay
        if (enFieldPaymentType.value == "applepay" && applePayToken.value == "") {
            try {
                let donationAmount = this._amount.amount + this._fees.fee;
                var request = {
                    supportedNetworks: merchantSupportedNetworks,
                    merchantCapabilities: merchantCapabilities,
                    countryCode: merchantCountryCode,
                    currencyCode: merchantCurrencyCode,
                    total: {
                        label: merchantTotalLabel,
                        amount: donationAmount,
                    },
                };
                var session = new ApplePaySession(1, request);
                var thisClass = this;
                session.onvalidatemerchant = function (event) {
                    thisClass
                        .performValidation(event.validationURL)
                        .then(function (merchantSession) {
                        if (engrid_ENGrid.debug)
                            console.log("Apple Pay merchantSession", merchantSession);
                        session.completeMerchantValidation(merchantSession);
                    });
                };
                session.onpaymentauthorized = function (event) {
                    thisClass
                        .sendPaymentToken(event.payment.token)
                        .then(function (success) {
                        if (engrid_ENGrid.debug)
                            console.log("Apple Pay Token", event.payment.token);
                        document.getElementById("applePayToken").value = JSON.stringify(event.payment.token);
                        formClass.submitForm();
                    });
                };
                session.oncancel = function (event) {
                    if (engrid_ENGrid.debug)
                        console.log("Cancelled", event);
                    alert("You cancelled. Sorry it didn't work out.");
                    formClass.dispatchError();
                };
                session.begin();
                this._form.submit = false;
                return false;
            }
            catch (e) {
                alert("Developer mistake: '" + e.message + "'");
                formClass.dispatchError();
            }
        }
        this._form.submit = true;
        return true;
    }
}

;// CONCATENATED MODULE: ./node_modules/@4site/engrid-common/dist/capitalize-fields.js


class CapitalizeFields {
    constructor() {
        this._form = EnForm.getInstance();
        this._form.onSubmit.subscribe(() => this.capitalizeFields("en__field_supporter_firstName", "en__field_supporter_lastName", "en__field_supporter_address1", "en__field_supporter_city"));
    }
    capitalizeFields(...fields) {
        fields.forEach((f) => this.capitalize(f));
    }
    capitalize(f) {
        let field = document.getElementById(f);
        if (field) {
            field.value = field.value.replace(/\w\S*/g, (w) => w.replace(/^\w/, (c) => c.toUpperCase()));
            if (engrid_ENGrid.debug)
                console.log("Capitalized", field.value);
        }
        return true;
    }
}

;// CONCATENATED MODULE: ./node_modules/@4site/engrid-common/dist/credit-card-numbers.js
// This class removes any non-numeric characters from the credit card field

class CreditCardNumbers {
    constructor() {
        this._form = EnForm.getInstance();
        this.ccField = document.getElementById("en__field_transaction_ccnumber");
        if (this.ccField) {
            this._form.onSubmit.subscribe(() => this.onlyNumbersCC());
        }
    }
    onlyNumbersCC() {
        const onlyNumbers = this.ccField.value.replace(/\D/g, "");
        this.ccField.value = onlyNumbers;
        return true;
    }
}

;// CONCATENATED MODULE: ./node_modules/@4site/engrid-common/dist/auto-year.js
// This class changes the Credit Card Expiration Year Field Options to
// include the current year and the next 19 years.
class AutoYear {
    constructor() {
        this.yearField = document.querySelector("select[name='transaction.ccexpire']:not(#en__field_transaction_ccexpire)");
        this.years = 20;
        this.yearLength = 2;
        if (this.yearField) {
            this.clearFieldOptions();
            for (let i = 0; i < this.years; i++) {
                const year = new Date().getFullYear() + i;
                const newOption = document.createElement("option");
                const optionText = document.createTextNode(year.toString());
                newOption.appendChild(optionText);
                newOption.value =
                    this.yearLength == 2 ? year.toString().substr(-2) : year.toString();
                this.yearField.appendChild(newOption);
            }
        }
    }
    clearFieldOptions() {
        if (this.yearField) {
            this.yearLength =
                this.yearField.options[this.yearField.options.length - 1].value.length;
            while (this.yearField.options.length > 1) {
                this.yearField.remove(1);
            }
        }
    }
}

;// CONCATENATED MODULE: ./node_modules/@4site/engrid-common/dist/autocomplete.js
// This class adds the autocomplete attribute to
// the most common input elements

class Autocomplete {
    constructor() {
        this.debug = engrid_ENGrid.debug;
        this.autoCompleteField('[name="supporter.firstName"]', "given-name");
        this.autoCompleteField('[name="supporter.lastName"]', "family-name");
        this.autoCompleteField('[name="transaction.ccnumber"]', "cc-number");
        this.autoCompleteField("#en__field_transaction_ccexpire", "cc-exp-month");
        this.autoCompleteField('[name="transaction.ccexpire"]:not(#en__field_transaction_ccexpire)', "cc-exp-year");
        this.autoCompleteField('[name="transaction.ccvv"]', "cc-csc");
        this.autoCompleteField('[name="supporter.emailAddress"]', "email");
        this.autoCompleteField('[name="supporter.phoneNumber"]', "tel");
        this.autoCompleteField('[name="supporter.country"]', "country");
        this.autoCompleteField('[name="supporter.address1"]', "address-line1");
        this.autoCompleteField('[name="supporter.address2"]', "address-line2");
        this.autoCompleteField('[name="supporter.city"]', "address-level2");
        this.autoCompleteField('[name="supporter.region"]', "address-level1");
        this.autoCompleteField('[name="supporter.postcode"]', "postal-code");
    }
    autoCompleteField(querySelector, autoCompleteValue) {
        let field = document.querySelector(querySelector);
        if (field) {
            field.autocomplete = autoCompleteValue;
            return true;
        }
        if (this.debug)
            console.log("AutoComplete: Field Not Found", querySelector);
        return false;
    }
}

;// CONCATENATED MODULE: ./node_modules/@4site/engrid-common/dist/ecard.js

class Ecard {
    constructor() {
        this._form = EnForm.getInstance();
        if (engrid_ENGrid.getPageType() === "ECARD") {
            this._form.onValidate.subscribe(() => this.checkRecipientFields());
        }
    }
    checkRecipientFields() {
        const addRecipientButton = document.querySelector(".en__ecarditems__addrecipient");
        // If we find the "+" button and there's no hidden recipient field, click on the button
        if (addRecipientButton &&
            !document.querySelector(".ecardrecipient__email")) {
            addRecipientButton.click();
        }
        return true;
    }
}

;// CONCATENATED MODULE: ./node_modules/@4site/engrid-common/dist/click-to-expand.js
// Depends on engrid-click-to-expand.scss to work

// Works when the user has adds ".click-to-expand" as a class to any field
class ClickToExpand {
    constructor() {
        this.clickToExpandWrapper = document.querySelectorAll("div.click-to-expand");
        if (this.clickToExpandWrapper.length) {
            this.clickToExpandWrapper.forEach((element) => {
                const content = element.innerHTML;
                const wrapper_html = '<div class="click-to-expand-cta"></div><div class="click-to-expand-text-wrapper" tabindex="0">' +
                    content +
                    "</div>";
                element.innerHTML = wrapper_html;
                element.addEventListener("click", (event) => {
                    if (event) {
                        if (engrid_ENGrid.debug)
                            console.log("A click-to-expand div was clicked");
                        element.classList.add("expanded");
                    }
                });
                element.addEventListener("keydown", (event) => {
                    if (event.key === "Enter") {
                        if (engrid_ENGrid.debug)
                            console.log("A click-to-expand div had the 'Enter' key pressed on it");
                        element.classList.add("expanded");
                    }
                    else if (event.key === " ") {
                        if (engrid_ENGrid.debug)
                            console.log("A click-to-expand div had the 'Spacebar' key pressed on it");
                        element.classList.add("expanded");
                        event.preventDefault(); // Prevents the page from scrolling
                        event.stopPropagation(); // Prevent a console error generated by LastPass https://github.com/KillerCodeMonkey/ngx-quill/issues/351#issuecomment-476017960
                    }
                });
            });
        }
    }
}

;// CONCATENATED MODULE: ./node_modules/@4site/engrid-common/dist/custom-methods.js
const body = document.body;
const enGrid = document.getElementById("engrid");
const enInput = (() => {
    /************************************
     * Globablly Scoped Constants and Variables
     ***********************************/
    // @TODO Needs to be expanded to bind other EN elements (checkbox, radio) and compound elements (split-text, split-select, select with other input, etc...)
    // @TODO A "Not" condition is needed for #en__field_transaction_email because someone could name their email opt in "Email" and it will get the .en_field--email class generated for it
    // get DOM elements
    const init = () => {
        const formInput = document.querySelectorAll(".en__field--text, .en__field--email:not(.en__field--checkbox), .en__field--telephone, .en__field--number, .en__field--textarea, .en__field--select, .en__field--checkbox");
        Array.from(formInput).forEach((e) => {
            // @TODO Currently checkboxes always return as having a value, since they do but they're just not checked. Need to update and account for that, should also do Radio's while we're at it
            let element = e.querySelector("input, textarea, select");
            if (element && element.value) {
                e.classList.add("has-value");
            }
            bindEvents(e);
        });
    };
    return {
        init: init,
    };
})();
const bindEvents = (e) => {
    /* @TODO */
    /************************************
     * INPUT, TEXTAREA, AND SELECT ACTIVITY CLASSES (FOCUS AND BLUR)
     * NOTE: STILL NEEDS WORK TO FUNCTION ON "SPLIT" CUSTOM EN FIELDS
     * REF: https://developer.mozilla.org/en-US/docs/Web/API/Element/blur_event
     ***********************************/
    // Occurs when an input field gets focus
    const handleFocus = (e) => {
        const target = e.target;
        if (target && target.parentNode && target.parentNode.parentNode) {
            const targetWrapper = target.parentNode.parentNode;
            targetWrapper.classList.add("has-focus");
        }
    };
    // Occurs when a user leaves an input field
    const handleBlur = (e) => {
        const target = e.target;
        if (target && target.parentNode && target.parentNode.parentNode) {
            const targetWrapper = target.parentNode.parentNode;
            targetWrapper.classList.remove("has-focus");
            if (target.value) {
                targetWrapper.classList.add("has-value");
            }
            else {
                targetWrapper.classList.remove("has-value");
            }
        }
    };
    // Occurs when a user changes the selected option of a <select> element
    const handleChange = (e) => {
        const target = e.target;
        if (target && target.parentNode && target.parentNode.parentNode) {
            const targetWrapper = target.parentNode.parentNode;
            targetWrapper.classList.add("has-value");
        }
    };
    // Occurs when a text or textarea element gets user input
    const handleInput = (e) => {
        const target = e.target;
        if (target && target.parentNode && target.parentNode.parentNode) {
            const targetWrapper = target.parentNode.parentNode;
            targetWrapper.classList.add("has-value");
        }
    };
    // Occurs when the web browser autofills a form fields
    // REF: engrid-autofill.scss
    // REF: https://medium.com/@brunn/detecting-autofilled-fields-in-javascript-aed598d25da7
    const onAutoFillStart = (e) => {
        e.parentNode.parentNode.classList.add("is-autofilled", "has-value");
    };
    const onAutoFillCancel = (e) => e.parentNode.parentNode.classList.remove("is-autofilled", "has-value");
    const onAnimationStart = (e) => {
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
    if (window.location.href.indexOf("debug") != -1 ||
        location.hostname === "localhost" ||
        location.hostname === "127.0.0.1") {
        body.classList.add("debug");
        if (enGrid) {
            enGrid.insertAdjacentHTML("beforebegin", '<span id="debug-bar">' +
                '<span id="info-wrapper">' +
                "<span>DEBUG BAR</span>" +
                "</span>" +
                '<span id="buttons-wrapper">' +
                '<span id="debug-close">X</span>' +
                "</span>" +
                "</span>");
        }
        if (window.location.search.indexOf("mode=DEMO") > -1) {
            const infoWrapper = document.getElementById("info-wrapper");
            const buttonsWrapper = document.getElementById("buttons-wrapper");
            if (infoWrapper) {
                // console.log(window.performance);
                const now = new Date().getTime();
                const initialPageLoad = (now - performance.timing.navigationStart) / 1000;
                const domInteractive = initialPageLoad + (now - performance.timing.domInteractive) / 1000;
                infoWrapper.insertAdjacentHTML("beforeend", "<span>Initial Load: " +
                    initialPageLoad +
                    "s</span>" +
                    "<span>DOM Interactive: " +
                    domInteractive +
                    "s</span>");
                if (buttonsWrapper) {
                    buttonsWrapper.insertAdjacentHTML("afterbegin", '<button id="layout-toggle" type="button">Layout Toggle</button>' +
                        '<button id="page-edit" type="button">Edit in PageBuilder (BETA)</button>');
                }
            }
        }
        if (window.location.href.indexOf("debug") != -1 ||
            location.hostname === "localhost" ||
            location.hostname === "127.0.0.1") {
            const buttonsWrapper = document.getElementById("buttons-wrapper");
            if (buttonsWrapper) {
                buttonsWrapper.insertAdjacentHTML("afterbegin", '<button id="layout-toggle" type="button">Layout Toggle</button>' +
                    '<button id="fancy-errors-toggle" type="button">Toggle Fancy Errors</button>');
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
                    enGrid.classList.add("layout-centerright1col");
                }
                else if (enGrid.classList.contains("layout-centerright1col")) {
                    removeClassesByPrefix(enGrid, "layout-");
                    enGrid.classList.add("layout-centerleft1col");
                }
                else if (enGrid.classList.contains("layout-centerleft1col")) {
                    removeClassesByPrefix(enGrid, "layout-");
                    enGrid.classList.add("layout-embedded");
                }
                else if (enGrid.classList.contains("layout-embedded")) {
                    removeClassesByPrefix(enGrid, "layout-");
                    enGrid.classList.add("layout-centercenter1col");
                }
                else {
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
    let enFieldCity = document.querySelector("input#en__field_supporter_city");
    // let enFieldRegion = document.querySelector("input#en__field_supporter_region") as HTMLInputElement
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
    let enFieldBankRoutingNumber = document.querySelector("input#en__field_supporter_bankRoutingNumber");
    // CHANGE FIELD INPUT TYPES
    if (enFieldDonationAmt) {
        enFieldDonationAmt.setAttribute("inputmode", "numeric");
    }
    // ADD FIELD PLACEHOLDERS
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
    }
    // if (enAddInputPlaceholder && enFieldRegion){enFieldRegion.placeholder = "TBD";}
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
const preventAutocomplete = () => {
    let enFieldDonationAmt = document.querySelector(".en__field--donationAmt.en__field--withOther .en__field__input--other");
    if (enFieldDonationAmt) {
        enFieldDonationAmt.setAttribute("autocomplete", "off");
    }
    if (enFieldDonationAmt) {
        enFieldDonationAmt.setAttribute("data-lpignore", "true");
    }
};
const watchInmemField = () => {
    const enFieldTransactionInmem = document.getElementById("en__field_transaction_inmem");
    const handleEnFieldTransactionInmemChange = (e) => {
        if (enGrid) {
            if (enFieldTransactionInmem.checked) {
                enGrid.classList.add("has-give-in-honor");
            }
            else {
                enGrid.classList.remove("has-give-in-honor");
            }
        }
    };
    // Check Give In Honor State on Page Load
    if (enFieldTransactionInmem && enGrid) {
        // Run on page load
        if (enFieldTransactionInmem.checked) {
            enGrid.classList.add("has-give-in-honor");
        }
        else {
            enGrid.classList.remove("has-give-in-honor");
        }
        // Run on change
        enFieldTransactionInmem.addEventListener("change", handleEnFieldTransactionInmemChange);
    }
};
// @TODO Refactor (low priority)
const watchGiveBySelectField = () => {
    const enFieldGiveBySelect = document.querySelector(".en__field--give-by-select");
    const transactionGiveBySelect = document.getElementsByName("transaction.giveBySelect");
    const enFieldPaymentType = document.querySelector("#en__field_transaction_paymenttype");
    let enFieldGiveBySelectCurrentValue = document.querySelector('input[name="transaction.giveBySelect"]:checked');
    const prefix = "has-give-by-";
    const handleEnFieldGiveBySelect = (e) => {
        enFieldGiveBySelectCurrentValue = document.querySelector('input[name="transaction.giveBySelect"]:checked');
        console.log("enFieldGiveBySelectCurrentValue:", enFieldGiveBySelectCurrentValue);
        if (enFieldGiveBySelectCurrentValue &&
            enFieldGiveBySelectCurrentValue.value.toLowerCase() == "card") {
            if (enGrid) {
                removeClassesByPrefix(enGrid, prefix);
                enGrid.classList.add("has-give-by-card");
            }
            // enFieldPaymentType.value = "card";
            handleCCUpdate();
        }
        else if (enFieldGiveBySelectCurrentValue &&
            enFieldGiveBySelectCurrentValue.value.toLowerCase() == "ach") {
            if (enGrid) {
                removeClassesByPrefix(enGrid, prefix);
                enGrid.classList.add("has-give-by-ach");
            }
            enFieldPaymentType.value = "ACH";
        }
        else if (enFieldGiveBySelectCurrentValue &&
            enFieldGiveBySelectCurrentValue.value.toLowerCase() == "paypal") {
            if (enGrid) {
                removeClassesByPrefix(enGrid, prefix);
                enGrid.classList.add("has-give-by-paypal");
            }
            enFieldPaymentType.value = "paypal";
        }
        else if (enFieldGiveBySelectCurrentValue &&
            enFieldGiveBySelectCurrentValue.value.toLowerCase() == "applepay") {
            if (enGrid) {
                removeClassesByPrefix(enGrid, prefix);
                enGrid.classList.add("has-give-by-applepay");
            }
            enFieldPaymentType.value = "applepay";
        }
    };
    // Check Giving Frequency on page load
    if (enFieldGiveBySelect) {
        enFieldGiveBySelectCurrentValue = document.querySelector('input[name="transaction.giveBySelect"]:checked');
        if (enFieldGiveBySelectCurrentValue &&
            enFieldGiveBySelectCurrentValue.value.toLowerCase() == "card") {
            if (enGrid) {
                removeClassesByPrefix(enGrid, prefix);
                enGrid.classList.add("has-give-by-card");
            }
            // enFieldPaymentType.value = "card";
            handleCCUpdate();
        }
        else if (enFieldGiveBySelectCurrentValue &&
            enFieldGiveBySelectCurrentValue.value.toLowerCase() == "ach") {
            if (enGrid) {
                removeClassesByPrefix(enGrid, prefix);
                enGrid.classList.add("has-give-by-check");
            }
            enFieldPaymentType.value = "ACH";
        }
        else if (enFieldGiveBySelectCurrentValue &&
            enFieldGiveBySelectCurrentValue.value.toLowerCase() == "paypal") {
            if (enGrid) {
                removeClassesByPrefix(enGrid, prefix);
                enGrid.classList.add("has-give-by-paypal");
            }
            enFieldPaymentType.value = "paypal";
        }
        else if (enFieldGiveBySelectCurrentValue &&
            enFieldGiveBySelectCurrentValue.value.toLowerCase() == "applepay") {
            if (enGrid) {
                removeClassesByPrefix(enGrid, prefix);
                enGrid.classList.add("has-give-by-applepay");
            }
            enFieldPaymentType.value = "applepay";
        }
    }
    // Watch each Giving Frequency radio input for a change
    if (transactionGiveBySelect) {
        Array.from(transactionGiveBySelect).forEach((e) => {
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
var current_year = d.getFullYear() - 2000;
// getCardType used by handleCCUpdate()
const getCardType = (cc_partial) => {
    let key_character = cc_partial.charAt(0);
    const prefix = "live-card-type-";
    const field_credit_card_classes = field_credit_card.className
        .split(" ")
        .filter((c) => !c.startsWith(prefix));
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
        amex: ["amex", "american express", "americanexpress", "amx", "ax"],
        visa: ["visa", "vi"],
        mastercard: ["mastercard", "master card", "mc"],
        discover: ["discover", "di"],
    };
    const selected_card_value = card_type
        ? Array.from(field_payment_type.options).filter((d) => card_values[card_type].includes(d.value.toLowerCase()))[0].value
        : "";
    if (field_payment_type.value != selected_card_value) {
        field_payment_type.value = selected_card_value;
        const paymentTypeChangeEvent = new Event("change", { bubbles: true });
        field_payment_type.dispatchEvent(paymentTypeChangeEvent);
    }
};
const handleExpUpdate = (e) => {
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
                }
                else {
                    field_expiration_year.options[i].disabled = false;
                }
            }
        }
    }
    else if (e == "year") {
        let selected_year = parseInt(field_expiration_year.value);
        let disable = selected_year == current_year;
        console.log("year disable", disable, typeof disable, selected_year, current_year);
        for (let i = 0; i < field_expiration_month.options.length; i++) {
            // disable or enable all months less than current month
            if (parseInt(field_expiration_month.options[i].value) < current_month) {
                if (disable) {
                    //@TODO Couldn't get working in TypeScript
                    field_expiration_month.options[i].setAttribute("disabled", "disabled");
                }
                else {
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
}
// EN Polyfill to support "label" clicking on Advocacy Recipient "labels"
const contactDetailLabels = () => {
    const contact = document.querySelectorAll(".en__contactDetails__rows");
    // @TODO Needs refactoring. Has to be a better way to do this.
    const recipientChange = (e) => {
        let recipientRow = e.target;
        // console.log("recipientChange: recipientRow: ", recipientRow);
        let recipientRowWrapper = recipientRow.parentNode;
        // console.log("recipientChange: recipientRowWrapper: ", recipientRowWrapper);
        let recipientRowsWrapper = recipientRowWrapper.parentNode;
        // console.log("recipientChange: recipientRowsWrapper: ", recipientRowsWrapper);
        let contactDetails = recipientRowsWrapper.parentNode;
        // console.log("recipientChange: contactDetails: ", contactDetails);
        let contactDetailsCheckbox = contactDetails.querySelector("input");
        // console.log("recipientChange: contactDetailsCheckbox: ", contactDetailsCheckbox);
        if (contactDetailsCheckbox.checked) {
            contactDetailsCheckbox.checked = false;
        }
        else {
            contactDetailsCheckbox.checked = true;
        }
    };
    if (contact) {
        Array.from(contact).forEach((e) => {
            let element = e;
            element.addEventListener("click", recipientChange);
        });
    }
};
// @TODO Adds a URL path "/edit" that can be used to easily arrive at the editable version of the current page. Should automatically detect if the client is using us.e-activist or e-activist and adjust accoridngly. Should also pass in page number and work for all page types without each needing to be specified.
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
};
// If you go to and Engaging Networks Unsubscribe page anonymously
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
            Array.from(forceUncheck).forEach((e) => {
                let element = e;
                // console.log("Checking this formComponent for checkboxes", element);
                // In the forceUncheck form component, find any checboxes
                let uncheckCheckbox = element.querySelectorAll("input[type='checkbox']");
                if (uncheckCheckbox) {
                    // Step through each Checkbox in the forceUncheck form component
                    Array.from(uncheckCheckbox).forEach((f) => {
                        let checkbox = f;
                        // console.log("Unchecking this checkbox", checkbox);
                        // Uncheck the checbox
                        checkbox.checked = false;
                    });
                }
            });
        }
    }
};
// Watch the Region Field for changes. If there is only one option, hide it.
// @TODO Should this be expanded where if a select only has one option it's always hidden?
const country_select = document.getElementById("en__field_supporter_country");
const region_select = document.getElementById("en__field_supporter_region");
if (country_select) {
    country_select.addEventListener("change", () => {
        setTimeout(() => {
            if (region_select.options.length == 1 &&
                region_select.options[0].value == "other") {
                region_select.classList.add("hide");
            }
            else {
                region_select.classList.remove("hide");
            }
        }, 100);
    });
}
// @TODO "Footer in Viewport Check" should be made its own TS file
const contentFooter = document.querySelector(".content-footer");
const isInViewport = (e) => {
    const distance = e.getBoundingClientRect();
    // console.log("Footer: ", distance);
    return (distance.top >= 0 &&
        distance.left >= 0 &&
        distance.bottom <=
            (window.innerHeight || document.documentElement.clientHeight) &&
        distance.right <=
            (window.innerWidth || document.documentElement.clientWidth));
};
// Checks to see if the page is so short, the footer is above the fold. If the footer is above the folde we'll use this class to ensure at a minimum the page fills the full viewport height.
if (contentFooter && isInViewport(contentFooter)) {
    document
        .getElementsByTagName("BODY")[0]
        .setAttribute("data-engrid-footer-above-fold", "");
}
else {
    document
        .getElementsByTagName("BODY")[0]
        .setAttribute("data-engrid-footer-below-fold", "");
}

;// CONCATENATED MODULE: ./node_modules/@4site/engrid-common/dist/iframe.js

const sendIframeHeight = () => {
    let height = document.body.offsetHeight;
    console.log("Sending iFrame height of: ", height, "px"); // check the message is being sent correctly
    window.parent.postMessage({
        frameHeight: height,
        pageNumber: engrid_ENGrid.getPageNumber(),
        pageCount: engrid_ENGrid.getPageCount(),
        giftProcess: engrid_ENGrid.getGiftProcess(),
    }, "*");
};
const sendIframeFormStatus = (status) => {
    window.parent.postMessage({
        status: status,
        pageNumber: engrid_ENGrid.getPageNumber(),
        pageCount: engrid_ENGrid.getPageCount(),
        giftProcess: engrid_ENGrid.getGiftProcess(),
    }, "*");
};

;// CONCATENATED MODULE: ./node_modules/@4site/engrid-common/dist/media-attribution.js
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
        this.mediaWithAttribution.forEach((element) => {
            if (engrid_ENGrid.debug)
                console.log("The following image was found with data attribution fields on it. It's markup will be changed to add caption support.", element);
            // Creates the wapping <figure> element
            let figure = document.createElement("figure");
            figure.classList.add("media-with-attribution");
            // Moves the <img> inside its <figure> element
            let mediaWithAttributionParent = element.parentNode;
            if (mediaWithAttributionParent) {
                mediaWithAttributionParent.insertBefore(figure, element);
                figure.appendChild(element);
                let mediaWithAttributionElement = element;
                // Append the <figcaption> element after the <img> and conditionally add the Source's Link to it
                let attributionSource = mediaWithAttributionElement.dataset.attributionSource;
                if (attributionSource) {
                    let attributionSourceLink = mediaWithAttributionElement.dataset.attributionSourceLink;
                    if (attributionSourceLink) {
                        mediaWithAttributionElement.insertAdjacentHTML("afterend", '<figattribution><a href="' +
                            decodeURIComponent(attributionSourceLink) +
                            '" target="_blank" tabindex="-1">' +
                            attributionSource +
                            "</a></figure>");
                    }
                    else {
                        mediaWithAttributionElement.insertAdjacentHTML("afterend", "<figattribution>" + attributionSource + "</figure>");
                    }
                }
            }
        });
    }
}

;// CONCATENATED MODULE: ./node_modules/@4site/engrid-common/dist/live-variables.js


class LiveVariables {
    constructor(options) {
        var _a;
        this._amount = DonationAmount.getInstance();
        this._fees = ProcessingFees.getInstance();
        this._frequency = DonationFrequency.getInstance();
        this._form = EnForm.getInstance();
        this.multiplier = 1 / 12;
        this.options = Object.assign(Object.assign({}, OptionsDefaults), options);
        this.submitLabel =
            ((_a = document.querySelector(".en__submit button")) === null || _a === void 0 ? void 0 : _a.innerHTML) || "Donate";
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
        this._form.onError.subscribe(() => this.changeSubmitButton());
        // Watch the monthly-upsell links
        document.addEventListener("click", (e) => {
            const element = e.target;
            if (element) {
                if (element.classList.contains("monthly-upsell")) {
                    this.upsold(e);
                }
                else if (element.classList.contains("form-submit")) {
                    e.preventDefault();
                    this._form.submitForm();
                }
            }
        });
    }
    getAmountTxt(amount = 0) {
        var _a, _b, _c, _d;
        const symbol = (_a = this.options.CurrencySymbol) !== null && _a !== void 0 ? _a : "$";
        const dec_separator = (_b = this.options.DecimalSeparator) !== null && _b !== void 0 ? _b : ".";
        const thousands_separator = (_c = this.options.ThousandsSeparator) !== null && _c !== void 0 ? _c : "";
        const dec_places = amount % 1 == 0 ? 0 : (_d = this.options.DecimalPlaces) !== null && _d !== void 0 ? _d : 2;
        const amountTxt = engrid_ENGrid.formatNumber(amount, dec_places, dec_separator, thousands_separator);
        return amount > 0 ? symbol + amountTxt : "";
    }
    getUpsellAmountTxt(amount = 0) {
        var _a, _b, _c, _d;
        const symbol = (_a = this.options.CurrencySymbol) !== null && _a !== void 0 ? _a : "$";
        const dec_separator = (_b = this.options.DecimalSeparator) !== null && _b !== void 0 ? _b : ".";
        const thousands_separator = (_c = this.options.ThousandsSeparator) !== null && _c !== void 0 ? _c : "";
        const dec_places = amount % 1 == 0 ? 0 : (_d = this.options.DecimalPlaces) !== null && _d !== void 0 ? _d : 2;
        const amountTxt = engrid_ENGrid.formatNumber(Math.ceil(amount / 5) * 5, dec_places, dec_separator, thousands_separator);
        return amount > 0 ? symbol + amountTxt : "";
    }
    getUpsellAmountRaw(amount = 0) {
        const amountRaw = Math.ceil(amount / 5) * 5;
        return amount > 0 ? amountRaw.toString() : "";
    }
    changeSubmitButton() {
        const submit = document.querySelector(".en__submit button");
        const amount = this.getAmountTxt(this._amount.amount + this._fees.fee);
        const frequency = this._frequency.frequency == "onetime"
            ? ""
            : this._frequency.frequency == "annual"
                ? "annually"
                : this._frequency.frequency;
        let label = this.submitLabel;
        if (amount) {
            label = label.replace("$AMOUNT", amount);
            label = label.replace("$FREQUENCY", frequency);
        }
        else {
            label = label.replace("$AMOUNT", "");
            label = label.replace("$FREQUENCY", "");
        }
        if (submit && label) {
            submit.innerHTML = label;
        }
    }
    loadingSubmitButton() {
        const submit = document.querySelector(".en__submit button");
        // Don't add the Loading element if the button is from an Ajax form (like the supporter hub)
        if (submit.hasAttribute("data-action")) {
            return true;
        }
        let submitButtonOriginalHTML = submit.innerHTML;
        let submitButtonProcessingHTML = "<span class='loader-wrapper'><span class='loader loader-quart'></span><span class='submit-button-text-wrapper'>" +
            submitButtonOriginalHTML +
            "</span></span>";
        submitButtonOriginalHTML = submit.innerHTML;
        submit.innerHTML = submitButtonProcessingHTML;
        return true;
    }
    changeLiveAmount() {
        const value = this._amount.amount + this._fees.fee;
        const live_amount = document.querySelectorAll(".live-giving-amount");
        live_amount.forEach((elem) => (elem.innerHTML = this.getAmountTxt(value)));
    }
    changeLiveUpsellAmount() {
        const value = (this._amount.amount + this._fees.fee) * this.multiplier;
        const live_upsell_amount = document.querySelectorAll(".live-giving-upsell-amount");
        live_upsell_amount.forEach((elem) => (elem.innerHTML = this.getUpsellAmountTxt(value)));
        const live_upsell_amount_raw = document.querySelectorAll(".live-giving-upsell-amount-raw");
        live_upsell_amount_raw.forEach((elem) => (elem.innerHTML = this.getUpsellAmountRaw(value)));
    }
    changeLiveFrequency() {
        const live_frequency = document.querySelectorAll(".live-giving-frequency");
        live_frequency.forEach((elem) => (elem.innerHTML =
            this._frequency.frequency == "onetime"
                ? ""
                : this._frequency.frequency));
    }
    changeRecurrency() {
        const recurrpay = document.querySelector("[name='transaction.recurrpay']");
        if (recurrpay && recurrpay.type != "radio") {
            recurrpay.value = this._frequency.frequency == "onetime" ? "N" : "Y";
            this._frequency.recurring = recurrpay.value;
            if (engrid_ENGrid.getOption("Debug"))
                console.log("Recurpay Changed!");
            // Trigger the onChange event for the field
            const event = new Event("change", { bubbles: true });
            recurrpay.dispatchEvent(event);
        }
    }
    swapAmounts() {
        if ("EngridAmounts" in window &&
            this._frequency.frequency in window.EngridAmounts) {
            const loadEnAmounts = (amountArray) => {
                let ret = [];
                for (let amount in amountArray.amounts) {
                    ret.push({
                        selected: amountArray.amounts[amount] === amountArray.default,
                        label: amount,
                        value: amountArray.amounts[amount].toString(),
                    });
                }
                return ret;
            };
            window.EngagingNetworks.require._defined.enjs.swapList("donationAmt", loadEnAmounts(window.EngridAmounts[this._frequency.frequency]), {
                ignoreCurrentValue: !window.EngagingNetworks.require._defined.enjs.checkSubmissionFailed(),
            });
            this._amount.load();
            if (engrid_ENGrid.getOption("Debug"))
                console.log("Amounts Swapped To", window.EngridAmounts[this._frequency.frequency]);
        }
    }
    // Watch for a clicks on monthly-upsell link
    upsold(e) {
        // Find and select monthly giving
        const enFieldRecurrpay = document.querySelector(".en__field--recurrpay input[value='Y']");
        if (enFieldRecurrpay) {
            enFieldRecurrpay.checked = true;
        }
        // Find the hidden radio select that needs to be selected when entering an "Other" amount
        const enFieldOtherAmountRadio = document.querySelector(".en__field--donationAmt input[value='other']");
        if (enFieldOtherAmountRadio) {
            enFieldOtherAmountRadio.checked = true;
        }
        // Enter the other amount and remove the "en__field__item--hidden" class from the input's parent
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
            e.preventDefault();
            // Form submit
            this._form.submitForm();
        }
    }
}

;// CONCATENATED MODULE: ./node_modules/@4site/engrid-common/dist/upsell-lightbox.js


class UpsellLightbox {
    constructor() {
        this.overlay = document.createElement("div");
        this._form = EnForm.getInstance();
        this._amount = DonationAmount.getInstance();
        this._fees = ProcessingFees.getInstance();
        this._frequency = DonationFrequency.getInstance();
        let options = "EngridUpsell" in window ? window.EngridUpsell : {};
        this.options = Object.assign(Object.assign({}, UpsellOptionsDefaults), options);
        if (!this.shouldRun()) {
            if (engrid_ENGrid.debug)
                console.log("Upsell script should NOT run");
            // If we're not on a Donation Page, get out
            return;
        }
        this.overlay.id = "enModal";
        this.overlay.classList.add("is-hidden");
        this.overlay.classList.add("image-" + this.options.imagePosition);
        this.renderLightbox();
        this._form.onSubmit.subscribe(() => this.open());
    }
    renderLightbox() {
        const title = this.options.title
            .replace("{new-amount}", "<span class='upsell_suggestion'></span>")
            .replace("{old-amount}", "<span class='upsell_amount'></span>");
        const paragraph = this.options.paragraph
            .replace("{new-amount}", "<span class='upsell_suggestion'></span>")
            .replace("{old-amount}", "<span class='upsell_amount'></span>");
        const yes = this.options.yesLabel
            .replace("{new-amount}", "<span class='upsell_suggestion'></span>")
            .replace("{old-amount}", "<span class='upsell_amount'></span>");
        const no = this.options.noLabel
            .replace("{new-amount}", "<span class='upsell_suggestion'></span>")
            .replace("{old-amount}", "<span class='upsell_amount'></span>");
        const markup = `
            <div class="upsellLightboxContainer" id="goMonthly">
              <!-- ideal image size is 480x650 pixels -->
              <div class="background" style="background-image: url('${this.options.image}');"></div>
              <div class="upsellLightboxContent">
              ${this.options.canClose ? `<span id="goMonthlyClose"></span>` : ``}
                <h1>
                  ${title}
                </h1>
                ${this.options.otherAmount
            ? `
                <div class="upsellOtherAmount">
                  <div class="upsellOtherAmountLabel">
                    <p>
                      ${this.options.otherLabel}
                    </p>
                  </div>
                  <div class="upsellOtherAmountInput">
                    <input href="#" id="secondOtherField" name="secondOtherField" size="12" type="number" inputmode="numeric" step="1" value="" autocomplete="off">
                    <small>Minimum ${this.getAmountTxt(this.options.minAmount)}</small>
                  </div>
                </div>
                `
            : ``}

                <p>
                  ${paragraph}
                </p>
                <!-- YES BUTTON -->
                <div id="upsellYesButton">
                  <a class="pseduo__en__submit_button" href="#">
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
        if (closeButton)
            closeButton.addEventListener("click", this.close.bind(this));
        this.overlay.addEventListener("click", (e) => {
            if (e.target instanceof Element &&
                e.target.id == this.overlay.id &&
                this.options.canClose) {
                this.close(e);
            }
        });
        document.addEventListener("keyup", (e) => {
            if (e.key === "Escape" && closeButton) {
                closeButton.click();
            }
        });
        document.body.appendChild(this.overlay);
        const otherField = document.querySelector("#secondOtherField");
        if (otherField) {
            otherField.addEventListener("keyup", this.popupOtherField.bind(this));
        }
        if (engrid_ENGrid.debug)
            console.log("Upsell script rendered");
    }
    // Should we run the script?
    shouldRun() {
        // const hideModal = cookie.get("hideUpsell"); // Get cookie
        // if it's a first page of a Donation page
        return (
        // !hideModal &&
        "EngridUpsell" in window &&
            !!window.pageJson &&
            window.pageJson.pageNumber == 1 &&
            ["donation", "premiumgift"].includes(window.pageJson.pageType));
    }
    popupOtherField() {
        var _a, _b;
        const value = parseFloat((_b = (_a = this.overlay.querySelector("#secondOtherField")) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : "");
        const live_upsell_amount = document.querySelectorAll("#upsellYesButton .upsell_suggestion");
        const upsellAmount = this.getUpsellAmount();
        if (!isNaN(value) && value > 0) {
            this.checkOtherAmount(value);
        }
        else {
            this.checkOtherAmount(upsellAmount);
        }
        live_upsell_amount.forEach((elem) => (elem.innerHTML = this.getAmountTxt(upsellAmount + this._fees.calculateFees(upsellAmount))));
    }
    liveAmounts() {
        const live_upsell_amount = document.querySelectorAll(".upsell_suggestion");
        const live_amount = document.querySelectorAll(".upsell_amount");
        const upsellAmount = this.getUpsellAmount();
        const suggestedAmount = upsellAmount + this._fees.calculateFees(upsellAmount);
        live_upsell_amount.forEach((elem) => (elem.innerHTML = this.getAmountTxt(suggestedAmount)));
        live_amount.forEach((elem) => (elem.innerHTML = this.getAmountTxt(this._amount.amount + this._fees.fee)));
    }
    // Return the Suggested Upsell Amount
    getUpsellAmount() {
        var _a, _b;
        const amount = this._amount.amount;
        const otherAmount = parseFloat((_b = (_a = this.overlay.querySelector("#secondOtherField")) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : "");
        if (otherAmount > 0) {
            return otherAmount > this.options.minAmount
                ? otherAmount
                : this.options.minAmount;
        }
        let upsellAmount = 0;
        for (let i = 0; i < this.options.amountRange.length; i++) {
            let val = this.options.amountRange[i];
            if (upsellAmount == 0 && amount <= val.max) {
                upsellAmount = val.suggestion;
                if (typeof upsellAmount !== "number") {
                    const suggestionMath = upsellAmount.replace("amount", amount.toFixed(2));
                    upsellAmount = parseFloat(Function('"use strict";return (' + suggestionMath + ")")());
                }
                break;
            }
        }
        return upsellAmount > this.options.minAmount
            ? upsellAmount
            : this.options.minAmount;
    }
    shouldOpen() {
        const freq = this._frequency.frequency;
        const upsellAmount = this.getUpsellAmount();
        // If frequency is not onetime or
        // the modal is already opened or
        // there's no suggestion for this donation amount,
        // we should not open
        if (freq == "onetime" &&
            !this.overlay.classList.contains("is-submitting") &&
            upsellAmount > 0) {
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
        if (engrid_ENGrid.debug)
            console.log("Upsell Script Triggered");
        if (!this.shouldOpen()) {
            // In the circumstance when the form fails to validate via server-side validation, the page will reload
            // When that happens, we should place the original amount saved in sessionStorage into the upsell original amount field
            let original = window.sessionStorage.getItem("original");
            if (original &&
                document.querySelectorAll(".en__errorList .en__error").length > 0) {
                this.setOriginalAmount(original);
            }
            // Returning true will give the "go ahead" to submit the form
            this._form.submit = true;
            return true;
        }
        this.liveAmounts();
        this.overlay.classList.remove("is-hidden");
        this._form.submit = false;
        engrid_ENGrid.setBodyData("has-lightbox", "");
        return false;
    }
    // Set the original amount into a hidden field using the upsellOriginalGiftAmountFieldName, if provided
    setOriginalAmount(original) {
        if (this.options.upsellOriginalGiftAmountFieldName) {
            let enFieldUpsellOriginalAmount = document.querySelector(".en__field__input.en__field__input--hidden[name='" +
                this.options.upsellOriginalGiftAmountFieldName +
                "']");
            if (!enFieldUpsellOriginalAmount) {
                let pageform = document.querySelector("form.en__component--page");
                if (pageform) {
                    let input = document.createElement("input");
                    input.setAttribute("type", "hidden");
                    input.setAttribute("name", this.options.upsellOriginalGiftAmountFieldName);
                    input.classList.add("en__field__input", "en__field__input--hidden");
                    pageform.appendChild(input);
                    enFieldUpsellOriginalAmount = document.querySelector('.en__field__input.en__field__input--hidden[name="' +
                        this.options.upsellOriginalGiftAmountFieldName +
                        '"]');
                }
            }
            if (enFieldUpsellOriginalAmount) {
                // save it to a session variable just in case this page reloaded due to server-side validation error
                window.sessionStorage.setItem("original", original);
                enFieldUpsellOriginalAmount.setAttribute("value", original);
            }
        }
    }
    // Proceed to the next page (upsold or not)
    continue(e) {
        var _a;
        e.preventDefault();
        if (e.target instanceof Element &&
            ((_a = document.querySelector("#upsellYesButton")) === null || _a === void 0 ? void 0 : _a.contains(e.target))) {
            if (engrid_ENGrid.debug)
                console.log("Upsold");
            this.setOriginalAmount(this._amount.amount.toString());
            const upsoldAmount = this.getUpsellAmount();
            this._frequency.setFrequency("monthly");
            this._amount.setAmount(upsoldAmount);
        }
        else {
            this.setOriginalAmount("");
            window.sessionStorage.removeItem("original");
        }
        this._form.submitForm();
    }
    // Close the lightbox (no cookies)
    close(e) {
        e.preventDefault();
        // cookie.set("hideUpsell", "1", { expires: 1 }); // Create one day cookie
        this.overlay.classList.add("is-hidden");
        engrid_ENGrid.setBodyData("has-lightbox", false);
        if (this.options.submitOnClose) {
            this._form.submitForm();
        }
        else {
            this._form.dispatchError();
        }
    }
    getAmountTxt(amount = 0) {
        var _a, _b, _c, _d;
        const symbol = (_a = engrid_ENGrid.getOption("CurrencySymbol")) !== null && _a !== void 0 ? _a : "$";
        const dec_separator = (_b = engrid_ENGrid.getOption("DecimalSeparator")) !== null && _b !== void 0 ? _b : ".";
        const thousands_separator = (_c = engrid_ENGrid.getOption("ThousandsSeparator")) !== null && _c !== void 0 ? _c : "";
        const dec_places = amount % 1 == 0 ? 0 : (_d = engrid_ENGrid.getOption("DecimalPlaces")) !== null && _d !== void 0 ? _d : 2;
        const amountTxt = engrid_ENGrid.formatNumber(amount, dec_places, dec_separator, thousands_separator);
        return amount > 0 ? symbol + amountTxt : "";
    }
    checkOtherAmount(value) {
        const otherInput = document.querySelector(".upsellOtherAmountInput");
        if (otherInput) {
            if (value >= this.options.minAmount) {
                otherInput.classList.remove("is-invalid");
            }
            else {
                otherInput.classList.add("is-invalid");
            }
        }
    }
}

;// CONCATENATED MODULE: ./node_modules/@4site/engrid-common/dist/show-hide-radio-checkboxes.js
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
            element.addEventListener("change", (e) => {
                this.hideAll();
                this.show(element);
            });
        }
    }
    // Hide All Divs
    hideAll() {
        this.elements.forEach((item, index) => {
            if (item instanceof HTMLInputElement)
                this.hide(item);
        });
    }
    // Hide Single Element Div
    hide(item) {
        let inputValue = item.value;
        document.querySelectorAll("." + this.classes + inputValue).forEach((el) => {
            // Consider toggling "hide" class so these fields can be displayed when in a debug state
            if (el instanceof HTMLElement)
                el.style.display = "none";
        });
    }
    // Show Single Element Div
    show(item) {
        let inputValue = item.value;
        document.querySelectorAll("." + this.classes + inputValue).forEach((el) => {
            // Consider toggling "hide" class so these fields can be displayed when in a debug state
            if (el instanceof HTMLElement)
                el.style.display = "";
        });
        if (item.type == "checkbox" && !item.checked) {
            this.hide(item);
        }
    }
}

;// CONCATENATED MODULE: ./node_modules/@4site/engrid-common/dist/cookie.js
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
    return (stringifyAttribute("Expires", attributes.expires ? attributes.expires.toUTCString() : "") +
        stringifyAttribute("Domain", attributes.domain) +
        stringifyAttribute("Path", attributes.path) +
        stringifyAttribute("Secure", attributes.secure) +
        stringifyAttribute("SameSite", attributes.sameSite));
}
function encode(name, value, attributes) {
    return (encodeURIComponent(name)
        .replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent) // allowed special characters
        .replace(/\(/g, "%28")
        .replace(/\)/g, "%29") + // replace opening and closing parens
        "=" +
        encodeURIComponent(value)
            // allowed special characters
            .replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent) +
        stringifyAttributes(attributes));
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
        }
        catch (e) {
            // ignore cookies with invalid name/value encoding
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
    document.cookie = encode(name, value, Object.assign({ path: "/" }, attributes));
}
function remove(name, attributes) {
    set(name, "", Object.assign(Object.assign({}, attributes), { expires: -1 }));
}

;// CONCATENATED MODULE: ./node_modules/@4site/engrid-common/dist/translate-fields.js


// This class works when the user has added ".simple_country_select" as a class in page builder for the Country select
class TranslateFields {
    constructor() {
        this.countrySelect = document.querySelector("#en__field_supporter_country");
        this.stateField = document.querySelector("#en__field_supporter_region");
        let options = "EngridTranslate" in window ? window.EngridTranslate : {};
        this.options = TranslateOptionsDefaults;
        if (options) {
            for (let key in options) {
                this.options[key] = [...this.options[key], ...options[key]];
            }
        }
        if (this.countrySelect) {
            this.countrySelect.addEventListener("change", this.translateFields.bind(this));
            this.translateFields();
        }
        if (this.stateField) {
            this.stateField.addEventListener("change", this.rememberState.bind(this));
        }
    }
    translateFields() {
        this.resetTranslatedFields();
        if (this.countrySelect.value in this.options) {
            this.options[this.countrySelect.value].forEach((field) => {
                // console.log(field);
                this.translateField(field.field, field.translation);
            });
        }
        // Translate the "To:"
        const recipient_block = document.querySelectorAll(".recipient-block");
        if (!!recipient_block.length) {
            switch (this.countrySelect.value) {
                case "FR":
                case "FRA":
                case "France":
                    recipient_block.forEach((elem) => (elem.innerHTML = "À:"));
                    break;
                case "DE":
                case "DEU":
                case "Germany":
                    recipient_block.forEach((elem) => (elem.innerHTML = "Zu:"));
                    break;
                case "NL":
                case "NLD":
                case "Netherlands":
                    recipient_block.forEach((elem) => (elem.innerHTML = "Aan:"));
                    break;
            }
        }
        // Translate the State Field
        this.setStateField(this.countrySelect.value);
    }
    translateField(name, translation) {
        const field = document.querySelector(`[name="${name}"]`);
        if (field) {
            const fieldWrapper = field.closest(".en__field");
            if (fieldWrapper) {
                const fieldLabel = fieldWrapper.querySelector(".en__field__label");
                // Check if there's the simple country select class
                const simpleCountrySelect = fieldLabel.querySelector(".engrid-simple-country");
                let simpleCountrySelectClone = simpleCountrySelect
                    ? simpleCountrySelect.cloneNode(true)
                    : null;
                if (field instanceof HTMLInputElement && field.placeholder != "") {
                    if (!fieldLabel || fieldLabel.innerHTML == field.placeholder) {
                        field.dataset.original = field.placeholder;
                        field.placeholder = translation;
                    }
                }
                if (fieldLabel) {
                    fieldLabel.dataset.original = fieldLabel.innerHTML;
                    fieldLabel.innerHTML = translation;
                    if (simpleCountrySelectClone) {
                        fieldLabel.appendChild(simpleCountrySelectClone);
                    }
                }
            }
        }
    }
    resetTranslatedFields() {
        const fields = document.querySelectorAll("[data-original]");
        fields.forEach((field) => {
            if (field instanceof HTMLInputElement && field.dataset.original) {
                field.placeholder = field.dataset.original;
            }
            else {
                // Check if there's the simple country select class
                const simpleCountrySelect = field.querySelector(".engrid-simple-country");
                let simpleCountrySelectClone = simpleCountrySelect
                    ? simpleCountrySelect.cloneNode(true)
                    : null;
                field.innerHTML = field.dataset.original;
                if (simpleCountrySelectClone) {
                    field.appendChild(simpleCountrySelectClone);
                }
            }
            field.removeAttribute("data-original");
        });
    }
    setStateField(country) {
        switch (country) {
            case "BR":
            case "BRA":
            case "Brazil":
                this.setStateValues("Estado", null);
                break;
            case "FR":
            case "FRA":
            case "France":
                this.setStateValues("Région", null);
                break;
            case "GB":
            case "GBR":
            case "United Kingdom":
                this.setStateValues("State/Region", null);
                break;
            case "DE":
            case "DEU":
            case "Germany":
                this.setStateValues("Bundesland", null);
                break;
            case "NL":
            case "NLD":
            case "Netherlands":
                this.setStateValues("Provincie", null);
                break;
            case "AU":
            case "AUS":
                this.setStateValues("Province/State", [
                    { label: "Select Province/State", value: "" },
                    { label: "New South Wales", value: "NSW" },
                    { label: "Victoria", value: "VIC" },
                    { label: "Queensland", value: "QLD" },
                    { label: "South Australia", value: "SA" },
                    { label: "Western Australia", value: "WA" },
                    { label: "Tasmania", value: "TAS" },
                    { label: "Northern Territory", value: "NT" },
                    { label: "Australian Capital Territory", value: "ACT" },
                ]);
                break;
            case "Australia":
                this.setStateValues("Province/State", [
                    { label: "Select Province/State", value: "" },
                    { label: "New South Wales", value: "New South Wales" },
                    { label: "Victoria", value: "Victoria" },
                    { label: "Queensland", value: "Queensland" },
                    { label: "South Australia", value: "South Australia" },
                    { label: "Western Australia", value: "Western Australia" },
                    { label: "Tasmania", value: "Tasmania" },
                    { label: "Northern Territory", value: "Northern Territory" },
                    {
                        label: "Australian Capital Territory",
                        value: "Australian Capital Territory",
                    },
                ]);
                break;
            case "US":
            case "USA":
                this.setStateValues("State", [
                    { label: "Select State", value: "" },
                    { label: "Alabama", value: "AL" },
                    { label: "Alaska", value: "AK" },
                    { label: "Arizona", value: "AZ" },
                    { label: "Arkansas", value: "AR" },
                    { label: "California", value: "CA" },
                    { label: "Colorado", value: "CO" },
                    { label: "Connecticut", value: "CT" },
                    { label: "Delaware", value: "DE" },
                    { label: "District of Columbia", value: "DC" },
                    { label: "Florida", value: "FL" },
                    { label: "Georgia", value: "GA" },
                    { label: "Hawaii", value: "HI" },
                    { label: "Idaho", value: "ID" },
                    { label: "Illinois", value: "IL" },
                    { label: "Indiana", value: "IN" },
                    { label: "Iowa", value: "IA" },
                    { label: "Kansas", value: "KS" },
                    { label: "Kentucky", value: "KY" },
                    { label: "Louisiana", value: "LA" },
                    { label: "Maine", value: "ME" },
                    { label: "Maryland", value: "MD" },
                    { label: "Massachusetts", value: "MA" },
                    { label: "Michigan", value: "MI" },
                    { label: "Minnesota", value: "MN" },
                    { label: "Mississippi", value: "MS" },
                    { label: "Missouri", value: "MO" },
                    { label: "Montana", value: "MT" },
                    { label: "Nebraska", value: "NE" },
                    { label: "Nevada", value: "NV" },
                    { label: "New Hampshire", value: "NH" },
                    { label: "New Jersey", value: "NJ" },
                    { label: "New Mexico", value: "NM" },
                    { label: "New York", value: "NY" },
                    { label: "North Carolina", value: "NC" },
                    { label: "North Dakota", value: "ND" },
                    { label: "Ohio", value: "OH" },
                    { label: "Oklahoma", value: "OK" },
                    { label: "Oregon", value: "OR" },
                    { label: "Pennsylvania", value: "PA" },
                    { label: "Rhode Island", value: "RI" },
                    { label: "South Carolina", value: "SC" },
                    { label: "South Dakota", value: "SD" },
                    { label: "Tennessee", value: "TN" },
                    { label: "Texas", value: "TX" },
                    { label: "Utah", value: "UT" },
                    { label: "Vermont", value: "VT" },
                    { label: "Virginia", value: "VA" },
                    { label: "Washington", value: "WA" },
                    { label: "West Virginia", value: "WV" },
                    { label: "Wisconsin", value: "WI" },
                    { label: "Wyoming", value: "WY" },
                ]);
                break;
            case "United States":
                this.setStateValues("State", [
                    { label: "Select State", value: "" },
                    { label: "Alabama", value: "Alabama" },
                    { label: "Alaska", value: "Alaska" },
                    { label: "Arizona", value: "Arizona" },
                    { label: "Arkansas", value: "Arkansas" },
                    { label: "California", value: "California" },
                    { label: "Colorado", value: "Colorado" },
                    { label: "Connecticut", value: "Connecticut" },
                    { label: "Delaware", value: "Delaware" },
                    { label: "District of Columbia", value: "District of Columbia" },
                    { label: "Florida", value: "Florida" },
                    { label: "Georgia", value: "Georgia" },
                    { label: "Hawaii", value: "Hawaii" },
                    { label: "Idaho", value: "Idaho" },
                    { label: "Illinois", value: "Illinois" },
                    { label: "Indiana", value: "Indiana" },
                    { label: "Iowa", value: "Iowa" },
                    { label: "Kansas", value: "Kansas" },
                    { label: "Kentucky", value: "Kentucky" },
                    { label: "Louisiana", value: "Louisiana" },
                    { label: "Maine", value: "Maine" },
                    { label: "Maryland", value: "Maryland" },
                    { label: "Massachusetts", value: "Massachusetts" },
                    { label: "Michigan", value: "Michigan" },
                    { label: "Minnesota", value: "Minnesota" },
                    { label: "Mississippi", value: "Mississippi" },
                    { label: "Missouri", value: "Missouri" },
                    { label: "Montana", value: "Montana" },
                    { label: "Nebraska", value: "Nebraska" },
                    { label: "Nevada", value: "Nevada" },
                    { label: "New Hampshire", value: "New Hampshire" },
                    { label: "New Jersey", value: "New Jersey" },
                    { label: "New Mexico", value: "New Mexico" },
                    { label: "New York", value: "New York" },
                    { label: "North Carolina", value: "North Carolina" },
                    { label: "North Dakota", value: "North Dakota" },
                    { label: "Ohio", value: "Ohio" },
                    { label: "Oklahoma", value: "Oklahoma" },
                    { label: "Oregon", value: "Oregon" },
                    { label: "Pennsylvania", value: "Pennsylvania" },
                    { label: "Rhode Island", value: "Rhode Island" },
                    { label: "South Carolina", value: "South Carolina" },
                    { label: "South Dakota", value: "South Dakota" },
                    { label: "Tennessee", value: "Tennessee" },
                    { label: "Texas", value: "Texas" },
                    { label: "Utah", value: "Utah" },
                    { label: "Vermont", value: "Vermont" },
                    { label: "Virginia", value: "Virginia" },
                    { label: "Washington", value: "Washington" },
                    { label: "West Virginia", value: "West Virginia" },
                    { label: "Wisconsin", value: "Wisconsin" },
                    { label: "Wyoming", value: "Wyoming" },
                ]);
                break;
            case "CA":
            case "CAN":
                this.setStateValues("Province/State", [
                    { label: "Select Province/State", value: "" },
                    { label: "Alberta", value: "AB" },
                    { label: "British Columbia", value: "BC" },
                    { label: "Manitoba", value: "MB" },
                    { label: "New Brunswick", value: "NB" },
                    { label: "Newfoundland and Labrador", value: "NL" },
                    { label: "Northwest Territories", value: "NT" },
                    { label: "Nova Scotia", value: "NS" },
                    { label: "Nunavut", value: "NU" },
                    { label: "Ontario", value: "ON" },
                    { label: "Prince Edward Island", value: "PE" },
                    { label: "Quebec", value: "QC" },
                    { label: "Saskatchewan", value: "SK" },
                    { label: "Yukon", value: "YT" },
                ]);
                break;
            case "Canada":
                this.setStateValues("Province/State", [
                    { label: "Select Province/State", value: "" },
                    { label: "Alberta", value: "Alberta" },
                    { label: "British Columbia", value: "British Columbia" },
                    { label: "Manitoba", value: "Manitoba" },
                    { label: "New Brunswick", value: "New Brunswick" },
                    {
                        label: "Newfoundland and Labrador",
                        value: "Newfoundland and Labrador",
                    },
                    { label: "Northwest Territories", value: "Northwest Territories" },
                    { label: "Nova Scotia", value: "Nova Scotia" },
                    { label: "Nunavut", value: "Nunavut" },
                    { label: "Ontario", value: "Ontario" },
                    { label: "Prince Edward Island", value: "Prince Edward Island" },
                    { label: "Quebec", value: "Quebec" },
                    { label: "Saskatchewan", value: "Saskatchewan" },
                    { label: "Yukon", value: "Yukon" },
                ]);
                break;
            case "MX":
            case "MEX":
                this.setStateValues("Province", [
                    { label: "Select Province", value: "" },
                    { label: "Aguascalientes", value: "AGU" },
                    { label: "Baja California", value: "BCN" },
                    { label: "Baja California Sur", value: "BCS" },
                    { label: "Campeche", value: "CAM" },
                    { label: "Chiapas", value: "CHP" },
                    { label: "Ciudad de Mexico", value: "CMX" },
                    { label: "Chihuahua", value: "CHH" },
                    { label: "Coahuila", value: "COA" },
                    { label: "Colima", value: "COL" },
                    { label: "Durango", value: "DUR" },
                    { label: "Guanajuato", value: "GUA" },
                    { label: "Guerrero", value: "GRO" },
                    { label: "Hidalgo", value: "HID" },
                    { label: "Jalisco", value: "JAL" },
                    { label: "Michoacan", value: "MIC" },
                    { label: "Morelos", value: "MOR" },
                    { label: "Nayarit", value: "NAY" },
                    { label: "Nuevo Leon", value: "NLE" },
                    { label: "Oaxaca", value: "OAX" },
                    { label: "Puebla", value: "PUE" },
                    { label: "Queretaro", value: "QUE" },
                    { label: "Quintana Roo", value: "ROO" },
                    { label: "San Luis Potosi", value: "SLP" },
                    { label: "Sinaloa", value: "SIN" },
                    { label: "Sonora", value: "SON" },
                    { label: "Tabasco", value: "TAB" },
                    { label: "Tamaulipas", value: "TAM" },
                    { label: "Tlaxcala", value: "TLA" },
                    { label: "Veracruz", value: "VER" },
                    { label: "Yucatan", value: "YUC" },
                    { label: "Zacatecas", value: "ZAC" },
                ]);
                break;
            case "Mexico":
                this.setStateValues("Province", [
                    { label: "Select Province", value: "" },
                    { label: "Aguascalientes", value: "Aguascalientes" },
                    { label: "Baja California", value: "Baja California" },
                    { label: "Baja California Sur", value: "Baja California Sur" },
                    { label: "Campeche", value: "Campeche" },
                    { label: "Chiapas", value: "Chiapas" },
                    { label: "Ciudad de Mexico", value: "Ciudad de Mexico" },
                    { label: "Chihuahua", value: "Chihuahua" },
                    { label: "Coahuila", value: "Coahuila" },
                    { label: "Colima", value: "Colima" },
                    { label: "Durango", value: "Durango" },
                    { label: "Guanajuato", value: "Guanajuato" },
                    { label: "Guerrero", value: "Guerrero" },
                    { label: "Hidalgo", value: "Hidalgo" },
                    { label: "Jalisco", value: "Jalisco" },
                    { label: "Michoacan", value: "Michoacan" },
                    { label: "Morelos", value: "Morelos" },
                    { label: "Nayarit", value: "Nayarit" },
                    { label: "Nuevo Leon", value: "Nuevo Leon" },
                    { label: "Oaxaca", value: "Oaxaca" },
                    { label: "Puebla", value: "Puebla" },
                    { label: "Queretaro", value: "Queretaro" },
                    { label: "Quintana Roo", value: "Quintana Roo" },
                    { label: "San Luis Potosi", value: "San Luis Potosi" },
                    { label: "Sinaloa", value: "Sinaloa" },
                    { label: "Sonora", value: "Sonora" },
                    { label: "Tabasco", value: "Tabasco" },
                    { label: "Tamaulipas", value: "Tamaulipas" },
                    { label: "Tlaxcala", value: "Tlaxcala" },
                    { label: "Veracruz", value: "Veracruz" },
                    { label: "Yucatan", value: "Yucatan" },
                    { label: "Zacatecas", value: "Zacatecas" },
                ]);
                break;
            default:
                this.setStateValues("Province/State", null);
                break;
        }
    }
    setStateValues(label, values) {
        const stateField = document.querySelector("#en__field_supporter_region");
        const stateWrapper = stateField ? stateField.closest(".en__field") : null;
        if (stateWrapper) {
            const stateLabel = stateWrapper.querySelector(".en__field__label");
            const elementWrapper = stateWrapper.querySelector(".en__field__element");
            if (stateLabel) {
                stateLabel.innerHTML = label;
            }
            if (elementWrapper) {
                const selectedState = get("engrid-state");
                if (values === null || values === void 0 ? void 0 : values.length) {
                    const select = document.createElement("select");
                    select.name = "supporter.region";
                    select.id = "en__field_supporter_region";
                    select.classList.add("en__field__input");
                    select.classList.add("en__field__input--select");
                    select.autocomplete = "address-level1";
                    values.forEach((value) => {
                        const option = document.createElement("option");
                        option.value = value.value;
                        option.innerHTML = value.label;
                        if (selectedState === value.value) {
                            option.selected = true;
                        }
                        select.appendChild(option);
                    });
                    elementWrapper.innerHTML = "";
                    elementWrapper.appendChild(select);
                    select.addEventListener("change", this.rememberState.bind(this));
                }
                else {
                    elementWrapper.innerHTML = "";
                    const input = document.createElement("input");
                    input.type = "text";
                    input.name = "supporter.region";
                    input.placeholder = label;
                    input.id = "en__field_supporter_region";
                    input.classList.add("en__field__input");
                    input.classList.add("en__field__input--text");
                    input.autocomplete = "address-level1";
                    if (selectedState) {
                        input.value = selectedState;
                    }
                    elementWrapper.appendChild(input);
                    input.addEventListener("change", this.rememberState.bind(this));
                }
            }
        }
    }
    rememberState() {
        const stateField = document.querySelector("#en__field_supporter_region");
        if (stateField) {
            set("engrid-state", stateField.value, {
                expires: 1,
            });
        }
    }
}

;// CONCATENATED MODULE: ./node_modules/@4site/engrid-common/dist/simple-country-select.js
// This class works when the user has added ".simple_country_select" as a class in page builder for the Country select


class SimpleCountrySelect {
    constructor() {
        this.countryWrapper = document.querySelector(".simple_country_select");
        this.countrySelect = document.querySelector("#en__field_supporter_country");
        this.country = null;
        const engridAutofill = get("engrid-autofill");
        const submissionFailed = !!(engrid_ENGrid.checkNested(window.EngagingNetworks, "require", "_defined", "enjs", "checkSubmissionFailed") && window.EngagingNetworks.require._defined.enjs.checkSubmissionFailed());
        const hasIntlSupport = !!engrid_ENGrid.checkNested(window.Intl, "DisplayNames");
        // Only run if there's no engrid-autofill cookie && if it has Intl support
        if (!engridAutofill && !submissionFailed && hasIntlSupport) {
            fetch(`https://${window.location.hostname}/cdn-cgi/trace`)
                .then((res) => res.text())
                .then((t) => {
                let data = t.replace(/[\r\n]+/g, '","').replace(/\=+/g, '":"');
                data = '{"' + data.slice(0, data.lastIndexOf('","')) + '"}';
                const jsondata = JSON.parse(data);
                this.country = jsondata.loc;
                this.init();
                // console.log("Country:", this.country);
            });
        }
        else {
            this.init();
        }
    }
    init() {
        if (this.countrySelect) {
            if (this.country) {
                const countriesNames = new Intl.DisplayNames(["en"], {
                    type: "region",
                });
                // We are setting the country by Name because the ISO code is not always the same. They have 2 and 3 letter codes.
                this.setCountryByName(countriesNames.of(this.country));
            }
            let countrySelectValue = this.countrySelect.options[this.countrySelect.selectedIndex].value;
            // @TODO Update so that it reads "(Outside X?)" where X is the Value of the Country Select. No need for long form version of it.
            if (countrySelectValue.toUpperCase() == "US" ||
                countrySelectValue.toUpperCase() == "USA" ||
                countrySelectValue.toUpperCase() == "UNITED STATES") {
                countrySelectValue = "the US";
            }
            let countryWrapper = document.querySelector(".simple_country_select");
            if (countryWrapper) {
                // Remove Country Select tab index
                this.countrySelect.tabIndex = -1;
                // Find the address label
                let addressLabel = document.querySelector(".en__field--address1 label");
                // EN does not enforce a labels on fields so we have to check for it
                // @TODO Update so that this follows the same pattern / HTML structure as the Tippy tooltips which are added to labels. REF: https://github.com/4site-interactive-studios/engrid-aiusa/blob/6e4692d4f9a28b9668d6c1bfed5622ac0cc5bdb9/src/scripts/main.js#L42
                if (addressLabel) {
                    let labelText = addressLabel.innerHTML;
                    // Add our link INSIDE the address label
                    let newEl = document.createElement("span");
                    newEl.innerHTML =
                        '<label class="engrid-simple-country"><a href="javascript:void(0)">(Outside ' +
                            countrySelectValue +
                            "?)</a></label>";
                    addressLabel.innerHTML = `${labelText}${newEl.innerHTML}`;
                    addressLabel.addEventListener("click", (ev) => {
                        var _a;
                        ev.preventDefault();
                        if (((_a = ev.target) === null || _a === void 0 ? void 0 : _a.tagName) === "A") {
                            this.showCountrySelect(ev);
                        }
                    });
                }
            }
            // Deal with the auto-fill for the country
            this.countrySelect.addEventListener("change", this.writeLink.bind(this));
        }
    }
    showCountrySelect(e) {
        var _a;
        e.preventDefault();
        this.countryWrapper.classList.add("country-select-visible");
        let addressLabel = document.querySelector(".en__field--address1 label");
        let addressWrapper = (_a = addressLabel.parentElement) === null || _a === void 0 ? void 0 : _a.parentElement;
        addressWrapper.classList.add("country-select-visible");
        this.countrySelect.focus();
        // Reinstate Country Select tab index
        this.countrySelect.removeAttribute("tabIndex");
    }
    writeLink() {
        let countryName = this.countrySelect.options[this.countrySelect.selectedIndex].value;
        let addressLabel = document.querySelector(".engrid-simple-country");
        if (addressLabel) {
            let labelLink = `<a href="javascript:void(0)">(Outside ${countryName}?)</a>`;
            addressLabel.innerHTML = labelLink;
        }
    }
    setCountryByName(countryName) {
        if (this.countrySelect) {
            let countrySelectOptions = this.countrySelect.options;
            for (let i = 0; i < countrySelectOptions.length; i++) {
                if (countrySelectOptions[i].innerHTML.toLowerCase() ==
                    countryName.toLowerCase()) {
                    this.countrySelect.selectedIndex = i;
                    break;
                }
            }
            const event = new Event("change", { bubbles: true });
            this.countrySelect.dispatchEvent(event);
        }
    }
}

;// CONCATENATED MODULE: ./node_modules/@4site/engrid-common/dist/skip-link.js
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
            firstTitleInEngridBody.parentElement.insertAdjacentHTML("beforebegin", '<span id="skip-link"></span>');
            this.insertSkipLinkSpan();
        }
        else if (firstH1InEngridBody && firstH1InEngridBody.parentElement) {
            firstH1InEngridBody.parentElement.insertAdjacentHTML("beforebegin", '<span id="skip-link"></span>');
            this.insertSkipLinkSpan();
        }
        else if (firstTitle && firstTitle.parentElement) {
            firstTitle.parentElement.insertAdjacentHTML("beforebegin", '<span id="skip-link"></span>');
            this.insertSkipLinkSpan();
        }
        else if (firstH1 && firstH1.parentElement) {
            firstH1.parentElement.insertAdjacentHTML("beforebegin", '<span id="skip-link"></span>');
            this.insertSkipLinkSpan();
        }
        else {
            if (engrid_ENGrid.debug)
                console.log("This page contains no <title> or <h1> and a 'Skip to main content' link was not added");
        }
    }
    insertSkipLinkSpan() {
        document.body.insertAdjacentHTML("afterbegin", '<a class="skip-link" href="#skip-link">Skip to main content</a>');
    }
}

;// CONCATENATED MODULE: ./node_modules/@4site/engrid-common/dist/src-defer.js
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
        this.videoBackgroundSource = document.querySelectorAll("video source");
        // Process images
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
        }
        // Process video
        for (let i = 0; i < this.videoBackground.length; i++) {
            let video = this.videoBackground[i];
            // Process one or more defined sources in the <video> tag
            this.videoBackgroundSource = video.querySelectorAll("source");
            if (this.videoBackgroundSource) {
                // loop through all the sources
                for (let j = 0; j < this.videoBackgroundSource.length; j++) {
                    let videoSource = this.videoBackgroundSource[j];
                    if (videoSource) {
                        let videoBackgroundSourcedDataSrc = videoSource.getAttribute("data-src");
                        if (videoBackgroundSourcedDataSrc) {
                            videoSource.setAttribute("src", videoBackgroundSourcedDataSrc);
                            videoSource.setAttribute("data-engrid-data-src-processed", "true"); // Sets an attribute to mark that it has been processed by ENGrid
                            videoSource.removeAttribute("data-src"); // Removes the data-source
                        }
                    }
                }
                // To get the browser to request the video asset defined we need to remove the <video> tag and re-add it
                let videoBackgroundParent = video.parentNode; // Determine the parent of the <video> tag
                let copyOfVideoBackground = video; // Copy the <video> tag
                if (videoBackgroundParent && copyOfVideoBackground) {
                    videoBackgroundParent.replaceChild(copyOfVideoBackground, video); // Replace the <video> with the copy of itself
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

;// CONCATENATED MODULE: ./node_modules/@4site/engrid-common/dist/set-recurr-freq.js


class setRecurrFreq {
    constructor() {
        this._frequency = DonationFrequency.getInstance();
        this.linkClass = "setRecurrFreq-";
        this.checkboxName = "engrid.recurrfreq";
        // Watch the links that starts with linkClass
        document
            .querySelectorAll(`a[class^="${this.linkClass}"]`)
            .forEach((element) => {
            element.addEventListener("click", (e) => {
                // Get the right class
                const setRecurrFreqClass = element.className
                    .split(" ")
                    .filter((linkClass) => linkClass.startsWith(this.linkClass));
                if (engrid_ENGrid.debug)
                    console.log(setRecurrFreqClass);
                if (setRecurrFreqClass.length) {
                    e.preventDefault();
                    engrid_ENGrid.setFieldValue("transaction.recurrfreq", setRecurrFreqClass[0]
                        .substring(this.linkClass.length)
                        .toUpperCase());
                    this._frequency.load();
                }
            });
        });
        const currentFrequency = engrid_ENGrid.getFieldValue("transaction.recurrfreq").toUpperCase();
        // Watch checkboxes with the name checkboxName
        document.getElementsByName(this.checkboxName).forEach((element) => {
            // Set checked status per currently-set frequency
            const frequency = element.value.toUpperCase();
            if (frequency === currentFrequency) {
                element.checked = true;
            }
            else {
                element.checked = false;
            }
            element.addEventListener("change", () => {
                const frequency = element.value.toUpperCase();
                if (element.checked) {
                    engrid_ENGrid.setFieldValue("transaction.recurrfreq", frequency);
                    engrid_ENGrid.setFieldValue("transaction.recurrpay", "Y");
                    this._frequency.load();
                }
                else if (frequency !== "ONETIME") {
                    engrid_ENGrid.setFieldValue("transaction.recurrfreq", "ONETIME");
                    engrid_ENGrid.setFieldValue("transaction.recurrpay", "N");
                    this._frequency.load();
                }
            });
        });
        // Uncheck the checkbox when frequency != checkbox value
        this._frequency.onFrequencyChange.subscribe(() => {
            const currentFrequency = this._frequency.frequency.toUpperCase();
            document.getElementsByName(this.checkboxName).forEach((element) => {
                const elementFrequency = element.value.toUpperCase();
                if (element.checked && elementFrequency !== currentFrequency) {
                    element.checked = false;
                }
                else if (!element.checked && elementFrequency === currentFrequency) {
                    element.checked = true;
                }
            });
        });
    }
}

;// CONCATENATED MODULE: ./node_modules/@4site/engrid-common/dist/page-background.js

class PageBackground {
    constructor() {
        // @TODO: Change page-backgroundImage to page-background
        this.pageBackground = document.querySelector(".page-backgroundImage");
        // Finds any <img> added to the "backgroundImage" ENGRid section and sets it as the "--engrid__page-backgroundImage_url" CSS Custom Property
        if (this.pageBackground) {
            const pageBackgroundImg = this.pageBackground.querySelector("img");
            let pageBackgroundImgDataSrc = pageBackgroundImg === null || pageBackgroundImg === void 0 ? void 0 : pageBackgroundImg.getAttribute("data-src");
            let pageBackgroundImgSrc = pageBackgroundImg === null || pageBackgroundImg === void 0 ? void 0 : pageBackgroundImg.src;
            if (this.pageBackground && pageBackgroundImgDataSrc) {
                if (engrid_ENGrid.debug)
                    console.log("A background image set in the page was found with a data-src value, setting it as --engrid__page-backgroundImage_url", pageBackgroundImgDataSrc);
                pageBackgroundImgDataSrc = "url('" + pageBackgroundImgDataSrc + "')";
                this.pageBackground.style.setProperty("--engrid__page-backgroundImage_url", pageBackgroundImgDataSrc);
            }
            else if (this.pageBackground && pageBackgroundImgSrc) {
                if (engrid_ENGrid.debug)
                    console.log("A background image set in the page was found with a src value, setting it as --engrid__page-backgroundImage_url", pageBackgroundImgSrc);
                pageBackgroundImgSrc = "url('" + pageBackgroundImgSrc + "')";
                this.pageBackground.style.setProperty("--engrid__page-backgroundImage_url", pageBackgroundImgSrc);
            }
            else if (pageBackgroundImg) {
                if (engrid_ENGrid.debug)
                    console.log("A background image set in the page was found but without a data-src or src value, no action taken", pageBackgroundImg);
            }
            else {
                if (engrid_ENGrid.debug)
                    console.log("A background image set in the page was not found, any default image set in the theme on --engrid__page-backgroundImage_url will be used");
            }
        }
        else {
            if (engrid_ENGrid.debug)
                console.log("A background image set in the page was not found, any default image set in the theme on --engrid__page-backgroundImage_url will be used");
        }
        this.setDataAttributes();
    }
    setDataAttributes() {
        if (this.hasVideoBackground())
            return engrid_ENGrid.setBodyData("page-background", "video");
        if (this.hasImageBackground())
            return engrid_ENGrid.setBodyData("page-background", "image");
        return engrid_ENGrid.setBodyData("page-background", "empty");
    }
    hasVideoBackground() {
        if (this.pageBackground) {
            return !!this.pageBackground.querySelector("video");
        }
    }
    hasImageBackground() {
        if (this.pageBackground) {
            return (!this.hasVideoBackground() && !!this.pageBackground.querySelector("img"));
        }
    }
}

;// CONCATENATED MODULE: ./node_modules/@4site/engrid-common/dist/neverbounce.js


class NeverBounce {
    constructor(apiKey, dateField = null, statusField = null, dateFormat) {
        this.apiKey = apiKey;
        this.dateField = dateField;
        this.statusField = statusField;
        this.dateFormat = dateFormat;
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
            feedback: false,
        };
        engrid_ENGrid.loadJS("https://cdn.neverbounce.com/widget/dist/NeverBounce.js");
        this.init();
        this.form.onValidate.subscribe(() => (this.form.validate = this.validate()));
    }
    init() {
        this.emailField = document.getElementById("en__field_supporter_emailAddress");
        if (this.dateField && document.getElementsByName(this.dateField).length)
            this.nbDate = document.querySelector("[name='" + this.dateField + "']");
        if (this.statusField && document.getElementsByName(this.statusField).length)
            this.nbStatus = document.querySelector("[name='" + this.statusField + "']");
        if (!this.emailField) {
            if (engrid_ENGrid.debug)
                console.log("Engrid Neverbounce: E-mail Field Not Found");
            return;
        }
        if (!this.emailField) {
            if (engrid_ENGrid.debug)
                console.log("Engrid Neverbounce: E-mail Field Not Found", this.emailField);
            return;
        }
        if (engrid_ENGrid.debug)
            console.log("Engrid Neverbounce External Script Loaded");
        this.wrap(this.emailField, document.createElement("div"));
        const parentNode = this.emailField.parentNode;
        parentNode.id = "nb-wrapper";
        // Define HTML structure for a Custom NB Message and insert it after Email field
        const nbCustomMessageHTML = document.createElement("div");
        nbCustomMessageHTML.innerHTML =
            '<div id="nb-feedback" class="en__field__error nb-hidden">Enter a valid email.</div>';
        this.insertAfter(nbCustomMessageHTML, this.emailField);
        const NBClass = this;
        window.addEventListener("load", function () {
            document
                .getElementsByTagName("body")[0]
                .addEventListener("nb:registered", function (event) {
                const field = document.querySelector('[data-nb-id="' + event.detail.id + '"]');
                field.addEventListener("nb:loading", function (e) {
                    engrid_ENGrid.disableSubmit("Validating Your Email");
                });
                // Never Bounce: Do work when input changes or when API responds with an error
                field.addEventListener("nb:clear", function (e) {
                    NBClass.setEmailStatus("clear");
                    engrid_ENGrid.enableSubmit();
                    if (NBClass.nbDate)
                        NBClass.nbDate.value = "";
                    if (NBClass.nbStatus)
                        NBClass.nbStatus.value = "";
                });
                // Never Bounce: Do work when results have an input that does not look like an email (i.e. missing @ or no .com/.net/etc...)
                field.addEventListener("nb:soft-result", function (e) {
                    NBClass.setEmailStatus("soft-result");
                    if (NBClass.nbDate)
                        NBClass.nbDate.value = "";
                    if (NBClass.nbStatus)
                        NBClass.nbStatus.value = "";
                    engrid_ENGrid.enableSubmit();
                });
                // Never Bounce: When results have been received
                field.addEventListener("nb:result", function (e) {
                    if (e.detail.result.is(window._nb.settings.getAcceptedStatusCodes())) {
                        NBClass.setEmailStatus("valid");
                        if (NBClass.nbDate)
                            NBClass.nbDate.value = engrid_ENGrid.formatDate(new Date(), NBClass.dateFormat);
                        if (NBClass.nbStatus)
                            NBClass.nbStatus.value = (e).detail.result.response.result;
                    }
                    else {
                        NBClass.setEmailStatus("invalid");
                        if (NBClass.nbDate)
                            NBClass.nbDate.value = "";
                        if (NBClass.nbStatus)
                            NBClass.nbStatus.value = "";
                    }
                    engrid_ENGrid.enableSubmit();
                });
                if (field.value) {
                    console.log(field);
                    setTimeout(function () {
                        window._nb.fields
                            .get(document.querySelector("[data-nb-id]"))[0]
                            .forceUpdate();
                    }, 100);
                }
            });
            // Never Bounce: Register field with the widget and broadcast nb:registration event
            window._nb.fields.registerListener(NBClass.emailField, true);
        });
    }
    clearStatus() {
        if (!this.emailField) {
            if (engrid_ENGrid.debug)
                console.log("Engrid Neverbounce: E-mail Field Not Found");
            return;
        }
        this.emailField.classList.remove("rm-error");
        // Search page for the NB Wrapper div and set as variable
        const nb_email_field_wrapper = (document.getElementById("nb-wrapper"));
        // Search page for the NB Feedback div and set as variable
        const nb_email_feedback_field = (document.getElementById("nb-feedback"));
        nb_email_field_wrapper.className = "";
        nb_email_feedback_field.className = "en__field__error nb-hidden";
        nb_email_feedback_field.innerHTML = "";
        this.emailWrapper.classList.remove("en__field--validationFailed");
    }
    deleteENFieldError() {
        const errorField = (document.querySelector(".en__field--emailAddress>div.en__field__error"));
        if (errorField)
            errorField.remove();
    }
    setEmailStatus(status) {
        if (engrid_ENGrid.debug)
            console.log("Neverbounce Status:", status);
        if (!this.emailField) {
            if (engrid_ENGrid.debug)
                console.log("Engrid Neverbounce: E-mail Field Not Found");
            return;
        }
        // Search page for the NB Wrapper div and set as variable
        const nb_email_field_wrapper = (document.getElementById("nb-wrapper"));
        // Search page for the NB Feedback div and set as variable
        let nb_email_feedback_field = (document.getElementById("nb-feedback"));
        // classes to add or remove based on neverbounce results
        const nb_email_field_wrapper_success = "nb-success";
        const nb_email_field_wrapper_error = "nb-error";
        const nb_email_feedback_hidden = "nb-hidden";
        const nb_email_feedback_loading = "nb-loading";
        const nb_email_field_error = "rm-error";
        if (!nb_email_feedback_field) {
            const nbWrapperDiv = nb_email_field_wrapper.querySelector("div");
            if (nbWrapperDiv)
                nbWrapperDiv.innerHTML =
                    '<div id="nb-feedback" class="en__field__error nb-hidden">Enter a valid email.</div>';
            nb_email_feedback_field = (document.getElementById("nb-feedback"));
        }
        if (status == "valid") {
            this.clearStatus();
        }
        else {
            nb_email_field_wrapper.classList.remove(nb_email_field_wrapper_success);
            nb_email_field_wrapper.classList.add(nb_email_field_wrapper_error);
            switch (status) {
                case "required": // special case status that we added ourselves -- doesn't come from NB
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
                    }
                    else {
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
    }
    // Function to insert HTML after a DIV
    insertAfter(el, referenceNode) {
        var _a;
        (_a = referenceNode === null || referenceNode === void 0 ? void 0 : referenceNode.parentNode) === null || _a === void 0 ? void 0 : _a.insertBefore(el, referenceNode.nextSibling);
    }
    //  to insert HTML before a DIV
    insertBefore(el, referenceNode) {
        var _a;
        (_a = referenceNode === null || referenceNode === void 0 ? void 0 : referenceNode.parentNode) === null || _a === void 0 ? void 0 : _a.insertBefore(el, referenceNode);
    }
    //  to Wrap HTML around a DIV
    wrap(el, wrapper) {
        var _a;
        (_a = el.parentNode) === null || _a === void 0 ? void 0 : _a.insertBefore(wrapper, el);
        wrapper.appendChild(el);
    }
    validate() {
        var _a;
        if (!this.emailField) {
            if (engrid_ENGrid.debug)
                console.log("Engrid Neverbounce validate(): E-mail Field Not Found. Returning true.");
            return true;
        }
        if (this.nbStatus) {
            this.nbStatus.value = engrid_ENGrid.getFieldValue("nb-result");
        }
        if (!["catchall", "unknown", "valid"].includes(engrid_ENGrid.getFieldValue("nb-result"))) {
            this.setEmailStatus("required");
            (_a = this.emailField) === null || _a === void 0 ? void 0 : _a.focus();
            return false;
        }
        return true;
    }
}

;// CONCATENATED MODULE: ./node_modules/@4site/engrid-common/dist/progress-bar.js

class ProgressBar {
    constructor() {
        var _a, _b;
        const progressIndicator = document.querySelector("span[data-engrid-progress-indicator]");
        const pageCount = engrid_ENGrid.getPageCount();
        const pageNumber = engrid_ENGrid.getPageNumber();
        if (!progressIndicator || !pageCount || !pageNumber) {
            return;
        }
        let maxValue = (_a = progressIndicator.getAttribute("max")) !== null && _a !== void 0 ? _a : 100;
        if (typeof maxValue === "string")
            maxValue = parseInt(maxValue);
        let amountValue = (_b = progressIndicator.getAttribute("amount")) !== null && _b !== void 0 ? _b : 0;
        if (typeof amountValue === "string")
            amountValue = parseInt(amountValue);
        const prevPercentage = pageNumber === 1
            ? 0
            : Math.ceil(((pageNumber - 1) / pageCount) * maxValue);
        let percentage = pageNumber === 1 ? 0 : Math.ceil((pageNumber / pageCount) * maxValue);
        const scalePrev = prevPercentage / 100;
        let scale = percentage / 100;
        if (amountValue) {
            percentage =
                Math.ceil(amountValue) > Math.ceil(maxValue) ? maxValue : amountValue;
            scale = percentage / 100;
        }
        progressIndicator.innerHTML = `
			<div class="indicator__wrap">
				<span class="indicator__progress" style="transform: scaleX(${scalePrev});"></span>
				<span class="indicator__percentage">${percentage}<span class="indicator__percentage-sign">%</span></span>
			</div>`;
        if (percentage !== prevPercentage) {
            const progress = document.querySelector(".indicator__progress");
            requestAnimationFrame(function () {
                progress.style.transform = `scaleX(${scale})`;
            });
        }
    }
}

;// CONCATENATED MODULE: ./node_modules/@4site/engrid-common/dist/remember-me.js


const tippy = (__webpack_require__(3861)/* ["default"] */ .ZP);
class RememberMe {
    constructor(options) {
        this._form = EnForm.getInstance();
        this.iframe = null;
        this.remoteUrl = (options.remoteUrl) ? options.remoteUrl : null;
        this.cookieName = (options.cookieName) ? options.cookieName : 'engrid-autofill';
        this.cookieExpirationDays = (options.cookieExpirationDays) ? options.cookieExpirationDays : 365;
        this.rememberMeOptIn = (options.checked) ? options.checked : false;
        this.fieldNames = (options.fieldNames) ? options.fieldNames : [];
        this.fieldDonationAmountRadioName = (options.fieldDonationAmountRadioName) ? options.fieldDonationAmountRadioName : 'transaction.donationAmt';
        this.fieldDonationAmountOtherName = (options.fieldDonationAmountOtherName) ? options.fieldDonationAmountOtherName : 'transaction.donationAmt.other';
        this.fieldDonationRecurrPayRadioName = (options.fieldDonationRecurrPayRadioName) ? options.fieldDonationRecurrPayRadioName : 'transaction.recurrpay';
        this.fieldDonationAmountOtherCheckboxID = (options.fieldDonationAmountOtherCheckboxID) ? options.fieldDonationAmountOtherCheckboxID : '#en__field_transaction_donationAmt4';
        this.fieldOptInSelectorTarget = (options.fieldOptInSelectorTarget) ? options.fieldOptInSelectorTarget : '.en__field--emailAddress.en__field';
        this.fieldOptInSelectorTargetLocation = (options.fieldOptInSelectorTargetLocation) ? options.fieldOptInSelectorTargetLocation : 'after';
        this.fieldClearSelectorTarget = (options.fieldClearSelectorTarget) ? options.fieldClearSelectorTarget : 'label[for="en__field_supporter_firstName"]';
        this.fieldClearSelectorTargetLocation = (options.fieldClearSelectorTargetLocation) ? options.fieldClearSelectorTargetLocation : 'before';
        this.fieldData = {};
        if (this.useRemote()) {
            this.createIframe(() => {
                if (this.iframe && this.iframe.contentWindow) {
                    this.iframe.contentWindow.postMessage({ key: this.cookieName, operation: 'read' }, '*');
                    this._form.onSubmit.subscribe(() => {
                        if (this.rememberMeOptIn) {
                            this.readFields();
                            this.saveCookieToRemote();
                        }
                    });
                }
            }, (event) => {
                if (event.data && event.data.key && event.data.value !== undefined && event.data.key === this.cookieName) {
                    this.updateFieldData(event.data.value);
                    this.writeFields();
                    let hasFieldData = Object.keys(this.fieldData).length > 0;
                    if (!hasFieldData) {
                        this.insertRememberMeOptin();
                    }
                    else {
                        this.insertClearRememberMeLink();
                    }
                }
            });
        }
        else {
            this.readCookie();
            let hasFieldData = Object.keys(this.fieldData).length > 0;
            if (!hasFieldData) {
                this.insertRememberMeOptin();
                this.rememberMeOptIn = false;
            }
            else {
                this.insertClearRememberMeLink();
                this.rememberMeOptIn = true;
            }
            this.writeFields();
            this._form.onSubmit.subscribe(() => {
                if (this.rememberMeOptIn) {
                    this.readFields();
                    this.saveCookie();
                }
            });
        }
    }
    updateFieldData(jsonData) {
        if (jsonData) {
            let data = JSON.parse(jsonData);
            for (let i = 0; i < this.fieldNames.length; i++) {
                if (data[this.fieldNames[i]] !== undefined) {
                    this.fieldData[this.fieldNames[i]] = decodeURIComponent(data[this.fieldNames[i]]);
                }
            }
        }
    }
    insertClearRememberMeLink() {
        if (!document.getElementById('clear-autofill-data')) {
            const clearAutofillLabel = 'clear autofill';
            const clearRememberMeField = document.createElement('a');
            clearRememberMeField.setAttribute('id', 'clear-autofill-data');
            clearRememberMeField.classList.add('label-tooltip');
            clearRememberMeField.setAttribute('style', 'cursor: pointer;');
            clearRememberMeField.innerHTML = `(${clearAutofillLabel})`;
            const targetField = this.getElementByFirstSelector(this.fieldClearSelectorTarget);
            if (targetField) {
                if (this.fieldClearSelectorTargetLocation === 'after') {
                    targetField.appendChild(clearRememberMeField);
                }
                else {
                    targetField.prepend(clearRememberMeField);
                }
                clearRememberMeField.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.clearFields(['supporter.country' /*, 'supporter.emailAddress'*/]);
                    if (this.useRemote()) {
                        this.clearCookieOnRemote();
                    }
                    else {
                        this.clearCookie();
                    }
                    let clearAutofillLink = document.getElementById('clear-autofill-data');
                    if (clearAutofillLink) {
                        clearAutofillLink.style.display = 'none';
                    }
                    this.rememberMeOptIn = false;
                });
            }
        }
    }
    getElementByFirstSelector(selectorsString) {
        // iterate through the selectors until we find one that exists
        let targetField = null;
        const selectorTargets = selectorsString.split(',');
        for (let i = 0; i < selectorTargets.length; i++) {
            targetField = document.querySelector(selectorTargets[i]);
            if (targetField) {
                break;
            }
        }
        return targetField;
    }
    insertRememberMeOptin() {
        let rememberMeOptInField = document.getElementById('remember-me-opt-in');
        if (!rememberMeOptInField) {
            const rememberMeLabel = 'Remember Me';
            const rememberMeInfo = `
				Check “Remember me” to complete forms on this device faster. 
				While your financial information won’t be stored, you should only check this box from a personal device. 
				Click “Clear autofill” to remove the information from your device at any time.
			`;
            const rememberMeOptInFieldChecked = (this.rememberMeOptIn) ? 'checked' : '';
            const rememberMeOptInField = document.createElement('div');
            rememberMeOptInField.classList.add('en__field', 'en__field--checkbox');
            rememberMeOptInField.setAttribute('id', 'remember-me-opt-in');
            rememberMeOptInField.setAttribute('style', 'overflow-x: hidden;');
            rememberMeOptInField.innerHTML = `
				<div class="en__field__item rememberme-wrapper">
					<input id="remember-me-checkbox" type="checkbox" class="en__field__input en__field__input--checkbox" ${rememberMeOptInFieldChecked} />
					<label for="remember-me-checkbox" class="en__field__label en__field__label--item" style="white-space: nowrap;">
						<div class="rememberme-content" style="display: inline-flex; align-items: center;">
							${rememberMeLabel}
							<a id="rememberme-learn-more-toggle" style="display: inline-block; display: inline-flex; align-items: center; cursor: pointer; margin-left: 10px;">
								<svg style="height: 14px; width: auto; z-index: 1;" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11 7H9V5H11V7ZM11 9H9V15H11V9ZM10 2C5.59 2 2 5.59 2 10C2 14.41 5.59 18 10 18C14.41 18 18 14.41 18 10C18 5.59 14.41 2 10 2ZM10 0C15.523 0 20 4.477 20 10C20 15.523 15.523 20 10 20C4.477 20 0 15.523 0 10C0 4.477 4.477 0 10 0Z" fill="currentColor"/></svg>
							</a>
						</div>
					</label>
				</div>
			`;
            const targetField = this.getElementByFirstSelector(this.fieldOptInSelectorTarget);
            if (targetField && targetField.parentNode) {
                targetField.parentNode.insertBefore(rememberMeOptInField, (this.fieldOptInSelectorTargetLocation == 'before') ? targetField : targetField.nextSibling);
                const rememberMeCheckbox = document.getElementById('remember-me-checkbox');
                if (rememberMeCheckbox) {
                    rememberMeCheckbox.addEventListener('change', () => {
                        if (rememberMeCheckbox.checked) {
                            this.rememberMeOptIn = true;
                        }
                        else {
                            this.rememberMeOptIn = false;
                        }
                    });
                }
                tippy('#rememberme-learn-more-toggle', { content: rememberMeInfo });
            }
        }
        else if (this.rememberMeOptIn) {
            rememberMeOptInField.checked = true;
        }
    }
    useRemote() {
        return (this.remoteUrl && window.postMessage && window.JSON && window.localStorage);
    }
    createIframe(iframeLoaded, messageReceived) {
        if (this.remoteUrl) {
            let iframe = document.createElement('iframe');
            iframe.style.cssText = 'position:absolute;width:1px;height:1px;left:-9999px;';
            iframe.src = this.remoteUrl;
            iframe.setAttribute('sandbox', 'allow-same-origin allow-scripts');
            this.iframe = iframe;
            document.body.appendChild(this.iframe);
            this.iframe.addEventListener('load', () => iframeLoaded(), false);
            window.addEventListener('message', (event) => messageReceived(event), false);
        }
    }
    clearCookie() {
        this.fieldData = {};
        this.saveCookie();
    }
    clearCookieOnRemote() {
        this.fieldData = {};
        this.saveCookieToRemote();
    }
    saveCookieToRemote() {
        if (this.iframe && this.iframe.contentWindow) {
            this.iframe.contentWindow.postMessage({ key: this.cookieName, value: JSON.stringify(this.fieldData), operation: 'write', expires: this.cookieExpirationDays }, '*');
        }
    }
    readCookie() {
        this.updateFieldData(get(this.cookieName) || '');
    }
    saveCookie() {
        set(this.cookieName, JSON.stringify(this.fieldData), { expires: this.cookieExpirationDays });
    }
    readFields() {
        for (let i = 0; i < this.fieldNames.length; i++) {
            let fieldSelector = "[name='" + this.fieldNames[i] + "']";
            let field = document.querySelector(fieldSelector);
            if (field) {
                if (field.tagName === 'INPUT') {
                    let type = field.getAttribute('type');
                    if (type === 'radio' || type === 'checkbox') {
                        field = document.querySelector(fieldSelector + ":checked");
                    }
                    this.fieldData[this.fieldNames[i]] = encodeURIComponent(field.value);
                }
                else if (field.tagName === 'SELECT') {
                    this.fieldData[this.fieldNames[i]] = encodeURIComponent(field.value);
                }
            }
        }
    }
    setFieldValue(field, value, overwrite = false) {
        if (field && value !== undefined) {
            if (field.value && overwrite || !field.value) {
                field.value = value;
            }
        }
    }
    clearFields(skipFields) {
        for (let key in this.fieldData) {
            if (skipFields.includes(key)) {
                delete this.fieldData[key];
            }
            else if (this.fieldData[key] === '') {
                delete this.fieldData[key];
            }
            else {
                this.fieldData[key] = '';
            }
        }
        this.writeFields(true);
    }
    writeFields(overwrite = false) {
        for (let i = 0; i < this.fieldNames.length; i++) {
            let fieldSelector = "[name='" + this.fieldNames[i] + "']";
            let field = document.querySelector(fieldSelector);
            if (field) {
                if (field.tagName === 'INPUT') {
                    if (this.fieldNames[i] === this.fieldDonationRecurrPayRadioName) {
                        if (this.fieldData[this.fieldNames[i]] === 'Y') {
                            field.click();
                        }
                    }
                    else if (this.fieldDonationAmountRadioName === this.fieldNames[i]) {
                        field = document.querySelector(fieldSelector + "[value='" + this.fieldData[this.fieldNames[i]] + "']");
                        if (field) {
                            field.click();
                        }
                        else {
                            field = document.querySelector("input[name='" + this.fieldDonationAmountOtherName + "']");
                            this.setFieldValue(field, this.fieldData[this.fieldNames[i]], true);
                        }
                    }
                    else {
                        this.setFieldValue(field, this.fieldData[this.fieldNames[i]], overwrite);
                    }
                }
                else if (field.tagName === 'SELECT') {
                    this.setFieldValue(field, this.fieldData[this.fieldNames[i]], true);
                }
            }
        }
    }
}

;// CONCATENATED MODULE: ./node_modules/@4site/engrid-common/dist/show-if-amount.js


class ShowIfAmount {
    constructor() {
        this._amount = DonationAmount.getInstance();
        this.logger = new EngridLogger("ShowIfAmount", "yellow", "black", "👀");
        this._elements = document.querySelectorAll('[class*="showifamount"]');
        if (this._elements.length > 0) {
            this._amount.onAmountChange.subscribe(() => this.init());
            this.init();
            return;
        }
        this.logger.log("Show If Amount: NO ELEMENTS FOUND");
    }
    init() {
        const amount = this._amount.amount;
        this._elements.forEach((element) => {
            this.lessthan(amount, element);
            this.lessthanorequalto(amount, element);
            this.equalto(amount, element);
            this.greaterthanorequalto(amount, element);
            this.greaterthan(amount, element);
            this.between(amount, element);
        });
    }
    getClassNameByOperand(classList, operand) {
        let myClass = null;
        classList.forEach((className) => {
            if (className.includes(`showifamount-${operand}-`)) {
                myClass = className;
            }
        });
        return myClass;
    }
    lessthan(amount, element) {
        const showifamountClass = this.getClassNameByOperand(element.classList, "lessthan");
        if (showifamountClass) {
            let amountCheck = showifamountClass.split("-").slice(-1)[0];
            if (amount < Number(amountCheck)) {
                this.logger.log("(lessthan):", element);
                element.classList.add("engrid-open");
            }
            else {
                element.classList.remove("engrid-open");
            }
        }
    }
    lessthanorequalto(amount, element) {
        const showifamountClass = this.getClassNameByOperand(element.classList, "lessthanorequalto");
        if (showifamountClass) {
            let amountCheck = showifamountClass.split("-").slice(-1)[0];
            if (amount <= Number(amountCheck)) {
                this.logger.log("(lessthanorequalto):", element);
                element.classList.add("engrid-open");
            }
            else {
                element.classList.remove("engrid-open");
            }
        }
    }
    equalto(amount, element) {
        const showifamountClass = this.getClassNameByOperand(element.classList, "equalto");
        if (showifamountClass) {
            let amountCheck = showifamountClass.split("-").slice(-1)[0];
            if (amount == Number(amountCheck)) {
                this.logger.log("(equalto):", element);
                element.classList.add("engrid-open");
            }
            else {
                element.classList.remove("engrid-open");
            }
        }
    }
    greaterthanorequalto(amount, element) {
        const showifamountClass = this.getClassNameByOperand(element.classList, "greaterthanorequalto");
        if (showifamountClass) {
            let amountCheck = showifamountClass.split("-").slice(-1)[0];
            if (amount >= Number(amountCheck)) {
                this.logger.log("(greaterthanorequalto):", element);
                element.classList.add("engrid-open");
            }
            else {
                element.classList.remove("engrid-open");
            }
        }
    }
    greaterthan(amount, element) {
        const showifamountClass = this.getClassNameByOperand(element.classList, "greaterthan");
        if (showifamountClass) {
            let amountCheck = showifamountClass.split("-").slice(-1)[0];
            if (amount > Number(amountCheck)) {
                this.logger.log("(greaterthan):", element);
                element.classList.add("engrid-open");
            }
            else {
                element.classList.remove("engrid-open");
            }
        }
    }
    between(amount, element) {
        const showifamountClass = this.getClassNameByOperand(element.classList, "between");
        if (showifamountClass) {
            let amountCheckMin = showifamountClass.split("-").slice(-2, -1)[0];
            let amountCheckMax = showifamountClass.split("-").slice(-1)[0];
            if (amount > Number(amountCheckMin) && amount < Number(amountCheckMax)) {
                this.logger.log("(between):", element);
                element.classList.add("engrid-open");
            }
            else {
                element.classList.remove("engrid-open");
            }
        }
    }
}

;// CONCATENATED MODULE: ./node_modules/@4site/engrid-common/dist/other-amount.js
// This class automatically select other radio input when an amount is entered into it.
class OtherAmount {
    constructor() {
        "focus input".split(" ").forEach((e) => {
            var _a;
            // We're attaching this event to the body because sometimes the other amount input is not in the DOM yet and comes via AJAX.
            (_a = document.querySelector("body")) === null || _a === void 0 ? void 0 : _a.addEventListener(e, (event) => {
                const target = event.target;
                if (target.classList.contains("en__field__input--other")) {
                    console.log("Other Amount Field Focused");
                    this.setRadioInput();
                }
            });
        });
    }
    setRadioInput() {
        const target = document.querySelector(".en__field__input--other");
        if (target && target.parentNode && target.parentNode.parentNode) {
            const targetWrapper = target.parentNode;
            targetWrapper.classList.remove("en__field__item--hidden");
            if (targetWrapper.parentNode) {
                const lastRadioInput = targetWrapper.parentNode.querySelector(".en__field__item:nth-last-child(2) input");
                lastRadioInput.checked = !0;
            }
        }
    }
}

;// CONCATENATED MODULE: ./node_modules/@4site/engrid-common/dist/logger.js

/**
 * A better logger. It only works if debug is enabled.
 */
class EngridLogger {
    constructor(prefix, color, background, emoji) {
        this.prefix = "";
        this.color = "black";
        this.background = "white";
        this.emoji = "";
        if (emoji) {
            this.emoji = emoji;
        }
        else {
            switch (color) {
                case "red":
                    this.emoji = "🔴";
                    break;
                case "green":
                    this.emoji = "🟢";
                    break;
                case "blue":
                    this.emoji = "🔵";
                    break;
                case "yellow":
                    this.emoji = "🟡";
                    this.background = "black";
                    break;
                case "purple":
                    this.emoji = "🟣";
                    break;
                case "black":
                default:
                    this.emoji = "⚫";
                    break;
            }
        }
        if (prefix) {
            this.prefix = `[ENgrid ${prefix}]`;
        }
        if (color) {
            this.color = color;
        }
        if (background) {
            this.background = background;
        }
    }
    get log() {
        if (!engrid_ENGrid.debug) {
            return () => { };
        }
        return console.log.bind(window.console, "%c" + this.emoji + " " + this.prefix + " %s", `color: ${this.color}; background: ${this.background}; font-size: 1.2em; padding: 4px; border-radius: 2px; font-family: monospace;`);
    }
    get success() {
        if (!engrid_ENGrid.debug) {
            return () => { };
        }
        return console.log.bind(window.console, "%c ✅ " + this.prefix + " %s", `color: green; background: white; font-size: 1.2em; padding: 4px; border-radius: 2px; font-family: monospace;`);
    }
    get danger() {
        if (!engrid_ENGrid.debug) {
            return () => { };
        }
        return console.log.bind(window.console, "%c ⛔️ " + this.prefix + " %s", `color: red; background: white; font-size: 1.2em; padding: 4px; border-radius: 2px; font-family: monospace;`);
    }
    get warn() {
        if (!engrid_ENGrid.debug) {
            return () => { };
        }
        return console.warn.bind(window.console, "%c" + this.emoji + " " + this.prefix + " %s", `color: ${this.color}; background: ${this.background}; font-size: 1.2em; padding: 4px; border-radius: 2px; font-family: monospace;`);
    }
    get dir() {
        if (!engrid_ENGrid.debug) {
            return () => { };
        }
        return console.dir.bind(window.console, "%c" + this.emoji + " " + this.prefix + " %s", `color: ${this.color}; background: ${this.background}; font-size: 1.2em; padding: 4px; border-radius: 2px; font-family: monospace;`);
    }
    get error() {
        if (!engrid_ENGrid.debug) {
            return () => { };
        }
        return console.error.bind(window.console, "%c" + this.emoji + " " + this.prefix + " %s", `color: ${this.color}; background: ${this.background}; font-size: 1.2em; padding: 4px; border-radius: 2px; font-family: monospace;`);
    }
}

;// CONCATENATED MODULE: ./node_modules/@4site/engrid-common/dist/index.js
 // Runs first so it can change the DOM markup before any markup dependent code fires

































// Events


;// CONCATENATED MODULE: ./src/scripts/main.js
const customScript = function () {
  console.log("ENGrid client scripts are executing"); // Add your client scripts here
};
;// CONCATENATED MODULE: ./src/index.ts
 // Uses ENGrid via NPM
// import { Options, App } from "../../engrid-scripts/packages/common"; // Uses ENGrid via Visual Studio Workspace



const options = {
  applePay: false,
  CapitalizeFields: true,
  ClickToExpand: true,
  CurrencySymbol: "$",
  DecimalSeparator: ".",
  ThousandsSeparator: ",",
  MediaAttribution: true,
  SkipToMainContentLink: true,
  SrcDefer: true,
  ProgressBar: true,
  Debug: App.getUrlParameter("debug") == "true" ? true : false,
  onLoad: () => customScript(),
  onResize: () => console.log("Starter Theme Window Resized")
};
new App(options);
})();

/******/ })()
;