import { EthereumProvider } from "@walletconnect/ethereum-provider";

const projectId = "f633ed561ee68e55ddfc3a8ea587f1f2"; // Your WalletConnect Project ID

export const connectWallet = async () => {
  try {
    const provider = await EthereumProvider.init({
      projectId,
      showQrModal: true,
      chains: [56], // Binance Smart Chain (Mainnet)
      methods: [
        "eth_sendTransaction",
        "eth_signTransaction",
        "eth_sign",
        "personal_sign",
        "eth_signTypedData"
      ],
      events: ["chainChanged", "accountsChanged"],
      metadata: {
        name: "USDT Investment DApp",
        description: "Earn 4% Daily Return",
        url: "https://yourdomain.com",
        icons: ["https://yourdomain.com/icon.png"]
      }
    });

    await provider.connect();
    const accounts = await provider.request({ method: "eth_accounts" });
    const address = accounts[0];

    return { address, provider };
  } catch (err) {
    console.error("WalletConnect Error:", err);
    return { address: null, provider: null };
  }
};