'use strict';

//предзагрузчик изображений

function pathsCards() {
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

let click1 = {},
    click2 = {},
    paths = [],
    pairs = 9,
    gameStarted = false,
    matches, score, moves;

function Card(card, num) {
    //console.log(card.id,card.image,card.name);
    let cardID = card.id + '-' + num;
    this.id = '#' + card.id + '-' + num;
    this.image = card.image;
    this.name = card.name;
    this.html = "<article class='card' id='" + cardID + "'><div class='card-back'><div class='card-back-image' style='background: url(images/" + this.image + ");background-size: cover;'></div></div><div class='card-front'><div class='card-front-image'></div></div></article>";
}

// set size of card array based on level
function trimArray(array) {
    let newArray = array.slice();
    // trim array as needed
    while (newArray.length > pairs) {
        let randomIndex = Math.floor(Math.random() * newArray.length);
        newArray.splice(randomIndex, 1);
    }
    return newArray;
}

function makeCardArray(data) {

    let array = [];

    // Get the correct sized array for level
    let trimmedData = trimArray(data);

    // Add two of each card to the array
    trimmedData.forEach(function(card) {
        array.push(new Card(card, 1));
        array.push(new Card(card, 2));
    });

    return array;
}

function shuffle(array) {
    let currentIndex = array.length,
        temporaryValue, randomIndex;

    while (0 !== currentIndex) {

        // Choose an element randomly
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // Switch current element and random element
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function displayCards(cardArray) {
    let cards = [];
    cardArray.forEach(function(card) {
        // Add cards to game board
        cards.push(card.html);
    });

    $('#game-board').append(cards);

    setTimeout(function() {
        cardArray.forEach(function(card) {
            gameStartedFlip(card);

            setTimeout(function() {

                if (!gameStarted) {
                    gameStarted = true;
                }
                // Add click listeners
                $(card.id).click(function() {
                    // Check for match when clicked
                    checkMatch(card);
                });
            }, 5000);
        })
    }, 100);
}

function playSound(sound) {
    //document.getElementById(sound).play();
    $("#sound_player").html('<audio autoplay><source src="sounds/' + sound + '.ogg" /><source src="sounds/' + sound + '.mp3" /></audio>');
}

function gameStartedFlip(card) {
    playSound('flip');
    $(card.id).addClass('flipped');
    setTimeout(function() {
        playSound('flip');
        ($(card.id).removeClass('flipped'));
    }, 5000);
}

function matchScore(op) {
    if (op == 'add')
        score += (pairs - matches) * 42;
    else if (op == 'rem') {
        score -= (matches) * 42;
        if (score < 0) score = 0;
    } else
        score = 0;
    $(".score").text(score);
}

function checkMatch(card) {

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

        // Update move count
        moves++;
        $("#moves").text(moves);

    } else return;

    if (click1.name === click2.name) {

        foundMatch();
        matchScore('add');
        //  score += (pairs - matches) * 42;
    } else {
        hideCards();
        matchScore('rem');
        //  score -= (matches) * 42;
    };

    //$(".Menu-scores").text(score);

}

function foundMatch() {
    $(click1.id).addClass('removed');
    $(click2.id).addClass('removed');
    matches++;
    if (matches === pairs) {
        gameOver();
    }

    // Unbind click functions and reset click objects
    $(click1.id).unbind('click');
    $(click2.id).unbind('click');
    // reset click objects
    click1 = {};
    click2 = {};
}

function hideCards() {
    //hide cards
    setTimeout(function() {
        playSound('flip');
        $(click1.id).removeClass('flipped');
        $(click2.id).removeClass('flipped');
        // reset click objects
        click1 = {};
        click2 = {};
    }, 600);
}

function gameOver() {
    // Pause before shoe modal
    setTimeout(function() {
        playSound('win');
        $('#winModal').show().css('display', 'flex');
    }, 600);
}

$(document).ready(function() {
    preloadImages('images/StartGame@2x.png');
});

$(window).on('load', function() {

    // Open start modal on load
    $('#startModal').show().css('display', 'flex');

    pathsCards();
    preloadImages(paths, start);

    $('.restart').click(restart);

});

function start() {
    $('#start-btn').addClass('loaded');
    $('#start-btn').click(function() {
        game(cardData);
        $('#startModal').hide();
        $('header').show();
        game(cardData);

    });
}

function restart() {
    if (gameStarted) {
        $('#winModal').hide();
        game(cardData);
    }
}

function game(cards, level) {

    // reset game variables
    gameStarted = false;
    matchScore();
    click1 = 0;
    click2 = 0;
    moves = 0;
    matches = 0;

    // reset HTML
    $('#game-board').empty();

    $(".clock").text('0:00');
    $("#moves").text('0');
    $('#winModal').hide();

    // Get cards and start the game!
    let cardArray = makeCardArray(cardData);

    shuffle(cardArray);
    displayCards(cardArray);

};