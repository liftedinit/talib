const Api = {
  endpoint: {
    blockinformation: "http://localhost:3000/blockinformation",
    blocklist: "http://localhost:3000/block",
    networkinformation: "http://localhost:3000/networkinfo",
  },
  options: {
    method: "GET",
    mode: "cors",
    headers: {
      "X-API-KEY": "1ab2c3d4e5f61ab2c3d4e5f6",
      "Access-Control-Allow-Origin": "*",
    },
  },
};

export default Api;
