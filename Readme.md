My dApp is an article signing dApp where the user comes to the site and he is presented with a form upon which he enters his email address.
Then he is presented with a page to write an article.
After he writes the article the article is signed with Ethereum
with the help of web3.js sign function.
The article is then uploaded to the smart contract which manages it's content authenticity and singatories.
He is then presented with a page where he is supposed to add email addresess of the signatory who are supposed to sign the article he wrote.
The email address are then used to generate ethereum addresses.
After the ethereum adresses are generate they are uploaded to the smart contract also.

Notes:-
The end goals of this is to improve it and have a plugin or email tool for SMEs to verify the content and security of emails thus avoiding spams and malware infections through emails.
The complete implementation demostrated here is the one for uploading the document to the smart contract and generating ethereum addresses.

For the truffle part 

on project folder run: truffle migrate --reset --all
on project folder run: truffle test

download project source code.
go to project folder and run  npm install
go to project folder and run node app.js after npm install
start ganache on port 8545

*note 
Incase you run into problems accessing accounts copy the contract JSON in build filder into the public folder 

on windows machine be sure to run in case of errors
truffle migrate --compile-all --reset --network development

run node app.js

For the block chain download and run ganache.

Environment tested are 

Node 8.11.3;

Solidity 0.5.0;

Incase of any challenge leave me a comment.