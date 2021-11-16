import React, { useState, useEffect } from "react";

import { ethers } from "ethers";
import InboxContract from "./contracts/Inbox.json";

import { Layout, Nav, Form, Toast, Button, TextArea } from "@douyinfe/semi-ui";

const { Header, Content } = Layout;

const App = () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const contract = new ethers.Contract(
    InboxContract.networks[3].address,
    InboxContract.abi,
    provider.getSigner()
  );

  const [state, setState] = useState({
    message: null,
    account: null,
    contract: null,
    isConnect: false,
    isLoading: false,
  });

  const getInboxContract = async () => {
    if (typeof window.ethereum === "undefined") return;

    try {
      const message = await contract.message();
      setState((prev) => ({ ...prev, message, contract }));
    } catch (err) {
      Toast.error(err);
    }
  };

  const connectWallet = async () => {
    if (typeof window.ethereum === "undefined") return;

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    setState({ ...state, account: accounts[0], isConnect: true });
  };

  const handleSubmit = async (formData) => {
    const { contract } = state;

    const signature = await provider.getSigner().signMessage(formData.message);
    const transaction = await contract.set(signature);

    setState((prev) => ({ ...prev, isLoading: true }));
    await transaction.wait();
    const message = await contract.message();
    setState((prev) => ({ ...prev, isLoading: false, message }));
  };

  useEffect(() => {
    getInboxContract();
  }, []);

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
          <Button
            type="primary"
            loading={state.isLoading}
            htmlType="submit"
            disabled={!state.isConnect}
          >
            Submit
          </Button>
          <TextArea
            style={{ margin: "24px 0" }}
            value={state.message || "nothing"}
          />
        </Form>
      </Content>
    </Layout>
  );
};

export default App;
