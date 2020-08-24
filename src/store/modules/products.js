import * as service from '@/apis/index.js'

export default {
    namespaced: true,
    state: {
        products: []
    },
    mutations: {
        SET_PRODUCTS: (state, products) => {
            state.products = products
        },
        DECREMENT_INVENTORY: (state, { id }) => {
            state.products.find(v => v.id === id).inventory--
        }
    },
    actions: {
        async getAllProducts({ commit }) {
            // 判断 localStorage 里面是否存有 products
            let products = JSON.parse(localStorage.getItem('products'))
            if (products) {
                // localStorage 里有 products
                commit('SET_PRODUCTS', products)
            } else {
                try {
                    // 发起请求获取商品数据
                    const ret = await service.getAllProducts()
                    if (ret.status === 200) {
                        products = ret.data.result
                        // 在这里存 localStorage，没什么用啊，库存减少了都不知道，所以都在 watch 里对 localStorage进行保存
                        // localStorage.setItem('products',JSON.stringify(products))
                        commit('SET_PRODUCTS', products)
                    }
                } catch (err) {
                    console.log(err)
                }
            }

        }
    }
}