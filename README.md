# vuex-test

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

# vuex 购物车项目练手总结

### 1. 路由激活高亮显示
1. 方法一：
    + `.router-link-exact-active`
    ```html
        <!--App.vue-->
        <template>
          <div class="app">
            <div class="nav">
              <router-link tag="li" to="/home">Home</router-link>
              <router-link tag="li" to="/market">Market</router-link>
              <router-view></router-view>
            </div>
          </div>
        </template>
        
        <script>
        export default {};
        </script>
        
        <style scoped >
        .nav li.router-link-exact-active { // 高亮
          color: red;
        }
        </style>
    ```
2. 方法二： 
    + `linkActiveClass:我的样式名`
        ```js
        //router/index.js
            const routes = [
              { path: '/', redirect: '/home' },
              { path: '/home',component: ()=>import('@/views/Home')},
              { path: '/market',component: ()=> import('@/views/Market')}
            ]
            const router = new VueRouter({
              linkActiveClass: 'myactive', // .myactive 为路由激活样式名，在 App.vue 中定义 .myactive{ color: red; }
              routes
            })
        ```
    
### 2. 配置 devServer 模拟从后端获取数据
1. 根目录/vue.config.js
    ```js
        const products = [
            { id: 1, name: 'iphone', price: 800, inventory: 10 },
            { id: 2, name: 'iphone pro', price: 1000, inventory: 10 },
            { id: 3, name: 'iphone max', price: 1200, inventory: 10 },
        ]
        module.exports = {
            devServer: {
                before(app, serve) {
                    app.get('/api/products', (req, res) => {
                        res.json({
                            result: products
                        })
                    })
                }
            }
        }
    ```
2. `http://localhost:8080/api/products` 访问数据

### 3.开启严格模式
```js
const store = new Vuex.Store({
  // ...
  strict: true
})
/*
在严格模式下，无论何时发生了状态变更且不是由 mutation函数引起的，
将会抛出错误。这能保证所有的状态变更都能被调试工具跟踪到
*/
```
### 4. apis 请求接口配置
```js
/*
---apis
    |---apis.js
    |---index.js
*/
// apis.js
export default {
    baseUrl: 'http://localhost:8080/api',
    getAllProducts: '/products'
}

// index.js
import apis from './apis'
import axios from 'axios'

const ajax = axios.create({
    baseURL:apis.baseUrl
})

export const getAllProducts = ()=> ajax.get(apis.getAllProducts)

```

### 5. products/actions 获取商品信息
```js
import * as service from '@/apis/index.js'

 actions: {
        async getAllProducts({ commit }) {
            // 发起请求获取商品数据
            try {
                const ret = await service.getAllProducts()
                if (ret.status === 200) {
                    const products = ret.data.result
                    commit('SET_PRODUCTS',products)
                }
            } catch (err) {
                console.log(err)
            }
        }
    }
```
### 6. 渲染商品信息

### 7. 加入购物车
- 这里我们只把商品id和数量存入cartList，当然也可以存整个商品对象（这里不这么做）
    ```js
    //store/modules/products.js
        mutations: {
            ADD_TO_CART: (state, { id, quantity }) => {
                state.cartList.push({ id, quantity })
            },
            INCREMENT_QUANTITY: (state, { id }) => {
                state.cartList.find(v => v.id === id).quantity++
            }
        },
        actions: {
            addToCart({ commit, state }, product) {
                console.log('addToCart')
                // 判断购物车中是否已经存在
                const cartItem = state.cartList.find(v => v.id === product.id)
                if (cartItem) { // 如果有
                    commit('INCREMENT_QUANTITY', { id: product.id })
                } else { // 没有
                    commit('ADD_TO_CART', { id: product.id, quantity: 1 })
                }
            }
        }
    ```
### 8.获取购物车信息在购物车组件显示
- 这里就显得在购物车cartList存商品对象就方便展示了，但不想这么搞
```js
//store/modules/cart.js
    getters: {
        getCartListInfo: (state, getters, rootState) => {
            return state.cartList.map(({ id, quantity }) => {
                const product = rootState.products.products.find(v => v.id === id)
                return {
                    id,
                    name: product.name,
                    price: product.price,
                    quantity
                }
            })
        }
    },
```
### 9.计算总价格
```js
// store/modules/cart.js
    getTotalPrice: (state, getters) => {
        return getters.getCartListInfo.reduce((total, item) => {
            return total + item.price * item.quantity
        }, 0)
    }
```

### 10.减少库存，库存为0时按钮灰掉
```
//cart.js 提交 mutations 到 products.js
// 全局命名空间提交 mutations 需要加上 {root: true}
commit('products/DECREMENT_INVENTORY', { id: product.id }, { root: true })
```

### 11.全局过滤器
```js
// main.js
Vue.filter('currency', v => '$' + v)
```

### 12.数据持久化 这里存localstorage
- product.vue 和 cart.vue 里面都需要分别监听 products 和 cartList 这两个变量，发生改变就更新localStorage

### 13.购物车减少功能
- 购物车数量减少 ，商品列表库存增加。没有事务，怎么保证要么同时成功，要么同时失败呢

# 问题记录
### 1. 关于触发store中分模块后的子模块的action
- 描述：当子模块没有命名空间时，默认继承父模块的命名空间
当触发 Actions，会把父模块和子模块的都触发

> 官方： 默认情况下，模块内部的 action、mutation 和 getter 是注册在全局命名空间的——这样使得多个模块能够对同一 mutation 或 action 作出响应。

```js
--- store
    |---index.js
    |---modules
        |---products.js
        |---cart.js

// index.js  actions
getAllProducts(){
    console.log(111)
}

// products.js  actions
getAllProducts(){
    console.log(222)
}

// Products.vue 组件 dispatch
created(){
    this.$store.dispatch('getAllProducts')
}

// 结果分析
// 我们products 没有使用命名空间（namespaced:true) 时，这两个都会触发
// 输出结果： 
// 111
// 222

// 我们给 products.js 加上命名空间
// namespaced: true,

// 组件Products.vue dispatch
created(){
    this.$store.dispatch('products/getAllProducts')
}
```

### 2. mapState获取状态时子模块覆盖父模块 state 同名变量
```js
// store/index.js
state: {
    products: [1,2]
}

// store/modules/products.js
state: {
    prodcuts:[3,4]
}

// 组件中获取
computed: {
    ...mapState(['products']) // [3,4] 
}
// vuex.esm.js?2f62:721 [vuex] state field "products" was overridden by a module with the same name at "products"
```
- mapState 的参数
    + mapState(namespace?: string, map: Array<string> | Object<string | function>): Object
- 下面的几种写法
```js
// 1
computed: {
     products(){
         return this.$store.state.products.products
     }
}


// 2  函数形式 state作为形参传入
computed: mapState({
    /**
    products(state){
       return state.products.products 
    }
    */
    products:state=>state.products.products
})

// 3 对象形式
computed: mapState({
    products:'products'
})

// 4 展开运算 ...mapState
computed: {
    ...mapState('products',['products']) 
    // ...mapState('命名空间',对象/数组)
}
```

### 3.dispatch 如果有命名空间时
- this.$store.dispatch(命名空间/actions中方法名)
    + `this.$store.dispatch('cart/addToCart')`
    

### 4. 使用localStorage 持久化时遇到的问题<b style="color:red">【重点注意】</b>

```js
// cart.vue
 created() {
    // 通过 localStorage 初始化购物车
    this.$store.dispatch("cart/initializeCartList");
  }
  
// products.vue
  created() {
    // 如果localStorage 有就直接从里面拿，没有再去服务器取
    this.$store.dispatch("products/getAllProducts");
  },
  
// 出现的问题： 
/*
当时没注意，products.js 里面用的是mounted 去 dispatch 的
而 cart.js 里面是 created() 就 dispatch 了

而 cart.js 的 getters里面返回商品信息的时候需要根据 cartList 的 id，去查询
products 里面商品的price，name 这些属性。

那这个时候因为 生命周期的顺序 created 在 mounted 之前（虽然不同组件，
并不能保证 cart组件的 created 一定在 products 组件的 mounted 之前）

cart 组件 created 时拿到了数据更新了 cartList，getters从新开始计算（像计算属性），
但是这个时候 products 没有拿回来数据，所有  getCartListInfo 里面会出现 product的 属性没有定义会报错
error: Cannot read property 'name' of undefined"
*/

// cart.js
getters: {
    getCartListInfo: (state, getters, rootState) => {
        return state.cartList.map(({ id, quantity }) => {
            const product = rootState.products.products.find(v => v.id === id)
            return {
                id,
                name: product.name,
                price: product.price,
                quantity
            }
        })
    }
}
```

- 如何解决这个问题呢？
    + 就算都在 created() 里面dispatch 也不一定能保证吧？
    + 也就是 商品列表一定要在购物车列表之前先获取
```js
let products = JSON.parse(localStorage.getItem('products'))
if (products) {
    commit('SET_PRODUCTS', products)
      // 在这里去dispatch 
      // 先拿到 products 再去拿 cartList
    dispatch('cart/initializeCartList',null,{root:true})
}
```
