import {$jsonp, storage} from './utils';

const POST_ATTACHMENT_TYPE = {
  AUDIO: 'audio',
  PHOTO: 'photo'
}

class VK {
  constructor () {
    this._token = null;
    this.userId = 0;
    this.authed = false;

    this._token = storage.get('vk-token');
    if(!this._token && location.hash) {
      let hash = location.hash.slice(1).split('&').reduce(function(mem, str){
        let _str = str.split('=');
        mem[_str[0]] = _str[1];
        return mem;
      }, {});
      hash['access_token'] && (this._token = hash['access_token']);
      storage.set('vk-token', this._token);
      storage.set('vk-userId', this.userId = +hash['user_id']);
    } else {
      this.userId = +storage.get('vk-userId');
    }
    this.authed = !!this._token;
  }

  auth () {
    storage.remove('vk-token');
    storage.remove('vk-userId');
    location.href = 'https://oauth.vk.com/authorize?client_id=3430394&redirect_uri='+encodeURIComponent(location.href)+'&display=popup&response_type=token&scope=wall,audio,groups,friends';
  }

  _request (opts) {
    if(!this.authed)
      return Promise.reject(new Error('no auth'));
    opts.search = ['access_token=' + this._token, 'v=5.42'];
    if (opts.data) {
      for(let key in opts.data) {
        opts.search.push(`${key}=${opts.data[key]}`);
      }
    }
    opts.url = 'https://api.vk.com/method/' + opts.url;
    return $jsonp(opts);
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

  getMoreAudios () { // this = AudioInfo[]

  }

  getAudios (userId, offset, force) {
    var cache, req;
    // if (force || !(cache = storage.get('vk-user-audio-cache'))) {
      req = this._request({url: 'audio.get', data: {
        owner_id: (userId || this.userId), 
        count: 200, 
        offset: (offset || 0)
      }})

      // req.then((d) => {
      //   storage.set('vk-user-audio-cache', d);
      //   return d;
      // });
    // }
    return req || Promise.resolve(cache);
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

  getWall (userId, offset = 0) {
    var length = 0;
    return this._getWall(userId, offset);
  }

  _getWall (userId, offset = 0, length = 0) {
    var count = 30;
    return this._request({url: 'wall.get', data: {owner_id: (userId || this.userId), count, extended: 1, offset}})
      .then((d) =>  {
        let profiles = d.profiles.reduce((mem, profile)=>{
          mem[profile.id] = profile;
          return mem;
        }, {});
        let groups = d.groups.reduce((mem, group)=>{
          mem['-' + group.id] = group;
          return mem;
        }, {});
        let items = d.items.filter((post)=>{
          if (this.setPostContent(post)) {
            post.$owner = profiles[post.owner_id] || groups[post.owner_id];
            if (post.copy_history) {
              let reposted = post.copy_history[0];
              reposted.$owner = profiles[reposted.owner_id] || groups[reposted.owner_id];
            }
            return true;
          } else
            return false;
        });
        // console.log(items);
        length += items.length;
        console.log(offset, d.count, length);
        if(length < 10 && count + offset < d.count) {
          this._getWall(userId, offset + count, length).then((_nextItems) => {
            items.push.apply(items, _nextItems);
          });
        }

        return items;
      });
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
          return !!(post['$' + d.type + 's'] || (post['$' + d.type + 's'] = [])).unshift(d[d.type]);
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

export default new VK()