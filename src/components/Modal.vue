<script lang="babel">

export default {
  data () {
    return {
      modalPath: [],
    }
  },
  methods: {
    onHashChange () {
      if(location.hash[1] === '!') {
        this.modalPath = location.hash.slice(3).split('/');
      } else {
        console.log('clear');
        location.hash = '';
      }
      console.log(this.modalPath);
    }
  },
  ready () {
    window.addEventListener('hashchange', this.onHashChange);
    this.onHashChange();
    this.$watch('modalPath',function(){
      console.log('modalPath', modalPath);
    })
  },
  // components: {
  //   name: 'lastfm-artist',
    
  // }
}

</script>
<template lang="jade">

//- .modal
  //- .modal-body(:is="modalPath[0]")

</template>
<style lang="stylus">

</style>