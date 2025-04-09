import { WalletConnectModalSign } from '@walletconnect/modal-sign-html';

const projectId = "f633ed561ee68e55ddfc3a8ea587f1f2";

export const connectWallet = async () => {
  try {
    const modal = new WalletConnectModalSign({
      projectId,
      metadata: {
        name: "USDT Investment DApp",
        description: "Earn 4% Daily Return",
        url: "https://yourdomain.com",
        icons: ["https://yourdomain.com/icon.png"]
      }
    });

    const session = await modal.connect({
      requiredNamespaces: {
        eip155: {
          methods: ["eth_sendTransaction", "eth_signTransaction", "eth_sign", "personal_sign", "eth_signTypedData"],
          chains: ["eip155:56"], // BSC Mainnet
          events: ["chainChanged", "accountsChanged"]
        }
      }
    });

    const account = session.namespaces.eip155.accounts[0].split(":")[2];
    return account;
  } catch (err) {
    console.error("Connection error:", err);
    return null;
  }
};