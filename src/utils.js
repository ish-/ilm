export var storage = {
  get: (k) => { return JSON.parse(localStorage.getItem(k)); },
  set: (k, v) => { return localStorage.setItem(k, JSON.stringify(v)); },
  remove: (k) => { return localStorage.removeItem(k); },
}

export function $http (opts) {

}

var _requestJsonpIndex = 0;
export function $jsonp (opts) {
  _requestJsonpIndex++;
  return new Promise ((resolve, reject) => {
    var requestIndex = _requestJsonpIndex;
    var s = document.createElement('script');
    s.src = opts.url + '?' + opts.search.join('&') + '&callback=__onJsonpVK' + requestIndex;
    window['__onJsonpVK' + requestIndex] = (d) => {
      if (d && d.error) {
        let err = d.error;
        console.error('jsonp: ', d);
        reject(d);
        // throw new Error(d);
        // if (err.error_code === 5)
        //   this.auth();
      } else {
        resolve(d.response || d);
      }
      delete window['__onJsonpVK' + requestIndex];
      document.body.removeChild(s);
    }
    s.onerror = (d) => {reject(d);}
    document.body.appendChild(s);
  });
}

export function throttle (fn, timeout, ctx) {
  var timer, args, needInvoke;
  return function(...args) {
    // args = arguments;
    needInvoke = true;
    ctx = ctx || this;

    if(!timer) {
      (function a() {
        if(needInvoke) {
          fn.apply(ctx, args);
          needInvoke = false;
          timer = setTimeout(a, timeout);
        }
        else {
          timer = null;
        }
      })();
    }
  };
}