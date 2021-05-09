import plays from './plays.json';
import invoices from './invoices.json';
import createStatementData from "./createStatementData.js";

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

	return renderPlainText(createStatementData(invoice, plays))
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
