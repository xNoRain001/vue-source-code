(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
})(this, (function () { 'use strict';

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

  var isArrat = function isArrat(v) {
    return Array.isArray(v);
  };

  var isPlainObject = function isPlainObject(v) {
    return Object.prototype.toString.call(v).slice(8, -1) === 'Object';
  };

  var keys = function keys(target) {
    if (isArrat(target)) {
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

  var isFunction = function isFunction(v) {
    return typeof v === 'function';
  };

  var initData = function initData(vm) {
    var data = vm.$options.data;
    vm._data = data = isFunction(data) ? data.call(vm) : data || {}; // data 必须是纯对象

    if (!isPlainObject) {
      data = {};
    } // data / vm._data 的每个属性代理到 vm 上


    each(data, function (key) {
      proxy(vm, '_data', key);
    });
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

  var Vue = /*#__PURE__*/_createClass(function Vue() {
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Vue);

    this.$options = opts;
    initState(this);
  });

  return Vue;

}));
