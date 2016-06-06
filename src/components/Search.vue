<script lang="babel">
import {compareInLower} from '../utils';
import AudioList from './AudioList.vue';
import LfmArtistList from './LfmArtistList.vue';

import VK from '../vk.service';
import LastFM from '../lastfm.service';

export default {
  components: {AudioList, LfmArtistList},
  data () {
    return {items: [], searchVal: '', artists: []};
  },
  route: {
    data (trns) {
      console.log(trns.to);
      var q = trns.to.query.q;
      q = q ? decodeURIComponent(q) : false;
      if(!q || q === this.q)
        return trns.next();
      // debugger;
      this.q = q;
      this.searchVal = q;
      return {
        items: VK.searchAudios(q, 100),
        artists: LastFM.searchArtist(q),
      }
    }
  },
  methods: {
    search (q) {
      return this.$router.go({name: 'search', query: {q}});
    },
  }
}

</script>
<template lang="jade">

section.search-section
  header
    input.search(placeholder="Search..", v-model="searchVal", @keydown.enter="search(searchVal)")
  .loading-beach(v-show="$loadingRouteData") ...loading beach
  .scrollable-y(v-show="!$loadingRouteData", v-detect-scroll)
    lfm-artist-list(v-if="artists.length", :items="artists")
    audio-list(v-if="items.length", :items="items")

</template>
<style lang="stylus">

.search-section
  header
    display: flex

    .search
      box-shadow: 0 0 0 1px #272727 inset, 0 0 2px 1px white inset
      color: white
      background-color: #353535
      margin: auto
      display: block

</style>