import plays from './plays.json';
import invoices from './invoices.json';

export default function statement (invoice) {
	function renderPlainText(data, plays) {
		let result = `청구 내역 (고객명: ${data.customer})\n`;

		for (let perf of data.performances) {
			result += `${perf.play.name}: ${perf.amount} (${perf.audience}석)\n`
		}

		result += `총액: ${usd(data.totalAmount)}\n`;
		result += `적립 포인트: ${data.totalVolumeCredits}점\n`;
		return result;

		function usd(aNumber) {
			// https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
			return new Intl.NumberFormat('en-US', {
				style: 'currency',
				currency: 'USD',
				minimumFractionDigits: 2,
			}).format(aNumber/100);
		}
	}

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
		let result = 0;
		for (let perf of data.performances) {
			result += perf.amount;
		}

		return result;
	}
	function totalVolumeCredits(data) {
		let volumeCredits = 0;

		for (let perf of data.performances) {
			volumeCredits += perf.volumeCredits; // <- 추출한 함수를 이용해 값을 누적
		}

		return volumeCredits;
	}

	function enrichPerformance(aPerformance) {
		// 이렇게 새로 만든 레코드에 데이터를 채울 예정. 복사를 한 이유는 건넨 데이터를 불변처럼 취급하고 싶어서임.
		const result = Object.assign({}, aPerformance); // 얕은 복사 수행

		result.play = playFor(result);
		result.amount = amountFor(result);
		result.volumeCredits = volumeCreditsFor(result)

		return result;
	}

	const statementData = {};
	statementData.customer = invoice.customer; // 고객 데이터를 중간 데이터로 옮김
	statementData.performances = invoice.performances.map(enrichPerformance);
	statementData.totalAmount = totalAmount(statementData);
	statementData.totalVolumeCredits = totalVolumeCredits(statementData);
	return renderPlainText(statementData, plays)
}

console.log(statement(invoices[0], plays));

// 실행: node --experimental-json-modules statement

/* 결과
청구 내역 (고객명: BigCo)
Hamlet: $650.00 (55석)
As You Like It: $580.00 (35석)
Othello: $500.00 (40석)
총액: $1,730.00
적립 포인트: 47점
*/
