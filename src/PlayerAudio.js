import VK from './vk.service';
import Vue from 'vue';
import LastFM from './lastfm.service';
import player from './player.service';
import * as _ from './utils';

var updateTimeout;

class PlayerAudio {
  constructor (d) {
    if(typeof d !== 'object')
      return;
    if(d instanceof PlayerAudio)
      return d;
    if(d.$playable)
      Vue.util.extend(this, d);
    else {
      this.artist = d.artist.name || d.artist;
      this.title = d.title || d.name;
      this.$suggested = null;
    }
    this.$downloading = false;


    if(d.url) {
      this.$playable = d;
      if(!d.$bitrate) {
        Vue.set(this.$playable, '$bitrate', 0)
      }
        // this.$playable.$bitrate = 0;
      // this.setBitrate(this.$playable);
    }
  }
  async search () {
    this.$suggested = this.$suggested || [];  
    var items = await VK.searchAudios(this.artist + ' ' + this.title);
    items = await VK.findBestQualityAudio(items, this.artist, this.title);  
    this.$suggested.splice(null);
    this.$suggested.push.apply(this.$suggested, items);  
    if(!this.$playable)
      this.$playable = items[0];
    if(!this.$playable) {
      // TODO: place alert here.
      console.error('no audio suggesting for', this);
      return false;
    }
    if(!this.$playable.$bitrate) {
      setTimeout(() => {
        items.some((a) => a.id === this.$playable.id && (this.$playable.$bitrate = a.$bitrate))
      });
    }
    return this.$suggested;
  }
  download (opts = {}) {
    var url = this.url || this.$playable.url;
    if(!url)
      return Promise.reject('audio is not playable');
    this.$downloading = 0;
    var name = `${opts.albumName ? opts.albumName + '/' : ''}${opts.order ? _.fillNull(opts.order) + ' - ' : ''}${this.artist} - ${this.title}.mp3`;
    return _.$download(url, name, (e) => {
      this.$downloading = (e.loaded / e.total * 100)|0;
    }).catch(() => this.$downloading = -1);
  }
  scrobble () {
    LastFM.scrobble({artist: this.artist, track: this.title, 
      timestamp: (Date.now()/1000-this.$playable.duration/1.5)|0});
  }
  setPlayable (suggested) {
    this.$playable = suggested
    // player.play(this);
  }
  async searchAndPlay () {
    var find = await this.search();
    if(!find) 
      return false;
    player.play(this);
    return this;
  }
  setBitrate () {
    return player.setBitrate([this]);
  }
  updatePlayable () {
    if(updateTimeout)
      return;
    updateTimeout = setTimeout(() => updateTimeout = null, 500);
    return VK.getAudiosById([this.$playable]).then(([d]) => this.$playable = d, this);
  }
  // setBitrate (playable) {
  //   playable = playable || this.$playable;
  //   if(playable.$bitrate || !playable.duration)
  //     return false;
  //   return _.$httpContentLength(playable.url).then((length) => {
  //     playable.$bitrate = _.audioBitrate(length, playable.duration);
  //     _.storage.set('player-last-audio', this);
  //     return this;
  //   });
  // }
}

PlayerAudio.mapFromArray = function (arr) {
  return arr.map((a) => new PlayerAudio(a));
}

export default PlayerAudio