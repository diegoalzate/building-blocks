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
})

describe("Multisig instances creation and interaction", async () => {
    let multisigFactory;
    let deployer;
    let user2;
    let user3;

    beforeEach( async function() {
        const getAccounts = async function () {
            let accounts = [];
            let signers = [];
            signers = await ethers.getSigners();
            for (const signer of signers) {
              accounts.push({ signer, address: await signer.getAddress() });
            } //populates the accounts array with addresses.
            return accounts;
        };
      
        [deployer, user2, user3] = await getAccounts();
    });
    it("user should be a member and become owner" , async () => {
        const MultisigFactory = await ethers.getContractFactory("MultisigFactory");
        const multisigFactory = await MultisigFactory.deploy();
        await multisigFactory.deployed();
        const tx = await multisigFactory.connect(deployer.signer).createMultisig(
            "Test Society",
            ethers.utils.parseEther("1"));
        const txnReceipt = await tx.wait();
        console.log(txnReceipt);
        const signerAddress = await deployer.signer.getAddress()
        console.log("multisig deployed from ", txnReceipt.from)
        const multisigDetails = await multisigFactory.getMultisigDetails(0)
        const multisigAddress = multisigDetails[1].toString();
        console.log("multisig address: ", multisigAddress)
        const multisigContract = await ethers.getContractAt("Multisig", multisigAddress)
        const txInst = await multisigContract.connect(deployer.signer).newOwner({value: ethers.utils.parseEther("1")});
        const txSociety = await multisigContract.connect(deployer.signer).owners(0);

        console.log("newOwner: ", txInst)
        console.log("owner: ", txSociety.toString())
    })
    it("factory should be able to get all multisigs from an owner" , async () => {
        const MultisigFactory = await ethers.getContractFactory("MultisigFactory");
        const multisigFactory = await MultisigFactory.deploy();
        await multisigFactory.deployed();

        const tx = await multisigFactory.connect(deployer.signer).createMultisig(
            "Test Society",
            ethers.utils.parseEther("1"));
        const txnReceipt = await tx.wait();
        console.log(txnReceipt);
        const signerAddress = await deployer.signer.getAddress()
        console.log("multisig deployed from ", txnReceipt.from)
        const multisigDetails = await multisigFactory.getMultisigDetails(0)
        const multisigAddress = multisigDetails[1].toString();
        console.log("multisig address: ", multisigAddress)
        const multisigContract = await ethers.getContractAt("Multisig", multisigAddress)
        const txInst = await multisigContract.connect(deployer.signer).newOwner({value: ethers.utils.parseEther("1")});        
        console.log("newOwner: ", txInst)
        // check from factory if user is owner
        const txnIsOwner = await multisigFactory.getAllMultigFromUser(signerAddress)
        const multisigsFromUser = await txnIsOwner.wait()
        console.log("multisigs: ", multisigsFromUser.events[0].args[0]);
        expect (multisigsFromUser.events[0].args[0] > 0)
    })
})