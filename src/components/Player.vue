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
    return {player}
  },
  methods: {
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
      var seek = e.offsetX/this.$el.offsetWidth;
      this.player.setCurrentTime(seek);
    },
  },
  // components: {
  //   'player-seek': PlayerSeek,
  // }
}


</script>
<template lang="jade">
.player(:class="{'no-audio': !player.audioInfo.id}")
  .audio-seek(@mouseup="seekOnClick", @mouseout="seekOnMouseOut", @mousedown="seekOnMouseDown", @mousemove="seekOnMouseMove")
    .audio-progress(v-bind:style="{width: player.seek*100 + '%'}")
    .audio-loaded(v-bind:style="{width: (player.buffered*100 + '%')}")
  .audio-info
    .audio-artist {{player.audioInfo.artist}}
    .audio-title {{player.audioInfo.title}} {{player.audioInfo.$bitrate}}kbps
</template>
<style lang="stylus">

.player {
  position: fixed;
  bottom: 0; left: 0; right: 0;
  background: #4c4c4c;
  opacity: .92;
  z-index: 20;

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
  width: 0;
}

.player .audio-loaded {
  opacity: .5;
  position: absolute;
}

.player .audio-info {
  background: #4c4c4c;
  height: 62px;
  padding: 8px 72px;
  opacity: 1;
  font-weight: 300;
  transition: .2s all;
}

.player .audio-info .audio-artist {
  font-size: 24px;
  color: #fff;
  /*display: inline-block;*/
}

.player .audio-info .audio-title {
  font-size: 21px;
  /*display: inline-block;*/
  color: #CBCBCB;
}

@media screen and (min-width: 900px)
  .player
    left: 320px

</style>