/*!
 * Copyright (c) 2012 Matias Meno <m@tias.me>
 * 
 * Original code (c) by Dustin Diaz 2012 - License MIT
 */


/**
 * Expose `domready`.
 */

module.exports = domready;


/**
 *
 * Cross browser implementation of the domready event
 *
 * @param {Function} ready - the callback to be invoked as soon as the dom is fully loaded.
 * @api public
 */

function domready(ready) {

  var fns = [], fn, testEl = document.documentElement, hack = testEl.doScroll,
      domContentLoaded = 'DOMContentLoaded', addEventListener = 'addEventListener',
      onreadystatechange = 'onreadystatechange', readyState = 'readyState',
      loaded = /^loade|c/.test(document[readyState]);
 
  function flush(f) {
    loaded = 1;
    while (f = fns.shift()) {
      f();
    }
  };

  document[addEventListener] && document[addEventListener](domContentLoaded, fn = function () {
    document.removeEventListener(domContentLoaded, fn, false)
    flush()
  }, false);


  hack && document.attachEvent(onreadystatechange, fn = function () {
    if (/^c/.test(document[readyState])) {
      document.detachEvent(onreadystatechange, fn);
      flush();
    }
  });

  return (ready = hack ?
    function (fn) {
      self != top ?
        loaded ? fn() : fns.push(fn) :
        function () {
          try {
            testEl.doScroll('left');
          } catch (e) {
            return setTimeout(function() { ready(fn); }, 50);
          }
          fn();
        }();
    } :
    function (fn) {
      loaded ? fn() : fns.push(fn);
    });

}