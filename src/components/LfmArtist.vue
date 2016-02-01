<script lang="babel">
import LastFM from '../lastfm.service';
import VK from '../vk.service';
// import LfmTrackList from './LfmTrackList.vue';
// import LfmAlbumList from './LfmAlbumList.vue';
import {compareInLower} from '../utils';

export default {
  // components: {LfmTrackList, LfmAlbumList},
  data () {
    return {
      vk: VK,
      artist: {}, 
      name: '', 
      // tabName: 'tracks', 
      // hideTByMbid: true, 
      // hideAByMbid: true, 
      error: false, 
    };
  },
  route: {
    data (transition) {
      // this.entity = this.$route.params.entity || (this.$route.params.album && 'albums');
      // this.showTracks = this.entity === 'tracks';

      // var request;
      // console.log(this.$route.params)
      // if(this.entity === 'albums' && !this.albums.length) {
      //   request = {albums: this.artistPromise.then((artist) => {
      //     return LastFM.getArtistAlbums(this.name)
      //       // .then((albums) => {this.albums = albums});
      //   }).catch(Promise.resolve.bind(Promise))};
      // }

      // return request || this.artistPromise;
      console.log('asd', transition.to);
      var artistName = transition.to.params.artistName.trim();

      if(compareInLower(this.name, artistName))
        return transition.next();

      this.name = artistName;
      this.artist = {};

      return {artist: LastFM.getArtist(this.name)
        .catch(() => {
          this.error = true;
          transition.next();
        })
      };
    }
  },
  methods: {
    alert () {
      this.$dispatch('alert', Math.random()*1000);
    },
    getArtistImage () {
      console.log('getArtistImage call;')
      if(!this.artist.image)
        return;
      return this.artist.image.extralarge || this.artist.image.large || this.artist.image.medium || '';
    }
  },
  created () {

  },
  // methods: {
  //   checkEntity (entity) {
  //     return entity === this.entity;
  //   }
  // },
}

</script>
<template lang="jade">
section.lfm-artist-section()
  header(style="background-image: url('{{{getArtistImage()}}}')")
    h1 {{ artist.name || name}}
    template(v-if="artist.name && !error")
      .artist-tags
        .artist-tag(href="{{{* tag.href}}}", v-for="tag in artist.tags") {{*tag.name}}
      //- img.artist-image(src="{{{* artist.image}}}") 
      .artist-counters listeners: {{* artist.stats.listeners}}<br/>scrobbles: {{* artist.stats.playcount}}
      .artist-entities
        .entity(v-link="{name: 'lfm-artist-tracks', params: {artistName: name}}") tracks
        .entity(v-link="{name: 'lfm-artist-albums', params: {artistName: name}}") albums
        .entity(v-link="{name: 'lfm-artist-similars', params: {artistName: name}}") similars
        //- .entity(v-link="{name: 'lfm-artist', params: {entity: 'bio', artist: name}}") bio
  .loading-beach(v-show="$loadingRouteData") ...loading beach
  div(v-if="error") Artist not found
  div(v-if="artist.name && !error && !$loadingRouteData")
    router-view(:tracks="artist.tracks")
    //- ul.artist-albums(v-if="entity === 'albums'")
    //-   li.artist-album(href="{{album.name}}", v-for="album in albums | hideAByMbid hideAByMbid") {{album.name}}
    //- lfm-track-list(v-if="checkEntity('tracks')", :items.once="artist.tracks")
    //- lfm-album-list(v-if="checkEntity('albums')", :items.sync="albums")
    //- ul.artist-tracks(v-if="entity === 'tracks'")
    //-   li.artist-track(href="{{track.name}}", v-for="track in artist.tracks | _hideTByMbid hideTByMbid", @click="searchAndPlay(track)", transition="translateX") {{track.name}}
    //-     .artist-track-listeners(style="width: {{* (track.listeners / artist.$maxListeners * 30 + '%')}}")
    //-   button.artist-tracks-show-all(@click="hideTByMbid = false", v-show="hideTByMbid") show all
</template>
<style lang="stylus">

.lfm-artist-section
  padding-top: 0

  header
    height: auto
    color: white
    min-height: 165px
    background-color: lighten(#46454D, 70%)
    // background: linear-gradient(to bottom, rgba(98,97,105,1) 0%, rgba(70,69,77,1) 2%, rgba(98,97,105,1) 98%, rgba(70,69,77,1) 100%);
    padding: 22px 26px 0
    font-weight: normal
    line-height: normal
    position: relative
    opacity: 1
    margin-bottom: 30px
    min-height: 80px
    background-size: cover
    background-position: center center

    &:after
      content: ''
      absolute: top left right bottom
      background-color: black
      opacity: .7
      transition: .2s opacity
      z-index: -1

    &:hover:after
      opacity: .5

    h1
      font-weight: normal
      font-size: 36px

    .artist-tags 
      margin-bottom: 16px
      margin-top: 8px
      .artist-tag
        font-size: 14px
        background: #DCDCDC
        color: #141414
        border-radius: 4px
        padding: 0 6px
        height: 18px
        line-height: 18px
        margin-right: 15px
        display: inline-block

      &:last-child
        margin-right: 0px

    // .artist-image
    //   absolute: left 26px bottom -26px
    //   size: 100px
    //   border-radius: 100px
    //   margin-right: 16px

    .artist-counters
      // padding-left: 142px
      color: #9F9D9D
      font-size: 14px
      margin-top: 15px
      margin-bottom: 12px

    .artist-entities
      // padding-left: 120px
      color: #D8D8D8

      .entity
        cursor: pointer
        font-size: 18px
        padding: 6px
        margin-right: 10px
        display: inline-block

        &.v-link-active
          box-shadow: 0px -8px 0 -4px #fff inset

  ul
    color: black
    list-style: none

  .lfm-artist-collection
    white-space: initial;
    height: initial;
</style>