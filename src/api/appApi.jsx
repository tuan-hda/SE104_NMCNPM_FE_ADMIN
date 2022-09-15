import axios from 'axios'

const appApi = axios.create({
  baseURL: 'https://hambursy-server.herokuapp.com/api/'
})

export default appApi