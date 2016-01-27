var RouteDataVkEntityList = {
  route: {
    data (trnstn) {
      // console.log(`Mixin ${this.$vm.name} route.data()`, trnstn.to.params);
      var userId = trnstn.to.params.userId;
      if(this.userId === userId) {
        trnstn.next();
        this.restoreScroll();
        return;
      }
      this.userId = userId;
      this.items.length = 0;

      return {items: this.getEntity()};
      // return {items: VK.getWall(this.userId, this.items)};
    },
    deactivate () {
      this.scrollTop = this.$el.scrollTop || 0;
    },
  },
  methods: {
    restoreScroll () {
      this.$nextTick(d => this.$el.scrollTop = this.scrollTop);
    }
  }
};

export default RouteDataVkEntityList;