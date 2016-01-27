<script lang="babel">

export default {

}

</script>
<template lang="jade">

.menu-left
  a(v-link="'/user'") My Account
  a(v-link="{name: 'audios'}") Audios
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
  background-color: white;
  top: 0;
  width: 288px;
  //max-width: 320px;
  left: 0;
  height: 100%;
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
}

.menu-left a.v-link-active
  background: #5DE3EE
  

// .menu-left a:first-child
//   background: #565656
</style>