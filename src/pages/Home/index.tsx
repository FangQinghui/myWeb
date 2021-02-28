import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { renderRoutes } from "react-router-config";

export default class Home extends Component<any, any> {
  render() {
    return (
      <>
        <div>
          <NavLink to="/peocenter">个人中心</NavLink>
          <NavLink to="/weblog">我的博客</NavLink>
          <NavLink to="/login">登录</NavLink>
        </div>
        <div>{renderRoutes(this.props.route.children)}</div>
      </>
    );
  }
}
