<script lang="babel">

export default {
  data () {
    return {opened: false}
  },
  created () {
    window.addEventListener('click', () => this.opened = false)
  }
}

</script>
<template lang="jade">

.btn-header-dropdown(:class="{opened: opened}", @click.stop="opened = !opened")
  slot(name="selected")
  slot(name="select")

</template>
<style lang="stylus">

.btn-header-dropdown
  min-width: 48px
  position: relative
  min-height: 48px
  display: inline-block
  .icon
    width: 32px
    height: 32px
    position: absolute
    top: 4px
    left: 8px
  nav
    absolute: top left
    width: 48px
    border-radius: 3px
    background-color: transparent
    wdith: 48px
    height: 48px
    padding: 4px 0
    transition: .2s width, .2s height, .2s background-color
    &:hover
      box-shadow: 0 0 0 1px #272727 inset, 0 0 2px 1px white inset
    a
      color: white
      vertical-align: top
      min-width: 32px
      display: none
      position: relative
      // height: 32px
      line-height: 32px
      padding: 4px 14px 4px 48px
      
    span
      display: none
    a.v-link-active
      display: block
      
  &.opened
    // size: auto
    nav
      box-shadow: 0 0 0 1px #272727 inset, 0 0 2px 1px white inset
      background-color: #313131
      width: auto
      height: auto
      padding-bottom: 4px
    a
      display: block
      &.v-link-active
        // background-color: rgba(255,255,255,.1)
        color: #aaa
    span
      display: inline-block


</style>