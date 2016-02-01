import Vue from 'vue';
import VK from './vk.service';
import LastFM from './lastfm.service';
import PlayerAudio  from './PlayerAudio';
import * as _ from './utils';
import alerts from './alerts.service';

var audio, i;
var playlistId = 0;

// var toggledByTouch;
// if(typeof window.ontouchstart === 'object')
//   document.addEventListener('touchstart', function(){
//     if (!!audio && !!player.paused) {
//       player.playAudio();
//       toggledByTouch = setTimeout(() => toggledByTouch = null, 100);
//     }
//   });
var PlayerPrototype = {
  init () {
    this.onCanplaythrough = this.onCanplaythrough.bind(this);
    this.onProgress = this.onProgress.bind(this);
    this.onTimeupdate = this.onTimeupdate.bind(this);
    this.onError = this.onError.bind(this);
    this.play = this.play.bind(this);

    _.storage.addEventListener('play', () => this.pauseAudio());
    this.restore();
  },
  restore () {
    var a = _.storage.get('player-last-audio');
    var p = _.storage.get('player-last-playlist');
    if(p && p.length && !isNaN(a)) {
      this.playlist = p;
      this.playlist[a] = a = new PlayerAudio(this.playlist[a]);
      if(!a)
        this.playlist[0] = a = new PlayerAudio(this.playlist[0]);
    }
    if(a && a.$playable) {
      this.audioInfo = a;
      this.constructAudio(this.audioInfo.$playable.url);
    }
  },
  setCurrentTime (seek) {
    audio.currentTime = seek*audio.duration;
  },
  getAudioPlaylistIndex (audioInfo) {
    var i;
    audioInfo = audioInfo || this.audioInfo;
    i = this.playlist.indexOf(this.audioInfo)
    return i;
  },
  addToPlaylist (some, where) {
    var i = this.getAudioPlaylistIndex();
    if(~i && where === true) // next
      return _.arrSplice(this.playlist, i+1, 0, some);
    else // after
      return _.arrPush(this.playlist, some);
    this.playlist.saved = false;
    this.save();
  },
  setPlaylist (playlist, where) {
    var id = ++playlistId;
    playlist.$id = id;
    this.playlist = playlist.slice(0, 500);
    this.playlist.$id = id;
    this.save();
    // var i = playlist.indexOf(this.audioInfo);
    // if(i !== -1) {
    //   this.playlist = playlist.slice(i, playlist.length).concat(playlist.slice(0, i+1));
    //   this.playlist.push(playlist[i]);
    // } else {
    //   this.playlist = playlist;
    // }
  },
  playNext () {
    var i = this.getAudioPlaylistIndex();

    if(this.playlist.length) {
      if(i < 0) {
        this.play(this.playlist[0]);
      } else if (i+1 >= this.playlist.length) {
        this.play(this.playlist[0]);
      } else {
        this.play(this.playlist[i+1]);
      }
    }
    this.save();
  },

  setBitrate (_audios) {
    if(!VK.serverAuthed) {
      alerts.add({type: 'Player', text: 'To display audio quality (bitrate) you should login out server with VK.'});
      return Promise.reject();
    }
    var audios = _audios.map((audio) => {
      var a = audio.$playable || audio;
      return a.owner_id + '_' + a.id;
    });
    return VK.getAudiosContentLength(audios).then((lengths) => {
      _audios.forEach((audio, i) => {
        var a = audio.$playable || audio;
        a.$bitrate = _.audioBitrate(lengths[i], a.duration);
      });
      return _audios;
    }).catch(d => console.error('setBitrate: error', d));
  },

  constructAudio (url) {
    audio = new Audio();
    // audio.volume = this._volume = .1; // be quiet
    audio.src = url.split('extra')[0];
    audio.addEventListener('error', this.onError);
    audio.addEventListener('canplaythrough', this.onCanplaythrough);
  },
  togglePause () {
    if(audio) {
      if(this.paused && audio.paused) {
        this.playAudio()
      } else if (!toggledByTouch) {
        this.pauseAudio();
        this.paused = true;
      }
    }
  },
  save: (function(){
    var async;
    return function () {
      var that = this;
      if(this.playlist.saved) {
        _.storage.set('player-last-audio', this.audioInfo);
        return;
      }
      this.playlist.saved = false;
      if(async && !async.done)
        async.abort();
      async = _.asyncDoByChunk(
        this.playlist,
        (audio, i, playlist) => audio instanceof PlayerAudio || (playlist[i] = new PlayerAudio(audio)),
        3, 300, 
        (playlist) => {
          _.storage.set('player-last-playlist', playlist);
          _.storage.set('player-last-audio', that.getAudioPlaylistIndex());
          that.playlist.saved = true;
        }
      );
      _.storage.set('player-last-audio', this.audioInfo);
    }
  })(),
  play (audioInfo, playlist) {
    var playlistIndex;
    _.storage.emit('play');
    if(playlist && playlist.length)
      playlistIndex = playlist.indexOf(audioInfo);
    if(playlist && playlist.length 
        && (!this.playlist.$id || playlist.$id !== this.playlist.$id)) {
      this.setPlaylist(playlist);
    } else {
      playlist = this.playlist;
    }
    if(!(audioInfo instanceof PlayerAudio)) {
      audioInfo = new PlayerAudio(audioInfo);
      if(playlistIndex !== null && playlistIndex > -1) 
        playlist[playlistIndex] = audioInfo;
    }
    if(!audioInfo.$playable)
      return audioInfo.searchAndPlay();
    else if (!audioInfo.$playable.$bitrate)
      this.setBitrate([audioInfo]);

    this.audioInfo = audioInfo;
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
    // this.audioPlaylistIndex = getAudioPlaylistIndex() + 1;

  },
  playAudio (_audio = audio) {
    if(!_audio)
      return false;
    _audio.volume = this.volume;
    _audio.play();
    this.checkPaused();
    return true;
  },
  // playingTimeTimer: null,
  pauseAudio (_audio = audio) {
    var that = this;
    if(!_audio || _audio.paused)
      return false;
    var steps = Math.round(_audio.volume / .02);
    var timeout = 500 / steps;
    function g (step) {
      setTimeout (function () {
        var vol = _audio.volume - .02;
        if(vol < 0) {
          that.checkPaused();
          return _audio.pause();
        }
        _audio.volume = vol;
        g(step);
      }, timeout);
    }
    g(0);
    return true;
  },
  onError (d) {
    console.log(d);
    this.audioInfo.updatePlayable();
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


var player = Object.create(PlayerPrototype);
Vue.util.extend(player, {
  audioInfo: {artist: 'None', title: 'None', $playable: {}},
  seek: 0,
  volume: 1,
  buffered: 0,
  paused: true,
  playlist: [],
});

player.init();
window._player = player;


export default player