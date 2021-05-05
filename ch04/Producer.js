// 다양한 데이터에 대한 접근자들이 담겨있음.
export default class Producer {
	constructor(aProvince, data) {
		this._province = aProvince;
		this._cost = data.cost;
		this._name = data.name;
		this._production = data.production || 0;
	}

	get name() {
		return this._name;
	}

	get cost() {
		return this._cost;
	}

	set cost(arg) {
		this._cost = parseInt(arg);
	}

	get production() {
		return this._production;
	}

	set production(amountStr) {
		const amount = parseInt(amountStr);
		const newProduction = Number.isNaN(amount) ? 0 : amount;

		this._province.totalProduction += newProduction - this._production;
		this._production = newProduction
	}

}
