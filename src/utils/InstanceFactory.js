import Web3 from 'web3';
import abi from '../../build/contracts/TGV.json';
import contract from 'truffle-contract';

export const getWeb3 = () => {
	return new Promise(async (resolve, reject) => {
		if(window.ethereum) {
			let web3 = new Web3(window.ethereum);
			try {
				await window.ethereum.enable();
				console.log('Injected web3 detected. (for modern dapp)');
				resolve(web3);
			} catch (err) {
				reject(err);
			}
		}
		else if (window.web3) {
			console.log('Injected web3 detected. (for legacy dapp)');
			resolve(new Web3(window.web3.currentProvider));
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