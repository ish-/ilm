<script lang="babel">
import LastFM from '../lastfm.service';
import LfmTrackList from './LfmTrackList.vue';
import {arrFind} from '../utils';

export default {
  props: {
    artist: Object,
    album: {default: {}},
    hideByMbid: {
      default: true
    }
  },
  components: {LfmTrackList},
  // data () {
  //   return {selectedAlbum: null}
  // },
  // filters: {
  //   _hideByMbid (arr, hide) {
  //     return !hide ? arr : arr.filter((a, i) => a.mbid);
  //   },
  //   _showOnlySelected (arr, album) {
  //     return !album ? arr : [arr[this.items.indexOf(album)]];
  //   }
  // },
  route: {
    data (transition) {
      var params = transition.to.params;

      return {album: LastFM.getAlbum({artist: params.artistName, album: params.albumName})};
    }
  },
  methods: {
    getPlaycountWidth (playcount) {
      return (playcount / this.album.$maxPlaycount * 80 || 0) + '%';
    }
  },
  ready () {
    var albumName = this.$route.params.album;
    if(albumName) {
      var find = arrFind(this.items, (i) => i.name.toLowerCase() === albumName.toLowerCase());
      if(find)
        setTimeout(()=>{
            this.selectAlbum(find);
        }, 500)
    }
  }
}
</script>
<template lang="jade">

.lfm-artist-album(v-if="!$loadingRouteData")
  span.lfm-artist-album-name {{* album.name}}
  img.lfm-artist-album-cover(src="{{{* album.image[2]['#text']}}}")
  .lfm-artist-album-date {{album.date}}
    //- .lfm-artist-album-playcount(style="width: {{* getPlaycountWidth(album.playcount)}}")
lfm-track-list(:artist="artist", :tracks="album.tracks", :hide-by-mbid="false")
</template>

<style lang="stylus">
  
@media (min-width: 450px)
  div.lfm-artist-album

    .lfm-artist-album-name
      border-bottom: 4px solid #E8E8E8
    .lfm-artist-album-cover
      top: initial
      height: 180px
      width: 180px
      bottom: 0
      z-index: 1000
      right: 10px
      border: 3px solid white
</style>
