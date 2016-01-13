<script lang="babel">

import VK from '../vk.service';
import Vue from 'vue';
// import Player from '../player.service';
import AudioList from './AudioList.vue';

var lazyTimeout = null;

export default {
  name: 'AudioSection',
  data () {
    return {
      audios: [],
      per: 50
    }
  },
  methods: {
    // onScroll (e) {
    //   console.log('scroll');
    //   if(lazyTimeout || this.per > this.audios.length)
    //     return;
    //   var $el = e.target;
    //   if(($el.scrollHeight - 400) < ($el.offsetHeight + $el.scrollTop))
    //     this.per += 50;
    //     lazyTimeout = setTimeout(()=>{
    //       lazyTimeout = null;
    //       this.onScroll(e);
    //     }, 100)
    // }
  },
  route: {
    data: () => ({ 
      audios: VK.getAudios() 
    })
  },
  components: {AudioList},
  created () {
    // this.$watch('slice', (a) => console.log(a))
    // VK.getAudios().then(({count, items}) => {
    //   console.log(items);
    //   this.audios = items;
    // });
  },
}

</script>
<template lang="jade">

section.audios-section(@scroll="onScroll")
  header(@click="per += per") Audios
  audio-list(:audios="audios", :per="per")

</template>
<style lang="stylus">


</style>