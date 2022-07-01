import React, { useState, useEffect } from "react";
import styled, { createGlobalStyle, keyframes } from "styled-components";
import { ethers } from "ethers";
import { Button, Form, Box } from "react-bulma-components";
import { abi, contractAddress } from "./constants";

const GlobalStyle = createGlobalStyle`
html{
  overflow:hidden;
}
  body {
    /* background-color: aquamarine; */
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    overflow:hidden;
   
    font-family: 'Roboto', sans-serif;

    -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
     -khtml-user-select: none; /* Konqueror HTML */
       -moz-user-select: none; /* Old versions of Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
            user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome, Edge, Opera and Firefox */
  }
`;

const rightToLeft = keyframes`
  0% {
    transform: translateX(10%);
  }
  50% {
    transform: translateX(-10%);
  }
  100% {
    transform: translateX(10%);
  }
`;
const leftToRight = keyframes`
  0% {
    transform: translateX(-10%);
  }
  50% {
    transform: translateX(10%);
  }
  100% {
    transform: translateX(-10%);
  }
`;

const Page = styled.div`
  width: 100%;
  height: 100vh;
  /* background-color: orange; */
  position: relative;
  overflow: hidden;
`;

const BackgroundAnimation = styled.div`
  width: 170%;
  height: 170%;
  position: absolute;
  /* position: fixed; */
  /* transform: rotate(-30deg); */
  top: 50%;
  left: 50%;
  /* bring your own prefixes */
  transform: translate(-50%, -50%) rotate(-30deg);
  /* background-color: green; */
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-size: 40px;
  overflow: hidden;
`;
const TickerRight = styled.div`
  color: #eeeeeebb;
  transform: translateX(10%);
  font-weight: 300;
  animation: 60s ${rightToLeft} linear infinite;
`;
const TickerLeft = styled.div`
  color: #eeeeeebb;
  transform: translateX(-10%);
  animation: 60s ${leftToRight} linear infinite;
  font-style: italic;
  font-weight: 300;
`;

const PalabraTitulo = styled.div`
  position: absolute;
  font-family: "Tienne", serif;
  bottom: 50px;
  right: 150px;
  font-size: 190px;
  color: #222222ee;
  text-shadow: 0px 2px 13px rgba(31, 31, 31, 0.35);
`;

const Palabra = styled.span``;

const NavBar = styled.div`
  position: absolute;
  width: 100%;
  top: 0;
  height: 70px;
  left: 0;
  /* background-color: red; */
  z-index: 15;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;
const ContenedorBoton = styled.div`
  box-shadow: 0px 2px 13px rgba(31, 31, 31, 0.2);
`;

const Direccion = styled.div`
  height: 40px;
  color: #aaaaaa; //#c0c0c0;
  margin: 0 15px 0 15px;
  font-size: 19px;
  background-color: white;
  border: 1px solid #eeeeee;
  border-radius: 7px;
  padding: 3px 17px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0px 2px 13px rgba(31, 31, 31, 0.1);
`;

const ConnectionBox = styled.div`
  position: absolute;
  bottom: 10px;
  right: 10px;
  font-size: 10px;
  color: #aaaaaa;
`;

const ConnectionSpan = styled.span`
  color: #777777;
  font-size: 12px;
`;

function App() {
  const [palabra, setPalabra] = useState("connect...");
  const [conectado, setConectado] = useState(false);
  const [currentAccount, setCurrentAccount] = useState("");
  // const [chainId, setChainId] = useState(null);
  const [chainName, setChainName] = useState("");
  const [isOwner, setIsOwner] = useState(false);
  // const [ownerAddress, setOwnerAddress] = useState("");
  const [input, setInput] = useState("");

  const repetir = Array.from(Array(30).keys());

  const onClickConnect = () => {
    if (!window.ethereum) {
      console.log("please install MetaMask");
      return;
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);

    // MetaMask requires requesting permission to connect users accounts
    provider
      .send("eth_requestAccounts", [])
      .then((accounts) => {
        if (accounts.length > 0) setCurrentAccount(accounts[0]);
        // if (currentAccount === ownerAddress) {
        //   setOwner(true);
        // }
      })
      .catch((e) => console.log(e));
  };

  const onClickDisconnect = () => {
    setConectado(false);
    setPalabra("connect...");
    // setChainId(null);
    setChainName("");
    setCurrentAccount(undefined);
    setIsOwner(false);
    // setOwnerAddress("");
    setInput("");
  };

  const handleInputChange = (e) => {
    const { value } = e.target;
    setInput(value);
  };

  async function onClickCambiarPalabra(e) {
    e.preventDefault();
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = await provider.getSigner(); // obtenemos la wallet conectada
      const contract = new ethers.Contract(contractAddress, abi, signer);

      try {
        const transactionResponse = await contract.setPalabra(input);
        await listenForTransactionMine(transactionResponse, provider);
        const NuevaPalabra = await contract.getPalabra();

        setPalabra(NuevaPalabra);
        setInput("");
      } catch (e) {
        console.log(e);
      }

      // console.log(signer); // conecta al nodo de metamask
    }
  }
  function listenForTransactionMine(transactionResponse, provider) {
    console.log(`Minando ${transactionResponse.hash} ...`);
    return new Promise((resolve, reject) => {
      provider.once(transactionResponse.hash, (transactionReceipt) => {
        console.log(
          `Completed with ${transactionReceipt.confirmations} confirmations`
        );
        resolve();
      });
    });
  }

  useEffect(() => {
    setConectado(false);
    if (!currentAccount || !ethers.utils.isAddress(currentAccount)) return;

    if (!window.ethereum) return;
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    provider.getNetwork().then((result) => {
      // setChainId(result.chainId);
      setChainName(result.name);
      setConectado(true);
      const signer = provider.getSigner();

      const contract = new ethers.Contract(contractAddress, abi, signer);
      contract.getOwner().then((own) => {
        // setOwnerAddress(own);
        if (currentAccount.toLowerCase() === own.toLowerCase()) {
          setIsOwner(true);
        } else {
          setIsOwner(false);
        }
      });
      contract.getPalabra().then((palabra) => {
        setPalabra(palabra);
      });
    });
  }, [currentAccount]);

  useEffect(() => {
    if (!window.ethereum) return;

    const accountWasChanged = (accounts) => {
      setCurrentAccount(accounts[0]);
      // console.log("accountWasChanged");
    };
    // const getAndSetAccount = async () => {
    //   const changedAccounts = await window.ethereum.request({
    //     method: "eth_requestAccounts",
    //   });
    //   setCurrentAccount(changedAccounts[0]);
    //   console.log("getAndSetAccount");
    // };
    const clearAccount = () => {
      onClickDisconnect();
      console.log("clearAccount");
    };
    window.ethereum.on("accountsChanged", accountWasChanged);
    // window.ethereum.on("connect", getAndSetAccount);
    window.ethereum.on("disconnect", clearAccount);
    // window.ethereum.request({ method: "eth_requestAccounts" }).then(
    //   (accounts) => {
    //     console.log("accounts", accounts);
    //     // No need to set account here, it will be set by the event listener
    //   },
    //   (error) => {
    //     // Handle any UI for errors here, e.g. network error, rejected request, etc.
    //     // Set state as needed
    //   }
    // );
    return () => {
      // Return function of a non-async useEffect will clean up on component leaving screen, or from re-reneder to due dependency change
      window.ethereum.removeListener("accountsChanged", accountWasChanged);
      // window.ethereum.off("connect", getAndSetAccount);
      window.ethereum.removeListener("disconnect", clearAccount);
    };
  }, []);

  return (
    <>
      <GlobalStyle />
      <Page>
        <NavBar>
          <ContenedorBoton style={{ marginRight: "12px" }}>
            <Button
              color="primary"
              className={!conectado ? "button is-success" : "button is-danger"}
              onClick={!conectado ? onClickConnect : onClickDisconnect}
            >
              {/* <span class="icon is-small">
                  <i class="fas fa-check"></i>
                </span> */}
              {conectado ? <>Disconnnect</> : <>Connnect</>}
            </Button>
          </ContenedorBoton>
          {conectado ? <Direccion>{`${currentAccount}`}</Direccion> : <></>}
        </NavBar>
        <BackgroundAnimation>
          {repetir.map((item, i1) => (
            <>
              <TickerLeft>
                {repetir.map((item, i2) => (
                  <Palabra>
                    {`${palabra}`}
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  </Palabra>
                ))}
              </TickerLeft>
              <TickerRight>
                {repetir.map((item, i2) => (
                  <Palabra>
                    {`${palabra}`}
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  </Palabra>
                ))}
              </TickerRight>
            </>
          ))}
        </BackgroundAnimation>
        <PalabraTitulo>{palabra}</PalabraTitulo>
        <Box
          style={{
            width: 400,
            margin: "auto",
            backgroundColor: "white",
            position: "absolute",
            top: "45%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <form>
            <Form.Field>
              <Form.Label>type a word</Form.Label>
              <Form.Control>
                <Form.Input
                  type="text"
                  placeholder="only owner can change it"
                  required
                  pattern="[a-zd.]{5,}"
                  disabled={!isOwner ? true : false}
                  onChange={handleInputChange}
                  value={input}
                />
              </Form.Control>
            </Form.Field>

            <Button.Group align="right">
              {/* <Button color="primary" className="is-loading"> */}
              <Button
                color="primary"
                className="button is-success"
                onClick={onClickCambiarPalabra}
                disabled={!isOwner ? true : false}
              >
                Change
              </Button>
            </Button.Group>
          </form>
        </Box>
        <ConnectionBox hidden={!conectado ? true : false}>
          connected to <ConnectionSpan>{chainName}</ConnectionSpan>
        </ConnectionBox>
      </Page>
    </>
  );
}

export default App;
