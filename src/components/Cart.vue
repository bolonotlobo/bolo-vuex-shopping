<template>
  <div>
      <h3>购物车列表</h3>
      <ul>
          <li v-for="item in getCartListInfo" :key="item.id">
              {{item.id}} --{{item.name}} --{{item.price | currency}} X {{item.quantity}}
          </li>
      </ul>
      <p>总价格: {{getTotalPrice | currency}}</p>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  computed: {
      ...mapGetters('cart',['getCartListInfo','getTotalPrice'])
  }
};
</script>

<style scoped >
</style>