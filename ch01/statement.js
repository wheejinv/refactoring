import plays from './plays.json';
import invoices from './invoices.json';

function statement (invoice) {
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

	let totalAmount = 0;
	let volumeCredits = 0;
	let result = `청구 내역 (고객명: ${invoice.customer})\n`;

	// https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
	const format = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
		minimumFractionDigits: 2,
	}).format;

	for (let perf of invoice.performances) {
		// 포인트를 적립한다.
		volumeCredits += volumeCreditsFor(perf); // <- 추출한 함수를 이용해 값을 누적

		// 청구 내역을 출력한다.
		result += `${playFor(perf).name}: ${format(amountFor(perf)/100)} (${perf.audience}석)\n`
		totalAmount += amountFor(perf)
	}

	result += `총액: ${format(totalAmount/100)}\n`;
	result += `적립 포인트: ${volumeCredits}점\n`;
	return result;
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
