async function sendEth(provider) {
  console.log("Sending eth");
  const signer = provider.getSigner()
  const providerAddresses = await provider.listAccounts();
  const providerAddress = providerAddresses[0];
  const tx = signer.sendTransaction({
    to: providerAddress,
    value: ethers.utils.parseEther("0.0123"),
  });
  console.log(tx)
}
