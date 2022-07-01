// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.7;

error Palabra__NotOwner();

contract Palabra {
    string private s_palabra;
    address private immutable i_owner;

    modifier onlyOwner() {
        if (msg.sender != i_owner) {
            revert Palabra__NotOwner();
        }
        _;
    }

    constructor(string memory palabra) {
        s_palabra = palabra;
        i_owner = msg.sender;
    }

    receive() external payable {
        setPalabraDef();
    }

    fallback() external payable {
        setPalabraDef();
    }

    function getPalabra() public view returns (string memory) {
        return s_palabra;
    }

    // https://ethereum.stackexchange.com/questions/74442/when-should-i-use-calldata-and-when-should-i-use-memory
    // calldata es mas barato que memory
    function setPalabra(string calldata palabra) public onlyOwner {
        // if (
        //     keccak256(bytes(nombre)) == keccak256(abi.encodePacked(bytes(""))) // no se pueden comparar strings directamente
        // ) {
        //     revert Nombre__NoInput();
        // }
        s_palabra = palabra;
    }

    function setPalabraDef() public payable onlyOwner {
        // if (
        //     keccak256(bytes(nombre)) == keccak256(abi.encodePacked(bytes(""))) // no se pueden comparar strings directamente
        // ) {
        //     revert Nombre__NoInput();
        // }
        s_palabra = "Gracias!";
    }

    function getOwner() public view returns (address) {
        return i_owner;
    }
}
