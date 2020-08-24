export default {
    namespaced: true,
    state: {
        cartList: []
    },
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
        },
        getTotalPrice: (state, getters) => {
            return getters.getCartListInfo.reduce((total, item) => {
                return total + item.price * item.quantity
            }, 0)
        }
    },
    mutations: {
        ADD_TO_CART: (state, { id, quantity }) => {
            state.cartList.push({ id, quantity })
        },
        INCREMENT_QUANTITY: (state, { id }) => {
            state.cartList.find(v => v.id === id).quantity++
        },
        INITIALIZE_CART_LIST: (state, cartList) => {
            state.cartList = cartList
        },
        DECREMENT_QUANTITY: (state, id) => {
            // 购物车数量减1
            state.cartList.find(v => v.id === id).quantity--
        }

    },
    actions: {
        /**
         * 加入购物车
         * @param {*} param0 
         * @param {*} product 
         */
        addToCart({ commit, state }, product = {}) {
            // 判断是否有库存
            if (product.inventory > 0) {
                // 判断购物车中是否已经存在
                const cartItem = state.cartList.find(v => v.id === product.id)
                if (cartItem) { // 如果有
                    commit('INCREMENT_QUANTITY', { id: product.id })
                } else { // 没有
                    commit('ADD_TO_CART', { id: product.id, quantity: 1 })
                }
                // 加入购物车后减少库存
                commit('products/DECREMENT_INVENTORY', { id: product.id }, { root: true })
            }
        },
        /**
         * 如果 localStorage 有 cartList 信息 初始化购物车
         * @param {*} param0 
         */
        initializeCartList({ commit }) {
            const cartList = JSON.parse(localStorage.getItem('cartList'))
            commit('INITIALIZE_CART_LIST', cartList || [])
        },
        decrementQuantity({ commit }, id) {
            // cartList quantity -1
            // products inventory +1
            // 没有 事务 怎么办？
            commit('DECREMENT_QUANTITY', id)
            commit('products/INCREMENT_INVENTORY',id,{root:true})
        }
    }
}

