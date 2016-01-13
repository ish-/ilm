<script lang="babel">
import Vue from 'vue';
import PlayerComponent from './Player.vue'
import MenuLeftComponent from './MenuLeft.vue'
import VK from '../vk.service';
import Player from '../player.service';

Vue.directive('audio-current', {
  bind () {
    this.vm.$route.router.afterEach(this.onRouterAfterEach.bind(this));
  },
  onRouterAfterEach (transition) {
    setTimeout(() => {this.update(this.lastAudioId)}, 1000);
  },
  update (curAudioId, oldAudioId) {
    var $old, $now;
    if(oldAudioId && ($old = this.el.querySelector('.aid-'+oldAudioId)))
      $old.classList.remove('playing');
    this.lastAudioId = curAudioId;
    if(curAudioId && ($now = this.el.querySelector('.aid-'+curAudioId))) {
      $now.classList.add('playing');
      console.log('audio-current found: ', $now)
    }
  },

});

export default {
  name: 'App',
  replace: false,
  components: {
    player: PlayerComponent,
    'menu-left': MenuLeftComponent,
  },
  data () {
    return { 
      authed: VK.authed, 
      currentAudio: Player.audioInfo,
      menuLeftToggled: false
    }
  },
  methods: {
    vkAuth: VK.auth
  },
  created () {
    this.$route.router.beforeEach(()=>{
      this.menuLeftToggled = false;
    })
  }
}

</script>
<template lang="jade">

menu-left
#wrapper(:class="{'menu-left-toggled': menuLeftToggled}")
  button.menu-left-toggle(@click="menuLeftToggled = !menuLeftToggled") menu-left
  .splash-start(v-show="!authed")
    button(@click="vkAuth") vk auth
  router-view(v-audio-current="currentAudio.id")
  player

</template>
<style lang="stylus">

#wrapper
  absolute: left right bottom top
  // overflow: hidden
  transition: .2s transform
  z-index: 10

section
  background: black
  padding-top: 73px
  padding-bottom: 78px
  absolute: top left right bottom
  overflow-y: auto
  overflow-x: hidden

  header, header.scrolled-up
    top: 0;
    height: 73px;
    line-height: 73px;
    color: white;
    opacity: .92;
    position: fixed;
    width: 100%;
    // padding-left: 50px;
    background: #4C4C4C;
    z-index: 200;

    transform: translateY(0px);
    transition: .2s transform;

  header.scrolled-down
    transform: translateY(-70px);

.menu-left-toggle
  absolute: left -40px top 20px
  z-index: 230
  padding: 10px
  background: white

.menu-left-toggled
  transform: translateX(320px)

@media screen and (min-width: 900px)
  #wrapper
    // padding-left: 320px
    margin-left: 320px

</style>