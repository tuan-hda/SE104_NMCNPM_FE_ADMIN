import axios from 'axios'

const appApi = axios.create({
  baseURL: 'http://localhost:8081/api/'
})

export default appApi