<script lang="babel">
import Player from '../player.service';
import '../filters/slice';

export default {
  // name: 'AudioList',
  props: {
    items: Array,
    per: {
      type: Number,
      default: 100,
    },
  },
  data () {
    return {showBitrates: false}
  },
  methods: {
    play (audio) {
      Player.play(audio, this.items)
    },
    getBitrates () {
      this.showBitrates = true;
      this.items.forEach(Player.setBitrate);
    }
  }
}

</script>
<template lang="jade">

.audio-collection(:class="{'bitrates-show': showBitrates}")
  button(@click="getBitrates") get bitrates
  .audio(v-for="audio in items | slice per", track-by="id", @click="play(audio)")
    .audio-container(class="aid-{{* audio.id}}")
      .audio-bitrate {{ audio.$bitrate }}
      .audio-artist {{* audio.artist}}
      .audio-title {{* audio.title}}

</template>
<style lang="stylus">

.audio-collection
  background: white

.audio 
  .audio-container
    /*padding-top: 10px;*/
    /*min-height: 60px;*/
    padding: 10px 22px 15px;
    /*line-height: 60px;*/
    cursor: pointer;
    font-family: 'Helvetica Neue';

  .playing
    background: #B8E7FC;


  .audio-artist
    /*text-overflow: ellipsis;*/
    overflow: hidden;
    /*max-width: 100%;*/
    /*vertical-align: top;*/
    display: inline-block;
    // white-space: nowrap;
    font-size: 19px;
    color: #333;


  .audio-title
    text-overflow: ellipsis;
    overflow: hidden;
    max-width: 95%;
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