'use strict';

let click1 = {},
    click2 = {},
    paths = [],
    pairs = 9,
    gameStarted = false,
    matches, score;

//предзагрузчик изображений

function pathsImages() {
    cardData.forEach(function(card) {
        paths.push("images/" + card.image);
    });

}

function preloadImages() {
    if (typeof arguments[arguments.length - 1] == 'function') {
        var callback = arguments[arguments.length - 1];
    } else {
        var callback = false;
    }
    if (typeof arguments[0] == 'object') {
        var images = arguments[0];
        var n = images.length;
    } else {
        var images = arguments;
        var n = images.length - 1;
    }
    var not_loaded = n;
    for (var i = 0; i < n; i++) {
        $(new Image()).on('load', function() {
            if (--not_loaded < 1 && typeof callback == 'function') {
                callback();
            }
        }).attr('src', images[i]);
    }
}

function Card(card, num) {
    let cardID = card.id + '-' + num;
    this.id = '#' + card.id + '-' + num;
    this.image = card.image;
    this.name = card.name;
    this.html = "<article class='card' id='" + cardID + "'><div class='card-back' data-tid='Card-flipped'><div class='card-back-image' style='background: url(images/" + this.image + ");background-size: cover;'></div></div><div class='card-front' data-tid='Card'><div class='card-front-image'></div></div></article>";
}

// set size of card array based on level
function trimArray(array) {
    let newArray = array.slice();
    // отрезание массива по мере необходимости
    while (newArray.length > pairs) {
        let randomIndex = Math.floor(Math.random() * newArray.length);
        newArray.splice(randomIndex, 1);
    }
    return newArray;
}

function makeCardArray(data) {

    let array = [];

    let trimmedData = trimArray(data);

    // Добавление двух парных карт в массив
    trimmedData.forEach(function(card) {
        array.push(new Card(card, 1));
        array.push(new Card(card, 2));
    });
    return array;
}

function shuffle(array) {
    let currentIndex = array.length,
        randomIndex;

    while (0 !== currentIndex) {

        // Выбор случайного элемента
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // Свап current element и random element
        array[currentIndex] = [array[randomIndex], array[randomIndex] = array[currentIndex]][0];
    }

    return array;
}

function displayCards(cardArray) {

    let cardsHTML = [];
    let cardsID = [];
    cardArray.forEach(function(card) {
        cardsHTML.push(card.html);
        cardsID.push(card.id);
    });

    // Добавление карт в #game-board
    $('#game-board').append(cardsHTML);

    setTimeout(function() {

        gameStartedFlip(cardsID, function() {
            if (!gameStarted) {
                gameStarted = true;
            };
            cardArray.forEach(function(card) {
                // Включение обработчика кликов
                $(card.id).click(function() {
                    // Проверка на парность
                    checkMatch(card);
                });
            });
        });
    }, 100);
}

function playSound(sound) {
    $("#sound_player").html('<audio autoplay><source src="sounds/' + sound + '.ogg" /><source src="sounds/' + sound + '.mp3" /></audio>');
}

function gameStartedFlip(cards, callback) {
    playSound('flip');
    for (var i = 0; i < cards.length; i++) {
        $(cards[i]).addClass('flipped');
    };

    setTimeout(function() {
        playSound('flip');
        for (var i = 0; i < cards.length; i++) {
            $(cards[i]).removeClass('flipped');
        };
        if (callback) callback();
    }, 5000);
}

function matchScore(op) {
    if (op)
        score += (pairs - matches) * 42;
    else if (op == false) {
        score -= (matches) * 42;
        if (score < 0) score = 0;
    } else score = 0;
    $(".score-counter").text(score);
}

function checkMatch(card) {
    //console.log(click1.name);
    if (!click1.name) {
        click1 = card;
        playSound('flip');
        $(card.id).addClass('flipped');
        return;

        // For second card, check if its a different card
    } else if (!click2.name && click1.id !== card.id) {
        click2 = card;
        playSound('flip');
        $(card.id).addClass('flipped');

    } else return;
    if (click1.name === click2.name) {
        foundMatch();
        matchScore(true);

    } else {
        matchScore(false);
        hideCards();

    };

}

function foundMatch() {
    $(click1.id).addClass('removed');
    $(click2.id).addClass('removed');
    matches++;
    if (matches === pairs) {
        gameOver();
    }
    // Запрет на выбор уже раскрытых пар
    $(click1.id).unbind('click');
    $(click2.id).unbind('click');
    // Пауза перед новой попыткой
    setTimeout(function() {
        // сброс выбранных объектов
        click1 = {};
        click2 = {};
    }, 600);
}

function hideCards() {
    // Пауза перед обратным скрытием неверно выбранных карт
    setTimeout(function() {
        playSound('flip');
        $(click1.id).removeClass('flipped');
        $(click2.id).removeClass('flipped');
        // сброс выбранных объектов
        click1 = {};
        click2 = {};
    }, 600);
}

function gameOver() {
    // Пауза перед показом окна победы
    setTimeout(function() {
        playSound('win');
        $('#modal-win').show().css('display', 'flex');
    }, 600);
}

$(document).ready(function() {
    // Предзагрузка лого
    preloadImages('images/StartGame@2x.png');
});

$(window).on('load', function() {

    // Показ стартового экрана после загрузки
    $('#modal-start').show().css('display', 'flex');
    if (!gameStarted) {
        $('.restart').click(restart);
    }
    pathsImages();
    preloadImages(paths, start);
});

function start() {
    $('.start-btn').addClass('loaded');
    $('.start-btn').click(function() {
        game();
        $('#modal-start').hide();
        $('.info').show();

    });
}

function restart() {
    if (gameStarted) {
        $('#modal-win').hide();
        game();
    }
}

function game() {

    // Сброс значений игровых переменных
    gameStarted = false;
    matchScore();
    click1 = 0;
    click2 = 0;
    matches = 0;

    // сброс HTML
    $('#game-board').empty();
    $('#modal-win').hide();

    // Получение карт и начало игры
    let cardArray = makeCardArray(cardData);

    shuffle(cardArray);
    displayCards(cardArray);

};