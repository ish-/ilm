import {compareInLower, $jsonp, $http, storage, arrFind} from './utils';
import player from './player.service';
import alerts from './alerts.service';


const ALERT_TYPE = 'VK Service';
const ALERT_TYPE_SERVER = 'Our VK Bitrate Detection Service';
const POST_ATTACHMENT_TYPE = {
  AUDIO: 'audio',
  PHOTO: 'photo'
}

var ACCESS_TOKEN;

class VK {
  constructor () {
    this.userId = 0;
    this.authed = false;
    this.serverAuthed = false;

    ACCESS_TOKEN = storage.get('vk-token');
    if(!ACCESS_TOKEN && location.hash) {
      let hash = location.hash.slice(1).split('&').reduce(function(mem, str){
        let _str = str.split('=');
        mem[_str[0]] = _str[1];
        return mem;
      }, {});
      hash['access_token'] && (ACCESS_TOKEN = hash['access_token']);
      storage.set('vk-token', ACCESS_TOKEN);
      storage.set('vk-userId', this.userId = +hash['user_id']);
    } else {
      this.userId = +storage.get('vk-userId');
    }
    this.authed = !!ACCESS_TOKEN;
    // this.openAuth();
  }

  openAuth () {
    var opts = {
      url: "https://login.vk.com/",
      search: ["act=openapi", "oauth=1", "aid=3430394", "location=ilm.dev", "new=1"],
    };
    $jsonp(opts).then(d => console.log(d));
  }

  removeAuth () {
    this.authed = false;
    storage.remove('vk-token');
    storage.remove('vk-userId');
  }

  auth () {
    location.href = 'https://oauth.vk.com/authorize?client_id=3430394&redirect_uri='+encodeURIComponent(location.href)+'&display=popup&response_type=token&scope=wall,audio,groups,friends';
  }

  _request (opts) {
    if(!this.authed) {
      alerts.add({type: ALERT_TYPE, text: 'You\'re not authenticated'})
      return Promise.reject(new Error('no auth'));
    }
    opts.search = ['access_token=' + ACCESS_TOKEN, 'v=5.42'];
    if (opts.data) {
      for(let key in opts.data) {
        opts.search.push(`${key}=${opts.data[key]}`);
      }
    }
    opts.url = 'https://api.vk.com/method/' + opts.url;
    return $jsonp(opts).catch((d) => {
      if(d && d.error && d.error.error_code === 5) {
        alerts.add({type: ALERT_TYPE, text: 'Authentication failed. Please relogin in vk.com'})
        this.removeAuth();
      }
    });
  }

  getGroups (userId) {
    return this._request({
      url: 'groups.get',
      data: {
        user_id: userId,
        extended: 1,
      }
    })
  }

  getGroup (groupId) {
    return this._request({
      url: 'groups.getById',
      data: {
        group_id: groupId,
        extended: 1,
      }
    }).then(d => {
      return d.length === 1 ? d[0] : d;
    });
  }

  getFriends (userId) {
    return this._request({
      url: 'friends.get',
      data: {
        user_id: userId || this.userId,
        order: 'hints',
        fields: 'photo_100',
      }
    }).then(d => {
      return d.items.filter(friend => !friend.deactivated);
    });
  }

  // getMoreAudios (ownerId, items) {
  //   if(items.$loading)
  //     return;
  //   items.$loading = true;
  //   return this.getAudios(ownerId, items.length).then((d) => {
  //     items.$loading = false;
  //     items.push(...d.items);
  //     return items;
  //   });
  // }

  // getAudiosResource (ownerId) {
  //   return this.getAudios(ownerId).then(({count, items}) => {
  //     items.$count = count;
  //     items.$more = () => this.getMoreAudios.call(this, ownerId, items);
  //     // items.forEach((d) => d.$$dontObserve = true);
  //     items.$$dontObserve = true;
  //     return items;
  //   });
  // }

  // setBitrate (audios) {}
  serverAuth = () => {
    var listener = storage.addEventListener('auth:server', () => {
      that.serverAuthed = true;
      listener();
      w.close();
    });
    var w = window.open('https://oauth.vk.com/authorize?client_id=3430394&display=page&redirect_uri=http://ilm.dev/api/auth/&scope=friends,offline,audio&response_type=code&v=5.44');
  };

  getAudiosContentLength (audios) { // string[] : ${owner_id}_${id}
    return $http({
      method: 'POST',
      url: '/api/audio/content-length',
      data: audios,
    }).catch((d) => {
      alerts.add({type: ALERT_TYPE_SERVER, text: 'Authentication failed.'});
    });
  }

  // setBitrate (audioInfo) {
  //   retur(audioInfo.url).then((length) => {
  //     audioInfo.$bitrate = audioBitrate(length, audioInfo.duration);
  //     return audioInfo;
  //   });
  // }

  async findBestQualityAudio (arr, artist, title) {

    var exact = [];
    arr.forEach((a, i) => {
      var isArtist;
      a.$weight = 0;
      a.$weight += (isArtist = compareInLower(a.artist, artist)) && 2;
      a.$weight += isArtist && compareInLower(a.title, title) && 3;
      if(a.$weight === 5)
        return exact.push(i);
      a.$weight += a.title.startsWith(title) && 2;
      a.$weight += a.title.endsWith(title) && 1;
    });
    if(exact.length) {
      // exact.reverse();
      // var exactPromiseAll = 
      // console.log(exact, arr.length)
      var _d = Date.now();
      var exactBitrates = await player.setBitrate(exact.map(i => arr[i]));
        // .then((i) => {console.log(i); return i});
      // console.log(Date.now() - _d);
      var exactFind = arrFind(exactBitrates, (a) => a.$bitrate > 300);
      // console.log(exactFind);
    }

    arr.sort((a, b) => {
      return a.$weight+(a.$bitrate||0)/100 < b.$weight + (b.$bitrate||0)/100 ? 1 : -1;
    });
    return arr;
  }

  searchAudios (q, count = 30) {
    if(q.artist && q.title) {
      q = q.artist + ' ' + q.title
    }
    return this._request({url: 'audio.search', data: {
      q, search_own: 1, sort: 2,
      count
    }}).then(({count, items}) => items);
  }

  getAudios (ownerId, _items, dropCache) {
    var req;
    var ownerIsUser = !ownerId || +ownerId === this.userId;
    if (ownerIsUser && !dropCache) {
      var userCachedAudios = storage.get('user-cached-audios');
      if(userCachedAudios && userCachedAudios.length)
        return Promise.resolve(userCachedAudios);
    }

    var offset = _items && _items.length ? _items.length : 0;
    // if (force || !(cache = storage.get('vk-user-audio-cache'))) {

    if(_items && _items.$loading || _items >= 10000)
      return;

    req = this._request({url: 'audio.get', data: {
      owner_id: (ownerId || this.userId), 
      count: ownerIsUser ? 10000 : 200, 
      offset: offset,
    }}).then(({count, items}) => {
      // items.forEach(item => item = Object.create(item));
      items.$count = count;
      return items;
    });
    // req.then((d) => {
    //   d.items.forEach((d) => d.$$dontObserve = true);
    // });

    if(_items && !_items.$loading && _items.length) {
      _items.$loading = true;
      return req.then((items) => {
        _items.$count = items.count;
        _items.push.apply(_items, items);
        _items.$loading = false;
        return _items;
      });
    }

    if(ownerIsUser) {
      req.then((items) => {
        setTimeout(()=>{
          storage.set('user-cached-audios', items);
        }, 1000);
      });
    }
      // req.then((d) => {
      //   storage.set('vk-user-audio-cache', d);
      //   return d;
      // });
    // }
    return req;
  }

  getUsers (usersId) {
    return this._request({
      url: 'users.get',
      data: {
        user_ids: usersId,
        fields: 'counters,photo_100'
      }
    }).then((d) => {
      return d.length === 1 ? d[0] : d;
    })
  }

  // getWall (userId, _items) {
  //   if(_items.$loading)
  //     return;
  //   return this._getWall(userId, offset);
  // }

  _processWallPosts (d) {
    var profiles = d.profiles.reduce((mem, profile)=>{
      mem[profile.id] = profile;
      return mem;
    }, {});
    var groups = d.groups.reduce((mem, group)=>{
      mem['-' + group.id] = group;
      return mem;
    }, {});
    var items = d.items.filter((post)=>{
      if (this.setPostContent(post)) {
        post.$owner = profiles[post.owner_id] || groups[post.owner_id];
        if (post.copy_history) {
          var reposted = post.copy_history[0];
          reposted.$owner = profiles[reposted.owner_id] || groups[reposted.owner_id];
        }
        return true;
      } else
        return false;
    });
    items.$count = d.count;
    return items;
  }

  getWall (userId, _items, length = 0) {
    var count = 15;
    var isArray = _items && _items.length != null;
    if(isArray && (_items.$loading || _items.$count <= _items.$offset))
      return;

    var offset = (isArray ? _items.$offset : +_items) || 0;

    var opts = {url: 'wall.get', data: {owner_id: (userId || this.userId), count, extended: 1, offset}};
    var req = this._request(opts)
      .then((d) => this._processWallPosts(d))
      .then((items) =>  {
        length += items.length;
        items.$offset = offset+count;
        // console.log(offset, d.count, length);
        if(length < 7 && count + offset < items.$count) {
          items.$loading = true;
          return new Promise((resolve) => {
            setTimeout(() => {
              this._getWall(userId, offset + count, length).then((_nextItems) => {
                items.push.apply(items, _nextItems);
                items.$loading = false;
                resolve(items);
              }, 500);
            })
          })
        }
        return items;
      });

    if (isArray && _items.length) {
      return req.then((items) => {
        _items.push.apply(_items, items);
        _items.$offset = items.$offset;
        _items.$count = items.$count;
        return _items;
      });
    }
    return req;
  }
  setPostContent (post) { // every post set recursively $images[] and $audios[] or false;
    if (post.attachments && post.attachments.length) {
      var anyAudio = false;
      let content = post.attachments.filter((d) => { 
        var isAudio = d.type === POST_ATTACHMENT_TYPE.AUDIO;
        var isPhoto = d.type === POST_ATTACHMENT_TYPE.PHOTO;
        var find = isAudio || isPhoto; 
        !anyAudio && (anyAudio = isAudio);
        if (isAudio)
          d[d.type].$bitrate = 0;
        if (find) {
          return !!(post['$' + d.type + 's'] || (post['$' + d.type + 's'] = [])).push(d[d.type]);
        }
        else
          return false;
      });
      if (content.length && anyAudio)
        return content;
    } else if (post.copy_history && post.copy_history[0])
      return this.setPostContent(post.copy_history[0]);
    else
      return false;
  }
}

var vk = window._vk = new VK()
export default vk;