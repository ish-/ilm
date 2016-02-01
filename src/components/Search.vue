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
        items: VK.searchAudios(q),
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

section.audios-section(v-detect-scroll)
  header.header-search 
    input.search(placeholder="Search..", v-model="searchVal", @keydown.enter="search(searchVal)")
  div(v-if="!$loadingRouteData")
    lfm-artist-list(:items="artists")
    audio-list(:items="items")

</template>
<style lang="stylus">

</style>