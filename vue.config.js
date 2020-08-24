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