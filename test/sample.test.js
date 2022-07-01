const { ethers } = require("hardhat");
const { assert } = require("chai");

describe("Palabrae", () => {
  let palabraFactory, palabra;

  beforeEach(async () => {
    palabraFactory = await ethers.getContractFactory("Palabra");
    palabra = await palabraFactory.deploy("Prueba Mocha!!!");
  });
  it("Cargo constructor correctamente", async () => {
    const valorEsperado = "Prueba Mocha!!!";
    const valorPalabra = await palabra.getPalabra();
    assert.equal(valorPalabra.toString(), valorEsperado);
  });
  it("Cambia la palabra", async () => {
    const valorEsperado = "Smart Contract!!!";
    const respuestaTransaccion = await palabra.setPalabra(valorEsperado);
    await respuestaTransaccion.wait(); // espero un bloque para confirmar la tx
    const nuevoValor = await palabra.getPalabra();
    assert.equal(nuevoValor.toString(), valorEsperado.toString());
  });
});
