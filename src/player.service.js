import Vue from 'vue';
import VK from './vk.service';
import LastFM from './lastfm.service';
import {audioBitrate, storage, $httpContentLength} from './utils';

var audio;

class PlayerAudio {
  constructor (d) {
    if(d instanceof PlayerAudio)
      return d;
    if(d.$playable)
      return Vue.util.extend(this, d);
    this.artist = d.artist.name || d.artist;
    this.title = d.title || d.name;
    this.$suggested = null;

    if(d.url) {
      this.$playable = d;
      this.setBitrate(this.$playable);
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
      console.error('no audio suggesting for', this);
      return false;
    }
    return this.$suggested;
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
  setBitrate (playable) {
    if(playable.$bitrate || !playable.duration)
      return false;
    return $httpContentLength(playable.url).then((length) => {
      playable.$bitrate = audioBitrate(length, playable.duration);
      storage.set('player-last-audio', this);
      return this;
    });
  }
}

if(typeof window.ontouchstart === 'object')
  document.addEventListener('touchstart', function(){
    !!audio && !!player.paused && audio.play();
  }, true);
var player = {
  audioInfo: {artist: 'None', title: 'None', $playable: {}},
  seek: 0,
  volume: 1,
  buffered: 0,
  paused: true,
  init () {
    this.onCanplaythrough = this.onCanplaythrough.bind(this);
    this.onProgress = this.onProgress.bind(this);
    this.onTimeupdate = this.onTimeupdate.bind(this);
    this.play = this.play.bind(this);

    var cachedAudioInfo = storage.get('player-last-audio');
    if(cachedAudioInfo)
      this.audioInfo = new PlayerAudio(cachedAudioInfo);
    this.constructAudio(this.audioInfo.$playable.url);
  },
  setCurrentTime (seek) {
    audio.currentTime = seek*audio.duration;
  },
  setPlaylist (playlist) {
    // var i = playlist.indexOf(this.audioInfo);
    // if(i !== -1) {
    //   this.playlist = playlist.slice(i, playlist.length).concat(playlist.slice(0, i+1));
    //   this.playlist.push(playlist[i]);
    // } else {
    //   this.playlist = playlist;
    // }
    this.playlist = playlist;
  },
  playNext () {
    var i = this.playlist.indexOf(this.audioInfo);

    if(this.playlist.length) {
      if(i < 0) {
        this.play(this.playlist[0]);
      } else if (i+1 >= this.playlist.length) {
        this.play(this.playlist[0]);
      } else {
        this.play(this.playlist[i+1]);
      }
    }
  },

  setBitrate (audioInfo) {
    var url = audioInfo.$playable ? audioInfo.$playable.url : audioInfo.url;
    if(audioInfo.$bitrate)
      return;
    $httpContentLength(url).then((length) => {
      audioInfo.$bitrate = audioBitrate(length, audioInfo.duration);
      storage.set('player-last-audio', audioInfo);
    });
  },
  // async searchAndPlay (track, playlist) {
  //   var items = await VK.searchAudios(track.artist + ' ' + track.name);
  //   items = await VK.findBestQualityAudio(items, track.artist, track.name);  
  //   track.$suggested = items;  
  //   track.$playable = items[0];
  //   this.play(track, playlist);
  //   // console.log('play', items);
  // },
  constructAudio (url) {
    audio = new Audio();
    // audio.volume = this._volume = .1; // be quiet
    audio.src = url;
    audio.addEventListener('canplaythrough', this.onCanplaythrough);
  },
  togglePause () {
    if(audio) {
      if(this.paused && audio.paused) {
        this.playAudio()
      } else {
        this.pauseAudio();
        this.paused = true;
      }
    }
  },
  play (audioInfo, playlist) {
    var playlistIndex;

    if(playlist && playlist.length) {
      this.setPlaylist(playlist);
      playlistIndex = playlist.indexOf(audioInfo);
    } else {
      playlist = this.playlist;
      playlistIndex = playlist.indexOf(audioInfo);
    }
    if(!(audioInfo instanceof PlayerAudio)) {
      audioInfo = new PlayerAudio(audioInfo);
      if(playlistIndex != null && playlistIndex > -1)
        playlist[playlistIndex] = audioInfo;
    }
    if(!audioInfo.$playable)
      return audioInfo.searchAndPlay();

    this.audioInfo = audioInfo;
    audioInfo
    // if(!audioInfo && this.audioInfo.id)
    //   return this.play(this.audioInfo);
    // console.log(audioInfo)
    // if(this.audioInfo === audioInfo || this.audioInfo.id === audioInfo.id) {
    //   if (audio.paused)
    //     audio.play();
    //   else {
    //     audio.pause();
    //   }
    //   return;
    // }

    if(audio) {
      this.pauseAudio(audio);
      // audio.pause();
      audio.removeEventListener('canplaythrough', this.onCanplaythrough);
      audio.removeEventListener('progress', this.onProgress);
      audio.removeEventListener('timeupdate', this.onTimeupdate);
    }


    // this.setBitrate();
    // this.events.emit({type: 'play', value: audioInfo});
    this.seek = 0;
    this.buffered = 0;
    this.constructAudio(audioInfo.$playable.url);

    // this.setBitrate(this.audioInfo);
    // console.log('playlist ', this.playlist);
    this.playAudio(audio);

  },
  playAudio (_audio) {
    if(!(_audio = _audio || audio))
      return false;
    _audio.volume = this.volume;
    _audio.play();
    this.checkPaused();
    return true;
  },
  // playingTimeTimer: null,
  pauseAudio (_audio) {
    if(!(_audio = _audio || audio) || _audio.paused)
      return false;
    var steps = Math.round(_audio.volume / .02);
    var timeout = 500 / steps;
    function g (step) {
      setTimeout (function () {
        var vol = _audio.volume - .02;
        if(vol < 0)
          return _audio.pause();
        _audio.volume = vol;
        g(step);
      }, timeout);
    }
    g(0);
    return true;
  },
  onCanplaythrough () {
    this.checkPaused();
    audio.addEventListener('progress', this.onProgress);
    audio.addEventListener('timeupdate', this.onTimeupdate);
  },
  onProgress () {
    var bufIndex = audio.buffered.length - 1;
    var buffered = audio.buffered.end(bufIndex)/audio.duration;
    // this.events.emit({type: 'buffered', value: buffered});
    this.buffered = buffered;
    this.checkPaused();
  },
  onTimeupdate () {
    if(!audio)
      return;
    if(audio.currentTime === audio.duration) {
      // this.events.emit({type: 'seek', value: 0});
      this.seek = 0;
      audio.pause();
      this.playNext();
    }
    var seek = audio.currentTime/audio.duration;
    // this.events.emit({type: 'seek', value: seek});
    // console.log(this.seek);
    this.seek = seek;
  },
  checkPaused () {
    this.paused = !!audio ? audio.paused : true;
  }
}

window._player = player;

player.init();

export default player