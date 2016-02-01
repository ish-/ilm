<script lang="babel">
import LastFM from '../lastfm.service';
import LfmTrackList from './LfmTrackList.vue';
import {arrFind} from '../utils';

export default {
  props: {
    // artist: Object,
    // items: Array,
    hideAByMbid: {
      default: false
    }
  },
  components: {LfmTrackList},
  data () {
    return {albums: []}
  },
  filters: {
    _hideAByMbid (arr, hide) {
      return !hide ? arr : arr.filter((a, i) => a.mbid);
    },
    // _showOnlySelected (arr, album) {
    //   return !album ? arr : [arr[this.items.indexOf(album)]];
    // }
  },
  route: {
    data (trns) {
      console.log(this);
      return {albums: LastFM.getArtistAlbums(trns.to.params.artistName)};
    }
  },
  methods: {
    // selectAlbum (album) {
    //   this.selectedAlbum = album;
    //   if(!album.tracks) {
    //     var opts = album.mbid ? {mbid: album.mbid} : {artist: album.artist.name, album: album.name}
    //     LastFM.getAlbum(opts).then((_album) => {
    //       console.log(album, _album);
    //       album.tags = _album.tags;
    //       album.tracks = _album.tracks.track;
    //     })
    //   }
    // },
    getAlbumImage (album) {
      return album.image.large || album.image.medium || album.image.small || '';
    },
    getPlaycountWidth (playcount) {
      return (playcount / this.items.$maxPlaycount * 80 || 0) + '%';
    },
    goToAlbum (album) {
      this.$route.router.go({name: 'lfm-artist-album', params: {
        albumName: album.name,
        artistName: this.$route.params.artistName
      }});
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

ul.lfm-artist-albums
  li.lfm-artist-album(v-for="album in albums | _hideAByMbid hideAByMbid | orderBy 'year'", @click="goToAlbum(album)", transition="fade") 
    span.lfm-artist-album-name {{* album.name}}
    .lfm-artist-album-cover(style="background-image: url(' {{{* getAlbumImage(album) }}} ');")
    .lfm-artist-album-date {{album.date}}
    .lfm-artist-album-playcount(style="width: {{* getPlaycountWidth(album.playcount)}}")
</template>
<style lang="stylus">

.lfm-artist-album
  padding: 16px
  color: black
  height: 80px
  position: relative
  border-top: 1px solid #EBEBEB

  // &-year
  //   position: absolute
  //   top: 10px
  //   right: 10px
  //   color: white
  //   text-shadow: 0 0 3px black
  //   font-size: 10px

  &:first-child
    border-top: 0px

  &-playcount
    size: 0 3px
    background: #C4FAFF
    absolute: bottom 1px right 0

  &-cover
    absolute: top right
    background-size: 100%
    size: 80px

  &-name
    absolute: left 16px top 16px right 130px
    overflow: hidden
    font-size: 24px
    white-space: nowrap
    text-overflow: ellipsis
  &-date
    font-weight: bold
    absolute: bottom 3px left 30%

</style>