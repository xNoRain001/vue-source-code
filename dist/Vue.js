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
        var _end = null; // 结束的地方肯定没有属性了，attr 为 false。要是 html.match(startTagClose)
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
    parseHTML(template);
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

  var isObject = function isObject(v) {
    return v !== null && _typeof(v) === 'object';
  };

  var isFunction = function isFunction(v) {
    return typeof v === 'function';
  };

  var isInstance = function isInstance(a, b) {
    return a instanceof b;
  };

  var arrayProto = Array.prototype;
  var arrayMethods = Object.create(arrayProto);
  var methods = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'];
  each(methods, function (_, method) {
    arrayMethods[method] = function () {
      var context = this;
      var original = arrayProto[method];

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var result = original.call.apply(original, [context].concat(args));
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

      context.__ob__.observeArray(inserted);

      return result;
    };
  });

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

  var Observer = /*#__PURE__*/function () {
    function Observer(v) {
      _classCallCheck(this, Observer);

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
  }(); // 实现响应式


  var defineReactive = function defineReactive(obj, key, val) {
    // 所有层次的对象的属性
    observe(val);
    Object.defineProperty(obj, key, {
      get: function get() {
        return val;
      },
      set: function set(newVal) {
        if (newVal !== val) {
          val = newVal;
          observe(newVal);
        }
      }
    });
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

  var initMethods = function initMethods(vm) {
    var methods = vm.$options.methods;

    for (var method in methods) {
      vm[method] = methods[method].bind(vm);
    }
  };

  var initState = function initState(vm) {
    var _vm$$options = vm.$options,
        data = _vm$$options.data,
        methods = _vm$$options.methods;
        _vm$$options.watch;
        _vm$$options.computed;

    if (data) {
      initData(vm);
    }

    if (methods) {
      initMethods(vm);
    }
  };

  var initMixin = function initMixin(Vue) {
    Vue.prototype._init = function () {
      var vm = this;
      var el = vm.$options.el;
      initState(vm);

      if (el) {
        this.$mount(el);
      }
    };

    Vue.prototype.$mount = function (el) {
      var vm = this;
      vm.$el = el = document.querySelector(el);
      var template = el.outerHTML; // HTML => render

      var render = compileToFunctions(template);
      vm.$options.render = render;
    };
  };

  var Vue = /*#__PURE__*/_createClass(function Vue() {
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Vue);

    this.$options = opts;

    this._init();
  });

  initMixin(Vue); // _init、$mount

  return Vue;

}));
