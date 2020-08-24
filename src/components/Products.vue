<template>
  <div>
    <h3>商品列表</h3>
    <ul>
      <li v-for="product in products" :key="product.id">
        {{product.id}} -- {{product.name}}--{{product.price | currency}}--{{product.inventory}}
        <button
          @click="addToCart(product)"
        >加入购物车</button>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState("products", ["products"])
  },
  // 从后端获取数据，渲染 列表
  created() {
    this.$store.dispatch("products/getAllProducts");
  },
  methods: {
    addToCart(product) {
      // dispatch cart actions
      this.$store.dispatch("cart/addToCart", product);
    }
  }
};
</script>

<style scoped >
</style>