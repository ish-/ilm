<script lang="babel">
import LastFM from '../lastfm.service';

export default {
  props: {
    items: {
      default: [],
      type: Array,
    }
  },
  route: {
    data (trns) {
      var artistName = trns.to.params.artistName;
      return {items: LastFM.getArtistSimilars(artistName)};
    }
  },
  methods: {
    goToArtist (artistName) {
      this.$router.go({name: 'lfm-artist-tracks', params: {artistName}});
    },
    getArtistImage (artist) {
      console.log('getArtistImage call;')
      if(!artist.image)
        return;
      return artist.image.extralarge || artist.image.large || artist.image.medium || '';
    }
  }
}
</script>
<template lang="jade">

.lfm-artist-collection(v-if="!$loadingRouteData")
  .lfm-artist(v-for="artist in items", style="background-image: url({{{* getArtistImage(artist) }}}", @click="goToArtist(artist.name)")
    .lfm-artist-name {{* artist.name}}

</template>
<style lang="stylus">

.lfm-artist-collection
  size: 100% 190px
  overflow-x: auto
  white-space: nowrap
  padding: 10px
  //position: relative
  

.lfm-artist
  cursor: pointer
  margin: 10px 0 10px 10px
  size: 150px
  display: inline-block
  background-size: cover
  background-position: center center
  position: relative
  box-shadow: 0 -31px 52px 10px rgba(0,0,0,.5) inset;
  background-color: #2D2D2D;

  &-name
    color: white
    padding: 10px
    text-shadow: 0 0 4px black
    absolute: bottom
    //overflow: ellipsis
    font-size: 16px
    white-space: initial

</style>