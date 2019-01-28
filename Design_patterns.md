****************************
* Design Pattern Desicions *
****************************



Circuit Breaker
===============
In case I find the contract signers having issues or needing to be stopped for one reason or another I have desinged a funciton called kill() which can only be invoked by the owner and can it will then render the contract unusable.


Separation of storage and  logic
================================
The contract signers is using storage to store and manipulate the storage of different document as well as signatory structs in it's storage.
These storage is limited to specific address either the signatory or the owner of the document.
These design pattern allows change the logic of who and how the memory is accessed and manipulated without having to interfere with the data already stored.




