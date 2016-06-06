<script lang="babel">
// import Modal from './Modal.vue';
import Player from '../player.service';
import VK from '../vk.service';

export default {
  // components: {Modal},
  props: ['data'],
  methods: {
    getBitrates () {
      Player.setBitrate(this.data.playlist);
      this.data.component.showBitrates = true;
      // this.$dispatch('close');
    },
    showDownload () {
      this.data.component.showDownload = true;
      // this.$dispatch('close');
    },
    download () {
      this.data.component.download(this.data.audio);
      // this.$dispatch('close');
    },
    downloadAll(saveSequence) {
      this.data.component.downloadAlbum(saveSequence);
      this.$dispatch('close');
    },
    goToArtist (artistName) {
      this.$route.router.go({name: 'lfm-artist-tracks', params: {artistName}})
      // this.$dispatch('close');
    },
    add (audio) {
      VK.addAudio(audio);
    }
  },
  // created () {
  //   console.log(this);
  // }
}
</script> 
<template lang="jade">
.modal(@click="$dispatch('close')")
  button.modal-close ✖︎
  .modal-body
    .modal-content(slot="body")
      h2 Playlist actions 
        span ({{* data.playlist.$name}})
      ul
        li(@click="getBitrates") Get bitrates
        li Play right than current track
        li Add to the end
        li(@click="downloadAll()") Download all (<span @click.stop="downloadAll(true)">save sequence in names</span>)
        li(@click="showDownload") Show download controls

      h2 Track actions 
        span ({{* data.audio.artist}} - {{* data.audio.title}})
      ul
        li(@click="goToArtist(data.audio.artist)") Go to artist's discogs
        li(@click="add(data.audio)") Add+
        li(@click="download(data.audio)") Download

</template>
<style lang="stylus">

.modal.audio-list-context
  h2
    border-bottom: 1px solid #E0E0E0
    span
      font-size: 14px
      line-height: 19px
      display: inline-block
      vertical-align: middle
      color: #797979
  ul
    padding: 20px 0
  li
    padding: 10px 5px
    cursor: pointer

</style>