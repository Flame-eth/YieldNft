import React from "react";
import { Navbar } from "..";
import "./Hero.scss";
import { Background, bggif } from "../../assets/images";
import { AiOutlineRocket } from "react-icons/ai";
import { FaRegNewspaper } from "react-icons/fa";

const Hero = () => {
  window.scrollTo(0, 0);

  const handleDownload = () => {
    const downloadLink = document.createElement("a");
    downloadLink.href = "/NftsYieldWhitepaper.pdf"; // Replace with the actual path to your PDF file
    downloadLink.download = "NFTsYield.pdf"; // Replace with the desired filename for the downloaded file
    downloadLink.click();
  };

  const handleExplore = () => {
    const explore = document.getElementById("explore");
    if (explore) {
      explore.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <div className="hero">
        <div className="heroContainer">
          <div className="heroBg">
            <div className="heroNavbar">{/* <Navbar /> */}</div>
            <div className="heroContent">
              <div className="heroTitle">
                <span> Stake and earn</span> the yield on the most liquidity
                decentralized NFT marketplace
              </div>
              <div className="heroButton" onClick={handleExplore}>
                <AiOutlineRocket size={20} className="icon" />
                Explore
              </div>
              <div className="heroButton" onClick={handleDownload}>
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
