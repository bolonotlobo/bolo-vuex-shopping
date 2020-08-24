<template>
  <div>
    <h3>购物车列表</h3>
    <ul>
      
      <li v-if="item.quantity" v-for="item in getCartListInfo" :key="item.id">
        {{item.id}} --{{item.name}} --{{item.price | currency}} X {{item.quantity}}
        <button
        :disabled="!item.quantity"
          @click="decrementQuantity(item)"
        >－</button>
      </li>
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
    // 不应该在这里 去 dispatch 初始化购物车，而应该在 products 拿到数据后 再去dispatch
    // this.$store.dispatch("cart/initializeCartList");
  },
  watch: {
    cartList: {
      deep: true,
      handler(newVal) {
        localStorage.setItem("cartList", JSON.stringify(newVal));
      }
    }
  },
  methods: {
    decrementQuantity(item) {
      this.$store.dispatch("cart/decrementQuantity", item.id);
    }
  }
};
</script>

<style scoped >
</style>