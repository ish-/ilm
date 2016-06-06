<script lang="babel">

import player from '../player.service';
import VK from '../vk.service';


// var PlayerSeek = {
//   name: 'PlayerSeek',
//   replace: false,
//   compiled () {
//     console.log('compiled', this);
//   },
//   beforeDestroy () {
//     console.log('destroy');
//   }
// }

var seekMouseDown = false;

export default {
  name: 'PlayerView',
  data () {
    return {player, showSuggested: false, showPlaylist: false, audioPlaylistInfo: '', focused: true}
  },
  methods: {
    playSuggested (audio) {
      player.audioInfo.setPlayable(audio);
      player.play(player.audioInfo);
    },
    // suggestedSearch (v) {
    //   player.audioInfo.search(this.suggestedSearchValue);
    // },
    toggleSuggested (bool) {
      // var _watcher;
      if(this.showSuggested || bool === false)
        return this.showSuggested = bool;
      if(!VK.serverAuthCheck())
        return;
      var a = player.audioInfo
      // this.suggestedSearchValue = a.artist + ' ' + a.title;
      if(!a.$suggested) {
        a.search();
      }
      this.showSuggested = true;
    },
    seekOnMouseDown (e) {
      seekMouseDown = true;
      this.seekOnMouseMove(e);
    },
    seekOnMouseOut (e) {
      seekMouseDown && this.seekOnMouseMove(e);
      seekMouseDown = false;
    },
    seekOnClick (e) {
      seekMouseDown = false;
    },
    seekOnMouseMove (e) {
      if (!seekMouseDown)
        return;
      var w = this.$els.seek.offsetWidth;
      var seek = (e.offsetX)/w;
      this.player.setCurrentTime(seek);
    },
    logAudioInfo () {
      console.log(player.audioInfo);
      this.$log(player.audioInfo);
    },
    updatePlayListInfo () {
      console.log('updatePlayListInfo');
      var i = player.getAudioPlaylistIndex() + 1;
      var l = player.playlist.length;
      if(!l)
        return this.audioPlaylistInfo = '';
      return this.audioPlaylistInfo = `(${i}/${l})`;
    }
  },
  filters: {
    reverse (arr) {
      return arr.slice().reverse();
    }
  },
  created () {
    this.$watch('player.audioInfo', () => {
      this.updatePlayListInfo();
      this.toggleSuggested(false); 
    });
    this.$watch('player.playlist.length', this.updatePlayListInfo);
    this.updatePlayListInfo();
    this.$watch('showPlaylist', (d) => {
      if(!d) return;
      this.$nextTick(() => this.$dispatch('player:current-audio-is-on-page'))
    });
    window.addEventListener('blur', () => this.focused = false)
    window.addEventListener('focus', () => this.focused = true)
  }
  // components: {
  //   'player-seek': PlayerSeek,
  // }
}


</script>
<template lang="jade">

.audio-suggested(v-if="showSuggested")
  //- input.search(v-model="suggestedSearchValue", @keydown.enter="suggestedSearch")
  .audio-suggested-none(v-show="!player.audioInfo.$suggested.length") No items
  .audio(v-for="audio in player.audioInfo.$suggested", @click="playSuggested(audio)")
    .audio-container(class="aid-{{* audio.id}}")
      .audio-bitrate(v-if="audio.$bitrate") ({{ audio.$bitrate }}kbps)
      .audio-artist {{* audio.artist}}
      .audio-title {{* audio.title}} ({{* audio.duration | audioDuration}})
        
.playlist(v-if="showPlaylist", transition="translateY"): .playlist-container
  .audio(v-for="audio in player.playlist", @click="player.play(audio)")
    .audio-container(class="aid-{{* audio.$playable.id}}")
      .audio-bitrate(v-if="audio.$playable.$bitrate !== 0") ({{ audio.$playable.$bitrate }}kbps)
      .audio-artist {{* audio.artist}}
      .audio-title {{* audio.title}} ({{* audio.$playable.duration | audioDuration}})
        
.player(v-if="player.audioInfo", transition="translateY")
  .audio-seek(v-el:seek, @mouseup="seekOnClick", @mouseout="seekOnMouseOut", @mousedown="seekOnMouseDown", @mousemove="seekOnMouseMove")
    .audio-progress(:style="{transform: 'translateX(-'+(100 - player.seek*100) + '%)'}")
    .audio-loaded(:style="{transform: 'translateX(-'+(100 - (player.buffered*100) + '%)')}")
  button.audio-play(@click="player.togglePause()")
    .icon(:class=" player.paused ? '_play' : '_pause'")
  .audio-info
    .audio-artist(@click="logAudioInfo") {{player.audioInfo.artist}}
    .audio-title 
      span(@click="player.audioInfo.scrobble()") {{player.audioInfo.title || player.audioInfo.name}} 
      button.btn-bitrate(@click="toggleSuggested()") {{player.audioInfo.$playable.$bitrate || '? '}}kbps
  button.playlist-info(@click="showPlaylist = !showPlaylist") {{audioPlaylistInfo}}
</template>
<style lang="stylus">

$rect = 56px

.audio-suggested
  overflow-y: auto
  max-height: 50%
  // min-height: 50px
  padding-bottom: 44px
  fixed: bottom 57px left right
  background: rgba(255,255,255,.9)
  border-top: 3px solid #333

  &-none
    color: #aaa
    text-align: center

  .audio-bitrate
    display: inline-block
    color: #aaa
    vertical-align: top
    font-size: 13px


.player
  position: fixed
  align-items: center
  display: flex
  fixed: bottom 0 left 0 right 0
  height: $rect
  background: #4c4c4c
  opacity: .92
  z-index: 20

  transition: .2s transform
  transform: translateY(0px)

  &:hover 
    .audio-seek
      top: -36px
      height: 36px

  .audio-play, .playlist-info
    min-width: $rect
    text-align: center
    height: 100%
    background: transparent
    font-size: 20px
    color: white

  .audio-play
    transition: .2s all
    opacity: 1

    &:hover
      transform: scale(1.1)

    &:active
      opacity: 1
      transform: scale(1.6)

  .playlist-info
    padding: 0 10px

  .no-audio
    transform: translateY(100px)

  .audio-seek
    overflow: hidden
    cursor: pointer
    size: 100% 12px
    absolute: top -12px
    background: #68D0FF
    transition: .2s all

/*.player .audio-seek:after
  position: absolute
  content: ''
  width: 100%
  height: 12px
  bottom: 0
  left: 0
  box-shadow: 0 0 5px 5px rgba(255,255,255,.5) inset*/


  .audio-progress, .audio-loaded
    height: 100%
    background: #00A2EA
    position: absolute
    width: 100%
    transform: translateX(-100%)
    pointer-events: none

  .audio-loaded
    opacity: .5
    position: absolute

  .audio-info
    flex-grow: 1
    background: #4c4c4c
    // height: 56px
    // padding: 8px 72px
    opacity: 1
    font-weight: 300
    transition: .2s all

    .audio-artist
      font-size: 20px
      color: #fff
      /*display: inline-block*/

    .audio-title
      font-size: 16px
      /*display: inline-block*/
      color: #CBCBCB
      
.playlist
  background: #4c4c4c
  fixed: top bottom $rect left right
  padding-bottom: 36px
  box-shadow: 0 -20px 20px -10px #42BDF3 inset
  
  &-container
    padding-bottom: 36px
    absolute: bottom left right
    overflow-y: auto
    max-height: 100%
    
  .audio 
    .audio-artist
      color: #ccc
    .audio-title
      color: #ababab
    .playing
      background-color: rgba(79, 225, 249, 0.35)
      &.audio-container:after
        border: 0
    .audio-container
      &:after
        border-color: #424242

// @media screen and (min-width: 900px)
//  .player
//    left: 320px

</style>