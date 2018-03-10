mocha.setup('bdd');
$('#tests-btn').click(function() {
    $('#close-tests-btn').show();
    $('#sound_player').removeAttr('id')
    if ($('#mocha').css('display') == 'none') $('#mocha').show();
    else $('#mocha').hide();
    mocha.checkLeaks();
    mocha.globals(['jQuery']);
    mocha.run();
});
$('#close-tests-btn').click(function() {
    location.reload();
});
$('.start-btn').click(function() {
    $('#tests-btn').hide();
});

describe("pathsImages()", function() {
    it("Ссылки на картинки для предзагрузки созданы", function() {
        paths = [];
        let expected = [];
        pathsImages();
        for (var i = 0; i < cardData.length; i++) {
            if (paths[i] == "images/" + cardData[i].image)
                expected.push(paths[i]);
        };
        expect(paths).to.eql(expected);
    });
}); // конец pathsImages()

describe("preloadImages()", function() {
    it("Игра запущена только после предзагрузки карт", function() {
        let paths = [];
        gameStarted = true;
        cardData.forEach(function(card) {
            paths.push("images/" + card.image);
        });
        preloadImages(paths, start);
        $('.start-btn').click();
        expect(gameStarted).to.equal(false);
    });
}); // конец preloadImages()


describe("start()", function() {
    it("Индикатор загрузки включен", function() {
        $('.start-btn').removeClass('loaded');
        start();
        expect($('.start-btn')[0].classList[$('.start-btn')[0].classList.length - 1]).to.equal('loaded');
    });
    it("Стратовый экран скрыт при нажатии кнопки 'начать игру'", function() {
        $('#modal-start').show();
        start();
        $('.start-btn').click();
        expect($('#modal-start').css('display')).to.equal('none');
    });
    it("Игра запущена", function() {
        gameStarted = true;
        start();
        $('.start-btn').click();
        expect(gameStarted).to.equal(false);
    });
}); // конец start()

describe("restart()", function() {
    it("Экран победы скрыт при нажатии кнопки 'Начать заново'", function() {
        $('#modal-win').show();
        gameStarted = true;
        restart();
        expect($('#modal-win').css('display')).to.equal('none');
    });
    it("Игра перезапущена", function() {
        gameStarted = true;
        restart();
        expect(gameStarted).to.equal(false);
    });
}); // конец restart()

describe("game()", function() {
    it("содержит ли cardData 52 карты", function() {
        expect(cardData.length).to.equal(52);
    });
    it("содержит ли cardData карты в нужном формате", function(done) {
        for (var i = 0; i < cardData.length; i++)
            if (cardData[i].name, cardData[i].image, cardData[i].id = undefined)
                throw new TypeError('Ошибка');
        done();
    });

    describe("Card()", function() {
        it("проверка Card()", function(done) {
            let card = {
                name: "KD",
                image: "KD.png",
                id: "KD"
            };
            let newCard = new Card(card, 2);
            let newCardHTML = "<article class='card' id='" + card.id + "-2'><div class='card-back'><div class='card-back-image' style='background: url(images/" + card.image + ");background-size: cover;'></div></div><div class='card-front'><div class='card-front-image'></div></div></article>";
            if (newCard.id == '#' + card.id + '-2' && newCard.image == card.image && newCard.name == card.name && newCard.html == newCardHTML)
                done();
            else
                throw new TypeError('Ошибка');
        });
    });

    describe("game()", function() {

        it("Сброс gameStarted()", function() {
            game();
            expect(gameStarted, 'gameStarted - флаг, обозначающий началась ли игра').to.equal(false);;
        });
        it("Сброс click1", function() {
            game();
            expect(click1).to.equal(0);
        });
        it("Сброс click2", function() {
            game();
            expect(click2).to.equal(0);
        });
        it("Сброс matches", function() {
            game();
            expect(matches).to.equal(0);
        });
        it("Сброс #game-board", function() {
            game();
            expect($('#game-board').html).to.be.empty;
        });
        it("Сброс #modal-win", function() {
            game();
            expect($('#modal-win').html).to.be.empty;
        });
        describe("makeCardArray()", function() {
            it("Возврат верного array", function(done) {
                let cardArray = [{
                    id: "KD"
                }, {
                    id: "9C"
                }];
                let expected = ['#KD-1', '#KD-2', '#9C-1', '#9C-2'];

                for (var i = 0; i < expected.length; i++) {
                    if (makeCardArray(cardArray)[i].id != expected[i])
                        throw new TypeError('Ошибка');
                };
                done();
            });

            describe("trimArray()", function() {
                it("проверка длины newArray в trimArray()", function() {
                    expect(trimArray(cardData).length).to.equal(9);
                });
            }); // конец trimArray()
        }); // конец makeCardArray()
        describe("shuffle()", function() {
            it("Проверка перемешивания карт", function(done) {
                let card = [{
                    id: "5S"
                }, {
                    id: "6C"
                }];
                let array = shuffle(card);
                while (array[0].id != "6C") {
                    if (array[0].id == "5S") {
                        array = shuffle(card);
                    } else
                        throw new TypeError('Ошибка');
                }
                done();
            });
        }); // конец shuffle()

    }); // конец game()
    describe("displayCards()", function() {
        it("Проверка массива cards", function() {
            let cardArray = [{
                    html: "123-1"
                },
                {
                    html: "123-2"
                }
            ];
            let expected = 0;
            expected = '<section id="game-board" class="board">123-1123-2</section>';
            $('#game-board').empty();
            displayCards(cardArray);
            expect($('#game-board').prop('outerHTML')).to.have.string(expected);
        });
        describe("checkMatch()", function() {
            it("Не пара", function(done) {
                let card = [{
                        id: "#0C-1",
                        image: "0C.png",
                        name: "0C",
                        html: "<article class='card' id='0C-1'><div class='card-back'><div class='card-back-image' style='background: url(images/0C.png);background-size: cover;'></div></div><div class='card-front'><div class='card-front-image'></div></div></article>"
                    },
                    {
                        id: "#7C-1",
                        image: "7C.png",
                        name: "7C",
                        html: "<article class='card' id='7C-1'><div class='card-back'><div class='card-back-image' style='background: url(images/7C.png);background-size: cover;'></div></div><div class='card-front'><div class='card-front-image'></div></div></article>"
                    }
                ];
                let cards = [];
                click1 = {};
                click2 = {};
                $('#game-board').empty();
                for (var i = 0; i < card.length; i++) {
                    cards.push(card[i].html);
                }
                $('#game-board').append(cards);
                checkMatch(card[0]);
                checkMatch(card[1]);
                if (click1 == card[0] && click2 == card[1] && $(card[1].id)[0].classList[$(card[1].id)[0].classList.length - 1] == 'flipped')
                    done();
                else
                    throw new TypeError('Ошибка');
            });
            it("Пара", function(done) {
                let card = [{
                        id: "#7C-1",
                        image: "7C.png",
                        name: "7C",
                        html: "<article class='card' id='7C-1'><div class='card-back'><div class='card-back-image' style='background: url(images/7C.png);background-size: cover;'></div></div><div class='card-front'><div class='card-front-image'></div></div></article>"
                    },
                    {
                        id: "#7C-2",
                        image: "7C.png",
                        name: "7C",
                        html: "<article class='card' id='7C-2'><div class='card-back'><div class='card-back-image' style='background: url(images/7C.png);background-size: cover;'></div></div><div class='card-front'><div class='card-front-image'></div></div></article>"
                    }
                ];
                let cards = [];
                click1 = {};
                click2 = {};
                $('#game-board').empty();
                for (var i = 0; i < card.length; i++) {
                    cards.push(card[i].html);
                }
                $('#game-board').append(cards);
                checkMatch(card[0]);
                checkMatch(card[1]);
                if (click1 == card[0] && click2 == card[1] && $(card[1].id)[0].classList[$(card[1].id)[0].classList.length - 1] == 'removed')
                    done();
                else
                    throw new TypeError('Ошибка');
            });
            describe("foundMatch()", function() {
                it("Найденная пара убрана", function(done) {
                    let card = [{
                            id: "#7C-1",
                            image: "7C.png",
                            name: "7C",
                            html: "<article class='card' id='7C-1'><div class='card-back'><div class='card-back-image' style='background: url(images/7C.png);background-size: cover;'></div></div><div class='card-front'><div class='card-front-image'></div></div></article>"
                        },
                        {
                            id: "#7C-2",
                            image: "7C.png",
                            name: "7C",
                            html: "<article class='card' id='7C-2'><div class='card-back'><div class='card-back-image' style='background: url(images/7C.png);background-size: cover;'></div></div><div class='card-front'><div class='card-front-image'></div></div></article>"
                        }
                    ];
                    let cards = [];
                    let expected = matches;
                    click1 = card[0];
                    click2 = card[1];
                    $('#game-board').empty();
                    for (var i = 0; i < card.length; i++) {
                        cards.push(card[i].html);
                    }
                    $('#game-board').append(cards);
                    foundMatch();
                    if (matches == expected + 1 && $(card[0].id)[0].classList[$(card[0].id)[0].classList.length - 1], $(card[1].id)[0].classList[$(card[1].id)[0].classList.length - 1] == 'removed')
                        done();
                    else
                        throw new TypeError('Ошибка');
                });

                describe("gameOver()", function(done) {
                    it("Игра окончена", function() {
                        $('#modal-win').hide();
                        gameOver();
                        setTimeout(function() {
                            expect($('#modal-win').css('display')).to.equal('flex');
                        }, 700);
                    });
                }); // конец gameOver()

            }); // конец foundMatch()
            describe("hideCards()", function() {
                it("Неугаданная пара скрыта", function(done) {
                    let card = [{
                            id: "#7C-1",
                            image: "7C.png",
                            name: "7C",
                            html: "<article class='card' id='7C-1'><div class='card-back'><div class='card-back-image' style='background: url(images/7C.png);background-size: cover;'></div></div><div class='card-front'><div class='card-front-image'></div></div></article>"
                        },
                        {
                            id: "#7C-2",
                            image: "7C.png",
                            name: "7C",
                            html: "<article class='card' id='7C-2'><div class='card-back'><div class='card-back-image' style='background: url(images/7C.png);background-size: cover;'></div></div><div class='card-front'><div class='card-front-image'></div></div></article>"
                        }
                    ];
                    let cards = [];
                    click1 = card[0];
                    click2 = card[1];
                    $('#game-board').empty();
                    for (var i = 0; i < card.length; i++) {
                        cards.push(card[i].html);
                    }
                    $('#game-board').append(cards);
                    hideCards();
                    if (click1, click2 == {} && $(card[0].id)[0].classList[$(card[0].id)[0].classList.length - 1], $(card[1].id)[0].classList[$(card[1].id)[0].classList.length - 1] != 'flipped')
                        done();
                    else
                        throw new TypeError('Ошибка');
                });
            }); // конец hideCards()
            describe("matchScore()", function() {
                it("Увеличение очков при образовании пары (0 пар угадано)", function() {
                    score = 0;
                    matches = 1;
                    matchScore(true);
                    expect(score).to.equal(336);
                });
                it("Увеличение очков при образовании пары (4 пары угаданы)", function() {
                    score = 0;
                    matches = 4;
                    matchScore(true);
                    expect(score).to.equal(210);
                });
                it("Увеличение очков при образовании пары (все пары угаданы)", function() {
                    score = 0;
                    matches = 9;
                    matchScore(true);
                    expect(score).to.equal(0);
                });
                it("Уменьшение очков при не совпадении пары (0 пар угадано)", function() {
                    score = 1000;
                    matches = 0;
                    matchScore(false);
                    expect(score).to.equal(1000);
                });
                it("Уменьшение очков при не совпадении пары (4 пары угаданы)", function() {
                    score = 1000;
                    matches = 4;
                    matchScore(false);
                    expect(score).to.equal(832);
                });
                it("Уменьшение очков при не совпадении пары (все пары угаданы)", function() {
                    score = 1000;
                    matches = 9;
                    matchScore(false);
                    expect(score).to.equal(622);
                });
                it("При нуле очки не меняются", function() {
                    score = 0;
                    matches = 999;
                    matchScore(false);
                    expect(score).to.equal(0);
                });
            }); // конец matchScore()
        }); // конец checkMatch()
        describe("gameStartedFlip()", function() {
            it("Показ карт в начале игры", function() {
                let card = {
                    id: "#0C-1",
                    image: "0C.png",
                    name: "0C",
                    html: "<article class='card' id='0C-1'><div class='card-back'><div class='card-back-image' style='background: url(images/0C.png);background-size: cover;'></div></div><div class='card-front'><div class='card-front-image'></div></div></article>"
                };
                $('#game-board').empty();
                $('#game-board').append(card.html);
                let cardsID = ["#0C-1", "#0C-2"];
                gameStartedFlip(cardsID);
                expect($(card.id)[0].classList[$(card.id)[0].classList.length - 1]).to.equal('flipped');
            });
            it("Скрытие карт спустя 5 секунд", function(done) {
                this.timeout(8000);
                let card = {
                    id: "#0C-1",
                    image: "0C.png",
                    name: "0C",
                    html: "<article class='card' id='0C-1'><div class='card-back'><div class='card-back-image' style='background: url(images/0C.png);background-size: cover;'></div></div><div class='card-front'><div class='card-front-image'></div></div></article>"
                };
                $('#game-board').empty();
                $('#game-board').append(card.html);
                let cardsID = ["#0C-1", "#0C-2"];
                gameStartedFlip(cardsID);

                if ($(card.id)[0].classList[$(card.id)[0].classList.length - 1] == 'flipped') {
                    setTimeout(function() {
                        if ($(card.id)[0].classList[$(card.id)[0].classList.length - 1] != 'flipped')
                            done();
                    }, 5000);
                } else
                    throw new TypeError('Ошибка');
            });
        }); // конец gameStartedFlip()
    }); // конец displayCards()
}); // конец game()