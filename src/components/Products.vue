<template>
  <div>
    <h3>商品列表</h3>
    <ul>
      <li v-for="product in products" :key="product.id">
        {{product.id}} -- {{product.name}}--{{product.price | currency}}--{{product.inventory}}
        <button
          :disabled="product.inventory===0"
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
  },
  watch: {
    products: {
      handler(newVal) {
        // 每次有改变就重新存localStorage
        // 有没有办法不深度监听，值监听 products.inventory 字段就可以了
        // 就像 React shouldComponentUpdate 
        localStorage.setItem('products',JSON.stringify(newVal))
      },
      deep: true
    }
  }
};
</script>

<style scoped >
</style>