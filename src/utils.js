export var storage = {
  get: (k) => { 
    var v = localStorage.getItem(k);
    return v ? JSON.parse(localStorage.getItem(k)) : null; 
  },
  getAsync: (k) => {
    if('Response' in window)
      return new Response(localStorage.getItem(k)).then((res) => {return res.json()});
    else
      return new Promise((resolve) => {
        setTimeout(()=>{
          resolve(JSON.parse(localStorage.getItem(k)));
        });
      });
  },
  set: (k, v) => { 
    setTimeout(function(){
      localStorage.setItem(k, JSON.stringify(v)); });
  },
  remove: (k) => { return localStorage.removeItem(k); },
}

export function $http (opts) {
  return new Promise (function(resolve, reject){
    var xhr = new XMLHttpRequest();
    xhr.open(opts.method || 'GET', opts.url + '?' + opts.search.join('&'), true);
    xhr.addEventListener('readystatechange', function() {
      if(xhr.readyState === 4) {
        var d = JSON.parse(xhr.response);
        if(xhr.status >= 200 && xhr.status < 300) {
          if(d && d.error)
            reject(d);
          resolve(d);
        } else {
          reject(d || xhr.status);
        }
      }
    });
    xhr.send(opts.data);
  });
}

var _requestJsonpIndex = 0;
export function $jsonp (opts) {
  _requestJsonpIndex++;
  return new Promise ((resolve, reject) => {
    var requestIndex = _requestJsonpIndex;
    var s = document.createElement('script');
    s.async = true;
    s.src = opts.url + '?' + opts.search.join('&') + '&callback=__onJsonp10' + requestIndex;
    window['__onJsonp10' + requestIndex] = (d) => {
      // console.log(d);
      if (d && d.error) {
        let err = d.error;
        // console.error('jsonp: ', d);
        reject(d);
        // throw new Error(d);
        // if (err.error_code === 5)
        //   this.auth();
      } else {
        resolve(d.response || d);
      }
      delete window['__onJsonp10' + requestIndex];
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

export function $httpContentLength (url) {
  return new Promise(function(resolve, reject){
    var xhr = new XMLHttpRequest();
    xhr.open('HEAD', '/head/'+url);
    xhr.addEventListener('readystatechange', () => {
      if(xhr.readyState === 4) {
        resolve(xhr.getResponseHeader('Content-length'));
      }
    });
    xhr.send();
  });
}

export function audioBitrate (length, duration) {
  var br = ((length / duration) / 100)|0;
  if(br > 320) br = 320;
  else if (br > 256) br = 256;
  else if (br > 192) br = 192;
  else if (br > 128) br = 128;
  else if (br > 96) br = 96;
  else if (br > 96) br = 96;
  else if (br > 48) br = 48;
  else br = "<48"
  return br;
}

export function arrFind (arr, fn) {
  for(var i = 0, l = arr.length; i < l; i++) {
    if(fn(arr[i], i))
      return arr[i];
  }
  return false;
}

export function compareInLower (a, b) {
  if(!a || !b)
    return false;
  return a.toLowerCase() === b.toLowerCase();
}

export function asyncDoByChunk (arr, fn, size = 10, timeout = 0) {
  var chunksCount = ((arr.length / size)|0) + 1;
  for(var i = 0; i < chunksCount; i++) {
    (function(i) {
      setTimeout(() => {
        var remainsLength = Math.min((i+1)*size, arr.length);
        for(var k = i*size; k < remainsLength; k++) {
          fn(arr[k], k);
        }
      }, i*timeout);
    })(i);
  }
}