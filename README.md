# Blockchain Word Changer

This project is part of a smart contract and front-end implementation practice.

## Table of contents

* [Technologies](#technologies)
* [General info](#general-info)
* [Setup](#setup)

## Technologies

* Solidity 0.8.7
* React js 18.2.0
* Ethers js 5.6.9
* Styled Components 5.3.5
* React Bulma Components 4.1.0
* Hardhat 2.9.9
* Ethereum Waffle 3.0.0

## General Info

Word changer allows you to store a word in the Goerli blockchain and display it on the front-end. A test of the smart contract was carried out using Waffle before deploying it on the network. The front-end was designed using React.

## Setup

Connect your Metamask wallet to the Goerli network. Make sure you have enough ETH in it.

Within the page press the Connect button. You will be able to see the last word saved in the blockchain. If you want to change it, write the word in the dialog box and press change. The word change costs 0.1 ETH and you will need to authorize it with your Metamask wallet.

After the transaction is confirmed, you will see the new word reflected on the page.

If you want to disconnect press the Disconnect button.
