<template>
  <div class="app">
    <ul class="nav">
      <router-link class="home" tag="li" to="/home">Home</router-link>
      <router-link tag="li" to="/market">Market</router-link>
    </ul>
      <router-view></router-view>
  </div>
</template>

<script>
export default {};
</script>

<style scoped >
/* .nav li.router-link-exact-active {
  color: red;
} */
.myactive{
  color: blue;
}

* {
  margin: 0;
  padding: 0;
}
ul,li {
  list-style-type: none;
}
.nav{
  width: 400px;
  display: flex;
  background-color:#3B6B5B;
  padding: 6px 8px;
  font-weight: 400;
}
.nav >li{
  width: 40%;
  display: flex;
  justify-content: flex-start;
  cursor: pointer;
}
</style>