import VK from './vk.service';

export default class VkOwnerAudios {
  count = 200;

  constructor (ownerId) {
    this.ownerId = ownerId || VK.userId;
  }
  get (offset, count) {
    return VK._request({url: 'audio.get', data: {
      owner_id: (this.ownerId), 
      count: count || this.count,
      offset: offset || 0,
    }}).then(this.onGet);
  }
  getMore (_items) {
    if(_items && !_items.$loading && _items.length != null) {
      _items.$loading = true;
      return this.get(_items.length).then(({count, items}) => {
        _items.$count = count;
        _items.push.apply(_items, items);
        _items.$loading = false;
        return _items;
      });
    }
    return false;
  }
  onGet = ({count, items}) => {
    items.$count = count;
    return items;
  };
}