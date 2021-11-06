import React, { useState, useEffect } from "react";

import Web3 from "web3";
import InboxContract from "./contracts/Inbox.json";
// import SimpleStorageContract from "./contracts/SimpleStorage.json";

import { Layout, Nav, Form, Button } from "@douyinfe/semi-ui";

const { Header, Content } = Layout;

const App = () => {
  const [state, setState] = useState({
    web3: null,
    message: null,
    account: null,
    isConnect: false,
    inboxContract: null,
  });

  useEffect(() => {
    getInboxContract();
  }, []);

  const getInboxContract = async () => {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      const inboxContract = new web3.eth.Contract(
        InboxContract.abi,
        InboxContract.networks[5777].address
      );

      const message = await inboxContract.methods.get().call();
      setState((prev) => ({
        ...prev,
        web3,
        message,
        inboxContract,
      }));
    }
  };

  const connectWallet = async () => {
    if (window.ethereum) {
      await window.ethereum.enable();
      const web3 = new Web3(window.ethereum);
      const accounts = await web3.eth.getAccounts();
      setState((prev) => ({ ...prev, account: accounts[0], isConnect: true }));
    }
  };

  const handleSubmit = async (formData) => {
    const { account, inboxContract } = state;
    await inboxContract.methods.set(formData.message).send({ from: account });
    const message = await inboxContract.methods.get().call();
    setState((prev) => ({ ...prev, message }));
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header>
        <div>
          <Nav mode="horizontal" defaultSelectedKeys={["Home"]}>
            <Nav.Header>React Dapp</Nav.Header>
            <Nav.Footer>
              {state.account ? (
                <Button theme="borderless">{state.account}</Button>
              ) : (
                <Button theme="borderless" onClick={connectWallet}>
                  Connect Wallet
                </Button>
              )}
            </Nav.Footer>
          </Nav>
        </div>
      </Header>
      <Content style={{ padding: "24px" }}>
        <Form
          layout="horizontal"
          onSubmit={(formData) => handleSubmit(formData)}
        >
          <Form.Input noLabel style={{ width: 200 }} field="message" />
          <Button type="primary" htmlType="submit" disabled={!state.isConnect}>
            Submit
          </Button>
        </Form>
        <p style={{ margin: "24px 0" }}>
          This message is {state.message || "nothing"}
        </p>
      </Content>
    </Layout>
  );
};

export default App;
