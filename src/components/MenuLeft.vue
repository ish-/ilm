<script lang="babel">
import VK from '../vk.service';
import LastFM from '../lastfm.service';

export default {
  data () {
    return {vk: VK, lfm: LastFM};
  },
  // methods: {
  //   vkAuth: VK.auth,
  //   vkServerAuth: ::VK.serverAuth,
  //   lfmAuth: LastFM.auth,
  //   vkServerAuthed: VK.serverAuthed,
  // },
  // computed: {
  //   lfmAuthed () { return LastFM.authed },
  //   vkAuthed () { return VK.authed },
  // }
}

</script>
<template lang="jade">

.menu-left
  a(v-link="'/user'") My Account
  a(v-link="{name: 'search'}") Search
  .auth
    button.btn-auth(@click="vk.auth", v-show="!vk.authed") vk auth
    button.btn-auth(@click="vk.serverAuth", v-show="!vk.serverAuthed") vk server auth
    button.btn-auth(@click="lfm.auth", v-show="!lfm.authed") lastfm auth
  //- a(v-link="{name: 'groups'}") Groups
  //- a(v-link="{name: 'friends'}") Friends
  //- a(v-link="{name: 'bookmarks'}") Bookmarks

</template>
<style lang="stylus">
.menu-left {
  transition: .2s transform;
  // z-index: 100;
  // transform: translateX(-320px);
  position: fixed;
  //background: #606060;
  background-color: #46454d;
  top: 0;
  width: 288px;
  //max-width: 320px;
  left: 0;
  height: 100%;

  .auth {
    margin: 20px
  }
}

.menu-left .toggle {
  position: absolute;
  top: 30px;
  right: -30px;
}


.menu-left a {
  cursor: pointer;
  background: #46454D;
  display: block;
  font-size: 16px;
  padding: 22px 0 22px 72px;
  height: 29px;
  color: #7F7F7F;
  transition: .2s background
  height: 56px
}
  

// .menu-left a:first-child
//   background: #565656
</style>