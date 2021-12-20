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
import UserEdit from "../pages/users/Edit";
import UserCreate from "../pages/users/Create";
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
    { path: '/users/create', element: <HomePage page={<UserCreate/>} idx={'2'}/>},
    { path: '/users/:id', element: <HomePage page={<UserEdit/>} idx={'2'}/>},
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
