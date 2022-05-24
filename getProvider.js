async function getProvider() {
    const gameChainId = 4;
  
    if (!window.ethereum) {
      alert("please install wallet");
      return;
    }

    // get provider
    const provider = new ethers.providers.Web3Provider(window.ethereum);
  
    // get accounts
    const accounts = await provider.listAccounts();
  
    // if not connected, connect to metamask
    if (accounts.length == 0) {
      try {
        await ethereum.request({ method: "eth_requestAccounts" });
      } catch (error) {
        alert("Please connect to Metamask");
        window.location.reload();
      }
    }
  
    const { chainId } = await provider.getNetwork();
    // if current network id is not equal to game chain id
    if (chainId !== gameChainId) {
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: `0x${gameChainId.toString(16)}` }], // chainId must be in hexadecimal numbers
        });
      } catch {
        // fetch https://chainid.network/chains.json
        const response = await fetch("https://chainid.network/chains.json");
        const chains = await response.json();
  
        // find chain with network id
        const chain = chains.find((chain) => chain.chainId == gameChainId);
  
        const params = {
          chainId: "0x" + chain.chainId.toString(16), // A 0x-prefixed hexadecimal string
          chainName: chain.name,
          nativeCurrency: {
            name: chain.nativeCurrency.name,
            symbol: chain.nativeCurrency.symbol, // 2-6 characters long
            decimals: chain.nativeCurrency.decimals,
          },
          rpcUrls: chain.rpc,
          blockExplorerUrls: [chain.explorers && chain.explorers.length > 0 && chain.explorers[0].url ? chain.explorers[0].url : chain.infoURL],
        };
  
        await window.ethereum
          .request({
            method: "wallet_addEthereumChain",
            params: [params, accounts[0]],
          })
          .catch(() => {
            window.location.reload();
          });
      }
    }
    return provider;
  }