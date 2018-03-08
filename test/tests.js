
$('#tests-btn').click(function() {
	var div = $('#mocha');
	if (div.css('display') == 'none') div.show(); else div.hide();
});

describe("game()", function() {
	describe("Card()", function() {
		it("проверка Card()", function() {
			var card = {name: "KD", image: "KD.png", id: "KD"};
			expect(new Card(card,2).id).to.equal('#KD-2');
		});
	});
	describe("trimArray()", function() {
		it("проверка длины newArray в trimArray()", function() {
			expect(trimArray(cardData).length).to.equal(9);
		});
	});
	describe("startGame()", function() {
		it("проверка сброса флага gameStarted", function() {
			assert.isFalse(gameStarted, 'gameStarted - флаг, обозначающий началась ли игра');
		});
		it("содержит ли cardData 52 карты", function() {
			expect(cardData.length).to.equal(52);
		});
		it("содержит ли cardData карты в нужном формате", function() {
			expect(cardData[51].image).to.exist
		});
		it("содержит ли cardData карты в нужном формате", function() {
			expect(cardData[51].id).to.exist
		});
	});
	describe("какая-то_функция()", function() {
		it("Какой-то там тест №1", function(done) {
			if (pairs == 9) {done();} else {throw new TypeError('Опаньки, ошибонька =) да, я специально слил тест!');};
		});
	});
});

