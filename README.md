# Building Blocks

Building blocks allows a  user to create a multisig on demand that provides a horizontal governance structure, making sure all the information and transactions are persistent and each member has a vote. 


- Users can create a multisig by defining a certain deposit amount in USD
- The deposit is used later to pay for other service transactions. 
- The creator/owner of the multisig can invite other users
- Only the owner is allowed to create **a new service transaction** 
- Other users in the multisig can vote on whether they approve the service or not.


## Technologies

This project is built with the following open source libraries, frameworks and languages.
| Tech | Description |
| --------------------------------------------- | ------------------------------------------------------------------ |
| [Next.js](https://nextjs.org/) | React Framework |
| [Hardhat](https://hardhat.org/) | Ethereum development environment |
| [hardhat-deploy](https://www.npmjs.com/package/hardhat-deploy) | A Hardhat Plugin For Replicable Deployments And Easy Testing |
| [WAGMI](https://wagmi.sh/) | A set of React Hooks for Web3 |
| [create-web3.xyz](https://create-web3.xyz) | boilerplates |


## Quick Start Notes

1.  Run `yarn` or `npm install` to install all the dependencies
2.  Once installation is complete, `cd` into your app's directory and run `yarn chain` or `npm run chain` to start a local hardhat environment
3.  Open another terminal and `cd` into your app's directory
4.  Run `yarn deploy` or `npm run deploy` to deploy the example contract locally
5.  Run `yarn dev` or `npm run dev` to start your Next dev environment




