import React from "react";
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
import Dashboard from "../pages/Dashboard";
import NavigatePage from "../pages/Navigate";
import PasswordRecover from "../pages/PasswordRecover";

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
    { path: '/recover/:token', element: <PasswordRecover/>},
    { path: '/*', element: <RedirectLogin/>}
  ]);
  let auth_routes = useRoutes([
    { path: '/dashboard', element: <HomePage page={<Dashboard/>} idx={'1'}/>},
    { path: '/navigate/:id', element: <HomePage page={<NavigatePage/>} idx={'1'}/>},
    { path: '/users', element: <HomePage page={<UserList/>} idx={'2'}/>},
    { path: '/roles', element: <HomePage page={<RoleList/>} idx={'3'}/>},
    { path: '/permissions', element: <HomePage page={<PermissionList/>} idx={'4'}/>},
    { path: '/olts', element: <HomePage page={<OltList/>} idx={'5'}/>},
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
