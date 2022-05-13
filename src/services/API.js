import axios from "axios";

const options = {
  baseURL: window.location.host === '127.0.0.1:3000' || window.location.host === 'localhost:3000' ? 'http://127.0.0.1:8000' : `${window.location.protocol}//${window.location.host}/`,
  headers: { 'Token': localStorage.getItem('id') + '-' + localStorage.getItem('token') },
  validateStatus: (status) => {
    return status < 400;
  }
}

const API = axios.create(options)

export default API;