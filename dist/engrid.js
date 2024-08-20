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
 *  Date: Tuesday, August 20, 2024 @ 14:43:59 ET
 *  By: fernando
 *  ENGrid styles: v0.19.1
 *  ENGrid scripts: v0.19.1
 *
 *  Created by 4Site Studios
 *  Come work with us or join our team, we would love to hear from you
 *  https://www.4sitestudios.com/en
 *
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 3309:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

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

/***/ 8441:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DispatcherBase = void 0;
const __1 = __webpack_require__(4604);
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

/***/ 8901:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

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

/***/ 4004:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

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

/***/ 6580:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PromiseDispatcherBase = void 0;
const __1 = __webpack_require__(4604);
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

/***/ 956:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SubscriptionChangeEventDispatcher = void 0;
const __1 = __webpack_require__(4604);
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

/***/ 6436:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

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

/***/ 3707:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

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

/***/ 6442:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

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

/***/ 4604:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

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
const DispatcherBase_1 = __webpack_require__(8441);
Object.defineProperty(exports, "DispatcherBase", ({ enumerable: true, get: function () { return DispatcherBase_1.DispatcherBase; } }));
const DispatchError_1 = __webpack_require__(3309);
Object.defineProperty(exports, "DispatchError", ({ enumerable: true, get: function () { return DispatchError_1.DispatchError; } }));
const DispatcherWrapper_1 = __webpack_require__(8901);
Object.defineProperty(exports, "DispatcherWrapper", ({ enumerable: true, get: function () { return DispatcherWrapper_1.DispatcherWrapper; } }));
const EventListBase_1 = __webpack_require__(4004);
Object.defineProperty(exports, "EventListBase", ({ enumerable: true, get: function () { return EventListBase_1.EventListBase; } }));
const EventManagement_1 = __webpack_require__(1289);
Object.defineProperty(exports, "EventManagement", ({ enumerable: true, get: function () { return EventManagement_1.EventManagement; } }));
const HandlingBase_1 = __webpack_require__(6442);
Object.defineProperty(exports, "HandlingBase", ({ enumerable: true, get: function () { return HandlingBase_1.HandlingBase; } }));
const PromiseDispatcherBase_1 = __webpack_require__(6580);
Object.defineProperty(exports, "PromiseDispatcherBase", ({ enumerable: true, get: function () { return PromiseDispatcherBase_1.PromiseDispatcherBase; } }));
const PromiseSubscription_1 = __webpack_require__(6436);
Object.defineProperty(exports, "PromiseSubscription", ({ enumerable: true, get: function () { return PromiseSubscription_1.PromiseSubscription; } }));
const Subscription_1 = __webpack_require__(3707);
Object.defineProperty(exports, "Subscription", ({ enumerable: true, get: function () { return Subscription_1.Subscription; } }));
const SubscriptionChangeEventHandler_1 = __webpack_require__(956);
Object.defineProperty(exports, "SubscriptionChangeEventDispatcher", ({ enumerable: true, get: function () { return SubscriptionChangeEventHandler_1.SubscriptionChangeEventDispatcher; } }));


/***/ }),

/***/ 1289:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

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

/***/ 71:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EventDispatcher = void 0;
const ste_core_1 = __webpack_require__(4604);
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

/***/ 2162:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EventHandlingBase = void 0;
const ste_core_1 = __webpack_require__(4604);
const EventList_1 = __webpack_require__(338);
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

/***/ 338:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EventList = void 0;
const ste_core_1 = __webpack_require__(4604);
const EventDispatcher_1 = __webpack_require__(71);
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

/***/ 2293:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NonUniformEventList = void 0;
const EventDispatcher_1 = __webpack_require__(71);
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

/***/ 4214:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

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
const EventDispatcher_1 = __webpack_require__(71);
Object.defineProperty(exports, "EventDispatcher", ({ enumerable: true, get: function () { return EventDispatcher_1.EventDispatcher; } }));
const EventHandlingBase_1 = __webpack_require__(2162);
Object.defineProperty(exports, "EventHandlingBase", ({ enumerable: true, get: function () { return EventHandlingBase_1.EventHandlingBase; } }));
const EventList_1 = __webpack_require__(338);
Object.defineProperty(exports, "EventList", ({ enumerable: true, get: function () { return EventList_1.EventList; } }));
const NonUniformEventList_1 = __webpack_require__(2293);
Object.defineProperty(exports, "NonUniformEventList", ({ enumerable: true, get: function () { return NonUniformEventList_1.NonUniformEventList; } }));


/***/ }),

/***/ 2725:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SignalDispatcher = void 0;
const ste_core_1 = __webpack_require__(4604);
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

/***/ 7936:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SignalHandlingBase = void 0;
const ste_core_1 = __webpack_require__(4604);
const _1 = __webpack_require__(5010);
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

/***/ 1064:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SignalList = void 0;
const ste_core_1 = __webpack_require__(4604);
const _1 = __webpack_require__(5010);
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

/***/ 5010:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

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
const SignalDispatcher_1 = __webpack_require__(2725);
Object.defineProperty(exports, "SignalDispatcher", ({ enumerable: true, get: function () { return SignalDispatcher_1.SignalDispatcher; } }));
const SignalHandlingBase_1 = __webpack_require__(7936);
Object.defineProperty(exports, "SignalHandlingBase", ({ enumerable: true, get: function () { return SignalHandlingBase_1.SignalHandlingBase; } }));
const SignalList_1 = __webpack_require__(1064);
Object.defineProperty(exports, "SignalList", ({ enumerable: true, get: function () { return SignalList_1.SignalList; } }));


/***/ }),

/***/ 7376:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NonUniformSimpleEventList = void 0;
const SimpleEventDispatcher_1 = __webpack_require__(9606);
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

/***/ 9606:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SimpleEventDispatcher = void 0;
const ste_core_1 = __webpack_require__(4604);
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

/***/ 4763:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SimpleEventHandlingBase = void 0;
const ste_core_1 = __webpack_require__(4604);
const SimpleEventList_1 = __webpack_require__(2175);
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

/***/ 2175:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SimpleEventList = void 0;
const ste_core_1 = __webpack_require__(4604);
const SimpleEventDispatcher_1 = __webpack_require__(9606);
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

/***/ 6569:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NonUniformSimpleEventList = exports.SimpleEventList = exports.SimpleEventHandlingBase = exports.SimpleEventDispatcher = void 0;
const SimpleEventDispatcher_1 = __webpack_require__(9606);
Object.defineProperty(exports, "SimpleEventDispatcher", ({ enumerable: true, get: function () { return SimpleEventDispatcher_1.SimpleEventDispatcher; } }));
const SimpleEventHandlingBase_1 = __webpack_require__(4763);
Object.defineProperty(exports, "SimpleEventHandlingBase", ({ enumerable: true, get: function () { return SimpleEventHandlingBase_1.SimpleEventHandlingBase; } }));
const NonUniformSimpleEventList_1 = __webpack_require__(7376);
Object.defineProperty(exports, "NonUniformSimpleEventList", ({ enumerable: true, get: function () { return NonUniformSimpleEventList_1.NonUniformSimpleEventList; } }));
const SimpleEventList_1 = __webpack_require__(2175);
Object.defineProperty(exports, "SimpleEventList", ({ enumerable: true, get: function () { return SimpleEventList_1.SimpleEventList; } }));


/***/ }),

/***/ 3199:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
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
__webpack_unused_export__ = __webpack_unused_export__ = __webpack_unused_export__ = __webpack_unused_export__ = __webpack_unused_export__ = __webpack_unused_export__ = __webpack_unused_export__ = __webpack_unused_export__ = __webpack_unused_export__ = __webpack_unused_export__ = __webpack_unused_export__ = __webpack_unused_export__ = __webpack_unused_export__ = exports.UD = __webpack_unused_export__ = __webpack_unused_export__ = __webpack_unused_export__ = exports.IL = __webpack_unused_export__ = __webpack_unused_export__ = __webpack_unused_export__ = __webpack_unused_export__ = __webpack_unused_export__ = __webpack_unused_export__ = __webpack_unused_export__ = __webpack_unused_export__ = __webpack_unused_export__ = __webpack_unused_export__ = __webpack_unused_export__ = __webpack_unused_export__ = __webpack_unused_export__ = void 0;
var ste_core_1 = __webpack_require__(4604);
__webpack_unused_export__ = ({ enumerable: true, get: function () { return ste_core_1.Subscription; } });
__webpack_unused_export__ = ({ enumerable: true, get: function () { return ste_core_1.DispatcherBase; } });
__webpack_unused_export__ = ({ enumerable: true, get: function () { return ste_core_1.DispatcherWrapper; } });
__webpack_unused_export__ = ({ enumerable: true, get: function () { return ste_core_1.EventListBase; } });
__webpack_unused_export__ = ({ enumerable: true, get: function () { return ste_core_1.EventManagement; } });
__webpack_unused_export__ = ({ enumerable: true, get: function () { return ste_core_1.DispatchError; } });
__webpack_unused_export__ = ({ enumerable: true, get: function () { return ste_core_1.PromiseSubscription; } });
__webpack_unused_export__ = ({ enumerable: true, get: function () { return ste_core_1.PromiseDispatcherBase; } });
__webpack_unused_export__ = ({ enumerable: true, get: function () { return ste_core_1.HandlingBase; } });
var ste_events_1 = __webpack_require__(4214);
__webpack_unused_export__ = ({ enumerable: true, get: function () { return ste_events_1.EventDispatcher; } });
__webpack_unused_export__ = ({ enumerable: true, get: function () { return ste_events_1.EventHandlingBase; } });
__webpack_unused_export__ = ({ enumerable: true, get: function () { return ste_events_1.EventList; } });
__webpack_unused_export__ = ({ enumerable: true, get: function () { return ste_events_1.NonUniformEventList; } });
var ste_simple_events_1 = __webpack_require__(6569);
Object.defineProperty(exports, "IL", ({ enumerable: true, get: function () { return ste_simple_events_1.SimpleEventDispatcher; } }));
__webpack_unused_export__ = ({ enumerable: true, get: function () { return ste_simple_events_1.SimpleEventHandlingBase; } });
__webpack_unused_export__ = ({ enumerable: true, get: function () { return ste_simple_events_1.SimpleEventList; } });
__webpack_unused_export__ = ({ enumerable: true, get: function () { return ste_simple_events_1.NonUniformSimpleEventList; } });
var ste_signals_1 = __webpack_require__(5010);
Object.defineProperty(exports, "UD", ({ enumerable: true, get: function () { return ste_signals_1.SignalDispatcher; } }));
__webpack_unused_export__ = ({ enumerable: true, get: function () { return ste_signals_1.SignalHandlingBase; } });
__webpack_unused_export__ = ({ enumerable: true, get: function () { return ste_signals_1.SignalList; } });
var ste_promise_events_1 = __webpack_require__(606);
__webpack_unused_export__ = ({ enumerable: true, get: function () { return ste_promise_events_1.PromiseEventDispatcher; } });
__webpack_unused_export__ = ({ enumerable: true, get: function () { return ste_promise_events_1.PromiseEventHandlingBase; } });
__webpack_unused_export__ = ({ enumerable: true, get: function () { return ste_promise_events_1.PromiseEventList; } });
__webpack_unused_export__ = ({ enumerable: true, get: function () { return ste_promise_events_1.NonUniformPromiseEventList; } });
var ste_promise_signals_1 = __webpack_require__(6042);
__webpack_unused_export__ = ({ enumerable: true, get: function () { return ste_promise_signals_1.PromiseSignalDispatcher; } });
__webpack_unused_export__ = ({ enumerable: true, get: function () { return ste_promise_signals_1.PromiseSignalHandlingBase; } });
__webpack_unused_export__ = ({ enumerable: true, get: function () { return ste_promise_signals_1.PromiseSignalList; } });
var ste_promise_simple_events_1 = __webpack_require__(4225);
__webpack_unused_export__ = ({ enumerable: true, get: function () { return ste_promise_simple_events_1.PromiseSimpleEventDispatcher; } });
__webpack_unused_export__ = ({ enumerable: true, get: function () { return ste_promise_simple_events_1.PromiseSimpleEventHandlingBase; } });
__webpack_unused_export__ = ({ enumerable: true, get: function () { return ste_promise_simple_events_1.PromiseSimpleEventList; } });
__webpack_unused_export__ = ({ enumerable: true, get: function () { return ste_promise_simple_events_1.NonUniformPromiseSimpleEventList; } });


/***/ }),

/***/ 7391:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// A library of seedable RNGs implemented in Javascript.
//
// Usage:
//
// var seedrandom = require('seedrandom');
// var random = seedrandom(1); // or any seed.
// var x = random();       // 0 <= x < 1.  Every bit is random.
// var x = random.quick(); // 0 <= x < 1.  32 bits of randomness.

// alea, a 53-bit multiply-with-carry generator by Johannes Baagøe.
// Period: ~2^116
// Reported to pass all BigCrush tests.
var alea = __webpack_require__(7180);

// xor128, a pure xor-shift generator by George Marsaglia.
// Period: 2^128-1.
// Reported to fail: MatrixRank and LinearComp.
var xor128 = __webpack_require__(3181);

// xorwow, George Marsaglia's 160-bit xor-shift combined plus weyl.
// Period: 2^192-2^32
// Reported to fail: CollisionOver, SimpPoker, and LinearComp.
var xorwow = __webpack_require__(3031);

// xorshift7, by François Panneton and Pierre L'ecuyer, takes
// a different approach: it adds robustness by allowing more shifts
// than Marsaglia's original three.  It is a 7-shift generator
// with 256 bits, that passes BigCrush with no systmatic failures.
// Period 2^256-1.
// No systematic BigCrush failures reported.
var xorshift7 = __webpack_require__(9067);

// xor4096, by Richard Brent, is a 4096-bit xor-shift with a
// very long period that also adds a Weyl generator. It also passes
// BigCrush with no systematic failures.  Its long period may
// be useful if you have many generators and need to avoid
// collisions.
// Period: 2^4128-2^32.
// No systematic BigCrush failures reported.
var xor4096 = __webpack_require__(6833);

// Tyche-i, by Samuel Neves and Filipe Araujo, is a bit-shifting random
// number generator derived from ChaCha, a modern stream cipher.
// https://eden.dei.uc.pt/~sneves/pubs/2011-snfa2.pdf
// Period: ~2^127
// No systematic BigCrush failures reported.
var tychei = __webpack_require__(3717);

// The original ARC4-based prng included in this library.
// Period: ~2^1600
var sr = __webpack_require__(4801);

sr.alea = alea;
sr.xor128 = xor128;
sr.xorwow = xorwow;
sr.xorshift7 = xorshift7;
sr.xor4096 = xor4096;
sr.tychei = tychei;

module.exports = sr;


/***/ }),

/***/ 7180:
/***/ (function(module, exports, __webpack_require__) {

/* module decorator */ module = __webpack_require__.nmd(module);
var __WEBPACK_AMD_DEFINE_RESULT__;// A port of an algorithm by Johannes Baagøe <baagoe@baagoe.com>, 2010
// http://baagoe.com/en/RandomMusings/javascript/
// https://github.com/nquinlan/better-random-numbers-for-javascript-mirror
// Original work is under MIT license -

// Copyright (C) 2010 by Johannes Baagøe <baagoe@baagoe.org>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.



(function(global, module, define) {

function Alea(seed) {
  var me = this, mash = Mash();

  me.next = function() {
    var t = 2091639 * me.s0 + me.c * 2.3283064365386963e-10; // 2^-32
    me.s0 = me.s1;
    me.s1 = me.s2;
    return me.s2 = t - (me.c = t | 0);
  };

  // Apply the seeding algorithm from Baagoe.
  me.c = 1;
  me.s0 = mash(' ');
  me.s1 = mash(' ');
  me.s2 = mash(' ');
  me.s0 -= mash(seed);
  if (me.s0 < 0) { me.s0 += 1; }
  me.s1 -= mash(seed);
  if (me.s1 < 0) { me.s1 += 1; }
  me.s2 -= mash(seed);
  if (me.s2 < 0) { me.s2 += 1; }
  mash = null;
}

function copy(f, t) {
  t.c = f.c;
  t.s0 = f.s0;
  t.s1 = f.s1;
  t.s2 = f.s2;
  return t;
}

function impl(seed, opts) {
  var xg = new Alea(seed),
      state = opts && opts.state,
      prng = xg.next;
  prng.int32 = function() { return (xg.next() * 0x100000000) | 0; }
  prng.double = function() {
    return prng() + (prng() * 0x200000 | 0) * 1.1102230246251565e-16; // 2^-53
  };
  prng.quick = prng;
  if (state) {
    if (typeof(state) == 'object') copy(state, xg);
    prng.state = function() { return copy(xg, {}); }
  }
  return prng;
}

function Mash() {
  var n = 0xefc8249d;

  var mash = function(data) {
    data = data.toString();
    for (var i = 0; i < data.length; i++) {
      n += data.charCodeAt(i);
      var h = 0.02519603282416938 * n;
      n = h >>> 0;
      h -= n;
      h *= n;
      n = h >>> 0;
      h -= n;
      n += h * 0x100000000; // 2^32
    }
    return (n >>> 0) * 2.3283064365386963e-10; // 2^-32
  };

  return mash;
}


if (module && module.exports) {
  module.exports = impl;
} else if (__webpack_require__.amdD && __webpack_require__.amdO) {
  !(__WEBPACK_AMD_DEFINE_RESULT__ = (function() { return impl; }).call(exports, __webpack_require__, exports, module),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
} else {
  this.alea = impl;
}

})(
  this,
   true && module,    // present in node.js
  __webpack_require__.amdD   // present with an AMD loader
);




/***/ }),

/***/ 3717:
/***/ (function(module, exports, __webpack_require__) {

/* module decorator */ module = __webpack_require__.nmd(module);
var __WEBPACK_AMD_DEFINE_RESULT__;// A Javascript implementaion of the "Tyche-i" prng algorithm by
// Samuel Neves and Filipe Araujo.
// See https://eden.dei.uc.pt/~sneves/pubs/2011-snfa2.pdf

(function(global, module, define) {

function XorGen(seed) {
  var me = this, strseed = '';

  // Set up generator function.
  me.next = function() {
    var b = me.b, c = me.c, d = me.d, a = me.a;
    b = (b << 25) ^ (b >>> 7) ^ c;
    c = (c - d) | 0;
    d = (d << 24) ^ (d >>> 8) ^ a;
    a = (a - b) | 0;
    me.b = b = (b << 20) ^ (b >>> 12) ^ c;
    me.c = c = (c - d) | 0;
    me.d = (d << 16) ^ (c >>> 16) ^ a;
    return me.a = (a - b) | 0;
  };

  /* The following is non-inverted tyche, which has better internal
   * bit diffusion, but which is about 25% slower than tyche-i in JS.
  me.next = function() {
    var a = me.a, b = me.b, c = me.c, d = me.d;
    a = (me.a + me.b | 0) >>> 0;
    d = me.d ^ a; d = d << 16 ^ d >>> 16;
    c = me.c + d | 0;
    b = me.b ^ c; b = b << 12 ^ d >>> 20;
    me.a = a = a + b | 0;
    d = d ^ a; me.d = d = d << 8 ^ d >>> 24;
    me.c = c = c + d | 0;
    b = b ^ c;
    return me.b = (b << 7 ^ b >>> 25);
  }
  */

  me.a = 0;
  me.b = 0;
  me.c = 2654435769 | 0;
  me.d = 1367130551;

  if (seed === Math.floor(seed)) {
    // Integer seed.
    me.a = (seed / 0x100000000) | 0;
    me.b = seed | 0;
  } else {
    // String seed.
    strseed += seed;
  }

  // Mix in string seed, then discard an initial batch of 64 values.
  for (var k = 0; k < strseed.length + 20; k++) {
    me.b ^= strseed.charCodeAt(k) | 0;
    me.next();
  }
}

function copy(f, t) {
  t.a = f.a;
  t.b = f.b;
  t.c = f.c;
  t.d = f.d;
  return t;
};

function impl(seed, opts) {
  var xg = new XorGen(seed),
      state = opts && opts.state,
      prng = function() { return (xg.next() >>> 0) / 0x100000000; };
  prng.double = function() {
    do {
      var top = xg.next() >>> 11,
          bot = (xg.next() >>> 0) / 0x100000000,
          result = (top + bot) / (1 << 21);
    } while (result === 0);
    return result;
  };
  prng.int32 = xg.next;
  prng.quick = prng;
  if (state) {
    if (typeof(state) == 'object') copy(state, xg);
    prng.state = function() { return copy(xg, {}); }
  }
  return prng;
}

if (module && module.exports) {
  module.exports = impl;
} else if (__webpack_require__.amdD && __webpack_require__.amdO) {
  !(__WEBPACK_AMD_DEFINE_RESULT__ = (function() { return impl; }).call(exports, __webpack_require__, exports, module),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
} else {
  this.tychei = impl;
}

})(
  this,
   true && module,    // present in node.js
  __webpack_require__.amdD   // present with an AMD loader
);




/***/ }),

/***/ 3181:
/***/ (function(module, exports, __webpack_require__) {

/* module decorator */ module = __webpack_require__.nmd(module);
var __WEBPACK_AMD_DEFINE_RESULT__;// A Javascript implementaion of the "xor128" prng algorithm by
// George Marsaglia.  See http://www.jstatsoft.org/v08/i14/paper

(function(global, module, define) {

function XorGen(seed) {
  var me = this, strseed = '';

  me.x = 0;
  me.y = 0;
  me.z = 0;
  me.w = 0;

  // Set up generator function.
  me.next = function() {
    var t = me.x ^ (me.x << 11);
    me.x = me.y;
    me.y = me.z;
    me.z = me.w;
    return me.w ^= (me.w >>> 19) ^ t ^ (t >>> 8);
  };

  if (seed === (seed | 0)) {
    // Integer seed.
    me.x = seed;
  } else {
    // String seed.
    strseed += seed;
  }

  // Mix in string seed, then discard an initial batch of 64 values.
  for (var k = 0; k < strseed.length + 64; k++) {
    me.x ^= strseed.charCodeAt(k) | 0;
    me.next();
  }
}

function copy(f, t) {
  t.x = f.x;
  t.y = f.y;
  t.z = f.z;
  t.w = f.w;
  return t;
}

function impl(seed, opts) {
  var xg = new XorGen(seed),
      state = opts && opts.state,
      prng = function() { return (xg.next() >>> 0) / 0x100000000; };
  prng.double = function() {
    do {
      var top = xg.next() >>> 11,
          bot = (xg.next() >>> 0) / 0x100000000,
          result = (top + bot) / (1 << 21);
    } while (result === 0);
    return result;
  };
  prng.int32 = xg.next;
  prng.quick = prng;
  if (state) {
    if (typeof(state) == 'object') copy(state, xg);
    prng.state = function() { return copy(xg, {}); }
  }
  return prng;
}

if (module && module.exports) {
  module.exports = impl;
} else if (__webpack_require__.amdD && __webpack_require__.amdO) {
  !(__WEBPACK_AMD_DEFINE_RESULT__ = (function() { return impl; }).call(exports, __webpack_require__, exports, module),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
} else {
  this.xor128 = impl;
}

})(
  this,
   true && module,    // present in node.js
  __webpack_require__.amdD   // present with an AMD loader
);




/***/ }),

/***/ 6833:
/***/ (function(module, exports, __webpack_require__) {

/* module decorator */ module = __webpack_require__.nmd(module);
var __WEBPACK_AMD_DEFINE_RESULT__;// A Javascript implementaion of Richard Brent's Xorgens xor4096 algorithm.
//
// This fast non-cryptographic random number generator is designed for
// use in Monte-Carlo algorithms. It combines a long-period xorshift
// generator with a Weyl generator, and it passes all common batteries
// of stasticial tests for randomness while consuming only a few nanoseconds
// for each prng generated.  For background on the generator, see Brent's
// paper: "Some long-period random number generators using shifts and xors."
// http://arxiv.org/pdf/1004.3115v1.pdf
//
// Usage:
//
// var xor4096 = require('xor4096');
// random = xor4096(1);                        // Seed with int32 or string.
// assert.equal(random(), 0.1520436450538547); // (0, 1) range, 53 bits.
// assert.equal(random.int32(), 1806534897);   // signed int32, 32 bits.
//
// For nonzero numeric keys, this impelementation provides a sequence
// identical to that by Brent's xorgens 3 implementaion in C.  This
// implementation also provides for initalizing the generator with
// string seeds, or for saving and restoring the state of the generator.
//
// On Chrome, this prng benchmarks about 2.1 times slower than
// Javascript's built-in Math.random().

(function(global, module, define) {

function XorGen(seed) {
  var me = this;

  // Set up generator function.
  me.next = function() {
    var w = me.w,
        X = me.X, i = me.i, t, v;
    // Update Weyl generator.
    me.w = w = (w + 0x61c88647) | 0;
    // Update xor generator.
    v = X[(i + 34) & 127];
    t = X[i = ((i + 1) & 127)];
    v ^= v << 13;
    t ^= t << 17;
    v ^= v >>> 15;
    t ^= t >>> 12;
    // Update Xor generator array state.
    v = X[i] = v ^ t;
    me.i = i;
    // Result is the combination.
    return (v + (w ^ (w >>> 16))) | 0;
  };

  function init(me, seed) {
    var t, v, i, j, w, X = [], limit = 128;
    if (seed === (seed | 0)) {
      // Numeric seeds initialize v, which is used to generates X.
      v = seed;
      seed = null;
    } else {
      // String seeds are mixed into v and X one character at a time.
      seed = seed + '\0';
      v = 0;
      limit = Math.max(limit, seed.length);
    }
    // Initialize circular array and weyl value.
    for (i = 0, j = -32; j < limit; ++j) {
      // Put the unicode characters into the array, and shuffle them.
      if (seed) v ^= seed.charCodeAt((j + 32) % seed.length);
      // After 32 shuffles, take v as the starting w value.
      if (j === 0) w = v;
      v ^= v << 10;
      v ^= v >>> 15;
      v ^= v << 4;
      v ^= v >>> 13;
      if (j >= 0) {
        w = (w + 0x61c88647) | 0;     // Weyl.
        t = (X[j & 127] ^= (v + w));  // Combine xor and weyl to init array.
        i = (0 == t) ? i + 1 : 0;     // Count zeroes.
      }
    }
    // We have detected all zeroes; make the key nonzero.
    if (i >= 128) {
      X[(seed && seed.length || 0) & 127] = -1;
    }
    // Run the generator 512 times to further mix the state before using it.
    // Factoring this as a function slows the main generator, so it is just
    // unrolled here.  The weyl generator is not advanced while warming up.
    i = 127;
    for (j = 4 * 128; j > 0; --j) {
      v = X[(i + 34) & 127];
      t = X[i = ((i + 1) & 127)];
      v ^= v << 13;
      t ^= t << 17;
      v ^= v >>> 15;
      t ^= t >>> 12;
      X[i] = v ^ t;
    }
    // Storing state as object members is faster than using closure variables.
    me.w = w;
    me.X = X;
    me.i = i;
  }

  init(me, seed);
}

function copy(f, t) {
  t.i = f.i;
  t.w = f.w;
  t.X = f.X.slice();
  return t;
};

function impl(seed, opts) {
  if (seed == null) seed = +(new Date);
  var xg = new XorGen(seed),
      state = opts && opts.state,
      prng = function() { return (xg.next() >>> 0) / 0x100000000; };
  prng.double = function() {
    do {
      var top = xg.next() >>> 11,
          bot = (xg.next() >>> 0) / 0x100000000,
          result = (top + bot) / (1 << 21);
    } while (result === 0);
    return result;
  };
  prng.int32 = xg.next;
  prng.quick = prng;
  if (state) {
    if (state.X) copy(state, xg);
    prng.state = function() { return copy(xg, {}); }
  }
  return prng;
}

if (module && module.exports) {
  module.exports = impl;
} else if (__webpack_require__.amdD && __webpack_require__.amdO) {
  !(__WEBPACK_AMD_DEFINE_RESULT__ = (function() { return impl; }).call(exports, __webpack_require__, exports, module),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
} else {
  this.xor4096 = impl;
}

})(
  this,                                     // window object or global
   true && module,    // present in node.js
  __webpack_require__.amdD   // present with an AMD loader
);


/***/ }),

/***/ 9067:
/***/ (function(module, exports, __webpack_require__) {

/* module decorator */ module = __webpack_require__.nmd(module);
var __WEBPACK_AMD_DEFINE_RESULT__;// A Javascript implementaion of the "xorshift7" algorithm by
// François Panneton and Pierre L'ecuyer:
// "On the Xorgshift Random Number Generators"
// http://saluc.engr.uconn.edu/refs/crypto/rng/panneton05onthexorshift.pdf

(function(global, module, define) {

function XorGen(seed) {
  var me = this;

  // Set up generator function.
  me.next = function() {
    // Update xor generator.
    var X = me.x, i = me.i, t, v, w;
    t = X[i]; t ^= (t >>> 7); v = t ^ (t << 24);
    t = X[(i + 1) & 7]; v ^= t ^ (t >>> 10);
    t = X[(i + 3) & 7]; v ^= t ^ (t >>> 3);
    t = X[(i + 4) & 7]; v ^= t ^ (t << 7);
    t = X[(i + 7) & 7]; t = t ^ (t << 13); v ^= t ^ (t << 9);
    X[i] = v;
    me.i = (i + 1) & 7;
    return v;
  };

  function init(me, seed) {
    var j, w, X = [];

    if (seed === (seed | 0)) {
      // Seed state array using a 32-bit integer.
      w = X[0] = seed;
    } else {
      // Seed state using a string.
      seed = '' + seed;
      for (j = 0; j < seed.length; ++j) {
        X[j & 7] = (X[j & 7] << 15) ^
            (seed.charCodeAt(j) + X[(j + 1) & 7] << 13);
      }
    }
    // Enforce an array length of 8, not all zeroes.
    while (X.length < 8) X.push(0);
    for (j = 0; j < 8 && X[j] === 0; ++j);
    if (j == 8) w = X[7] = -1; else w = X[j];

    me.x = X;
    me.i = 0;

    // Discard an initial 256 values.
    for (j = 256; j > 0; --j) {
      me.next();
    }
  }

  init(me, seed);
}

function copy(f, t) {
  t.x = f.x.slice();
  t.i = f.i;
  return t;
}

function impl(seed, opts) {
  if (seed == null) seed = +(new Date);
  var xg = new XorGen(seed),
      state = opts && opts.state,
      prng = function() { return (xg.next() >>> 0) / 0x100000000; };
  prng.double = function() {
    do {
      var top = xg.next() >>> 11,
          bot = (xg.next() >>> 0) / 0x100000000,
          result = (top + bot) / (1 << 21);
    } while (result === 0);
    return result;
  };
  prng.int32 = xg.next;
  prng.quick = prng;
  if (state) {
    if (state.x) copy(state, xg);
    prng.state = function() { return copy(xg, {}); }
  }
  return prng;
}

if (module && module.exports) {
  module.exports = impl;
} else if (__webpack_require__.amdD && __webpack_require__.amdO) {
  !(__WEBPACK_AMD_DEFINE_RESULT__ = (function() { return impl; }).call(exports, __webpack_require__, exports, module),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
} else {
  this.xorshift7 = impl;
}

})(
  this,
   true && module,    // present in node.js
  __webpack_require__.amdD   // present with an AMD loader
);



/***/ }),

/***/ 3031:
/***/ (function(module, exports, __webpack_require__) {

/* module decorator */ module = __webpack_require__.nmd(module);
var __WEBPACK_AMD_DEFINE_RESULT__;// A Javascript implementaion of the "xorwow" prng algorithm by
// George Marsaglia.  See http://www.jstatsoft.org/v08/i14/paper

(function(global, module, define) {

function XorGen(seed) {
  var me = this, strseed = '';

  // Set up generator function.
  me.next = function() {
    var t = (me.x ^ (me.x >>> 2));
    me.x = me.y; me.y = me.z; me.z = me.w; me.w = me.v;
    return (me.d = (me.d + 362437 | 0)) +
       (me.v = (me.v ^ (me.v << 4)) ^ (t ^ (t << 1))) | 0;
  };

  me.x = 0;
  me.y = 0;
  me.z = 0;
  me.w = 0;
  me.v = 0;

  if (seed === (seed | 0)) {
    // Integer seed.
    me.x = seed;
  } else {
    // String seed.
    strseed += seed;
  }

  // Mix in string seed, then discard an initial batch of 64 values.
  for (var k = 0; k < strseed.length + 64; k++) {
    me.x ^= strseed.charCodeAt(k) | 0;
    if (k == strseed.length) {
      me.d = me.x << 10 ^ me.x >>> 4;
    }
    me.next();
  }
}

function copy(f, t) {
  t.x = f.x;
  t.y = f.y;
  t.z = f.z;
  t.w = f.w;
  t.v = f.v;
  t.d = f.d;
  return t;
}

function impl(seed, opts) {
  var xg = new XorGen(seed),
      state = opts && opts.state,
      prng = function() { return (xg.next() >>> 0) / 0x100000000; };
  prng.double = function() {
    do {
      var top = xg.next() >>> 11,
          bot = (xg.next() >>> 0) / 0x100000000,
          result = (top + bot) / (1 << 21);
    } while (result === 0);
    return result;
  };
  prng.int32 = xg.next;
  prng.quick = prng;
  if (state) {
    if (typeof(state) == 'object') copy(state, xg);
    prng.state = function() { return copy(xg, {}); }
  }
  return prng;
}

if (module && module.exports) {
  module.exports = impl;
} else if (__webpack_require__.amdD && __webpack_require__.amdO) {
  !(__WEBPACK_AMD_DEFINE_RESULT__ = (function() { return impl; }).call(exports, __webpack_require__, exports, module),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
} else {
  this.xorwow = impl;
}

})(
  this,
   true && module,    // present in node.js
  __webpack_require__.amdD   // present with an AMD loader
);




/***/ }),

/***/ 4801:
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_RESULT__;/*
Copyright 2014 David Bau.

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/

(function (pool, math) {
//
// The following constants are related to IEEE 754 limits.
//

// Detect the global object, even if operating in strict mode.
// http://stackoverflow.com/a/14387057/265298
var global = (0, eval)('this'),
    width = 256,        // each RC4 output is 0 <= x < 256
    chunks = 6,         // at least six RC4 outputs for each double
    digits = 52,        // there are 52 significant digits in a double
    rngname = 'random', // rngname: name for Math.random and Math.seedrandom
    startdenom = math.pow(width, chunks),
    significance = math.pow(2, digits),
    overflow = significance * 2,
    mask = width - 1,
    nodecrypto;         // node.js crypto module, initialized at the bottom.

//
// seedrandom()
// This is the seedrandom function described above.
//
function seedrandom(seed, options, callback) {
  var key = [];
  options = (options == true) ? { entropy: true } : (options || {});

  // Flatten the seed string or build one from local entropy if needed.
  var shortseed = mixkey(flatten(
    options.entropy ? [seed, tostring(pool)] :
    (seed == null) ? autoseed() : seed, 3), key);

  // Use the seed to initialize an ARC4 generator.
  var arc4 = new ARC4(key);

  // This function returns a random double in [0, 1) that contains
  // randomness in every bit of the mantissa of the IEEE 754 value.
  var prng = function() {
    var n = arc4.g(chunks),             // Start with a numerator n < 2 ^ 48
        d = startdenom,                 //   and denominator d = 2 ^ 48.
        x = 0;                          //   and no 'extra last byte'.
    while (n < significance) {          // Fill up all significant digits by
      n = (n + x) * width;              //   shifting numerator and
      d *= width;                       //   denominator and generating a
      x = arc4.g(1);                    //   new least-significant-byte.
    }
    while (n >= overflow) {             // To avoid rounding up, before adding
      n /= 2;                           //   last byte, shift everything
      d /= 2;                           //   right using integer math until
      x >>>= 1;                         //   we have exactly the desired bits.
    }
    return (n + x) / d;                 // Form the number within [0, 1).
  };

  prng.int32 = function() { return arc4.g(4) | 0; }
  prng.quick = function() { return arc4.g(4) / 0x100000000; }
  prng.double = prng;

  // Mix the randomness into accumulated entropy.
  mixkey(tostring(arc4.S), pool);

  // Calling convention: what to return as a function of prng, seed, is_math.
  return (options.pass || callback ||
      function(prng, seed, is_math_call, state) {
        if (state) {
          // Load the arc4 state from the given state if it has an S array.
          if (state.S) { copy(state, arc4); }
          // Only provide the .state method if requested via options.state.
          prng.state = function() { return copy(arc4, {}); }
        }

        // If called as a method of Math (Math.seedrandom()), mutate
        // Math.random because that is how seedrandom.js has worked since v1.0.
        if (is_math_call) { math[rngname] = prng; return seed; }

        // Otherwise, it is a newer calling convention, so return the
        // prng directly.
        else return prng;
      })(
  prng,
  shortseed,
  'global' in options ? options.global : (this == math),
  options.state);
}
math['seed' + rngname] = seedrandom;

//
// ARC4
//
// An ARC4 implementation.  The constructor takes a key in the form of
// an array of at most (width) integers that should be 0 <= x < (width).
//
// The g(count) method returns a pseudorandom integer that concatenates
// the next (count) outputs from ARC4.  Its return value is a number x
// that is in the range 0 <= x < (width ^ count).
//
function ARC4(key) {
  var t, keylen = key.length,
      me = this, i = 0, j = me.i = me.j = 0, s = me.S = [];

  // The empty key [] is treated as [0].
  if (!keylen) { key = [keylen++]; }

  // Set up S using the standard key scheduling algorithm.
  while (i < width) {
    s[i] = i++;
  }
  for (i = 0; i < width; i++) {
    s[i] = s[j = mask & (j + key[i % keylen] + (t = s[i]))];
    s[j] = t;
  }

  // The "g" method returns the next (count) outputs as one number.
  (me.g = function(count) {
    // Using instance members instead of closure state nearly doubles speed.
    var t, r = 0,
        i = me.i, j = me.j, s = me.S;
    while (count--) {
      t = s[i = mask & (i + 1)];
      r = r * width + s[mask & ((s[i] = s[j = mask & (j + t)]) + (s[j] = t))];
    }
    me.i = i; me.j = j;
    return r;
    // For robust unpredictability, the function call below automatically
    // discards an initial batch of values.  This is called RC4-drop[256].
    // See http://google.com/search?q=rsa+fluhrer+response&btnI
  })(width);
}

//
// copy()
// Copies internal state of ARC4 to or from a plain object.
//
function copy(f, t) {
  t.i = f.i;
  t.j = f.j;
  t.S = f.S.slice();
  return t;
};

//
// flatten()
// Converts an object tree to nested arrays of strings.
//
function flatten(obj, depth) {
  var result = [], typ = (typeof obj), prop;
  if (depth && typ == 'object') {
    for (prop in obj) {
      try { result.push(flatten(obj[prop], depth - 1)); } catch (e) {}
    }
  }
  return (result.length ? result : typ == 'string' ? obj : obj + '\0');
}

//
// mixkey()
// Mixes a string seed into a key that is an array of integers, and
// returns a shortened string seed that is equivalent to the result key.
//
function mixkey(seed, key) {
  var stringseed = seed + '', smear, j = 0;
  while (j < stringseed.length) {
    key[mask & j] =
      mask & ((smear ^= key[mask & j] * 19) + stringseed.charCodeAt(j++));
  }
  return tostring(key);
}

//
// autoseed()
// Returns an object for autoseeding, using window.crypto and Node crypto
// module if available.
//
function autoseed() {
  try {
    var out;
    if (nodecrypto && (out = nodecrypto.randomBytes)) {
      // The use of 'out' to remember randomBytes makes tight minified code.
      out = out(width);
    } else {
      out = new Uint8Array(width);
      (global.crypto || global.msCrypto).getRandomValues(out);
    }
    return tostring(out);
  } catch (e) {
    var browser = global.navigator,
        plugins = browser && browser.plugins;
    return [+new Date, global, plugins, global.screen, tostring(pool)];
  }
}

//
// tostring()
// Converts an array of charcodes to a string
//
function tostring(a) {
  return String.fromCharCode.apply(0, a);
}

//
// When seedrandom.js is loaded, we immediately mix a few bits
// from the built-in RNG into the entropy pool.  Because we do
// not want to interfere with deterministic PRNG state later,
// seedrandom will not call math.random on its own again after
// initialization.
//
mixkey(math.random(), pool);

//
// Nodejs and AMD support: export the implementation as a module using
// either convention.
//
if ( true && module.exports) {
  module.exports = seedrandom;
  // When in node.js, try using crypto package for autoseeding.
  try {
    nodecrypto = __webpack_require__(1234);
  } catch (ex) {}
} else if (true) {
  !(__WEBPACK_AMD_DEFINE_RESULT__ = (function() { return seedrandom; }).call(exports, __webpack_require__, exports, module),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
}

// End anonymous scope, and pass initial values.
})(
  [],     // pool: entropy pool starts empty
  Math    // math: package containing random, pow, and seedrandom
);


/***/ }),

/***/ 3184:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var seedrandom = __webpack_require__(7391);
var self = __webpack_require__(2287);

module.exports = self;



/***/ }),

/***/ 2287:
/***/ (function(module) {

;(function() {
	var self = {};

	if(Math.seedrandom) seedrandom = Math.seedrandom;

	var isArray = function($){
		return Object.prototype.toString.call( $ ) === '[object Array]'
	}

	var extend = function(obj) {
		for (var i = 1; i < arguments.length; i++) for (var key in arguments[i]) obj[key] = arguments[i][key];
		return obj;
	}

	var seedify = function(seed){
		if (/(number|string)/i.test(Object.prototype.toString.call(seed).match(/^\[object (.*)\]$/)[1])) return seed;
		if (isNaN(seed)) return Number(String((this.strSeed = seed)).split('').map(function(x){return x.charCodeAt(0)}).join(''));
		return seed;
	}

	var seedRand = function(func,min,max){
		return Math.floor(func() * (max - min + 1)) + min;
	}

	self.shuffle = function(arr,seed){
		if (!isArray(arr)) return null;
		seed = seedify(seed) || 'none';

		var size = arr.length;
		var rng = seedrandom(seed);
		var resp = [];
		var keys = [];

		for(var i=0;i<size;i++) keys.push(i);
		for(var i=0;i<size;i++){
			var r = seedRand(rng,0,keys.length-1);
			var g = keys[r];
			keys.splice(r,1);
			resp.push(arr[g]);
		}
		return resp;
	}

	self.unshuffle = function(arr,seed){
		if (!isArray(arr)) return null;
		seed = seedify(seed) || 'none';

		var size = arr.length;
		var rng = seedrandom(seed);
		var resp = [];
		var map = [];
		var keys = [];

		for(var i=0;i<size;i++) {
			resp.push(null);
			keys.push(i);
		}

		for(var i=0;i<size;i++){
			var r = seedRand(rng,0,keys.length-1);
			var g = keys[r];
			keys.splice(r,1);
			resp[g]=arr[i];
		}

		return resp;
	}

	if(true){
		module.exports=self;
	} else {}
}.call(this));


/***/ }),

/***/ 1246:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NonUniformPromiseEventList = void 0;
const PromiseEventDispatcher_1 = __webpack_require__(2330);
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

/***/ 2330:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PromiseEventDispatcher = void 0;
const ste_core_1 = __webpack_require__(9184);
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

/***/ 3351:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PromiseEventHandlingBase = void 0;
const ste_core_1 = __webpack_require__(9184);
const PromiseEventList_1 = __webpack_require__(4283);
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

/***/ 4283:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PromiseEventList = void 0;
const ste_core_1 = __webpack_require__(9184);
const PromiseEventDispatcher_1 = __webpack_require__(2330);
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

/***/ 606:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

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
const PromiseEventDispatcher_1 = __webpack_require__(2330);
Object.defineProperty(exports, "PromiseEventDispatcher", ({ enumerable: true, get: function () { return PromiseEventDispatcher_1.PromiseEventDispatcher; } }));
const PromiseEventHandlingBase_1 = __webpack_require__(3351);
Object.defineProperty(exports, "PromiseEventHandlingBase", ({ enumerable: true, get: function () { return PromiseEventHandlingBase_1.PromiseEventHandlingBase; } }));
const PromiseEventList_1 = __webpack_require__(4283);
Object.defineProperty(exports, "PromiseEventList", ({ enumerable: true, get: function () { return PromiseEventList_1.PromiseEventList; } }));
const NonUniformPromiseEventList_1 = __webpack_require__(1246);
Object.defineProperty(exports, "NonUniformPromiseEventList", ({ enumerable: true, get: function () { return NonUniformPromiseEventList_1.NonUniformPromiseEventList; } }));


/***/ }),

/***/ 3729:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

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

/***/ 4645:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DispatcherBase = void 0;
const __1 = __webpack_require__(9184);
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

/***/ 7569:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

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

/***/ 7672:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

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

/***/ 4995:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PromiseDispatcherBase = void 0;
const __1 = __webpack_require__(9184);
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

/***/ 3512:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SubscriptionChangeEventDispatcher = void 0;
const __1 = __webpack_require__(9184);
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

/***/ 7744:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

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

/***/ 455:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

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

/***/ 278:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

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

/***/ 9184:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

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
const DispatcherBase_1 = __webpack_require__(4645);
Object.defineProperty(exports, "DispatcherBase", ({ enumerable: true, get: function () { return DispatcherBase_1.DispatcherBase; } }));
const DispatchError_1 = __webpack_require__(3729);
Object.defineProperty(exports, "DispatchError", ({ enumerable: true, get: function () { return DispatchError_1.DispatchError; } }));
const DispatcherWrapper_1 = __webpack_require__(7569);
Object.defineProperty(exports, "DispatcherWrapper", ({ enumerable: true, get: function () { return DispatcherWrapper_1.DispatcherWrapper; } }));
const EventListBase_1 = __webpack_require__(7672);
Object.defineProperty(exports, "EventListBase", ({ enumerable: true, get: function () { return EventListBase_1.EventListBase; } }));
const EventManagement_1 = __webpack_require__(6413);
Object.defineProperty(exports, "EventManagement", ({ enumerable: true, get: function () { return EventManagement_1.EventManagement; } }));
const HandlingBase_1 = __webpack_require__(278);
Object.defineProperty(exports, "HandlingBase", ({ enumerable: true, get: function () { return HandlingBase_1.HandlingBase; } }));
const PromiseDispatcherBase_1 = __webpack_require__(4995);
Object.defineProperty(exports, "PromiseDispatcherBase", ({ enumerable: true, get: function () { return PromiseDispatcherBase_1.PromiseDispatcherBase; } }));
const PromiseSubscription_1 = __webpack_require__(7744);
Object.defineProperty(exports, "PromiseSubscription", ({ enumerable: true, get: function () { return PromiseSubscription_1.PromiseSubscription; } }));
const Subscription_1 = __webpack_require__(455);
Object.defineProperty(exports, "Subscription", ({ enumerable: true, get: function () { return Subscription_1.Subscription; } }));
const SubscriptionChangeEventHandler_1 = __webpack_require__(3512);
Object.defineProperty(exports, "SubscriptionChangeEventDispatcher", ({ enumerable: true, get: function () { return SubscriptionChangeEventHandler_1.SubscriptionChangeEventDispatcher; } }));


/***/ }),

/***/ 6413:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

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

/***/ 4450:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PromiseSignalDispatcher = void 0;
const ste_core_1 = __webpack_require__(7852);
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

/***/ 5871:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PromiseSignalHandlingBase = void 0;
const ste_core_1 = __webpack_require__(7852);
const PromiseSignalList_1 = __webpack_require__(131);
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

/***/ 131:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PromiseSignalList = void 0;
const ste_core_1 = __webpack_require__(7852);
const _1 = __webpack_require__(6042);
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

/***/ 6042:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

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
const PromiseSignalDispatcher_1 = __webpack_require__(4450);
Object.defineProperty(exports, "PromiseSignalDispatcher", ({ enumerable: true, get: function () { return PromiseSignalDispatcher_1.PromiseSignalDispatcher; } }));
const PromiseSignalHandlingBase_1 = __webpack_require__(5871);
Object.defineProperty(exports, "PromiseSignalHandlingBase", ({ enumerable: true, get: function () { return PromiseSignalHandlingBase_1.PromiseSignalHandlingBase; } }));
const PromiseSignalList_1 = __webpack_require__(131);
Object.defineProperty(exports, "PromiseSignalList", ({ enumerable: true, get: function () { return PromiseSignalList_1.PromiseSignalList; } }));


/***/ }),

/***/ 8589:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

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

/***/ 9737:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DispatcherBase = void 0;
const __1 = __webpack_require__(7852);
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

/***/ 8661:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

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

/***/ 5636:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

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

/***/ 6372:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PromiseDispatcherBase = void 0;
const __1 = __webpack_require__(7852);
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

/***/ 3324:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SubscriptionChangeEventDispatcher = void 0;
const __1 = __webpack_require__(7852);
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

/***/ 6484:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

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

/***/ 8859:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

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

/***/ 5722:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

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

/***/ 7852:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

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
const DispatcherBase_1 = __webpack_require__(9737);
Object.defineProperty(exports, "DispatcherBase", ({ enumerable: true, get: function () { return DispatcherBase_1.DispatcherBase; } }));
const DispatchError_1 = __webpack_require__(8589);
Object.defineProperty(exports, "DispatchError", ({ enumerable: true, get: function () { return DispatchError_1.DispatchError; } }));
const DispatcherWrapper_1 = __webpack_require__(8661);
Object.defineProperty(exports, "DispatcherWrapper", ({ enumerable: true, get: function () { return DispatcherWrapper_1.DispatcherWrapper; } }));
const EventListBase_1 = __webpack_require__(5636);
Object.defineProperty(exports, "EventListBase", ({ enumerable: true, get: function () { return EventListBase_1.EventListBase; } }));
const EventManagement_1 = __webpack_require__(1385);
Object.defineProperty(exports, "EventManagement", ({ enumerable: true, get: function () { return EventManagement_1.EventManagement; } }));
const HandlingBase_1 = __webpack_require__(5722);
Object.defineProperty(exports, "HandlingBase", ({ enumerable: true, get: function () { return HandlingBase_1.HandlingBase; } }));
const PromiseDispatcherBase_1 = __webpack_require__(6372);
Object.defineProperty(exports, "PromiseDispatcherBase", ({ enumerable: true, get: function () { return PromiseDispatcherBase_1.PromiseDispatcherBase; } }));
const PromiseSubscription_1 = __webpack_require__(6484);
Object.defineProperty(exports, "PromiseSubscription", ({ enumerable: true, get: function () { return PromiseSubscription_1.PromiseSubscription; } }));
const Subscription_1 = __webpack_require__(8859);
Object.defineProperty(exports, "Subscription", ({ enumerable: true, get: function () { return Subscription_1.Subscription; } }));
const SubscriptionChangeEventHandler_1 = __webpack_require__(3324);
Object.defineProperty(exports, "SubscriptionChangeEventDispatcher", ({ enumerable: true, get: function () { return SubscriptionChangeEventHandler_1.SubscriptionChangeEventDispatcher; } }));


/***/ }),

/***/ 1385:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

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

/***/ 5829:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NonUniformPromiseSimpleEventList = void 0;
const PromiseSimpleEventDispatcher_1 = __webpack_require__(3677);
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

/***/ 3677:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PromiseSimpleEventDispatcher = void 0;
const ste_core_1 = __webpack_require__(5575);
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

/***/ 8648:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PromiseSimpleEventHandlingBase = void 0;
const ste_core_1 = __webpack_require__(5575);
const PromiseSimpleEventList_1 = __webpack_require__(5536);
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

/***/ 5536:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PromiseSimpleEventList = void 0;
const ste_core_1 = __webpack_require__(5575);
const PromiseSimpleEventDispatcher_1 = __webpack_require__(3677);
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

/***/ 4225:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

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
const NonUniformPromiseSimpleEventList_1 = __webpack_require__(5829);
Object.defineProperty(exports, "NonUniformPromiseSimpleEventList", ({ enumerable: true, get: function () { return NonUniformPromiseSimpleEventList_1.NonUniformPromiseSimpleEventList; } }));
const PromiseSimpleEventDispatcher_1 = __webpack_require__(3677);
Object.defineProperty(exports, "PromiseSimpleEventDispatcher", ({ enumerable: true, get: function () { return PromiseSimpleEventDispatcher_1.PromiseSimpleEventDispatcher; } }));
const PromiseSimpleEventHandlingBase_1 = __webpack_require__(8648);
Object.defineProperty(exports, "PromiseSimpleEventHandlingBase", ({ enumerable: true, get: function () { return PromiseSimpleEventHandlingBase_1.PromiseSimpleEventHandlingBase; } }));
const PromiseSimpleEventList_1 = __webpack_require__(5536);
Object.defineProperty(exports, "PromiseSimpleEventList", ({ enumerable: true, get: function () { return PromiseSimpleEventList_1.PromiseSimpleEventList; } }));


/***/ }),

/***/ 2210:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

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

/***/ 5072:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DispatcherBase = void 0;
const __1 = __webpack_require__(5575);
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

/***/ 1050:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

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

/***/ 4211:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

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

/***/ 3787:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PromiseDispatcherBase = void 0;
const __1 = __webpack_require__(5575);
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

/***/ 1789:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SubscriptionChangeEventDispatcher = void 0;
const __1 = __webpack_require__(5575);
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

/***/ 5485:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

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

/***/ 8080:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

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

/***/ 5537:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

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

/***/ 5575:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

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
const DispatcherBase_1 = __webpack_require__(5072);
Object.defineProperty(exports, "DispatcherBase", ({ enumerable: true, get: function () { return DispatcherBase_1.DispatcherBase; } }));
const DispatchError_1 = __webpack_require__(2210);
Object.defineProperty(exports, "DispatchError", ({ enumerable: true, get: function () { return DispatchError_1.DispatchError; } }));
const DispatcherWrapper_1 = __webpack_require__(1050);
Object.defineProperty(exports, "DispatcherWrapper", ({ enumerable: true, get: function () { return DispatcherWrapper_1.DispatcherWrapper; } }));
const EventListBase_1 = __webpack_require__(4211);
Object.defineProperty(exports, "EventListBase", ({ enumerable: true, get: function () { return EventListBase_1.EventListBase; } }));
const EventManagement_1 = __webpack_require__(3504);
Object.defineProperty(exports, "EventManagement", ({ enumerable: true, get: function () { return EventManagement_1.EventManagement; } }));
const HandlingBase_1 = __webpack_require__(5537);
Object.defineProperty(exports, "HandlingBase", ({ enumerable: true, get: function () { return HandlingBase_1.HandlingBase; } }));
const PromiseDispatcherBase_1 = __webpack_require__(3787);
Object.defineProperty(exports, "PromiseDispatcherBase", ({ enumerable: true, get: function () { return PromiseDispatcherBase_1.PromiseDispatcherBase; } }));
const PromiseSubscription_1 = __webpack_require__(5485);
Object.defineProperty(exports, "PromiseSubscription", ({ enumerable: true, get: function () { return PromiseSubscription_1.PromiseSubscription; } }));
const Subscription_1 = __webpack_require__(8080);
Object.defineProperty(exports, "Subscription", ({ enumerable: true, get: function () { return Subscription_1.Subscription; } }));
const SubscriptionChangeEventHandler_1 = __webpack_require__(1789);
Object.defineProperty(exports, "SubscriptionChangeEventDispatcher", ({ enumerable: true, get: function () { return SubscriptionChangeEventHandler_1.SubscriptionChangeEventDispatcher; } }));


/***/ }),

/***/ 3504:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

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

/***/ 9244:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  Ay: () => (/* binding */ tippy_esm)
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
;// CONCATENATED MODULE: ./node_modules/@popperjs/core/lib/utils/userAgent.js
function getUAString() {
  var uaData = navigator.userAgentData;

  if (uaData != null && uaData.brands && Array.isArray(uaData.brands)) {
    return uaData.brands.map(function (item) {
      return item.brand + "/" + item.version;
    }).join(' ');
  }

  return navigator.userAgent;
}
;// CONCATENATED MODULE: ./node_modules/@popperjs/core/lib/dom-utils/isLayoutViewport.js

function isLayoutViewport() {
  return !/^((?!chrome|android).)*safari/i.test(getUAString());
}
;// CONCATENATED MODULE: ./node_modules/@popperjs/core/lib/dom-utils/getBoundingClientRect.js




function getBoundingClientRect(element, includeScale, isFixedStrategy) {
  if (includeScale === void 0) {
    includeScale = false;
  }

  if (isFixedStrategy === void 0) {
    isFixedStrategy = false;
  }

  var clientRect = element.getBoundingClientRect();
  var scaleX = 1;
  var scaleY = 1;

  if (includeScale && isHTMLElement(element)) {
    scaleX = element.offsetWidth > 0 ? round(clientRect.width) / element.offsetWidth || 1 : 1;
    scaleY = element.offsetHeight > 0 ? round(clientRect.height) / element.offsetHeight || 1 : 1;
  }

  var _ref = isElement(element) ? getWindow(element) : window,
      visualViewport = _ref.visualViewport;

  var addVisualOffsets = !isLayoutViewport() && isFixedStrategy;
  var x = (clientRect.left + (addVisualOffsets && visualViewport ? visualViewport.offsetLeft : 0)) / scaleX;
  var y = (clientRect.top + (addVisualOffsets && visualViewport ? visualViewport.offsetTop : 0)) / scaleY;
  var width = clientRect.width / scaleX;
  var height = clientRect.height / scaleY;
  return {
    width: width,
    height: height,
    top: y,
    right: x + width,
    bottom: y + height,
    left: x,
    x: x,
    y: y
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
  var rect = getBoundingClientRect(elementOrVirtualElement, offsetParentIsScaled, isFixed);
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
  var isFirefox = /firefox/i.test(getUAString());
  var isIE = /Trident/i.test(getUAString());

  if (isIE && isHTMLElement(element)) {
    // In IE 9, 10 and 11 fixed elements containing block is always established by the viewport
    var elementCss = getComputedStyle(element);

    if (elementCss.position === 'fixed') {
      return null;
    }
  }

  var currentNode = getParentNode(element);

  if (isShadowRoot(currentNode)) {
    currentNode = currentNode.host;
  }

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
        });
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

        for (var index = 0; index < state.orderedModifiers.length; index++) {
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
      state.orderedModifiers.forEach(function (_ref) {
        var name = _ref.name,
            _ref$options = _ref.options,
            options = _ref$options === void 0 ? {} : _ref$options,
            effect = _ref.effect;

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

function roundOffsetsByDPR(_ref, win) {
  var x = _ref.x,
      y = _ref.y;
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
      var offsetY = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.height : // $FlowFixMe[prop-missing]
      offsetParent[heightProp];
      y -= offsetY - popperRect.height;
      y *= gpuAcceleration ? 1 : -1;
    }

    if (placement === left || (placement === enums_top || placement === bottom) && variation === end) {
      sideX = right;
      var offsetX = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.width : // $FlowFixMe[prop-missing]
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
  }, getWindow(popper)) : {
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




function getViewportRect(element, strategy) {
  var win = getWindow(element);
  var html = getDocumentElement(element);
  var visualViewport = win.visualViewport;
  var width = html.clientWidth;
  var height = html.clientHeight;
  var x = 0;
  var y = 0;

  if (visualViewport) {
    width = visualViewport.width;
    height = visualViewport.height;
    var layoutViewport = isLayoutViewport();

    if (layoutViewport || !layoutViewport && strategy === 'fixed') {
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















function getInnerBoundingClientRect(element, strategy) {
  var rect = getBoundingClientRect(element, false, strategy === 'fixed');
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

function getClientRectFromMixedType(element, clippingParent, strategy) {
  return clippingParent === viewport ? rectToClientRect(getViewportRect(element, strategy)) : isElement(clippingParent) ? getInnerBoundingClientRect(clippingParent, strategy) : rectToClientRect(getDocumentRect(getDocumentElement(element)));
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


function getClippingRect(element, boundary, rootBoundary, strategy) {
  var mainClippingParents = boundary === 'clippingParents' ? getClippingParents(element) : [].concat(boundary);
  var clippingParents = [].concat(mainClippingParents, [rootBoundary]);
  var firstClippingParent = clippingParents[0];
  var clippingRect = clippingParents.reduce(function (accRect, clippingParent) {
    var rect = getClientRectFromMixedType(element, clippingParent, strategy);
    accRect.top = math_max(rect.top, accRect.top);
    accRect.right = math_min(rect.right, accRect.right);
    accRect.bottom = math_min(rect.bottom, accRect.bottom);
    accRect.left = math_max(rect.left, accRect.left);
    return accRect;
  }, getClientRectFromMixedType(element, firstClippingParent, strategy));
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
      _options$strategy = _options.strategy,
      strategy = _options$strategy === void 0 ? state.strategy : _options$strategy,
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
  var clippingClientRect = getClippingRect(isElement(element) ? element : element.contextElement || getDocumentElement(state.elements.popper), boundary, rootBoundary, strategy);
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

  if (!contains(state.elements.popper, arrowElement)) {
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


/***/ }),

/***/ 1234:
/***/ (() => {

/* (ignored) */

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
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/amd define */
/******/ 	(() => {
/******/ 		__webpack_require__.amdD = function () {
/******/ 			throw new Error('define cannot be used indirect');
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/amd options */
/******/ 	(() => {
/******/ 		__webpack_require__.amdO = {};
/******/ 	})();
/******/ 	
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
/******/ 	/* webpack/runtime/node module decorator */
/******/ 	(() => {
/******/ 		__webpack_require__.nmd = (module) => {
/******/ 			module.paths = [];
/******/ 			if (!module.children) module.children = [];
/******/ 			return module;
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";

;// CONCATENATED MODULE: ./node_modules/@4site/engrid-scripts/dist/deprecated.js
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

;// CONCATENATED MODULE: ./node_modules/@4site/engrid-scripts/dist/interfaces/options.js
const OptionsDefaults = {
    backgroundImage: "",
    MediaAttribution: true,
    applePay: false,
    CapitalizeFields: false,
    ClickToExpand: true,
    CurrencySymbol: "$",
    CurrencyCode: "USD",
    AddCurrencySymbol: true,
    ThousandsSeparator: "",
    DecimalSeparator: ".",
    DecimalPlaces: 2,
    MinAmount: 1,
    MaxAmount: 100000,
    MinAmountMessage: "Amount must be at least $1",
    MaxAmountMessage: "Amount must be less than $100,000",
    SkipToMainContentLink: true,
    SrcDefer: true,
    NeverBounceAPI: null,
    NeverBounceDateField: null,
    NeverBounceStatusField: null,
    NeverBounceDateFormat: "MM/DD/YYYY",
    FreshAddress: false,
    ProgressBar: false,
    AutoYear: false,
    TranslateFields: true,
    Debug: false,
    RememberMe: false,
    TidyContact: false,
    RegionLongFormat: "",
    CountryDisable: [],
    Plaid: false,
    Placeholders: false,
    ENValidators: false,
    MobileCTA: false,
    CustomCurrency: false,
    VGS: false,
    PostalCodeValidator: false,
    CountryRedirect: false,
    WelcomeBack: false,
    PageLayouts: [
        "leftleft1col",
        "centerleft1col",
        "centercenter1col",
        "centercenter2col",
        "centerright1col",
        "rightright1col",
        "none",
    ],
};

;// CONCATENATED MODULE: ./node_modules/@4site/engrid-scripts/dist/interfaces/upsell-options.js
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
    oneTime: true,
    annual: false,
    disablePaymentMethods: [],
    skipUpsell: false,
    conversionField: "",
};

;// CONCATENATED MODULE: ./node_modules/@4site/engrid-scripts/dist/interfaces/translate-options.js
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

;// CONCATENATED MODULE: ./node_modules/@4site/engrid-scripts/dist/interfaces/exit-intent-options.js
const ExitIntentOptionsDefaults = {
    enabled: false,
    title: "We are sad that you are leaving",
    text: "Would you mind telling us why you are leaving this page?",
    buttonText: "Send us your comments",
    buttonLink: "https://www.4sitestudios.com/",
    cookieName: "engrid-exit-intent-lightbox",
    cookieDuration: 30,
    triggers: {
        visibilityState: true,
        mousePosition: true,
    },
};

;// CONCATENATED MODULE: ./node_modules/@4site/engrid-scripts/dist/loader.js
// Ref: https://app.getguru.com/card/iMgx968T/ENgrid-Loader

class Loader {
    constructor() {
        this.logger = new EngridLogger("Loader", "gold", "black", "🔁");
        this.cssElement = document.querySelector('link[href*="engrid."][rel="stylesheet"]');
        this.jsElement = document.querySelector('script[src*="engrid."]');
    }
    // Returns true if ENgrid should reload (that means the current ENgrid is not the right one)
    // Returns false if ENgrid should not reload (that means the current ENgrid is the right one)
    reload() {
        var _a, _b, _c;
        const assets = this.getOption("assets");
        const isLoaded = engrid_ENGrid.getBodyData("loaded");
        let shouldSkipCss = this.getOption("engridcss") === "false";
        let shouldSkipJs = this.getOption("engridjs") === "false";
        if (isLoaded || !assets) {
            if (shouldSkipCss && this.cssElement) {
                this.logger.log("engridcss=false | Removing original stylesheet:", this.cssElement);
                this.cssElement.remove();
            }
            if (shouldSkipJs && this.jsElement) {
                this.logger.log("engridjs=false | Removing original script:", this.jsElement);
                this.jsElement.remove();
            }
            if (shouldSkipCss) {
                this.logger.log("engridcss=false | adding top banner CSS");
                this.addENgridCSSUnloadedCSS();
            }
            if (shouldSkipJs) {
                this.logger.log("engridjs=false | Skipping JS load.");
                this.logger.success("LOADED");
                return true;
            }
            this.logger.success("LOADED");
            return false;
        }
        // Load the right ENgrid
        this.logger.log("RELOADING");
        engrid_ENGrid.setBodyData("loaded", "true"); // Set the loaded flag, so the next time we don't reload
        // Fetch the desired repo, assets location, and override JS/CSS
        const theme = engrid_ENGrid.getBodyData("theme");
        const engrid_repo = (_a = this.getOption("repo-name")) !== null && _a !== void 0 ? _a : `engrid-${theme}`;
        let engrid_js_url = "";
        let engrid_css_url = "";
        switch (assets) {
            case "local":
                this.logger.log("LOADING LOCAL");
                engrid_ENGrid.setBodyData("assets", "local");
                engrid_js_url = `https://${engrid_repo}.test/dist/engrid.js`;
                engrid_css_url = `https://${engrid_repo}.test/dist/engrid.css`;
                break;
            case "flush":
                this.logger.log("FLUSHING CACHE");
                const timestamp = Date.now();
                const jsCurrentURL = new URL(((_b = this.jsElement) === null || _b === void 0 ? void 0 : _b.getAttribute("src")) || "");
                jsCurrentURL.searchParams.set("v", timestamp.toString());
                engrid_js_url = jsCurrentURL.toString();
                const cssCurrentURL = new URL(((_c = this.cssElement) === null || _c === void 0 ? void 0 : _c.getAttribute("href")) || "");
                cssCurrentURL.searchParams.set("v", timestamp.toString());
                engrid_css_url = cssCurrentURL.toString();
                break;
            default:
                this.logger.log("LOADING EXTERNAL");
                engrid_js_url = `https://s3.amazonaws.com/engrid-dev.4sitestudios.com/${engrid_repo}/${assets}/engrid.js`;
                engrid_css_url = `https://s3.amazonaws.com/engrid-dev.4sitestudios.com/${engrid_repo}/${assets}/engrid.css`;
        }
        if (shouldSkipCss && this.cssElement) {
            this.logger.log("engridcss=false | Removing original stylesheet:", this.cssElement);
            this.cssElement.remove();
        }
        if (shouldSkipCss && engrid_css_url && engrid_css_url !== "") {
            this.logger.log("engridcss=false | Skipping injection of stylesheet:", engrid_css_url);
        }
        if (shouldSkipCss) {
            this.logger.log("engridcss=false | adding top banner CSS");
            this.addENgridCSSUnloadedCSS();
        }
        else {
            this.setCssFile(engrid_css_url);
        }
        if (shouldSkipJs && this.jsElement) {
            this.logger.log("engridjs=false | Removing original script:", this.jsElement);
            this.jsElement.remove();
        }
        if (shouldSkipJs && engrid_js_url && engrid_js_url !== "") {
            this.logger.log("engridjs=false | Skipping injection of script:", engrid_js_url);
        }
        if (!shouldSkipJs) {
            this.setJsFile(engrid_js_url);
        }
        // If custom assets aren't defined, we don't need to reload.
        if (!assets) {
            return false;
        }
        return true;
    }
    getOption(key) {
        const urlParam = engrid_ENGrid.getUrlParameter(key);
        if (urlParam && ["assets", "engridcss", "engridjs"].includes(key)) {
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
        if (url === "") {
            return;
        }
        if (this.cssElement) {
            this.logger.log("Replacing stylesheet:", url);
            this.cssElement.setAttribute("href", url);
        }
        else {
            this.logger.log("Injecting stylesheet:", url);
            const link = document.createElement("link");
            link.setAttribute("rel", "stylesheet");
            link.setAttribute("type", "text/css");
            link.setAttribute("media", "all");
            link.setAttribute("href", url);
            document.head.appendChild(link);
        }
    }
    setJsFile(url) {
        if (url === "") {
            return;
        }
        this.logger.log("Injecting script:", url);
        const script = document.createElement("script");
        script.setAttribute("src", url);
        document.head.appendChild(script);
    }
    addENgridCSSUnloadedCSS() {
        document.body.insertAdjacentHTML("beforeend", `<style>
        html,
        body {
            background-color: #ffffff;
        }

        body {
            opacity: 1;
            margin: 0;
        }

        body:before {
            content: "ENGRID CSS UNLOADED";
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            background-color: #ffff00;
            padding: 1rem;
            margin-bottom: 1rem;
            font-family: sans-serif;
            font-weight: 600;
        }

        .en__component--advrow {
            flex-direction: column;
            max-width: 600px;
            margin: 0 auto;
        }

        .en__component--advrow * {
            max-width: 100%;
            height: auto;
        }
      </style>`);
    }
}

// EXTERNAL MODULE: ./node_modules/@4site/engrid-scripts/node_modules/strongly-typed-events/dist/index.js
var dist = __webpack_require__(3199);
;// CONCATENATED MODULE: ./node_modules/@4site/engrid-scripts/dist/events/en-form.js


class EnForm {
    constructor() {
        this.logger = new EngridLogger("EnForm");
        this._onSubmit = new dist/* SignalDispatcher */.UD();
        this._onValidate = new dist/* SignalDispatcher */.UD();
        this._onError = new dist/* SignalDispatcher */.UD();
        this.submit = true;
        this.submitPromise = false;
        this.validate = true;
        this.validatePromise = false;
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
        return this._onSubmit.asEvent();
    }
    get onError() {
        return this._onError.asEvent();
    }
    get onValidate() {
        return this._onValidate.asEvent();
    }
}

;// CONCATENATED MODULE: ./node_modules/@4site/engrid-scripts/dist/events/donation-amount.js


class DonationAmount {
    constructor(radios = "transaction.donationAmt", other = "transaction.donationAmt.other") {
        this._onAmountChange = new dist/* SimpleEventDispatcher */.IL();
        this._amount = 0;
        this._radios = "";
        this._other = "";
        this._dispatch = true;
        this._other = other;
        this._radios = radios;
        // Watch Radios Inputs for Changes
        document.addEventListener("change", (e) => {
            const element = e.target;
            if (element) {
                if (element.name == radios) {
                    this.amount = parseFloat(element.value);
                }
                else if (element.name == other) {
                    const cleanedAmount = engrid_ENGrid.cleanAmount(element.value);
                    element.value =
                        cleanedAmount % 1 != 0
                            ? cleanedAmount.toFixed(2)
                            : cleanedAmount.toString();
                    this.amount = cleanedAmount;
                }
            }
        });
        // Watch Other Amount Field
        const otherField = document.querySelector(`[name='${this._other}']`);
        if (otherField) {
            otherField.addEventListener("keyup", (e) => {
                this.amount = engrid_ENGrid.cleanAmount(otherField.value);
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
        if (currentAmountField) {
            let currentAmountValue = parseFloat(currentAmountField.value || "");
            if (currentAmountValue > 0) {
                this.amount = parseFloat(currentAmountField.value);
            }
            else {
                const otherField = document.querySelector('input[name="' + this._other + '"]');
                currentAmountValue = engrid_ENGrid.cleanAmount(otherField.value);
                this.amount = currentAmountValue;
            }
        }
        else if (engrid_ENGrid.checkNested(window.EngagingNetworks, "require", "_defined", "enjs", "getDonationTotal") &&
            engrid_ENGrid.checkNested(window.EngagingNetworks, "require", "_defined", "enjs", "getDonationFee")) {
            const total = window.EngagingNetworks.require._defined.enjs.getDonationTotal() -
                window.EngagingNetworks.require._defined.enjs.getDonationFee();
            if (total) {
                this.amount = total;
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
            if (otherField) {
                const enFieldOtherAmountRadio = document.querySelector(`.en__field--donationAmt.en__field--withOther .en__field__item:nth-last-child(2) input[name="${this._radios}"]`);
                if (enFieldOtherAmountRadio) {
                    enFieldOtherAmountRadio.checked = true;
                }
                otherField.value = parseFloat(amount.toString()).toFixed(2);
                const otherWrapper = otherField.parentNode;
                otherWrapper.classList.remove("en__field__item--hidden");
            }
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
}

;// CONCATENATED MODULE: ./node_modules/@4site/engrid-scripts/dist/engrid.js
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
    static get demo() {
        return this.getUrlParameter("mode") === "DEMO";
    }
    // Return any parameter from the URL
    static getUrlParameter(name) {
        const searchParams = new URLSearchParams(window.location.search);
        // Add support for array on the name ending with []
        if (name.endsWith("[]")) {
            let values = [];
            searchParams.forEach((value, key) => {
                if (key.startsWith(name.replace("[]", ""))) {
                    values.push(new Object({ [key]: value }));
                }
            });
            return values.length > 0 ? values : null;
        }
        if (searchParams.has(name)) {
            return searchParams.get(name) || true;
        }
        return null;
    }
    static getField(name) {
        // Get the field by name
        return document.querySelector(`[name="${name}"]`);
    }
    // Return the field value from its name. It works on any field type.
    // Multiple values (from checkboxes or multi-select) are returned as single string
    // Separated by ,
    static getFieldValue(name) {
        return new FormData(this.enForm).getAll(name).join(",");
    }
    // Set a value to any field. If it's a dropdown, radio or checkbox, it selects the proper option matching the value
    static setFieldValue(name, value, parseENDependencies = true, dispatchEvents = false) {
        if (value === engrid_ENGrid.getFieldValue(name))
            return;
        document.getElementsByName(name).forEach((field) => {
            if ("type" in field) {
                switch (field.type) {
                    case "select-one":
                    case "select-multiple":
                        for (const option of field.options) {
                            if (option.value == value) {
                                option.selected = true;
                                if (dispatchEvents) {
                                    field.dispatchEvent(new Event("change", { bubbles: true }));
                                }
                            }
                        }
                        break;
                    case "checkbox":
                    case "radio":
                        if (field.value == value) {
                            field.checked = true;
                            if (dispatchEvents) {
                                field.dispatchEvent(new Event("change", { bubbles: true }));
                            }
                        }
                        break;
                    case "textarea":
                    case "text":
                    default:
                        field.value = value;
                        if (dispatchEvents) {
                            field.dispatchEvent(new Event("change", { bubbles: true }));
                            field.dispatchEvent(new Event("blur", { bubbles: true }));
                        }
                }
                field.setAttribute("engrid-value-changed", "");
            }
        });
        if (parseENDependencies)
            this.enParseDependencies();
        return;
    }
    // Create a hidden input field
    static createHiddenInput(name, value = "") {
        var _a;
        const formBlock = document.createElement("div");
        formBlock.classList.add("en__component", "en__component--formblock", "hide");
        const textField = document.createElement("div");
        textField.classList.add("en__field", "en__field--text");
        const textElement = document.createElement("div");
        textElement.classList.add("en__field__element", "en__field__element--text");
        const inputField = document.createElement("input");
        inputField.classList.add("en__field__input", "en__field__input--text", "engrid-added-input");
        inputField.setAttribute("name", name);
        inputField.setAttribute("type", "hidden");
        inputField.setAttribute("value", value);
        textElement.appendChild(inputField);
        textField.appendChild(textElement);
        formBlock.appendChild(textField);
        const submitElement = document.querySelector(".en__submit");
        if (submitElement) {
            const lastFormComponent = submitElement.closest(".en__component");
            if (lastFormComponent) {
                // Insert the new field after the submit button
                (_a = lastFormComponent.parentNode) === null || _a === void 0 ? void 0 : _a.insertBefore(formBlock, lastFormComponent.nextSibling);
            }
        }
        else {
            engrid_ENGrid.enForm.appendChild(formBlock);
        }
        return inputField;
    }
    // Trigger EN Dependencies
    static enParseDependencies() {
        var _a, _b, _c, _d, _e, _f;
        if (window.EngagingNetworks &&
            typeof ((_e = (_d = (_c = (_b = (_a = window.EngagingNetworks) === null || _a === void 0 ? void 0 : _a.require) === null || _b === void 0 ? void 0 : _b._defined) === null || _c === void 0 ? void 0 : _c.enDependencies) === null || _d === void 0 ? void 0 : _d.dependencies) === null || _e === void 0 ? void 0 : _e.parseDependencies) === "function") {
            const customDependencies = [];
            if ("dependencies" in window.EngagingNetworks) {
                const amountContainer = document.querySelector(".en__field--donationAmt");
                if (amountContainer) {
                    let amountID = ((_f = [...amountContainer.classList.values()]
                        .filter((v) => v.startsWith("en__field--") && Number(v.substring(11)) > 0)
                        .toString()
                        .match(/\d/g)) === null || _f === void 0 ? void 0 : _f.join("")) || "";
                    if (amountID) {
                        window.EngagingNetworks.dependencies.forEach((dependency) => {
                            if ("actions" in dependency && dependency.actions.length > 0) {
                                let amountIdFound = false;
                                dependency.actions.forEach((action) => {
                                    if ("target" in action && action.target == amountID) {
                                        amountIdFound = true;
                                    }
                                });
                                if (!amountIdFound) {
                                    customDependencies.push(dependency);
                                }
                            }
                        });
                        if (customDependencies.length > 0) {
                            window.EngagingNetworks.require._defined.enDependencies.dependencies.parseDependencies(customDependencies);
                            if (engrid_ENGrid.getOption("Debug"))
                                console.log("EN Dependencies Triggered", customDependencies);
                        }
                    }
                }
            }
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
    // Return the client ID
    static getClientID() {
        if ("pageJson" in window)
            return window.pageJson.clientId;
        return 0;
    }
    //returns 'us or 'ca' based on the client ID
    static getDataCenter() {
        return engrid_ENGrid.getClientID() >= 10000 ? "us" : "ca";
    }
    // Return the current page type
    static getPageType() {
        if ("pageJson" in window && "pageType" in window.pageJson) {
            switch (window.pageJson.pageType) {
                case "donation":
                case "premiumgift":
                    return "DONATION";
                    break;
                case "e-card":
                    return "ECARD";
                    break;
                case "otherdatacapture":
                case "survey":
                    return "SURVEY";
                    break;
                case "emailtotarget":
                    return "EMAILTOTARGET";
                    break;
                case "advocacypetition":
                    return "ADVOCACY";
                    break;
                case "emailsubscribeform":
                    return "SUBSCRIBEFORM";
                    break;
                case "supporterhub":
                    return "SUPPORTERHUB";
                    break;
                case "unsubscribe":
                    return "UNSUBSCRIBE";
                    break;
                case "tweetpage":
                    return "TWEETPAGE";
                    break;
                default:
                    return "UNKNOWN";
            }
        }
        else {
            return "UNKNOWN";
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
    // Check if body has engrid data attributes
    static hasBodyData(dataName) {
        const body = document.querySelector("body");
        return body.hasAttribute(`data-engrid-${dataName}`);
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
            document.head.appendChild(scriptTag);
            return;
        }
        document.body.appendChild(scriptTag);
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
    // Clean an Amount
    static cleanAmount(amount) {
        // Split the number
        const valueArray = amount.replace(/[^0-9,\.]/g, "").split(/[,.]+/);
        const delimArray = amount.replace(/[^.,]/g, "").split("");
        // Handle values with no decimal places and non-numeric values
        if (valueArray.length === 1) {
            return parseInt(valueArray[0]) || 0;
        }
        // Ignore invalid numbers
        if (valueArray
            .map((x, index) => {
            return index > 0 && index + 1 !== valueArray.length && x.length !== 3
                ? true
                : false;
        })
            .includes(true)) {
            return 0;
        }
        // Multiple commas is a bad thing? So edgy.
        if (delimArray.length > 1 && !delimArray.includes(".")) {
            return 0;
        }
        // Handle invalid decimal and comma formatting
        if ([...new Set(delimArray.slice(0, -1))].length > 1) {
            return 0;
        }
        // If there are cents
        if (valueArray[valueArray.length - 1].length <= 2) {
            const cents = valueArray.pop() || "00";
            return parseInt(cents) > 0
                ? parseFloat(Number(parseInt(valueArray.join("")) + "." + cents).toFixed(2))
                : parseInt(valueArray.join(""));
        }
        return parseInt(valueArray.join(""));
    }
    static disableSubmit(label = "") {
        const submit = document.querySelector(".en__submit button");
        if (!submit)
            return false;
        submit.dataset.originalText = submit.innerHTML;
        let submitButtonProcessingHTML = "<span class='loader-wrapper'><span class='loader loader-quart'></span><span class='submit-button-text-wrapper'>" +
            label +
            "</span></span>";
        submit.disabled = true;
        submit.innerHTML = submitButtonProcessingHTML;
        return true;
    }
    static enableSubmit() {
        const submit = document.querySelector(".en__submit button");
        if (!submit)
            return false;
        if (submit.dataset.originalText) {
            submit.disabled = false;
            submit.innerHTML = submit.dataset.originalText;
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
    // Deep merge two objects
    static deepMerge(target, source) {
        for (const key in source) {
            if (source[key] instanceof Object)
                Object.assign(source[key], engrid_ENGrid.deepMerge(target[key], source[key]));
        }
        Object.assign(target || {}, source);
        return target;
    }
    static setError(element, errorMessage) {
        const errorElement = typeof element === "string" ? document.querySelector(element) : element;
        if (errorElement) {
            errorElement.classList.add("en__field--validationFailed");
            let errorMessageElement = errorElement.querySelector(".en__field__error");
            if (!errorMessageElement) {
                errorMessageElement = document.createElement("div");
                errorMessageElement.classList.add("en__field__error");
                errorMessageElement.innerHTML = errorMessage;
                errorElement.insertBefore(errorMessageElement, errorElement.firstChild);
            }
            else {
                errorMessageElement.innerHTML = errorMessage;
            }
        }
    }
    static removeError(element) {
        const errorElement = typeof element === "string" ? document.querySelector(element) : element;
        if (errorElement) {
            errorElement.classList.remove("en__field--validationFailed");
            const errorMessageElement = errorElement.querySelector(".en__field__error");
            if (errorMessageElement) {
                errorElement.removeChild(errorMessageElement);
            }
        }
    }
    static isVisible(element) {
        if (!element) {
            return false;
        }
        return !!(element.offsetWidth ||
            element.offsetHeight ||
            element.getClientRects().length);
    }
    static getCurrencySymbol() {
        const currencyField = engrid_ENGrid.getField("transaction.paycurrency");
        if (currencyField) {
            // Check if the selected currency field option have a data-currency-symbol attribute
            const selectedOption = currencyField.tagName === "SELECT"
                ? currencyField.options[currencyField.selectedIndex]
                : currencyField;
            if (selectedOption.dataset.currencySymbol) {
                return selectedOption.dataset.currencySymbol;
            }
            const currencyArray = {
                USD: "$",
                EUR: "€",
                GBP: "£",
                AUD: "$",
                CAD: "$",
                JPY: "¥",
            };
            return currencyArray[currencyField.value] || "$";
        }
        return engrid_ENGrid.getOption("CurrencySymbol") || "$";
    }
    static getCurrencyCode() {
        const currencyField = engrid_ENGrid.getField("transaction.paycurrency");
        if (currencyField) {
            return currencyField.value || "USD";
        }
        return engrid_ENGrid.getOption("CurrencyCode") || "USD";
    }
    static addHtml(html, target = "body", position = "before") {
        var _a, _b;
        const targetElement = document.querySelector(target);
        if (typeof html === "object") {
            html = html.outerHTML;
        }
        if (targetElement) {
            const htmlElement = document.createRange().createContextualFragment(html);
            if (position === "before") {
                (_a = targetElement.parentNode) === null || _a === void 0 ? void 0 : _a.insertBefore(htmlElement, targetElement);
            }
            else {
                (_b = targetElement.parentNode) === null || _b === void 0 ? void 0 : _b.insertBefore(htmlElement, targetElement.nextSibling);
            }
        }
    }
    static removeHtml(target) {
        const targetElement = document.querySelector(target);
        if (targetElement) {
            targetElement.remove();
        }
    }
    static slugify(text) {
        return text
            .toString()
            .toLowerCase()
            .replace(/\s+/g, "-") // Replace spaces with -
            .replace(/[^\w\-]+/g, "") // Remove all non-word chars
            .replace(/\-\-+/g, "-") // Replace multiple - with single -
            .replace(/^-+/, "") // Trim - from start of text
            .replace(/-+$/, ""); // Trim - from end of text
    }
    // This function is used to run a callback function when an error is displayed on the page
    static watchForError(callback) {
        const errorElement = document.querySelector(".en__errorList");
        const capitalize = (word) => word.charAt(0).toUpperCase() + word.slice(1);
        // Avoid duplicate callbacks
        let callbackType = callback.toString();
        if (callbackType.indexOf("function") === 0) {
            callbackType = callbackType.replace("function ", "");
        }
        if (callbackType.indexOf("(") > 0) {
            callbackType = callbackType.substring(0, callbackType.indexOf("("));
        }
        // Remove invalid characters
        callbackType = callbackType.replace(/[^a-zA-Z0-9]/g, "");
        // Limit to 20 characters and add prefix
        callbackType = callbackType.substring(0, 20);
        callbackType = "engrid" + capitalize(callbackType);
        if (errorElement && !errorElement.dataset[callbackType]) {
            errorElement.dataset[callbackType] = "true";
            const observer = new MutationObserver(function (mutations) {
                mutations.forEach(function (mutation) {
                    if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
                        callback();
                    }
                });
            });
            observer.observe(errorElement, { childList: true });
        }
    }
    // Get the Payment Type
    static getPaymentType() {
        return engrid_ENGrid.getFieldValue("transaction.paymenttype");
    }
    // Set the Payment Type
    static setPaymentType(paymentType) {
        const enFieldPaymentType = engrid_ENGrid.getField("transaction.paymenttype");
        if (enFieldPaymentType) {
            const paymentTypeOption = Array.from(enFieldPaymentType.options).find((option) => paymentType.toLowerCase() === "card"
                ? ["card", "visa", "vi"].includes(option.value.toLowerCase())
                : paymentType.toLowerCase() === option.value.toLowerCase());
            if (paymentTypeOption) {
                paymentTypeOption.selected = true;
                enFieldPaymentType.value = paymentTypeOption.value;
            }
            else {
                enFieldPaymentType.value = paymentType;
            }
            const event = new Event("change", {
                bubbles: true,
                cancelable: true,
            });
            enFieldPaymentType.dispatchEvent(event);
        }
    }
    static isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <=
                (window.innerHeight ||
                    document.documentElement.clientHeight) /* or $(window).height() */ &&
            rect.right <=
                (window.innerWidth ||
                    document.documentElement.clientWidth) /* or $(window).width() */);
    }
}

;// CONCATENATED MODULE: ./node_modules/@4site/engrid-scripts/dist/events/donation-frequency.js


class DonationFrequency {
    constructor() {
        this._onFrequencyChange = new dist/* SimpleEventDispatcher */.IL();
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
        //Thank you page handling for utility classes
        if (engrid_ENGrid.getGiftProcess()) {
            engrid_ENGrid.setBodyData("transaction-recurring-frequency", sessionStorage.getItem("engrid-transaction-recurring-frequency") ||
                "onetime");
            engrid_ENGrid.setBodyData("transaction-recurring", window.pageJson.recurring ? "y" : "n");
        }
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
        sessionStorage.setItem("engrid-transaction-recurring-frequency", this._frequency);
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
        var _a;
        this.frequency =
            engrid_ENGrid.getFieldValue("transaction.recurrfreq") ||
                sessionStorage.getItem("engrid-transaction-recurring-frequency") ||
                "onetime";
        const recurrField = engrid_ENGrid.getField("transaction.recurrpay");
        if (recurrField) {
            this.recurring = engrid_ENGrid.getFieldValue("transaction.recurrpay");
        }
        else if (engrid_ENGrid.checkNested(window.EngagingNetworks, "require", "_defined", "enjs", "getSupporterData")) {
            this.recurring =
                ((_a = window.EngagingNetworks.require._defined.enjs
                    .getSupporterData("recurrpay")) === null || _a === void 0 ? void 0 : _a.toLowerCase()) || "n";
        }
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

;// CONCATENATED MODULE: ./node_modules/@4site/engrid-scripts/dist/events/processing-fees.js



class ProcessingFees {
    constructor() {
        this._onFeeChange = new dist/* SimpleEventDispatcher */.IL();
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

;// CONCATENATED MODULE: ./node_modules/@4site/engrid-scripts/dist/events/remember-me-events.js
/**
 * This class is responsible for managing events related to the "Remember Me" functionality.
 * It uses the Singleton design pattern to ensure only one instance of this class exists.
 * It provides methods for dispatching load and clear events, and getters for accessing these events.
 */


class RememberMeEvents {
    constructor() {
        this.logger = new EngridLogger("RememberMeEvents");
        this._onLoad = new dist/* SimpleEventDispatcher */.IL();
        this._onClear = new dist/* SignalDispatcher */.UD();
        this.hasData = false;
    }
    static getInstance() {
        if (!RememberMeEvents.instance) {
            RememberMeEvents.instance = new RememberMeEvents();
        }
        return RememberMeEvents.instance;
    }
    dispatchLoad(hasData) {
        this.hasData = hasData;
        this._onLoad.dispatch(hasData);
        this.logger.log(`dispatchLoad: ${hasData}`);
    }
    dispatchClear() {
        this._onClear.dispatch();
        this.logger.log("dispatchClear");
    }
    get onLoad() {
        return this._onLoad.asEvent();
    }
    get onClear() {
        return this._onClear.asEvent();
    }
}

;// CONCATENATED MODULE: ./node_modules/@4site/engrid-scripts/dist/events/country.js


class Country {
    constructor() {
        this._onCountryChange = new dist/* SimpleEventDispatcher */.IL();
        this._country = "";
        this._field = null;
        // Run only if it is a Page with a Country field
        this._field = document.getElementById("en__field_supporter_country");
        if (!this._field) {
            return;
        }
        document.addEventListener("change", (e) => {
            const element = e.target;
            if (element && element.name == "supporter.country") {
                this.country = element.value;
            }
        });
        // Set the country to the current value on the field
        this.country = engrid_ENGrid.getFieldValue("supporter.country");
    }
    static getInstance() {
        if (!Country.instance) {
            Country.instance = new Country();
        }
        return Country.instance;
    }
    get countryField() {
        return this._field;
    }
    get onCountryChange() {
        return this._onCountryChange.asEvent();
    }
    get country() {
        return this._country;
    }
    // Every time we set a country, trigger the onCountryChange event
    set country(value) {
        this._country = value;
        this._onCountryChange.dispatch(this._country);
    }
}

;// CONCATENATED MODULE: ./node_modules/@4site/engrid-scripts/dist/events/index.js







;// CONCATENATED MODULE: ./node_modules/@4site/engrid-scripts/dist/app.js


class app_App extends engrid_ENGrid {
    constructor(options) {
        super();
        // Events
        this._form = EnForm.getInstance();
        this._fees = ProcessingFees.getInstance();
        this._amount = DonationAmount.getInstance("transaction.donationAmt", "transaction.donationAmt.other");
        this._frequency = DonationFrequency.getInstance();
        this._country = Country.getInstance();
        this.logger = new EngridLogger("App", "black", "white", "🍏");
        const loader = new Loader();
        this.options = Object.assign(Object.assign({}, OptionsDefaults), options);
        // Add Options to window
        window.EngridOptions = this.options;
        this._dataLayer = DataLayer.getInstance();
        // If there's a ?pbedit query string, redirect to the page builder to edit on EN
        if (engrid_ENGrid.getUrlParameter("pbedit") === true ||
            engrid_ENGrid.getUrlParameter("pbedit") === "true") {
            window.location.href = `https://${engrid_ENGrid.getDataCenter()}.engagingnetworks.app/index.html#pages/${engrid_ENGrid.getPageID()}/edit`;
            return;
        }
        if (loader.reload())
            return;
        // Turn Debug ON if you use local assets
        if (engrid_ENGrid.getBodyData("assets") === "local" &&
            engrid_ENGrid.getUrlParameter("debug") !== "false" &&
            engrid_ENGrid.getUrlParameter("debug") !== "log") {
            window.EngridOptions.Debug = true;
        }
        // Document Load
        if (document.readyState !== "loading") {
            this.run();
        }
        else {
            document.addEventListener("DOMContentLoaded", () => {
                this.run();
            });
        }
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
            }, 100);
            return;
        }
        // If there's an option object on the page, override the defaults
        if (window.hasOwnProperty("EngridPageOptions")) {
            this.options = Object.assign(Object.assign({}, this.options), window.EngridPageOptions);
            // Add Options to window
            window.EngridOptions = this.options;
        }
        // If there's no pageJson.pageType, add a big red warning to the console
        if (!engrid_ENGrid.checkNested(window, "pageJson", "pageType")) {
            window.setTimeout(() => {
                console.log("%c ⛔️ pageJson.pageType NOT FOUND - Go to the Account Settings and Expose the Transaction Details %s", "background-color: red; color: white; font-size: 22px; font-weight: bold;", "https://knowledge.engagingnetworks.net/datareports/expose-transaction-details-pagejson");
            }, 2000);
        }
        if (this.options.Debug || app_App.getUrlParameter("debug") == "true")
            // Enable debug if available is the first thing
            app_App.setBodyData("debug", "");
        new Advocacy();
        new InputPlaceholders();
        new InputHasValueAndFocus();
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
        this._form.onSubmit.subscribe((s) => this.logger.success("Submit: " + JSON.stringify(s)));
        this._form.onError.subscribe((s) => this.logger.danger("Error: " + JSON.stringify(s)));
        this._country.onCountryChange.subscribe((s) => this.logger.success(`Country: ${s}`));
        window.enOnSubmit = () => {
            this._form.submit = true;
            this._form.submitPromise = false;
            this._form.dispatchSubmit();
            engrid_ENGrid.watchForError(engrid_ENGrid.enableSubmit);
            if (!this._form.submit)
                return false;
            if (this._form.submitPromise)
                return this._form.submitPromise;
            this.logger.success("enOnSubmit Success");
            // If all validation passes, we'll watch for Digital Wallets Errors, which
            // will not reload the page (thanks EN), so we will enable the submit button if
            // an error is programmatically thrown by the Digital Wallets
            return true;
        };
        window.enOnError = () => {
            this._form.dispatchError();
        };
        window.enOnValidate = () => {
            this._form.validate = true;
            this._form.validatePromise = false;
            this._form.dispatchValidate();
            if (!this._form.validate)
                return false;
            if (this._form.validatePromise)
                return this._form.validatePromise;
            this.logger.success("Validation Passed");
            return true;
        };
        new DataAttributes();
        // Country Redirect
        new CountryRedirect();
        // iFrame Logic
        new iFrame();
        // Live Variables
        new LiveVariables(this.options);
        // Dynamically set Recurrency Frequency
        new setRecurrFreq();
        // Upsell Lightbox
        new UpsellLightbox();
        // Amount Labels
        new AmountLabel();
        // Engrid Data Replacement
        new DataReplace();
        // ENgrid Hide Script
        new DataHide();
        // Autosubmit script
        new Autosubmit();
        // Adjust display of event tickets.
        new EventTickets();
        // Swap Amounts
        new SwapAmounts();
        // On the end of the script, after all subscribers defined, let's load the current frequency
        // The amount will be loaded by the frequency change event
        // This timeout is needed because when you have alternative amounts, EN is slower than Engrid
        // about 20% of the time and we get a race condition if the client is also using the SwapAmounts feature
        window.setTimeout(() => {
            this._frequency.load();
        }, 1000);
        // Fast Form Fill
        new FastFormFill();
        // Currency Related Components
        new LiveCurrency();
        new CustomCurrency();
        // Auto Country Select
        new AutoCountrySelect();
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
        try {
            // Accessing window.localStorage will throw an exception if it isn't permitted due to security reasons
            // For example, this happens in Firefox when cookies are disabled.  If it isn't available, we shouldn't
            //  bother with enabling RememberMe
            if (this.options.RememberMe &&
                typeof this.options.RememberMe === "object" &&
                window.localStorage) {
                new RememberMe(this.options.RememberMe);
            }
        }
        catch (e) { }
        if (this.options.NeverBounceAPI)
            new NeverBounce(this.options.NeverBounceAPI, this.options.NeverBounceDateField, this.options.NeverBounceStatusField, this.options.NeverBounceDateFormat);
        // FreshAddress
        if (this.options.FreshAddress)
            new FreshAddress();
        new ShowIfAmount();
        new OtherAmount();
        new MinMaxAmount();
        new Ticker();
        new A11y();
        new AddNameToMessage();
        new ExpandRegionName();
        // Page Background
        new PageBackground();
        // Url Params to Form Fields
        new UrlToForm();
        // Required if Visible Fields
        new RequiredIfVisible();
        // EN Custom Validators (behind a feature flag, off by default)
        new ENValidators();
        //Debug hidden fields
        if (this.options.Debug)
            new DebugHiddenFields();
        // TidyContact
        if (this.options.TidyContact)
            new TidyContact();
        // Translate Fields
        if (this.options.TranslateFields)
            new TranslateFields();
        // Country Disable
        new CountryDisable();
        // Premium Gift Features
        new PremiumGift();
        // Supporter Hub Features
        new SupporterHub();
        // Digital Wallets Features
        if (engrid_ENGrid.getPageType() === "DONATION") {
            new DigitalWallets();
        }
        // Mobile CTA
        new MobileCTA();
        // Live Frequency
        new LiveFrequency();
        // Universal Opt In
        new UniversalOptIn();
        // Plaid
        if (this.options.Plaid)
            new Plaid();
        // Give By Select
        new GiveBySelect();
        //Exit Intent Lightbox
        new ExitIntentLightbox();
        new UrlParamsToBodyAttrs();
        new SetAttr();
        new ShowIfPresent();
        new PostalCodeValidator();
        // Very Good Security
        new VGS();
        new WelcomeBack();
        new EcardToTarget();
        new UsOnlyForm();
        new ThankYouPageConditionalContent();
        new EmbeddedEcard();
        //Debug panel
        let showDebugPanel = this.options.Debug;
        try {
            // accessing storage can throw an exception if it isn't available in Firefox
            if (!showDebugPanel &&
                window.sessionStorage.hasOwnProperty(DebugPanel.debugSessionStorageKey)) {
                showDebugPanel = true;
            }
        }
        catch (e) { }
        if (showDebugPanel) {
            new DebugPanel(this.options.PageLayouts);
        }
        if (engrid_ENGrid.getUrlParameter("development") === "branding") {
            new BrandingHtml().show();
        }
        engrid_ENGrid.setBodyData("data-engrid-js-loading", "finished");
        window.EngridVersion = AppVersion;
        this.logger.success(`VERSION: ${AppVersion}`);
        // Window Load
        let onLoad = typeof window.onload === "function" ? window.onload : null;
        if (document.readyState !== "loading") {
            this.onLoad();
        }
        else {
            window.onload = (e) => {
                this.onLoad();
                if (onLoad) {
                    onLoad.bind(window, e);
                }
            };
        }
    }
    onLoad() {
        if (this.options.onLoad) {
            this.options.onLoad();
        }
    }
    onResize() {
        if (this.options.onResize) {
            this.options.onResize();
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
    }
    onError() {
        if (this.options.onError) {
            this.logger.danger("Client onError Triggered");
            this.options.onError();
        }
    }
    static log(message) {
        const logger = new EngridLogger("Client", "brown", "aliceblue", "🍪");
        logger.log(message);
    }
}

;// CONCATENATED MODULE: ./node_modules/@4site/engrid-scripts/dist/amount-label.js
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
        return !!(engrid_ENGrid.getPageType() === "DONATION" &&
            engrid_ENGrid.getOption("AddCurrencySymbol"));
    }
    // Fix Amount Labels
    fixAmountLabels() {
        let amounts = document.querySelectorAll(".en__field--donationAmt label");
        const currencySymbol = engrid_ENGrid.getCurrencySymbol() || "";
        amounts.forEach((element) => {
            if (!isNaN(element.innerText)) {
                element.innerText = currencySymbol + element.innerText;
            }
        });
    }
}

;// CONCATENATED MODULE: ./node_modules/@4site/engrid-scripts/dist/apple-pay.js
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
        if (!this._form.submit)
            return;
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

;// CONCATENATED MODULE: ./node_modules/@4site/engrid-scripts/dist/a11y.js
// a11y means accessibility
// This Component is supposed to be used as a helper for Aria Attributes & Other Accessibility Features
class A11y {
    constructor() {
        this.addRequired();
        this.addLabel();
        this.addGroupRole();
    }
    addGroupRole() {
        // Add role="group" to all EN Radio fields
        const radioFields = document.querySelectorAll(".en__field--radio");
        radioFields.forEach((field) => {
            field.setAttribute("role", "group");
            // Add random ID to the label
            const label = field.querySelector("label");
            if (label) {
                label.setAttribute("id", `en__field__label--${Math.random().toString(36).slice(2, 7)}`);
                field.setAttribute("aria-labelledby", label.id);
            }
        });
    }
    addRequired() {
        const mandatoryFields = document.querySelectorAll(".en__mandatory .en__field__input");
        mandatoryFields.forEach((field) => {
            field.setAttribute("aria-required", "true");
        });
    }
    addLabel() {
        const otherAmount = document.querySelector(".en__field__input--otheramount");
        if (otherAmount) {
            otherAmount.setAttribute("aria-label", "Enter your custom donation amount");
        }
        // Split selects usually don't have a label, so let's make the first option the label
        const splitSelects = document.querySelectorAll(".en__field__input--splitselect");
        splitSelects.forEach((select) => {
            var _a, _b, _c, _d;
            const firstOption = select.querySelector("option");
            if (firstOption &&
                firstOption.value === "" &&
                !((_b = (_a = firstOption.textContent) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === null || _b === void 0 ? void 0 : _b.includes("select")) &&
                !((_d = (_c = firstOption.textContent) === null || _c === void 0 ? void 0 : _c.toLowerCase()) === null || _d === void 0 ? void 0 : _d.includes("choose"))) {
                select.setAttribute("aria-label", firstOption.textContent || "");
            }
        });
    }
}

;// CONCATENATED MODULE: ./node_modules/@4site/engrid-scripts/dist/capitalize-fields.js
// CapitalizeFields is a class that capitalizes the first letter of the fields passed to it.
// It subscribes to the onSubmit event of the EnForm class and capitalizes the fields on submit.


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

;// CONCATENATED MODULE: ./node_modules/@4site/engrid-scripts/dist/auto-year.js
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
            [...this.yearField.options].forEach((option) => {
                var _a;
                if (option.value !== "" && !isNaN(Number(option.value))) {
                    // @ts-ignore
                    const index = [...this.yearField.options].findIndex((i) => i.value === option.value);
                    (_a = this.yearField) === null || _a === void 0 ? void 0 : _a.remove(index);
                }
            });
        }
    }
}

;// CONCATENATED MODULE: ./node_modules/@4site/engrid-scripts/dist/autocomplete.js
// This class adds the autocomplete attribute to
// the most common input elements

class Autocomplete {
    constructor() {
        this.logger = new EngridLogger("Autocomplete", "#330033", "#f0f0f0", "📇");
        this.autoCompleteField('[name="supporter.firstName"]', "given-name");
        this.autoCompleteField('[name="supporter.lastName"]', "family-name");
        this.autoCompleteField("#en__field_transaction_ccexpire", "cc-exp-month");
        this.autoCompleteField('[name="transaction.ccexpire"]:not(#en__field_transaction_ccexpire)', "cc-exp-year");
        this.autoCompleteField('[name="supporter.emailAddress"]', "email");
        this.autoCompleteField('[name="supporter.phoneNumber"]', "tel");
        this.autoCompleteField('[name="supporter.country"]', "country");
        this.autoCompleteField('[name="supporter.address1"]', "address-line1");
        this.autoCompleteField('[name="supporter.address2"]', "address-line2");
        this.autoCompleteField('[name="supporter.city"]', "address-level2");
        this.autoCompleteField('[name="supporter.region"]', "address-level1");
        this.autoCompleteField('[name="supporter.postcode"]', "postal-code");
        // Ignore Autocomplete on the Recipient Email Field & Address ("none" is intentional because "off" doesn't work)
        this.autoCompleteField('[name="transaction.honname"]', "none");
        this.autoCompleteField('[name="transaction.infemail"]', "none");
        this.autoCompleteField('[name="transaction.infname"]', "none");
        this.autoCompleteField('[name="transaction.infadd1"]', "none");
        this.autoCompleteField('[name="transaction.infadd2"]', "none");
        this.autoCompleteField('[name="transaction.infcity"]', "none");
        this.autoCompleteField('[name="transaction.infpostcd"]', "none");
    }
    autoCompleteField(querySelector, autoCompleteValue) {
        let field = document.querySelector(querySelector);
        if (field) {
            field.autocomplete = autoCompleteValue;
            return true;
        }
        if (autoCompleteValue !== "none")
            this.logger.log("Field Not Found", querySelector);
        return false;
    }
}

;// CONCATENATED MODULE: ./node_modules/@4site/engrid-scripts/dist/ecard.js

class Ecard {
    constructor() {
        this._form = EnForm.getInstance();
        this.logger = new EngridLogger("Ecard", "red", "#f5f5f5", "🪪");
        if (!this.shouldRun())
            return;
        this._form.onValidate.subscribe(() => this.checkRecipientFields());
        const schedule = engrid_ENGrid.getUrlParameter("engrid_ecard.schedule");
        const scheduleField = engrid_ENGrid.getField("ecard.schedule");
        const name = engrid_ENGrid.getUrlParameter("engrid_ecard.name");
        const nameField = document.querySelector(".en__ecardrecipients__name input");
        const email = engrid_ENGrid.getUrlParameter("engrid_ecard.email");
        const emailField = document.querySelector(".en__ecardrecipients__email input");
        if (schedule && scheduleField) {
            // Check if chedule date is in the past
            const scheduleDate = new Date(schedule.toString());
            const today = new Date();
            if (scheduleDate.setHours(0, 0, 0, 0) < today.setHours(0, 0, 0, 0)) {
                // If it is, set the schedule to today
                scheduleField.value = engrid_ENGrid.formatDate(today, "YYYY-MM-DD");
            }
            else {
                // Otherwise, set the schedule to the date provided
                scheduleField.value = schedule.toString();
            }
            this.logger.log("Schedule set to " + scheduleField.value);
        }
        if (name && nameField) {
            nameField.value = name.toString();
            this.logger.log("Name set to " + nameField.value);
        }
        if (email && emailField) {
            emailField.value = email.toString();
            this.logger.log("Email set to " + emailField.value);
        }
        // Replace the Future Delivery Label with a H2
        const futureDeliveryLabel = document.querySelector(".en__ecardrecipients__futureDelivery label");
        if (futureDeliveryLabel) {
            const futureDeliveryH2 = document.createElement("h2");
            futureDeliveryH2.innerText = futureDeliveryLabel.innerText;
            futureDeliveryLabel.replaceWith(futureDeliveryH2);
        }
        if (emailField) {
            emailField.setAttribute("type", "email");
            emailField.setAttribute("autocomplete", "off");
        }
    }
    shouldRun() {
        return engrid_ENGrid.getPageType() === "ECARD";
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

;// CONCATENATED MODULE: ./node_modules/@4site/engrid-scripts/dist/click-to-expand.js
// This class is used to expand content when a user clicks on a div with the class "click-to-expand".
// The content is shortened by default and will expand when clicked.

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

;// CONCATENATED MODULE: ./node_modules/@4site/engrid-scripts/dist/advocacy.js
// Component to handle advocacy features
// 1 - Adds EN Polyfill to support "label" clicking on Advocacy Recipient "labels"

class Advocacy {
    constructor() {
        this.logger = new EngridLogger("Advocacy", "#232323", "#f7b500", "👨‍⚖️");
        if (!this.shoudRun())
            return;
        this.setClickableLabels();
    }
    shoudRun() {
        return ["ADVOCACY", "EMAILTOTARGET"].includes(engrid_ENGrid.getPageType());
    }
    setClickableLabels() {
        const contactItems = document.querySelectorAll(".en__contactDetails__rows");
        if (!contactItems)
            return;
        contactItems.forEach((contact) => {
            contact.addEventListener("click", (e) => {
                this.toggleCheckbox(contact);
            });
        });
    }
    toggleCheckbox(contact) {
        const wrapper = contact.closest(".en__contactDetails");
        if (!wrapper)
            return;
        const checkbox = wrapper.querySelector("input[type='checkbox']");
        if (!checkbox)
            return;
        this.logger.log("toggleCheckbox", checkbox.checked);
        checkbox.checked = !checkbox.checked;
    }
}

;// CONCATENATED MODULE: ./node_modules/@4site/engrid-scripts/dist/data-attributes.js
// Component that adds data attributes to the Body

class DataAttributes {
    constructor() {
        this._country = Country.getInstance();
        this.setDataAttributes();
    }
    setDataAttributes() {
        // Add the Page Type as a Data Attribute on the Body Tag
        if (engrid_ENGrid.checkNested(window, "pageJson", "pageType")) {
            engrid_ENGrid.setBodyData("page-type", window.pageJson.pageType);
        }
        // Add the currency code as a Data Attribute on the Body Tag
        engrid_ENGrid.setBodyData("currency-code", engrid_ENGrid.getCurrencyCode());
        // Add a body banner data attribute if the banner contains no image or video
        if (!document.querySelector(".body-banner img, .body-banner video")) {
            engrid_ENGrid.setBodyData("body-banner", "empty");
        }
        // Add a page-alert data attribute if it is empty
        if (!document.querySelector(".page-alert *")) {
            engrid_ENGrid.setBodyData("no-page-alert", "");
        }
        // Add a content-header data attribute if it is empty
        if (!document.querySelector(".content-header *")) {
            engrid_ENGrid.setBodyData("no-content-header", "");
        }
        // Add a body-headerOutside data attribute if it is empty
        if (!document.querySelector(".body-headerOutside *")) {
            engrid_ENGrid.setBodyData("no-body-headerOutside", "");
        }
        // Add a body-header data attribute if it is empty
        if (!document.querySelector(".body-header *")) {
            engrid_ENGrid.setBodyData("no-body-header", "");
        }
        // Add a body-title data attribute if it is empty
        if (!document.querySelector(".body-title *")) {
            engrid_ENGrid.setBodyData("no-body-title", "");
        }
        // Add a body-banner data attribute if it is empty
        if (!document.querySelector(".body-banner *")) {
            engrid_ENGrid.setBodyData("no-body-banner", "");
        }
        // Add a body-bannerOverlay data attribute if it is empty
        if (!document.querySelector(".body-bannerOverlay *")) {
            engrid_ENGrid.setBodyData("no-body-bannerOverlay", "");
        }
        // Add a body-top data attribute if it is empty
        if (!document.querySelector(".body-top *")) {
            engrid_ENGrid.setBodyData("no-body-top", "");
        }
        // Add a body-main data attribute if it is empty
        if (!document.querySelector(".body-main *")) {
            engrid_ENGrid.setBodyData("no-body-main", "");
        }
        // Add a body-bottom data attribute if it is empty
        if (!document.querySelector(".body-bottom *")) {
            engrid_ENGrid.setBodyData("no-body-bottom", "");
        }
        // Add a body-footer data attribute if it is empty
        if (!document.querySelector(".body-footer *")) {
            engrid_ENGrid.setBodyData("no-body-footer", "");
        }
        // Add a body-footerOutside data attribute if it is empty
        if (!document.querySelector(".body-footerOutside *")) {
            engrid_ENGrid.setBodyData("no-body-footerOutside", "");
        }
        // Add a content-footerSpacer data attribute if it is empty
        if (!document.querySelector(".content-footerSpacer *")) {
            engrid_ENGrid.setBodyData("no-content-footerSpacer", "");
        }
        // Add a content-preFooter data attribute if it is empty
        if (!document.querySelector(".content-preFooter *")) {
            engrid_ENGrid.setBodyData("no-content-preFooter", "");
        }
        // Add a content-footer data attribute if it is empty
        if (!document.querySelector(".content-footer *")) {
            engrid_ENGrid.setBodyData("no-content-footer", "");
        }
        // Add a page-backgroundImage banner data attribute if the page background image contains no image or video
        if (!document.querySelector(".page-backgroundImage img, .page-backgroundImage video")) {
            engrid_ENGrid.setBodyData("no-page-backgroundImage", "");
        }
        // Add a page-backgroundImageOverlay data attribute if it is empty
        if (!document.querySelector(".page-backgroundImageOverlay *")) {
            engrid_ENGrid.setBodyData("no-page-backgroundImageOverlay", "");
        }
        // Add a page-customCode data attribute if it is empty
        if (!document.querySelector(".page-customCode *")) {
            engrid_ENGrid.setBodyData("no-page-customCode", "");
        }
        // Add a country data attribute
        if (this._country.country) {
            engrid_ENGrid.setBodyData("country", this._country.country);
            this._country.onCountryChange.subscribe((country) => {
                engrid_ENGrid.setBodyData("country", country);
            });
        }
        const otherAmountDiv = document.querySelector(".en__field--donationAmt .en__field__item--other");
        if (otherAmountDiv) {
            otherAmountDiv.setAttribute("data-currency-symbol", engrid_ENGrid.getCurrencySymbol());
        }
        // Add a payment type data attribute
        const paymentTypeSelect = engrid_ENGrid.getField("transaction.paymenttype");
        if (paymentTypeSelect) {
            engrid_ENGrid.setBodyData("payment-type", paymentTypeSelect.value);
            paymentTypeSelect.addEventListener("change", () => {
                engrid_ENGrid.setBodyData("payment-type", paymentTypeSelect.value);
            });
        }
        // Footer in Viewport Check
        const contentFooter = document.querySelector(".content-footer");
        if (contentFooter && engrid_ENGrid.isInViewport(contentFooter)) {
            engrid_ENGrid.setBodyData("footer-above-fold", "");
        }
        else {
            engrid_ENGrid.setBodyData("footer-below-fold", "");
        }
        // Add demo data attribute
        if (engrid_ENGrid.demo)
            engrid_ENGrid.setBodyData("demo", "");
    }
}

;// CONCATENATED MODULE: ./node_modules/@4site/engrid-scripts/dist/iframe.js


class iFrame {
    constructor() {
        this._form = EnForm.getInstance();
        this.logger = new EngridLogger("iFrame", "brown", "gray", "📡");
        if (this.inIframe()) {
            // Add the data-engrid-embedded attribute when inside an iFrame if it wasn't already added by a script in the Page Template
            engrid_ENGrid.setBodyData("embedded", "");
            // Fire the resize event
            this.logger.log("iFrame Event - Begin Resizing");
            window.addEventListener("load", (event) => {
                // Scroll to top of iFrame
                this.logger.log("iFrame Event - window.onload");
                this.sendIframeHeight();
                window.parent.postMessage({
                    scroll: this.shouldScroll(),
                }, "*");
                // On click fire the resize event
                document.addEventListener("click", (e) => {
                    this.logger.log("iFrame Event - click");
                    setTimeout(() => {
                        this.sendIframeHeight();
                    }, 100);
                });
            });
            window.setTimeout(() => {
                this.sendIframeHeight();
            }, 300);
            window.addEventListener("resize", this.debounceWithImmediate(() => {
                this.logger.log("iFrame Event - window resized");
                this.sendIframeHeight();
            }));
            // Listen for the form submit event
            this._form.onSubmit.subscribe((e) => {
                this.logger.log("iFrame Event - onSubmit");
                this.sendIframeFormStatus("submit");
            });
            // If the iFrame is Chained, check if the form has data
            if (this.isChained() && engrid_ENGrid.getPaymentType()) {
                this.logger.log("iFrame Event - Chained iFrame");
                this.sendIframeFormStatus("chained");
                this.hideFormComponents();
                this.addChainedBanner();
            }
            // Remove the skip link markup when inside an iFrame
            const skipLink = document.querySelector(".skip-link");
            if (skipLink) {
                skipLink.remove();
            }
            this._form.onError.subscribe(() => {
                // Get the first .en__field--validationFailed element
                const firstError = document.querySelector(".en__field--validationFailed");
                // Send scrollTo message
                // Parent pages listens for this message and scrolls to the correct position
                const scrollTo = firstError
                    ? firstError.getBoundingClientRect().top
                    : 0;
                this.logger.log(`iFrame Event 'scrollTo' - Position of top of first error ${scrollTo} px`); // check the message is being sent correctly
                window.parent.postMessage({ scrollTo }, "*");
            });
        }
        else {
            // When not in iframe, default behaviour, smooth scroll to first error
            this._form.onError.subscribe(() => {
                // Smooth Scroll to the first .en__field--validationFailed element
                const firstError = document.querySelector(".en__field--validationFailed");
                if (firstError) {
                    firstError.scrollIntoView({ behavior: "smooth" });
                }
            });
            // Parent Page Logic (when an ENgrid form is embedded in an ENgrid page)
            window.addEventListener("message", (event) => {
                const iframe = this.getIFrameByEvent(event);
                if (iframe) {
                    if (event.data.hasOwnProperty("frameHeight")) {
                        iframe.style.height = event.data.frameHeight + "px";
                    }
                    // Old scroll event logic "scroll", scrolls to correct iframe?
                    else if (event.data.hasOwnProperty("scroll") &&
                        event.data.scroll > 0) {
                        const elDistanceToTop = window.pageYOffset + iframe.getBoundingClientRect().top;
                        let scrollTo = elDistanceToTop + event.data.scroll;
                        window.scrollTo({
                            top: scrollTo,
                            left: 0,
                            behavior: "smooth",
                        });
                        this.logger.log("iFrame Event - Scrolling Window to " + scrollTo);
                    }
                    // New scroll event logic "scrollTo", scrolls to the first error
                    else if (event.data.hasOwnProperty("scrollTo")) {
                        const scrollToPosition = event.data.scrollTo +
                            window.scrollY +
                            iframe.getBoundingClientRect().top;
                        window.scrollTo({
                            top: scrollToPosition,
                            left: 0,
                            behavior: "smooth",
                        });
                        this.logger.log("iFrame Event - Scrolling Window to " + scrollToPosition);
                    }
                }
            });
        }
    }
    sendIframeHeight() {
        let height = document.body.offsetHeight;
        this.logger.log("iFrame Event - Sending iFrame height of: " + height + "px"); // check the message is being sent correctly
        window.parent.postMessage({
            frameHeight: height,
            pageNumber: engrid_ENGrid.getPageNumber(),
            pageCount: engrid_ENGrid.getPageCount(),
            giftProcess: engrid_ENGrid.getGiftProcess(),
        }, "*");
    }
    sendIframeFormStatus(status) {
        window.parent.postMessage({
            status: status,
            pageNumber: engrid_ENGrid.getPageNumber(),
            pageCount: engrid_ENGrid.getPageCount(),
            giftProcess: engrid_ENGrid.getGiftProcess(),
        }, "*");
    }
    getIFrameByEvent(event) {
        return [].slice
            .call(document.getElementsByTagName("iframe"))
            .filter((iframe) => {
            return iframe.contentWindow === event.source;
        })[0];
    }
    shouldScroll() {
        // If you find a error, scroll
        if (document.querySelector(".en__errorHeader")) {
            return true;
        }
        // If it's a chained iFrame, don't scroll
        if (this.isChained()) {
            return false;
        }
        // Try to match the iframe referrer URL by testing valid EN Page URLs
        let referrer = document.referrer;
        let enURLPattern = new RegExp(/^(.*)\/(page)\/(\d+.*)/);
        // Scroll if the Regex matches, don't scroll otherwise
        return enURLPattern.test(referrer);
    }
    inIframe() {
        try {
            return window.self !== window.top;
        }
        catch (e) {
            return true;
        }
    }
    isChained() {
        return !!engrid_ENGrid.getUrlParameter("chain");
    }
    hideFormComponents() {
        this.logger.log("iFrame Event - Hiding Form Components");
        const en__component = document.querySelectorAll(".body-main > div");
        en__component.forEach((component, index) => {
            if (component.classList.contains("hide") === false &&
                component.classList.contains("hide-iframe") === false &&
                component.classList.contains("radio-to-buttons_donationAmt") ===
                    false &&
                index < en__component.length - 1) {
                component.classList.add("hide-iframe");
                component.classList.add("hide-chained");
            }
        });
        this.sendIframeHeight();
    }
    showFormComponents() {
        this.logger.log("iFrame Event - Showing Form Components");
        const en__component = document.querySelectorAll(".body-main > div.hide-chained");
        en__component.forEach((component) => {
            component.classList.remove("hide-iframe");
            component.classList.remove("hide-chained");
        });
        this.sendIframeHeight();
    }
    addChainedBanner() {
        var _a, _b;
        this.logger.log("iFrame Event - Adding Chained Banner");
        const banner = document.createElement("div");
        const lastComponent = document.querySelector(".body-main > div:last-of-type");
        banner.classList.add("en__component");
        banner.classList.add("en__component--banner");
        banner.classList.add("en__component--banner--chained");
        banner.innerHTML = `<div class="en__component__content"><div class="en__component__content__inner"><div class="en__component__content__text"><p>
      Giving as <strong>${engrid_ENGrid.getFieldValue("supporter.firstName")} ${engrid_ENGrid.getFieldValue("supporter.lastName")}</strong> 
      with <strong>${engrid_ENGrid.getFieldValue("transaction.paymenttype").toUpperCase()}</strong>
      (<a href="#" class="en__component__content__link">change</a>)</p></div></div></div>`;
        (_a = lastComponent === null || lastComponent === void 0 ? void 0 : lastComponent.parentNode) === null || _a === void 0 ? void 0 : _a.insertBefore(banner, lastComponent);
        (_b = banner
            .querySelector(".en__component__content__link")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", (e) => {
            e.preventDefault();
            this.showFormComponents();
            banner.remove();
        });
    }
    debounceWithImmediate(func, timeout = 1000) {
        let timer;
        let firstEvent = true;
        return (...args) => {
            clearTimeout(timer);
            if (firstEvent) {
                func.apply(this, args);
                firstEvent = false;
            }
            timer = setTimeout(() => {
                func.apply(this, args);
                firstEvent = true;
            }, timeout);
        };
    }
}

;// CONCATENATED MODULE: ./node_modules/@4site/engrid-scripts/dist/input-has-value-and-focus.js
// Component that adds has-value and has-focus classes to form inputs

class InputHasValueAndFocus {
    constructor() {
        this.logger = new EngridLogger("InputHasValueAndFocus", "yellow", "#333", "🌈");
        this.formInputs = document.querySelectorAll(".en__field--text, .en__field--email:not(.en__field--checkbox), .en__field--telephone, .en__field--number, .en__field--textarea, .en__field--select, .en__field--checkbox");
        if (this.shouldRun()) {
            this.run();
        }
    }
    shouldRun() {
        return this.formInputs.length > 0;
    }
    run() {
        this.formInputs.forEach((el) => {
            const input = el.querySelector("input, textarea, select");
            if (input && input.value) {
                el.classList.add("has-value");
            }
            this.bindEvents(el);
        });
    }
    bindEvents(el) {
        const input = el.querySelector("input, textarea, select");
        if (!input) {
            return;
        }
        input.addEventListener("focus", () => {
            this.log("Focus added", input);
            el.classList.add("has-focus");
        });
        input.addEventListener("blur", () => {
            this.log("Focus removed", input);
            el.classList.remove("has-focus");
        });
        input.addEventListener("input", () => {
            if (input.value) {
                this.log("Value added", input);
                el.classList.add("has-value");
            }
            else {
                this.log("Value removed", input);
                el.classList.remove("has-value");
            }
        });
    }
    log(message, input) {
        this.logger.log(`${message} on ${input.name}: ${input.value}`);
    }
}

;// CONCATENATED MODULE: ./node_modules/@4site/engrid-scripts/dist/input-placeholders.js
// Component that adds input placeholders
// You can override the default placeholders by adding a Placeholders option to the EngridOptions on the client theme.
// You can also add an EngridPageOptions override to the page, if you want to override the placeholders on a specific page. Example:
// <script type="text/javascript">
//   EngridPageOptions = {
//     Placeholders: {
//       "input#en__field_supporter_firstName": "Nome",
//       "input#en__field_supporter_lastName": "Sobrenome"
//     }
//   };
// </script>

class InputPlaceholders {
    constructor() {
        this.defaultPlaceholders = {
            "input#en__field_supporter_firstName": "First Name",
            "input#en__field_supporter_lastName": "Last Name",
            "input#en__field_supporter_emailAddress": "Email Address",
            "input#en__field_supporter_phoneNumber": "Phone Number (Optional)",
            ".en__mandatory input#en__field_supporter_phoneNumber": "Phone Number",
            "input#en__field_supporter_phoneNumber2": "000-000-0000 (Optional)",
            ".en__mandatory input#en__field_supporter_phoneNumber2": "000-000-0000",
            "input#en__field_supporter_country": "Country",
            "input#en__field_supporter_address1": "Street Address",
            "input#en__field_supporter_address2": "Apt., Ste., Bldg.",
            "input#en__field_supporter_city": "City",
            "input#en__field_supporter_region": "Region",
            "input#en__field_supporter_postcode": "ZIP Code",
            ".en__field--donationAmt.en__field--withOther .en__field__input--other": "Other",
            "input#en__field_transaction_ccexpire": "MM / YY",
            "input#en__field_supporter_bankAccountNumber": "Bank Account Number",
            "input#en__field_supporter_bankRoutingNumber": "Bank Routing Number",
            "input#en__field_transaction_honname": "Honoree Name",
            "input#en__field_transaction_infname": "Recipient Name",
            "input#en__field_transaction_infemail": "Recipient Email Address",
            "input#en__field_transaction_infcountry": "Country",
            "input#en__field_transaction_infadd1": "Recipient Street Address",
            "input#en__field_transaction_infadd2": "Recipient Apt., Ste., Bldg.",
            "input#en__field_transaction_infcity": "Recipient City",
            "input#en__field_transaction_infpostcd": "Recipient Postal Code",
            "input#en__field_transaction_gftrsn": "Reason for your gift",
            "input#en__field_transaction_shipfname": "Shipping First Name",
            "input#en__field_transaction_shiplname": "Shipping Last Name",
            "input#en__field_transaction_shipemail": "Shipping Email Address",
            "input#en__field_transaction_shipcountry": "Shipping Country",
            "input#en__field_transaction_shipadd1": "Shipping Street Address",
            "input#en__field_transaction_shipadd2": "Shipping Apt., Ste., Bldg.",
            "input#en__field_transaction_shipcity": "Shipping City",
            "input#en__field_transaction_shipregion": "Shipping Region",
            "input#en__field_transaction_shippostcode": "Shipping Postal Code",
            "input#en__field_supporter_billingCountry": "Billing Country",
            "input#en__field_supporter_billingAddress1": "Billing Street Address",
            "input#en__field_supporter_billingAddress2": "Billing Apt., Ste., Bldg.",
            "input#en__field_supporter_billingCity": "Billing City",
            "input#en__field_supporter_billingRegion": "Billing Region",
            "input#en__field_supporter_billingPostcode": "Billing Postal Code",
        };
        if (this.shouldRun()) {
            // If there's a Placeholders option, merge it with the default placeholders
            const placeholders = engrid_ENGrid.getOption("Placeholders");
            if (placeholders) {
                this.defaultPlaceholders = Object.assign(Object.assign({}, this.defaultPlaceholders), placeholders);
            }
            this.run();
        }
    }
    shouldRun() {
        return engrid_ENGrid.hasBodyData("add-input-placeholders");
    }
    run() {
        Object.keys(this.defaultPlaceholders).forEach((selector) => {
            if (selector in this.defaultPlaceholders)
                this.addPlaceholder(selector, this.defaultPlaceholders[selector]);
        });
    }
    addPlaceholder(selector, placeholder) {
        const fieldEl = document.querySelector(selector);
        if (fieldEl) {
            fieldEl.placeholder = placeholder;
        }
    }
}

;// CONCATENATED MODULE: ./node_modules/@4site/engrid-scripts/dist/media-attribution.js
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

const tippy = (__webpack_require__(9244)/* ["default"] */ .Ay);
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
                    const attributionSourceTooltip = "attributionSourceTooltip" in mediaWithAttributionElement.dataset
                        ? mediaWithAttributionElement.dataset.attributionSourceTooltip
                        : false;
                    if (attributionSourceTooltip) {
                        tippy(mediaWithAttributionElement.nextSibling, {
                            content: attributionSourceTooltip,
                            arrow: true,
                            arrowType: "default",
                            placement: "left",
                            trigger: "click mouseenter focus",
                            interactive: true,
                        });
                    }
                }
            }
        });
    }
}

;// CONCATENATED MODULE: ./node_modules/@4site/engrid-scripts/dist/live-variables.js


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
        this._frequency.onFrequencyChange.subscribe(() => this.changeLiveFrequency());
        this._frequency.onFrequencyChange.subscribe(() => this.changeRecurrency());
        this._frequency.onFrequencyChange.subscribe(() => this.changeSubmitButton());
        this._form.onSubmit.subscribe(() => {
            if (engrid_ENGrid.getPageType() !== "SUPPORTERHUB")
                engrid_ENGrid.disableSubmit("Processing...");
        });
        this._form.onError.subscribe(() => engrid_ENGrid.enableSubmit());
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
        const symbol = (_a = engrid_ENGrid.getCurrencySymbol()) !== null && _a !== void 0 ? _a : "$";
        const dec_separator = (_b = this.options.DecimalSeparator) !== null && _b !== void 0 ? _b : ".";
        const thousands_separator = (_c = this.options.ThousandsSeparator) !== null && _c !== void 0 ? _c : "";
        const dec_places = amount % 1 == 0 ? 0 : (_d = this.options.DecimalPlaces) !== null && _d !== void 0 ? _d : 2;
        const amountTxt = engrid_ENGrid.formatNumber(amount, dec_places, dec_separator, thousands_separator);
        return amount > 0
            ? (`<span class="live-variable-currency">${symbol}</span><span class="live-variable-amount">${amountTxt}</span>`)
            : "";
    }
    getUpsellAmountTxt(amount = 0) {
        var _a, _b, _c, _d;
        const symbol = (_a = engrid_ENGrid.getCurrencySymbol()) !== null && _a !== void 0 ? _a : "$";
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
            label = label.replace("$FREQUENCY", `<span class="live-variable-frequency">${frequency}</span>`);
        }
        else {
            label = label.replace("$AMOUNT", "");
            label = label.replace("$FREQUENCY", "");
        }
        if (submit && label) {
            submit.innerHTML = label;
        }
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

;// CONCATENATED MODULE: ./node_modules/@4site/engrid-scripts/dist/upsell-lightbox.js


class UpsellLightbox {
    constructor() {
        this.overlay = document.createElement("div");
        this._form = EnForm.getInstance();
        this._amount = DonationAmount.getInstance();
        this._fees = ProcessingFees.getInstance();
        this._frequency = DonationFrequency.getInstance();
        this._dataLayer = DataLayer.getInstance();
        this._suggestAmount = 0;
        this.logger = new EngridLogger("UpsellLightbox", "black", "pink", "🪟");
        let options = "EngridUpsell" in window ? window.EngridUpsell : {};
        this.options = Object.assign(Object.assign({}, UpsellOptionsDefaults), options);
        //Disable for "applepay" via Vantiv payment method. Adding it to the array like this so it persists
        //even if the client provides custom options.
        this.options.disablePaymentMethods.push("applepay");
        if (!this.shouldRun()) {
            this.logger.log("Upsell script should NOT run");
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
            .replace("{old-amount}", "<span class='upsell_amount'></span>")
            .replace("{old-frequency}", "<span class='upsell_frequency'></span>");
        const paragraph = this.options.paragraph
            .replace("{new-amount}", "<span class='upsell_suggestion'></span>")
            .replace("{old-amount}", "<span class='upsell_amount'></span>")
            .replace("{old-frequency}", "<span class='upsell_frequency'></span>");
        const yes = this.options.yesLabel
            .replace("{new-amount}", "<span class='upsell_suggestion'></span>")
            .replace("{old-amount}", "<span class='upsell_amount'></span>")
            .replace("{old-frequency}", "<span class='upsell_frequency'></span>");
        const no = this.options.noLabel
            .replace("{new-amount}", "<span class='upsell_suggestion'></span>")
            .replace("{old-amount}", "<span class='upsell_amount'></span>")
            .replace("{old-frequency}", "<span class='upsell_frequency'></span>");
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
                    <input href="#" id="secondOtherField" name="secondOtherField" type="text" value="" inputmode="decimal" aria-label="Enter your custom donation amount" autocomplete="off" data-lpignore="true" aria-required="true" size="12">
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
        this.logger.log("Upsell script rendered");
    }
    // Should we run the script?
    shouldRun() {
        // if it's a first page of a Donation page
        return (
        // !hideModal &&
        !this.shouldSkip() &&
            "EngridUpsell" in window &&
            !!window.pageJson &&
            window.pageJson.pageNumber == 1 &&
            ["donation", "premiumgift"].includes(window.pageJson.pageType));
    }
    shouldSkip() {
        if ("EngridUpsell" in window && window.EngridUpsell.skipUpsell) {
            return true;
        }
        return this.options.skipUpsell;
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
    liveFrequency() {
        const live_upsell_frequency = document.querySelectorAll(".upsell_frequency");
        live_upsell_frequency.forEach((elem) => (elem.innerHTML = this.getFrequencyTxt()));
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
                if (upsellAmount === 0)
                    return 0;
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
        const upsellAmount = this.getUpsellAmount();
        const paymenttype = engrid_ENGrid.getFieldValue("transaction.paymenttype") || "";
        this._suggestAmount = upsellAmount;
        // If frequency is not onetime or
        // the modal is already opened or
        // there's no suggestion for this donation amount,
        // we should not open
        if (this.freqAllowed() &&
            !this.shouldSkip() &&
            !this.options.disablePaymentMethods.includes(paymenttype.toLowerCase()) &&
            !this.overlay.classList.contains("is-submitting") &&
            upsellAmount > 0) {
            this.logger.log("Upsell Frequency " + this._frequency.frequency);
            this.logger.log("Upsell Amount " + this._amount.amount);
            this.logger.log("Upsell Suggested Amount " + upsellAmount);
            return true;
        }
        return false;
    }
    // Return true if the current frequency is allowed by the options
    freqAllowed() {
        const freq = this._frequency.frequency;
        const allowed = [];
        if (this.options.oneTime)
            allowed.push("onetime");
        if (this.options.annual)
            allowed.push("annual");
        return allowed.includes(freq);
    }
    open() {
        this.logger.log("Upsell script opened");
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
        this.liveFrequency();
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
            this.logger.success("Upsold");
            this.setOriginalAmount(this._amount.amount.toString());
            const upsoldAmount = this.getUpsellAmount();
            const originalAmount = this._amount.amount;
            this._frequency.setFrequency("monthly");
            this._amount.setAmount(upsoldAmount);
            this._dataLayer.addEndOfGiftProcessEvent("ENGRID_UPSELL", {
                eventValue: true,
                originalAmount: originalAmount,
                upsoldAmount: upsoldAmount,
                frequency: "monthly",
            });
            this._dataLayer.addEndOfGiftProcessVariable("ENGRID_UPSELL", true);
            this._dataLayer.addEndOfGiftProcessVariable("ENGRID_UPSELL_ORIGINAL_AMOUNT", originalAmount);
            this._dataLayer.addEndOfGiftProcessVariable("ENGRID_UPSELL_DONATION_FREQUENCY", "MONTHLY");
            this.renderConversionField("upsellSuccess", "onetime", originalAmount, "monthly", this._suggestAmount, "monthly", upsoldAmount);
        }
        else {
            this.setOriginalAmount("");
            window.sessionStorage.removeItem("original");
            this._dataLayer.addEndOfGiftProcessVariable("ENGRID_UPSELL", false);
            this._dataLayer.addEndOfGiftProcessVariable("ENGRID_UPSELL_DONATION_FREQUENCY", "ONE-TIME");
            this.renderConversionField("upsellFail", this._frequency.frequency, this._amount.amount, "monthly", this._suggestAmount, this._frequency.frequency, this._amount.amount);
        }
        this._form.submitForm();
    }
    // Close the lightbox
    close(e) {
        e.preventDefault();
        this.overlay.classList.add("is-hidden");
        engrid_ENGrid.setBodyData("has-lightbox", false);
        if (this.options.submitOnClose) {
            this.renderConversionField("upsellFail", this._frequency.frequency, this._amount.amount, "monthly", this._suggestAmount, this._frequency.frequency, this._amount.amount);
            this._form.submitForm();
        }
        else {
            this._form.dispatchError();
        }
    }
    getAmountTxt(amount = 0) {
        var _a, _b, _c, _d;
        const symbol = (_a = engrid_ENGrid.getCurrencySymbol()) !== null && _a !== void 0 ? _a : "$";
        const dec_separator = (_b = engrid_ENGrid.getOption("DecimalSeparator")) !== null && _b !== void 0 ? _b : ".";
        const thousands_separator = (_c = engrid_ENGrid.getOption("ThousandsSeparator")) !== null && _c !== void 0 ? _c : "";
        const dec_places = amount % 1 == 0 ? 0 : (_d = engrid_ENGrid.getOption("DecimalPlaces")) !== null && _d !== void 0 ? _d : 2;
        const amountTxt = engrid_ENGrid.formatNumber(amount, dec_places, dec_separator, thousands_separator);
        return amount > 0 ? symbol + amountTxt : "";
    }
    getFrequencyTxt() {
        const freqTxt = {
            onetime: "one-time",
            monthly: "monthly",
            annual: "annual",
        };
        const frequency = this._frequency.frequency;
        return frequency in freqTxt ? freqTxt[frequency] : frequency;
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
    renderConversionField(event, // The event that triggered the conversion
    freq, // The frequency of the donation (onetime, monthly, annual)
    amt, // The original amount of the donation (before the upsell)
    sugFreq, // The suggested frequency of the upsell (monthly)
    sugAmt, // The suggested amount of the upsell
    subFreq, // The submitted frequency of the upsell (onetime, monthly, annual)
    subAmt // The submitted amount of the upsell
    ) {
        if (this.options.conversionField === "")
            return;
        const conversionField = document.querySelector("input[name='" + this.options.conversionField + "']") ||
            engrid_ENGrid.createHiddenInput(this.options.conversionField);
        if (!conversionField) {
            this.logger.error("Could not find or create the conversion field");
            return;
        }
        const conversionValue = `event:${event},freq:${freq},amt:${amt},sugFreq:${sugFreq},sugAmt:${sugAmt},subFreq:${subFreq},subAmt:${subAmt}`;
        conversionField.value = conversionValue;
        this.logger.log(`Conversion Field ${event}`, conversionValue);
    }
}

;// CONCATENATED MODULE: ./node_modules/@4site/engrid-scripts/dist/show-hide-radio-checkboxes.js

class ShowHideRadioCheckboxes {
    // Create default data attributes on all fields
    createDataAttributes() {
        this.elements.forEach((item) => {
            if (item instanceof HTMLInputElement) {
                let inputValue = item.value.replace(/\W/g, "");
                document
                    .querySelectorAll("." + this.classes + inputValue)
                    .forEach((el) => {
                    // Consider toggling "hide" class so these fields can be displayed when in a debug state
                    if (el instanceof HTMLElement) {
                        const fields = el.querySelectorAll("input[type='text'], input[type='number'], input[type='email'], select, textarea");
                        if (fields.length > 0) {
                            fields.forEach((field) => {
                                if (field instanceof HTMLInputElement ||
                                    field instanceof HTMLSelectElement) {
                                    if (!field.hasAttribute("data-original-value")) {
                                        field.setAttribute("data-original-value", field.value);
                                    }
                                    if (!field.hasAttribute("data-value")) {
                                        field.setAttribute("data-value", field.value);
                                    }
                                }
                            });
                        }
                    }
                });
            }
        });
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
        let inputValue = item.value.replace(/\W/g, "");
        document.querySelectorAll("." + this.classes + inputValue).forEach((el) => {
            // Consider toggling "hide" class so these fields can be displayed when in a debug state
            if (el instanceof HTMLElement) {
                this.toggleValue(el, "hide");
                el.style.display = "none";
                this.logger.log("Hiding", el);
            }
        });
    }
    // Show Single Element Div
    show(item) {
        let inputValue = item.value.replace(/\W/g, "");
        document.querySelectorAll("." + this.classes + inputValue).forEach((el) => {
            // Consider toggling "hide" class so these fields can be displayed when in a debug state
            if (el instanceof HTMLElement) {
                this.toggleValue(el, "show");
                el.style.display = "";
                this.logger.log("Showing", el);
            }
        });
        if (item.type == "checkbox" && !item.checked) {
            this.hide(item);
        }
    }
    // Take the field values and add to a data attribute on the field
    toggleValue(item, type) {
        if (type == "hide" && !engrid_ENGrid.isVisible(item))
            return;
        this.logger.log(`toggleValue: ${type}`);
        const fields = item.querySelectorAll("input[type='text'], input[type='number'], input[type='email'], select, textarea");
        if (fields.length > 0) {
            fields.forEach((field) => {
                var _a;
                if (field instanceof HTMLInputElement ||
                    field instanceof HTMLSelectElement) {
                    if (field.name) {
                        const fieldValue = engrid_ENGrid.getFieldValue(field.name);
                        const originalValue = field.getAttribute("data-original-value");
                        const dataValue = (_a = field.getAttribute("data-value")) !== null && _a !== void 0 ? _a : "";
                        if (type === "hide") {
                            field.setAttribute("data-value", fieldValue);
                            engrid_ENGrid.setFieldValue(field.name, originalValue);
                        }
                        else {
                            engrid_ENGrid.setFieldValue(field.name, dataValue);
                        }
                    }
                }
            });
        }
    }
    getSessionState() {
        var _a;
        try {
            const plainState = (_a = window.sessionStorage.getItem(`engrid_ShowHideRadioCheckboxesState`)) !== null && _a !== void 0 ? _a : "";
            return JSON.parse(plainState);
        }
        catch (err) {
            return [];
        }
    }
    storeSessionState() {
        const state = this.getSessionState();
        [...this.elements].forEach((element) => {
            var _a, _b;
            if (!(element instanceof HTMLInputElement))
                return;
            if (element.type == "radio" && element.checked) {
                //remove other items that have the same "class" property
                state.forEach((item, index) => {
                    if (item.class == this.classes) {
                        state.splice(index, 1);
                    }
                });
                //add the current item, with the currently active value
                state.push({
                    page: engrid_ENGrid.getPageID(),
                    class: this.classes,
                    value: element.value,
                });
                this.logger.log("storing radio state", state[state.length - 1]);
            }
            if (element.type == "checkbox") {
                //remove other items that have the same "class" property
                state.forEach((item, index) => {
                    if (item.class == this.classes) {
                        state.splice(index, 1);
                    }
                });
                //add the current item, with the first checked value or "N" if none are checked
                state.push({
                    page: engrid_ENGrid.getPageID(),
                    class: this.classes,
                    value: (_b = (_a = [...this.elements].find((el) => el.checked)) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : "N", // First checked value or "N" if none
                });
                this.logger.log("storing checkbox state", state[state.length - 1]);
            }
        });
        window.sessionStorage.setItem(`engrid_ShowHideRadioCheckboxesState`, JSON.stringify(state));
    }
    constructor(elements, classes) {
        this.logger = new EngridLogger("ShowHideRadioCheckboxes", "black", "lightblue", "👁");
        this.elements = document.getElementsByName(elements);
        this.classes = classes;
        this.createDataAttributes();
        this.hideAll();
        this.storeSessionState();
        for (let i = 0; i < this.elements.length; i++) {
            let element = this.elements[i];
            if (element.checked) {
                this.show(element);
            }
            element.addEventListener("change", (e) => {
                this.hideAll();
                this.show(element);
                this.storeSessionState();
            });
        }
    }
}

;// CONCATENATED MODULE: ./node_modules/@4site/engrid-scripts/dist/cookie.js
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

;// CONCATENATED MODULE: ./node_modules/@4site/engrid-scripts/dist/translate-fields.js
// Component to translate fields based on the country selected
// It will also adapt the state field to the country selected


class TranslateFields {
    constructor() {
        this.countryToStateFields = {
            "supporter.country": "supporter.region",
            "transaction.shipcountry": "transaction.shipregion",
            "supporter.billingCountry": "supporter.billingRegion",
            "transaction.infcountry": "transaction.infreg",
        };
        this.countriesSelect = document.querySelectorAll('select[name="supporter.country"], select[name="transaction.shipcountry"], select[name="supporter.billingCountry"], select[name="transaction.infcountry"]');
        let options = "EngridTranslate" in window ? window.EngridTranslate : {};
        this.options = TranslateOptionsDefaults;
        // Don't run this for US-only forms.
        if (document.querySelector(".en__component--formblock.us-only-form .en__field--country")) {
            return;
        }
        if (options) {
            for (let key in options) {
                this.options[key] = this.options[key]
                    ? [...this.options[key], ...options[key]]
                    : options[key];
            }
        }
        //Storing these values on load so we can set them back after the translation/swap.
        let countryAndStateValuesOnLoad = {};
        if (this.countriesSelect) {
            this.countriesSelect.forEach((select) => {
                select.addEventListener("change", this.translateFields.bind(this, select.name));
                if (select.value) {
                    countryAndStateValuesOnLoad[select.name] = select.value;
                }
                const stateField = document.querySelector(`select[name="${this.countryToStateFields[select.name]}"]`);
                if (stateField) {
                    stateField.addEventListener("change", this.rememberState.bind(this, select.name));
                    if (stateField.value) {
                        countryAndStateValuesOnLoad[stateField.name] = stateField.value;
                    }
                }
            });
            this.translateFields("supporter.country");
            //dont set these back if submission failed. EN / cookie will handle it.
            const submissionFailed = !!(engrid_ENGrid.checkNested(window.EngagingNetworks, "require", "_defined", "enjs", "checkSubmissionFailed") &&
                window.EngagingNetworks.require._defined.enjs.checkSubmissionFailed());
            if (!submissionFailed) {
                for (let field in countryAndStateValuesOnLoad) {
                    engrid_ENGrid.setFieldValue(field, countryAndStateValuesOnLoad[field], false);
                }
            }
        }
    }
    translateFields(countryName = "supporter.country") {
        this.resetTranslatedFields();
        const countryValue = engrid_ENGrid.getFieldValue(countryName);
        // Translate the State Field
        this.setStateField(countryValue, this.countryToStateFields[countryName]);
        if (countryName === "supporter.country") {
            if (countryValue in this.options) {
                this.options[countryValue].forEach((field) => {
                    // console.log(field);
                    this.translateField(field.field, field.translation);
                });
            }
            // Translate the "To:"
            const recipient_block = document.querySelectorAll(".recipient-block");
            if (!!recipient_block.length) {
                switch (countryValue) {
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
        }
    }
    translateField(name, translation) {
        const field = document.querySelector(`[name="${name}"]`);
        if (field) {
            const fieldWrapper = field.closest(".en__field");
            if (fieldWrapper) {
                const fieldLabel = fieldWrapper.querySelector(".en__field__label");
                // Check if there's the simple country select class
                const simplecountriesSelect = fieldLabel.querySelector(".engrid-simple-country");
                let simplecountriesSelectClone = simplecountriesSelect
                    ? simplecountriesSelect.cloneNode(true)
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
                    if (simplecountriesSelectClone) {
                        fieldLabel.appendChild(simplecountriesSelectClone);
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
                const simplecountriesSelect = field.querySelector(".engrid-simple-country");
                let simplecountriesSelectClone = simplecountriesSelect
                    ? simplecountriesSelect.cloneNode(true)
                    : null;
                field.innerHTML = field.dataset.original;
                if (simplecountriesSelectClone) {
                    field.appendChild(simplecountriesSelectClone);
                }
            }
            field.removeAttribute("data-original");
        });
    }
    setStateField(country, state) {
        switch (country) {
            case "ES":
            case "ESP":
            case "Spain":
                this.setStateValues(state, "Provincia", null);
                break;
            case "BR":
            case "BRA":
            case "Brazil":
                this.setStateValues(state, "Estado", null);
                break;
            case "FR":
            case "FRA":
            case "France":
                this.setStateValues(state, "Région", null);
                break;
            case "GB":
            case "GBR":
            case "United Kingdom":
                this.setStateValues(state, "State/Region", null);
                break;
            case "DE":
            case "DEU":
            case "Germany":
                this.setStateValues(state, "Bundesland", null);
                break;
            case "NL":
            case "NLD":
            case "Netherlands":
                this.setStateValues(state, "Provincie", null);
                break;
            case "AU":
            case "AUS":
                this.setStateValues(state, "Province / State", [
                    { label: "Select", value: "" },
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
                this.setStateValues(state, "Province / State", [
                    { label: "Select", value: "" },
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
                this.setStateValues(state, "State", [
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
                    {
                        label: "&#9472&#9472&nbspUS&nbspTerritories&nbsp&#9472&#9472",
                        value: "",
                        disabled: true,
                    },
                    { label: "American Samoa", value: "AS" },
                    { label: "Guam", value: "GU" },
                    { label: "Northern Mariana Islands", value: "MP" },
                    { label: "Puerto Rico", value: "PR" },
                    { label: "US Minor Outlying Islands", value: "UM" },
                    { label: "Virgin Islands", value: "VI" },
                    {
                        label: "&#9472&#9472&nbspArmed&nbspForces&nbsp&#9472&#9472",
                        value: "",
                        disabled: true,
                    },
                    { label: "Armed Forces Americas", value: "AA" },
                    { label: "Armed Forces Africa", value: "AE" },
                    { label: "Armed Forces Canada", value: "AE" },
                    { label: "Armed Forces Europe", value: "AE" },
                    { label: "Armed Forces Middle East", value: "AE" },
                    { label: "Armed Forces Pacific", value: "AP" },
                ]);
                break;
            case "United States":
                this.setStateValues(state, "State", [
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
                    {
                        label: "&#9472&#9472&nbspUS&nbspTerritories&nbsp&#9472&#9472",
                        value: "",
                        disabled: true,
                    },
                    { label: "American Samoa", value: "American Samoa" },
                    { label: "Guam", value: "Guam" },
                    {
                        label: "Northern Mariana Islands",
                        value: "Northern Mariana Islands",
                    },
                    { label: "Puerto Rico", value: "Puerto Rico" },
                    {
                        label: "US Minor Outlying Islands",
                        value: "US Minor Outlying Islands",
                    },
                    { label: "Virgin Islands", value: "Virgin Islands" },
                    {
                        label: "&#9472&#9472&nbspArmed&nbspForces&nbsp&#9472&#9472",
                        value: "",
                        disabled: true,
                    },
                    { label: "Armed Forces Americas", value: "Armed Forces Americas" },
                    { label: "Armed Forces Africa", value: "Armed Forces Africa" },
                    { label: "Armed Forces Canada", value: "Armed Forces Canada" },
                    { label: "Armed Forces Europe", value: "Armed Forces Europe" },
                    {
                        label: "Armed Forces Middle East",
                        value: "Armed Forces Middle East",
                    },
                    { label: "Armed Forces Pacific", value: "Armed Forces Pacific" },
                ]);
                break;
            case "CA":
            case "CAN":
                this.setStateValues(state, "Province / Territory", [
                    { label: "Select", value: "" },
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
                this.setStateValues(state, "Province / Territory", [
                    { label: "Select", value: "" },
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
                this.setStateValues(state, "Estado", [
                    { label: "Seleccione Estado", value: "" },
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
                this.setStateValues(state, "Estado", [
                    { label: "Seleccione Estado", value: "" },
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
                this.setStateValues(state, "Province / State", null);
                break;
        }
    }
    setStateValues(state, label, values) {
        const stateField = engrid_ENGrid.getField(state);
        const stateWrapper = stateField ? stateField.closest(".en__field") : null;
        if (stateWrapper) {
            const stateLabel = stateWrapper.querySelector(".en__field__label");
            const elementWrapper = stateWrapper.querySelector(".en__field__element");
            if (stateLabel) {
                stateLabel.innerHTML = label;
            }
            if (elementWrapper) {
                const selectedState = get(`engrid-state-${state}`);
                if (values === null || values === void 0 ? void 0 : values.length) {
                    const select = document.createElement("select");
                    select.name = state;
                    select.id = "en__field_" + state.toLowerCase().replace(".", "_");
                    select.classList.add("en__field__input");
                    select.classList.add("en__field__input--select");
                    select.autocomplete = "address-level1";
                    let valueSelected = false;
                    values.forEach((value) => {
                        const option = document.createElement("option");
                        option.value = value.value;
                        option.innerHTML = value.label;
                        if (selectedState === value.value && !valueSelected) {
                            option.selected = true;
                            valueSelected = true;
                        }
                        if (value.disabled) {
                            option.disabled = true;
                        }
                        select.appendChild(option);
                    });
                    elementWrapper.innerHTML = "";
                    elementWrapper.appendChild(select);
                    select.addEventListener("change", this.rememberState.bind(this, state));
                    select.dispatchEvent(new Event("change", { bubbles: true }));
                }
                else {
                    elementWrapper.innerHTML = "";
                    const input = document.createElement("input");
                    input.type = "text";
                    input.name = state;
                    input.placeholder = label;
                    input.id = "en__field_" + state.toLowerCase().replace(".", "_");
                    input.classList.add("en__field__input");
                    input.classList.add("en__field__input--text");
                    input.autocomplete = "address-level1";
                    if (selectedState) {
                        input.value = selectedState;
                    }
                    elementWrapper.appendChild(input);
                    input.addEventListener("change", this.rememberState.bind(this, state));
                }
            }
        }
    }
    rememberState(state) {
        const stateField = engrid_ENGrid.getField(state);
        if (stateField) {
            set(`engrid-state-${stateField.name}`, stateField.value, {
                expires: 1,
                sameSite: "none",
                secure: true,
            });
        }
    }
}

;// CONCATENATED MODULE: ./node_modules/@4site/engrid-scripts/dist/auto-country-select.js
// This class works when the user has added ".simple_country_select" as a class in page builder for the Country select


class AutoCountrySelect {
    constructor() {
        this._countryEvent = Country.getInstance();
        this.countryWrapper = document.querySelector(".simple_country_select");
        this.countrySelect = this._countryEvent
            .countryField;
        this.country = null;
        const engridAutofill = get("engrid-autofill");
        const submissionFailed = !!(engrid_ENGrid.checkNested(window.EngagingNetworks, "require", "_defined", "enjs", "checkSubmissionFailed") && window.EngagingNetworks.require._defined.enjs.checkSubmissionFailed());
        const hasIntlSupport = !!engrid_ENGrid.checkNested(window.Intl, "DisplayNames");
        // Only run if there's no engrid-autofill cookie && if it has Intl support && no country data in url
        const locationDataInUrl = engrid_ENGrid.getUrlParameter("supporter.country") ||
            engrid_ENGrid.getUrlParameter("supporter.region") ||
            (engrid_ENGrid.getUrlParameter("ea.url.id") &&
                !engrid_ENGrid.getUrlParameter("forwarded"));
        if (!engridAutofill &&
            !submissionFailed &&
            hasIntlSupport &&
            !locationDataInUrl) {
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

;// CONCATENATED MODULE: ./node_modules/@4site/engrid-scripts/dist/skip-link.js
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

;// CONCATENATED MODULE: ./node_modules/@4site/engrid-scripts/dist/src-defer.js
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

;// CONCATENATED MODULE: ./node_modules/@4site/engrid-scripts/dist/set-recurr-freq.js


class setRecurrFreq {
    constructor() {
        this._frequency = DonationFrequency.getInstance();
        this._amount = DonationAmount.getInstance();
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
                    this._amount.setAmount(this._amount.amount, false);
                }
                else if (frequency !== "ONETIME") {
                    engrid_ENGrid.setFieldValue("transaction.recurrfreq", "ONETIME");
                    engrid_ENGrid.setFieldValue("transaction.recurrpay", "N");
                    this._frequency.load();
                    this._amount.setAmount(this._amount.amount, false);
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

;// CONCATENATED MODULE: ./node_modules/@4site/engrid-scripts/dist/page-background.js

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

;// CONCATENATED MODULE: ./node_modules/@4site/engrid-scripts/dist/neverbounce.js


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
        this.logger = new EngridLogger("NeverBounce", "#039bc4", "#dfdfdf", "📧");
        this.shouldRun = true;
        this.nbLoaded = false;
        this.emailField = document.getElementById("en__field_supporter_emailAddress");
        window._NBSettings = {
            apiKey: this.apiKey,
            autoFieldHookup: false,
            inputLatency: 1500,
            displayPoweredBy: false,
            loadingMessage: "Validating...",
            softRejectMessage: "Invalid email",
            acceptedMessage: "Email validated!",
            feedback: false,
        };
        engrid_ENGrid.loadJS("https://cdn.neverbounce.com/widget/dist/NeverBounce.js");
        if (this.emailField) {
            if (this.emailField.value) {
                this.logger.log("E-mail Field Found");
                this.shouldRun = false;
            }
            this.emailField.addEventListener("change", (e) => {
                var _a;
                if (!this.nbLoaded) {
                    this.shouldRun = true;
                    this.init();
                    if ((_a = this.emailField) === null || _a === void 0 ? void 0 : _a.value) {
                        setTimeout(function () {
                            window._nb.fields
                                .get(document.querySelector("[data-nb-id]"))[0]
                                .forceUpdate();
                        }, 100);
                    }
                }
            });
            window.setTimeout(() => {
                if (this.emailField && this.emailField.value) {
                    this.logger.log("E-mail Filled Programatically");
                    this.shouldRun = false;
                }
                this.init();
            }, 1000);
        }
        this.form.onValidate.subscribe(this.validate.bind(this));
    }
    init() {
        if (!this.shouldRun) {
            this.logger.log("Should Not Run");
            return;
        }
        if (this.nbLoaded) {
            this.logger.log("Already Loaded");
            return;
        }
        this.logger.log("Init Function");
        if (this.dateField && document.getElementsByName(this.dateField).length)
            this.nbDate = document.querySelector("[name='" + this.dateField + "']");
        if (this.statusField && document.getElementsByName(this.statusField).length)
            this.nbStatus = document.querySelector("[name='" + this.statusField + "']");
        if (!this.emailField) {
            this.logger.log("E-mail Field Not Found");
            return;
        }
        this.wrap(this.emailField, document.createElement("div"));
        const parentNode = this.emailField.parentNode;
        parentNode.id = "nb-wrapper";
        // Define HTML structure for a Custom NB Message and insert it after Email field
        const nbCustomMessageHTML = document.createElement("div");
        nbCustomMessageHTML.innerHTML =
            '<div id="nb-feedback" class="en__field__error nb-hidden">Enter a valid email.</div>';
        this.insertAfter(nbCustomMessageHTML, this.emailField);
        const NBClass = this;
        document.body.addEventListener("nb:registered", function (event) {
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
        });
        // Never Bounce: Register field with the widget and broadcast nb:registration event
        window._nb.fields.registerListener(NBClass.emailField, true);
        this.nbLoaded = true;
    }
    clearStatus() {
        if (!this.emailField) {
            this.logger.log("E-mail Field Not Found");
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
        this.logger.log("Status:", status);
        if (!this.emailField) {
            this.logger.log("E-mail Field Not Found");
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
    //  to Wrap HTML around a DIV
    wrap(el, wrapper) {
        var _a;
        (_a = el.parentNode) === null || _a === void 0 ? void 0 : _a.insertBefore(wrapper, el);
        wrapper.appendChild(el);
    }
    validate() {
        var _a;
        if (!this.form.validate)
            return;
        const nbResult = engrid_ENGrid.getFieldValue("nb-result");
        if (!this.emailField || !this.shouldRun || !this.nbLoaded || !nbResult) {
            this.logger.log("validate(): Should Not Run. Returning true.");
            return;
        }
        if (this.nbStatus) {
            this.nbStatus.value = nbResult;
        }
        if (!["catchall", "unknown", "valid"].includes(nbResult)) {
            this.setEmailStatus("required");
            (_a = this.emailField) === null || _a === void 0 ? void 0 : _a.focus();
            this.logger.log("NB-Result:", engrid_ENGrid.getFieldValue("nb-result"));
            this.form.validate = false;
        }
    }
}

;// CONCATENATED MODULE: ./node_modules/@4site/engrid-scripts/dist/freshaddress.js
// According to the FreshAddress documentation, you need to add the following code to your page:
// jQuery library.
// <script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/1.8.0/jquery.min.js"></script>
// FreshAddress client-side integration library
// <script src="//api.freshaddress.biz/js/lib/freshaddress-client-7.0.min.js?token=[TOKEN HERE]"></script>
//
// I know. jQuery. But it's not my fault. It's FreshAddress's fault.


class FreshAddress {
    constructor() {
        this.form = EnForm.getInstance();
        this.emailField = null;
        this.emailWrapper = document.querySelector(".en__field--emailAddress");
        this.faDate = null;
        this.faStatus = null;
        this.faMessage = null;
        this.logger = new EngridLogger("FreshAddress", "#039bc4", "#dfdfdf", "📧");
        this.shouldRun = true;
        this.options = engrid_ENGrid.getOption("FreshAddress");
        if (this.options === false || !window.FreshAddress)
            return;
        this.emailField = document.getElementById("en__field_supporter_emailAddress");
        if (this.emailField) {
            this.createFields();
            this.addEventListeners();
            window.FreshAddressStatus = "idle";
            if (this.emailField.value) {
                this.logger.log("E-mail Field Found");
                this.shouldRun = false;
            }
            window.setTimeout(() => {
                if (this.emailField && this.emailField.value) {
                    this.logger.log("E-mail Filled Programatically");
                    this.shouldRun = false;
                }
            }, 1000);
        }
        else {
            this.logger.log("E-mail Field Not Found");
        }
    }
    createFields() {
        if (!this.options)
            return;
        this.options.dateField = this.options.dateField || "fa_date";
        this.faDate = engrid_ENGrid.getField(this.options.dateField);
        if (!this.faDate) {
            this.logger.log("Date Field Not Found. Creating...");
            engrid_ENGrid.createHiddenInput(this.options.dateField, "");
            this.faDate = engrid_ENGrid.getField(this.options.dateField);
        }
        this.options.statusField = this.options.statusField || "fa_status";
        this.faStatus = engrid_ENGrid.getField(this.options.statusField);
        if (!this.faStatus) {
            this.logger.log("Status Field Not Found. Creating...");
            engrid_ENGrid.createHiddenInput(this.options.statusField, "");
            this.faStatus = engrid_ENGrid.getField(this.options.statusField);
        }
        this.options.messageField = this.options.messageField || "fa_message";
        this.faMessage = engrid_ENGrid.getField(this.options.messageField);
        if (!this.faMessage) {
            this.logger.log("Message Field Not Found. Creating...");
            engrid_ENGrid.createHiddenInput(this.options.messageField, "");
            this.faMessage = engrid_ENGrid.getField(this.options.messageField);
        }
    }
    writeToFields(status, message) {
        if (!this.options)
            return;
        this.faDate.value = engrid_ENGrid.formatDate(new Date(), this.options.dateFieldFormat || "yyyy-MM-dd");
        this.faStatus.value = status;
        this.faMessage.value = message;
        this.emailWrapper.dataset.freshaddressSafetosendstatus =
            status.toLowerCase();
    }
    addEventListeners() {
        var _a;
        if (!this.options)
            return;
        // Add event listeners to fields
        (_a = this.emailField) === null || _a === void 0 ? void 0 : _a.addEventListener("change", () => {
            var _a, _b;
            if (!this.shouldRun ||
                ((_a = this.emailField) === null || _a === void 0 ? void 0 : _a.value.includes("@4sitestudios.com"))) {
                engrid_ENGrid.removeError(this.emailWrapper);
                this.writeToFields("Valid", "Skipped");
                this.logger.log("Skipping E-mail Validation");
                return;
            }
            this.logger.log("Validating " + ((_b = this.emailField) === null || _b === void 0 ? void 0 : _b.value));
            this.callAPI();
        });
        // Add event listener to submit
        this.form.onValidate.subscribe(this.validate.bind(this));
    }
    callAPI() {
        var _a;
        if (!this.options || !window.FreshAddress)
            return;
        if (!this.shouldRun)
            return;
        window.FreshAddressStatus = "validating";
        const email = (_a = this.emailField) === null || _a === void 0 ? void 0 : _a.value;
        const options = { emps: false, rtc_timeout: 1200 };
        const ret = window.FreshAddress.validateEmail(email, options).then((response) => {
            this.logger.log("Validate API Response", JSON.parse(JSON.stringify(response)));
            return this.validateResponse(response);
        });
    }
    validateResponse(data) {
        var _a;
        /* ERROR HANDLING: Let through in case of a service error. Enable form submission. */
        if (data.isServiceError()) {
            this.logger.log("Service Error");
            this.writeToFields("Service Error", data.getErrorResponse());
            return true;
        }
        /* CHECK RESULT: */
        if (data.isValid()) {
            // Set response message. No action required.
            this.writeToFields("Valid", data.getComment());
            engrid_ENGrid.removeError(this.emailWrapper);
            if (data.hasSuggest()) {
                // Valid, with Suggestion
                engrid_ENGrid.setError(this.emailWrapper, `Did you mean ${data.getSuggEmail()}?`);
                this.emailField.value = data.getSuggEmail();
            }
        }
        else if (data.isError()) {
            // Error Condition 1 - the service should always respond with finding E/W/V
            this.writeToFields("Invalid", data.getErrorResponse());
            engrid_ENGrid.setError(this.emailWrapper, data.getErrorResponse());
            (_a = this.emailField) === null || _a === void 0 ? void 0 : _a.focus();
            if (data.hasSuggest()) {
                // Error, with Suggestion
                engrid_ENGrid.setError(this.emailWrapper, `Did you mean ${data.getSuggEmail()}?`);
                this.emailField.value = data.getSuggEmail();
                this.writeToFields("Error", data.getErrorResponse());
            }
        }
        else if (data.isWarning()) {
            this.writeToFields("Invalid", data.getErrorResponse());
            engrid_ENGrid.setError(this.emailWrapper, data.getErrorResponse());
            if (data.hasSuggest()) {
                // Warning, with Suggestion
                engrid_ENGrid.setError(this.emailWrapper, `Did you mean ${data.getSuggEmail()}?`);
                this.emailField.value = data.getSuggEmail();
                this.writeToFields("Warning", data.getErrorResponse());
            }
        }
        else {
            // Error Condition 2 - the service should always respond with finding E/W/V
            this.writeToFields("API Error", "Unknown Error");
        }
        window.FreshAddressStatus = "idle";
        engrid_ENGrid.enableSubmit();
    }
    validate() {
        var _a;
        engrid_ENGrid.removeError(this.emailWrapper);
        if (!this.form.validate)
            return;
        if (!this.options) {
            this.form.validate = true;
            return;
        }
        if (!this.shouldRun) {
            this.form.validate = true;
            return;
        }
        if (window.FreshAddressStatus === "validating") {
            this.logger.log("Waiting for API Response");
            // Self resolving Promise that waits 1000ms
            const wait = new Promise((resolve, reject) => {
                setTimeout(() => {
                    var _a;
                    const status = this.faStatus.value;
                    if (status === "" || status === "Invalid") {
                        this.logger.log("Promise Rejected");
                        (_a = this.emailField) === null || _a === void 0 ? void 0 : _a.focus();
                        reject(false);
                        return;
                    }
                    this.logger.log("Promise Resolved");
                    resolve(true);
                }, 700);
            });
            this.form.validatePromise = wait;
            return;
        }
        else if (this.faStatus.value === "Invalid") {
            this.form.validate = false;
            window.setTimeout(() => {
                engrid_ENGrid.setError(this.emailWrapper, this.faMessage.value);
            }, 100);
            (_a = this.emailField) === null || _a === void 0 ? void 0 : _a.focus();
            engrid_ENGrid.enableSubmit();
            return false;
        }
        this.form.validate = true;
        return true;
    }
}

;// CONCATENATED MODULE: ./node_modules/@4site/engrid-scripts/dist/progress-bar.js

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

;// CONCATENATED MODULE: ./node_modules/@4site/engrid-scripts/dist/remember-me.js


const remember_me_tippy = (__webpack_require__(9244)/* ["default"] */ .Ay);
class RememberMe {
    constructor(options) {
        this._form = EnForm.getInstance();
        this._events = RememberMeEvents.getInstance();
        this.iframe = null;
        this.remoteUrl = options.remoteUrl ? options.remoteUrl : null;
        this.cookieName = options.cookieName
            ? options.cookieName
            : "engrid-autofill";
        this.cookieExpirationDays = options.cookieExpirationDays
            ? options.cookieExpirationDays
            : 365;
        this.rememberMeOptIn = options.checked ? options.checked : false;
        this.fieldNames = options.fieldNames ? options.fieldNames : [];
        this.fieldDonationAmountRadioName = options.fieldDonationAmountRadioName
            ? options.fieldDonationAmountRadioName
            : "transaction.donationAmt";
        this.fieldDonationAmountOtherName = options.fieldDonationAmountOtherName
            ? options.fieldDonationAmountOtherName
            : "transaction.donationAmt.other";
        this.fieldDonationRecurrPayRadioName =
            options.fieldDonationRecurrPayRadioName
                ? options.fieldDonationRecurrPayRadioName
                : "transaction.recurrpay";
        this.fieldDonationAmountOtherCheckboxID =
            options.fieldDonationAmountOtherCheckboxID
                ? options.fieldDonationAmountOtherCheckboxID
                : "#en__field_transaction_donationAmt4";
        this.fieldOptInSelectorTarget = options.fieldOptInSelectorTarget
            ? options.fieldOptInSelectorTarget
            : ".en__field--emailAddress.en__field";
        this.fieldOptInSelectorTargetLocation =
            options.fieldOptInSelectorTargetLocation
                ? options.fieldOptInSelectorTargetLocation
                : "after";
        this.fieldClearSelectorTarget = options.fieldClearSelectorTarget
            ? options.fieldClearSelectorTarget
            : 'label[for="en__field_supporter_firstName"]';
        this.fieldClearSelectorTargetLocation =
            options.fieldClearSelectorTargetLocation
                ? options.fieldClearSelectorTargetLocation
                : "before";
        this.fieldData = {};
        if (this.useRemote()) {
            this.createIframe(() => {
                if (this.iframe && this.iframe.contentWindow) {
                    this.iframe.contentWindow.postMessage(JSON.stringify({ key: this.cookieName, operation: "read" }), "*");
                    this._form.onSubmit.subscribe(() => {
                        if (this.rememberMeOptIn) {
                            this.readFields();
                            this.saveCookieToRemote();
                        }
                    });
                }
            }, (event) => {
                let data;
                if (event.data &&
                    typeof event.data === "string" &&
                    this.isJson(event.data)) {
                    data = JSON.parse(event.data);
                }
                if (data &&
                    data.key &&
                    data.value !== undefined &&
                    data.key === this.cookieName) {
                    this.updateFieldData(data.value);
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
        let clearRememberMeField = document.getElementById("clear-autofill-data");
        if (!clearRememberMeField) {
            const clearAutofillLabel = "clear autofill";
            clearRememberMeField = document.createElement("a");
            clearRememberMeField.setAttribute("id", "clear-autofill-data");
            clearRememberMeField.classList.add("label-tooltip");
            clearRememberMeField.setAttribute("style", "cursor: pointer;");
            clearRememberMeField.innerHTML = `(${clearAutofillLabel})`;
            const targetField = this.getElementByFirstSelector(this.fieldClearSelectorTarget);
            if (targetField) {
                if (this.fieldClearSelectorTargetLocation === "after") {
                    targetField.appendChild(clearRememberMeField);
                }
                else {
                    targetField.prepend(clearRememberMeField);
                }
            }
        }
        clearRememberMeField.addEventListener("click", (e) => {
            e.preventDefault();
            this.clearFields(["supporter.country" /*, 'supporter.emailAddress'*/]);
            if (this.useRemote()) {
                this.clearCookieOnRemote();
            }
            else {
                this.clearCookie();
            }
            let clearAutofillLink = document.getElementById("clear-autofill-data");
            if (clearAutofillLink) {
                clearAutofillLink.style.display = "none";
            }
            this.rememberMeOptIn = false;
            this._events.dispatchClear();
            window.dispatchEvent(new CustomEvent("RememberMe_Cleared"));
        });
        this._events.dispatchLoad(true);
        window.dispatchEvent(new CustomEvent("RememberMe_Loaded", { detail: { withData: true } }));
    }
    getElementByFirstSelector(selectorsString) {
        // iterate through the selectors until we find one that exists
        let targetField = null;
        const selectorTargets = selectorsString.split(",");
        for (let i = 0; i < selectorTargets.length; i++) {
            targetField = document.querySelector(selectorTargets[i]);
            if (targetField) {
                break;
            }
        }
        return targetField;
    }
    insertRememberMeOptin() {
        let rememberMeOptInField = document.getElementById("remember-me-opt-in");
        if (!rememberMeOptInField) {
            const rememberMeLabel = "Remember Me";
            const rememberMeInfo = `
				Check “Remember me” to complete forms on this device faster. 
				While your financial information won’t be stored, you should only check this box from a personal device. 
				Click “Clear autofill” to remove the information from your device at any time.
			`;
            const rememberMeOptInFieldChecked = this.rememberMeOptIn ? "checked" : "";
            const rememberMeOptInField = document.createElement("div");
            rememberMeOptInField.classList.add("en__field", "en__field--checkbox", "en__field--question", "rememberme-wrapper");
            rememberMeOptInField.setAttribute("id", "remember-me-opt-in");
            rememberMeOptInField.setAttribute("style", "overflow-x: hidden;");
            rememberMeOptInField.innerHTML = `
        <div class="en__field__element en__field__element--checkbox">
          <div class="en__field__item">
            <input id="remember-me-checkbox" type="checkbox" class="en__field__input en__field__input--checkbox" ${rememberMeOptInFieldChecked} />
            <label for="remember-me-checkbox" class="en__field__label en__field__label--item" style="white-space: nowrap;">
              <div class="rememberme-content" style="display: inline-flex; align-items: center;">
                ${rememberMeLabel}
                <a id="rememberme-learn-more-toggle" style="display: inline-block; display: inline-flex; align-items: center; cursor: pointer; margin-left: 10px; margin-top: var(--rememberme-learn-more-toggle_margin-top)">
                  <svg style="height: 14px; width: auto; z-index: 1;" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11 7H9V5H11V7ZM11 9H9V15H11V9ZM10 2C5.59 2 2 5.59 2 10C2 14.41 5.59 18 10 18C14.41 18 18 14.41 18 10C18 5.59 14.41 2 10 2ZM10 0C15.523 0 20 4.477 20 10C20 15.523 15.523 20 10 20C4.477 20 0 15.523 0 10C0 4.477 4.477 0 10 0Z" fill="currentColor"/></svg>
                </a>
              </div>
            </label>
          </div>
        </div>
			`;
            const targetField = this.getElementByFirstSelector(this.fieldOptInSelectorTarget);
            if (targetField && targetField.parentNode) {
                targetField.parentNode.insertBefore(rememberMeOptInField, this.fieldOptInSelectorTargetLocation == "before"
                    ? targetField
                    : targetField.nextSibling);
                const rememberMeCheckbox = document.getElementById("remember-me-checkbox");
                if (rememberMeCheckbox) {
                    rememberMeCheckbox.addEventListener("change", () => {
                        if (rememberMeCheckbox.checked) {
                            this.rememberMeOptIn = true;
                        }
                        else {
                            this.rememberMeOptIn = false;
                        }
                    });
                }
                remember_me_tippy("#rememberme-learn-more-toggle", { content: rememberMeInfo });
            }
        }
        else if (this.rememberMeOptIn) {
            rememberMeOptInField.checked = true;
        }
        this._events.dispatchLoad(false);
        window.dispatchEvent(new CustomEvent("RememberMe_Loaded", { detail: { withData: false } }));
    }
    useRemote() {
        return (!!this.remoteUrl &&
            typeof window.postMessage === "function" &&
            window.JSON &&
            window.localStorage);
    }
    createIframe(iframeLoaded, messageReceived) {
        if (this.remoteUrl) {
            let iframe = document.createElement("iframe");
            iframe.style.cssText =
                "position:absolute;width:1px;height:1px;left:-9999px;";
            iframe.src = this.remoteUrl;
            iframe.setAttribute("sandbox", "allow-same-origin allow-scripts");
            this.iframe = iframe;
            document.body.appendChild(this.iframe);
            this.iframe.addEventListener("load", () => iframeLoaded(), false);
            window.addEventListener("message", (event) => {
                var _a;
                if (((_a = this.iframe) === null || _a === void 0 ? void 0 : _a.contentWindow) === event.source) {
                    messageReceived(event);
                }
            }, false);
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
            this.iframe.contentWindow.postMessage(JSON.stringify({
                key: this.cookieName,
                value: this.fieldData,
                operation: "write",
                expires: this.cookieExpirationDays,
            }), "*");
        }
    }
    readCookie() {
        this.updateFieldData(get(this.cookieName) || "");
    }
    saveCookie() {
        set(this.cookieName, JSON.stringify(this.fieldData), {
            expires: this.cookieExpirationDays,
        });
    }
    readFields() {
        for (let i = 0; i < this.fieldNames.length; i++) {
            let fieldSelector = "[name='" + this.fieldNames[i] + "']";
            let field = document.querySelector(fieldSelector);
            if (field) {
                if (field.tagName === "INPUT") {
                    let type = field.getAttribute("type");
                    if (type === "radio" || type === "checkbox") {
                        field = document.querySelector(fieldSelector + ":checked");
                    }
                    this.fieldData[this.fieldNames[i]] = encodeURIComponent(field.value);
                }
                else if (field.tagName === "SELECT") {
                    this.fieldData[this.fieldNames[i]] = encodeURIComponent(field.value);
                }
            }
        }
    }
    setFieldValue(field, value, overwrite = false) {
        if (field && value !== undefined) {
            if ((field.value && overwrite) || !field.value) {
                field.value = value;
            }
        }
    }
    clearFields(skipFields) {
        for (let key in this.fieldData) {
            if (skipFields.includes(key)) {
                delete this.fieldData[key];
            }
            else if (this.fieldData[key] === "") {
                delete this.fieldData[key];
            }
            else {
                this.fieldData[key] = "";
            }
        }
        this.writeFields(true);
    }
    /**
     * Writes the values from the fieldData object to the corresponding HTML input fields.
     *
     * This function iterates over the fieldNames array and for each field name, it selects the corresponding HTML input field.
     * If the field is found and its tag name is "INPUT", it checks if the field name matches certain conditions (like being a donation recurring payment radio button or a donation amount radio button).
     * Depending on these conditions, it either clicks the field or sets its value using the setFieldValue function.
     * If the field tag name is "SELECT", it sets its value using the setFieldValue function.
     *
     * @param overwrite - A boolean indicating whether to overwrite the existing value of the fields. Defaults to false.
     */
    writeFields(overwrite = false) {
        for (let i = 0; i < this.fieldNames.length; i++) {
            let fieldSelector = "[name='" + this.fieldNames[i] + "']";
            let field = document.querySelector(fieldSelector);
            if (field) {
                if (field.tagName === "INPUT") {
                    if (this.fieldNames[i] === this.fieldDonationRecurrPayRadioName) {
                        if (this.fieldData[this.fieldNames[i]] === "Y") {
                            field.click();
                        }
                    }
                    else if (this.fieldDonationAmountRadioName === this.fieldNames[i]) {
                        field = document.querySelector(fieldSelector +
                            "[value='" +
                            this.fieldData[this.fieldNames[i]] +
                            "']");
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
                else if (field.tagName === "SELECT") {
                    this.setFieldValue(field, this.fieldData[this.fieldNames[i]], true);
                }
            }
        }
    }
    isJson(str) {
        try {
            JSON.parse(str);
        }
        catch (e) {
            return false;
        }
        return true;
    }
}

;// CONCATENATED MODULE: ./node_modules/@4site/engrid-scripts/dist/show-if-amount.js


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
        //If we are on a thank you page, use the window.pageJson.amount
        const amount = engrid_ENGrid.getGiftProcess()
            ? window.pageJson.amount
            : this._amount.amount;
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

;// CONCATENATED MODULE: ./node_modules/@4site/engrid-scripts/dist/other-amount.js
// This class automatically select other radio input when an amount is entered into it.

class OtherAmount {
    constructor() {
        this.logger = new EngridLogger("OtherAmount", "green", "black", "💰");
        this._amount = DonationAmount.getInstance();
        "focusin input".split(" ").forEach((e) => {
            var _a;
            // We're attaching this event to the body because sometimes the other amount input is not in the DOM yet and comes via AJAX.
            (_a = document.querySelector("body")) === null || _a === void 0 ? void 0 : _a.addEventListener(e, (event) => {
                const target = event.target;
                if (target.classList.contains("en__field__input--other")) {
                    this.logger.log("Other Amount Field Focused");
                    this.setRadioInput();
                }
            });
        });
        const otherAmountField = document.querySelector("[name='transaction.donationAmt.other'");
        if (otherAmountField) {
            otherAmountField.setAttribute("inputmode", "decimal");
            // ADD THE MISSING LABEL FOR IMPROVED ACCESSABILITY
            otherAmountField.setAttribute("aria-label", "Enter your custom donation amount");
            otherAmountField.setAttribute("autocomplete", "off");
            otherAmountField.setAttribute("data-lpignore", "true");
            otherAmountField.addEventListener("change", (e) => {
                const target = e.target;
                const amount = target.value;
                const cleanAmount = engrid_ENGrid.cleanAmount(amount);
                if (amount !== cleanAmount.toString()) {
                    this.logger.log(`Other Amount Field Changed: ${amount} => ${cleanAmount}`);
                    if ("dataLayer" in window) {
                        window.dataLayer.push({
                            event: "otherAmountTransformed",
                            otherAmountTransformation: `${amount} => ${cleanAmount}`,
                        });
                    }
                    target.value =
                        cleanAmount % 1 != 0
                            ? cleanAmount.toFixed(2)
                            : cleanAmount.toString();
                }
            });
            // On blur, if the amount is 0, select the previous amount
            otherAmountField.addEventListener("blur", (e) => {
                const target = e.target;
                const amount = target.value;
                const cleanAmount = engrid_ENGrid.cleanAmount(amount);
                if (cleanAmount === 0) {
                    this.logger.log("Other Amount Field Blurred with 0 amount");
                    // Get Live Amount
                    const liveAmount = this._amount.amount;
                    if (liveAmount > 0) {
                        this._amount.setAmount(liveAmount, false);
                    }
                }
            });
        }
    }
    setRadioInput() {
        const target = document.querySelector(".en__field--donationAmt .en__field__input--other");
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

;// CONCATENATED MODULE: ./node_modules/@4site/engrid-scripts/dist/logger.js

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
        if (!engrid_ENGrid.debug && engrid_ENGrid.getUrlParameter("debug") !== "log") {
            return () => { };
        }
        return console.log.bind(window.console, "%c" + this.emoji + " " + this.prefix + " %s", `color: ${this.color}; background-color: ${this.background}; font-size: 1.2em; padding: 4px; border-radius: 2px; font-family: monospace;`);
    }
    get success() {
        if (!engrid_ENGrid.debug) {
            return () => { };
        }
        return console.log.bind(window.console, "%c ✅ " + this.prefix + " %s", `color: green; background-color: white; font-size: 1.2em; padding: 4px; border-radius: 2px; font-family: monospace;`);
    }
    get danger() {
        if (!engrid_ENGrid.debug) {
            return () => { };
        }
        return console.log.bind(window.console, "%c ⛔️ " + this.prefix + " %s", `color: red; background-color: white; font-size: 1.2em; padding: 4px; border-radius: 2px; font-family: monospace;`);
    }
    get warn() {
        if (!engrid_ENGrid.debug) {
            return () => { };
        }
        return console.warn.bind(window.console, "%c" + this.emoji + " " + this.prefix + " %s", `color: ${this.color}; background-color: ${this.background}; font-size: 1.2em; padding: 4px; border-radius: 2px; font-family: monospace;`);
    }
    get dir() {
        if (!engrid_ENGrid.debug) {
            return () => { };
        }
        return console.dir.bind(window.console, "%c" + this.emoji + " " + this.prefix + " %s", `color: ${this.color}; background-color: ${this.background}; font-size: 1.2em; padding: 4px; border-radius: 2px; font-family: monospace;`);
    }
    get error() {
        if (!engrid_ENGrid.debug) {
            return () => { };
        }
        return console.error.bind(window.console, "%c" + this.emoji + " " + this.prefix + " %s", `color: ${this.color}; background-color: ${this.background}; font-size: 1.2em; padding: 4px; border-radius: 2px; font-family: monospace;`);
    }
}

;// CONCATENATED MODULE: ./node_modules/@4site/engrid-scripts/dist/min-max-amount.js
// This script adds an erros message to the page if the amount is greater than the max amount or less than the min amount.

class MinMaxAmount {
    constructor() {
        var _a, _b;
        this._form = EnForm.getInstance();
        this._amount = DonationAmount.getInstance();
        this.minAmount = (_a = engrid_ENGrid.getOption("MinAmount")) !== null && _a !== void 0 ? _a : 1;
        this.maxAmount = (_b = engrid_ENGrid.getOption("MaxAmount")) !== null && _b !== void 0 ? _b : 100000;
        this.minAmountMessage = engrid_ENGrid.getOption("MinAmountMessage");
        this.maxAmountMessage = engrid_ENGrid.getOption("MaxAmountMessage");
        this.logger = new EngridLogger("MinMaxAmount", "white", "purple", "🔢");
        if (!this.shouldRun()) {
            // If we're not on a Donation Page, get out
            return;
        }
        this._amount.onAmountChange.subscribe((s) => window.setTimeout(this.liveValidate.bind(this), 1000) // Wait 1 second for the amount to be updated
        );
        this._form.onValidate.subscribe(this.enOnValidate.bind(this));
    }
    // Should we run the script?
    shouldRun() {
        return engrid_ENGrid.getPageType() === "DONATION";
    }
    // Don't submit the form if the amount is not valid
    enOnValidate() {
        if (!this._form.validate)
            return;
        const otherAmount = document.querySelector("[name='transaction.donationAmt.other']");
        if (this._amount.amount < this.minAmount) {
            this.logger.log("Amount is less than min amount: " + this.minAmount);
            if (otherAmount) {
                otherAmount.focus();
            }
            this._form.validate = false;
        }
        else if (this._amount.amount > this.maxAmount) {
            this.logger.log("Amount is greater than max amount: " + this.maxAmount);
            if (otherAmount) {
                otherAmount.focus();
            }
            this._form.validate = false;
        }
        window.setTimeout(this.liveValidate.bind(this), 300);
    }
    // Disable Submit Button if the amount is not valid
    liveValidate() {
        const amount = engrid_ENGrid.cleanAmount(this._amount.amount.toString());
        const activeElement = document.activeElement;
        if (activeElement &&
            activeElement.tagName === "INPUT" &&
            "name" in activeElement &&
            activeElement.name === "transaction.donationAmt.other" &&
            amount === 0) {
            // Don't validate if the other amount has focus and the amount is 0
            return;
        }
        this.logger.log(`Amount: ${amount}`);
        if (amount < this.minAmount) {
            this.logger.log("Amount is less than min amount: " + this.minAmount);
            engrid_ENGrid.setError(".en__field--withOther", this.minAmountMessage || "Invalid Amount");
        }
        else if (amount > this.maxAmount) {
            this.logger.log("Amount is greater than max amount: " + this.maxAmount);
            engrid_ENGrid.setError(".en__field--withOther", this.maxAmountMessage || "Invalid Amount");
        }
        else {
            engrid_ENGrid.removeError(".en__field--withOther");
        }
    }
}

;// CONCATENATED MODULE: ./node_modules/@4site/engrid-scripts/dist/ticker.js

class Ticker {
    constructor() {
        this.shuffleSeed = __webpack_require__(3184);
        this.items = [];
        this.tickerElement = document.querySelector(".engrid-ticker");
        this.logger = new EngridLogger("Ticker", "black", "beige", "🔁");
        if (!this.shouldRun()) {
            this.logger.log("Not running");
            // If we don't find a ticker, get out
            return;
        }
        const tickerList = document.querySelectorAll(".engrid-ticker li");
        if (tickerList.length > 0) {
            for (let i = 0; i < tickerList.length; i++) {
                this.items.push(tickerList[i].innerText);
            }
        }
        this.render();
        return;
    }
    // Should we run the script?
    shouldRun() {
        return this.tickerElement !== null;
    }
    getSeed() {
        return new Date().getDate() + engrid_ENGrid.getPageID();
    }
    // Get Items
    getItems() {
        const total = this.tickerElement.getAttribute("data-total") || "50";
        this.logger.log("Getting " + total + " items");
        const seed = this.getSeed();
        const items = this.shuffleSeed.shuffle(this.items, seed);
        const now = new Date();
        const hour = now.getHours();
        const minute = now.getMinutes();
        let pointer = Math.round((hour * 60 + minute) / 5);
        if (pointer >= items.length) {
            pointer = 0;
        }
        const ret = items.slice(pointer, pointer + total).reverse();
        return ret;
    }
    // Render
    render() {
        var _a, _b, _c;
        this.logger.log("Rendering");
        const items = this.getItems();
        let ticker = document.createElement("div");
        ticker.classList.add("en__component");
        ticker.classList.add("en__component--ticker");
        let str = `<div class="ticker">`;
        for (let i = 0; i < items.length; i++) {
            str += '<div class="ticker__item">' + items[i] + "</div>";
        }
        str = '<div id="engrid-ticker">' + str + "</div></div>";
        ticker.innerHTML = str;
        (_b = (_a = this.tickerElement) === null || _a === void 0 ? void 0 : _a.parentElement) === null || _b === void 0 ? void 0 : _b.insertBefore(ticker, this.tickerElement);
        (_c = this.tickerElement) === null || _c === void 0 ? void 0 : _c.remove();
        const tickerWidth = document.querySelector(".ticker").offsetWidth.toString();
        ticker.style.setProperty("--ticker-size", tickerWidth);
        this.logger.log("Ticker Size: " + ticker.style.getPropertyValue("--ticker-size"));
        this.logger.log("Ticker Width: " + tickerWidth);
    }
}

;// CONCATENATED MODULE: ./node_modules/@4site/engrid-scripts/dist/data-layer.js
// The DataLayer class is a singleton class that is responsible for managing the data layer events.
// It listens to the EnForm onSubmit event and the RememberMe onLoad event.
// It also listens to the blur, change, and submit events of the form fields.
// It adds the following events to the data layer:
// - EN_PAGE_VIEW
// - EN_SUCCESSFUL_DONATION
// - EN_PAGEJSON_{property}
// - EN_SUBMISSION_SUCCESS_{pageType}
// - EN_URLPARAM_{key}-{value}
// - EN_RECURRING_FREQUENCIES
// - EN_FASTFORMFILL_PERSONALINFO_SUCCESS
// - EN_FASTFORMFILL_PERSONALINFO_PARTIALSUCCESS
// - EN_FASTFORMFILL_PERSONALINFO_FAILURE
// - EN_FASTFORMFILL_ADDRESS_SUCCESS
// - EN_FASTFORMFILL_ADDRESS_PARTIALSUCCESS
// - EN_FASTFORMFILL_ADDRESS_FAILURE
// - EN_FASTFORMFILL_ALL_SUCCESS
// - EN_FASTFORMFILL_ALL_FAILURE
// - EN_SUBMISSION_WITH_EMAIL_OPTIN
// - EN_SUBMISSION_WITHOUT_EMAIL_OPTIN
// - EN_FORM_VALUE_UPDATED

class DataLayer {
    constructor() {
        this.logger = new EngridLogger("DataLayer", "#f1e5bc", "#009cdc", "📊");
        this.dataLayer = window.dataLayer || [];
        this._form = EnForm.getInstance();
        this.endOfGiftProcessStorageKey = "ENGRID_END_OF_GIFT_PROCESS_EVENTS";
        this.excludedFields = [
            // Credit Card
            "transaction.ccnumber",
            "transaction.ccexpire.delimiter",
            "transaction.ccexpire",
            "transaction.ccvv",
            "supporter.creditCardHolderName",
            // Bank Account
            "supporter.bankAccountNumber",
            "supporter.bankAccountType",
            "transaction.bankname",
            "supporter.bankRoutingNumber",
        ];
        this.hashedFields = [
            // Supporter Address, Phone Numbers, and Address
            "supporter.emailAddress",
            "supporter.phoneNumber",
            "supporter.phoneNumber2",
            "supporter.address1",
            "supporter.address2",
            "supporter.address3",
            // In Honor/Memory Inform Email and Address
            "transaction.infemail",
            "transaction.infadd1",
            "transaction.infadd2",
            "transaction.infadd3",
            // Billing Address
            "supporter.billingAddress1",
            "supporter.billingAddress2",
            "supporter.billingAddress3",
        ];
        if (engrid_ENGrid.getOption("RememberMe")) {
            RememberMeEvents.getInstance().onLoad.subscribe((hasData) => {
                this.logger.log("Remember me - onLoad", hasData);
                this.onLoad();
            });
        }
        else {
            this.onLoad();
        }
        this._form.onSubmit.subscribe(() => this.onSubmit());
    }
    static getInstance() {
        if (!DataLayer.instance) {
            DataLayer.instance = new DataLayer();
            window._dataLayer = DataLayer.instance;
        }
        return DataLayer.instance;
    }
    transformJSON(value) {
        if (typeof value === "string") {
            return value.toUpperCase().split(" ").join("-").replace(":-", "-");
        }
        else if (typeof value === "boolean") {
            value = value ? "TRUE" : "FALSE";
            return value;
        }
        return "";
    }
    onLoad() {
        if (engrid_ENGrid.getGiftProcess()) {
            this.logger.log("EN_SUCCESSFUL_DONATION");
            this.dataLayer.push({
                event: "EN_SUCCESSFUL_DONATION",
            });
            this.addEndOfGiftProcessEventsToDataLayer();
        }
        else {
            this.logger.log("EN_PAGE_VIEW");
            this.dataLayer.push({
                event: "EN_PAGE_VIEW",
            });
        }
        if (window.pageJson) {
            const pageJson = window.pageJson;
            for (const property in pageJson) {
                if (!Number.isNaN(pageJson[property])) {
                    this.dataLayer.push({
                        event: `EN_PAGEJSON_${property.toUpperCase()}-${pageJson[property]}`,
                    });
                    this.dataLayer.push({
                        [`'EN_PAGEJSON_${property.toUpperCase()}'`]: pageJson[property],
                    });
                }
                else {
                    this.dataLayer.push({
                        event: `EN_PAGEJSON_${property.toUpperCase()}-${this.transformJSON(pageJson[property])}`,
                    });
                    this.dataLayer.push({
                        [`'EN_PAGEJSON_${property.toUpperCase()}'`]: this.transformJSON(pageJson[property]),
                    });
                }
                this.dataLayer.push({
                    event: "EN_PAGEJSON_" + property.toUpperCase(),
                    eventValue: pageJson[property],
                });
            }
            if (engrid_ENGrid.getPageCount() === engrid_ENGrid.getPageNumber()) {
                this.dataLayer.push({
                    event: "EN_SUBMISSION_SUCCESS_" + pageJson.pageType.toUpperCase(),
                });
                this.dataLayer.push({
                    [`'EN_SUBMISSION_SUCCESS_${pageJson.pageType.toUpperCase()}'`]: "TRUE",
                });
            }
        }
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.forEach((value, key) => {
            this.dataLayer.push({
                event: `EN_URLPARAM_${key.toUpperCase()}-${this.transformJSON(value)}`,
            });
            this.dataLayer.push({
                [`'EN_URLPARAM_${key.toUpperCase()}'`]: this.transformJSON(value),
            });
        });
        if (engrid_ENGrid.getPageType() === "DONATION") {
            const recurrFreqEls = document.querySelectorAll('[name="transaction.recurrfreq"]');
            const recurrValues = [...recurrFreqEls].map((el) => el.value);
            this.dataLayer.push({
                event: "EN_RECURRING_FREQUENCIES",
                [`'EN_RECURRING_FREQEUENCIES'`]: recurrValues,
            });
        }
        let fastFormFill = false;
        // Fast Form Fill - Personal Details
        const fastPersonalDetailsFormBlock = document.querySelector(".en__component--formblock.fast-personal-details");
        if (fastPersonalDetailsFormBlock) {
            const allPersonalMandatoryInputsAreFilled = FastFormFill.allMandatoryInputsAreFilled(fastPersonalDetailsFormBlock);
            const somePersonalMandatoryInputsAreFilled = FastFormFill.someMandatoryInputsAreFilled(fastPersonalDetailsFormBlock);
            if (allPersonalMandatoryInputsAreFilled) {
                this.dataLayer.push({
                    event: "EN_FASTFORMFILL_PERSONALINFO_SUCCESS",
                });
                fastFormFill = true;
            }
            else if (somePersonalMandatoryInputsAreFilled) {
                this.dataLayer.push({
                    event: "EN_FASTFORMFILL_PERSONALINFO_PARTIALSUCCESS",
                });
            }
            else {
                this.dataLayer.push({
                    event: "EN_FASTFORMFILL_PERSONALINFO_FAILURE",
                });
            }
        }
        // Fast Form Fill - Address Details
        const fastAddressDetailsFormBlock = document.querySelector(".en__component--formblock.fast-address-details");
        if (fastAddressDetailsFormBlock) {
            const allAddressMandatoryInputsAreFilled = FastFormFill.allMandatoryInputsAreFilled(fastAddressDetailsFormBlock);
            const someAddressMandatoryInputsAreFilled = FastFormFill.someMandatoryInputsAreFilled(fastAddressDetailsFormBlock);
            if (allAddressMandatoryInputsAreFilled) {
                this.dataLayer.push({
                    event: "EN_FASTFORMFILL_ADDRESS_SUCCESS",
                });
                fastFormFill = fastFormFill ? true : false; // Only set to true if it was true before
            }
            else if (someAddressMandatoryInputsAreFilled) {
                this.dataLayer.push({
                    event: "EN_FASTFORMFILL_ADDRESS_PARTIALSUCCESS",
                });
            }
            else {
                this.dataLayer.push({
                    event: "EN_FASTFORMFILL_ADDRESS_FAILURE",
                });
            }
        }
        if (fastFormFill) {
            this.dataLayer.push({
                event: "EN_FASTFORMFILL_ALL_SUCCESS",
            });
        }
        else {
            this.dataLayer.push({
                event: "EN_FASTFORMFILL_ALL_FAILURE",
            });
        }
        this.attachEventListeners();
    }
    onSubmit() {
        const optIn = document.querySelector(".en__field__item:not(.en__field--question) input[name^='supporter.questions'][type='checkbox']:checked");
        if (optIn) {
            this.logger.log("EN_SUBMISSION_WITH_EMAIL_OPTIN");
            this.dataLayer.push({
                event: "EN_SUBMISSION_WITH_EMAIL_OPTIN",
            });
        }
        else {
            this.logger.log("EN_SUBMISSION_WITHOUT_EMAIL_OPTIN");
            this.dataLayer.push({
                event: "EN_SUBMISSION_WITHOUT_EMAIL_OPTIN",
            });
        }
    }
    attachEventListeners() {
        const textInputs = document.querySelectorAll(".en__component--advrow input:not([type=checkbox]):not([type=radio]):not([type=submit]):not([type=button]):not([type=hidden]):not([unhidden]), .en__component--advrow textarea");
        textInputs.forEach((el) => {
            el.addEventListener("blur", (e) => {
                this.handleFieldValueChange(e.target);
            });
        });
        const radioAndCheckboxInputs = document.querySelectorAll(".en__component--advrow input[type=checkbox], .en__component--advrow input[type=radio]");
        radioAndCheckboxInputs.forEach((el) => {
            el.addEventListener("change", (e) => {
                this.handleFieldValueChange(e.target);
            });
        });
        const selectInputs = document.querySelectorAll(".en__component--advrow select");
        selectInputs.forEach((el) => {
            el.addEventListener("change", (e) => {
                this.handleFieldValueChange(e.target);
            });
        });
    }
    handleFieldValueChange(el) {
        var _a, _b, _c;
        if (el.value === "" || this.excludedFields.includes(el.name))
            return;
        const value = this.hashedFields.includes(el.name)
            ? this.hash(el.value)
            : el.value;
        if (["checkbox", "radio"].includes(el.type)) {
            if (el.checked) {
                if (el.name === "en__pg") {
                    //Premium gift handling
                    this.dataLayer.push({
                        event: "EN_FORM_VALUE_UPDATED",
                        enFieldName: el.name,
                        enFieldLabel: "Premium Gift",
                        enFieldValue: (_b = (_a = el
                            .closest(".en__pg__body")) === null || _a === void 0 ? void 0 : _a.querySelector(".en__pg__name")) === null || _b === void 0 ? void 0 : _b.textContent,
                        enProductId: (_c = document.querySelector('[name="transaction.selprodvariantid"]')) === null || _c === void 0 ? void 0 : _c.value,
                    });
                }
                else {
                    this.dataLayer.push({
                        event: "EN_FORM_VALUE_UPDATED",
                        enFieldName: el.name,
                        enFieldLabel: this.getFieldLabel(el),
                        enFieldValue: value,
                    });
                }
            }
            return;
        }
        this.dataLayer.push({
            event: "EN_FORM_VALUE_UPDATED",
            enFieldName: el.name,
            enFieldLabel: this.getFieldLabel(el),
            enFieldValue: value,
        });
    }
    hash(value) {
        return btoa(value);
    }
    getFieldLabel(el) {
        var _a, _b;
        return ((_b = (_a = el.closest(".en__field")) === null || _a === void 0 ? void 0 : _a.querySelector("label")) === null || _b === void 0 ? void 0 : _b.textContent) || "";
    }
    addEndOfGiftProcessEvent(eventName, eventProperties = {}) {
        this.storeEndOfGiftProcessData(Object.assign({ event: eventName }, eventProperties));
    }
    addEndOfGiftProcessVariable(variableName, variableValue = "") {
        this.storeEndOfGiftProcessData({
            [`'${variableName.toUpperCase()}'`]: variableValue,
        });
    }
    storeEndOfGiftProcessData(data) {
        const events = this.getEndOfGiftProcessData();
        events.push(data);
        window.sessionStorage.setItem(this.endOfGiftProcessStorageKey, JSON.stringify(events));
    }
    addEndOfGiftProcessEventsToDataLayer() {
        this.getEndOfGiftProcessData().forEach((event) => {
            this.dataLayer.push(event);
        });
        window.sessionStorage.removeItem(this.endOfGiftProcessStorageKey);
    }
    getEndOfGiftProcessData() {
        let eventsData = window.sessionStorage.getItem(this.endOfGiftProcessStorageKey);
        return !eventsData ? [] : JSON.parse(eventsData);
    }
}

;// CONCATENATED MODULE: ./node_modules/@4site/engrid-scripts/dist/data-replace.js
// This script is used to replace merge tags in the EN Blocks of the page.
// It searches for HTML elements containing the data to be replaced and replaces it.
// The data to be replaced is passed as URL parameters, example: ?engrid_data[key]=value.
// The merge tag, if found, is replaced with the value from the URL parameter.
// If no value is found, the default value is used.
// The default value is the value inside the merge tag, example: {engrid_data~key~default}.
// If no default value is set, an empty string is used.

class DataReplace {
    constructor() {
        this.logger = new EngridLogger("DataReplace", "#333333", "#00f3ff", "⤵️");
        this.enElements = new Array();
        this.searchElements();
        if (!this.shouldRun())
            return;
        this.logger.log("Elements Found:", this.enElements);
        this.replaceAll();
    }
    /**
     * Searches for HTML elements containing the data to be replaced.
     */
    searchElements() {
        const enElements = document.querySelectorAll(`
      .en__component--copyblock,
      .en__component--codeblock,
      .en__field
      `);
        if (enElements.length > 0) {
            enElements.forEach((item) => {
                if (item instanceof HTMLElement &&
                    item.innerHTML.includes("{engrid_data~")) {
                    this.enElements.push(item);
                }
            });
        }
    }
    /**
     * Checks if there are elements to be replaced.
     * @returns True if there are elements to be replaced, false otherwise.
     */
    shouldRun() {
        return this.enElements.length > 0;
    }
    /**
     * Replaces all occurrences of data in the HTML elements.
     */
    replaceAll() {
        const regEx = /{engrid_data~\[([\w-]+)\]~?\[?(.+?)?\]?}/g;
        this.enElements.forEach((item) => {
            const array = item.innerHTML.matchAll(regEx);
            for (const match of array) {
                this.replaceItem(item, match);
            }
        });
        engrid_ENGrid.setBodyData("merge-tags-processed", "");
    }
    /**
     * Replaces a specific data item in the given HTML element.
     * @param where The HTML element where the replacement should occur.
     * @param item The matched data item.
     * @param key The key of the data item.
     * @param defaultValue The default value to use if the data item is not found.
     */
    replaceItem(where, [item, key, defaultValue]) {
        var _a;
        let value = (_a = engrid_ENGrid.getUrlParameter(`engrid_data[${key}]`)) !== null && _a !== void 0 ? _a : defaultValue;
        if (typeof value === "string") {
            value = value.replace(/\r?\\n|\n|\r/g, "<br>");
        }
        else {
            value = "";
        }
        this.logger.log("Replacing", key, value);
        where.innerHTML = where.innerHTML.replace(item, value);
    }
}

;// CONCATENATED MODULE: ./node_modules/@4site/engrid-scripts/dist/data-hide.js
// Hides elements based on URL arguments.
//
// The DataHide class is used to hide elements based on URL arguments.
// It retrieves the elements to hide from the URL arguments and hides them.
// If no elements are found, the constructor returns early.
// Otherwise, it logs the found elements and hides them.

class DataHide {
    constructor() {
        this.logger = new EngridLogger("DataHide", "#333333", "#f0f0f0", "🙈");
        this.enElements = new Array();
        this.logger.log("Constructor");
        this.enElements = engrid_ENGrid.getUrlParameter("engrid_hide[]");
        if (!this.enElements || this.enElements.length === 0) {
            this.logger.log("No Elements Found");
            return;
        }
        this.logger.log("Elements Found:", this.enElements);
        this.hideAll();
    }
    /**
     * Hides all the elements based on the URL arguments.
     */
    hideAll() {
        this.enElements.forEach((element) => {
            const item = Object.keys(element)[0];
            const type = Object.values(element)[0];
            this.hideItem(item, type);
        });
        return;
    }
    /**
     * Hides a specific element based on the item and type.
     * @param item - The item to hide (ID or class name).
     * @param type - The type of the item (either "id" or "class").
     */
    hideItem(item, type) {
        const regEx = /engrid_hide\[([\w-]+)\]/g;
        const itemData = [...item.matchAll(regEx)].map((match) => match[1])[0];
        switch (type) {
            case "id":
                const element = document.getElementById(itemData);
                if (element) {
                    this.logger.log("Hiding By ID", itemData, element);
                    element.setAttribute("hidden-via-url-argument", "");
                }
                else {
                    this.logger.error("Element Not Found By ID", itemData);
                }
                break;
            case "class":
            default:
                const elements = document.getElementsByClassName(itemData);
                if (elements.length > 0) {
                    for (let i = 0; i < elements.length; i++) {
                        this.logger.log("Hiding By Class", itemData, elements[i]);
                        elements[i].setAttribute("hidden-via-url-argument", "");
                    }
                }
                else {
                    this.logger.log("No Elements Found By Class", itemData);
                }
                break;
        }
    }
}

;// CONCATENATED MODULE: ./node_modules/@4site/engrid-scripts/dist/add-name-to-message.js
/*
 Adds first and last name when First Name and Last Name fields lose focus if name shortcodes aren't present
*/

class AddNameToMessage {
    constructor() {
        if (!this.shouldRun()) {
            // Don't run the script if the page isn't email to target
            return;
        }
        this.replaceNameShortcode("#en__field_supporter_firstName", "#en__field_supporter_lastName");
    }
    shouldRun() {
        return engrid_ENGrid.getPageType() === "EMAILTOTARGET";
    }
    replaceNameShortcode(fName, lName) {
        const firstName = document.querySelector(fName);
        const lastName = document.querySelector(lName);
        let message = document.querySelector('[name="contact.message"]');
        let addedFirstName = false;
        let addedLastName = false;
        if (message) {
            if (message.value.includes("{user_data~First Name") ||
                message.value.includes("{user_data~Last Name")) {
                return;
            }
            else {
                if (!message.value.includes("{user_data~First Name") && firstName) {
                    firstName.addEventListener("blur", (e) => {
                        const target = e.target;
                        if (message && !addedFirstName) {
                            addedFirstName = true;
                            message.value = message.value.concat("\n" + target.value);
                        }
                    });
                }
                if (!message.value.includes("{user_data~Last Name") && lastName) {
                    lastName.addEventListener("blur", (e) => {
                        const target = e.target;
                        if (message && !addedLastName) {
                            addedLastName = true;
                            message.value = message.value.concat(" " + target.value);
                        }
                    });
                }
            }
        }
    }
}

;// CONCATENATED MODULE: ./node_modules/@4site/engrid-scripts/dist/expand-region-name.js
// Populates hidden supporter field "Region Long Format" with expanded name (e.g FL becomes Florida)


class ExpandRegionName {
    constructor() {
        this._form = EnForm.getInstance();
        this.logger = new EngridLogger("ExpandRegionName", "#333333", "#00eb65", "🌍");
        if (this.shouldRun()) {
            const expandedRegionField = engrid_ENGrid.getOption("RegionLongFormat");
            console.log("expandedRegionField", expandedRegionField);
            const hiddenRegion = document.querySelector(`[name="${expandedRegionField}"]`);
            if (!hiddenRegion) {
                this.logger.log(`CREATED field ${expandedRegionField}`);
                engrid_ENGrid.createHiddenInput(expandedRegionField);
            }
            this._form.onValidate.subscribe(() => this.expandRegion());
        }
    }
    shouldRun() {
        return !!engrid_ENGrid.getOption("RegionLongFormat");
    }
    expandRegion() {
        if (!this._form.validate)
            return;
        const userRegion = document.querySelector('[name="supporter.region"]'); // User entered region on the page
        const expandedRegionField = engrid_ENGrid.getOption("RegionLongFormat");
        const hiddenRegion = document.querySelector(`[name="${expandedRegionField}"]`); // Hidden region long form field
        if (!userRegion) {
            this.logger.log("No region field to populate the hidden region field with");
            return; // Don't populate hidden region field if user region field isn't on page
        }
        if (userRegion.tagName === "SELECT" && "options" in userRegion) {
            const regionValue = userRegion.options[userRegion.selectedIndex].innerText;
            hiddenRegion.value = regionValue;
            this.logger.log("Populated field", hiddenRegion.value);
        }
        else if (userRegion.tagName === "INPUT") {
            const regionValue = userRegion.value;
            hiddenRegion.value = regionValue;
            this.logger.log("Populated field", hiddenRegion.value);
        }
        return true;
    }
}

;// CONCATENATED MODULE: ./node_modules/@4site/engrid-scripts/dist/url-to-form.js
// Component that allows to set a field value from URL parameters
// Workflow:
// 1. Loop through all the URL parameters
// 2. Check if there's a match with the field name
// 3. If there's a match AND the field is empty, set the value

class UrlToForm {
    constructor() {
        this.logger = new EngridLogger("UrlToForm", "white", "magenta", "🔗");
        this.urlParams = new URLSearchParams(document.location.search);
        if (!this.shouldRun())
            return;
        this.urlParams.forEach((value, key) => {
            const field = document.getElementsByName(key)[0];
            if (field) {
                if (!["text", "textarea"].includes(field.type) || !field.value) {
                    engrid_ENGrid.setFieldValue(key, value);
                    this.logger.log(`Set: ${key} to ${value}`);
                }
            }
        });
    }
    shouldRun() {
        return !!document.location.search && this.hasFields();
    }
    hasFields() {
        const ret = [...this.urlParams.keys()].map((key) => {
            return document.getElementsByName(key).length > 0;
        });
        return ret.includes(true);
    }
}

;// CONCATENATED MODULE: ./node_modules/@4site/engrid-scripts/dist/required-if-visible.js

class RequiredIfVisible {
    constructor() {
        this.logger = new EngridLogger("RequiredIfVisible", "#FFFFFF", "#811212", "🚥");
        this._form = EnForm.getInstance();
        this.requiredIfVisibleElements = document.querySelectorAll(`
    .i-required .en__field,
    .i1-required .en__field:nth-of-type(1),
    .i2-required .en__field:nth-of-type(2),
    .i3-required .en__field:nth-of-type(3),
    .i4-required .en__field:nth-of-type(4),
    .i5-required .en__field:nth-of-type(5),
    .i6-required .en__field:nth-of-type(6),
    .i7-required .en__field:nth-of-type(7),
    .i8-required .en__field:nth-of-type(8),
    .i9-required .en__field:nth-of-type(9),
    .i10-required .en__field:nth-of-type(10),
    .i11-required .en__field:nth-of-type(11)
    `);
        if (!this.shouldRun())
            return;
        this._form.onValidate.subscribe(this.validate.bind(this));
    }
    shouldRun() {
        return this.requiredIfVisibleElements.length > 0;
    }
    validate() {
        // We're converting the NodeListOf<HTMLElement> to an Array<HTMLElement>
        // because we need to reverse the order of the elements so the last error
        // is the highest element to get focus()
        Array.from(this.requiredIfVisibleElements)
            .reverse()
            .forEach((field) => {
            engrid_ENGrid.removeError(field);
            if (engrid_ENGrid.isVisible(field)) {
                this.logger.log(`${field.getAttribute("class")} is visible`);
                const fieldElement = field.querySelector("input:not([type=hidden]) , select, textarea");
                if (fieldElement &&
                    fieldElement.closest("[data-unhidden]") === null &&
                    !engrid_ENGrid.getFieldValue(fieldElement.getAttribute("name"))) {
                    const fieldLabel = field.querySelector(".en__field__label");
                    if (fieldLabel) {
                        this.logger.log(`${fieldLabel.innerText} is required`);
                        window.setTimeout(() => {
                            engrid_ENGrid.setError(field, `${fieldLabel.innerText} is required`);
                        }, 100);
                    }
                    else {
                        this.logger.log(`${fieldElement.getAttribute("name")} is required`);
                        window.setTimeout(() => {
                            engrid_ENGrid.setError(field, `This field is required`);
                        }, 100);
                    }
                    fieldElement.focus();
                    this._form.validate = false;
                }
            }
        });
    }
}

;// CONCATENATED MODULE: ./node_modules/@4site/engrid-scripts/dist/tidycontact.js
var tidycontact_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

class TidyContact {
    constructor() {
        var _a, _b, _c, _d, _e;
        this.logger = new EngridLogger("TidyContact", "#FFFFFF", "#4d9068", "📧");
        this.endpoint = "https://api.tidycontact.io";
        this.wasCalled = false; // True if the API endpoint was called
        this.httpStatus = 0;
        this.timeout = 5; // Seconds to API Timeout
        this.isDirty = false; // True if the address was changed by the user
        this._form = EnForm.getInstance();
        this.countries_list = [
            ["Afghanistan", "af", "93", "070 123 4567"],
            ["Albania", "al", "355", "067 212 3456"],
            ["Algeria", "dz", "213", "0551 23 45 67"],
            ["American Samoa", "as", "1", "(684) 733-1234"],
            ["Andorra", "ad", "376", "312 345"],
            ["Angola", "ao", "244", "923 123 456"],
            ["Anguilla", "ai", "1", "(264) 235-1234"],
            ["Antigua and Barbuda", "ag", "1", "(268) 464-1234"],
            ["Argentina", "ar", "54", "011 15-2345-6789"],
            ["Armenia", "am", "374", "077 123456"],
            ["Aruba", "aw", "297", "560 1234"],
            ["Australia", "au", "61", "0412 345 678"],
            ["Austria", "at", "43", "0664 123456"],
            ["Azerbaijan", "az", "994", "040 123 45 67"],
            ["Bahamas", "bs", "1", "(242) 359-1234"],
            ["Bahrain", "bh", "973", "3600 1234"],
            ["Bangladesh", "bd", "880", "01812-345678"],
            ["Barbados", "bb", "1", "(246) 250-1234"],
            ["Belarus", "by", "375", "8 029 491-19-11"],
            ["Belgium", "be", "32", "0470 12 34 56"],
            ["Belize", "bz", "501", "622-1234"],
            ["Benin", "bj", "229", "90 01 12 34"],
            ["Bermuda", "bm", "1", "(441) 370-1234"],
            ["Bhutan", "bt", "975", "17 12 34 56"],
            ["Bolivia", "bo", "591", "71234567"],
            ["Bosnia and Herzegovina", "ba", "387", "061 123 456"],
            ["Botswana", "bw", "267", "71 123 456"],
            ["Brazil", "br", "55", "(11) 96123-4567"],
            ["British Indian Ocean Territory", "io", "246", "380 1234"],
            ["British Virgin Islands", "vg", "1", "(284) 300-1234"],
            ["Brunei", "bn", "673", "712 3456"],
            ["Bulgaria", "bg", "359", "048 123 456"],
            ["Burkina Faso", "bf", "226", "70 12 34 56"],
            ["Burundi", "bi", "257", "79 56 12 34"],
            ["Cambodia", "kh", "855", "091 234 567"],
            ["Cameroon", "cm", "237", "6 71 23 45 67"],
            ["Canada", "ca", "1", "(506) 234-5678"],
            ["Cape Verde", "cv", "238", "991 12 34"],
            ["Caribbean Netherlands", "bq", "599", "318 1234"],
            ["Cayman Islands", "ky", "1", "(345) 323-1234"],
            ["Central African Republic", "cf", "236", "70 01 23 45"],
            ["Chad", "td", "235", "63 01 23 45"],
            ["Chile", "cl", "56", "(2) 2123 4567"],
            ["China", "cn", "86", "131 2345 6789"],
            ["Christmas Island", "cx", "61", "0412 345 678"],
            ["Cocos Islands", "cc", "61", "0412 345 678"],
            ["Colombia", "co", "57", "321 1234567"],
            ["Comoros", "km", "269", "321 23 45"],
            ["Congo", "cd", "243", "0991 234 567"],
            ["Congo", "cg", "242", "06 123 4567"],
            ["Cook Islands", "ck", "682", "71 234"],
            ["Costa Rica", "cr", "506", "8312 3456"],
            ["Côte d’Ivoire", "ci", "225", "01 23 45 6789"],
            ["Croatia", "hr", "385", "092 123 4567"],
            ["Cuba", "cu", "53", "05 1234567"],
            ["Curaçao", "cw", "599", "9 518 1234"],
            ["Cyprus", "cy", "357", "96 123456"],
            ["Czech Republic", "cz", "420", "601 123 456"],
            ["Denmark", "dk", "45", "32 12 34 56"],
            ["Djibouti", "dj", "253", "77 83 10 01"],
            ["Dominica", "dm", "1", "(767) 225-1234"],
            ["Dominican Republic", "do", "1", "(809) 234-5678"],
            ["Ecuador", "ec", "593", "099 123 4567"],
            ["Egypt", "eg", "20", "0100 123 4567"],
            ["El Salvador", "sv", "503", "7012 3456"],
            ["Equatorial Guinea", "gq", "240", "222 123 456"],
            ["Eritrea", "er", "291", "07 123 456"],
            ["Estonia", "ee", "372", "5123 4567"],
            ["Eswatini", "sz", "268", "7612 3456"],
            ["Ethiopia", "et", "251", "091 123 4567"],
            ["Falkland Islands", "fk", "500", "51234"],
            ["Faroe Islands", "fo", "298", "211234"],
            ["Fiji", "fj", "679", "701 2345"],
            ["Finland", "fi", "358", "041 2345678"],
            ["France", "fr", "33", "06 12 34 56 78"],
            ["French Guiana", "gf", "594", "0694 20 12 34"],
            ["French Polynesia", "pf", "689", "87 12 34 56"],
            ["Gabon", "ga", "241", "06 03 12 34"],
            ["Gambia", "gm", "220", "301 2345"],
            ["Georgia", "ge", "995", "555 12 34 56"],
            ["Germany", "de", "49", "01512 3456789"],
            ["Ghana", "gh", "233", "023 123 4567"],
            ["Gibraltar", "gi", "350", "57123456"],
            ["Greece", "gr", "30", "691 234 5678"],
            ["Greenland", "gl", "299", "22 12 34"],
            ["Grenada", "gd", "1", "(473) 403-1234"],
            ["Guadeloupe", "gp", "590", "0690 00 12 34"],
            ["Guam", "gu", "1", "(671) 300-1234"],
            ["Guatemala", "gt", "502", "5123 4567"],
            ["Guernsey", "gg", "44", "07781 123456"],
            ["Guinea", "gn", "224", "601 12 34 56"],
            ["Guinea-Bissau", "gw", "245", "955 012 345"],
            ["Guyana", "gy", "592", "609 1234"],
            ["Haiti", "ht", "509", "34 10 1234"],
            ["Honduras", "hn", "504", "9123-4567"],
            ["Hong Kong", "hk", "852", "5123 4567"],
            ["Hungary", "hu", "36", "06 20 123 4567"],
            ["Iceland", "is", "354", "611 1234"],
            ["India", "in", "91", "081234 56789"],
            ["Indonesia", "id", "62", "0812-345-678"],
            ["Iran", "ir", "98", "0912 345 6789"],
            ["Iraq", "iq", "964", "0791 234 5678"],
            ["Ireland", "ie", "353", "085 012 3456"],
            ["Isle of Man", "im", "44", "07924 123456"],
            ["Israel", "il", "972", "050-234-5678"],
            ["Italy", "it", "39", "312 345 6789"],
            ["Jamaica", "jm", "1", "(876) 210-1234"],
            ["Japan", "jp", "81", "090-1234-5678"],
            ["Jersey", "je", "44", "07797 712345"],
            ["Jordan", "jo", "962", "07 9012 3456"],
            ["Kazakhstan", "kz", "7", "8 (771) 000 9998"],
            ["Kenya", "ke", "254", "0712 123456"],
            ["Kiribati", "ki", "686", "72001234"],
            ["Kosovo", "xk", "383", "043 201 234"],
            ["Kuwait", "kw", "965", "500 12345"],
            ["Kyrgyzstan", "kg", "996", "0700 123 456"],
            ["Laos", "la", "856", "020 23 123 456"],
            ["Latvia", "lv", "371", "21 234 567"],
            ["Lebanon", "lb", "961", "71 123 456"],
            ["Lesotho", "ls", "266", "5012 3456"],
            ["Liberia", "lr", "231", "077 012 3456"],
            ["Libya", "ly", "218", "091-2345678"],
            ["Liechtenstein", "li", "423", "660 234 567"],
            ["Lithuania", "lt", "370", "(8-612) 34567"],
            ["Luxembourg", "lu", "352", "628 123 456"],
            ["Macau", "mo", "853", "6612 3456"],
            ["North Macedonia", "mk", "389", "072 345 678"],
            ["Madagascar", "mg", "261", "032 12 345 67"],
            ["Malawi", "mw", "265", "0991 23 45 67"],
            ["Malaysia", "my", "60", "012-345 6789"],
            ["Maldives", "mv", "960", "771-2345"],
            ["Mali", "ml", "223", "65 01 23 45"],
            ["Malta", "mt", "356", "9696 1234"],
            ["Marshall Islands", "mh", "692", "235-1234"],
            ["Martinique", "mq", "596", "0696 20 12 34"],
            ["Mauritania", "mr", "222", "22 12 34 56"],
            ["Mauritius", "mu", "230", "5251 2345"],
            ["Mayotte", "yt", "262", "0639 01 23 45"],
            ["Mexico", "mx", "52", "222 123 4567"],
            ["Micronesia", "fm", "691", "350 1234"],
            ["Moldova", "md", "373", "0621 12 345"],
            ["Monaco", "mc", "377", "06 12 34 56 78"],
            ["Mongolia", "mn", "976", "8812 3456"],
            ["Montenegro", "me", "382", "067 622 901"],
            ["Montserrat", "ms", "1", "(664) 492-3456"],
            ["Morocco", "ma", "212", "0650-123456"],
            ["Mozambique", "mz", "258", "82 123 4567"],
            ["Myanmar", "mm", "95", "09 212 3456"],
            ["Namibia", "na", "264", "081 123 4567"],
            ["Nauru", "nr", "674", "555 1234"],
            ["Nepal", "np", "977", "984-1234567"],
            ["Netherlands", "nl", "31", "06 12345678"],
            ["New Caledonia", "nc", "687", "75.12.34"],
            ["New Zealand", "nz", "64", "021 123 4567"],
            ["Nicaragua", "ni", "505", "8123 4567"],
            ["Niger", "ne", "227", "93 12 34 56"],
            ["Nigeria", "ng", "234", "0802 123 4567"],
            ["Niue", "nu", "683", "888 4012"],
            ["Norfolk Island", "nf", "672", "3 81234"],
            ["North Korea", "kp", "850", "0192 123 4567"],
            ["Northern Mariana Islands", "mp", "1", "(670) 234-5678"],
            ["Norway", "no", "47", "406 12 345"],
            ["Oman", "om", "968", "9212 3456"],
            ["Pakistan", "pk", "92", "0301 2345678"],
            ["Palau", "pw", "680", "620 1234"],
            ["Palestine", "ps", "970", "0599 123 456"],
            ["Panama", "pa", "507", "6123-4567"],
            ["Papua New Guinea", "pg", "675", "7012 3456"],
            ["Paraguay", "py", "595", "0961 456789"],
            ["Peru", "pe", "51", "912 345 678"],
            ["Philippines", "ph", "63", "0905 123 4567"],
            ["Poland", "pl", "48", "512 345 678"],
            ["Portugal", "pt", "351", "912 345 678"],
            ["Puerto Rico", "pr", "1", "(787) 234-5678"],
            ["Qatar", "qa", "974", "3312 3456"],
            ["Réunion", "re", "262", "0692 12 34 56"],
            ["Romania", "ro", "40", "0712 034 567"],
            ["Russia", "ru", "7", "8 (912) 345-67-89"],
            ["Rwanda", "rw", "250", "0720 123 456"],
            ["Saint Barthélemy", "bl", "590", "0690 00 12 34"],
            ["Saint Helena", "sh", "290", "51234"],
            ["Saint Kitts and Nevis", "kn", "1", "(869) 765-2917"],
            ["Saint Lucia", "lc", "1", "(758) 284-5678"],
            ["Saint Martin", "mf", "590", "0690 00 12 34"],
            ["Saint Pierre and Miquelon", "pm", "508", "055 12 34"],
            ["Saint Vincent and the Grenadines", "vc", "1", "(784) 430-1234"],
            ["Samoa", "ws", "685", "72 12345"],
            ["San Marino", "sm", "378", "66 66 12 12"],
            ["São Tomé and Príncipe", "st", "239", "981 2345"],
            ["Saudi Arabia", "sa", "966", "051 234 5678"],
            ["Senegal", "sn", "221", "70 123 45 67"],
            ["Serbia", "rs", "381", "060 1234567"],
            ["Seychelles", "sc", "248", "2 510 123"],
            ["Sierra Leone", "sl", "232", "(025) 123456"],
            ["Singapore", "sg", "65", "8123 4567"],
            ["Sint Maarten", "sx", "1", "(721) 520-5678"],
            ["Slovakia", "sk", "421", "0912 123 456"],
            ["Slovenia", "si", "386", "031 234 567"],
            ["Solomon Islands", "sb", "677", "74 21234"],
            ["Somalia", "so", "252", "7 1123456"],
            ["South Africa", "za", "27", "071 123 4567"],
            ["South Korea", "kr", "82", "010-2000-0000"],
            ["South Sudan", "ss", "211", "0977 123 456"],
            ["Spain", "es", "34", "612 34 56 78"],
            ["Sri Lanka", "lk", "94", "071 234 5678"],
            ["Sudan", "sd", "249", "091 123 1234"],
            ["Suriname", "sr", "597", "741-2345"],
            ["Svalbard and Jan Mayen", "sj", "47", "412 34 567"],
            ["Sweden", "se", "46", "070-123 45 67"],
            ["Switzerland", "ch", "41", "078 123 45 67"],
            ["Syria", "sy", "963", "0944 567 890"],
            ["Taiwan", "tw", "886", "0912 345 678"],
            ["Tajikistan", "tj", "992", "917 12 3456"],
            ["Tanzania", "tz", "255", "0621 234 567"],
            ["Thailand", "th", "66", "081 234 5678"],
            ["Timor-Leste", "tl", "670", "7721 2345"],
            ["Togo", "tg", "228", "90 11 23 45"],
            ["Tokelau", "tk", "690", "7290"],
            ["Tonga", "to", "676", "771 5123"],
            ["Trinidad and Tobago", "tt", "1", "(868) 291-1234"],
            ["Tunisia", "tn", "216", "20 123 456"],
            ["Turkey", "tr", "90", "0501 234 56 78"],
            ["Turkmenistan", "tm", "993", "8 66 123456"],
            ["Turks and Caicos Islands", "tc", "1", "(649) 231-1234"],
            ["Tuvalu", "tv", "688", "90 1234"],
            ["U.S. Virgin Islands", "vi", "1", "(340) 642-1234"],
            ["Uganda", "ug", "256", "0712 345678"],
            ["Ukraine", "ua", "380", "050 123 4567"],
            ["United Arab Emirates", "ae", "971", "050 123 4567"],
            ["United Kingdom", "gb", "44", "07400 123456"],
            ["United States", "us", "1", "(201) 555-0123"],
            ["Uruguay", "uy", "598", "094 231 234"],
            ["Uzbekistan", "uz", "998", "8 91 234 56 78"],
            ["Vanuatu", "vu", "678", "591 2345"],
            ["Vatican City", "va", "39", "312 345 6789"],
            ["Venezuela", "ve", "58", "0412-1234567"],
            ["Vietnam", "vn", "84", "091 234 56 78"],
            ["Wallis and Futuna", "wf", "681", "82 12 34"],
            ["Western Sahara", "eh", "212", "0650-123456"],
            ["Yemen", "ye", "967", "0712 345 678"],
            ["Zambia", "zm", "260", "095 5123456"],
            ["Zimbabwe", "zw", "263", "071 234 5678"],
            ["Åland Islands", "ax", "358", "041 2345678"],
        ];
        this.countries_dropdown = null;
        this.country_ip = null;
        this.options = engrid_ENGrid.getOption("TidyContact");
        if (this.options === false || !((_a = this.options) === null || _a === void 0 ? void 0 : _a.cid))
            return;
        this.loadOptions();
        if (!this.hasAddressFields() && !this.phoneEnabled()) {
            this.logger.log("No address fields found");
            return;
        }
        this.createFields();
        this.addEventListeners();
        if (engrid_ENGrid.checkNested(window.EngagingNetworks, "require", "_defined", "enjs", "checkSubmissionFailed") &&
            !window.EngagingNetworks.require._defined.enjs.checkSubmissionFailed() &&
            engrid_ENGrid.getFieldValue((_c = (_b = this.options) === null || _b === void 0 ? void 0 : _b.address_fields) === null || _c === void 0 ? void 0 : _c.address1) !=
                "") {
            this.logger.log("Address Field is not empty");
            this.isDirty = true;
        }
        if (this.phoneEnabled()) {
            this.createPhoneFields();
            this.createPhoneMarginVariable();
            this.logger.log("Phone Standardization is enabled");
            if (this.countryDropDownEnabled()) {
                this.renderFlagsDropDown();
            }
            const phoneField = engrid_ENGrid.getField((_e = (_d = this.options) === null || _d === void 0 ? void 0 : _d.address_fields) === null || _e === void 0 ? void 0 : _e.phone);
            if (phoneField) {
                phoneField.addEventListener("keyup", (e) => {
                    this.handlePhoneInputKeydown(e);
                });
                this.setDefaultPhoneCountry();
            }
        }
    }
    loadOptions() {
        var _a, _b, _c, _d;
        if (this.options) {
            if (!this.options.address_fields) {
                this.options.address_fields = {
                    address1: "supporter.address1",
                    address2: "supporter.address2",
                    address3: "supporter.address3",
                    city: "supporter.city",
                    region: "supporter.region",
                    postalCode: "supporter.postcode",
                    country: "supporter.country",
                    phone: "supporter.phoneNumber2", // Phone field
                };
            }
            this.options.address_enable = (_a = this.options.address_enable) !== null && _a !== void 0 ? _a : true;
            if (this.options.phone_enable) {
                this.options.phone_flags = (_b = this.options.phone_flags) !== null && _b !== void 0 ? _b : true;
                this.options.phone_country_from_ip =
                    (_c = this.options.phone_country_from_ip) !== null && _c !== void 0 ? _c : true;
                this.options.phone_preferred_countries =
                    (_d = this.options.phone_preferred_countries) !== null && _d !== void 0 ? _d : [];
            }
        }
    }
    createFields() {
        var _a, _b, _c, _d, _e, _f;
        if (!this.options || !this.hasAddressFields())
            return;
        // Creating Latitude and Longitude fields
        const latitudeField = engrid_ENGrid.getField("supporter.geo.latitude");
        const longitudeField = engrid_ENGrid.getField("supporter.geo.longitude");
        if (!latitudeField) {
            engrid_ENGrid.createHiddenInput("supporter.geo.latitude", "");
            this.logger.log("Creating Hidden Field: supporter.geo.latitude");
        }
        if (!longitudeField) {
            engrid_ENGrid.createHiddenInput("supporter.geo.longitude", "");
            this.logger.log("Creating Hidden Field: supporter.geo.longitude");
        }
        if (this.options.record_field) {
            const recordField = engrid_ENGrid.getField(this.options.record_field);
            if (!recordField) {
                engrid_ENGrid.createHiddenInput(this.options.record_field, "");
                this.logger.log("Creating Hidden Field: " + this.options.record_field);
            }
        }
        if (this.options.date_field) {
            const dateField = engrid_ENGrid.getField(this.options.date_field);
            if (!dateField) {
                engrid_ENGrid.createHiddenInput(this.options.date_field, "");
                this.logger.log("Creating Hidden Field: " + this.options.date_field);
            }
        }
        if (this.options.status_field) {
            const statusField = engrid_ENGrid.getField(this.options.status_field);
            if (!statusField) {
                engrid_ENGrid.createHiddenInput(this.options.status_field, "");
                this.logger.log("Creating Hidden Field: " + this.options.status_field);
            }
        }
        // If there's no Address 2 or Address 3 field, create them
        if (!engrid_ENGrid.getField((_a = this.options.address_fields) === null || _a === void 0 ? void 0 : _a.address2)) {
            engrid_ENGrid.createHiddenInput((_b = this.options.address_fields) === null || _b === void 0 ? void 0 : _b.address2, "");
            this.logger.log("Creating Hidden Field: " + ((_c = this.options.address_fields) === null || _c === void 0 ? void 0 : _c.address2));
        }
        if (!engrid_ENGrid.getField((_d = this.options.address_fields) === null || _d === void 0 ? void 0 : _d.address3)) {
            engrid_ENGrid.createHiddenInput((_e = this.options.address_fields) === null || _e === void 0 ? void 0 : _e.address3, "");
            this.logger.log("Creating Hidden Field: " + ((_f = this.options.address_fields) === null || _f === void 0 ? void 0 : _f.address3));
        }
    }
    createPhoneFields() {
        if (!this.options)
            return;
        engrid_ENGrid.createHiddenInput("tc.phone.country", "");
        this.logger.log("Creating hidden field: tc.phone.country");
        if (this.options.phone_record_field) {
            const recordField = engrid_ENGrid.getField(this.options.phone_record_field);
            if (!recordField) {
                engrid_ENGrid.createHiddenInput(this.options.phone_record_field, "");
                this.logger.log("Creating hidden field: " + this.options.phone_record_field);
            }
        }
        if (this.options.phone_date_field) {
            const dateField = engrid_ENGrid.getField(this.options.phone_date_field);
            if (!dateField) {
                engrid_ENGrid.createHiddenInput(this.options.phone_date_field, "");
                this.logger.log("Creating hidden field: " + this.options.phone_date_field);
            }
        }
        if (this.options.phone_status_field) {
            const statusField = engrid_ENGrid.getField(this.options.phone_status_field);
            if (!statusField) {
                engrid_ENGrid.createHiddenInput(this.options.phone_status_field, "");
                this.logger.log("Creating hidden field: " + this.options.phone_status_field);
            }
        }
    }
    createPhoneMarginVariable() {
        var _a;
        if (!this.options)
            return;
        const phone = engrid_ENGrid.getField((_a = this.options.address_fields) === null || _a === void 0 ? void 0 : _a.phone);
        if (phone) {
            const phoneStyle = window.getComputedStyle(phone);
            const marginTop = phoneStyle.marginTop;
            const marginBottom = phoneStyle.marginBottom;
            document.documentElement.style.setProperty("--tc-phone-margin-top", marginTop);
            document.documentElement.style.setProperty("--tc-phone-margin-bottom", marginBottom);
        }
    }
    addEventListeners() {
        if (!this.options)
            return;
        // Add event listeners to fields
        if (this.options.address_fields) {
            for (const [key, value] of Object.entries(this.options.address_fields)) {
                const field = engrid_ENGrid.getField(value);
                if (!field)
                    continue;
                field.addEventListener("change", () => {
                    this.logger.log("Changed " + field.name, true);
                    this.isDirty = true;
                });
            }
        }
        // Add event listener to submit
        this._form.onSubmit.subscribe(this.callAPI.bind(this));
        // Attach the API call event to the Give By Select to anticipate the use of Digital Wallets
        const transactionGiveBySelect = document.getElementsByName("transaction.giveBySelect");
        if (transactionGiveBySelect) {
            transactionGiveBySelect.forEach((giveBySelect) => {
                giveBySelect.addEventListener("change", () => {
                    if (["stripedigitalwallet", "paypaltouch"].includes(giveBySelect.value.toLowerCase())) {
                        this.logger.log("Clicked Digital Wallet Button");
                        window.setTimeout(() => {
                            this.callAPI();
                        }, 500);
                    }
                });
            });
        }
    }
    checkSum(str) {
        return tidycontact_awaiter(this, void 0, void 0, function* () {
            // encode as UTF-8
            const msgBuffer = new TextEncoder().encode(str);
            // hash the message
            const hashBuffer = yield crypto.subtle.digest("SHA-256", msgBuffer);
            // convert ArrayBuffer to Array
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            // convert bytes to hex string
            const hashHex = hashArray
                .map((b) => ("00" + b.toString(16)).slice(-2))
                .join("");
            return hashHex;
        });
    }
    todaysDate() {
        return new Date()
            .toLocaleString("en-ZA", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        })
            .replace(/\/+/g, ""); // Format date as YYYYMMDD
    }
    countryAllowed(country) {
        var _a;
        if (!this.options)
            return false;
        // If the country list is empty, allow all countries
        if (!this.options.countries || this.options.countries.length === 0) {
            return true;
        }
        return !!((_a = this.options.countries) === null || _a === void 0 ? void 0 : _a.includes(country.toLowerCase()));
    }
    fetchTimeOut(url, params) {
        const abort = new AbortController();
        const signal = abort.signal;
        params = Object.assign(Object.assign({}, params), { signal });
        const promise = fetch(url, params);
        if (signal)
            signal.addEventListener("abort", () => abort.abort());
        const timeout = setTimeout(() => abort.abort(), this.timeout * 1000);
        return promise.finally(() => clearTimeout(timeout));
    }
    writeError(error) {
        if (!this.options)
            return;
        const recordField = engrid_ENGrid.getField(this.options.record_field);
        const dateField = engrid_ENGrid.getField(this.options.date_field);
        const statusField = engrid_ENGrid.getField(this.options.status_field);
        if (recordField) {
            let errorType = "";
            switch (this.httpStatus) {
                case 400:
                    errorType = "Bad Request";
                    break;
                case 401:
                    errorType = "Unauthorized";
                    break;
                case 403:
                    errorType = "Forbidden";
                    break;
                case 404:
                    errorType = "Not Found";
                    break;
                case 408:
                    errorType = "API Request Timeout";
                    break;
                case 500:
                    errorType = "Internal Server Error";
                    break;
                case 503:
                    errorType = "Service Unavailable";
                    break;
                default:
                    errorType = "Unknown Error";
                    break;
            }
            const errorData = {
                status: this.httpStatus,
                error: typeof error === "string" ? error : errorType.toUpperCase(),
            };
            recordField.value = JSON.stringify(errorData);
        }
        if (dateField) {
            dateField.value = this.todaysDate();
        }
        if (statusField) {
            statusField.value = "ERROR-API";
        }
    }
    setFields(data) {
        var _a, _b, _c, _d, _e;
        if (!this.options || !this.options.address_enable)
            return {};
        let response = {};
        const country = this.getCountry();
        const postalCodeValue = engrid_ENGrid.getFieldValue((_a = this.options.address_fields) === null || _a === void 0 ? void 0 : _a.postalCode);
        const zipDivider = (_b = this.options.us_zip_divider) !== null && _b !== void 0 ? _b : "+";
        // Check if there's no address2 field
        const address2Field = engrid_ENGrid.getField((_c = this.options.address_fields) === null || _c === void 0 ? void 0 : _c.address2);
        if ("address2" in data && !address2Field) {
            const address = engrid_ENGrid.getFieldValue((_d = this.options.address_fields) === null || _d === void 0 ? void 0 : _d.address1);
            if (address == data.address1 + " " + data.address2) {
                delete data.address1;
                delete data.address2;
            }
            else {
                data.address1 = data.address1 + " " + data.address2;
                delete data.address2;
            }
        }
        if ("postalCode" in data &&
            postalCodeValue.replace("+", zipDivider) ===
                data.postalCode.replace("+", zipDivider)) {
            // Postal code is the same
            delete data.postalCode;
        }
        // Set the fields
        for (const key in data) {
            const fieldKey = this.options.address_fields &&
                Object.keys(this.options.address_fields).includes(key)
                ? this.options.address_fields[key]
                : key;
            const field = engrid_ENGrid.getField(fieldKey);
            if (field) {
                let value = data[key];
                if (key === "postalCode" &&
                    ["US", "USA", "United States"].includes(country)) {
                    value = (_e = value.replace("+", zipDivider)) !== null && _e !== void 0 ? _e : ""; // Replace the "+" with the zip divider
                }
                response[key] = { from: field.value, to: value };
                this.logger.log(`Set ${field.name} to ${value} (${field.value})`);
                engrid_ENGrid.setFieldValue(fieldKey, value, false);
            }
            else {
                this.logger.log(`Field ${key} not found`);
            }
        }
        return response;
    }
    hasAddressFields() {
        var _a, _b, _c, _d, _e, _f;
        if (!this.options || !this.options.address_enable)
            return false;
        const address1 = engrid_ENGrid.getField((_a = this.options.address_fields) === null || _a === void 0 ? void 0 : _a.address1);
        const address2 = engrid_ENGrid.getField((_b = this.options.address_fields) === null || _b === void 0 ? void 0 : _b.address2);
        const city = engrid_ENGrid.getField((_c = this.options.address_fields) === null || _c === void 0 ? void 0 : _c.city);
        const region = engrid_ENGrid.getField((_d = this.options.address_fields) === null || _d === void 0 ? void 0 : _d.region);
        const postalCode = engrid_ENGrid.getField((_e = this.options.address_fields) === null || _e === void 0 ? void 0 : _e.postalCode);
        const country = engrid_ENGrid.getField((_f = this.options.address_fields) === null || _f === void 0 ? void 0 : _f.country);
        return !!(address1 || address2 || city || region || postalCode || country);
    }
    canUseAPI() {
        var _a, _b, _c, _d;
        if (!this.options || !this.hasAddressFields())
            return false;
        const country = !!this.getCountry();
        const address1 = !!engrid_ENGrid.getFieldValue((_a = this.options.address_fields) === null || _a === void 0 ? void 0 : _a.address1);
        const city = !!engrid_ENGrid.getFieldValue((_b = this.options.address_fields) === null || _b === void 0 ? void 0 : _b.city);
        const region = !!engrid_ENGrid.getFieldValue((_c = this.options.address_fields) === null || _c === void 0 ? void 0 : _c.region);
        const postalCode = !!engrid_ENGrid.getFieldValue((_d = this.options.address_fields) === null || _d === void 0 ? void 0 : _d.postalCode);
        if (country && address1) {
            return (city && region) || postalCode;
        }
        this.logger.log("API cannot be used");
        return false;
    }
    canUsePhoneAPI() {
        var _a;
        if (!this.options)
            return false;
        if (this.phoneEnabled()) {
            const phone = !!engrid_ENGrid.getFieldValue((_a = this.options.address_fields) === null || _a === void 0 ? void 0 : _a.phone);
            const countryPhone = !!engrid_ENGrid.getFieldValue("tc.phone.country");
            return phone && countryPhone;
        }
        this.logger.log("Phone API is not enabled");
        return false;
    }
    getCountry() {
        var _a, _b;
        if (!this.options)
            return "";
        const countryFallback = (_a = this.options.country_fallback) !== null && _a !== void 0 ? _a : "";
        const country = engrid_ENGrid.getFieldValue((_b = this.options.address_fields) === null || _b === void 0 ? void 0 : _b.country);
        return country || countryFallback.toUpperCase();
    }
    getCountryByCode(code) {
        var _a;
        const countryItem = (_a = this.countries_list.find((country) => country.includes(code))) !== null && _a !== void 0 ? _a : "";
        if (countryItem) {
            return {
                name: countryItem[0],
                code: countryItem[1],
                dialCode: countryItem[2],
                placeholder: countryItem[3],
            };
        }
        return null;
    }
    phoneEnabled() {
        return !!(this.options && this.options.phone_enable);
    }
    countryDropDownEnabled() {
        return !!(this.options && this.options.phone_flags);
    }
    getCountryFromIP() {
        return tidycontact_awaiter(this, void 0, void 0, function* () {
            return fetch(`https://${window.location.hostname}/cdn-cgi/trace`)
                .then((res) => res.text())
                .then((t) => {
                let data = t.replace(/[\r\n]+/g, '","').replace(/\=+/g, '":"');
                data = '{"' + data.slice(0, data.lastIndexOf('","')) + '"}';
                const jsondata = JSON.parse(data);
                this.country_ip = jsondata.loc;
                return this.country_ip;
            });
        });
    }
    renderFlagsDropDown() {
        var _a;
        if (!this.options)
            return;
        const phoneInput = engrid_ENGrid.getField((_a = this.options.address_fields) === null || _a === void 0 ? void 0 : _a.phone);
        if (!phoneInput)
            return;
        this.countries_dropdown = document.createElement("div");
        this.countries_dropdown.classList.add("tc-flags-container");
        const selectedFlag = document.createElement("div");
        selectedFlag.classList.add("tc-selected-flag");
        selectedFlag.setAttribute("role", "combobox");
        selectedFlag.setAttribute("aria-haspopup", "listbox");
        selectedFlag.setAttribute("aria-expanded", "false");
        selectedFlag.setAttribute("aria-owns", "tc-flags-list");
        selectedFlag.setAttribute("aria-label", "Select Country");
        selectedFlag.setAttribute("tabindex", "0");
        const seletedFlagInner = document.createElement("div");
        seletedFlagInner.classList.add("tc-flag");
        // seletedFlagInner.innerHTML = this.getFlagImage("us", "United States");
        const flagArrow = document.createElement("div");
        flagArrow.classList.add("tc-flag-arrow");
        // flagArrow.innerHTML = "&#x25BC;";
        selectedFlag.appendChild(seletedFlagInner);
        selectedFlag.appendChild(flagArrow);
        selectedFlag.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (selectedFlag.classList.contains("tc-open")) {
                this.closeCountryDropDown();
            }
            else {
                this.openCountryDropDown();
            }
        });
        const countryList = document.createElement("ul");
        countryList.classList.add("tc-country-list");
        countryList.classList.add("tc-hide");
        countryList.setAttribute("id", "tc-country-list");
        countryList.setAttribute("role", "listbox");
        countryList.setAttribute("aria-label", "List of Countries");
        countryList.setAttribute("aria-hidden", "true");
        if (this.options.phone_preferred_countries.length > 0) {
            const preferredCountries = [];
            this.options.phone_preferred_countries.forEach((country) => {
                const countryItem = this.getCountryByCode(country);
                if (countryItem) {
                    preferredCountries.push(countryItem);
                }
            });
            this.appendCountryItems(countryList, preferredCountries, "tc-country-list-item", true);
            const divider = document.createElement("li");
            divider.classList.add("tc-divider");
            divider.setAttribute("role", "separator");
            divider.setAttribute("aria-disabled", "true");
            countryList.appendChild(divider);
            this.logger.log("Rendering preferred countries", JSON.stringify(preferredCountries));
        }
        const countryListItems = [];
        this.countries_list.forEach((country) => {
            countryListItems.push({
                name: country[0],
                code: country[1],
                dialCode: country[2],
                placeholder: country[3],
            });
        });
        this.appendCountryItems(countryList, countryListItems, "tc-country-list-item");
        countryList.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            const target = e.target.closest("li");
            if (target.classList.contains("tc-country-list-item")) {
                const countryItem = this.getCountryByCode(target.getAttribute("data-country-code"));
                if (countryItem) {
                    this.setPhoneCountry(countryItem);
                }
            }
        });
        countryList.addEventListener("mouseover", (e) => {
            e.preventDefault();
            e.stopPropagation();
            const target = e.target.closest("li.tc-country-list-item");
            if (target) {
                this.highlightCountry(target.getAttribute("data-country-code"));
            }
        });
        this.countries_dropdown.appendChild(selectedFlag);
        this.countries_dropdown.appendChild(countryList);
        phoneInput.parentNode.insertBefore(this.countries_dropdown, phoneInput);
        phoneInput.parentNode.classList.add("tc-has-country-flags");
        this.countries_dropdown.addEventListener("keydown", (e) => {
            var _a, _b;
            const isDropdownHidden = (_b = (_a = this.countries_dropdown) === null || _a === void 0 ? void 0 : _a.querySelector(".tc-country-list")) === null || _b === void 0 ? void 0 : _b.classList.contains("tc-hide");
            if (isDropdownHidden &&
                ["ArrowUp", "Up", "ArrowDown", "Down", " ", "Enter"].indexOf(e.key) !==
                    -1) {
                // prevent form from being submitted if "ENTER" was pressed
                e.preventDefault();
                // prevent event from being handled again by document
                e.stopPropagation();
                this.openCountryDropDown();
            }
            // allow navigation from dropdown to input on TAB
            if (e.key === "Tab")
                this.closeCountryDropDown();
        });
        document.addEventListener("keydown", (e) => {
            var _a, _b;
            const isDropdownHidden = (_b = (_a = this.countries_dropdown) === null || _a === void 0 ? void 0 : _a.querySelector(".tc-country-list")) === null || _b === void 0 ? void 0 : _b.classList.contains("tc-hide");
            if (!isDropdownHidden) {
                // prevent down key from scrolling the whole page,
                // and enter key from submitting a form etc
                e.preventDefault();
                // up and down to navigate
                if (e.key === "ArrowUp" ||
                    e.key === "Up" ||
                    e.key === "ArrowDown" ||
                    e.key === "Down")
                    this.handleUpDownKey(e.key);
                // enter to select
                else if (e.key === "Enter")
                    this.handleEnterKey();
                // esc to close
                else if (e.key === "Escape")
                    this.closeCountryDropDown();
            }
        });
        document.addEventListener("click", (e) => {
            var _a, _b;
            const isDropdownHidden = (_b = (_a = this.countries_dropdown) === null || _a === void 0 ? void 0 : _a.querySelector(".tc-country-list")) === null || _b === void 0 ? void 0 : _b.classList.contains("tc-hide");
            if (!isDropdownHidden &&
                !e.target.closest(".tc-country-list")) {
                this.closeCountryDropDown();
            }
        });
    }
    handleUpDownKey(key) {
        var _a;
        const highlightedCountry = (_a = this.countries_dropdown) === null || _a === void 0 ? void 0 : _a.querySelector(".tc-highlight");
        if (highlightedCountry) {
            let next = key === "ArrowUp" || key === "Up"
                ? highlightedCountry.previousElementSibling
                : highlightedCountry.nextElementSibling;
            if (next) {
                if (next.classList.contains("tc-divider")) {
                    next =
                        key === "ArrowUp" || key === "Up"
                            ? next.previousElementSibling
                            : next.nextElementSibling;
                }
                this.highlightCountry(next === null || next === void 0 ? void 0 : next.getAttribute("data-country-code"));
            }
        }
    }
    handleEnterKey() {
        var _a;
        const highlightedCountry = (_a = this.countries_dropdown) === null || _a === void 0 ? void 0 : _a.querySelector(".tc-highlight");
        if (highlightedCountry) {
            const countryItem = this.getCountryByCode(highlightedCountry === null || highlightedCountry === void 0 ? void 0 : highlightedCountry.getAttribute("data-country-code"));
            this.setPhoneCountry(countryItem);
        }
    }
    handlePhoneInputKeydown(e) {
        const phoneInput = e.target;
        const phoneNumber = phoneInput.value;
        if (phoneNumber.charAt(0) === "+") {
            if (phoneNumber.length > 2) {
                const countryItem = this.getCountryByCode(phoneNumber.substring(1, 3));
                if (countryItem) {
                    this.setPhoneCountry(countryItem);
                }
                else {
                    this.setDefaultPhoneCountry();
                }
            }
        }
    }
    openCountryDropDown() {
        if (!this.countries_dropdown)
            return;
        const countryList = this.countries_dropdown.querySelector(".tc-country-list");
        const selectedFlag = this.countries_dropdown.querySelector(".tc-selected-flag");
        if (countryList && selectedFlag) {
            countryList.classList.remove("tc-hide");
            selectedFlag.setAttribute("aria-expanded", "true");
            selectedFlag.classList.add("tc-open");
        }
    }
    closeCountryDropDown() {
        var _a;
        if (!this.options)
            return;
        if (!this.countries_dropdown)
            return;
        const countryList = this.countries_dropdown.querySelector(".tc-country-list");
        const selectedFlag = this.countries_dropdown.querySelector(".tc-selected-flag");
        if (countryList && selectedFlag) {
            countryList.classList.add("tc-hide");
            selectedFlag.setAttribute("aria-expanded", "false");
            selectedFlag.classList.remove("tc-open");
        }
        const phoneInput = engrid_ENGrid.getField((_a = this.options.address_fields) === null || _a === void 0 ? void 0 : _a.phone);
        phoneInput.focus();
    }
    getFlagImage(code, name) {
        return `<picture>
      <source
        loading="lazy"
        type="image/webp"
        srcset="https://flagcdn.com/h20/${code}.webp,
          https://flagcdn.com/h40/${code}.webp 2x,
          https://flagcdn.com/h60/${code}.webp 3x">
      <source
        loading="lazy"
        type="image/png"
        srcset="https://flagcdn.com/h20/${code}.png,
          https://flagcdn.com/h40/${code}.png 2x,
          https://flagcdn.com/h60/${code}.png 3x">
      <img
        loading="lazy"
        src="https://flagcdn.com/h20/${code}.png"
        height="20"
        alt="${name}">
    </picture>`;
    }
    appendCountryItems(countryContainer, countries, className, preferred = false) {
        let html = "";
        // for each country
        for (let i = 0; i < countries.length; i++) {
            const c = countries[i];
            const idSuffix = !!preferred ? "-preferred" :  true && "" !== void 0 ? "" : "";
            // open the list item
            html += `<li class='tc-country ${className}' tabIndex='-1' id='tc-item-${c.code}${idSuffix}' role='option' data-dial-code='${c.dialCode}' data-country-code='${c.code}' aria-selected='false'>`;
            // add the flag
            html += `<div class='tc-flag-box'><div class='tc-flag tc-${c.code}'>${this.getFlagImage(c.code, c.name)}</div></div>`;
            // and the country name and dial code
            html += `<span class='tc-country-name'>${c.name}</span>`;
            html += `<span class='tc-dial-code'>+${c.dialCode}</span>`;
            // close the list item
            html += "</li>";
        }
        countryContainer.insertAdjacentHTML("beforeend", html);
    }
    setDefaultPhoneCountry() {
        var _a;
        if (!this.options)
            return;
        // First, try to get the country from IP
        if (this.options.phone_country_from_ip) {
            this.getCountryFromIP()
                .then((country) => {
                this.logger.log("Country from IP:", country);
                this.setPhoneCountry(this.getCountryByCode((country !== null && country !== void 0 ? country : "us").toLowerCase()));
            })
                .catch((error) => {
                this.setPhoneCountry(this.getCountryByCode("us"));
            });
            return;
        }
        // Then, get the default country Text
        const countryField = engrid_ENGrid.getField((_a = this.options.address_fields) === null || _a === void 0 ? void 0 : _a.country);
        if (countryField) {
            const countryText = countryField.options[countryField.selectedIndex].text;
            // Then, get the country code from the Text
            const countryData = this.getCountryByCode(countryText);
            if (countryData) {
                this.setPhoneCountry(countryData);
                return;
            }
            else if (this.options.phone_preferred_countries.length > 0) {
                // If no country code is found, use the first priority country
                this.setPhoneCountry(this.getCountryByCode(this.options.phone_preferred_countries[0]));
                return;
            }
        }
        // If nothing works, GO USA!
        this.setPhoneCountry(this.getCountryByCode("us"));
    }
    setPhoneCountry(country) {
        var _a, _b, _c, _d, _e, _f;
        if (!this.options || !country)
            return;
        const countryInput = engrid_ENGrid.getField("tc.phone.country");
        if (countryInput.value === country.code)
            return;
        const phoneInput = engrid_ENGrid.getField((_a = this.options.address_fields) === null || _a === void 0 ? void 0 : _a.phone);
        if (this.countryDropDownEnabled()) {
            const selectedFlag = (_b = this.countries_dropdown) === null || _b === void 0 ? void 0 : _b.querySelector(".tc-selected-flag");
            const flagElement = (_c = this.countries_dropdown) === null || _c === void 0 ? void 0 : _c.querySelector(".tc-flag");
            if (selectedFlag && flagElement) {
                flagElement.innerHTML = this.getFlagImage(country.code, country.name);
                selectedFlag.setAttribute("data-country", country.code);
            }
            const currentSelectedCountry = (_d = this.countries_dropdown) === null || _d === void 0 ? void 0 : _d.querySelector(".tc-country-list-item[aria-selected='true']");
            if (currentSelectedCountry) {
                currentSelectedCountry.classList.remove("tc-selected");
                currentSelectedCountry.setAttribute("aria-selected", "false");
            }
            const currentHighlightedCountry = (_e = this.countries_dropdown) === null || _e === void 0 ? void 0 : _e.querySelector(".tc-highlight");
            if (currentHighlightedCountry) {
                currentHighlightedCountry.classList.remove("tc-highlight");
            }
            const countryListItem = (_f = this.countries_dropdown) === null || _f === void 0 ? void 0 : _f.querySelector(`.tc-country-list-item[data-country-code='${country.code}']`);
            if (countryListItem) {
                countryListItem.classList.add("tc-selected");
                countryListItem.setAttribute("aria-selected", "true");
                countryListItem.classList.add("tc-highlight");
            }
            if (selectedFlag === null || selectedFlag === void 0 ? void 0 : selectedFlag.classList.contains("tc-open"))
                this.closeCountryDropDown();
        }
        phoneInput.setAttribute("placeholder", country.placeholder);
        countryInput.value = country.code;
        this.logger.log(`Setting phone country to ${country.code} -  ${country.name}`);
    }
    highlightCountry(countryCode) {
        var _a, _b;
        if (!countryCode)
            return;
        const currentHighlightedCountry = (_a = this.countries_dropdown) === null || _a === void 0 ? void 0 : _a.querySelector(".tc-highlight");
        if (currentHighlightedCountry) {
            currentHighlightedCountry.classList.remove("tc-highlight");
        }
        const countryList = (_b = this.countries_dropdown) === null || _b === void 0 ? void 0 : _b.querySelector(".tc-country-list");
        if (countryList) {
            const country = countryList.querySelector(`.tc-country[data-country-code='${countryCode}']`);
            if (country) {
                country.classList.add("tc-highlight");
                country.scrollIntoView({
                    behavior: "smooth",
                    block: "nearest",
                    inline: "nearest",
                });
            }
        }
    }
    setPhoneDataFromAPI(data, id) {
        var _a;
        return tidycontact_awaiter(this, void 0, void 0, function* () {
            if (!this.options)
                return;
            const phoneField = engrid_ENGrid.getField((_a = this.options.address_fields) === null || _a === void 0 ? void 0 : _a.phone);
            const recordField = engrid_ENGrid.getField(this.options.phone_record_field);
            const dateField = engrid_ENGrid.getField(this.options.phone_date_field);
            const statusField = engrid_ENGrid.getField(this.options.phone_status_field);
            let record = {};
            record["formData"] = { [phoneField.name]: phoneField.value };
            record["formatted"] = data.formatted;
            record["number_type"] = data.number_type;
            if (data.valid === true) {
                if (phoneField.value !== data.formatted.e164) {
                    record["phone"] = {
                        from: phoneField.value,
                        to: data.formatted.e164,
                    };
                    phoneField.value = data.formatted.e164;
                }
                yield this.checkSum(JSON.stringify(record)).then((checksum) => {
                    this.logger.log("Phone Checksum", checksum);
                    record["requestId"] = id; // We don't want to add the requestId to the checksum
                    record["checksum"] = checksum;
                });
                if (recordField) {
                    record = Object.assign({ date: this.todaysDate(), status: "SUCCESS" }, record);
                    recordField.value = JSON.stringify(record);
                }
                if (dateField) {
                    dateField.value = this.todaysDate();
                }
                if (statusField) {
                    statusField.value = "SUCCESS";
                }
            }
            else {
                yield this.checkSum(JSON.stringify(record)).then((checksum) => {
                    this.logger.log("Phone Checksum", checksum);
                    record["requestId"] = id; // We don't want to add the requestId to the checksum
                    record["checksum"] = checksum;
                });
                if (recordField) {
                    record = Object.assign({ date: this.todaysDate(), status: "ERROR" }, record);
                    recordField.value = JSON.stringify(record);
                }
                if (dateField) {
                    dateField.value = this.todaysDate();
                }
                if (statusField) {
                    statusField.value =
                        "error" in data ? `ERROR: ` + data.error : "INVALIDPHONE";
                }
            }
        });
    }
    callAPI() {
        var _a, _b, _c, _d, _e, _f;
        if (!this.options)
            return;
        if (!this.isDirty || this.wasCalled)
            return;
        if (!this._form.submit) {
            this.logger.log("Form Submission Interrupted by Other Component");
            return;
        }
        const recordField = engrid_ENGrid.getField(this.options.record_field);
        const dateField = engrid_ENGrid.getField(this.options.date_field);
        const statusField = engrid_ENGrid.getField(this.options.status_field);
        const latitudeField = engrid_ENGrid.getField("supporter.geo.latitude");
        const longitudeField = engrid_ENGrid.getField("supporter.geo.longitude");
        if (!this.canUseAPI() && !this.canUsePhoneAPI()) {
            this.logger.log("Not Enough Data to Call API");
            if (dateField) {
                dateField.value = this.todaysDate();
            }
            if (statusField) {
                statusField.value = "PARTIALADDRESS";
            }
            return true;
        }
        // Call the API
        const address1 = engrid_ENGrid.getFieldValue((_a = this.options.address_fields) === null || _a === void 0 ? void 0 : _a.address1);
        const address2 = engrid_ENGrid.getFieldValue((_b = this.options.address_fields) === null || _b === void 0 ? void 0 : _b.address2);
        const city = engrid_ENGrid.getFieldValue((_c = this.options.address_fields) === null || _c === void 0 ? void 0 : _c.city);
        const region = engrid_ENGrid.getFieldValue((_d = this.options.address_fields) === null || _d === void 0 ? void 0 : _d.region);
        const postalCode = engrid_ENGrid.getFieldValue((_e = this.options.address_fields) === null || _e === void 0 ? void 0 : _e.postalCode);
        const country = this.getCountry();
        if (!this.countryAllowed(country)) {
            this.logger.log("Country not allowed: " + country);
            if (recordField) {
                let record = {};
                record = Object.assign({ date: this.todaysDate(), status: "DISALLOWED" }, record);
                recordField.value = JSON.stringify(record);
            }
            if (dateField) {
                dateField.value = this.todaysDate();
            }
            if (statusField) {
                statusField.value = "DISALLOWED";
            }
            return true;
        }
        let formData = {
            url: window.location.href,
            cid: this.options.cid,
        };
        if (this.canUseAPI()) {
            formData = Object.assign(formData, {
                address1,
                address2,
                city,
                region,
                postalCode,
                country,
            });
        }
        if (this.canUsePhoneAPI()) {
            formData.phone = engrid_ENGrid.getFieldValue((_f = this.options.address_fields) === null || _f === void 0 ? void 0 : _f.phone);
            formData.phoneCountry = engrid_ENGrid.getFieldValue("tc.phone.country");
        }
        this.wasCalled = true;
        this.logger.log("FormData", JSON.parse(JSON.stringify(formData)));
        const ret = this.fetchTimeOut(this.endpoint, {
            headers: { "Content-Type": "application/json; charset=utf-8" },
            method: "POST",
            body: JSON.stringify(formData),
        })
            .then((response) => {
            this.httpStatus = response.status;
            return response.json();
        })
            .then((data) => tidycontact_awaiter(this, void 0, void 0, function* () {
            this.logger.log("callAPI response", JSON.parse(JSON.stringify(data)));
            if (data.valid === true) {
                let record = {};
                if ("changed" in data) {
                    record = this.setFields(data.changed);
                }
                record["formData"] = formData;
                yield this.checkSum(JSON.stringify(record)).then((checksum) => {
                    this.logger.log("Checksum", checksum);
                    record["requestId"] = data.requestId; // We don't want to add the requestId to the checksum
                    record["checksum"] = checksum;
                });
                if ("latitude" in data) {
                    latitudeField.value = data.latitude;
                    record["latitude"] = data.latitude;
                }
                if ("longitude" in data) {
                    longitudeField.value = data.longitude;
                    record["longitude"] = data.longitude;
                }
                if (recordField) {
                    record = Object.assign({ date: this.todaysDate(), status: "SUCCESS" }, record);
                    recordField.value = JSON.stringify(record);
                }
                if (dateField) {
                    dateField.value = this.todaysDate();
                }
                if (statusField) {
                    statusField.value = "SUCCESS";
                }
            }
            else {
                let record = {};
                record["formData"] = formData;
                yield this.checkSum(JSON.stringify(record)).then((checksum) => {
                    this.logger.log("Checksum", checksum);
                    record["requestId"] = data.requestId; // We don't want to add the requestId to the checksum
                    record["checksum"] = checksum;
                });
                if (recordField) {
                    record = Object.assign({ date: this.todaysDate(), status: "ERROR" }, record);
                    recordField.value = JSON.stringify(record);
                }
                if (dateField) {
                    dateField.value = this.todaysDate();
                }
                if (statusField) {
                    statusField.value =
                        "error" in data ? `ERROR: ` + data.error : "INVALIDADDRESS";
                }
            }
            if (this.phoneEnabled() && "phone" in data) {
                yield this.setPhoneDataFromAPI(data.phone, data.requestId);
            }
        }))
            .catch((error) => {
            if (error.toString().includes("AbortError")) {
                // fetch aborted due to timeout
                this.logger.log("Fetch aborted");
                this.httpStatus = 408;
            }
            // network error or json parsing error
            this.writeError(error);
        });
        this._form.submitPromise = ret;
        return ret;
    }
}

;// CONCATENATED MODULE: ./node_modules/@4site/engrid-scripts/dist/live-currency.js
// This script enables live currency symbol and code to the page.

class LiveCurrency {
    constructor() {
        this.logger = new EngridLogger("LiveCurrency", "#1901b1", "#feb47a", "💲");
        this.elementsFound = false;
        this.isUpdating = false;
        this._amount = DonationAmount.getInstance();
        this._frequency = DonationFrequency.getInstance();
        this._fees = ProcessingFees.getInstance();
        this.searchElements();
        if (!this.shouldRun())
            return;
        engrid_ENGrid.setBodyData("live-currency", "active");
        this.updateCurrency();
        this.addEventListeners();
        // Make labels visible on page load
        document
            .querySelectorAll(".en__field--donationAmt .en__field__element--radio .en__field__item")
            .forEach((node) => {
            node.setAttribute("data-engrid-currency-symbol-updated", "true");
        });
    }
    searchElements() {
        const enElements = document.querySelectorAll(`
      .en__component--copyblock,
      .en__component--codeblock,
      .en__field label,
      .en__submit
      `);
        if (enElements.length > 0) {
            this.elementsFound = true;
            const currency = engrid_ENGrid.getCurrencySymbol();
            const currencyCode = engrid_ENGrid.getCurrencyCode();
            const currencyElement = `<span class="engrid-currency-symbol">${currency}</span>`;
            const currencyCodeElement = `<span class="engrid-currency-code">${currencyCode}</span>`;
            enElements.forEach((item) => {
                // If item starts with <script, skip it
                if (item instanceof HTMLElement &&
                    item.innerHTML.startsWith("<script")) {
                    return;
                }
                if (item instanceof HTMLElement &&
                    (item.innerHTML.includes("[$]") || item.innerHTML.includes("[$$$]"))) {
                    this.logger.log("Old Value:", item.innerHTML);
                    const currencyRegex = /\[\$\]/g;
                    const currencyCodeRegex = /\[\$\$\$\]/g;
                    item.innerHTML = item.innerHTML.replace(currencyCodeRegex, currencyCodeElement);
                    item.innerHTML = item.innerHTML.replace(currencyRegex, currencyElement);
                    this.logger.log("New Value:", item.innerHTML);
                }
            });
        }
    }
    shouldRun() {
        return this.elementsFound;
    }
    addMutationObserver() {
        const targetNode = document.querySelector(".en__field--donationAmt .en__field__element--radio");
        if (!targetNode)
            return;
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === "childList") {
                    // Update the currency only once, after the mutation is complete
                    if (this.isUpdating)
                        return;
                    this.isUpdating = true;
                    setTimeout(() => {
                        this.searchElements();
                        this.updateCurrency();
                        targetNode.querySelectorAll(".en__field__item").forEach((node) => {
                            node.setAttribute("data-engrid-currency-symbol-updated", "true");
                        });
                        this.isUpdating = false;
                    }, 20);
                }
            });
        });
        const config = { childList: true };
        observer.observe(targetNode, config);
    }
    addEventListeners() {
        this._fees.onFeeChange.subscribe(() => {
            setTimeout(() => {
                this.updateCurrency();
            }, 10);
        });
        this._amount.onAmountChange.subscribe(() => {
            setTimeout(() => {
                this.updateCurrency();
            }, 10);
        });
        this._frequency.onFrequencyChange.subscribe(() => {
            if (this.isUpdating)
                return;
            this.isUpdating = true;
            setTimeout(() => {
                this.searchElements();
                this.updateCurrency();
                document
                    .querySelectorAll(".en__field--donationAmt .en__field__element--radio .en__field__item")
                    .forEach((node) => {
                    node.setAttribute("data-engrid-currency-symbol-updated", "true");
                });
                this.isUpdating = false;
            }, 10);
        });
        const currencyField = engrid_ENGrid.getField("transaction.paycurrency");
        if (currencyField) {
            currencyField.addEventListener("change", () => {
                setTimeout(() => {
                    this.updateCurrency();
                    this._amount.load();
                    const otherAmountDiv = document.querySelector(".en__field--donationAmt .en__field__item--other");
                    if (otherAmountDiv) {
                        otherAmountDiv.setAttribute("data-currency-symbol", engrid_ENGrid.getCurrencySymbol());
                    }
                    engrid_ENGrid.setBodyData("currency-code", engrid_ENGrid.getCurrencyCode());
                }, 10);
            });
        }
        this.addMutationObserver();
    }
    updateCurrency() {
        const currencySymbolElements = document.querySelectorAll(".engrid-currency-symbol");
        const currencyCodeElements = document.querySelectorAll(".engrid-currency-code");
        if (currencySymbolElements.length > 0) {
            currencySymbolElements.forEach((item) => {
                item.innerHTML = engrid_ENGrid.getCurrencySymbol();
            });
        }
        if (currencyCodeElements.length > 0) {
            currencyCodeElements.forEach((item) => {
                item.innerHTML = engrid_ENGrid.getCurrencyCode();
            });
        }
        this.logger.log(`Currency updated for ${currencySymbolElements.length + currencyCodeElements.length} elements`);
    }
}

;// CONCATENATED MODULE: ./node_modules/@4site/engrid-scripts/dist/custom-currency.js
// This component allows you to customize the currency options in the currency field
// It is used in the following way:
//
// CustomCurrency: {
//   label: "Give with [$$$]",
//   default: {
//     USD: "$",
//     GBP: "£",
//     EUR: "€",
//   },
//   countries: {
//     US: {
//       USD: "$",
//     },
//     GB: {
//       GBP: "£",
//     },
//     DE: {
//       EUR: "€",
//     },
//   },
// },
//
// The label is the text that appears in the currency field
// The default is the currency options that appear when the selected country does not have a custom option
// The countries object is a list of countries and their currency options
// The country codes must match the country codes in the country field
// Because the CustomCurrency component works with the country field, it's automatically integrated with the AutoCountrySelect component.
// So if you visit the page from a country that has a custom currency option, the currency field will automatically be updated.
// The CustomCurrency component can also be set at the page level. Useful for Regional Pages, with a Code Block like this:
// <script>
//   window.EngridPageOptions = window.EngridPageOptions || [];
//   window.EngridPageOptions.CustomCurrency = {
//     label: "Give with [$$$]",
//     default: {
//       USD: "$",
//       GBP: "£",
//       EUR: "€",
//     },
//     countries: {
//       US: {
//         USD: "$",
//       },
//       GB: {
//         GBP: "£",
//       },
//       DE: {
//         EUR: "€",
//       },
//     },
//   };
// </script>
//
// This will override the default CustomCurrency options for that page.
//

class CustomCurrency {
    constructor() {
        this.logger = new EngridLogger("CustomCurrency", "#1901b1", "#00cc95", "🤑");
        this.currencyElement = document.querySelector("[name='transaction.paycurrency']");
        this._country = Country.getInstance();
        if (!this.shouldRun())
            return;
        this.addEventListeners();
        this.loadCurrencies();
    }
    shouldRun() {
        // Only run if the currency field is present, and the CustomCurrency option is not false
        if (!this.currencyElement || !engrid_ENGrid.getOption("CustomCurrency")) {
            return false;
        }
        return true;
    }
    addEventListeners() {
        if (this._country.countryField) {
            this._country.onCountryChange.subscribe((country) => {
                this.loadCurrencies(country);
            });
        }
    }
    // Changes the options in the currency field to match the selected country options
    loadCurrencies(country = "default") {
        const options = engrid_ENGrid.getOption("CustomCurrency");
        if (!options)
            return;
        const label = options.label || `Give with [$$$]`;
        let currencies = options.default;
        if (options.countries && options.countries[country]) {
            currencies = options.countries[country];
        }
        if (!currencies) {
            this.logger.log(`No currencies found for ${country}`);
            return;
        }
        this.logger.log(`Loading currencies for ${country}`);
        this.currencyElement.innerHTML = "";
        for (const currency in currencies) {
            const option = document.createElement("option");
            option.value = currency;
            option.text = label
                .replace("[$$$]", currency)
                .replace("[$]", currencies[currency]);
            option.setAttribute("data-currency-code", currency);
            option.setAttribute("data-currency-symbol", currencies[currency]);
            this.currencyElement.appendChild(option);
        }
        // Set the currency to the first option and trigger a change event
        this.currencyElement.selectedIndex = 0;
        const event = new Event("change", { bubbles: true });
        this.currencyElement.dispatchEvent(event);
    }
}

;// CONCATENATED MODULE: ./node_modules/@4site/engrid-scripts/dist/autosubmit.js
// Automatically submits the page if a URL argument is present

class Autosubmit {
    constructor() {
        this.logger = new EngridLogger("Autosubmit", "#f0f0f0", "#ff0000", "🚀");
        this._form = EnForm.getInstance();
        if (engrid_ENGrid.checkNested(window.EngagingNetworks, "require", "_defined", "enjs", "checkSubmissionFailed") &&
            !window.EngagingNetworks.require._defined.enjs.checkSubmissionFailed() &&
            engrid_ENGrid.getUrlParameter("autosubmit") === "Y") {
            this.logger.log("Autosubmitting Form");
            this._form.submitForm();
        }
    }
}

;// CONCATENATED MODULE: ./node_modules/@4site/engrid-scripts/dist/event-tickets.js
class EventTickets {
    constructor() {
        // --------------------------------------------
        // Format ticket amounts as currency.
        const ticketCostElements = document.getElementsByClassName("en__ticket__field--cost");
        const ticketCurrencyElements = document.getElementsByClassName("en__ticket__currency");
        for (const ticketCurrencyElement of ticketCurrencyElements) {
            ticketCurrencyElement.classList.add("en__ticket__currency__hidden");
        }
        for (const ticketCostElement of ticketCostElements) {
            const ticketAmountElement = ticketCostElement.getElementsByClassName("en__ticket__price")[0];
            const ticketCurrencyElement = ticketCostElement.getElementsByClassName("en__ticket__currency")[0];
            const formatterOptions = {
                style: "currency",
                currency: ticketCurrencyElement.innerText,
            };
            let ticketAmountAsCurrency = Intl.NumberFormat(undefined, formatterOptions).format(Number(ticketAmountElement.innerText));
            if (ticketAmountAsCurrency.slice(-3) === ".00") {
                ticketAmountAsCurrency = ticketAmountAsCurrency.slice(0, -3);
            }
            ticketAmountElement.innerText = ticketAmountAsCurrency;
        }
    }
}

;// CONCATENATED MODULE: ./node_modules/@4site/engrid-scripts/dist/swap-amounts.js
// This script allows you to override the default donation amounts in Engaging Networks
// with a custom list of amounts.
/**
 * Example:
 * window.EngridAmounts = {
 *   "onetime": {
 *     amounts: {
 *       "10": 10,
 *       "30": 30,
 *       "50": 50,
 *       "100": 100,
 *       "Other": "other",
 *     },
 *     default: 30,
 *   },
 *   "monthly": {
 *     amounts: {
 *       "5": 5,
 *       "15": 15,
 *       "25": 25,
 *       "30": 30,
 *       "Other": "other",
 *     },
 *     default: 15,
 *   },
 * };
 */

class SwapAmounts {
    constructor() {
        this.logger = new EngridLogger("SwapAmounts", "purple", "white", "💰");
        this._amount = DonationAmount.getInstance();
        this._frequency = DonationFrequency.getInstance();
        this.defaultChange = false;
        this.swapped = false;
        if (!this.shouldRun())
            return;
        this._frequency.onFrequencyChange.subscribe(() => this.swapAmounts());
        this._amount.onAmountChange.subscribe(() => {
            if (this._frequency.frequency in window.EngridAmounts === false)
                return;
            this.defaultChange = false;
            if (!this.swapped)
                return;
            // Check if the amount is not default amount for the frequency
            if (this._amount.amount !=
                window.EngridAmounts[this._frequency.frequency].default) {
                this.defaultChange = true;
            }
        });
    }
    swapAmounts() {
        if (this._frequency.frequency in window.EngridAmounts) {
            window.EngagingNetworks.require._defined.enjs.swapList("donationAmt", this.loadEnAmounts(window.EngridAmounts[this._frequency.frequency]), {
                ignoreCurrentValue: this.ignoreCurrentValue(),
            });
            this._amount.load();
            this.logger.log("Amounts Swapped To", window.EngridAmounts[this._frequency.frequency]);
            this.swapped = true;
        }
    }
    loadEnAmounts(amountArray) {
        let ret = [];
        for (let amount in amountArray.amounts) {
            ret.push({
                selected: amountArray.amounts[amount] === amountArray.default,
                label: amount,
                value: amountArray.amounts[amount].toString(),
            });
        }
        return ret;
    }
    shouldRun() {
        return "EngridAmounts" in window;
    }
    ignoreCurrentValue() {
        return !(window.EngagingNetworks.require._defined.enjs.checkSubmissionFailed() ||
            engrid_ENGrid.getUrlParameter("transaction.donationAmt") !== null ||
            this.defaultChange);
    }
}

;// CONCATENATED MODULE: ./node_modules/@4site/engrid-scripts/dist/debug-panel.js

class DebugPanel {
    constructor(pageLayouts) {
        var _a, _b;
        this.logger = new EngridLogger("Debug Panel", "#f0f0f0", "#ff0000", "💥");
        this.brandingHtml = new BrandingHtml();
        this.element = null;
        this.currentTimestamp = this.getCurrentTimestamp();
        this.quickFills = {
            "pi-general": [
                {
                    name: "supporter.title",
                    value: "Ms",
                },
                {
                    name: "supporter.firstName",
                    value: "4Site",
                },
                {
                    name: "supporter.lastName",
                    value: "Studio",
                },
                {
                    name: "supporter.emailAddress",
                    value: "en-test@4sitestudios.com",
                },
                {
                    name: "supporter.phoneNumber",
                    value: "555-555-5555",
                },
            ],
            "pi-unique": [
                {
                    name: "supporter.title",
                    value: "Ms",
                },
                {
                    name: "supporter.firstName",
                    value: `4Site ${this.currentTimestamp}`,
                },
                {
                    name: "supporter.lastName",
                    value: "Studio",
                },
                {
                    name: "supporter.emailAddress",
                    value: `en-test+${this.currentTimestamp}@4sitestudios.com`,
                },
                {
                    name: "supporter.phoneNumber",
                    value: "555-555-5555",
                },
            ],
            "us-address": [
                {
                    name: "supporter.address1",
                    value: "3431 14th St NW",
                },
                {
                    name: "supporter.address2",
                    value: "Suite 1",
                },
                {
                    name: "supporter.city",
                    value: "Washington",
                },
                {
                    name: "supporter.region",
                    value: "DC",
                },
                {
                    name: "supporter.postcode",
                    value: "20010",
                },
                {
                    name: "supporter.country",
                    value: "US",
                },
            ],
            "us-address-senate-rep": [
                {
                    name: "supporter.address1",
                    value: "20 W 34th Street",
                },
                {
                    name: "supporter.address2",
                    value: "",
                },
                {
                    name: "supporter.city",
                    value: "New York",
                },
                {
                    name: "supporter.region",
                    value: "NY",
                },
                {
                    name: "supporter.postcode",
                    value: "10001",
                },
                {
                    name: "supporter.country",
                    value: "US",
                },
            ],
            "us-address-nonexistent": [
                {
                    name: "supporter.address1",
                    value: "12345 Main Street",
                },
                {
                    name: "supporter.address2",
                    value: "",
                },
                {
                    name: "supporter.city",
                    value: "New York",
                },
                {
                    name: "supporter.region",
                    value: "TX",
                },
                {
                    name: "supporter.postcode",
                    value: "90210",
                },
                {
                    name: "supporter.country",
                    value: "US",
                },
            ],
            "cc-paysafe-visa": [
                {
                    name: "transaction.ccnumber",
                    value: "4530910000012345",
                },
                {
                    name: "transaction.ccexpire",
                    value: "12/27",
                },
                {
                    name: "transaction.ccvv",
                    value: "111",
                },
            ],
            "cc-paysafe-visa-invalid": [
                {
                    name: "transaction.ccnumber",
                    value: "411111",
                },
                {
                    name: "transaction.ccexpire",
                    value: "12/27",
                },
                {
                    name: "transaction.ccvv",
                    value: "111",
                },
            ],
            "cc-paysafe-mastercard": [
                {
                    name: "transaction.ccnumber",
                    value: "5036150000001115",
                },
                {
                    name: "transaction.ccexpire",
                    value: "12/27",
                },
                {
                    name: "transaction.ccvv",
                    value: "111",
                },
            ],
            "cc-stripe-visa": [
                {
                    name: "transaction.ccnumber",
                    value: "4242424242424242",
                },
                {
                    name: "transaction.ccexpire",
                    value: "12/27",
                },
                {
                    name: "transaction.ccvv",
                    value: "111",
                },
            ],
            "quick-fill-pi-unique-us-address-senate-rep-cc-stripe-visa": [
                {
                    name: "supporter.title",
                    value: "Ms",
                },
                {
                    name: "supporter.firstName",
                    value: `4Site ${this.currentTimestamp}`,
                },
                {
                    name: "supporter.lastName",
                    value: "Studio",
                },
                {
                    name: "supporter.emailAddress",
                    value: `en-test+${this.currentTimestamp}@4sitestudios.com`,
                },
                {
                    name: "supporter.phoneNumber",
                    value: "555-555-5555",
                },
                {
                    name: "supporter.address1",
                    value: "20 W 34th Street",
                },
                {
                    name: "supporter.address2",
                    value: "",
                },
                {
                    name: "supporter.city",
                    value: "New York",
                },
                {
                    name: "supporter.region",
                    value: "NY",
                },
                {
                    name: "supporter.postcode",
                    value: "10001",
                },
                {
                    name: "supporter.country",
                    value: "US",
                },
                {
                    name: "transaction.ccnumber",
                    value: "4242424242424242",
                },
                {
                    name: "transaction.ccexpire",
                    value: "12/27",
                },
                {
                    name: "transaction.ccvv",
                    value: "111",
                },
            ],
        };
        this.logger.log("Adding debug panel and starting a debug session");
        this.pageLayouts = pageLayouts;
        this.loadDebugPanel();
        this.element = document.querySelector(".debug-panel");
        (_a = this.element) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
            var _a;
            (_a = this.element) === null || _a === void 0 ? void 0 : _a.classList.add("debug-panel--open");
        });
        const debugPanelClose = document.querySelector(".debug-panel__close");
        debugPanelClose === null || debugPanelClose === void 0 ? void 0 : debugPanelClose.addEventListener("click", (e) => {
            var _a;
            e.stopPropagation();
            (_a = this.element) === null || _a === void 0 ? void 0 : _a.classList.remove("debug-panel--open");
        });
        if (engrid_ENGrid.getUrlParameter("assets") === "local") {
            (_b = this.element) === null || _b === void 0 ? void 0 : _b.classList.add("debug-panel--local");
        }
        window.sessionStorage.setItem(DebugPanel.debugSessionStorageKey, "active");
    }
    loadDebugPanel() {
        document.body.insertAdjacentHTML("beforeend", `<div class="debug-panel">
          <div class="debug-panel__container">
            <div class="debug-panel__closed-title">Debug</div>
            <div class="debug-panel__title">
              <h2>Debug</h2>
              <div class="debug-panel__close">X</div>
            </div>
            <div class="debug-panel__options">
              <div class="debug-panel__option">
                <label class="debug-panel__link-label link-left">
                  <a class="debug-panel__edit-link">Edit page</a>
                </label>
              </div>
              <div class="debug-panel__option">
                <label for="engrid-form-quickfill">Quick-fill</label>
                <select name="engrid-form-quickfill" id="engrid-form-quickfill">
                  <option disabled selected>Choose an option</option>
                  <option value="quick-fill-pi-unique-us-address-senate-rep-cc-stripe-visa">Quick-fill - Unique w/ Senate Address - Stripe Visa</option>
                  <option value="pi-general">Personal Info - General</option>
                  <option value="pi-unique">Personal Info - Unique</option>
                  <option value="us-address-senate-rep">US Address - w/ Senate Rep</option>
                  <option value="us-address">US Address - w/o Senate Rep</option>
                  <option value="us-address-nonexistent">US Address - Nonexistent</option>
                  <option value="cc-paysafe-visa">CC - Paysafe - Visa</option>
                  <option value="cc-paysafe-visa-invalid">CC - Paysafe - Visa (Invalid)</option>
                  <option value="cc-paysafe-mastercard">CC - Paysafe - Mastercard</option>
                  <option value="cc-stripe-visa">CC - Stripe - Visa</option>
                </select>
              </div>
              <div class="debug-panel__option">
                <label for="engrid-layout-switch">Layout</label>
                <select name="engrid-layout" id="engrid-layout-switch">
                </select>
              </div>
              <div class="debug-panel__option debug-panel__option--local">
                <div class="debug-panel__checkbox">
                  <input type="checkbox" name="engrid-embedded-layout" id="engrid-embedded-layout">
                  <label for="engrid-embedded-layout">Embedded layout</label>            
                </div>
              </div>
              <div class="debug-panel__option debug-panel__option--local">
                <div class="debug-panel__checkbox">
                  <input type="checkbox" name="engrid-debug-layout" id="engrid-debug-layout">
                  <label for="engrid-debug-layout">Debug layout</label>            
                </div>
              </div>
              <div class="debug-panel__option debug-panel__option--local">
                <div class="debug-panel__checkbox">
                  <input type="checkbox" name="engrid-branding" id="engrid-branding">
                  <label for="engrid-branding">Branding HTML</label>            
                </div>
              </div>
              <div class="debug-panel__option">
                <label for="engrid-theme">Theme</label>
                <input type="text" id="engrid-theme">
              </div>
              <div class="debug-panel__option debug-panel__option--local">
                <label for="engrid-theme">Sub-theme</label>
                <input type="text" id="engrid-subtheme">
              </div>
              <div class="debug-panel__option">
                <button class="btn debug-panel__btn debug-panel__btn--submit" type="button">Submit form</button>
              </div>
              <div class="debug-panel__option">
                <label class="debug-panel__link-label">
                  <a class="debug-panel__force-submit-link">Force submit form</a>
                </label>
              </div>
             <div class="debug-panel__option">
                <label class="debug-panel__link-label">
                  <a class="debug-panel__end-debug-link">End debug</a>
                </label>
              </div>
            </div>
          </div>
        </div>`);
        this.setupLayoutSwitcher();
        this.setupThemeSwitcher();
        this.setupSubThemeSwitcher();
        this.setupFormQuickfill();
        this.createDebugSessionEndHandler();
        this.setupEmbeddedLayoutSwitcher();
        this.setupDebugLayoutSwitcher();
        this.setupBrandingHtmlHandler();
        this.setupEditBtnHandler();
        this.setupForceSubmitLinkHandler();
        this.setupSubmitBtnHandler();
    }
    switchENGridLayout(layout) {
        engrid_ENGrid.setBodyData("layout", layout);
    }
    setupLayoutSwitcher() {
        var _a, _b;
        const engridLayoutSwitch = document.getElementById("engrid-layout-switch");
        if (engridLayoutSwitch) {
            (_a = this.pageLayouts) === null || _a === void 0 ? void 0 : _a.forEach((layout) => {
                engridLayoutSwitch.insertAdjacentHTML("beforeend", `<option value="${layout}">${layout}</option>`);
            });
            engridLayoutSwitch.value = (_b = engrid_ENGrid.getBodyData("layout")) !== null && _b !== void 0 ? _b : "";
            engridLayoutSwitch.addEventListener("change", (e) => {
                const target = e.target;
                this.switchENGridLayout(target.value);
            });
        }
    }
    setupThemeSwitcher() {
        var _a;
        const engridThemeInput = document.getElementById("engrid-theme");
        if (engridThemeInput) {
            engridThemeInput.value = (_a = engrid_ENGrid.getBodyData("theme")) !== null && _a !== void 0 ? _a : "";
            ["keyup", "blur"].forEach((ev) => {
                engridThemeInput.addEventListener(ev, (e) => {
                    const target = e.target;
                    this.switchENGridTheme(target.value);
                });
            });
        }
    }
    switchENGridTheme(theme) {
        engrid_ENGrid.setBodyData("theme", theme);
    }
    setupSubThemeSwitcher() {
        var _a;
        const engridSubthemeInput = document.getElementById("engrid-subtheme");
        if (engridSubthemeInput) {
            engridSubthemeInput.value = (_a = engrid_ENGrid.getBodyData("subtheme")) !== null && _a !== void 0 ? _a : "";
            ["keyup", "blur"].forEach((ev) => {
                engridSubthemeInput.addEventListener(ev, (e) => {
                    const target = e.target;
                    this.switchENGridSubtheme(target.value);
                });
            });
        }
    }
    switchENGridSubtheme(subtheme) {
        engrid_ENGrid.setBodyData("subtheme", subtheme);
    }
    setupFormQuickfill() {
        const engridQuickfill = document.getElementById("engrid-form-quickfill");
        engridQuickfill === null || engridQuickfill === void 0 ? void 0 : engridQuickfill.addEventListener("change", (e) => {
            const target = e.target;
            this.quickFills[target.value].forEach((qf) => {
                this.setFieldValue(qf);
            });
        });
    }
    setFieldValue(qf) {
        if (qf.name === "transaction.ccexpire") {
            const ccExpireEls = document.getElementsByName("transaction.ccexpire");
            if (ccExpireEls.length > 0) {
                const expirationDate = qf.value.split("/");
                ccExpireEls[0].value = expirationDate[0];
                ccExpireEls[1].value = expirationDate[1];
                ccExpireEls[0].dispatchEvent(new Event("change", { bubbles: true }));
                ccExpireEls[1].dispatchEvent(new Event("change", { bubbles: true }));
            }
            else {
                ccExpireEls[0].value = qf.value;
                ccExpireEls[0].dispatchEvent(new Event("change", { bubbles: true }));
            }
            return;
        }
        engrid_ENGrid.setFieldValue(qf.name, qf.value, true, true);
    }
    getCurrentTimestamp() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");
        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");
        return `${year}${month}${day}-${hours}${minutes}`;
    }
    createDebugSessionEndHandler() {
        const debugSessionEndBtn = document.querySelector(".debug-panel__end-debug-link");
        debugSessionEndBtn === null || debugSessionEndBtn === void 0 ? void 0 : debugSessionEndBtn.addEventListener("click", () => {
            var _a;
            this.logger.log("Removing panel and ending debug session");
            (_a = this.element) === null || _a === void 0 ? void 0 : _a.remove();
            window.sessionStorage.removeItem(DebugPanel.debugSessionStorageKey);
        });
    }
    setupEmbeddedLayoutSwitcher() {
        const embeddedLayoutSwitch = document.getElementById("engrid-embedded-layout");
        if (embeddedLayoutSwitch) {
            embeddedLayoutSwitch.checked = !!engrid_ENGrid.getBodyData("embedded");
            embeddedLayoutSwitch.addEventListener("change", (e) => {
                const target = e.target;
                engrid_ENGrid.setBodyData("embedded", target.checked);
            });
        }
    }
    setupDebugLayoutSwitcher() {
        const debugLayoutSwitch = document.getElementById("engrid-debug-layout");
        if (debugLayoutSwitch) {
            debugLayoutSwitch.checked = engrid_ENGrid.getBodyData("debug") === "layout";
            debugLayoutSwitch.addEventListener("change", (e) => {
                const target = e.target;
                if (target.checked) {
                    engrid_ENGrid.setBodyData("debug", "layout");
                }
                else {
                    engrid_ENGrid.setBodyData("debug", "");
                }
            });
        }
    }
    setupBrandingHtmlHandler() {
        const brandingInput = document.getElementById("engrid-branding");
        brandingInput.checked =
            engrid_ENGrid.getUrlParameter("development") === "branding";
        brandingInput.addEventListener("change", (e) => {
            if (brandingInput.checked) {
                this.brandingHtml.show();
            }
            else {
                this.brandingHtml.hide();
            }
        });
    }
    setupEditBtnHandler() {
        const editBtn = document.querySelector(".debug-panel__edit-link");
        editBtn === null || editBtn === void 0 ? void 0 : editBtn.addEventListener("click", () => {
            window.open(`https://${engrid_ENGrid.getDataCenter()}.engagingnetworks.app/index.html#pages/${engrid_ENGrid.getPageID()}/edit`, "_blank");
        });
    }
    setupForceSubmitLinkHandler() {
        const submitBtn = document.querySelector(".debug-panel__force-submit-link");
        submitBtn === null || submitBtn === void 0 ? void 0 : submitBtn.addEventListener("click", () => {
            const enForm = document.querySelector("form.en__component");
            enForm === null || enForm === void 0 ? void 0 : enForm.submit();
        });
    }
    setupSubmitBtnHandler() {
        const submitBtn = document.querySelector(".debug-panel__btn--submit");
        submitBtn === null || submitBtn === void 0 ? void 0 : submitBtn.addEventListener("click", () => {
            const enForm = document.querySelector(".en__submit button");
            enForm === null || enForm === void 0 ? void 0 : enForm.click();
        });
    }
}
DebugPanel.debugSessionStorageKey = "engrid_debug_panel";

;// CONCATENATED MODULE: ./node_modules/@4site/engrid-scripts/dist/debug-hidden-fields.js
// Switches hidden fields to be type text when debug mode is enabled.

class DebugHiddenFields {
    constructor() {
        this.logger = new EngridLogger("Debug hidden fields", "#f0f0f0", "#ff0000", "🫣");
        // Query all hidden input elements within the specified selectors
        const fields = document.querySelectorAll(".en__component--row [type='hidden'][class*='en_'], .engrid-added-input[type='hidden']");
        // Check if there are any hidden fields
        if (fields.length > 0) {
            // Log the names of the hidden fields being changed to type 'text'
            this.logger.log(`Switching the following type 'hidden' fields to type 'text':  ${[
                ...fields,
            ]
                .map((f) => f.name)
                .join(", ")}`);
            // Iterate through each hidden input element
            fields.forEach((el) => {
                // Change the input type to 'text' and add the required classes
                el.type = "text";
                el.classList.add("en__field__input", "en__field__input--text");
                // Create a new label element and set its text and classes
                const label = document.createElement("label");
                label.textContent = "Hidden field: " + el.name;
                label.classList.add("en__field__label");
                // Create a new 'div' element for the input field and add the required classes
                const fieldElement = document.createElement("div");
                fieldElement.classList.add("en__field__element", "en__field__element--text");
                // Create a new 'div' container for the label and input field, and add the required classes and attribute
                const fieldContainer = document.createElement("div");
                fieldContainer.classList.add("en__field", "en__field--text", "hide");
                fieldContainer.dataset.unhidden = "";
                fieldContainer.appendChild(label);
                fieldContainer.appendChild(fieldElement);
                // Insert the new field container before the original input element and move the input element into the field element div
                if (el.parentNode) {
                    el.parentNode.insertBefore(fieldContainer, el);
                    fieldElement.appendChild(el);
                }
            });
        }
    }
}

;// CONCATENATED MODULE: ./node_modules/@4site/engrid-scripts/dist/branding-html.js
var branding_html_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/**
 * Inserts all of the branding HTML from https://github.com/4site-interactive-studios/engrid/tree/main/reference-materials/html/brand-guide-markup
 * into the body-main section of the page.
 */
class BrandingHtml {
    constructor() {
        this.assetBaseUrl = "https://cdn.jsdelivr.net/gh/4site-interactive-studios/engrid@main/reference-materials/html/brand-guide-markup/";
        this.brandingHtmlFiles = [
            "html5-tags.html",
            "en-common-fields.html",
            "survey.html",
            // "en-common-fields-with-errors.html",
            // "en-common-fields-with-fancy-errors.html",
            "donation-page.html",
            "premium-donation.html",
            "ecards.html",
            "email-to-target.html",
            "tweet-to-target.html",
            // "click-to-call.html",
            "petition.html",
            "event.html",
            // "ecommerce.html",
            // "membership.html",
            "styles.html",
        ];
        this.bodyMain = document.querySelector(".body-main");
        this.htmlFetched = false;
    }
    fetchHtml() {
        return branding_html_awaiter(this, void 0, void 0, function* () {
            const htmlRequests = this.brandingHtmlFiles.map((file) => branding_html_awaiter(this, void 0, void 0, function* () {
                const res = yield fetch(this.assetBaseUrl + file);
                return res.text();
            }));
            const brandingHtmls = yield Promise.all(htmlRequests);
            return brandingHtmls;
        });
    }
    appendHtml() {
        this.fetchHtml().then((html) => html.forEach((h) => {
            var _a;
            const brandingSection = document.createElement("div");
            brandingSection.classList.add("brand-guide-section");
            brandingSection.innerHTML = h;
            (_a = this.bodyMain) === null || _a === void 0 ? void 0 : _a.insertAdjacentElement("beforeend", brandingSection);
        }));
        this.htmlFetched = true;
    }
    show() {
        if (!this.htmlFetched) {
            this.appendHtml();
            return;
        }
        const guides = document.querySelectorAll(".brand-guide-section");
        guides === null || guides === void 0 ? void 0 : guides.forEach((g) => (g.style.display = "block"));
    }
    hide() {
        const guides = document.querySelectorAll(".brand-guide-section");
        guides === null || guides === void 0 ? void 0 : guides.forEach((g) => (g.style.display = "none"));
    }
}

;// CONCATENATED MODULE: ./node_modules/@4site/engrid-scripts/dist/country-disable.js
// This class allows you to disable some countries from the country dropdown list.

class CountryDisable {
    constructor() {
        this.logger = new EngridLogger("CountryDisable", "#f0f0f0", "#333333", "🌎");
        const countries = document.querySelectorAll('select[name="supporter.country"], select[name="transaction.shipcountry"], select[name="supporter.billingCountry"], select[name="transaction.infcountry"]');
        const CountryDisable = engrid_ENGrid.getOption("CountryDisable");
        // Remove the countries from the dropdown list
        if (countries.length > 0 && CountryDisable.length > 0) {
            const countriesLower = CountryDisable.map((country) => country.toLowerCase());
            countries.forEach((country) => {
                country.querySelectorAll("option").forEach((option) => {
                    if (countriesLower.includes(option.value.toLowerCase()) ||
                        countriesLower.includes(option.text.toLowerCase())) {
                        this.logger.log(`Removing ${option.text} from ${country.getAttribute("name")}`);
                        option.remove();
                    }
                });
            });
        }
    }
}

;// CONCATENATED MODULE: ./node_modules/@4site/engrid-scripts/dist/premium-gift.js
// Component to handle premium gift features
// 1 - Add a class to body to indicate which premium gift is selected (data-engrid-premium-gift-name="item-name-slugged")
// 2 - Add a class to body to indicate if the "maximize my impact" is selected (data-engrid-premium-gift-maximize="true|false")
// 3 - Check the premium gift when click on the title or description
// 4 - Create new {$PREMIUMTITLE} merge tag that's replaced with the premium gift name

class PremiumGift {
    constructor() {
        this.logger = new EngridLogger("PremiumGift", "#232323", "#f7b500", "🎁");
        this.enElements = new Array();
        if (!this.shoudRun())
            return;
        this.searchElements();
        this.addEventListeners();
        this.checkPremiumGift();
    }
    shoudRun() {
        return ("pageJson" in window &&
            "pageType" in window.pageJson &&
            window.pageJson.pageType === "premiumgift");
    }
    addEventListeners() {
        ["click", "change"].forEach((event) => {
            document.addEventListener(event, (e) => {
                const element = e.target;
                const premiumGift = element.closest(".en__pg__body");
                if (premiumGift) {
                    const premiumGiftInput = premiumGift.querySelector('[name="en__pg"]');
                    if ("type" in element === false) {
                        const premiumGiftValue = premiumGiftInput.value;
                        window.setTimeout(() => {
                            const newPremiumGift = document.querySelector('[name="en__pg"][value="' + premiumGiftValue + '"]');
                            if (newPremiumGift) {
                                newPremiumGift.checked = true;
                                newPremiumGift.dispatchEvent(new Event("change"));
                            }
                        }, 100);
                    }
                    window.setTimeout(() => {
                        this.checkPremiumGift();
                    }, 110);
                }
            });
        });
        // Check when visibility of the Premium Gift Block changes.
        // EN will add "display: none" to this element when the supporter does not qualify for a premium
        const premiumGiftsBlock = document.querySelector(".en__component--premiumgiftblock");
        if (premiumGiftsBlock) {
            const observer = new MutationObserver((mutationsList) => {
                for (const mutation of mutationsList) {
                    if (mutation.type === "attributes" &&
                        mutation.attributeName === "style") {
                        if (premiumGiftsBlock.style.display === "none") {
                            this.logger.log("Premium Gift Section hidden - removing premium gift body data attributes and premium title.");
                            engrid_ENGrid.setBodyData("premium-gift-maximize", false);
                            engrid_ENGrid.setBodyData("premium-gift-name", false);
                            this.setPremiumTitle("");
                        }
                    }
                }
            });
            observer.observe(premiumGiftsBlock, { attributes: true });
        }
    }
    checkPremiumGift() {
        const premiumGift = document.querySelector('[name="en__pg"]:checked');
        if (premiumGift) {
            const premiumGiftValue = premiumGift.value;
            this.logger.log("Premium Gift Value: " + premiumGiftValue);
            const premiumGiftContainer = premiumGift.closest(".en__pg");
            if (premiumGiftValue !== "0") {
                const premiumGiftName = premiumGiftContainer.querySelector(".en__pg__name");
                engrid_ENGrid.setBodyData("premium-gift-maximize", "false");
                engrid_ENGrid.setBodyData("premium-gift-name", engrid_ENGrid.slugify(premiumGiftName.innerText));
                this.setPremiumTitle(premiumGiftName.innerText);
            }
            else {
                engrid_ENGrid.setBodyData("premium-gift-maximize", "true");
                engrid_ENGrid.setBodyData("premium-gift-name", false);
                this.setPremiumTitle("");
            }
            if (!premiumGiftContainer.classList.contains("en__pg--selected")) {
                const checkedPremiumGift = document.querySelector(".en__pg--selected");
                if (checkedPremiumGift) {
                    checkedPremiumGift.classList.remove("en__pg--selected");
                }
                premiumGiftContainer.classList.add("en__pg--selected");
            }
        }
    }
    searchElements() {
        const enElements = document.querySelectorAll(`
      .en__component--copyblock,
      .en__component--codeblock,
      .en__field
      `);
        if (enElements.length > 0) {
            enElements.forEach((item) => {
                if (item instanceof HTMLElement &&
                    item.innerHTML.includes("{$PREMIUMTITLE}")) {
                    item.innerHTML = item.innerHTML.replace("{$PREMIUMTITLE}", `<span class="engrid_premium_title"></span>`);
                    this.enElements.push(item);
                }
            });
        }
    }
    setPremiumTitle(title) {
        this.enElements.forEach((item) => {
            const premiumTitle = item.querySelector(".engrid_premium_title");
            if (premiumTitle) {
                premiumTitle.innerHTML = title;
            }
        });
    }
}

;// CONCATENATED MODULE: ./node_modules/@4site/engrid-scripts/dist/digital-wallets.js

class DigitalWallets {
    constructor() {
        //digital wallets not enabled.
        if (!document.getElementById("en__digitalWallet")) {
            engrid_ENGrid.setBodyData("payment-type-option-apple-pay", "false");
            engrid_ENGrid.setBodyData("payment-type-option-google-pay", "false");
            engrid_ENGrid.setBodyData("payment-type-option-paypal-one-touch", "false");
            engrid_ENGrid.setBodyData("payment-type-option-venmo", "false");
            engrid_ENGrid.setBodyData("payment-type-option-daf", "false");
            return;
        }
        // Add giveBySelect classes to the separate wallet containers
        // and hide them on load.
        const stripeButtons = document.getElementById("en__digitalWallet__stripeButtons__container");
        if (stripeButtons) {
            stripeButtons.classList.add("giveBySelect-stripedigitalwallet");
            stripeButtons.classList.add("showif-stripedigitalwallet-selected");
            // stripeButtons.style.display = "none";
        }
        const paypalTouchButtons = document.getElementById("en__digitalWallet__paypalTouch__container");
        if (paypalTouchButtons) {
            paypalTouchButtons.classList.add("giveBySelect-paypaltouch");
            paypalTouchButtons.classList.add("showif-paypaltouch-selected");
            // paypalTouchButtons.style.display = "none";
        }
        const donorAdvisedFundButtonContainer = document.getElementById("en__digitalWallet__chariot__container");
        if (donorAdvisedFundButtonContainer) {
            donorAdvisedFundButtonContainer.classList.add("giveBySelect-daf");
            donorAdvisedFundButtonContainer.classList.add("showif-daf-selected");
        }
        /**
         * Check for presence of elements that indicated Stripe digital wallets
         * (Google Pay, Apple Pay) have loaded, and add functionality for them.
         * If they haven't yet loaded, set up a Mutation Observer to check for
         * when they do.
         */
        if (document.querySelector("#en__digitalWallet__stripeButtons__container > *")) {
            this.addStripeDigitalWallets();
        }
        else {
            engrid_ENGrid.setBodyData("payment-type-option-apple-pay", "false");
            engrid_ENGrid.setBodyData("payment-type-option-google-pay", "false");
            const stripeContainer = document.getElementById("en__digitalWallet__stripeButtons__container");
            if (stripeContainer) {
                this.checkForWalletsBeingAdded(stripeContainer, "stripe");
            }
            // If the default payment type is Stripe Digital Wallet and the page doesnt support it, set the payment type to Card
            const paymentType = engrid_ENGrid.getPaymentType();
            if (paymentType.toLowerCase() === "stripedigitalwallet") {
                engrid_ENGrid.setPaymentType("card");
            }
        }
        /**
         * Check for presence of elements that indicated Paypal digital wallets
         * (Paypal One Touch, Venmo, Etc) have loaded, and add functionality for them.
         * If they haven't yet loaded, set up a Mutation Observer to check for
         * when they do.
         */
        if (document.querySelector("#en__digitalWallet__paypalTouch__container > *")) {
            this.addPaypalTouchDigitalWallets();
        }
        else {
            engrid_ENGrid.setBodyData("payment-type-option-paypal-one-touch", "false");
            engrid_ENGrid.setBodyData("payment-type-option-venmo", "false");
            const paypalContainer = document.getElementById("en__digitalWallet__paypalTouch__container");
            if (paypalContainer) {
                this.checkForWalletsBeingAdded(paypalContainer, "paypalTouch");
            }
        }
        /**
         * Check for presence of elements that indicate DAF is present, and add functionality for it.
         * If it hasn't loaded yet, set up a Mutation Observer to check for when it does.
         */
        if (document.querySelector("#en__digitalWallet__chariot__container > *")) {
            this.addDAF();
        }
        else {
            engrid_ENGrid.setBodyData("payment-type-option-daf", "false");
            const donorAdvisedFundButtonContainer = document.getElementById("en__digitalWallet__chariot__container");
            if (donorAdvisedFundButtonContainer) {
                this.checkForWalletsBeingAdded(donorAdvisedFundButtonContainer, "daf");
            }
        }
    }
    addStripeDigitalWallets() {
        this.addOptionToPaymentTypeField("stripedigitalwallet", "GooglePay / ApplePay");
        engrid_ENGrid.setBodyData("payment-type-option-apple-pay", "true");
        engrid_ENGrid.setBodyData("payment-type-option-google-pay", "true");
    }
    addPaypalTouchDigitalWallets() {
        this.addOptionToPaymentTypeField("paypaltouch", "Paypal / Venmo");
        engrid_ENGrid.setBodyData("payment-type-option-paypal-one-touch", "true");
        engrid_ENGrid.setBodyData("payment-type-option-venmo", "true");
    }
    addDAF() {
        this.addOptionToPaymentTypeField("daf", "Donor Advised Fund");
        engrid_ENGrid.setBodyData("payment-type-option-daf", "true");
    }
    addOptionToPaymentTypeField(value, label) {
        const paymentTypeField = document.querySelector('[name="transaction.paymenttype"]');
        if (paymentTypeField &&
            !paymentTypeField.querySelector(`[value=${value}]`)) {
            const walletOption = document.createElement("option");
            walletOption.value = value;
            walletOption.innerText = label;
            paymentTypeField.appendChild(walletOption);
        }
        // If this payment type is set as the default on GiveBySelect, set the payment type to this value
        // We need to do this here because the digital wallets are sometimes slow to load
        const giveBySelect = document.querySelector('input[name="transaction.giveBySelect"][value="' + value + '"]');
        if (giveBySelect && giveBySelect.dataset.default === "true") {
            giveBySelect.checked = true;
            const event = new Event("change", {
                bubbles: true,
                cancelable: true,
            });
            giveBySelect.dispatchEvent(event);
        }
    }
    checkForWalletsBeingAdded(node, walletType) {
        const callback = (mutationList, observer) => {
            for (const mutation of mutationList) {
                //Once a child node has been added, set up the appropriate digital wallet
                if (mutation.type === "childList" && mutation.addedNodes.length) {
                    if (walletType === "stripe") {
                        this.addStripeDigitalWallets();
                    }
                    else if (walletType === "paypalTouch") {
                        this.addPaypalTouchDigitalWallets();
                    }
                    else if (walletType === "daf") {
                        this.addDAF();
                    }
                    //Disconnect observer to prevent multiple additions
                    observer.disconnect();
                }
            }
        };
        const observer = new MutationObserver(callback);
        observer.observe(node, { childList: true, subtree: true });
    }
}

;// CONCATENATED MODULE: ./node_modules/@4site/engrid-scripts/dist/mobile-cta.js
// This component adds a floating CTA button to the page, which can be used to scroll to the top of the form

class MobileCTA {
    constructor() {
        var _a, _b, _c;
        // Initialize options with the MobileCTA value or false
        this.options = (_a = engrid_ENGrid.getOption("MobileCTA")) !== null && _a !== void 0 ? _a : false;
        this.buttonLabel = "";
        // Return early if the options object is falsy or the current page type is not in the options.pages array
        if (!this.options ||
            !((_b = this.options.pages) === null || _b === void 0 ? void 0 : _b.includes(engrid_ENGrid.getPageType())) ||
            engrid_ENGrid.getPageNumber() !== 1)
            return;
        // Set the button label using the options.label or the default value "Take Action"
        this.buttonLabel = (_c = this.options.label) !== null && _c !== void 0 ? _c : "Take Action";
        this.renderButton();
        this.addEventListeners();
    }
    renderButton() {
        const engridDiv = document.querySelector("#engrid");
        const formBlock = document.querySelector(".body-main .en__component--widgetblock:first-child, .en__component--formblock");
        // Return early if engridDiv or formBlock are not found
        if (!engridDiv || !formBlock)
            return;
        const buttonContainer = document.createElement("div");
        const button = document.createElement("button");
        // Add necessary classes and set the initial display style for the button container
        buttonContainer.classList.add("engrid-mobile-cta-container");
        buttonContainer.style.display = "none";
        button.classList.add("primary");
        // Set the button's innerHTML and add a click event listener
        button.innerHTML = this.buttonLabel;
        button.addEventListener("click", () => {
            formBlock.scrollIntoView({ behavior: "smooth" });
        });
        // Append the button to the button container and the container to engridDiv
        buttonContainer.appendChild(button);
        engridDiv.appendChild(buttonContainer);
    }
    addEventListeners() {
        const bodyMain = document.querySelector(".body-main");
        // Return early if formBlock is not found
        if (!bodyMain)
            return;
        // Define a function to toggle the button visibility based on the bodyMain position
        const toggleButton = () => {
            if (bodyMain.getBoundingClientRect().top <= window.innerHeight - 100) {
                this.hideButton();
            }
            else {
                this.showButton();
            }
        };
        // Add event listeners for load, resize, and scroll events to toggle the button visibility
        window.addEventListener("load", toggleButton);
        window.addEventListener("resize", toggleButton);
        window.addEventListener("scroll", toggleButton);
    }
    // Hide the button by setting the container's display style to "none"
    hideButton() {
        const buttonContainer = document.querySelector(".engrid-mobile-cta-container");
        if (buttonContainer)
            buttonContainer.style.display = "none";
    }
    // Show the button by setting the container's display style to "block"
    showButton() {
        const buttonContainer = document.querySelector(".engrid-mobile-cta-container");
        if (buttonContainer)
            buttonContainer.style.display = "block";
    }
}

;// CONCATENATED MODULE: ./node_modules/@4site/engrid-scripts/dist/live-frequency.js
// This script creates merge tags: [[frequency]], [[Frequency]], or [[FREQUENCY]]
// that gets replaced with the donation frequency
// and can be used on any Code Block, Text Block, or Form Block

class LiveFrequency {
    constructor() {
        this.logger = new EngridLogger("LiveFrequency", "#00ff00", "#000000", "🧾");
        this.elementsFound = false;
        this._amount = DonationAmount.getInstance();
        this._frequency = DonationFrequency.getInstance();
        this.searchElements();
        if (!this.shouldRun())
            return;
        this.updateFrequency();
        this.addEventListeners();
    }
    searchElements() {
        const enElements = document.querySelectorAll(`
      .en__component--copyblock,
      .en__component--codeblock,
      .en__field label,
      .en__submit
      `);
        if (enElements.length > 0) {
            const pattern = /\[\[(frequency)\]\]/gi;
            let totalFound = 0;
            enElements.forEach((item) => {
                const match = item.innerHTML.match(pattern);
                if (item instanceof HTMLElement && match) {
                    this.elementsFound = true;
                    match.forEach((matchedSubstring) => {
                        totalFound++;
                        this.replaceMergeTags(matchedSubstring, item);
                    });
                }
            });
            if (totalFound > 0) {
                this.logger.log(`Found ${totalFound} merge tag${totalFound > 1 ? "s" : ""} in the page.`);
            }
        }
    }
    shouldRun() {
        if (!this.elementsFound) {
            this.logger.log("No merge tags found. Skipping.");
            return false;
        }
        return true;
    }
    addEventListeners() {
        this._amount.onAmountChange.subscribe(() => {
            setTimeout(() => {
                this.updateFrequency();
            }, 10);
        });
        this._frequency.onFrequencyChange.subscribe(() => {
            setTimeout(() => {
                this.searchElements();
                this.updateFrequency();
            }, 10);
        });
    }
    updateFrequency() {
        const frequency = this._frequency.frequency === "onetime"
            ? "one-time"
            : this._frequency.frequency;
        const elemenst = document.querySelectorAll(".engrid-frequency");
        elemenst.forEach((item) => {
            if (item.classList.contains("engrid-frequency--lowercase")) {
                item.innerHTML = frequency.toLowerCase();
            }
            else if (item.classList.contains("engrid-frequency--capitalized")) {
                item.innerHTML = frequency.charAt(0).toUpperCase() + frequency.slice(1);
            }
            else if (item.classList.contains("engrid-frequency--uppercase")) {
                item.innerHTML = frequency.toUpperCase();
            }
            else {
                item.innerHTML = frequency;
            }
        });
    }
    replaceMergeTags(tag, element) {
        const frequency = this._frequency.frequency === "onetime"
            ? "one-time"
            : this._frequency.frequency;
        const frequencyElement = document.createElement("span");
        frequencyElement.classList.add("engrid-frequency");
        frequencyElement.innerHTML = frequency;
        switch (tag) {
            case "[[frequency]]":
                frequencyElement.classList.add("engrid-frequency--lowercase");
                frequencyElement.innerHTML = frequencyElement.innerHTML.toLowerCase();
                element.innerHTML = element.innerHTML.replace(tag, frequencyElement.outerHTML);
                break;
            case "[[Frequency]]":
                frequencyElement.classList.add("engrid-frequency--capitalized");
                frequencyElement.innerHTML =
                    frequencyElement.innerHTML.charAt(0).toUpperCase() +
                        frequencyElement.innerHTML.slice(1);
                element.innerHTML = element.innerHTML.replace(tag, frequencyElement.outerHTML);
                break;
            case "[[FREQUENCY]]":
                frequencyElement.classList.add("engrid-frequency--uppercase");
                frequencyElement.innerHTML = frequencyElement.innerHTML.toUpperCase();
                element.innerHTML = element.innerHTML.replace(tag, frequencyElement.outerHTML);
                break;
        }
    }
}

;// CONCATENATED MODULE: ./node_modules/@4site/engrid-scripts/dist/universal-opt-in.js
/**
 * This class will add event listeners to every yes/no radio button or checkbox
 * inside a universal opt-in element (any form block with the CSS class universal-opt-in). When the user clicks on a radio/checkbox
 * button, we will search for every other radio/checkbox button inside the same
 * universal opt-in element and mirror the user's selection.
 * If instead of universal-opt-in you use universal-opt-in_null, the class will
 * not mirror the user's selection when a radio "No" option is selected. Instead,
 * it will unset all other radio buttons.
 */

class UniversalOptIn {
    constructor() {
        this.logger = new EngridLogger("UniversalOptIn", "#f0f0f0", "#d2691e", "🪞");
        this._elements = document.querySelectorAll(".universal-opt-in, .universal-opt-in_null");
        if (!this.shouldRun())
            return;
        this.addEventListeners();
    }
    shouldRun() {
        if (this._elements.length === 0) {
            this.logger.log("No universal opt-in elements found. Skipping.");
            return false;
        }
        this.logger.log(`Found ${this._elements.length} universal opt-in elements.`);
        return true;
    }
    addEventListeners() {
        this._elements.forEach((element) => {
            const yesNoElements = element.querySelectorAll(".en__field__input--radio, .en__field__input--checkbox");
            if (yesNoElements.length > 0) {
                yesNoElements.forEach((yesNoElement) => {
                    yesNoElement.addEventListener("click", () => {
                        if (yesNoElement instanceof HTMLInputElement &&
                            yesNoElement.getAttribute("type") === "checkbox") {
                            const yesNoValue = yesNoElement.checked;
                            if (yesNoValue) {
                                this.logger.log("Yes/No " + yesNoElement.getAttribute("type") + " is checked");
                                yesNoElements.forEach((yesNoElement2) => {
                                    if (yesNoElement === yesNoElement2)
                                        return;
                                    if (yesNoElement2 instanceof HTMLInputElement &&
                                        yesNoElement2.getAttribute("type") === "checkbox")
                                        yesNoElement2.checked = true;
                                });
                            }
                            else {
                                this.logger.log("Yes/No " +
                                    yesNoElement.getAttribute("type") +
                                    " is unchecked");
                                yesNoElements.forEach((yesNoElement2) => {
                                    if (yesNoElement === yesNoElement2)
                                        return;
                                    if (yesNoElement2 instanceof HTMLInputElement &&
                                        yesNoElement2.getAttribute("type") === "checkbox")
                                        yesNoElement2.checked = false;
                                });
                            }
                            return;
                        }
                        const yesNoValue = yesNoElement.getAttribute("value");
                        if (yesNoValue === "Y") {
                            this.logger.log("Yes/No " + yesNoElement.getAttribute("type") + " is checked");
                            yesNoElements.forEach((yesNoElement2) => {
                                const fieldName = yesNoElement2.getAttribute("name");
                                const clickedFieldName = yesNoElement.getAttribute("name");
                                if (!fieldName || fieldName === clickedFieldName)
                                    return;
                                engrid_ENGrid.setFieldValue(fieldName, "Y");
                            });
                        }
                        else {
                            this.logger.log("Yes/No " + yesNoElement.getAttribute("type") + " is unchecked");
                            yesNoElements.forEach((yesNoElement2) => {
                                const fieldName = yesNoElement2.getAttribute("name");
                                const clickedFieldName = yesNoElement.getAttribute("name");
                                if (!fieldName || fieldName === clickedFieldName)
                                    return;
                                if (element.classList.contains("universal-opt-in")) {
                                    engrid_ENGrid.setFieldValue(fieldName, "N");
                                }
                                else {
                                    yesNoElement2.checked = false;
                                }
                            });
                        }
                    });
                });
            }
        });
    }
}

;// CONCATENATED MODULE: ./node_modules/@4site/engrid-scripts/dist/plaid.js
// Component with a helper to auto-click on the Plaid link
// when that payment method is selected

class Plaid {
    constructor() {
        this.logger = new EngridLogger("Plaid", "peru", "yellow", "🔗");
        this._form = EnForm.getInstance();
        this.logger.log("Enabled");
        this._form.onSubmit.subscribe(() => this.submit());
    }
    submit() {
        const plaidLink = document.querySelector("#plaid-link-button");
        if (plaidLink && plaidLink.textContent === "Link Account") {
            // Click the Plaid Link button
            this.logger.log("Clicking Link");
            plaidLink.click();
            this._form.submit = false;
            // Create a observer to watch the Link ID #plaid-link-button for a new Text Node
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === "childList") {
                        mutation.addedNodes.forEach((node) => {
                            if (node.nodeType === Node.TEXT_NODE) {
                                // If the Text Node is "Link Account" then the Link has failed
                                if (node.nodeValue === "Account Linked") {
                                    this.logger.log("Plaid Linked");
                                    this._form.submit = true;
                                    this._form.submitForm();
                                }
                                else {
                                    this._form.submit = true;
                                }
                            }
                        });
                    }
                });
            });
            // Start observing the Link ID #plaid-link-button
            observer.observe(plaidLink, {
                childList: true,
                subtree: true,
            });
            window.setTimeout(() => {
                this.logger.log("Enabling Submit");
                engrid_ENGrid.enableSubmit();
            }, 1000);
        }
    }
}

;// CONCATENATED MODULE: ./node_modules/@4site/engrid-scripts/dist/give-by-select.js

class GiveBySelect {
    constructor() {
        this.logger = new EngridLogger("GiveBySelect", "#FFF", "#333", "🐇");
        this.transactionGiveBySelect = document.getElementsByName("transaction.giveBySelect");
        this.paymentTypeField = document.querySelector("select[name='transaction.paymenttype']");
        this._frequency = DonationFrequency.getInstance();
        if (!this.transactionGiveBySelect)
            return;
        this._frequency.onFrequencyChange.subscribe(() => this.checkPaymentTypeVisibility());
        this.transactionGiveBySelect.forEach((giveBySelect) => {
            giveBySelect.addEventListener("change", () => {
                this.logger.log("Changed to " + giveBySelect.value);
                engrid_ENGrid.setPaymentType(giveBySelect.value);
            });
        });
        // Set the initial value of giveBySelect to the transaction.paymenttype field
        const paymentType = engrid_ENGrid.getPaymentType();
        if (paymentType) {
            this.logger.log("Setting giveBySelect to " + paymentType);
            const isCard = [
                "card",
                "visa",
                "mastercard",
                "amex",
                "discover",
                "diners",
                "jcb",
                "vi",
                "mc",
                "ax",
                "dc",
                "di",
                "jc",
            ].includes(paymentType.toLowerCase());
            this.transactionGiveBySelect.forEach((giveBySelect) => {
                if (isCard && giveBySelect.value.toLowerCase() === "card") {
                    giveBySelect.checked = true;
                }
                else if (giveBySelect.value.toLowerCase() === paymentType.toLowerCase()) {
                    giveBySelect.checked = true;
                }
            });
        }
    }
    // Returns true if the selected payment type is visible
    // Returns false if the selected payment type is not visible
    isSelectedPaymentVisible() {
        let visible = true;
        this.transactionGiveBySelect.forEach((giveBySelect) => {
            const container = giveBySelect.parentElement;
            if (giveBySelect.checked && !engrid_ENGrid.isVisible(container)) {
                this.logger.log(`Selected Payment Type is not visible: ${giveBySelect.value}`);
                visible = false;
            }
        });
        return visible;
    }
    // Checks if the selected payment type is visible
    // If the selected payment type is not visible, it sets the payment type to the first visible option
    checkPaymentTypeVisibility() {
        window.setTimeout(() => {
            var _a;
            if (!this.isSelectedPaymentVisible()) {
                this.logger.log("Setting payment type to first visible option");
                const firstVisible = Array.from(this.transactionGiveBySelect).find((giveBySelect) => {
                    const container = giveBySelect.parentElement;
                    return engrid_ENGrid.isVisible(container);
                });
                if (firstVisible) {
                    this.logger.log("Setting payment type to ", firstVisible.value);
                    const container = firstVisible.parentElement;
                    (_a = container.querySelector("label")) === null || _a === void 0 ? void 0 : _a.click();
                    engrid_ENGrid.setPaymentType(firstVisible.value);
                }
            }
            else {
                this.logger.log("Selected Payment Type is visible");
            }
        }, 300);
    }
}

;// CONCATENATED MODULE: ./node_modules/@4site/engrid-scripts/dist/url-params-to-body-attrs.js
//This component adds any url parameters that begin with "data-engrid-" to the body as attributes.

class UrlParamsToBodyAttrs {
    constructor() {
        this.logger = new EngridLogger("UrlParamsToBodyAttrs", "white", "magenta", "📌");
        this.urlParams = new URLSearchParams(document.location.search);
        this.urlParams.forEach((value, key) => {
            if (key.startsWith("data-engrid-")) {
                engrid_ENGrid.setBodyData(key.split("data-engrid-")[1], value);
                this.logger.log(`Set "${key}" on body to "${value}" from URL params`);
            }
        });
    }
}

;// CONCATENATED MODULE: ./node_modules/@4site/engrid-scripts/dist/exit-intent-lightbox.js


class ExitIntentLightbox {
    constructor() {
        this.opened = false;
        this.dataLayer = window.dataLayer || [];
        this.logger = new EngridLogger("ExitIntentLightbox", "yellow", "black", "🚪");
        this.triggerDelay = 1000; // Don't run the exit intent lightbox until at least 1 second has passed after page load
        this.triggerTimeout = null;
        let options = "EngridExitIntent" in window ? window.EngridExitIntent : {};
        this.options = Object.assign(Object.assign({}, ExitIntentOptionsDefaults), options);
        if (!this.options.enabled) {
            this.logger.log("Not enabled");
            return;
        }
        if (get(this.options.cookieName)) {
            this.logger.log("Not showing - cookie found.");
            return;
        }
        const activeTriggers = Object.keys(this.options.triggers)
            .filter((t) => this.options.triggers[t])
            .join(", ");
        this.logger.log("Enabled, waiting for trigger. Active triggers: " + activeTriggers);
        this.watchForTriggers();
    }
    watchForTriggers() {
        window.addEventListener("load", () => {
            setTimeout(() => {
                if (this.options.triggers.mousePosition) {
                    this.watchMouse();
                }
                if (this.options.triggers.visibilityState) {
                    this.watchDocumentVisibility();
                }
            }, this.triggerDelay); // Delay activation of triggers
        });
    }
    watchMouse() {
        document.addEventListener("mouseout", (e) => {
            // If this is an autocomplete element.
            if (e.target.tagName.toLowerCase() == "input")
                return;
            // Get the current viewport width.
            const vpWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
            // If the current mouse X position is within 50px of the right edge
            // of the viewport, return.
            if (e.clientX >= vpWidth - 50)
                return;
            // If the current mouse Y position is not within 50px of the top
            // edge of the viewport, return.
            if (e.clientY >= 50)
                return;
            // Reliable, works on mouse exiting window and
            // user switching active program
            const from = e.relatedTarget;
            if (!from) {
                this.logger.log("Triggered by mouse position");
                this.open();
            }
            if (!this.triggerTimeout) {
                this.triggerTimeout = window.setTimeout(() => {
                    if (!from) {
                        this.logger.log("Triggered by mouse position");
                        this.open();
                    }
                    this.triggerTimeout = null;
                }, this.triggerDelay);
            }
        });
    }
    watchDocumentVisibility() {
        const visibilityListener = () => {
            if (document.visibilityState === "hidden") {
                if (!this.triggerTimeout) {
                    this.triggerTimeout = window.setTimeout(() => {
                        this.logger.log("Triggered by visibilityState is hidden");
                        this.open();
                        document.removeEventListener("visibilitychange", visibilityListener);
                        this.triggerTimeout = null;
                    }, this.triggerDelay);
                }
            }
        };
        document.addEventListener("visibilitychange", visibilityListener);
    }
    open() {
        var _a, _b, _c;
        if (this.opened)
            return;
        engrid_ENGrid.setBodyData("exit-intent-lightbox", "open");
        set(this.options.cookieName, "1", {
            expires: this.options.cookieDuration,
        });
        document.body.insertAdjacentHTML("beforeend", `
        <div class="ExitIntent">
          <div class="ExitIntent__overlay">
            <div class="ExitIntent__container">
              <div class="ExitIntent__close">X</div>
              <div class="ExitIntent__body">
                <h2>${this.options.title}</h2>
                <p>${this.options.text}</p>
                <button type="button" class="ExitIntent__button">
                  ${this.options.buttonText}
                </button>
              </div>
            </div>
          </div>
        </div>
      `);
        this.opened = true;
        this.dataLayer.push({ event: "exit_intent_lightbox_shown" });
        (_a = document
            .querySelector(".ExitIntent__close")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
            this.dataLayer.push({ event: "exit_intent_lightbox_closed" });
            this.close();
        });
        (_b = document
            .querySelector(".ExitIntent__overlay")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", (event) => {
            if (event.target === event.currentTarget) {
                this.dataLayer.push({ event: "exit_intent_lightbox_closed" });
                this.close();
            }
        });
        (_c = document
            .querySelector(".ExitIntent__button")) === null || _c === void 0 ? void 0 : _c.addEventListener("click", () => {
            this.dataLayer.push({ event: "exit_intent_lightbox_cta_clicked" });
            this.close();
            const target = this.options.buttonLink;
            if (target.startsWith(".") || target.startsWith("#")) {
                const targetEl = document.querySelector(target);
                if (targetEl) {
                    targetEl.scrollIntoView({ behavior: "smooth" });
                }
            }
            else {
                window.open(target, "_blank");
            }
        });
    }
    close() {
        var _a;
        (_a = document.querySelector(".ExitIntent")) === null || _a === void 0 ? void 0 : _a.remove();
        engrid_ENGrid.setBodyData("exit-intent-lightbox", "closed");
    }
}

;// CONCATENATED MODULE: ./node_modules/@4site/engrid-scripts/dist/supporter-hub.js
// Component that adds 4Site Special Features to the Supporter Hub Page

class SupporterHub {
    constructor() {
        this.logger = new EngridLogger("SupporterHub", "black", "pink", "🛖");
        this._form = EnForm.getInstance();
        if (!this.shoudRun())
            return;
        this.logger.log("Enabled");
        this.watch();
    }
    shoudRun() {
        return ("pageJson" in window &&
            "pageType" in window.pageJson &&
            window.pageJson.pageType === "supporterhub");
    }
    watch() {
        const form = engrid_ENGrid.enForm;
        // Create a observer to watch the Form for overlays
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === "childList") {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeName === "DIV") {
                            const overlay = node;
                            if (overlay.classList.contains("en__hubOverlay") ||
                                overlay.classList.contains("en__hubPledge__panels")) {
                                this.logger.log("Overlay found");
                                this.creditCardUpdate(node);
                                this.amountLabelUpdate(node);
                            }
                        }
                    });
                }
            });
        });
        // Start observing the Link ID #plaid-link-button
        observer.observe(form, {
            childList: true,
            subtree: true,
        });
        // Run the Credit Card Update function in case the overlay is already present on page load
        const hubOverlay = document.querySelector(".en__hubOverlay");
        if (hubOverlay) {
            this.creditCardUpdate(hubOverlay);
            this.amountLabelUpdate(hubOverlay);
        }
    }
    creditCardUpdate(overlay) {
        window.setTimeout(() => {
            // Check if the overlay has Credit Card field and Update Button
            const ccField = overlay.querySelector("#en__hubPledge__field--ccnumber"), updateButton = overlay.querySelector(".en__hubUpdateCC__toggle");
            if (ccField && updateButton) {
                // When field gets focus, click the update button
                ccField.addEventListener("focus", () => {
                    this.logger.log("Credit Card field focused");
                    updateButton.click();
                });
            }
        }, 300);
    }
    amountLabelUpdate(overlay) {
        window.setTimeout(() => {
            // Check if the overlay has Amounts, and set the currency symbol updated attribute
            const amountContainer = overlay.querySelector(".en__field--donationAmt");
            if (amountContainer) {
                amountContainer
                    .querySelectorAll(".en__field__element--radio .en__field__item")
                    .forEach((node) => {
                    node.setAttribute("data-engrid-currency-symbol-updated", "true");
                });
            }
        }, 300);
    }
}

;// CONCATENATED MODULE: ./node_modules/@4site/engrid-scripts/dist/fast-form-fill.js
/**
 * This class adds body data attributes if all mandatory inputs, on specific form blocks, are filled.
 * Related styling (to hide elements) can be found in "fast-form-fill.scss".
 *
 * To activate: add the custom class "fast-personal-details" or "fast-address-details"
 * to the relevant form block.
 */

class FastFormFill {
    constructor() {
        this.logger = new EngridLogger("FastFormFill", "white", "magenta", "📌");
        this.rememberMeEvents = RememberMeEvents.getInstance();
        if (engrid_ENGrid.getOption("RememberMe")) {
            this.rememberMeEvents.onLoad.subscribe((hasData) => {
                this.logger.log("Remember me - onLoad", hasData);
                this.run();
            });
            this.rememberMeEvents.onClear.subscribe(() => {
                // This is a test for the onClear event
                this.logger.log("Remember me - onClear");
            });
        }
        else {
            this.run();
        }
    }
    run() {
        const fastPersonalDetailsFormBlocks = document.querySelectorAll(".en__component--formblock.fast-personal-details");
        if (fastPersonalDetailsFormBlocks.length > 0) {
            if ([...fastPersonalDetailsFormBlocks].every((formBlock) => FastFormFill.allMandatoryInputsAreFilled(formBlock))) {
                this.logger.log("Personal details - All mandatory inputs are filled");
                engrid_ENGrid.setBodyData("hide-fast-personal-details", "true");
            }
            else {
                this.logger.log("Personal details - Not all mandatory inputs are filled");
                engrid_ENGrid.setBodyData("hide-fast-personal-details", "false");
            }
        }
        const fastAddressDetailsFormBlocks = document.querySelectorAll(".en__component--formblock.fast-address-details");
        if (fastAddressDetailsFormBlocks.length > 0) {
            if ([...fastAddressDetailsFormBlocks].every((formBlock) => FastFormFill.allMandatoryInputsAreFilled(formBlock))) {
                this.logger.log("Address details - All mandatory inputs are filled");
                engrid_ENGrid.setBodyData("hide-fast-address-details", "true");
            }
            else {
                this.logger.log("Address details - Not all mandatory inputs are filled");
                engrid_ENGrid.setBodyData("hide-fast-address-details", "false");
            }
        }
    }
    static allMandatoryInputsAreFilled(formBlock) {
        const fields = formBlock.querySelectorAll(".en__mandatory input, .en__mandatory select, .en__mandatory textarea");
        return [...fields].every((input) => {
            if (input.type === "radio" || input.type === "checkbox") {
                const inputs = document.querySelectorAll('[name="' + input.name + '"]');
                return [...inputs].some((radioOrCheckbox) => radioOrCheckbox.checked);
            }
            else {
                return input.value !== null && input.value.trim() !== "";
            }
        });
    }
    static someMandatoryInputsAreFilled(formBlock) {
        const fields = formBlock.querySelectorAll(".en__mandatory input, .en__mandatory select, .en__mandatory textarea");
        return [...fields].some((input) => {
            if (input.type === "radio" || input.type === "checkbox") {
                const inputs = document.querySelectorAll('[name="' + input.name + '"]');
                return [...inputs].some((radioOrCheckbox) => radioOrCheckbox.checked);
            }
            else {
                return input.value !== null && input.value.trim() !== "";
            }
        });
    }
}

;// CONCATENATED MODULE: ./node_modules/@4site/engrid-scripts/dist/set-attr.js
/*+
  The class is used to set body attributes via click handlers.
  The format is "setattr--{attribute}--{value}".
  e.g. setattr--data-engrid-hide-fast-address-details--true
 */

class SetAttr {
    constructor() {
        this.logger = new EngridLogger("SetAttr", "black", "yellow", "📌");
        const enGrid = document.getElementById("engrid");
        if (enGrid) {
            enGrid.addEventListener("click", (e) => {
                const clickedEl = e.target;
                if (typeof clickedEl.className !== "string") {
                    return;
                }
                const clickedElClassNames = clickedEl.className.split(" ");
                if (clickedElClassNames.some((className) => className.startsWith("setattr--"))) {
                    clickedEl.classList.forEach((className) => {
                        //Check element has class with format "setattr--attribute--value"
                        const match = className.match(/^setattr--(.+)--(.+)$/i);
                        if (match && match[1] && match[2]) {
                            this.logger.log(`Clicked element with class "${className}". Setting body attribute "${match[1]}" to "${match[2]}"`);
                            engrid_ENGrid.setBodyData(match[1].replace("data-engrid-", ""), match[2]);
                        }
                    });
                }
            });
        }
    }
}

;// CONCATENATED MODULE: ./node_modules/@4site/engrid-scripts/dist/show-if-present.js
/**
 * This class contains the logic for special classes that can be used to hide elements if
 * certain supporter questions are present or absent.
 * Typically, this can be used to hide elements when an opt in question is not rendered on the page
 * because the supporter came from a campaign link and is already opted in, so EN doesn't render
 * the question on the page.
 *
 * The class names are of the format:
 * engrid__supporterquestions{id}-present -- show this element when the supporter question is present
 * engrid__supporterquestions{id}-absent -- show this element when the supporter question is absent
 *
 * The {id} is the id of the supporter question. This can be found by inspecting the element on the page.
 *
 * It's also possible to combine multiple questions using the following format. These examples show 2 questions,
 * but you can use as many as you like:
 * engrid__supporterquestions{id1}__supporterquestions{id2}-present -- show this element when EITHER question is present
 * engrid__supporterquestions{id1}__supporterquestions{id2}-absent -- show this element when EITHER question is absent
 */

class ShowIfPresent {
    constructor() {
        this.logger = new EngridLogger("ShowIfPresent", "yellow", "black", "👀");
        this.elements = [];
        if (this.shouldRun()) {
            this.run();
        }
    }
    shouldRun() {
        // Check if we have any elements on the page that match the pattern for this functionality
        // e.g. engrid__supporterquestions{id}__supporterquestions{id}-present, etc.
        this.elements = [
            ...document.querySelectorAll('[class*="engrid__supporterquestions"]'),
        ].filter((el) => {
            const classNames = el.className.split(" ");
            return classNames.some((className) => /^engrid__supporterquestions\d+(__supporterquestions\d+)*-(present|absent)$/.test(className));
        });
        return this.elements.length > 0;
    }
    run() {
        const actions = [];
        // Create an array of actions for each element we have
        this.elements.forEach((el) => {
            // Mapping to an object with the class name, field name(s), and type
            const classNames = el.className.split(" ");
            const matchingClass = classNames.find((className) => /^engrid__supporterquestions\d+(__supporterquestions\d+)*-(present|absent)$/.test(className));
            if (!matchingClass)
                return null;
            const typeIndex = matchingClass.lastIndexOf("-");
            const type = matchingClass.substring(typeIndex + 1);
            // Getting an array of the matching input names
            // e.g. engrid__supporterquestions12345-present => ['supporter.questions.12345']
            // e.g. engrid__supporterquestions12345__supporterquestions67890-present => ['supporter.questions.12345', 'supporter.questions.67890']
            const inputIds = matchingClass
                .substring(8, typeIndex)
                .split("__")
                .map((id) => `supporter.questions.${id.substring(18)}`);
            actions.push({
                class: matchingClass,
                fieldNames: inputIds,
                type: type,
            });
        });
        //Process the actions
        actions.forEach((action) => {
            const inputElements = action.fieldNames.map((fieldName) => document.getElementsByName(fieldName)[0]);
            const elements = document.querySelectorAll(`.${action.class}`);
            const areAllInputsPresent = inputElements.every((input) => !!input);
            const areAllInputsAbsent = inputElements.every((input) => !input);
            // Hide the elements based on AND conditions
            if ((action.type === "present" && areAllInputsAbsent) ||
                (action.type === "absent" && areAllInputsPresent)) {
                this.logger.log(`Conditions not met, hiding elements with class ${action.class}`);
                elements.forEach((el) => {
                    el.style.display = "none";
                });
            }
        });
    }
}

;// CONCATENATED MODULE: ./node_modules/@4site/engrid-scripts/dist/en-validators.js
// This component uses EN's Custom Validators on the client side to validate form fields.
// It's currently behind a feature flag, so it's not enabled by default.
// To enable it, add the following to your options:
// ENValidators: true

class ENValidators {
    constructor() {
        this._form = EnForm.getInstance();
        this._enElements = null;
        this.logger = new EngridLogger("ENValidators", "white", "darkolivegreen", "🧐");
        if (!this.loadValidators()) {
            // This is an error to flag a racing condition. If the script is loaded before the validators are loaded, it will not work.
            this.logger.error("Not Loaded");
            return;
        }
        if (!this.shouldRun()) {
            // If there's no custom validators, get out
            this.logger.log("Not Needed");
            return;
        }
        this._form.onValidate.subscribe(this.enOnValidate.bind(this));
    }
    loadValidators() {
        if (!engrid_ENGrid.checkNested(window.EngagingNetworks, "require", "_defined", "enValidation", "validation", "validators")) {
            return false;
        }
        // Loop through the array validators and add them to this._enElements
        const validators = window.EngagingNetworks.require._defined.enValidation.validation
            .validators;
        this._enElements = validators.reduce((acc, validator) => {
            if ("type" in validator && validator.type === "CUST") {
                const container = document.querySelector(".en__field--" + validator.field);
                const field = container
                    ? container.querySelector("input, select, textarea")
                    : null;
                if (field) {
                    field.addEventListener("input", this.liveValidate.bind(this, container, field, validator.regex, validator.message));
                    acc.push({
                        container: container,
                        field: field,
                        regex: validator.regex,
                        message: validator.message,
                    });
                }
            }
            return acc;
        }, []);
        return true;
    }
    // Should we run the script?
    shouldRun() {
        return (engrid_ENGrid.getOption("ENValidators") &&
            this._enElements &&
            this._enElements.length > 0);
    }
    // Don't submit the form if any of the fields are invalid
    enOnValidate() {
        if (!this._enElements || this._form.validate === false) {
            return;
        }
        this._enElements.forEach((element) => {
            const fieldValidation = this.liveValidate(element.container, element.field, element.regex, element.message);
            if (!fieldValidation) {
                this._form.validate = false;
                element.field.focus();
                return;
            }
        });
        this._form.validate = true;
    }
    // Validate the field on the fly
    liveValidate(container, field, regex, message) {
        const value = engrid_ENGrid.getFieldValue(field.getAttribute("name") || "");
        // Do not validate empty fields, that's the job of the required validator
        if (value === "") {
            return true;
        }
        this.logger.log(`Live Validate ${field.getAttribute("name")} with ${regex}`);
        // compare the value of the field with the regex
        if (!value.match(regex)) {
            // If the value is not valid, add the error message
            engrid_ENGrid.setError(container, message);
            return false;
        }
        // If the value is valid, remove the error message
        engrid_ENGrid.removeError(container);
        return true;
    }
}

;// CONCATENATED MODULE: ./node_modules/@4site/engrid-scripts/dist/postal-code-validator.js



// Conditionally validates the postcode field for a US format zip code
// If US is selected as the country, a country has not been selected yet
// or if there is no country field
// Allows blank zip code if zip code is not required.
class PostalCodeValidator {
    constructor() {
        var _a, _b;
        this.postalCodeField = engrid_ENGrid.getField("supporter.postcode");
        this._form = EnForm.getInstance();
        this.logger = new EngridLogger("Postal Code Validator", "white", "red", "📬");
        this.supportedSeparators = ["+", "-", " "];
        this.separator = this.getSeparator();
        this.regexSeparator = this.getRegexSeparator(this.separator);
        if (this.shouldRun()) {
            (_a = this.postalCodeField) === null || _a === void 0 ? void 0 : _a.addEventListener("blur", () => this.validate());
            (_b = this.postalCodeField) === null || _b === void 0 ? void 0 : _b.addEventListener("input", () => this.liveValidate());
            this._form.onValidate.subscribe(() => {
                if (!this._form.validate)
                    return;
                this.liveValidate();
                // It seems like we need some delay or EN removes our error message.
                setTimeout(() => {
                    this.validate();
                }, 100);
                // We dont need to validate the zip code, or it is valid
                const postalCodeValid = !this.shouldValidateUSZipCode() || this.isValidUSZipCode();
                this._form.validate = postalCodeValid;
                if (!postalCodeValid) {
                    this.logger.log(`Invalid Zip Code ${this.postalCodeField.value}`);
                    this.postalCodeField.scrollIntoView({ behavior: "smooth" });
                }
                return postalCodeValid;
            });
        }
    }
    shouldRun() {
        return !!(engrid_ENGrid.getOption("PostalCodeValidator") && this.postalCodeField);
    }
    validate() {
        if (this.shouldValidateUSZipCode() && !this.isValidUSZipCode()) {
            engrid_ENGrid.setError(".en__field--postcode", `Please enter a valid ZIP Code of ##### or #####${this.separator}####`);
        }
        else {
            engrid_ENGrid.removeError(".en__field--postcode");
        }
    }
    isValidUSZipCode() {
        var _a, _b;
        const zipCodeRequired = !!document.querySelector(".en__field--postcode.en__mandatory");
        // If zip code is not required in EN Form Block and the field is empty, it is valid
        if (!zipCodeRequired && ((_a = this.postalCodeField) === null || _a === void 0 ? void 0 : _a.value) === "") {
            return true;
        }
        const postalCodeRegex = new RegExp(`^\\d{5}(${this.regexSeparator}\\d{4})?$`);
        return !!((_b = this.postalCodeField) === null || _b === void 0 ? void 0 : _b.value.match(postalCodeRegex));
    }
    /**
     * Formats the zip code to #####-####  as the user inputs it
     * The separator is determined by the TidyContact option, but defaults to "-"
     */
    liveValidate() {
        var _a;
        if (!this.shouldValidateUSZipCode())
            return;
        let value = (_a = this.postalCodeField) === null || _a === void 0 ? void 0 : _a.value;
        // If the value is 5 characters or less, remove all non-numeric characters
        if (value.length <= 5) {
            value = value.replace(/\D/g, "");
        }
        // If one of the supported separators is endered as the 6th character, replace it with the official separator
        else if (value.length === 6 &&
            this.supportedSeparators.includes(value[5])) {
            // Removing all non-numeric characters
            value = value.replace(/\D/g, "") + this.separator;
        }
        else {
            // Removing all non-numeric characters
            value = value.replace(/\D/g, "");
            // Adding the separator after the 5th character
            value = value.replace(/(\d{5})(\d)/, `$1${this.separator}$2`);
        }
        //set field value with max 10 characters
        this.postalCodeField.value = value.slice(0, 10);
    }
    shouldValidateUSZipCode() {
        // Validating US zip code only if country is US, country has not yet been selected
        // or if there is no country field
        const country = engrid_ENGrid.getField("supporter.country")
            ? engrid_ENGrid.getFieldValue("supporter.country")
            : "US";
        return ["us", "united states", "usa", ""].includes(country.toLowerCase());
    }
    getSeparator() {
        const tidyContact = engrid_ENGrid.getOption("TidyContact");
        if (tidyContact &&
            tidyContact.us_zip_divider &&
            this.supportedSeparators.includes(tidyContact.us_zip_divider)) {
            return tidyContact.us_zip_divider;
        }
        return "-";
    }
    getRegexSeparator(separator) {
        switch (separator) {
            case "+":
                return "\\+";
            case "-":
                return "-";
            case " ":
                return "\\s";
            default:
                this.logger.log(`Invalid separator "${separator}" provided to PostalCodeValidator, falling back to "-".`);
                return "-";
        }
    }
}

;// CONCATENATED MODULE: ./node_modules/@4site/engrid-scripts/dist/vgs.js
// This component allows you to customize the VGS theme options
//
// It is used in the following way:
//
// VGS: {
// "transaction.ccnumber": {
//     showCardIcon: true,
//     placeholder: "•••• •••• •••• ••••",
//     icons: {
//        (icons can't be urls, they have to be base64 encoded images)
//        cardPlaceholder: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' height='24px' viewBox='0 0 24 24' width='24px' fill='%233BBF45'%3E%3Cpath d='M0 0h24v24H0z' fill='none'/%3E%3Cpath d='M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z'/%3E%3C/svg%3E"
//        visa: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 384 512'%3E%3Cpath fill='%233BBF45' d='M384 32H0v448h384V32z'/%3E%3Cpath fill='white' d='M128.5 352.5l-32-192h-32l32 192zm96-192l-32 192h-32l32-192z'/%3E%3C/svg%3E",
//     },
// },
// "transaction.ccvv": {
//     showCardIcon: false,
//     placeholder: "CVV",
//     hideValue: false,
// },
// },
//
// The VGS component can also be set at the page level, if necessary
//

class VGS {
    constructor() {
        this.logger = new EngridLogger("VGS", "black", "pink", "💳");
        this.vgsField = document.querySelector(".en__field--vgs");
        this.options = engrid_ENGrid.getOption("VGS");
        this.paymentTypeField = document.querySelector("#en__field_transaction_paymenttype");
        this._form = EnForm.getInstance();
        this.field_expiration_month = null;
        this.field_expiration_year = null;
        this.handleExpUpdate = (e) => {
            if (!this.field_expiration_month || !this.field_expiration_year)
                return;
            const current_date = new Date();
            const current_month = current_date.getMonth() + 1;
            const current_year = parseInt(this.field_expiration_year[this.field_expiration_year.length - 1].value) > 2000
                ? current_date.getFullYear()
                : current_date.getFullYear() - 2000;
            // handle if year is changed to current year (disable all months less than current month)
            // handle if month is changed to less than current month (disable current year)
            if (e == "month") {
                let selected_month = parseInt(this.field_expiration_month.value);
                let disable = selected_month < current_month;
                this.logger.log(`month disable ${disable}`);
                this.logger.log(`selected_month ${selected_month}`);
                for (let i = 0; i < this.field_expiration_year.options.length; i++) {
                    // disable or enable current year
                    if (parseInt(this.field_expiration_year.options[i].value) <= current_year) {
                        if (disable) {
                            this.field_expiration_year.options[i].setAttribute("disabled", "disabled");
                        }
                        else {
                            this.field_expiration_year.options[i].disabled = false;
                        }
                    }
                }
            }
            else if (e == "year") {
                let selected_year = parseInt(this.field_expiration_year.value);
                let disable = selected_year == current_year;
                this.logger.log(`year disable ${disable}`);
                this.logger.log(`selected_year ${selected_year}`);
                for (let i = 0; i < this.field_expiration_month.options.length; i++) {
                    // disable or enable all months less than current month
                    if (parseInt(this.field_expiration_month.options[i].value) < current_month) {
                        if (disable) {
                            this.field_expiration_month.options[i].setAttribute("disabled", "disabled");
                        }
                        else {
                            this.field_expiration_month.options[i].disabled = false;
                        }
                    }
                }
            }
        };
        if (!this.shouldRun())
            return;
        this.setPaymentType();
        this.setDefaults();
        this.dumpGlobalVar();
        const expireFiels = document.getElementsByName("transaction.ccexpire");
        if (expireFiels) {
            this.field_expiration_month = expireFiels[0];
            this.field_expiration_year = expireFiels[1];
        }
        // Add event listeners to the expiration fields
        if (this.field_expiration_month && this.field_expiration_year) {
            ["change"].forEach((event) => {
                var _a, _b;
                (_a = this.field_expiration_month) === null || _a === void 0 ? void 0 : _a.addEventListener(event, () => {
                    this.handleExpUpdate("month");
                });
                (_b = this.field_expiration_year) === null || _b === void 0 ? void 0 : _b.addEventListener(event, () => {
                    this.handleExpUpdate("year");
                });
            });
        }
        this._form.onValidate.subscribe(() => {
            if (this._form.validate) {
                const isValid = this.validate();
                this.logger.log(`Form Validation: ${isValid}`);
                this._form.validate = isValid;
            }
        });
    }
    shouldRun() {
        // Only run if the vgs field is present
        if (!this.vgsField)
            return false;
        return true;
    }
    setDefaults() {
        //EN attempts to define a few default styles for VGS fields based on our text field styling
        //This does not always work, so we will provide our own defaults
        const bodyStyles = getComputedStyle(document.body);
        const styles = {
            fontFamily: bodyStyles.getPropertyValue("--input_font-family") ||
                "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji'",
            fontSize: bodyStyles.getPropertyValue("--input_font-size") || "16px",
            color: bodyStyles.getPropertyValue("--input_color") || "#000",
            padding: bodyStyles.getPropertyValue("--input_padding") || "10px",
            "&::placeholder": {
                color: bodyStyles.getPropertyValue("--input_placeholder-color") || "#a9a9a9",
                opacity: bodyStyles.getPropertyValue("--input_placeholder-opacity") || "1",
                fontWeight: bodyStyles.getPropertyValue("--input_placeholder-font-weight") ||
                    "normal",
            },
        };
        const options = this.options;
        const defaultOptions = {
            "transaction.ccnumber": {
                showCardIcon: true,
                placeholder: "•••• •••• •••• ••••",
                icons: {
                    cardPlaceholder: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEwAAABMCAYAAADHl1ErAAAACXBIWXMAABYlAAAWJQFJUiTwAAAB8ElEQVR4nO2c4W3CMBBGz1H/NyNkAzoCo2SDrkI3YJSOABt0g9IJXBnOqUkMyifUqkrek04RlvMjT2c7sc6EGKPBfBpcaSBMBGEiCBNBmAjCRBAmgjARhIkgTARhIggTQZhK2q0Yh5l1ZrYzs0PqsrI4+LN3VTeThkvntUm6Fbuxn2E/LITQmtm7mW08Sb/MbO9tpxhjui6WEMLWzJKDdO3N7Nmf9ZjaYoyn8y8X1o6GXxLV1lJyDeE+9oWPQ/ZRG4b9WkVVpqe+8LLLo7ErM6t248qllZnWBc+uV5+zumGsQjm3f/ic9tb4JGeeXcga4U723rptilVx0avgg2Q3m/JNn+y6zeAm+GSWUi/c7L5yfB77RJhACOHs6WnuLfmGpTI3YditEEGYCMJEECaCMJHZqySvHRfIMBGEiSBMBGEiCBNBmAjCRBAmgjARhIkgTGT2t+R/59EdYXZcfwmEiSBMBGEiCBNZzCr5VzvCZJjIIMxrPKFC6abMsHbaFcZuGq8StqKwDqZkN8emKBbrvawHCtxJ7y1nVxQF34lxUXBupOy8EtWy88jBhknUDjbkPhyd+Xn2l9lHZ8rgcNZVTA5nTYRFjv/dPf7HvzuJ8C0pgjARhIkgTARhIggTQZgIwkQQJoIwEYSJIEwEYQpm9g2Ro5zhLcuLBwAAAABJRU5ErkJggg==",
                },
                css: styles,
                // Autocomplete is not customizable
                autoComplete: "cc-number",
                validations: ["required", "validCardNumber"],
            },
            "transaction.ccvv": {
                showCardIcon: false,
                placeholder: "CVV",
                hideValue: false,
                // Autocomplete is not customizable
                autoComplete: "cc-csc",
                validations: ["required", "validCardSecurityCode"],
                css: styles,
            },
            "transaction.ccexpire": {
                placeholder: "MM/YY",
                autoComplete: "cc-exp",
                validations: ["required", "validCardExpirationDate"],
                css: styles,
                yearLength: 2,
            },
        };
        // Deep merge the default options with the options set in the theme
        this.options = engrid_ENGrid.deepMerge(defaultOptions, options);
        this.logger.log("Options", this.options);
    }
    setPaymentType() {
        // If there's no default payment type, set the default to card
        if (engrid_ENGrid.getPaymentType() === "") {
            engrid_ENGrid.setPaymentType("card");
        }
    }
    dumpGlobalVar() {
        // Dump the global variable for the VGS options
        window.enVGSFields = this.options;
        // EN is not reading the global variable because their JS file loads before ENgrid, so we're going to HACK TOWN
        // Clean up the VGS iFrames
        window.setTimeout(() => {
            const vgsIElements = document.querySelectorAll(".en__field__input--vgs");
            if (vgsIElements.length > 0) {
                // Create a mutation observer that cleans the VGS Elements before anything is rendered
                const observer = new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                        var _a;
                        if (mutation.type === "childList" &&
                            mutation.addedNodes.length > 0) {
                            mutation.addedNodes.forEach((node) => {
                                if (node.nodeName === "IFRAME" &&
                                    mutation.previousSibling &&
                                    mutation.previousSibling.nodeName === "IFRAME") {
                                    // Delete the previous sibling
                                    mutation.previousSibling.remove();
                                }
                            });
                        }
                        // Check if the VGS Element is valid, and remove any validation classes and errors
                        if (mutation.type === "attributes" &&
                            mutation.attributeName === "class") {
                            const target = mutation.target;
                            if (target.classList.contains("vgs-collect-container__valid")) {
                                const fieldWrapper = target.closest(".en__field--vgs");
                                fieldWrapper === null || fieldWrapper === void 0 ? void 0 : fieldWrapper.classList.remove("en__field--validationFailed");
                                (_a = fieldWrapper === null || fieldWrapper === void 0 ? void 0 : fieldWrapper.querySelector(".en__field__error")) === null || _a === void 0 ? void 0 : _a.remove();
                            }
                        }
                    });
                });
                // Observe the VGS Elements
                vgsIElements.forEach((vgsIElement) => {
                    observer.observe(vgsIElement, {
                        childList: true,
                        attributeFilter: ["class"],
                    });
                });
                if (engrid_ENGrid.checkNested(window.EngagingNetworks, "require", "_defined", "enjs", "vgs")) {
                    window.EngagingNetworks.require._defined.enjs.vgs.init();
                }
                else {
                    this.logger.log("VGS is not defined");
                }
            }
        }, 1000);
    }
    validate() {
        if (this.paymentTypeField.value.toLowerCase() === "card" ||
            this.paymentTypeField.value.toLowerCase() === "visa" ||
            this.paymentTypeField.value.toLowerCase() === "vi") {
            const cardContainer = document.querySelector(".en__field--vgs.en__field--ccnumber");
            const cardEmpty = cardContainer.querySelector(".vgs-collect-container__empty");
            const cvvContainer = document.querySelector(".en__field--vgs.en__field--ccvv");
            const cvvEmpty = cvvContainer.querySelector(".vgs-collect-container__empty");
            if (cardContainer && cardEmpty) {
                window.setTimeout(() => {
                    engrid_ENGrid.setError(cardContainer, "Please enter a valid card number");
                    // Scroll to the error
                    cardContainer.scrollIntoView({ behavior: "smooth" });
                }, 100);
                return false;
            }
            if (cvvContainer && cvvEmpty) {
                window.setTimeout(() => {
                    engrid_ENGrid.setError(cvvContainer, "Please enter a valid CVV");
                    // Scroll to the error
                    cvvContainer.scrollIntoView({ behavior: "smooth" });
                }, 100);
                return false;
            }
        }
        return true;
    }
}

;// CONCATENATED MODULE: ./node_modules/@4site/engrid-scripts/dist/country-redirect.js
// This component allows you to redirect the user to a different page based on their country.
// It works by checking the country field on the page and comparing it to the list of countries in the CountryRedirect option.
// If the country matches one of the countries in the list, the user is redirected to the specified URL only if the URL is not the same as the current page.
// The CountryRedirect option is an object with the country as the key and the URL as the value.
// Example:
//
// CountryRedirect: {
//   US: "https://example.com/us",
//   CA: "https://example.com/ca",
//   GB: "https://example.com/gb",
// },
// The country codes must match the country codes in the country field
// The CountryRedirect component can also be set at the page level. Useful for Regional Pages, with a Code Block like this:
//
// <script>
//   window.EngridPageOptions = window.EngridPageOptions || [];
//   window.EngridPageOptions.CountryRedirect = {
//     US: "https://example.com/us",
//     CA: "https://example.com/ca",
//     GB: "https://example.com/gb",
//   };
// </script>
//
// This will override the default CountryRedirect options for that page.
//

class CountryRedirect {
    constructor() {
        this.logger = new EngridLogger("CountryRedirect", "white", "brown", "🛫");
        this._country = Country.getInstance();
        if (!this.shouldRun())
            return;
        this._country.onCountryChange.subscribe((country) => {
            this.checkRedirect(country);
        });
        this.checkRedirect(this._country.country); // This will check the redirect when the page loads
    }
    shouldRun() {
        // Only run if the CountryRedirect option is not false and the country field is present
        if (!engrid_ENGrid.getOption("CountryRedirect") || !this._country.countryField) {
            return false;
        }
        return true;
    }
    checkRedirect(country) {
        const countryRedirect = engrid_ENGrid.getOption("CountryRedirect");
        // Check if the country is in the list and if the current URL is not the same as the redirect URL
        // We are using includes because the URL might have query parameters
        if (countryRedirect &&
            country in countryRedirect &&
            window.location.href.includes(countryRedirect[country]) === false) {
            this.logger.log(`${country}: Redirecting to ${countryRedirect[country]}`);
            let redirectUrl = new URL(countryRedirect[country]);
            // If the redirect URL doesn't contain "?chain", add it
            if (!redirectUrl.search.includes("chain")) {
                redirectUrl.search += (redirectUrl.search ? "&" : "?") + "chain";
            }
            window.location.href = redirectUrl.href;
        }
    }
}

;// CONCATENATED MODULE: ./node_modules/@4site/engrid-scripts/dist/welcome-back.js
/**
 * This component adds a welcome back message and a personal details summary to the page.
 * It depends on the "fast-personal-details" functionality from the FastFormFill component.
 * The component will only run, when the "WelcomeBack" option is set,
 * if the "fast-personal-details" class is present on the page and the FastFormFill conditions
 * are met (all mandatory inputs in that block are filled).
 *
 * All the text content and positioning is configurable through the "WelcomeBack" option.
 */


class WelcomeBack {
    constructor() {
        var _a;
        this.supporterDetails = {};
        this.options = (_a = engrid_ENGrid.getOption("WelcomeBack")) !== null && _a !== void 0 ? _a : false;
        if (this.shouldRun()) {
            this.supporterDetails = {
                firstName: engrid_ENGrid.getFieldValue("supporter.firstName"),
                lastName: engrid_ENGrid.getFieldValue("supporter.lastName"),
                emailAddress: engrid_ENGrid.getFieldValue("supporter.emailAddress"),
                address1: engrid_ENGrid.getFieldValue("supporter.address1"),
                address2: engrid_ENGrid.getFieldValue("supporter.address2"),
                city: engrid_ENGrid.getFieldValue("supporter.city"),
                region: engrid_ENGrid.getFieldValue("supporter.region"),
                postcode: engrid_ENGrid.getFieldValue("supporter.postcode"),
                country: engrid_ENGrid.getFieldValue("supporter.country"),
            };
            this.addWelcomeBack();
            this.addPersonalDetailsSummary();
            this.addEventListeners();
        }
    }
    shouldRun() {
        return (!!document.querySelector(".fast-personal-details") &&
            this.options !== false);
    }
    addWelcomeBack() {
        var _a;
        if (typeof this.options !== "object" ||
            !this.options.welcomeBackMessage.display)
            return;
        const options = this.options.welcomeBackMessage;
        const welcomeBack = document.createElement("div");
        welcomeBack.classList.add("engrid-welcome-back", "showif-fast-personal-details");
        const title = options.title.replace("{firstName}", this.supporterDetails["firstName"]);
        welcomeBack.innerHTML = `<p>
      ${title}
      <span class="engrid-reset-welcome-back">${options.editText}</span>
    </p>`;
        (_a = document
            .querySelector(options.anchor)) === null || _a === void 0 ? void 0 : _a.insertAdjacentElement(options.placement, welcomeBack);
    }
    resetWelcomeBack() {
        const inputs = document.querySelectorAll(".fast-personal-details .en__field__input");
        inputs.forEach((input) => {
            if (input.type === "checkbox" || input.type === "radio") {
                input.checked = false;
            }
            else {
                input.value = "";
            }
        });
        this.supporterDetails = {};
        engrid_ENGrid.setBodyData("hide-fast-personal-details", false);
        remove("engrid-autofill");
    }
    addPersonalDetailsSummary() {
        var _a;
        if (typeof this.options !== "object" ||
            !this.options.personalDetailsSummary.display)
            return;
        let options = this.options.personalDetailsSummary;
        const personalDetailsSummary = document.createElement("div");
        personalDetailsSummary.classList.add("engrid-personal-details-summary", "showif-fast-personal-details");
        personalDetailsSummary.innerHTML = `<h3>${options.title}</h3>`;
        personalDetailsSummary.insertAdjacentHTML("beforeend", `
     <p>
        ${this.supporterDetails["firstName"]} ${this.supporterDetails["lastName"]}
        <br>
        ${this.supporterDetails["emailAddress"]}
     </p>
    `);
        if (this.supporterDetails["address1"] &&
            this.supporterDetails["city"] &&
            this.supporterDetails["region"] &&
            this.supporterDetails["postcode"]) {
            personalDetailsSummary.insertAdjacentHTML("beforeend", `
        <p>
          ${this.supporterDetails["address1"]} ${this.supporterDetails["address2"]}
          <br>
          ${this.supporterDetails["city"]}, ${this.supporterDetails["region"]} 
          ${this.supporterDetails["postcode"]}
        </p>
      `);
        }
        personalDetailsSummary.insertAdjacentHTML("beforeend", `
      <p class="engrid-welcome-back-clear setattr--data-engrid-hide-fast-personal-details--false">${options.editText}<svg viewbox="0 0 528.899 528.899" xmlns="http://www.w3.org/2000/svg"> <g> <path d="M328.883,89.125l107.59,107.589l-272.34,272.34L56.604,361.465L328.883,89.125z M518.113,63.177l-47.981-47.981 c-18.543-18.543-48.653-18.543-67.259,0l-45.961,45.961l107.59,107.59l53.611-53.611 C532.495,100.753,532.495,77.559,518.113,63.177z M0.3,512.69c-1.958,8.812,5.998,16.708,14.811,14.565l119.891-29.069 L27.473,390.597L0.3,512.69z"></path></g></svg></p>
    `);
        (_a = document
            .querySelector(options.anchor)) === null || _a === void 0 ? void 0 : _a.insertAdjacentElement(options.placement, personalDetailsSummary);
    }
    addEventListeners() {
        document
            .querySelectorAll(".engrid-reset-welcome-back")
            .forEach((element) => {
            element.addEventListener("click", () => {
                this.resetWelcomeBack();
            });
        });
    }
}

;// CONCATENATED MODULE: ./node_modules/@4site/engrid-scripts/dist/interfaces/ecard-to-target-options.js
const EcardToTargetOptionsDefaults = {
    targetName: "",
    targetEmail: "",
    hideSendDate: true,
    hideTarget: true,
    hideMessage: true,
    addSupporterNameToMessage: false,
};

;// CONCATENATED MODULE: ./node_modules/@4site/engrid-scripts/dist/ecard-to-target.js
/**
 * This component adjusts an ecard form to target a specific recipient,
 * defined in a code block
 */




class EcardToTarget {
    constructor() {
        this.options = EcardToTargetOptionsDefaults;
        this.logger = new EngridLogger("EcardToTarget", "DarkBlue", "Azure", "📧");
        this._form = EnForm.getInstance();
        this.supporterNameAddedToMessage = false;
        if (!this.shouldRun())
            return;
        this.options = Object.assign(Object.assign({}, this.options), window.EngridEcardToTarget);
        this.logger.log("EcardToTarget running. Options:", this.options);
        this.setTarget();
        this.hideElements();
        this.addSupporterNameToMessage();
    }
    shouldRun() {
        return (window.hasOwnProperty("EngridEcardToTarget") &&
            typeof window.EngridEcardToTarget === "object" &&
            window.EngridEcardToTarget.hasOwnProperty("targetName") &&
            window.EngridEcardToTarget.hasOwnProperty("targetEmail"));
    }
    setTarget() {
        const targetNameField = document.querySelector(".en__ecardrecipients__name input");
        const targetEmailField = document.querySelector(".en__ecardrecipients__email input");
        const addRecipientButton = document.querySelector(".en__ecarditems__addrecipient");
        if (!targetNameField || !targetEmailField || !addRecipientButton) {
            this.logger.error("Could not add recipient. Required elements not found.");
            return;
        }
        targetNameField.value = this.options.targetName;
        targetEmailField.value = this.options.targetEmail;
        addRecipientButton === null || addRecipientButton === void 0 ? void 0 : addRecipientButton.click();
        this.logger.log("Added recipient", this.options.targetName, this.options.targetEmail);
    }
    hideElements() {
        const messageBlock = document.querySelector(".en__ecardmessage");
        const sendDateBlock = document.querySelector(".en__ecardrecipients__futureDelivery");
        const targetBlock = document.querySelector(".en__ecardrecipients");
        if (this.options.hideMessage && messageBlock) {
            messageBlock.classList.add("hide");
        }
        if (this.options.hideSendDate && sendDateBlock) {
            sendDateBlock.classList.add("hide");
        }
        if (this.options.hideTarget && targetBlock) {
            targetBlock.classList.add("hide");
        }
    }
    addSupporterNameToMessage() {
        if (!this.options.addSupporterNameToMessage)
            return;
        this._form.onSubmit.subscribe(() => {
            if (!this._form.submit)
                return;
            if (!this.supporterNameAddedToMessage) {
                this.supporterNameAddedToMessage = true;
                const supporterName = `${engrid_ENGrid.getFieldValue("supporter.firstName")} ${engrid_ENGrid.getFieldValue("supporter.lastName")}`;
                const messageField = document.querySelector("[name='transaction.comments']");
                if (!messageField)
                    return;
                messageField.value = `${messageField.value}\n${supporterName}`;
                this.logger.log("Added supporter name to personalized message", supporterName);
            }
        });
    }
}

;// CONCATENATED MODULE: ./node_modules/@4site/engrid-scripts/dist/interfaces/embedded-ecard-options.js
const EmbeddedEcardOptionsDefaults = {
    pageUrl: "",
    headerText: "Send an Ecard notification of your gift",
    checkboxText: "Yes, I would like to send an ecard to announce my gift.",
    anchor: ".en__field--donationAmt",
    placement: "afterend",
};

;// CONCATENATED MODULE: ./node_modules/@4site/engrid-scripts/dist/embedded-ecard.js
/**
 * This class handles adding a checkbox to a form that, when checked, will display an embedded ecard form.
 * The embedded ecard form is hosted on a separate page and is displayed in an iframe.
 * The form data is saved in session storage and is submitted when the thank you page is loaded.
 * Options can set on the page via window.EngridEmbeddedEcard.
 */


class EmbeddedEcard {
    constructor() {
        this.logger = new EngridLogger("Embedded Ecard", "#D95D39", "#0E1428", "📧");
        this.options = EmbeddedEcardOptionsDefaults;
        this._form = EnForm.getInstance();
        this.isSubmitting = false;
        // For the page hosting the embedded ecard
        if (this.onHostPage()) {
            // Clean up session variables if the page is reloaded, and it isn't a submission failure
            const submissionFailed = !!(engrid_ENGrid.checkNested(window.EngagingNetworks, "require", "_defined", "enjs", "checkSubmissionFailed") &&
                window.EngagingNetworks.require._defined.enjs.checkSubmissionFailed());
            if (!submissionFailed) {
                sessionStorage.removeItem("engrid-embedded-ecard");
                sessionStorage.removeItem("engrid-send-embedded-ecard");
            }
            this.options = Object.assign(Object.assign({}, EmbeddedEcardOptionsDefaults), window.EngridEmbeddedEcard);
            const pageUrl = new URL(this.options.pageUrl);
            pageUrl.searchParams.append("data-engrid-embedded-ecard", "true");
            this.options.pageUrl = pageUrl.href;
            this.logger.log("Running Embedded Ecard component", this.options);
            this.embedEcard();
            this.addEventListeners();
        }
        // For the thank you page - after the host page form has been submitted
        // Only runs if eCard was selected on the main page
        if (this.onPostActionPage()) {
            engrid_ENGrid.setBodyData("embedded-ecard-sent", "true");
            this.submitEcard();
        }
        // For the page that is embedded
        if (this.onEmbeddedEcardPage()) {
            this.setupEmbeddedPage();
        }
    }
    onHostPage() {
        return (window.hasOwnProperty("EngridEmbeddedEcard") &&
            typeof window.EngridEmbeddedEcard === "object" &&
            window.EngridEmbeddedEcard.hasOwnProperty("pageUrl") &&
            window.EngridEmbeddedEcard.pageUrl !== "");
    }
    onEmbeddedEcardPage() {
        return engrid_ENGrid.getPageType() === "ECARD" && engrid_ENGrid.hasBodyData("embedded");
    }
    onPostActionPage() {
        return (sessionStorage.getItem("engrid-embedded-ecard") !== null &&
            sessionStorage.getItem("engrid-send-embedded-ecard") !== null &&
            !this.onHostPage() &&
            !this.onEmbeddedEcardPage());
    }
    embedEcard() {
        var _a;
        const container = document.createElement("div");
        container.classList.add("engrid--embedded-ecard");
        const heading = document.createElement("h3");
        heading.textContent = this.options.headerText;
        heading.classList.add("engrid--embedded-ecard-heading");
        container.appendChild(heading);
        const checkbox = document.createElement("div");
        checkbox.classList.add("pseudo-en-field", "en__field", "en__field--checkbox", "en__field--000000", "en__field--embedded-ecard");
        checkbox.innerHTML = `
      <div class="en__field__element en__field__element--checkbox">
        <div class="en__field__item">
          <input class="en__field__input en__field__input--checkbox" id="en__field_embedded-ecard" name="engrid.embedded-ecard" type="checkbox" value="Y">
          <label class="en__field__label en__field__label--item" for="en__field_embedded-ecard">${this.options.checkboxText}</label>
        </div>
      </div>`;
        container.appendChild(checkbox);
        container.appendChild(this.createIframe(this.options.pageUrl));
        (_a = document
            .querySelector(this.options.anchor)) === null || _a === void 0 ? void 0 : _a.insertAdjacentElement(this.options.placement, container);
    }
    createIframe(url) {
        const iframe = document.createElement("iframe");
        iframe.src = url;
        iframe.setAttribute("src", url);
        iframe.setAttribute("width", "100%");
        iframe.setAttribute("scrolling", "no");
        iframe.setAttribute("frameborder", "0");
        iframe.classList.add("engrid-iframe", "engrid-iframe--embedded-ecard");
        iframe.style.display = "none";
        return iframe;
    }
    addEventListeners() {
        const iframe = document.querySelector(".engrid-iframe--embedded-ecard");
        const sendEcardCheckbox = document.getElementById("en__field_embedded-ecard");
        // Initialize based on checkbox's default state
        if (sendEcardCheckbox === null || sendEcardCheckbox === void 0 ? void 0 : sendEcardCheckbox.checked) {
            iframe === null || iframe === void 0 ? void 0 : iframe.setAttribute("style", "display: block");
            sessionStorage.setItem("engrid-send-embedded-ecard", "true");
        }
        else {
            iframe === null || iframe === void 0 ? void 0 : iframe.setAttribute("style", "display: none");
            sessionStorage.removeItem("engrid-send-embedded-ecard");
        }
        sendEcardCheckbox === null || sendEcardCheckbox === void 0 ? void 0 : sendEcardCheckbox.addEventListener("change", (e) => {
            const checkbox = e.target;
            if (checkbox === null || checkbox === void 0 ? void 0 : checkbox.checked) {
                iframe === null || iframe === void 0 ? void 0 : iframe.setAttribute("style", "display: block");
                sessionStorage.setItem("engrid-send-embedded-ecard", "true");
            }
            else {
                iframe === null || iframe === void 0 ? void 0 : iframe.setAttribute("style", "display: none");
                sessionStorage.removeItem("engrid-send-embedded-ecard");
            }
        });
    }
    setEmbeddedEcardSessionData() {
        let ecardVariant = document.querySelector("[name='friend.ecard']");
        let ecardSendDate = document.querySelector("[name='ecard.schedule']");
        let ecardMessage = document.querySelector("[name='transaction.comments']");
        //add "chain" param to window.location.href if it doesnt have it
        const pageUrl = new URL(window.location.href);
        if (!pageUrl.searchParams.has("chain")) {
            pageUrl.searchParams.append("chain", "");
        }
        const embeddedEcardData = {
            pageUrl: pageUrl.href,
            formData: {
                ecardVariant: (ecardVariant === null || ecardVariant === void 0 ? void 0 : ecardVariant.value) || "",
                ecardSendDate: (ecardSendDate === null || ecardSendDate === void 0 ? void 0 : ecardSendDate.value) || "",
                ecardMessage: (ecardMessage === null || ecardMessage === void 0 ? void 0 : ecardMessage.value) || "",
                recipients: this.getEcardRecipients(),
            },
        };
        sessionStorage.setItem("engrid-embedded-ecard", JSON.stringify(embeddedEcardData));
    }
    getEcardRecipients() {
        const recipients = [];
        const addRecipientButton = document.querySelector(".en__ecarditems__addrecipient");
        //Single recipient form where the "add recipient" button is hidden, and we use the recipient name and email fields
        const isSingleRecipientForm = !addRecipientButton || addRecipientButton.offsetHeight === 0;
        if (isSingleRecipientForm) {
            // When it is a single recipient form, we only need to get the recipient name and email from the input fields
            let recipientName = document.querySelector(".en__ecardrecipients__name > input");
            let recipientEmail = document.querySelector(".en__ecardrecipients__email > input");
            if (recipientName && recipientEmail) {
                recipients.push({
                    name: recipientName.value,
                    email: recipientEmail.value,
                });
            }
            return recipients;
        }
        // For multiple recipient forms, we need to get the recipient name and email from each recipient in the recipient list
        const recipientList = document.querySelector(".en__ecardrecipients__list");
        recipientList === null || recipientList === void 0 ? void 0 : recipientList.querySelectorAll(".en__ecardrecipients__recipient").forEach((el) => {
            const recipientName = el.querySelector(".ecardrecipient__name");
            const recipientEmail = el.querySelector(".ecardrecipient__email");
            if (recipientName && recipientEmail) {
                recipients.push({
                    name: recipientName.value,
                    email: recipientEmail.value,
                });
            }
        });
        return recipients;
    }
    setupEmbeddedPage() {
        let ecardVariant = document.querySelector("[name='friend.ecard']");
        let ecardSendDate = document.querySelector("[name='ecard.schedule']");
        let ecardMessage = document.querySelector("[name='transaction.comments']");
        let recipientName = document.querySelector(".en__ecardrecipients__name > input");
        let recipientEmail = document.querySelector(".en__ecardrecipients__email > input");
        [
            ecardVariant,
            ecardSendDate,
            ecardMessage,
            recipientName,
            recipientEmail,
        ].forEach((el) => {
            el.addEventListener("input", () => {
                if (this.isSubmitting)
                    return;
                this.setEmbeddedEcardSessionData();
            });
        });
        // MutationObserver to detect changes in the recipient list and update the session data
        const observer = new MutationObserver((mutationsList) => {
            for (let mutation of mutationsList) {
                if (mutation.type === "childList") {
                    if (this.isSubmitting)
                        return;
                    this.setEmbeddedEcardSessionData();
                }
            }
        });
        const recipientList = document.querySelector(".en__ecardrecipients__list");
        if (recipientList) {
            observer.observe(recipientList, { childList: true });
        }
        document.querySelectorAll(".en__ecarditems__thumb").forEach((el) => {
            // Making sure the session value is changed when this is clicked
            el.addEventListener("click", () => {
                ecardVariant.dispatchEvent(new Event("input"));
            });
        });
        window.addEventListener("message", (e) => {
            if (e.origin !== location.origin || !e.data.action)
                return;
            this.logger.log("Received post message", e.data);
            switch (e.data.action) {
                case "submit_form":
                    this.isSubmitting = true;
                    let embeddedEcardData = JSON.parse(sessionStorage.getItem("engrid-embedded-ecard") || "{}");
                    if (ecardVariant) {
                        ecardVariant.value = embeddedEcardData.formData["ecardVariant"];
                    }
                    if (ecardSendDate) {
                        ecardSendDate.value = embeddedEcardData.formData["ecardSendDate"];
                    }
                    if (ecardMessage) {
                        ecardMessage.value = embeddedEcardData.formData["ecardMessage"];
                    }
                    const addRecipientButton = document.querySelector(".en__ecarditems__addrecipient");
                    embeddedEcardData.formData.recipients.forEach((recipient) => {
                        recipientName.value = recipient.name;
                        recipientEmail.value = recipient.email;
                        addRecipientButton === null || addRecipientButton === void 0 ? void 0 : addRecipientButton.click();
                    });
                    const form = EnForm.getInstance();
                    form.submitForm();
                    sessionStorage.removeItem("engrid-embedded-ecard");
                    sessionStorage.removeItem("engrid-send-embedded-ecard");
                    break;
                case "set_recipient":
                    recipientName.value = e.data.name;
                    recipientEmail.value = e.data.email;
                    recipientName.dispatchEvent(new Event("input"));
                    recipientEmail.dispatchEvent(new Event("input"));
                    break;
            }
        });
        this.sendPostMessage("parent", "ecard_form_ready");
    }
    submitEcard() {
        var _a;
        const embeddedEcardData = JSON.parse(sessionStorage.getItem("engrid-embedded-ecard") || "{}");
        this.logger.log("Submitting ecard", embeddedEcardData);
        const iframe = this.createIframe(embeddedEcardData.pageUrl);
        (_a = document.querySelector(".body-main")) === null || _a === void 0 ? void 0 : _a.appendChild(iframe);
        window.addEventListener("message", (e) => {
            if (e.origin !== location.origin || !e.data.action)
                return;
            if (e.data.action === "ecard_form_ready") {
                this.sendPostMessage(iframe, "submit_form");
            }
        });
    }
    sendPostMessage(target, action, data = {}) {
        var _a;
        const message = Object.assign({ action }, data);
        if (target === "parent") {
            window.parent.postMessage(message, location.origin);
        }
        else {
            (_a = target.contentWindow) === null || _a === void 0 ? void 0 : _a.postMessage(message, location.origin);
        }
    }
}

;// CONCATENATED MODULE: ./node_modules/@4site/engrid-scripts/dist/us-only-form.js
/*
 * This class disables the country field and fixes the country to "United States"
 */

class UsOnlyForm {
    constructor() {
        if (!this.shouldRun())
            return;
        if (!document.querySelector(".en__field--country .en__field__notice")) {
            engrid_ENGrid.addHtml('<div class="en__field__notice"><em>Note: This action is limited to U.S. addresses.</em></div>', ".us-only-form .en__field--country .en__field__element", "after");
        }
        const countrySelect = engrid_ENGrid.getField("supporter.country");
        countrySelect.setAttribute("disabled", "disabled");
        let countryValue = "United States";
        if ([...countrySelect.options].some((o) => o.value === "US")) {
            countryValue = "US";
        }
        else if ([...countrySelect.options].some((o) => o.value === "USA")) {
            countryValue = "USA";
        }
        engrid_ENGrid.setFieldValue("supporter.country", countryValue);
        engrid_ENGrid.createHiddenInput("supporter.country", countryValue);
        countrySelect.addEventListener("change", () => {
            countrySelect.value = countryValue;
        });
    }
    shouldRun() {
        return !!document.querySelector(".en__component--formblock.us-only-form .en__field--country");
    }
}

;// CONCATENATED MODULE: ./node_modules/@4site/engrid-scripts/dist/thank-you-page-conditional-content.js

class ThankYouPageConditionalContent {
    constructor() {
        this.logger = new EngridLogger("ThankYouPageConditionalContent");
        if (!this.shouldRun())
            return;
        this.applyShowHideRadioCheckboxesState();
    }
    getShowHideRadioCheckboxesState() {
        var _a;
        try {
            const plainState = (_a = window.sessionStorage.getItem(`engrid_ShowHideRadioCheckboxesState`)) !== null && _a !== void 0 ? _a : "";
            return JSON.parse(plainState);
        }
        catch (err) {
            return [];
        }
    }
    applyShowHideRadioCheckboxesState() {
        const state = this.getShowHideRadioCheckboxesState();
        if (state) {
            state.forEach((item) => {
                this.logger.log("Processing TY page conditional content item:", item);
                if (engrid_ENGrid.getPageID() === item.page) {
                    document
                        .querySelectorAll(`[class*="${item.class}"]`)
                        .forEach((el) => {
                        el.classList.add("hide");
                    });
                    document
                        .querySelectorAll(`.${item.class}${item.value}`)
                        .forEach((el) => {
                        el.classList.remove("hide");
                    });
                }
            });
        }
        this.deleteShowHideRadioCheckboxesState();
    }
    deleteShowHideRadioCheckboxesState() {
        window.sessionStorage.removeItem(`engrid_ShowHideRadioCheckboxesState`);
    }
    shouldRun() {
        return engrid_ENGrid.getGiftProcess();
    }
}

;// CONCATENATED MODULE: ./node_modules/@4site/engrid-scripts/dist/version.js
const AppVersion = "0.19.1";

;// CONCATENATED MODULE: ./node_modules/@4site/engrid-scripts/dist/index.js
 // Runs first so it can change the DOM markup before any markup dependent code fires















































































// Events

// Version


;// CONCATENATED MODULE: ./src/scripts/main.js
const customScript = function () {
  console.log("ENGrid client scripts are executing");
  // Add your client scripts here

  App.setBodydata("client-js-loading", "finished");
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
  Debug: app_App.getUrlParameter("debug") == "true" ? true : false,
  onLoad: () => customScript(),
  onResize: () => console.log("Starter Theme Window Resized")
};
new app_App(options);
})();

/******/ })()
;