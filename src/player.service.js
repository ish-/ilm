import Vue from 'vue';

var audio;
var player = {
  audioInfo: {artist: 'None', title: 'None', id: 0, $bitrate: 0},
  seek: 0,
  buffered: 0,
  init () {
    this.onCanplaythrough = this.onCanplaythrough.bind(this);
    this.onProgress = this.onProgress.bind(this);
    this.onTimeupdate = this.onTimeupdate.bind(this);
    this.play = this.play.bind(this);
  },
  setCurrentTime (seek) {
    audio.currentTime = seek*audio.duration;
  },
  setPlaylist (playlist) {
    var i = playlist.indexOf(this.audioInfo);
    if(i !== -1) {
      this.playlist = playlist.slice(i, playlist.length).concat(playlist.slice(0, i+1));
      this.playlist.push(playlist[i]);
    } else {
      this.playlist = playlist;
    }
  },
  playNext () {
    var i = this.playlist.indexOf(this.audioInfo);

    if(this.playlist.length) {
      if(i < 0) {
        this.play(this.playlist[0]);
      } else {
        this.play(this.playlist[i+1]);
      }
    }
  },

  setBitrate (audioInfo) {
    if(audioInfo.$bitrate)
      return;
    var xhr = new XMLHttpRequest();
    xhr.open('HEAD', '/head/'+audioInfo.url);
    xhr.addEventListener('readystatechange', () => {
      if(xhr.readyState === 4) {
        var br = ((xhr.getResponseHeader('Content-length') / audioInfo.duration) / 100)|0;
        if(br > 320) br = 320;
        else if (br > 256) br = 256;
        else if (br > 192) br = 192;
        else if (br > 128) br = 128;
        else if (br > 96) br = 96;
        else if (br > 96) br = 96;
        else if (br > 48) br = 48;
        else br = "<48"
        audioInfo.$bitrate = br;
      }
    });
    xhr.send();
  },
  play (audioInfo, playlist) {

    if(this.audioInfo.id === audioInfo.id) {
      if (audio.paused)
        audio.play();
      else {
        audio.pause();
      }
      return;
    }

    if(audio) {
      audio.pause();
      audio.removeEventListener('canplaythrough', this.onCanplaythrough);
      audio.removeEventListener('progress', this.onProgress);
      audio.removeEventListener('timeupdate', this.onTimeupdate);
    }

    Vue.util.extend(this.audioInfo, audioInfo);

    // this.setBitrate();
    // this.events.emit({type: 'play', value: audioInfo});
    // this.seek = 0;
    // this.buffered = 0;
    audio = new Audio();
    audio.volume = this._volume = .1; // be quiet
    audio.src = audioInfo.url;
    audio.addEventListener('canplaythrough', this.onCanplaythrough);

    this.setBitrate(this.audioInfo);

    if(playlist && playlist.length)
      this.setPlaylist(playlist);
  },
  onCanplaythrough () {
    audio.play();
    audio.addEventListener('progress', this.onProgress);
    audio.addEventListener('timeupdate', this.onTimeupdate);
  },
  onProgress () {
    var bufIndex = audio.buffered.length - 1;
    var buffered = audio.buffered.end(bufIndex)/audio.duration;
    // this.events.emit({type: 'buffered', value: buffered});
    this.buffered = buffered;
  },
  onTimeupdate () {
    if(!audio)
      return;
    if(audio.currentTime === audio.duration) {
      // this.events.emit({type: 'seek', value: 0});
      this.seek = 0;
      this.playNext();
    }
    var seek = audio.currentTime/audio.duration;
    // this.events.emit({type: 'seek', value: seek});
    // console.log(this.seek);
    this.seek = seek;
  },
}

player.init();

export default player