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
    getEntityMethod: function () {
      var req;
      if(this.entity === 'posts') req = this.getWall();
      else if (this.entity === 'audios') req = this.getAudios();
      return req;
    },
    getAudios: function () { return VK.getAudios(-this.id, this.items) },
    getWall: function () { return VK.getWall(-this.id, this.items) },
    getUser: (id) => VK.getGroup(id),
    // getFriends: (id) => VK.getFriends(id)
  },
  created: UserSection.created,
}

</script>
<template lang="jade">

section.user-section.group-section
  header 
    .user-name {{user.name}}
    img.user-avatar(:src="user.photo_100")
  .entity
    button.entity-audios(v-link="{path: '/club/' + id + '/audios'}") Audios
    button.entity-posts(v-link="{path: '/club/' + id + '/posts'}") Posts
    //- button.entity-groups(v-link="{path: '/user/' + userId + '/groups'}") Groups
    //- button.entity-friends(v-link="{path: '/user/' + userId + '/friends'}") Friends
  .loading-beach(v-show="$loadingRouteData", transition="fade") ...loading beach
  div(v-if="items.length", transition="fade")    
    div(:is="entity", :items="items", transition="fade")
  //- post-list(:posts="items", v-if="entity === 'posts' && items.length", transition="fade")
  //- audio-list(:audios="items", v-if="entity === 'audios' && items.length", transition="fade")
  //- friend-list(:friends="items", v-if="entity === 'friends' && items.length", transition="fade")

</template>
<style lang="stylus">

.group-section
  .entity button
    width: 30%

    &.v-link-active
      width: 70%

</style>