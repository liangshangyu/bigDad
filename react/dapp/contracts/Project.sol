pragma solidity ^0.4.20;

library SafeMath {
	function mul(uint a, uint b) internal pure returns (uint) {
		uint c = a* b;
		assert(a==0 || c /a == b);
		return c;
	}

	function div(uint a, uint b) internal pure returns (uint) {
		uint c = a /b;
		return c;
	}

	function sub(uint a, uint b) internal pure returns (uint) {
		assert(b <= a);
		return a - b;
	}

	function add(uint a, uint b) internal pure returns(uint) {
		uint c = a+ b;
		assert(c >= a);
		return c;
	}
}

//用合约来控制节约 新建一个合约来管理所有的Project 合约实例
contract ProjectList {
	using SafeMath for uint;
	address[] public projects;  //存储Project实例的数组

	function createProject(string _description, uint _minInvest, uint _maxInvest, uint _goal) public {
		address newProject = new Project(_description, _minInvest, _maxInvest, _goal, msg,sender);
		projects.push(newProject);
	}

	function getProjects() public view returns(address[]) {
		return projects;
	}
}

contract Project {

	using SafeMath for uint;

	struct Payment {
		string description;
		uint   amount;
		address receiver;
		bool   completed;
		mapping(address => bool) voters;
		uint voterCount;
	}

	address public owner;
	string  public description;
	uint    public minInvest;
	uint    public maxInvest;
	uint    public goal;
	mapping(address => uint) investors;
	uint public investorCount;
	Payment[] public payments;

	modifier ownerOnly() {
		require(msg.sender == owner);
		_;
	}
	constructor(string _description, uint _minInvest, uint _maxInvest, uint _goal,address _owner) public {
		owner = _owner;
		description = _description;
		minInvest = _minInvest;
		maxInvest = _maxInvest;
		goal = _goal;
	}

	function contribute() public payable {
		require(msg.value > minInvest);
		require(msg.value <= maxInvest);
		//require(address(this).balance <= goal);

		//在数字上显示调用了uint类型的add方法
		uint newBalance = 0;
		newBalance = address(this).balance.add(msg.value);
		require(newBalance <= goal)

		if(investors[msg.sender] > 0){
			investors[msg.sender] += msg.value;
		}else {
			investors[msg.sender] = msg.value;
			investorCount += 1;
		}
	}

	function createPayment(string _description,uint _amount, address _receiver) ownerOnly public {
		Payment memory newPayment = Payment({
			description: _description,
			amount: _amount,
			receiver: _receiver,
			completed: false,
			//voters: new address[](0)
			voterCount: 0
		});
		payments.push(newPayment);
	}

	function approvePayment(uint index) public {
		Payment storage payment = payments[index];

		//must be a voter
		require(investors[msg.sender] > 0);

		//can't vote twice
		require(!payment.voters[msg.sender]);

		payment.voters[msg.sender] = true;
		payment.voterCount += 1;

	}

	function doPayment(uint index) public {
		Payment storage payment = payments[index];
		 require(!payment.completed);
		 require(address(this).balance >= payment.amount)
		 require(payment.voterCount > (investorCount / 2));

		 payment.receiver.transfer(payment.amount);
		 payment.completed = true;
	}
}