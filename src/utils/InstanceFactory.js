import Web3 from 'web3';
import abi from '../../build/contracts/TGV.json';
import contract from 'truffle-contract';

export const getWeb3 = () => {
	return new Promise((resolve, reject) => {
		var web3 = window.web3;
		if (typeof web3 !== 'undefined') {
			console.log('Injected web3 detected.');
			resolve(new Web3(web3.currentProvider));
		} else {
			reject('No web3 injected');
			// console.log('No web3 instance injected, using Local web3.');
			// var provider = new Web3.providers.HttpProvider('http://127.0.0.1:9545')
			// resolve(new Web3(provider))
		}
	});
}

export const getTGV = web3Instance => {
    const TGV = contract(abi);
    TGV.setProvider(web3Instance.currentProvider);
    return TGV.deployed();
}