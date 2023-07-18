import React from "react";
import "./AboutUs.scss";
const AboutUs = () => {
  return (
    <div className="about">
      <div className="aboutContainer">
        <h1>ABOUT YieldNFT</h1>
        <p>
          Welcome to YieldNFT, your premier decentralized finance (DeFi)
          platform that combines staking, yield farming, and the exciting world
          of non-fungible tokens (NFTs). At YieldNFT, we offer a unique
          opportunity for users to stake or pledge their USDT and earn a
          stipulated reward percentage by leveraging the potential of NFTs. Our
          platform is designed to provide a seamless and user-friendly
          experience, ensuring that anyone can participate in the NFT ecosystem
          without the need to own an NFT or possess prior knowledge about NFTs.
          We believe that financial opportunities should be accessible to
          everyone, regardless of their background or expertise.
        </p>
        {/* <p>
          Join YieldNFT today and unlock the potential of DeFi staking and yield
          farming with NFTs. Whether you are a seasoned investor or a curious
          newcomer, we invite you to embark on a rewarding journey with us.
          Start earning attractive rewards on your USDT without the need to own
          an NFT or possess prior knowledge of NFTs. Together, we can redefine
          the future of decentralized finance.
        </p> */}
      </div>
    </div>
  );
};

export default AboutUs;
