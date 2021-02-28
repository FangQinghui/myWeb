import { message } from "antd";

//处理promise和fetch的兼容性以及引入
require("es6-promise").polyfill();
require("isomorphic-fetch");

//超时处理
let timeoutPromise = function (timeout, controller) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(new Response("timeout", { status: 521, statusText: "timeout " }));
      //超时自动关闭当前请求
      controller.abort();
    }, timeout);
  });
};

//处理get请求，传入参数对象拼接
let formatUrl = (obj) => {
  let params: any = Object.values(obj).reduce(
    (a, b, i) => `${a}${Object.keys(obj)[i]}=${b}&`,
    "?"
  );
  return params.substring(0, params.length - 1);
};

let Fetch = function (url, option: any = {}, signal) {
  option.headers = option.headers || {};

  //token
  // option.headers['Authorization'] = `${window.localStorage.getItem('Authorization')}`;
  // option.headers['Authorization'] = "Bearer eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiJlM2E2YjUzNzQ1YWE0ZjQwODZmMTIyMzZhNGJjOTIwNCIsImF1dGgiOiIwMSxhZG1pbiIsInVzZXJpZCI6MzE5ODMzMDQ0ODE0MjY2MzY4LCJzdWIiOiJhZG1pbiJ9.m9SuHmzXHrhx180bCuFlaCRl2QWYX8JPqr6RJY_nzCu-PMszIR_bZ5rPCQYxdTj3ZaMOxYRa8rfe0o8EbwSndw"

  option.signal = signal; //它可以用来 with/abort 一个Web(网络)请求
  option.credentials = "include"; //强制带cookie发送

  const m = (option.method || "get").toLocaleLowerCase(); //默认是get

  // 对于get请求做处理
  if (m == "get") {
    if (option.query) {
      url = url + formatUrl(option.query);
    }
  }

  //对非get类请求头和请求体做处理
  if (m === "post" || m === "put" || m === "delete" || m === "patch") {
    if (option.query instanceof FormData) {
      //上传文件
      option.body = option.query;
    } else {
      //上传JSON数据
      option.headers["Content-Type"] =
        option.headers["Content-Type"] || "application/json";
      option.body = JSON.stringify(option.query); //根据后台要求，如果有时候是java请求会用qs转

      //Content-Type被指定为 application/x-www-form-urlencoded.提交的表单数据会转换为键值对并按照 key1=val1&key2=val2 的方式进行编码
      //简单来说，qs 是一个增加了一些安全性的查询字符串解析和序列化字符串的库。
      //qs.parse()是将URL解析成对象的形式
      //qs.stringify()是将对象 序列化成URL的形式，以&进行拼接
    }
  }

  return new Promise((resolve, reject) => {
    fetch(url, option)
      .then((response) => {
        //处理 浏览器 200 500状态
        const { status } = response;
        if (status >= 500) {
          message.error("系统错误,请联系管理员");
        }
        return response;
      })
      .then((res) => parseJSON(res))
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        console.log("err", error);
        reject(error);
      });
  });
};

//response 转化
function parseJSON(response) {
  return response.json();
}

let timeout = 60000; // 请求超时时间
let controller;

let request = (url, option) => {
  controller = new AbortController();
  let signal = controller.signal;
  return Promise.race([
    timeoutPromise(timeout, controller),
    Fetch(url, option, signal),
  ])
    .then((resp: any) => {
      //在这里判断请求超时
      if (resp.status === 521) {
        message.error("请求超时");
        return {
          success: false,
          status: 521,
          msg: "请求超时",
        };
      }
      return resp;
    })
    .catch((error) => {
      console.log("requests", error);
      return {
        success: false,
        status: 521,
        msg: "系统错误，请联系管理员",
      };
    });
};

export default request;
