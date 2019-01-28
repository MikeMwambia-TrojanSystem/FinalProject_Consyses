***************************
* Avoiding Common Attacks *
***************************

Address validation
================
I have written onlyAddress modifier to validate that only allowed users can perform functions that involve changing the state of the contract.

Owner validation
==================
I have written onlyOwner modifier to validate that only owner users can perform specific functions on the contract.
  


Gas Limit Attacks
=============
To avoid having gas limit issues i used maps to relate data instead of arrays.

Instead of using arrays to map data relations I am using mappings to access directly to the value.

  mapping(address => document) public docs;
  
//Mapping of the address to the signatory structs.
  mapping (address => signatories) public signStructs;

