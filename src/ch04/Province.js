import Producer from "./Producer";

// JSON 데이터로부터 지역 정보를 읽어오는 코드.
export default class Province {
	constructor(doc) {
		this._name = doc.name;
		this._producers = [];
		this._totalProduction = 0;
		this._demand = doc.demand;
		this._price = doc.price;
		doc.producers.forEach(d => {
			this.addProducer(new Producer(this, d));
		});
	}

	addProducer(arg) {
		this._producers.push(arg);
		this._totalProduction += arg.production;
	}

	get name() {
		return this._name;
	}

	get producer() {
		return this._producers.slice();
	}

	get totalProduction() {
		return this._totalProduction;
	}

	set totalProduction(arg) {
		this._totalProduction = arg;
	}

	get demand() {
		return this._demand;
	}

	set demand(arg) {
		this._demand = parseInt(arg);
	}

	get price() {
		return this._price;
	}

	set price(arg) {
		this._price = parseInt(arg);
	}

	///////////// 수익 계산
	get shortfall() {
		return this._demand - this.totalProduction;
	}

	get profit() {
		// 500 - 90 - 120 - 60 = 230
		return this.demandValue - this.demandCost;
	}

	get demandValue() {
		return this.satisfiedDemand * this.price;
	}

	get satisfiedDemand() {
		return Math.min(this._demand, this.totalProduction);
	}

	get demandCost() {
		let remainingDemand = this.demand;
		let result = 0;
		this._producers
			.sort((a, b) => a.cost - b.cost)
			.forEach(p => {
				const contribution = Math.min(remainingDemand, p.production);
				remainingDemand -= contribution;
				result += contribution * p.cost;
			});

		return result;
	}
	///////////// 수익 계산 END
}
