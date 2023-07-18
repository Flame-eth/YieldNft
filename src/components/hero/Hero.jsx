import React from "react";
import { Navbar } from "..";
import "./Hero.scss";
import { Background, bggif } from "../../assets/images";
import { AiOutlineRocket } from "react-icons/ai";
import { FaRegNewspaper } from "react-icons/fa";

const Hero = () => {
  window.scrollTo(0, 0);
  return (
    <>
      <div className="hero">
        <div className="heroContainer">
          <div className="heroBg">
            <div className="heroNavbar">
              <Navbar />
            </div>
            <div className="heroContent">
              <div className="heroTitle">
                <span> Stake and earn</span> the yield on the most liquidity
                decentralized NFT marketplace
              </div>
              <div className="heroButton">
                <AiOutlineRocket size={20} className="icon" />
                Explore
              </div>
              <div className="heroButton">
                <FaRegNewspaper size={20} className="icon" />
                White Paper
              </div>
            </div>
            <div className="heroImg">
              <img src={bggif} alt="heroBg" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Hero;
