import axios from 'axios'

let axiosInstance = axios.create({
    baseURL:"http://localhost:6377/api"
})
export {axiosInstance}