import apis from './apis'
import axios from 'axios'

const ajax = axios.create({
    baseURL:apis.baseUrl
})

export const getAllProducts = ()=> ajax.get(apis.getAllProducts)
