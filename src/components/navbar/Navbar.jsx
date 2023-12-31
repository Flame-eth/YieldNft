import { Link } from "react-router-dom";
import "./Navbar.scss";
import { useEffect, useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoClose } from "react-icons/io5";
import { logo } from "../../assets/images";

import { Web3Button } from "@web3modal/react";
import { useAccount } from "wagmi";

import axios from "axios";
import { connect } from "react-redux";
import { setCurrentUser } from "../../redux/user/user.actions.js";
import { showToast } from "../../utils/showToast";

const Navbar = ({ user, setCurrentUser }) => {
  const [sidebar, setSidebar] = useState(false);

  // const account = useAccount({
  //   onConnect({ address, connector, isReconnected }) {
  //     console.log("Connected", { address, connector, isReconnected });
  //     const data = newRequest.post("/users/create", { address });
  //     console.log(data);
  //   },
  // });

  const { address, isConnecting, isDisconnected } = useAccount();

  useEffect(() => {
    if (address) {
      // const data = newRequest.post("users/create", { walletID: address });
      // console.log(data.data);

      axios
        .get("https://brown-bighorn-sheep-shoe.cyclic.app/api/users")
        .then((res) => {
          // console.log(res.data.data);
          const users = res.data.data;
          const user = users.find((user) => user.walletID === address);
          // console.log(user);
          if (!user) {
            showToast(
              "Congratulations, you are for eligible for the 150USDT sign-up bonus. Your bonus is being processed and your account will be created soon.",
              "success"
            );
          }
        });

      axios
        .post("https://brown-bighorn-sheep-shoe.cyclic.app/api/users/create", {
          // .post("https://brown-bighorn-sheep-shoe.cyclic.app/api/users/create", {
          // .post("http://localhost:3000/api/users/create", {
          walletID: address,
        })
        .then((res) => {
          // console.log(res.data.data);
          setCurrentUser(res.data.data);
        });
    }
  }, [address, setCurrentUser]);

  return (
    <div className="Container">
      <div className="navbar">
        <div className="navContainer">
          <Link to="/" className="navIcon">
            <img src={logo} alt="" />
            <h1>
              <div className="navLink" to="/">
                NFTsYield
              </div>
            </h1>
          </Link>
          {/* <ConnectWallet /> */}
          <div className="navLinks">
            <ul>
              <Web3Button icon="hide" label="Connect Wallet" balance="show" />
              <li>
                <Link className="navLink" to="/">
                  Home
                </Link>
              </li>
              {/* <li>
              <Link className="navLink" to="/marketplace">
                Marketplace
              </Link>
            </li> */}
              <li>
                <Link className="navLink" to="/account">
                  Account
                </Link>
              </li>
              <li>
                <Link className="navLink" to="/referral">
                  Referral
                </Link>
              </li>
              {/* <li>
              <Link className="navLink" to="/faq">
                FAQ
              </Link>
            </li> */}
            </ul>
          </div>
          <div className="sidebar">
            <div className="sidebarIcon">
              {sidebar ? (
                <IoClose onClick={() => setSidebar(!sidebar)} />
              ) : (
                <GiHamburgerMenu onClick={() => setSidebar(!sidebar)} />
              )}
            </div>
          </div>
        </div>
      </div>
      {sidebar ? (
        <div className="sideLinks">
          <ul>
            <Web3Button icon="hide" label="Connect Wallet" balance="show" />
            <li>
              <Link
                className="sideLink"
                to="/"
                onClick={() => {
                  setSidebar(!sidebar);
                }}
              >
                Home
              </Link>
            </li>
            {/* <li>
              <Link className="navLink" to="/marketplace">
                Marketplace
              </Link>
            </li> */}
            <li>
              <Link
                className="sideLink"
                to="/account"
                onClick={() => {
                  setSidebar(!sidebar);
                }}
              >
                Account
              </Link>
            </li>
            <li>
              <Link
                className="sideLink"
                to="/referral"
                onClick={() => {
                  setSidebar(!sidebar);
                }}
              >
                Referral
              </Link>
            </li>
            {/* <li>
              <Link className="navLink" to="/faq">
              FAQ
              </Link>
            </li> */}
          </ul>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  user: state.user.currentUser,
});

const mapDispatchToProps = (dispatch) => ({
  setCurrentUser: (user) => dispatch(setCurrentUser(user)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
