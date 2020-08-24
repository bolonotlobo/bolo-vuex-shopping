import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import products from './modules/products'
import cart from './modules/cart'

const store = new Vuex.Store({
    strict: true,
    state: {
    },
    mutations: {

    },
    actions: {
  
    },
    modules: {
        products,cart
    }
})

export default store