var Election = artifacts.require('./Election.sol');

contract("Election", function(accounts) {
	var electionInstance;
	it("initializes with two candidates", function() {
		return Election.deployed().then(function(instance) {
			return instance.candidatesCount();
		}).then(function(count) {
			assert.equal(count, 2)
		});
	});

	it("it initializes the candidates with the correct values",function() {
		return Election.deployed().then(function(instance) {
			electionInstance = instance;
			return electionInstance.candidates(1);
		}).then(function(candidate) {
			assert.equal(candidate[0], 1, "contains the correct id")
		})
	});

	it("alow a voter to cast a vote", function() {
		return Election.deployed().then(function (instance) {
			electionInstance = instance;
			candidateId = 1;
			return electionInstance.vote(candidateId, {from: accounts[0]});
		}).then(function(receipt) {
			return electionInstance.voters(accounts[0]);
		}).then(function(voted) {
			assert(voted, "the voter wa maked as voted");
			return electionInstance.candidates(candidateId);
		}).then(function(candidate) {
			let voteCount = candidate[2];
			assert.equal(voteCount, 1 ,"increaments the candidate's vote count");
		});
	});

	it("throw an exception for invalid candidates", function() {
		return Election.deployed().then(function(instance) {
			electionInstance = instance;
			return electionInstance.vote(99, {from: accounts[1]});
		}).then(assert.fail).catch(function(error) {
			assert(error.message.indexOf('revert') >= 0, "error message must cotain revert");
		}).then()
	})
})