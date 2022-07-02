const { ethers } = require("hardhat");
const { assert, expect } = require("chai");

describe("Palabra", () => {
  let palabraFactory, palabra, accounts;

  beforeEach(async () => {
    palabraFactory = await ethers.getContractFactory("Palabra");
    palabra = await palabraFactory.deploy("elefante");
    accounts = await ethers.getSigners();
  });
  describe("constructor", () => {
    it("Cargo constructor correctamente", async () => {
      const valorEsperado = "elefante";
      const valorPalabra = await palabra.getPalabra();
      assert.equal(valorPalabra.toString(), valorEsperado);
    });
  });
  describe("getOwner", () => {
    it("el owner del contrato es el que hizo el deploy", async () => {
      const owner = await palabra.getOwner();
      const deployer = accounts[0];
      assert.equal(owner, deployer.address);
    });
  });
  describe("setPalabra", () => {
    it("cambia la palabra si es owner", async () => {
      const owner = accounts[0];
      const ownerConnectedContract = await palabra.connect(owner);
      const palabraEsperada = "rinoceronte";
      const transactionResponse = await ownerConnectedContract.setPalabra(
        palabraEsperada,
        {
          value: 0,
          gasLimit: 1000000,
        }
      );
      await transactionResponse.wait();
      const nuevaPalabra = await palabra.getPalabra();
      assert.equal(nuevaPalabra.toString(), palabraEsperada);

      //   console.log(transactionResponse);
    });
    it("falla si no es el owner y si no tiene suficiente dinero", async () => {
      const notOwner = accounts[1];
      const notOwnerConnectedContract = await palabra.connect(notOwner);
      const palabraEsperada = "america";
      const sendValue = ethers.utils.parseEther("0.05");

      await expect(
        notOwnerConnectedContract.setPalabra(palabraEsperada, {
          value: sendValue,
          gasLimit: 10000000,
        })
        //   ).to.be.revertedWith("Palabra__NotEnoughMoney");
      ).to.be.reverted;
    });
    it("cambia palabra si no es el owner y tiene suficiente dinero", async () => {
      const notOwner = accounts[1];
      const notOwnerConnectedContract = await palabra.connect(notOwner);
      const palabraEsperada = "london";
      const sendValue = ethers.utils.parseEther("0.1");

      const transactionResponse = await notOwnerConnectedContract.setPalabra(
        palabraEsperada,
        {
          value: sendValue,
          gasLimit: 1000000,
        }
      );
      await transactionResponse.wait();
      const nuevaPalabra = await palabra.getPalabra();
      assert.equal(nuevaPalabra.toString(), palabraEsperada);
    });
  });
  describe("setPalabraDef", () => {
    it("acepta donacion (si es mayor a 0.1) y cambia palabra a gracias!!! ", async () => {
      const notOwner = accounts[1];
      const sendValue = ethers.utils.parseEther("0.1");
      const palabraEsperada = "Gracias!";
      const contractAdress = palabra.address;

      const transactionResponse = await notOwner.sendTransaction({
        to: contractAdress,
        value: sendValue,
        gasLimit: 1000000,
      });
      await transactionResponse.wait();
      const nuevaPalabra = await palabra.getPalabra();
      assert.equal(nuevaPalabra.toString(), palabraEsperada);
    });
    it("falla si la donacion es menor de 0.1", async () => {
      const notOwner = accounts[1];
      const sendValue = ethers.utils.parseEther("0.05");
      const contractAdress = palabra.address;

      await expect(
        notOwner.sendTransaction({
          to: contractAdress,
          value: sendValue,
          gasLimit: 30000,
        })
        //   ).to.be.revertedWith("Palabra__NotEnoughMoney");
      ).to.be.reverted;
    });
  });
});
