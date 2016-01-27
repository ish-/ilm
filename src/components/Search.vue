<script lang="babel">

export default {

}

</script>
<template lang="jade">

section.audios-section(v-detect-scroll)
  header.header-search Search
  audio-list(:items="items", :per="per")

</template>
<style lang="stylus">

</style>