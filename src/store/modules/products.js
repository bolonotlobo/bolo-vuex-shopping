import * as service from '@/apis/index.js'

export default {
    namespaced: true,
    state: {
        products:[]
    },
    mutations: {
        SET_PRODUCTS: (state, products) => {
            state.products = products
        }
    },
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
}