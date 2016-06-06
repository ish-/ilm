<script lang="babel">
import Vue from 'vue';
import VK from '../vk.service';
import '../filters/slice';

export default Vue.extend({
  name: 'FriendList',
  props: {
    items: {
      type: Array,
      default: [],
    },
    per: {
      type: Number,
      default: 500,
    },
  },
  data () {
    return {filterValue: ''}
  },
  methods: {
    goToFriend (friend) {
      this.$route.router.go({name: 'user-posts', params: {id: friend.id}});
    },
    getEntity () {
      return VK.getFriends(this.userId, this.items);
    },
    getUserLink: (user) => '/user/' + user.id + '/posts',
  },
  filters: {
    filterByName (arr, val) {
      if (!val || val.length < 3)
        return arr;
      val = val.toLowerCase();
      return arr.filter((i) => {
        return (i.last_name + ' ' + i.first_name).toLowerCase().indexOf(val) > -1;
      });
    }
  }
});

</script>
<template lang="jade">

.friend-collection
  input.search(v-model="filterValue")
  a.friend(href="{{{* getUserLink(friend)}}}", v-for="friend in items | filterByName filterValue", track-by="id")
    .friend-container
      img.friend-avatar(:src="friend.photo_100")
      .friend-lname {{* friend.last_name}}
      .friend-fname {{* friend.first_name}}

</template>
<style lang="stylus">
.friend-collection
  text-align: center
  background: white
.friend
  padding: 5px
  background: #4c4c4c
  font-size: 16px
  display: inline-block
  width: 100px;
  margin: 20px 2% 0;
  border-radius: 2px

  > *
    pointer-events: none

.friend-avatar
  size: 100px
  background: #4c4c4c
  border-radius: 3px
  border: 1px solid #616161

</style>