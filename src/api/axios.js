import axios from "axios";

const instance = axios.create({
  baseURL: "", // подставь нужный URL
  timeout: 10000
});

export default instance;
