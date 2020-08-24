<template>
  <div>
    <h3>购物车列表</h3>
    <ul>
      <li
        v-for="item in getCartListInfo"
        :key="item.id"
      >{{item.id}} --{{item.name}} --{{item.price | currency}} X {{item.quantity}}</li>
    </ul>
    <p>总价格: {{getTotalPrice | currency}}</p>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
export default {
  computed: {
    ...mapState("cart", ["cartList"]),
    ...mapGetters("cart", ["getCartListInfo", "getTotalPrice"])
  },
  created() {
    // 通过 localStorage 初始化购物车
    this.$store.dispatch("cart/initializeCartList");
  },
  watch: {
    cartList: {
      deep: true,
      handler(newVal) {
        localStorage.setItem("cartList", JSON.stringify(newVal));
      }
    }
  }
};
</script>

<style scoped >
</style>