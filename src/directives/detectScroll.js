import Vue from 'vue';
import {throttle} from '../utils';
var _ = {mediator: {}};
Vue.directive('detect-scroll', {
    params: ['onEndClose'],
    bind () {
      _.mediator = this.vm;
      this.throttledOnScroll = throttle(function (e) {
        var $el = this.el;
        if($el.scrollHeight - $el.offsetHeight - 500 < $el.scrollTop) {
          this.vm.$broadcast('scroll-end-close');
        }
          // this.params.onEndClose();
      }, 500, this);
      this.el.addEventListener('scroll', this.throttledOnScroll);
    },
    // update () {
    //   console.log(this.params);
    // },
    unbind () {
      this.el.removeEventListener('scroll', this.throttledOnScroll);
    }
});

export default _;