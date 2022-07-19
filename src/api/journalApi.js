import axios from "axios";

const journalAPI = axios.create({
  baseURL: 'https://vue-journal-4947d-default-rtdb.firebaseio.com',
})


// Crear un interceptor en el journal
journalAPI.interceptors.request.use( (config) => {
  config.params = {
    auth: localStorage.getItem('idToken')
  }

  return config
})

export default journalAPI