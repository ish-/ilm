<script lang="babel">
import LastFM from '../lastfm.service';
import LfmTrackList from './LfmTrackList.vue';
import {arrFind} from '../utils';

export default {
  props: {
    artist: Object,
    album: {default: {}},
    hideAByMbid: {
      default: true
    }
  },
  components: {LfmTrackList},
  // data () {
  //   return {selectedAlbum: null}
  // },
  // filters: {
  //   _hideAByMbid (arr, hide) {
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

.artist-album(v-if="!$loadingRouteData")
  span.artist-album-name {{* album.name}}
  img.artist-album-cover(src="{{{* album.image[2]['#text']}}}")
  .artist-album-date {{album.date}}
    //- .artist-album-playcount(style="width: {{* getPlaycountWidth(album.playcount)}}")
lfm-track-list(:artist="artist", :items="album.tracks", :hide-by-mbid="false")
</template>
