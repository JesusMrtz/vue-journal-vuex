import axios from "axios";

const journalAPI = axios.create({
  baseURL: 'https://vue-journal-4947d-default-rtdb.firebaseio.com',
})

export default journalAPI