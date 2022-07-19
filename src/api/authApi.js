import axios from "axios";

const authAPI = axios.create({
  baseURL: 'https://identitytoolkit.googleapis.com/v1/accounts',
  params: {
    key: 'AIzaSyD9CoH_g8um9S2XmH_D3gpR43-c3EaUUWw'
  }
})

export default authAPI