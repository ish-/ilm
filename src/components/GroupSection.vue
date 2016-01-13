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
    getAudios: (id) => VK.getAudios(-id),
    getWall: (id) => VK.getWall(-id),
    getUser: (id) => VK.getGroup(id),
    // getFriends: (id) => VK.getFriends(id)
  }
}

</script>
<template lang="jade">

section.user-section.group-section
  header 
    .user-name {{user.name}} dsf
    img.user-avatar(:src="user.photo_100")
  .user-entity
    button.user-entity-audios(v-link="{path: '/club/' + id + '/audios'}") Audios
    button.user-entity-posts(v-link="{path: '/club/' + id + '/posts'}") Posts
    //- button.user-entity-groups(v-link="{path: '/user/' + userId + '/groups'}") Groups
    //- button.user-entity-friends(v-link="{path: '/user/' + userId + '/friends'}") Friends
  .loading-beach(v-show="$loadingRouteData", transition="fade") ...loading beach
  div(v-if="items.length", transition="fade")    
    div(:is="entity", :items="items", transition="fade")
  //- post-list(:posts="items", v-if="entity === 'posts' && items.length", transition="fade")
  //- audio-list(:audios="items", v-if="entity === 'audios' && items.length", transition="fade")
  //- friend-list(:friends="items", v-if="entity === 'friends' && items.length", transition="fade")

</template>
<style lang="stylus">

.group-section
  .user-entity button
    width: 30%

    &.v-link-active
      width: 70%

</style>