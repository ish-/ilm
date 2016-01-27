<script lang="babel">

import player from '../player.service';


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
    return {player, showSuggested: false}
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
      if(this.showSuggested || bool === false) {
        return this.showSuggested = false;
      }
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
    }
  },
  created () {
    this.$watch('player.audioInfo', this.toggleSuggested.bind(this, false));
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
.player(:class="{'no-audio': !player.audioInfo.artist}")
  .audio-seek(v-el:seek, @mouseup="seekOnClick", @mouseout="seekOnMouseOut", @mousedown="seekOnMouseDown", @mousemove="seekOnMouseMove")
    .audio-progress(v-bind:style="{transform: 'translateX(-'+(100 - player.seek*100) + '%)'}")
    .audio-loaded(v-bind:style="{transform: 'translateX(-'+(100 - (player.buffered*100) + '%)')}")
  .audio-info
    .audio-paused(style="position: absolute; bottom: 0; left: 0;", @click="player.togglePause()") {{player.paused}}
    .audio-artist(@click="logAudioInfo") {{player.audioInfo.artist}}
    .audio-title 
      span(@click="player.audioInfo.scrobble()") {{player.audioInfo.title || player.audioInfo.name}} 
      button(@click="toggleSuggested") {{player.audioInfo.$playable.$bitrate}}kbps
</template>
<style lang="stylus">
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

.player {
  position: fixed;
  bottom: 0; left: 0; right: 0;
  background: #4c4c4c;
  opacity: .92;
  z-index: 20;
  overflow: hidden

  transition: .2s transform;
  transform: translateY(0px);
}

.player.no-audio {
  transform: translateY(100px);
}

.player .audio-seek {
  cursor: pointer;
  height: 12px;
  position: relative;
  background: #68D0FF;
  transition: .2s height;
}

/*.player .audio-seek:after {
  position: absolute;
  content: '';
  width: 100%;
  height: 12px;
  bottom: 0;
  left: 0;
  box-shadow: 0 0 5px 5px rgba(255,255,255,.5) inset;
}*/

.player:hover .audio-seek {
  height: 36px;
}

.player .audio-progress, .audio-loaded {
  height: 100%;
  background: #00A2EA;
  position: absolute;
  width: 100%;
  transform: translateX(-100%)
  pointer-events: none
}

.player .audio-loaded {
  opacity: .5;
  position: absolute;
}

.player .audio-info {
  background: #4c4c4c;
  height: 56px;
  padding: 8px 72px;
  opacity: 1;
  font-weight: 300;
  transition: .2s all;
}

.player .audio-info .audio-artist {
  font-size: 20px;
  color: #fff;
  /*display: inline-block;*/
}

.player .audio-info .audio-title {
  font-size: 16px;
  /*display: inline-block;*/
  color: #CBCBCB;
}

// @media screen and (min-width: 900px)
//  .player
//    left: 320px

</style>