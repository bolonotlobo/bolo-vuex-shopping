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
        }
    },
    actions: {
        addToCart({ commit, state }, product) {
            // 判断购物车中是否已经存在
            const cartItem = state.cartList.find(v => v.id === product.id)
            if (cartItem) { // 如果有
                commit('INCREMENT_QUANTITY', { id: product.id })
            } else { // 没有
                commit('ADD_TO_CART', { id: product.id, quantity: 1 })
            }
        }
    }
}

