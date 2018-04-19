import {svaeToLocal, loadFromLocal} from '@/common/js/store.js'

describe('--test--store.js', () => {
  const initData = [{'id': 1, 'name': 'first'},{'id': 2, 'name': 'second'}]
  var u = window.navigator.userAgent, app = window.navigator.appVersion;
  console.log(u);
  // 因为不支持window.localStorage故放弃
})