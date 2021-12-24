import React from "react";
import { ReactDOM } from "react";
import {
  BrowserRouter as Router,
  useRoutes,
  Navigate
} from "react-router-dom";
import LoginPage from "../pages/Login";
import HomePage from "../pages/Home";
import UserList from "../pages/users/List";
import PermissionList from "../pages/permissions/List";
import RoleList from "../pages/roles/List";
import OltList from "../pages/olts/List";
import ScriptList from "../pages/scripts/List";
import ScriptUserList from "../pages/script_users/List";
import Dashboard from "../pages/Dashboard";

const RedirectLogin = () => {
  return(
    <Navigate to={'/login'}/>
  )
}

const RedirectDashboard = () => {
  return(
    <Navigate to={'/dashboard'}/>
  )
}

const RouteList = () => {
  let public_routes = useRoutes([
    { path: '/login', element: <LoginPage/>},
    { path: '/*', element: <RedirectLogin/>}
  ]);
  let auth_routes = useRoutes([
    { path: '/dashboard', element: <HomePage page={<Dashboard/>} idx={'1'}/>},
    { path: '/users', element: <HomePage page={<UserList/>} idx={'2'}/>},
    { path: '/roles', element: <HomePage page={<RoleList/>} idx={'3'}/>},
    { path: '/permissions', element: <HomePage page={<PermissionList/>} idx={'4'}/>},
    { path: '/olts', element: <HomePage page={<OltList/>} idx={'5'}/>},
    { path: '/scripts', element: <HomePage page={<ScriptList/>} idx={'6'}/>},
    { path: '/script-users', element: <HomePage page={<ScriptUserList/>} idx={'7'}/>},
    { path: '/*', element: <RedirectDashboard/>}
  ]);
  if (localStorage.getItem('token') == null) {
    return public_routes;
  } else {
    return auth_routes;
  }
}

function Routes() {

  return (
    <Router>
        <RouteList/>
    </Router>
  );
}

export default Routes;
