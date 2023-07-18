// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;

import { useState } from "react";

import "./App.scss";
import Home from "./pages/home/Home";
import { Account, Footer } from "./components";
import AccountPage from "./pages/accountPage/AccountPage";
import ReferralPage from "./pages/referralPage/ReferralPage";

import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";

function App() {
  window.scrollTo(0, 0);

  const Layout = () => {
    return (
      <div className="app">
        <Outlet />
        <Footer />
      </div>
    );
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/account",
          element: <AccountPage />,
        },
        {
          path: "/referral",
          element: <ReferralPage />,
        },
        {
          path: "/:referral_id",
          element: <Home />,
        },
        {
          path: "/home",
          element: <Home />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
