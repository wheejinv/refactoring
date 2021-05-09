import invoices from '../../src/ch01/invoices.json';

var chai = require('chai'); // 자바스크립트용 어서션 라이브러리
var assert = chai.assert;
var expect = chai.expect;

describe('statement', function() {
	let invoice;
	beforeEach(function() {
		invoice = invoices[0];
	});
	it('customer name', function() {
		expect(invoice.customer).equal("BigCo");
	})

})
