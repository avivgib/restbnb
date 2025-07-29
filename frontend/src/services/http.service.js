import Axios from 'axios'

const BASE_URL = process.env.NODE_ENV === 'production'
    ? '/api/'
    : '//localhost:3030/api/'

const axios = Axios.create({ withCredentials: true })

export const httpService = {
    get(endpoint, data) {
        // console.log('Sending GET request to:', `${BASE_URL}${endpoint}`, 'with params:', data)
        return ajax(endpoint, 'GET', data)
    },
    post(endpoint, data) {
        // console.log('Sending POST request to:', `${BASE_URL}${endpoint}`, 'with data:', data)
        return ajax(endpoint, 'POST', data)
    },
    put(endpoint, data) {
        // console.log('Sending PUT request to:', `${BASE_URL}${endpoint}`, 'with data:', data)
        return ajax(endpoint, 'PUT', data)
    },
    delete(endpoint, data) {
        // console.log('Sending DELETE request to:', `${BASE_URL}${endpoint}`, 'with data:', data)
        return ajax(endpoint, 'DELETE', data)
    }
}

async function ajax(endpoint, method = 'GET', data = null) {
    const url = `${BASE_URL}${endpoint}`
    const params = (method === 'GET') ? data : null

    const options = { url, method, data, params }

    try {
        const res = await axios(options)
        return res.data
    } catch (err) {
        console.error(`Had Issues ${method}ing to the backend, endpoint: ${endpoint}, with data: `, data)
        console.dir(err)
        if (err.response && err.response.status === 401) {
            sessionStorage.clear()
        }
        throw err
    }
}