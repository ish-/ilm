<script lang="babel">
import Vue from 'vue';
import VK from '../vk.service';
import UserSection from './UserSection.vue';


export default {
  components: UserSection.components,
  created: UserSection.created,
  data: UserSection.data,
  route: UserSection.route,
  methods: {
    getProfile: (userId) => VK.getGroup(userId),
    loadScroll: UserSection.methods.loadScroll,
  },
  created: UserSection.created,
}

</script>
<template lang="jade">

section.user-section(v-detect-scroll)
  header.header-profile
    .user-name {{user.name}}
    img.user-avatar(:src="user.photo_100")
  .entity
    button.entity-audios(v-link="{name: 'club-audios', params: {userId: userId}}") Audios
    button.entity-posts(v-link="{name: 'club-posts', params: {userId: userId}}") Posts
    //- button.entity-groups(v-link="{name: 'user', params: {id: id, entity: 'groups'}}") Groups
    //- button.entity-friends(v-link="{name: 'user', params: {id: id, entity: 'friends'}}") Friends
  .loading-beach(v-show="$loadingRouteData") ...loading beach
  router-view(keep-alive, transition="fade", :group="true")

</template>
<style lang="stylus">

.group-section
  .entity button
    width: 30%

    &.v-link-active
      width: 70%

</style>