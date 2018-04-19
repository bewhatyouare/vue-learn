export const gridListMixin = {
  methods: {
    getKey(id) {
      return (+(new Date())) + '_' + id + Math.random()
    },
    clickFlg(item) {
      this.$emit('select', item, 2)
    }
  }
}