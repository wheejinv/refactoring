export default function createStatementData(invoice, plays) {
	const statementData = {};
	statementData.customer = invoice.customer; // 고객 데이터를 중간 데이터로 옮김
	statementData.performances = invoice.performances.map(enrichPerformance);
	statementData.totalAmount = totalAmount(statementData);
	statementData.totalVolumeCredits = totalVolumeCredits(statementData);

	return statementData;

	function amountFor(aPerformance) {
		let result = 0;

		switch (playFor(aPerformance).type) {
			case 'tragedy':
				result = 40000;
				if (aPerformance.audience > 30) {
					result += 1000 * (aPerformance.audience - 30);
				}
				break;
			case 'comedy':
				result = 30000;
				if (aPerformance.audience > 20) {
					result += 10000 + 500 * (aPerformance.audience - 20);
				}
				result += 300 * aPerformance.audience;
				break;
			default:
				throw new Error(`알 수 없는 장르: ${playFor(aPerformance).type}`);
		}

		return result;
	}
	function playFor(aPerformance) {
		return plays[aPerformance.playID];
	}
	function volumeCreditsFor(aPerformance) {
		let result = 0;

		result += Math.max(aPerformance.audience - 30, 0);

		if ("comedy" === playFor(aPerformance).type) {
			result += Math.floor(aPerformance.audience / 5);
		}

		return result;
	}
	function totalAmount(data) {
		return data.performances
			.reduce((total, p) => total + p.amount, 0);
	}
	function totalVolumeCredits(data) {
		return data.performances
			.reduce((total, p) => total + p.volumeCredits, 0);
	}
	function enrichPerformance(aPerformance) {
		// 이렇게 새로 만든 레코드에 데이터를 채울 예정. 복사를 한 이유는 건넨 데이터를 불변처럼 취급하고 싶어서임.
		const result = Object.assign({}, aPerformance); // 얕은 복사 수행

		result.play = playFor(result);
		result.amount = amountFor(result);
		result.volumeCredits = volumeCreditsFor(result)

		return result;
	}
}
