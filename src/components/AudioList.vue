<script lang="babel">
import Vue from 'vue';
import Player from '../player.service';
import VK from '../vk.service';
// import LastFM from '../lastfm.service';
import '../filters/slice';

export default Vue.extend({
  name: 'AudioList',
  props: {
    items: {
      type: Array,
      default: [],
    },
    per: {
      type: Number,
      default: 1000,
    },
  },
  data (trns) {
    return {showBitrates: false}
  },
  // route: {
  //   data (trns) {
  //     console.log('AudioList route.data()', trns.to.params);
  //     var userId = trns.to.params.userId;
  //     if(this.userId === userId)
  //       return trns.next();
  //     this.userId = userId;
  //     this.items.length = 0;

  //     return {items: VK.getAudios(this.userId, this.items)};
  //   },
  //   // activate () {
  //   //   this.$on('scroll-end-close', ::this.getMore);
  //   // }
  // },
  methods: {
    getEntity () {
      return VK.getAudios(this.userId, this.items);
    },
    play (audio) {
      Player.play(audio, this.items);
    },
    getBitrates () {
      this.showBitrates = true;
      this.items.forEach(Player.setBitrate);
    },
    goToArtist (artist) {
      this.$route.router.go({name: 'lfm-artist-tracks', params: {artistName: artist}});
    }
  },
  ready () {
    if (this.items.some((a) => a.id === Player.audioInfo.$playable.id)) {
      this.$dispatch('player:current-audio-is-on-page');
    }
  },
});

</script>
<template lang="jade">

ul.audio-collection(:class="{'bitrates-show': showBitrates}")
  button(@click="getBitrates") get bitrates
  li.audio(v-for="audio in items | slice per", track-by="id", @click="play(audio)", @contextmenu.prevent="goToArtist(audio.artist)")
    .audio-container(class="aid-{{* audio.id}}")
      .audio-bitrate {{ audio.$bitrate }}
      .audio-artist {{* audio.artist}}
      .audio-title {{* audio.title}}

</template>
<style lang="stylus">

.audio 
  .audio-container
    /*padding-top: 10px;*/
    /*min-height: 60px;*/
    position: relative
    padding: 12px 22px 8px;
    /*line-height: 60px;*/
    cursor: pointer;
    font-family: 'Helvetica Neue';

    &:after
      content: ''
      position: absolute
      bottom: 0
      left: 20px
      right: 14px
      border-bottom: 1px solid #ECECEC
      
  &:last-child .audio-container:after
      border: 0

  .playing
    background: #B8E7FC;


  .audio-artist
    text-overflow: ellipsis;
    overflow: hidden;
    max-width: 100%;
    vertical-align: top;
    display: inline-block;
    white-space: nowrap;
    font-size: 19px;
    color: #333;


  .audio-title
    text-overflow: ellipsis;
    overflow: hidden;
    max-width: 95%;
    line-height: 24px;
    /*vertical-align: top;*/
    white-space: nowrap;
    font-size: 16px;
    color: #7b7b7b;
    margin-left: 10px;
    display: inline-block;


.audios-more
  width: 100%;
  background: none;
  border: 0;
  height: 60px;
  line-height: 60px;

.audios-more:hover
  background: grey;

.audio-bitrate
  display: none
  float: right

.bitrates-show .audio-bitrate
  display: inline-block

</style>