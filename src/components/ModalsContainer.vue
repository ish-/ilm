<script lang="babel">

import Modals from '../modal.service';
import AudioListContext from './AudioListContextModal.vue';
import VkServerAuth from './VkServerAuthModal.vue';

export default {
  components: {AudioListContext, VkServerAuth},
  data () {
    return {modals: Modals} // {name, data}[]
  },
  created () {
    this.$root.$on('modal:show', ::this.modals.push);
    document.addEventListener('keydown', (e) => {
      if(e.keyCode === 27)
        this.modals.shift();
    })
  },
}

</script>
<template lang="jade">

.modals
  .modal(class="{{* modal.name}}", :is="modal.name", v-for="modal in modals", :data.sync="modal.data", @close="modals.$remove(modal)", transition="modal")

</template>
<style lang="stylus">

.modal
  &-transition
    transition: all .5s
    opacity: 1

    .modal-body
      transition: .4s all
      transform: translateY(0)

  &-enter
    opacity: 0

    .modal-body
      transform: translateY(-100%)

  &-leave
    opacity: 0

    .modal-body
      transform: translateY(100%)

.modal
  fixed: top left right
  size: 100%
  background-color: rgba(0,0,0, .7)
  padding: 10px
  display: flex
  align-items: center
  justify-content: center
  z-index: 800
  font-size: 16px

  &-close
    absolute: top 10px right 10px
    size: 30px
    border-radius: 30px
    background: rgba(255,255,255,.3)
    font-size: 16px
    color: white
    text-shadow: 0 0 1px black

  &-body
    flex-grow: 1
    max-width: 620px
    margin: 0 auto
    max-height: 90%
    overflow-y: auto
    background: white
    border: 1px solid #aaa
    box-shadow: 0 0 3px 0 grey

  &-content, &-footer
    padding: 20px

  &-footer
    padding-top: 0
    text-align: center

</style>