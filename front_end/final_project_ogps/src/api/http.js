import axios from "axios";

// axios 객체 생성
export default axios.create({
  baseURL: "http://localhost:9001/",
  headers:{
    "Content-Type":"application/json"
  }
});