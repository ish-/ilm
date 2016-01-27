<script lang="babel">

import VK from '../vk.service';
import Vue from 'vue';
import AudioList from './AudioList.vue';

export default {
  name: 'AudioSection',
  data () {
    return {
      items: [],
      per: 200
    }
  },
  route: {
    data: () => ({ 
      items: VK.getAudios() 
    })
  },
  components: {AudioList},
  created () {
    this.$on('scroll-end-close', () => {
      this.per += this.per;
    });
  },
}

</script>
<template lang="jade">

section.audios-section(v-detect-scroll)
  header.header-search Audios
  audio-list(:items="items", :per="per")

</template>
<style lang="stylus">


</style>