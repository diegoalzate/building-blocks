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

        console.log("Multisig Factory created by: ", txnReceipt.from);

        const multisigDetails = await multisigFactory.getMultisigDetails(0)
        
        console.log(multisigDetails);

        // console.log(multisigDetails[1].toString());

        const multisigAddress = multisigDetails[1].toString();

        const multisigInstance = await ethers.getContractAt("Multisig", multisigAddress);

        const txInst = await multisigInstance.newOwner({value: ethers.utils.parseEther("1")});

        const txnInstReceipt = await txnInst.wait();

        console.log("New owner function called by: ",txnInstReceipt.from);

        console.log(await multisigInstance.getOwners());

        expect(multisigInstance.owners.length).to.equal(1);
    });
})