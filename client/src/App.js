import React, { useState } from "react";

import Web3 from "web3";
// import SimpleStorageContract from "./contracts/SimpleStorage.json";

import { Layout, Nav, Button } from "@douyinfe/semi-ui";

const App = () => {
  const { Header, Content } = Layout;
  const [account, setAccount] = useState("");

  // const state = { storageValue: 0, web3: null, accounts: null, contract: null };

  // componentDidMount = async () => {
  //   try {
  //     // Get network provider and web3 instance.
  //     const web3 = await getWeb3();

  //     // Use web3 to get the user's accounts.
  //     const accounts = await web3.eth.getAccounts();

  //     // Get the contract instance.
  //     const networkId = await web3.eth.net.getId();
  //     const deployedNetwork = SimpleStorageContract.networks[networkId];
  //     const instance = new web3.eth.Contract(
  //       SimpleStorageContract.abi,
  //       deployedNetwork && deployedNetwork.address,
  //     );

  //     // Set web3, accounts, and contract to the state, and then proceed with an
  //     // example of interacting with the contract's methods.
  //     this.setState({ web3, accounts, contract: instance }, this.runExample);
  //   } catch (error) {
  //     // Catch any errors for any of the above operations.
  //     alert(
  //       `Failed to load web3, accounts, or contract. Check console for details.`,
  //     );
  //     console.error(error);
  //   }
  // };

  // runExample = async () => {
  //   const { accounts, contract } = this.state;

  //   // Stores a given value, 5 by default.
  //   await contract.methods.set(5).send({ from: accounts[0] });

  //   // Get the value from the contract to prove it worked.
  //   const response = await contract.methods.get().call();

  //   // Update state with the result.
  //   this.setState({ storageValue: response });
  // };

  // if (!state.web3) {
  //   return <div>Loading Web3, accounts, and contract...</div>;
  // }

  const connectWallet = async () => {
    if (window.ethereum) {
      const provider = window.ethereum;
      await provider.enable();

      const web3 = new Web3(provider);
      const accounts = await web3.eth.getAccounts();
      setAccount(accounts[0]);
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header>
        <div>
          <Nav mode="horizontal" defaultSelectedKeys={["Home"]}>
            <Nav.Header>React Dapp</Nav.Header>
            <Nav.Footer>
              {account ? (
                <Button theme="borderless">{account}</Button>
              ) : (
                <Button theme="borderless" onClick={connectWallet}>
                  Connect Wallet
                </Button>
              )}
            </Nav.Footer>
          </Nav>
        </div>
      </Header>
      <Content style={{ padding: "24px" }}>Content</Content>
    </Layout>
  );
};

export default App;
