import axios from "axios";

export function getFile(fileUrl: string) {
  return axios.get(fileUrl).then((res) => res.data);
}

export function revalidatePages(pwd: string, paths: string[]) {
  return axios.post("/api/revalidate", { pwd, paths }).then((res) => res.data);
}
