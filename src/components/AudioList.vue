<script lang="babel">
import Vue from 'vue';
import Player from '../player.service';
import PlayerAudio from '../PlayerAudio';
import VK from '../vk.service';
import Modals from '../modal.service';
// import LastFM from '../lastfm.service';
import '../filters/slice';

export default Vue.extend({
  name: 'AudioList',
  props: {
    items: {
      type: Array,
      default: [],
    },
    post: null,
    group: false,
    per: {
      type: Number,
      default: 1000,
    },
  },
  data (trns) {
    return {showBitrates: false, bitRateShowenFor: 0, showDownload: false};
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
      return VK.getAudios((this.group ? '-' : '') + this.userId, this.items);
    },
    play (audio) {
      Player.play(audio, this.items);
    },
    addToPlaylist (items, next) {
      Player.addToPlaylist(items, next);
    },
    getBitrates () {
      this.showBitrates = true;
      Player.setBitrate(this.items.slice(this.bitRateShowenFor, 10));
      this.bitRateShowenFor += 10;
    },
    getDownloadName (audio) {
      return audio.artist + ' - ' + audio.title + '.mp3';
    },
    download (_audio, i, albumName) {
      var audio;
      i = i || this.items.indexOf(_audio);
      if(!(_audio instanceof PlayerAudio))
        audio = new PlayerAudio(_audio);
      else
        audio = _audio;
      this.items.$set(i, audio);
      audio.download(albumName && {order: i+1, albumName});
        // .then(() => _audio.$downloading = false)
        // .catch(() => _audio.$downloadError = !(_audio.$downloading = false));
    },
    downloadAlbum (saveSequence) {
      this.items.forEach((a, i) => this.download(a, i, saveSequence && this.items.$name)); 
    },
    goToArtist (artistName) {
      this.$route.router.go({name: 'lfm-artist-tracks', params: {artistName}});
    },
    showModal (audio) {
      Modals.push({
        name: 'audio-list-context', 
        data: {audio, playlist: this.items, component: this}
      });
    },
  },
  ready () {
    if(!Player.audioInfo)
      return;
    if (this.items.some((a) => a.id === Player.audioInfo.$playable.id)) {
      this.$dispatch('player:current-audio-is-on-page');
    }
  },
});

</script>
<template lang="jade">

ul.audio-collection(:class="{'bitrates-show': showBitrates}") {{albumName}}
  //- .ctrls
  //-   button(@click="getBitrates") get bitrates
  //-   button(@click="addToPlaylist(items, true)") add next
  //-   button(@click="addToPlaylist(items)") add to the end
  //-   button(@click="showDownload = !showDownload") download
  li.audio(v-for="audio in items | slice per", @click="play(audio)", @contextmenu.prevent="showModal(audio)")
    .audio-container(class="aid-{{* audio.id}}")
      .audio-bitrate {{ audio.$bitrate || '' }}
      .audio-artist(@click.stop="goToArtist(audio.artist)") {{* audio.artist}}
      .audio-title {{* audio.title}}
      .audio-download(v-if="showDownload", @click.stop="download(audio, $index)") ^
      span {{audio.$downloading}}

</template>
<style lang="stylus">

.audio-collection
  .ctrls
    padding: 22px 22px 0
  button
    background: #44C0F6
    border-radius: 3px
    color: #2B2B2B
    margin-bottom: 5px
    margin-right: 8px
    padding: 8px 10px
    text-shadow: 0 0 3px white


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
      border-bottom: 1px solid rgba(122, 122, 122, 0.2)
      
  &:last-child .audio-container:after
      border: 0

  .playing
    background: #B8E7FC;
    &.audio-container
      &:after
        content: ''


  .audio-download
    display: inline-block;
    float: right


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