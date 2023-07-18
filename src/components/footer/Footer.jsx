import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF } from "react-icons/fa";
import { BsInstagram } from "react-icons/bs";
import { AiOutlineTwitter } from "react-icons/ai";
import { CiLinkedin } from "react-icons/ci";
import { BsTelegram } from "react-icons/bs";
import { BsDiscord } from "react-icons/bs";

import "./Footer.scss";
import { logo } from "../../assets/images";

const Footer = () => {
  return (
    <div className="footer">
      <div className="footerCon">
        <div className="footerTop">
          <div className="title">
            <h1>
              <img src={logo} alt="" />
              <Link className="navLink" to="/">
                YieldNFT
              </Link>
            </h1>
            <div className="desc">
              Stake and earn the yield on the most liquidity decentralized NFT
              marketplace
            </div>
          </div>
          <div className="links">
            <ul>
              <li>
                <Link className="navLink" to="/">
                  Home
                </Link>
              </li>
              {/* <li>
                <Link className="navLink" to="/about">
                  About
                </Link>
              </li> */}
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
            </ul>
          </div>
          <div className="icons">
            <h1>Newsletter</h1>
            <form action="">
              <input type="email" placeholder="Enter your email" />
              <input type="submit" value="Subscribe" className="btn" />
            </form>
            <div className="social">
              <Link className="navLink" to="/">
                <FaFacebookF size={30} className="icon" />
              </Link>
              <Link className="navLink" to="/">
                <BsInstagram size={30} className="icon" />
              </Link>
              <Link className="navLink" to="/">
                <AiOutlineTwitter size={30} className="icon" />
              </Link>
              <Link className="navLink" to="/">
                <CiLinkedin size={30} className="icon" />
              </Link>
              <Link className="navLink" to="/">
                <BsTelegram size={30} className="icon" />
              </Link>
              <Link className="navLink" to="/">
                <BsDiscord size={30} className="icon" />
              </Link>
            </div>
          </div>
        </div>
        <div className="footerBottom">
          <h1>© 2021 YieldNFT. All rights reserved.</h1>
        </div>
      </div>
    </div>
  );
};

export default Footer;
