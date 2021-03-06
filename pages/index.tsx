import type { NextPage } from 'next'
import Head from 'next/head'
// import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { ethers } from "ethers"
import { useEffect, useState } from "react"
import { Button, Image } from 'antd'
import 'antd/dist/antd.css'

// Example POST method implementation:
async function postData(url = '', data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}

const Home: NextPage = () => {
  const [currentAccount, setCurrentAccount] = useState("")
  const [huiPoap, setHuiPoap] = useState({})
  const [totalPoap, seTotalPoap] = useState(0);

  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window as any;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      }

      const accounts = await ethereum.request({ method: 'eth_accounts' });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
      } else {
        console.log("No authorized account found")
      }
    } catch (error) {
      console.log(error);
    }
  }

  const connectWallet = async () => {
    try {
      const { ethereum } = window as any;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error)
    }
  }

  const verifyPoap = () => {
    fetch(`https://frontend.poap.tech/actions/scan/${currentAccount}`)
      .then(response => response.json())
      .then(data => {
        seTotalPoap(data.length)
        setHuiPoap(data.find(item => item.tokenId === "3175384"))
      });
  }

  const {
    event: {
      image_url = ''
    } = {}
  } = huiPoap as any
  return (
    <div className={styles.container}>
      <Head>
        <title>???DAO</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {!currentAccount && (
        <Button shape="round" onClick={connectWallet}>
          ????????????
        </Button>
      )}
      {currentAccount && (
        <Button shape="round" onClick={verifyPoap}>
          ??????POAP
        </Button>
      )}

      {currentAccount && (
        <div>
          <div>{currentAccount}</div>
          {totalPoap && <div>POAP?????????{totalPoap}</div>}
          {image_url && <div>????????????</div>}
          {image_url && <Image src={image_url} style={{ width: 200, borderRadius: 200 }} />}
        </div>
      )}
    </div>
  )
}

export default Home
