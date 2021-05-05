import Province from "../../src/ch04/Province";
import sampleProvinceData from "../../src/ch04";

var chai = require('chai'); // 자바스크립트용 어서션 라이브러리
var assert = chai.assert;
var expect = chai.expect;

describe('province', function() {
	let asia;
	beforeEach(function() {
		asia = new Province(sampleProvinceData()); // 픽스처 설정
	});
	it('shortfall', function() {
		assert.equal(asia.shortfall, 5); // 검증
	})
	it('change production', function() {
		asia.producer[0].production = 20;
		expect(asia.shortfall).equal(-6);
		expect(asia.profit).equal(292);
	})
})

describe('no producers', function() {
	let noProducers;
	beforeEach(function () {
		const data = {
			name: "No producers",
			producers: [],
			demand: 30,
			price: 20,
		};
		noProducers = new Province(data);
	});
	it('shortfall', function () {
		expect(noProducers.shortfall).equal(30);
	})
})
