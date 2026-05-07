import axios from "axios";

const API = axios.create({
  baseURL: "https://tienda-backend-prdl.onrender.com"
});

export default API;
