<script lang="babel">

export default {

}

</script>
<template lang="jade">

.menu-left
  a(v-link="'/user'") My Account
  a(v-link="'/audios'") Audios
  a(v-link="'/groups'") Groups
  a(v-link="'/friends'") Friends
  a(v-link="'/bookmarks'") Bookmarks

</template>
<style lang="stylus">
.menu-left {
  transition: .2s transform;
  // z-index: 100;
  // transform: translateX(-320px);
  position: fixed;
  background: #606060;
  top: 0;
  width: 100%;
  max-width: 320px;
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
  display: block;
  padding: 22px 0 22px 69px;
  height: 29px;
  color: white;
}

.menu-left a:first-child {
  background: #565656;
}
</style>