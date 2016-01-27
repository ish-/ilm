<script lang="babel">
import VK from '../vk.service';
import Player from '../player.service';

export default {
  props: {
    artist: Object,
    items: Array,
    hideByMbid: {
      default: true
    }
  },
  // data () {
  //   return {hideByMbid: true}
  // },
  filters: {
    _hideTByMbid (arr, hide) {
      return !hide ? arr : arr.filter((a, i) => a.mbid || i < 15);
    }
  },
  methods: {
    play (track) {
      Player.play(track, this.items);
    },
    getPlaycountWidth (track) {
      // console.log(track.listeners, track.playcount, this.items.$maxListeners);
      return (+(track.listeners || track.playcount) / this.items.$maxListeners * 50 || 0) + '%';
    }
  },
  // created () {
  //   if(!this.items)
  //     this.items = this.artist.tracks;
  // }
}
</script>
<template lang="jade">
ul.artist-tracks
  li.artist-track(href="{{track.name}}", v-for="track in items | _hideTByMbid hideByMbid", @click="play(track)", transition="translateX") {{track.name}}
    .artist-track-listeners(style="width: {{* getPlaycountWidth(track)}}")
  button.artist-tracks-show-all(@click="hideByMbid = false", v-show="hideByMbid") show all
</template>
<style lang="stylus">

.artist-track
    height: 45px
    font-size: 14px
    line-height: 45px
    padding-left: 16px
    border-top: 1px solid #EBEBEB
    position: relative

    &:first-child
      border-top: 0px

  .artist-track-listeners
    position: absolute
    right: -5px
    top: 8px
    height: 29px
    line-height: 29px
    background: #5DE3EE
    text-align: right
    color: #3A9AA2
    font-size: 11px
    width: 50%
    border-radius: 5px
    z-index: -1

  .artist-tracks-show-all
    font-size: 14px
    background: #F2F1F1
    size: 241px 35px
    line-height: 35px
    color: #A0A0A0
    border-radius: 4px
    margin: 20px auto
    display: block

</style>