(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
})(this, (function () { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
      return typeof obj;
    } : function (obj) {
      return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    }, _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", {
      writable: false
    });
    return Constructor;
  }

  var proxy = function proxy(vm, soureKey, key) {
    Object.defineProperty(vm, key, {
      get: function get() {
        // 保证总是获取到最新的
        return vm[soureKey][key];
      },
      set: function set(newVal) {
        vm[soureKey][key] = newVal;
      }
    });
  };

  var has = function has(target, prop) {
    return target.hasOwnProperty(prop);
  };

  var def = function def(obj, key, val, enumerable) {
    Object.defineProperty(obj, key, {
      value: val,
      enumerable: !!enumerable,
      writable: true,
      configurable: true
    });
  };

  var isArray = function isArray(v) {
    return Array.isArray(v);
  };

  var isPlainObject = function isPlainObject(v) {
    return Object.prototype.toString.call(v).slice(8, -1) === 'Object';
  };

  var keys = function keys(target) {
    if (isArray(target)) {
      return Object.keys(target);
    } else if (isPlainObject(target)) {
      return Object.getOwnPropertySymbols(target).concat(Object.keys(target));
    }
  };

  var each = function each(target, fn) {
    var _keys = keys(target);

    for (var i = 0, l = _keys.length; i < l; i++) {
      var key = _keys[i];
      fn.call(target, key, target[key]);
    }
  };

  var noop = function noop() {};

  var isDef = function isDef(v) {
    return v != null;
  };

  var isUndef = function isUndef(v) {
    return v == null;
  };

  var isString = function isString(v) {
    return typeof v === 'string';
  };

  var isObject = function isObject(v) {
    return v !== null && _typeof(v) === 'object';
  };

  var callbacks = [];
  var pending = false;

  var timerFunc = function timerFunc() {
    Promise.resolve().then(flushCallbacks);
  };

  var flushCallbacks = function flushCallbacks() {
    each(callbacks, function (_, cb) {
      cb();
    });
    resetState$1();
  };

  var nextTick = function nextTick(cb) {
    callbacks.push(cb);

    if (!pending) {
      timerFunc();
      pending = true;
    }
  };

  var resetState$1 = function resetState() {
    callbacks = [];
    pending = true;
  };

  var isFunction = function isFunction(v) {
    return typeof v === 'function';
  };

  var isInstance = function isInstance(a, b) {
    return a instanceof b;
  };

  var id$1 = 1;

  var Dep = /*#__PURE__*/function () {
    function Dep() {
      _classCallCheck(this, Dep);

      this.id = id$1++;
      this.subs = [];
    }

    _createClass(Dep, [{
      key: "addSub",
      value: function addSub(watcher) {
        this.subs.push(watcher);
      }
    }, {
      key: "depend",
      value: function depend() {
        Dep.target.addDep(this);
      }
    }, {
      key: "notify",
      value: function notify() {
        each(this.subs, function (_, watcher) {
          watcher.update();
        });
      }
    }]);

    return Dep;
  }();

  var arrayProto = Array.prototype;
  var arrayMethods = Object.create(arrayProto);
  var methods = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'];
  each(methods, function (_, method) {
    arrayMethods[method] = function () {
      var ob = this.__ob__;
      var original = arrayProto[method];

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var result = original.call.apply(original, [this].concat(args));
      var inserted = null;

      switch (method) {
        case 'push':
        case 'unshift':
          {
            inserted = args;
            break;
          }

        case 'splice':
          {
            inserted = args.splice(2);
            break;
          }
      }

      ob.observeArray(inserted);
      ob.dep.notify();
      return result;
    };
  });

  var dependArray = function dependArray(val) {
    each(val, function (_, v) {
      var ob = null;

      if (v && (ob = v.__ob__)) {
        ob.dep.depend();
      }

      if (isArray(v)) {
        dependArray(v);
      }
    });
  };

  var defineReactive = function defineReactive(obj, key, val) {
    var dep = new Dep(); // 所有层次的对象的属性

    var childOb = observe(val);
    Object.defineProperty(obj, key, {
      get: function get() {
        if (Dep.target) {
          dep.depend();

          if (childOb) {
            childOb.dep.depend();

            if (isArray(val)) {
              dependArray(val);
            }
          }
        }

        return val;
      },
      set: function set(newVal) {
        if (newVal !== val) {
          val = newVal;
          dep.notify();
          observe(newVal);
        }
      }
    });
  };

  var Observer = /*#__PURE__*/function () {
    function Observer(v) {
      _classCallCheck(this, Observer);

      this.dep = new Dep();
      def(v, '__ob__', this);

      if (isArray(v)) {
        // 劫持
        v.__proto__ = arrayMethods;
        this.observeArray(v);
      } else {
        each(v, function (key, val) {
          defineReactive(v, key, val);
        });
      }

      return this;
    }

    _createClass(Observer, [{
      key: "observeArray",
      value: function observeArray(v) {
        each(v, function (_, val) {
          observe(val);
        });
      }
    }]);

    return Observer;
  }();

  var observe = function observe(v) {
    // 原始值不用处理
    if (!isObject(v)) {
      return;
    }

    var ob = null; // 只是不想 ob = v.__ob__，这样就访问两次这个属性了。

    var _ob = null;

    if (has(v, '__ob__') && isInstance(_ob = v.__ob__, Observer)) {
      ob = _ob;
    } else if (isArray(v) || isPlainObject(v)) {
      ob = new Observer(v);
    }

    return ob;
  };

  var initData = function initData(vm) {
    var data = vm.$options.data;
    vm._data = data = isFunction(data) ? data.call(vm) : data || {}; // data 必须是纯对象

    if (!isPlainObject) {
      data = {};
    } // data / vm._data 的每个属性代理到 vm 上


    each(data, function (key) {
      proxy(vm, '_data', key);
    }); // data 响应式

    observe(data);
  };

  var initMethods = function initMethods(vm) {
    var methods = vm.$options.methods;

    for (var method in methods) {
      vm[method] = methods[method].bind(vm);
    }
  };

  var createWatcher = function createWatcher(vm, expOrFn, handler) {
    var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

    if (isPlainObject(handler)) {
      options = handler;
      handler = handler.handler;
    }

    if (isString(handler)) {
      handler = vm[handler];
    }

    return vm.$watch(expOrFn, handler, options);
  };

  var initWatch = function initWatch(vm) {
    var watch = vm.$options.watch;
    each(watch, function (key, handler) {
      if (isArray(handler)) {
        each(handler, function (_, h) {
          createWatcher(vm, key, h);
        });
      } else {
        createWatcher(vm, key, handler);
      }
    });
  };

  var set = new Set();

  var traverse = function traverse(val) {
    _traverse(val, set);

    set.clear();
  };

  var _traverse = function _traverse(val, set) {
    if (!isObject(val)) {
      return;
    }

    var ob = val.__ob__;

    if (ob) {
      var id = ob.dep.id;

      if (set.has(id)) {
        return;
      }

      set.add(id);
    }

    if (isArray(val)) {
      each(val, function (_, v) {
        traverse(v);
      });
    }

    if (isPlainObject(val)) {
      each(val, function (_, v) {
        traverse(v);
      });
    }
  };

  var parsePath = function parsePath(path) {
    var segments = path.split('.');
    return function (vm) {
      each(segments, function (_, key) {
        vm = vm[key];
      });
      return vm;
    };
  };

  var wathcerIds = new Set();
  var queue = [];
  var waiting = false;

  var queueWatcher = function queueWatcher(watcher) {
    var id = watcher.id;

    if (!wathcerIds.has(id)) {
      wathcerIds.add(id);
      queue.push(watcher);
    }

    if (!waiting) {
      nextTick(flushSchedulerQueue);
      waiting = true;
    }
  };

  var flushSchedulerQueue = function flushSchedulerQueue() {
    each(queue, function (_, watcher) {
      watcher.run();
    });
    resetState();
  };

  var resetState = function resetState() {
    wathcerIds = new Set();
    queue = [];
    waiting = false;
  };

  var stack = [];

  var pushTarget = function pushTarget(target) {
    Dep.target = target;
    stack.push(target);
  };

  var popTarget = function popTarget() {
    stack.pop();
    Dep.target = stack[stack.length - 1];
  };

  var id = 1;

  var Watcher = /*#__PURE__*/function () {
    function Watcher(vm, expOrFn, cb, options) {
      _classCallCheck(this, Watcher);

      if (options) {
        this.user = !!options.user;
        this.sync = !!options.sync;
        this.deep = !!options.deep;
        this.lazy = !!options.lazy;
      } else {
        this.user = this.sync = this.depp = this.lazy = false;
      }

      this.id = id++;
      this.vm = vm;
      this.cb = cb; // user watcher's handler

      this.dirty = this.lazy; // for computed watcher

      this.deps = [];
      this.depIds = new Set();

      if (isFunction(expOrFn)) {
        this.getter = expOrFn;
      } else {
        this.getter = parsePath(expOrFn);
      }

      this.value = this.lazy ? undefined : this.get();
    }

    _createClass(Watcher, [{
      key: "get",
      value: function get() {
        pushTarget(this);
        var vm = this.vm;
        var value = this.getter.call(vm, vm);

        if (this.deep) {
          traverse(value);
        }

        popTarget();
        return value;
      }
    }, {
      key: "update",
      value: function update() {
        if (this.sync) {
          this.run();
        } else if (this.lazy) {
          this.dirty = true;
        } else {
          queueWatcher(this);
        }
      }
    }, {
      key: "run",
      value: function run() {
        var oldVal = this.value;
        var newVal = this.value = this.get();

        if (this.user) {
          this.cb.call(vm, newVal, oldVal);
        }
      }
    }, {
      key: "evaluate",
      value: function evaluate() {
        this.value = this.get();
        this.dirty = false;
      }
    }, {
      key: "addDep",
      value: function addDep(dep) {
        var id = dep.id;

        if (!this.depIds.has(id)) {
          this.deps.push(dep);
          this.depIds.add(id);
          dep.addSub(this);
        }
      }
    }, {
      key: "depend",
      value: function depend() {
        each(this.deps, function (_, dep) {
          dep.depend();
        });
      }
    }]);

    return Watcher;
  }();

  var createComputedGetter = function createComputedGetter(key) {
    return function () {
      var vm = this;
      var watcher = vm._computedWatchers[key];

      if (watcher.dirty) {
        watcher.evaluate();
      }

      if (Dep.target) {
        watcher.depend();
      }

      return watcher.value;
    };
  };

  var propertyDefinition = {};

  var defineComputed = function defineComputed(vm, key, userDef) {
    if (isFunction(userDef)) {
      propertyDefinition.get = createComputedGetter(key);
      propertyDefinition.set = noop;
    } else {
      propertyDefinition.get = userDef.getter;
      propertyDefinition.set = userDef.set || noop;
    }

    Object.defineProperty(vm, key, propertyDefinition);
  };

  var computedWatcherOptions = {
    lazy: true
  };

  var initComputed = function initComputed(vm) {
    var watchers = vm._computedWatchers = Object.create(null);
    var computed = vm.$options.computed;
    each(computed, function (key, userDef) {
      var getter = isFunction(userDef) ? userDef : userDef.getter;
      watchers[key] = new Watcher(vm, getter, noop, computedWatcherOptions);
      defineComputed(vm, key, userDef);
    });
  };

  var initState = function initState(vm) {
    var _vm$$options = vm.$options,
        data = _vm$$options.data,
        methods = _vm$$options.methods,
        watch = _vm$$options.watch,
        computed = _vm$$options.computed;

    if (data) {
      initData(vm);
    }

    if (methods) {
      initMethods(vm);
    }

    if (watch) {
      initWatch(vm);
    }

    if (computed) {
      initComputed(vm);
    }
  };

  var createText = function createText(text) {
    return document.createTextNode(text);
  };

  var createElement = function createElement(tag) {
    return document.createElement(tag);
  };

  var createElm = function createElm(vnode) {
    var tag = vnode.tag,
        text = vnode.text;
        vnode.data;
        var children = vnode.children;
    var elm = null;

    if (isDef(tag)) {
      // element
      elm = vnode.elm = createElement(tag);
      each(children, function (_, child) {
        elm.appendChild(createElm(child));
      });
    } else {
      // text
      elm = vnode.elm = createText(text);
    }

    return elm;
  };

  var sameVnode = function sameVnode(a, b) {
    return a.tag === b.tag && a.key === b.key;
  };

  var findIdxInOld = function findIdxInOld(ch, startIdx, endIdx, vnode) {
    for (var i = startIdx; i <= endIdx; i++) {
      var c = ch[i];

      if (isDef(c) && sameVnode(c, vnode)) {
        return i;
      }
    }
  };

  var createKeyToOldIdx = function createKeyToOldIdx(ch, startIdx, endIdx) {
    var map = {};

    for (var i = startIdx; i <= endIdx; i++) {
      var c = ch[i];

      if (isDef(c) && isDef(c.key)) {
        map[key] = i;
      }
    }

    return map;
  };

  var updateChildren = function updateChildren(parentElm, oldCh, ch) {
    var oldStartIdx = 0;
    var oldEndIdx = oldCh.length - 1;
    var oldStartVnode = oldCh[0];
    var oldEndVnode = oldCh[oldEndIdx];
    var newStartIdx = 0;
    var newEndIdx = ch.length - 1;
    var newStartVnode = ch[0];
    var newEndVnode = ch[newEndIdx];
    var oldKeyToIdx = null;
    var idxInOld = null;
    var vnodeToMove = null;

    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
      if (isUndef(oldStartVnode)) {
        oldEndVnode = oldCh[++oldStartIdx];
      } else if (isUndef(oldEndVnode)) {
        oldEndVnode = oldCh[--oldEndIdx];
      } else if (sameVnode(oldStartVnode, newStartVnode)) {
        patchVnode(oldStartVnode, newStartVnode);
        oldStartVnode = oldCh[++oldStartIdx];
        newStartVnode = ch[++newStartIdx];
      } else if (sameVnode(oldEndVnode, newEndVnode)) {
        patchVnode(oldEndVnode, newEndVnode);
        oldEndVnode = oldCh[--oldEndIdx];
        newEndVnode = ch[--newEndIdx];
      } else if (sameVnode(oldStartVnode, newEndVnode)) {
        patchVnode(oldStartVnode, newEndVnode);
        oldStartVnode = oldCh[++oldStartIdx];
        newEndVnode = ch[--newEndIdx];
      } else if (sameVnode(oldEndVnode, newStartVnode)) {
        patchVnode(oldEndVnode, newStartVnode);
        oldEndVnode = oldCh[--oldEndIdx];
        newStartVnode = ch[++newStartIdx];
      } else {
        if (isUndef(oldKeyToIdx)) {
          oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
        }

        var _newStartVnode = newStartVnode,
            key = _newStartVnode.key;
        idxInOld = isDef(key) ? oldKeyToIdx[key] : findIdxInOld(oldCh, oldStartIdx, oldEndIdx, newStartVnode);

        if (isDef(idxInOld)) {
          vnodeToMove = oldCh[idxInOld];

          if (sameVnode(vnodeToMove, newStartVnode)) {
            patchVnode(vnodeToMove, newStartVnode);
          }

          oldCh[idxInOld] = undefined;
          parentElm.insertBefote(vnodeToMove.elm, oldStartVnode.elm);
        } else {
          parentElm.insertBefote(createElm(newStartVnode), oldStartVnode.elm);
        }

        newStartVnode = ch[++newStartIdx];
      }
    }

    if (oldStartIdx > oldEndIdx) {
      var refElm = isDef(ch[newEndIdx + 1]) ? ch[newEndIdx + 1].elm : null;

      for (var i = newStartIdx; i <= newEndIdx; i++) {
        parentElm.insertBefote(createElm(ch[i]), refElm);
      }
    } else if (newStartIdx > newEndIdx) {
      for (var _i = oldStartIdx; _i <= oldEndIdx; _i++) {
        if (isDef(oldCh[_i])) {
          parentElm.removeChild(oldCh[_i].elm);
        }
      }
    }
  };

  var patchVnode = function patchVnode(oldVnode, vnode) {
    var elm = vnode.elm = oldVnode.elm; // text

    if (oldVnode.text && oldVnode.text !== vnode.text) {
      elm.textContent = vnode.text;
    } // element
    else {
      var oldCh = oldVnode.children;
      var ch = vnode.children;

      if (isDef(oldCh) && isDef(ch) && oldCh !== ch) {
        updateChildren(elm, oldCh, ch);
      } else if (isDef(oldCh)) {
        elm.innerHTML = '';
      } else if (isDef(ch)) {
        each(ch, function (_, c) {
          elm.appendChild(createElm(c));
        });
      }
    }
  };

  var patch = function patch(oldVnode, vnode) {
    if (isUndef(oldVnode)) {
      // render component
      return;
    }

    if (isDef(oldVnode.nodeType)) {
      // init render
      var elm = createElm(vnode);
      var body = oldVnode.parentNode;
      body.insertBefore(elm, oldVnode.nextSibling);
      body.removeChild(oldVnode);
      return elm;
    } else if (sameVnode(oldVnode, vnode)) {
      // diff
      patchVnode(oldVnode, vnode);
    }
  };

  var createVnode = function createVnode(tag, data, children, text, key, elm) {
    if (isArray(data)) {
      children = data;
      data = '';
    }

    return {
      tag: tag,
      data: data,
      children: children,
      text: text,
      key: key,
      elm: elm
    };
  };

  var createTextVnode = function createTextVnode(text) {
    return createVnode(undefined, undefined, undefined, text);
  };

  var createElementVnode = function createElementVnode(tag, data, children) {
    return createVnode(tag, data, children);
  };

  var _c = function _c(tag, data, children) {
    return createElementVnode(tag, data, children);
  };

  var _v = function _v(text) {
    return createTextVnode(text);
  };

  var _s = function _s(val) {
    return isObject(val) ? JSON.stringify(val) : val;
  };

  var _init = function _init() {
    var vm = this;
    var el = vm.$options.el;
    initState(vm);

    if (el) {
      this.$mount(el);
    }
  };

  var genProps = function genProps(attrs) {
    var staticStyle = '';
    var staticAttrs = '';
    each(attrs, function (_, prop) {
      var name = prop.name,
          value = prop.value;

      if (name === 'style') {
        value.replace(/\s*([^;:]+)\:\s*([^;:]+)/g, function (_, $1, $2) {
          staticStyle += "\"".concat($1, "\":\"").concat($2, "\",");
        });
      } else {
        staticAttrs += "\"".concat(name, "\":\"").concat(value, "\",");
      }
    });
    staticStyle = staticStyle.slice(0, -1);
    staticAttrs = staticAttrs.slice(0, -1);

    if (staticStyle && staticAttrs) {
      return "{attrs:{".concat(staticAttrs, "},staticStyle:{").concat(staticStyle, "}}");
    } else if (staticStyle) {
      return "{staticStyle:{".concat(staticStyle, "}}");
    } else {
      return '';
    }
  };

  var genElement = function genElement(ast) {
    return generate(ast);
  };

  // {{}}
  var defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;

  var genText = function genText(ast) {
    var text = ast.text;

    if (!defaultTagRE.test(text)) {
      return "_v(".concat(JSON.stringify(text), ")");
    }

    defaultTagRE.lastIndex = 0;
    var token = [];
    var lastIndex = 0;
    var index = 0;
    var matched = null;
    var tokenVal = null;

    while (matched = defaultTagRE.exec(text)) {
      index = matched.index; // {

      tokenVal = text.slice(lastIndex, index);

      if (tokenVal) {
        token.push(JSON.stringify(tokenVal));
      }

      tokenVal = matched[1].trim();

      if (tokenVal) {
        token.push("_s(".concat(tokenVal, ")"));
      }

      lastIndex = index + matched[0].length;
    }

    if (lastIndex < text.length) {
      token.push(JSON.stringify(text.slice(lastIndex)));
    }

    return "_v(".concat(token.join('+'), ")");
  };

  var genNode = function genNode(ast) {
    if (ast.type === 1) {
      return genElement(ast);
    } else {
      return genText(ast);
    }
  };

  var genChildren = function genChildren(children) {
    var childrenCode = '';
    each(children, function (_, child) {
      childrenCode += "".concat(genNode(child), ",");
    });
    return "[".concat(childrenCode.slice(0, -1), "]");
  };

  var generate = function generate(ast) {
    var tag = ast.tag,
        attrs = ast.attrs,
        children = ast.children;
    var data = '';
    var childrenCode = '';

    if (attrs) {
      data = genProps(attrs);
    }

    if (children.length) {
      childrenCode = genChildren(children);
    }

    if (data && childrenCode) {
      return "_c(\"".concat(tag, "\",").concat(data, ",").concat(childrenCode, ")");
    } else if (data) {
      return "_c(\"".concat(tag, "\",").concat(data, ")");
    } else if (childrenCode) {
      return "_c(\"".concat(tag, "\",").concat(childrenCode, ")");
    } else {
      return "_c(\"".concat(tag, "\")");
    }
  };

  // 标签名
  var ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z]*"; // 标签名或带命名空间的标签名 div div:xxx

  var qnameCapture = "((?:" + ncname + "\\:)?" + ncname + ")"; // 开始标签 div 

  var startTagOpen = new RegExp("^<" + qnameCapture); // 开始标签的闭合 > 或 />

  var startTagClose = /^\s*(\/?)>/; // 结束标签 div

  var endTag = new RegExp("^<\\/" + qnameCapture + "[^>]*>"); // 属性

  var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;

  var parseHTML = function parseHTML(html) {
    var advance = function advance(n) {
      html = html.substring(n);
    };

    var parseStartTag = function parseStartTag() {
      var matched = html.match(startTagOpen);

      if (matched) {
        var match = {
          tagName: matched[1],
          attrs: []
        };
        advance(matched[0].length);
        var attr = null;
        var _end = null; // 结束的地方肯定没有属性了，attr 为 false，要是 html.match(startTagClose)
        // 在后面不会执行。

        while (!(_end = html.match(startTagClose)) && (attr = html.match(attribute))) {
          match.attrs.push({
            name: attr[1],
            value: attr[3]
          });
          advance(attr[0].length);
        }

        advance(_end[0].length);
        return match;
      }
    };

    var start = function start(match) {
      var ast = createASTElement(match);

      if (!root) {
        root = ast;
        stack.push(ast);
      } else {
        parent = stack[stack.length - 1];
        ast.parent = parent;
        parent.children.push(ast);
        stack.push(ast);
      }
    };

    var end = function end() {
      stack.pop();
    };

    var chars = function chars(text) {
      text = text.trim();

      if (text) {
        parent = stack[stack.length - 1];
        parent.children.push({
          type: 3,
          text: text
        });
      }
    };

    var createASTElement = function createASTElement(match) {
      return {
        type: 1,
        tag: match.tagName,
        attrs: match.attrs,
        children: [],
        parent: undefined
      };
    };

    var stack = [];
    var root = null;

    while (html) {
      var textEnd = html.indexOf('<');

      if (textEnd === 0) {
        var startMatched = parseStartTag();

        if (startMatched) {
          start(startMatched);
          continue;
        }

        var endMatched = html.match(endTag);

        if (endMatched) {
          end();
          advance(endMatched[0].length);
          continue;
        }
      }

      if (textEnd > 0) {
        var text = html.slice(0, textEnd);
        chars(text);
        advance(textEnd);
      }
    }

    return root;
  };

  var compileToFunctions = function compileToFunctions(template) {
    var ast = parseHTML(template);
    var code = generate(ast);
    return new Function("with (this) { return ".concat(code, " }"));
  };

  var $mount = function $mount(el) {
    var vm = this;
    vm.$el = el = document.querySelector(el);
    var template = el.outerHTML; // HTML => render

    var render = compileToFunctions(template);
    vm.$options.render = render;
    mountComponent(vm);
  };

  var mountComponent = function mountComponent(vm) {
    var updateComponent = function updateComponent() {
      vm._update(vm._render());
    };

    new Watcher(vm, updateComponent, noop);
  };

  var $watch = function $watch(expOrFn, handler, options) {
    var vm = this;
    options.user = true;

    var _Watcher = new Watcher(vm, expOrFn, handler, options),
        value = _Watcher.value;

    if (options.immediate) {
      handler.call(vm, value);
    }
  };

  var _update = function _update(vnode) {
    var vm = this;
    var prevVnode = vm._vnode;
    vm._vnode = vnode;

    if (!prevVnode) {
      vm.$el = patch(vm.$el, vnode);
    } else {
      vm.$el = patch(prevVnode, vnode);
    }
  };

  var _render = function _render() {
    var vm = this;
    var render = vm.$options.render;
    return render.call(vm); // Vnode
  };

  var initProto = function initProto(Vue) {
    Vue.prototype._c = _c;
    Vue.prototype._v = _v;
    Vue.prototype._s = _s;
    Vue.prototype._init = _init;
    Vue.prototype.$mount = $mount;
    Vue.prototype.$watch = $watch;
    Vue.prototype._update = _update;
    Vue.prototype._render = _render;
  };

  var Vue = /*#__PURE__*/_createClass(function Vue() {
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Vue);

    this.$options = opts;

    this._init();
  });

  initProto(Vue);

  return Vue;

}));
