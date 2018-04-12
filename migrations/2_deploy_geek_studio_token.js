const GeekStudioToken = artifacts.require('../contracts/GeekStudioToken.sol')

module.exports = (deployer) => {
  let initialSupply = 100000e18
  deployer.deploy(GeekStudioToken, initialSupply, {
      gas: 2000000
  })
}
