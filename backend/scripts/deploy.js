const hre = require("hardhat");

async function main() {
  const [ deployer ] = await ethers.getSigners();
  console.log(`Account deploy: ${ deployer.address }`);
  console.log(`Balance: ${( await deployer.getBalance() ).toString()}`);


  // Deploy
  const Greeter = await hre.ethers.getContractFactory("Greeter");
  const greeter = await Greeter.deploy("Hello, Hardhat!");
  await greeter.deployed();

  const NFT = await hre.ethers.getContractFactory("NFT");
  const nft = await NFT.deploy();
  await nft.deployed();

  const Marketplace = await hre.ethers.getContractFactory("Marketplace");
  const marketplace = await Marketplace.deploy(3);
  await marketplace.deployed();

  // Logging
  console.log(`Contract: Greeter deployed to:`, greeter.address);
  console.log(`Contract: NFT deployed to:`, nft.address);
  console.log(`Contract: Marketplace deployed to:`, marketplace.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
