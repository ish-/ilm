import Vue from 'vue';

Vue.directive('post-text-spoiler', {
  bind () {
    this.onClick = this.onClick.bind(this);
  },
  update (html) {
    if(html)
      this.el.innerHTML = html;
    if(!this.binded) {
      setTimeout(() => {
        if(this.el.offsetHeight > 230) {
          this.el.classList.add('post-text-spoiler-hide');
          this.el.addEventListener('click', this.onClick);
          this.binded = true;
        }
      }, 50);
    }
  },
  binded: false,
  onClick (e) {
    var $el = e.target;
    console.log(this);
    $el.classList.remove('post-text-spoiler-hide');
    this.el.removeEventListener('click', this.onClick);
  },
  unbind () {
    this.el.removeEventListener('click', this.onClick);
  }
});