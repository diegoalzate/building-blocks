const { expect } = require("chai");
const { ethers } = require("hardhat");

describe ("MultisigFactory", function() {
    let MultisigFactory;
    let multisigFactory;

    beforeEach( async function() {
        MultisigFactory = await ethers.getContractFactory("MultisigFactory");
        multisigFactory = await MultisigFactory.deploy();
        await multisigFactory.deployed();

        console.log("Multisig Factory deployed at: ", multisigFactory.address);
    });

    it("Should check if there are 0 multisig instances", async function() {
        expect(await multisigFactory.numMultisigs()).to.equal(0);
    });

    it("Should create a new multisig instance", async function() {
        const tx = await multisigFactory.createMultisig(
            "Test Society",
            ethers.utils.parseEther("1"));

        const txnReceipt = await tx.wait();
        
        console.log(txnReceipt.gasUsed.toNumber());

        expect( await multisigFactory.numMultisigs()).to.equal(1);
    });

    it("Should check details of newly created multisig instance", async function() {
        const tx = await multisigFactory.createMultisig(
            "Test Society",
            ethers.utils.parseEther("1"));

        const txnReceipt = await tx.wait();

        const multisigDetails = await multisigFactory.getMultisigDetails(0)
        
        console.log(multisigDetails);

        expect(multisigDetails[0].toNumber()).to.equal(0);
    });

    it("user should be a member" , async () => {
        const tx = await multisigFactory.createMultisig(
            "Test Society",
            ethers.utils.parseEther("1"));
        
        const txnReceipt = await tx.wait();
        const multisig = ethers.getContractAt("Multisig", txnReceipt.contractAddress)
        
    })
})