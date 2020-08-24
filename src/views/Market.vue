<template>
  <div>
    <Products />
    <Cart />
  </div>
</template>

<script>
import Cart from "@/components/Cart";
import Products from "@/components/Products";
export default {
  components: {
    Cart,
    Products
  }
};
</script>

<style scoped >
</style>