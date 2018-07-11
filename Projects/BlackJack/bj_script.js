// $(document).ready(function () {
$(window).on('load', function (e) {

class PlayButtons {
    constructor() {
        this.$all = $('.buttons');
        this.$play = $('#btn_play');
        this.$deal = $('#btn_deal');
        this.$insure = $('#btn_ins');
        this.$insureNot = $('#btn_ins_not');
        this.$split = $('#btn_split');
        this.$keep = $('#btn_keep');
        this.$hit = $('#btn_hit');
        this.$hitSpl = $('#btn_hit_spl');
        this.$double = $('#btn_double');
        this.$doubleSpl = $('#btn_double_spl');
        this.$stand = $('#btn_stand');
        this.$standSpl = $('#btn_stand_spl');
        this.$max = $('#btn_max');
        this.$flat = $('#btn_flat');
        this.$repeat = $('#btn_repeat');
        this.$clear = $('#btn_clear');
        this.$chips = $('.chip');
        this.$playAgain = $('#btn_play_again');
    }
    activateButtons() {
        this.$play.click(function () {
            animButton($(this), deal);
        });
        this.$deal.click(function () {
            animButton($(this), dealing);
        });
        this.$insure.click(function () {
            if (isEnoughMoneyForInsure()) animButton($(this), afterInsuring);
        });
        this.$insureNot.click(function () {
            animButton($(this), afterInsuringNot);
        });
        this.$split.click(function () {
            if (isEnoughMoney()) animButton($(this), splitting);
        });
        this.$keep.click(function () {
            animButton($(this), keeping);
        });
        this.$hit.click(function () {
            animButton($(this), function () {
                hitting(1);
            });
        });
        this.$hitSpl.click(function () {
            animButton($(this), function () {
                hitting(2);
            });
        });
        this.$stand.click(function () {
            animButton($(this), function () {
                standing(1);
            });
        });
        this.$standSpl.click(function () {
            animButton($(this), function () {
                standing(2);
            });
        });
        this.$double.click(function () {
            if (isEnoughMoney()) animButton($(this), function () {
                doubling(1);
            });
        });
        this.$doubleSpl.click(function () {
            if (isEnoughMoney()) animButton($(this), function () {
                doubling(2);
            });
        });
        this.$max.click(function () {
            animButton($(this), maxing);
        });
        this.$flat.click(function () {
            animButton($(this), flatting);
        });
        this.$repeat.click(function () {
            animButton($(this), repeating);
        });
        this.$clear.click(function () {
            animButton($(this), clearing);
        });
        this.$chips.click(function () {
            var $self = $(this);
            $self.effect('highlight', {color: '#ffffff'}, 100, function () {
                chipping(+$self.attr('data-value'));
            });
        });
        this.$playAgain.click(function () {
            animButton($(this), playAgain);
        });
    }
    activateStartPlay() {
        hideBtn(this.$all);
        showBtn(this.$play);
    }
    activateDeal() {
        hideBtn(this.$all);
        showBtn(this.$deal);
    }
    activateInsuring() {
        hideBtn(this.$all);
        showBtn(this.$insure);
        showBtn(this.$insureNot);
    }
    activateCompare() {
        hideBtn(this.$all);
    }
    activateSplit() {
        hideBtn(this.$all);
        showBtn(this.$split);
        showBtn(this.$keep);
    }
    activateHitStand(handNum) {
        hideBtn(this.$all);
        if (handNum === 2) {
            showBtn(this.$hitSpl);
            showBtn(this.$standSpl);
        } else {
            showBtn(this.$hit);
            showBtn(this.$stand);
        }
    }
    activateStandartPlay(handNum) {
        this.activateHitStand(handNum);
        if (handNum === 2) {
            showBtn(this.$doubleSpl);
        } else {
            showBtn(this.$double);
        }
    }
    checkForDisable() {
        if (!isEnoughMoney()) {
            disableBtn(this.$split);
            disableBtn(this.$double);
            disableBtn(this.$doubleSpl);
            if (!isEnoughMoneyForInsure()) {
                disableBtn(this.$insure);
            } else {
                enableBtn(this.$insure);
            }
        } else {
            enableBtn(this.$split);
            enableBtn(this.$double);
            enableBtn(this.$doubleSpl);
            enableBtn(this.$insure);
        }
    }
    gameOver() {
        hideBtn(this.$all);
        showBtn(this.$playAgain);
    }
    activateBets() {
        hideBtn(this.$all);
        showBtn(this.$max);
        showBtn(this.$flat);
        showBtn(this.$repeat);
    }
    activateBets0() {
        hideBtn(this.$all);
        showBtn(this.$max);
        showBtn(this.$flat);
    }
    activateConfirmChips() {
        hideBtn(this.$all);
        showBtn(this.$clear);
        showBtn(this.$deal);
    }
    checkChipsForShow() {
        this.$chips.each(function () {
            var $self = $(this);
            var value = +$self.attr('data-value');
            if (money < value && $self.parent().css('display') === 'none') {
                hideBtn($self);
            } else if (money < value && $self.css('display') === 'inline-block') {
                $self.effect('fade', 200, function () {
                    hideBtn($self);
                });
           } else if (money < value) {
                hideBtn($self);
            } else {
                showBtn($self);
            }
        });
    }
}

class Hand {
    constructor (selector) {
        this.$hand = $(selector);
        this.handArr = [];
        this.$line = this.$hand.children('.main_hand');
        this.$counter = this.$hand.children('.counter');
        this.counter = {points: 0, altPoints: 0};
        this.splitted = false;
        this.pot = 0;
        this.potIns = 0;
        this.$pot = this.$hand.children('.hand_pot');
        this.$insPot = this.$hand.children('.ins_pot');
    }
    clearHand() {
        this.handArr = [];
        this.counter = {points: 0, altPoints: 0};
        this.splitted = false;
        this.$line.html('');
        this.hidePoints();
        this.pot = 0;
        this.potIns = 0;
        this.$pot.html('');
        this.$pot.removeClass('hand_pot_positive');
        this.$insPot.html('');
        this.$insPot.removeClass('hand_pot_positive');
        this.shineOff();
    }
    hideDealers2() {
        cardFace(this.$hand.children('.main_hand').children('.in_game').eq(1), cardBack);
    }
    showDealers2() {
        var $d2 = this.$hand.children('.main_hand').children('.in_game').eq(1);
        var d2num = +$d2.attr('id').slice(4);
        cardFace($d2, d2num);
        // this.$hand.unHidePoints();
    }
    cardTransfer(callback) {
        $player.potDown();
        var card = cardTransferArr(shuffledPack, this.handArr);
        showTransferredCard(this.$hand, this.$line, card, this.handArr, this.counter, this.$counter, callback);
        cardAddPoints(card, this.counter, this.$counter, this.handArr);
    }
    hidePoints() {
        this.$counter.css('display', 'none');
    }
    hidePots() {
        this.$pot.html('');
        this.$insPot.html('');
    }

    unHidePoints() {
        this.$counter.css('display', 'block');
    }
    getCardPoint(num) {
        var card = this.handArr[num - 1];
        return cards[card - 1].points;
    }
    getPoints() {
        return this.counter.points;
    }
    hasSplitted() {
        return this.splitted;
    }
    getNumberOfCards() {
        return this.handArr.length;
    }
    changePot (newPot) {
        this.pot = newPot;
        writeYourMoney(this.$pot, newPot, '- $ ');
        animChangePot(this.$pot);
    }
    writePize (sum) {
        writeYourMoney(this.$pot, sum, '+ $ ');
        this.$pot.addClass('hand_pot_positive');
        animChangePot(this.$pot);
    }
    getPot () {
        return this.pot;
    }
    getPotIns () {
        return this.potIns;
    }
    changePotIns () {
        this.potIns = this.pot / 2;
        writeYourMoney(this.$insPot, this.potIns, '- $ ');
        animChangePot(this.$insPot);
    }
    insPositive () {
        writeYourMoney(this.$insPot, this.potIns * 2, '+ $ ');
        this.$insPot.addClass('hand_pot_positive');
        animChangePot(this.$insPot);
    }
    insClear () {
        this.potIns = 0;
    }
    shineOn() {
        // this.$counter.css('box-shadow', 'white 0 0 15px 15px');
        this.$hand.css('opacity', '0.7')
    }
    shineOff() {
        // this.$counter.css('box-shadow', 'none');
        this.$hand.css('opacity', '1')
    }
    splitPositionOn() {
        this.$hand.css('left', '-320px');
    }
    splitPositionOff() {
        this.$hand.css('left', '0px');
    }
    potUp () {
        this.$pot.css('top', '400px')
    }
    potDown () {
        this.$pot.css('top', '465px')
    }
}

const suits = ['s', 'h', 'c', 'd'];
const ranks = ['a', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'j', 'q', 'k'];
const points = [11, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10];
const degrees = [3, -5, 1, -4, 0, -2, 2, -3, 0, 5, 4, -1, 0];
var cardBack = 59; //рубашка от 53 по 64, 65 - пустота
const cards = getCards(suits, ranks, points, degrees);
console.log(cards);

const coords = {
    dealer: {left: 300, top: 20 , step: 30},
    player: {left: 350, top: 270 , step: 30},
    playerSpl: {left: 380, top: 270 , step: 30}
};

const chipsNums = [1, 5, 25, 100, 500];
const chipsLevels = ['', 'K', 'M', 'B'];
var chips = getChips(chipsLevels, chipsNums);
var $chips = $('#chips');
console.log(chips);

    buildChips();

    var $summaryText = $('#summary_text');
    var $summary = $('#summary_wrapper');

var $cardsDeck_new = $('.cards_new');
var $cardsDeck_played = $('.cards_played');

cardFace($cardsDeck_new, cardBack);
cardFace($cardsDeck_played, 65);
$cardsDeck_new.css('display', ' block');
$cardsDeck_played.css('display', ' block');

var shuffledPack = getShuffledPack(cards.length);
console.log(shuffledPack);

var testPack = [1, 3, 14, 8, 10, 7, 34, 2, 5, 28, 25, 20, 3, 22, 8, 43, 34, 1, 5, 28, 25, 19, 1, 21, 8, 43, 34, 1, 5, 28, 25, 19, 1, 21];
// shuffledPack = testPack;

var $dealer = new Hand('#dealer_line');
var $player = new Hand('#player_line');
var $playerSpl = new Hand('#player_line_spl');
var btnsPlay = new PlayButtons();

var money = 10000;
var betRound = 0;
var betPre = 0;
var $moneyText = $('#money').children('span');
writeYourMoney($moneyText, money, '$ ');

var prize1 = 0;
var prize2 = 0;

btnsPlay.activateButtons();
var $sliderButtons = $('.slider');

hideAllHandsPoints();
startPlay();

slider();

    function showTransferredCard($hand, $line, card, handArr, counter, $counter, callback) {
        $line.append('<div class="cards in_game" id="' + 'card' + card + '"></div>');
        var $card = $('#card' + card);
        var zeroLeft = 0;
        if ($hand.attr('id') === 'player_line' && $player.hasSplitted()) {
            zeroLeft = 320;
        }
        $card.css({
            'left': 719 + zeroLeft + 'px',
            'top': '-130px',
            'transform': 'rotate(30deg)'
        });
        if ($hand.attr('id') === 'dealer_line' && handArr.length === 2) {
            $dealer.hideDealers2();
        } else {
            cardFace($card, card);
        }
        var newCoords = getCoordsToMove($hand, handArr, card);
        var left = newCoords.left;
        var top = newCoords.top;
        var transform = newCoords.transform;
        var cardAnim = $card.get(0);

        var anim1 = anime({
            targets: cardAnim,
            left: left,
            rotate: transform,
            top: top,
            easing: 'easeOutCirc',
            duration: 200,
            complete: function () {
                // cardAddPoints(card, counter, $counter, handArr);
                callback();
            }
        });

    }

    function getCoordsToMove($hand, handArr, card) {
        var zero, left, top, transform;
        if ($hand.attr('id') === 'dealer_line') {
            zero = coords.dealer;
        } else if ($hand.attr('id') === 'player_line') {
            zero = coords.player;
        } else if ($hand.attr('id') === 'player_line_spl') {
            zero = coords.playerSpl;
        }
        left = zero.left + zero.step * (handArr.length - 1);
        top = zero.top;
        transform = cards[card - 1].degree;
        return {left: left, top: top, transform: transform}
    }

    function allCardsOff(callback) {

        var allCards = $('.in_game');
        // alert(allCards.length);
        if (allCards.length === 0) {
            callback();
        } else {
            allCards.each(function () {
                var zeroLeft = 0;
                var $self = $(this);
                var self = $self.get(0);

                var anim2 = anime({
                    targets: self,
                    left: -131 + zeroLeft,
                    rotate: '1turn',
                    top: -190,
                    easing: 'linear',
                    duration: 400,
                    complete: function () {
                        // cardAddPoints(card, counter, $counter, handArr);
                        callback();
                    }
                });
            });
        }
    }

    function clear() {
        btnsPlay.activateCompare();

        money += prize1 + prize2;
        money += $player.getPotIns() * 2;
        reWriteYourMoney();

        hideBlock($summary);
        $dealer.hidePoints();
        $player.hidePoints();
        $playerSpl.hidePoints();
        $dealer.hidePots();
        $player.hidePots();
        $playerSpl.hidePots();

        allCardsOff(function () {

            if (money > 0) {
                if (betRound > money) {
                    betRound = 0;
                }
                // clear();
                startBets();
            } else {
                // clear();
                gameOver();
            }

            $dealer.clearHand();
            $player.clearHand();
            $playerSpl.clearHand();
            cardFace($cardsDeck_played, cardBack);

            if (shuffledPack.length < 21) {
                shuffledPack = getShuffledPack(cards.length);
            }
            if (shuffledPack.length === 52) {
                cardFace($cardsDeck_played, 65);
            }

            $player.splitPositionOff();
            btnsPlay.checkChipsForShow();
        });
    }

function slider() {

    var $prev2 = $('#prev2');
    var $prev1 = $('#prev1');
    var $next1 = $('#next1');
    var $next2 = $('#next2');

    var chipWidth = 74 + 20;
    var width = parseInt($chips.parent().css('width'));

    $('#chips_wrapper').get(0).addEventListener('wheel', function (e) {
        e = e || window.event;
        var delta = e.deltaY || e.detail || e.wheelDelta;

        delta = parseInt(delta);
        delta = fixDelta(94);
        move(delta);

        e.preventDefault();

        function fixDelta(num) {
            if (delta > 0) return num;
            else return 0 - num;
        }
    });

    function move(delta) {
        var zeroLeft = parseInt($chips.css('left'));
        var chips = getChipsNum();
        var minLeft = width - chips * chipWidth - 10;
        var maxLeft = 0;

        if (delta > 0) moveRight(delta, zeroLeft, maxLeft);
        if (delta < 0) moveLeft(delta, zeroLeft, minLeft);
    }

    function moveRight(delta, zeroLeft, maxLeft) {
        var final = delta + zeroLeft;
        if (delta === 1) final = maxLeft;
        if (final > maxLeft) final = maxLeft;
        makeLeftForChips(final);
    }

    function moveLeft(delta, zeroLeft, minLeft) {
        var final = delta + zeroLeft;
        if (delta === -1) final = minLeft;
        if (final < minLeft) final = minLeft;
        makeLeftForChips(final);
    }

    $prev1.click(function () {
        move(94);
    });
    $next1.click(function () {
        move(-94);
    });
    $prev2.click(function () {
        move(1);
    });
    $next2.click(function () {
        move(-1);
    });

    function getChipsNum() {
        var counter = 0;
        $chips.children('.chip').each(function () {
            if ($(this).css('display') === 'none') {
                counter++;
            }
        });
        return 20 - counter;
    }
}

    function makeLeftForChips(final) {
        $chips.css('left', final + 'px');
    }

function animChangePot($elem) {
    $elem.effect('bounce', {distance: 10, times: 1}, 100);
}
function animButton($elem, func) {
    $elem.effect('highlight', {color: '#ffffff'}, 150, function () {
        func();
    });
}

function playAgain() {
    hideBlock($summary);
    shuffledPack = getShuffledPack(cards.length);
    money = 5000;
    betRound = 0;
    betPre = 0;
    writeYourMoney($moneyText, money, '$ ');
    prize1 = 0;
    prize2 = 0;
    startPlay();
}

function clearing() {
    money += betPre;
    reWriteYourMoney();
    $player.changePot(0);
    startBets();
}

function chipping(value) {
    if (betPre === 0) {
        btnsPlay.activateConfirmChips();
    }
    betPre += value;
    money -= value;
    btnsPlay.checkChipsForShow();
    reWriteYourMoney();
    $player.changePot(betPre);
}

function dealing() {
    betRound = betPre;
    btnsPlay.checkForDisable();
    afterDeal();
}

function repeating() {
    putBet();
    afterDeal();
}

function flatting() {
    var flat = Math.ceil(money * 0.05);
    if (money < 1) {
        flat = money;
    }
    betRound = flat;
    putBet();
    afterDeal();
}

function maxing() {
    betRound = money;
    putBet();
    afterDeal();
}

function startBets() {
    betPre = 0;
    makeLeftForChips(0);
    showBlock($chips);
    showBlock($sliderButtons);
    $player.potUp();
    btnsPlay.checkChipsForShow();
    if (betRound === 0) {
        btnsPlay.activateBets0();
    } else {
        btnsPlay.activateBets();
    }
}

function gameOver() {
    writeSummary('Game over!');
    showBlock($summary);
    btnsPlay.gameOver();
}

function doSummary() {
    var summary = summaryProtocol();
    var summary1 = summary.summ1;
    var summary2 = summary.summ2;

    var text, pot1, pot2 = 0, summ1, summ2;

    if (summary2 === 0 && summary1 < 4) {
        switch (summary1) {
            case 1: text = 'Dealer have BlackJack! You loose!'; pot1 = 0; break;
            case 2: text = 'Dealer and you have BlackJack! Push!'; pot1 = 1; break;
            case 3: text = 'You have BlackJack! You win!'; pot1 = 1.5; break;
        }
    } else if (summary2 === 0) {
        summ1 = summaryForHand(summary1);
        pot1 = summ1.pot;
        text = 'You ' + summ1.text + '!';
        if (summary1 === 8) text = 'Push!';
        if (summary1 === 5) text = 'Dealer bust, you win!';
    } else if (summary2 > 0) {
        summ1 = summaryForHand(summary1);
        summ2 = summaryForHand(summary2);

        pot1 = summ1.pot;
        pot2 = summ2.pot;

        text = 'Left hand ' + summ1.text + ', right hand ' + summ2.text + '!';
    }

    writeSummary(text);
    writePrize(pot1, pot2);
    showBlock($summary);

    function summaryForHand(summary1or2) {
        var txt, pot;
        switch (summary1or2) {
            case 4: txt = 'bust'; pot = 0; break;
            case 5: txt = 'win'; pot = 2; break;
            case 6: txt = 'loose'; pot = 0; break;
            case 7: txt = 'win'; pot = 2; break;
            case 8: txt = 'push'; pot = 1; break;
            case 9: txt = 'bust'; pot = 0; break;
        }
        return {
            text: txt,
            pot: pot
        }
    }
}

function payInsurance() {
    if ($player.getPotIns() > 0) {
        $player.insPositive();
        //pay on the clear
    }
}

function payInsuranceNot() {
    $player.insClear();
}

function writePrize(pot1, pot2) {
    prize1 = $player.getPot() * pot1;
    prize2 = $playerSpl.getPot() * pot2;

    writePrizeToHand(prize1, $player);
    writePrizeToHand(prize2, $playerSpl);

    function writePrizeToHand(prize, $hand) {
        if (prize > 0) {
            $hand.writePize(prize);
        }
    }
}

function writeSummary(str) {
    $summaryText.html(str);
}

function summaryProtocol() {
    var dealer = summary($dealer);
    var player = summary($player);
    var summary1 = summaryCombination(dealer, player);
    var summary2 = 0;
    if ($player.hasSplitted()) {
        var playerSpl = summary($playerSpl);
        summary2 = summaryCombination(dealer, playerSpl);
    }
    return {
        summ1: summary1,
        summ2: summary2,
        dealer: dealer,
        player: player,
        playerSpl: playerSpl
    };
}

function summaryCombination(dealer, player) {
    if (dealer === 'BlackJack' && player <= 21) return 1;
    else if (dealer === 'BlackJack' && player === 'BlackJack') return 2;
    else if (dealer <= 21 && player === 'BlackJack') return 3;
    else if (dealer <= 21 && player === 'Bust') return 4;
    else if (dealer === 'Bust' && player <= 21) return 5;
    else if (dealer > player) return 6;
    else if (dealer < player) return 7;
    else if (dealer === player && player <= 21) return 8;
    else if (dealer === player && player === 'Bust') return 9;
}

function summary($hand) {
    var points = $hand.getPoints();
    var numCards = $hand.getNumberOfCards();
    var splitted = $hand.hasSplitted();
    var secondHand = false;
    if ($hand === $playerSpl) {
        secondHand = true;
    }
    if (points === 21 && numCards === 2 && splitted === false && !secondHand) {
        return 'BlackJack';
    } else if (points <= 21) {
        return points;
    } else if (points > 21) {
        return 'Bust';
    }
}

function isEnoughMoneyForInsure() {
    return betRound / 2 <= money;
}

function isEnoughMoney() {
    return betRound <= money;
}

function putBetDouble(handNum) {
    money -= betRound;
    reWriteYourMoney();
    hand(handNum).changePot(betRound * 2);
}

function putBetSplit() {
    money -= betRound;
    reWriteYourMoney();
    $playerSpl.changePot(betRound);
}

function putBetIns() {
    money -= betRound / 2;
    reWriteYourMoney();
    $player.changePotIns();
}

function putBet() {
    // betRound = confirmBet();
    money -= betRound;
    reWriteYourMoney();
    $player.changePot(betRound);
}

function reWriteYourMoney() {
    writeYourMoney($moneyText, money, '$ ');
    btnsPlay.checkForDisable();
}

function writeYourMoney($text, money, symbol) {
    $text.html(writeMoney(money, symbol));
}

function writeMoney(str, symbol) {
    str = '' + str;
    var str1 = str.replace(/(\d)\s(?=(\d)+([\D]|$))/g, '$1');
    var newStr = str1.replace(/(\d)(?=(\d\d\d)+([\D]|$))/g, '$1 ');
    // var newStr = str.replace(/(\d{3})(?=(\d)+([\D]|$))/g, '$1 ');
    return symbol + newStr;
}

function afterDeal() {
    hideBlock($chips);
    hideBlock($sliderButtons);
    btnsPlay.activateCompare();
    $player.potDown();
    $player.cardTransfer(function () {
        $dealer.cardTransfer(function () {
            $player.cardTransfer(function () {
                $dealer.cardTransfer(function () {

                    // $dealer.hideDealers2();
                    $player.unHidePoints();

                    checkD1();
                });
            });
        });
    });
}

function deal() {
clear();
}

function hideAllHandsPoints() {
    $dealer.hidePoints();
    $player.hidePoints();
    $playerSpl.hidePoints();
}

function startPlay() {
    btnsPlay.activateStartPlay();
    btnsPlay.checkChipsForShow();
}

function compare() {
    btnsPlay.activateCompare();
    $dealer.unHidePoints();
    doSummary();
    startPlay();
}

function checkDps() {
    btnsPlay.activateCompare();
    if ($dealer.getPoints() < 17) {
        $dealer.cardTransfer(function () {
            checkDps();
        });
    } else {
        compare();
    }
}

function dealerPlay() {
    $dealer.showDealers2();
    btnsPlay.activateCompare();
    checkDps();
}

function dealerPlayBlock(handNum) {
    var points1 = hand(1).getPoints();
    var cards1 = hand(1).getNumberOfCards();
    if (handNum === 2) {
        var points2 = hand(2).getPoints();
        var cards2 = hand(1).getNumberOfCards();
        if ((points1 > 21 && points2 > 21) || (points1 > 21 && points2 === 21 && cards2 === 2) ||
            (points1 === 21 && points2 > 21 && cards1 === 2) ||
            (points1 === 21 && points2 === 21 && cards1 === 2 && cards2 === 2)) {
            return true;
        }
    } else {
        if (points1 > 21) {
            return true;
        }
    }
    return false;
}

function checkPps_2(handNum) {
    if (dealerPlayBlock(handNum)) {
        $dealer.showDealers2();
        compare();
    } else {
        dealerPlay();
    }
}

function checkSplitted(handNum) {
    if (hand(handNum).hasSplitted()) {
        $player.shineOn();
        $playerSpl.shineOff();
        standartPlay(2);
        $player.shineOn();
        $playerSpl.shineOff();
    } else {
        checkPps_2(handNum);
        $player.shineOff();
    }
}

function checkPps_1(handNum) {
    var points = hand(handNum).getPoints();
    if (points < 21) {
        btnsPlay.activateHitStand(handNum);
    } else {
        checkSplitted(handNum);
    }
}

function doubling(handNum) {
    btnsPlay.activateCompare();
    putBetDouble(handNum);
    hand(handNum).cardTransfer(function () {
        checkSplitted(handNum);
    });
}

function standing(handNum) {
    checkSplitted(handNum);
}

function hitting(handNum) {
    btnsPlay.activateCompare();
    hand(handNum).cardTransfer(function () {
        checkPps_1(handNum);
    });
}

function hand(handNum) {
    if (handNum === 2) {
        return $playerSpl;
    } else {
        return $player;
    }
}

function standartPlay(handNum) {
    if (hand(handNum).getPoints() === 21) {
        checkSplitted(handNum);
    } else {
        btnsPlay.activateStandartPlay(handNum);
    }
}

function keeping() {
    standartPlay(1);
}

function splitting() {
    btnsPlay.activateCompare();
    putBetSplit();
    $playerSpl.handArr.push($player.handArr[1]);
    $player.handArr.pop();
    $player.counter.points = cards[$player.handArr[0] - 1].points;
    $player.counter.altPoints = cards[$player.handArr[0] - 1].altPoints;
    $playerSpl.counter.points = cards[$playerSpl.handArr[0] - 1].points;
    $playerSpl.counter.altPoints = cards[$playerSpl.handArr[0] - 1].altPoints;
    $player.$line.children('.in_game').last().appendTo($playerSpl.$line);
    $player.splitted = true;
    $player.splitPositionOn();
    $player.cardTransfer(function () {
        $playerSpl.cardTransfer(function () {
            $playerSpl.unHidePoints();
            $player.shineOff();
            $playerSpl.shineOn();
            standartPlay(1);
        });
    });
}

function split() {
    btnsPlay.activateSplit();
}

function play() {
    if (!$player.hasSplitted() && $player.getCardPoint(1) === $player.getCardPoint(2)) {
        split();
    } else {
        standartPlay(1);
    }
}

function checkD2_1() {
    var d2 = $dealer.getCardPoint(2);
    if (d2 === 11) {
        $dealer.showDealers2();
        $dealer.unHidePoints();
        compare();
    } else {
        checkPPs();
    }
}

function checkPPs() {
    var points = $player.getPoints();
    if (points === 21) {
        $dealer.showDealers2();
        $dealer.unHidePoints();
        compare();
    } else {
        play();
    }
}

function checkD2() {
    var d2 = $dealer.getCardPoint(2);
    // console.log(d2);
    if (d2 === 10) {
        payInsurance();
        $dealer.showDealers2();
        $dealer.unHidePoints();
        compare();
    } else {
        payInsuranceNot();
        checkPPs();
    }
}

function afterInsuringNot() {
    checkD2();
}

function afterInsuring() {
    putBetIns();
    checkD2();
}

function insuring() {
    btnsPlay.activateInsuring();
}

function checkD1() {
    var d1 = $dealer.getCardPoint(1);
    if (d1 === 11) {
        insuring();
    } else if (d1 === 10) {
        checkD2_1();
    } else {
        checkPPs();
    }
}

    function enableBtn($btn) {
        $btn.removeClass('btn_disable');
    }

    function disableBtn($btn) {
        $btn.addClass('btn_disable');
    }

    function hideBtn($btn) {
        $btn.css('display', 'none');
    }

    function showBtn($btn) {
        $btn.css('display', 'inline-block');
    }

    function hideBlock($elem) {
        $elem.css('display', 'none');
    }

    function showBlock($elem) {
        $elem.css('display', 'block');
    }

    function cardAddPoints(card, counter, $counter, cardsArr) {
        if (hasThisRankCard(cardsArr, 1, 13) > 1) {
            counter.points += cards[card - 1].altPoints;
            counter.altPoints += cards[card - 1].altPoints;
        } else {
            counter.points += cards[card - 1].points;
            counter.altPoints += cards[card - 1].altPoints;
        }

        if (counter.points > 21 && counter.points !== counter.altPoints) {
            counter.points = counter.altPoints;
        } else if (counter.points === 21) {
            counter.altPoints = 21;
        }
        showPoints(counter, $counter);

        function showPoints(counter, $counter) {
            var points = counter.points;
            var altPoints = counter.altPoints;
            var str = '';
            if (points === altPoints) {
                str = points;
            } else {
                str = points + ' / ' + altPoints;
            }
            $counter.children().html(str);
        }

        function hasThisRankCard(arr, card, inRow) {
            var result = 0;
            arr.forEach(function (elem) {
                if (elem % inRow === card) {
                    result++;
                }
            });
            return result;
        }
    }

    function cardTransferArr(orig, dest) {
        var card = orig[0];
        dest.push(card);
        orig.shift();
        return card;
    }

    function getShuffledPack(cards) {
        var pack = [];
        var card = getRandomInt(1, cards);
        pack.push(card);
        for (var i = 0; i < cards - 1; i++) {
            card = getUnique(pack, cards);
            pack.push(card);
        }
        return pack;
        function getUnique(arr, nums) {
            var num = getRandomInt(1, nums);
            if (isUnique(arr, num)) {
                return num;
            } else {
                return getUnique(arr, nums);
            }
            function isUnique(arr, num) {
                for (var i = 0; i < arr.length; i++) {
                    if (num === arr[i]) return false;
                }
                return true;
            }
        }
    }

    function getCards(suits, ranks, points, degrees) {
        var cards = [];
        var number = 0;
        for (var i = 0; i < suits.length; i++) {
            for (var j = 0; j < ranks.length; j++) {
                number++;
                var altPoint = getAltPoint(points[j]);
                var card = {
                    suit: suits[i],
                    rank: ranks[j],
                    points: points[j],
                    altPoints: altPoint,
                    id: suits[i] + ranks[j],
                    number: number,
                    degree: degrees[j]
                };
                cards.push(card);
            }
        }
        return cards;
        function getAltPoint(num) {
            if (num === 11) {
                return 1;
            }
            return num;
        }
    }

    function buildChips() {
        chips.forEach(function (elem) {
            $chips.append('<div id="chip' + elem.number + '" class="chip" data-value="' +
                elem.value + '">' + elem.text + '</div>');
            chipFace($('#chip' + elem.number), elem.number + 2);
        });

        function chipFace($elem, num) {
            var coords = getSpriteCoordsForCard(74, 74, chipsNums.length, num);
            $elem.css({
                'background-position': coords.x + 'px ' + coords.y +'px',
                'left': (20 + 74) * (num - 2) + 15 + 'px'
            });
        }

    }

    function getChips(chipsLevels, chipsNums) {
        var chips = [];
        var level = 1;
        var num = 0;
        for (var i = 0; i < chipsLevels.length; i++) {
            for (var j = 0; j < chipsNums.length; j++) {
                var chip = {
                    text: '$ ' + chipsNums[j] + ' ' + chipsLevels[i],
                    value: chipsNums[j] * level,
                    number: num
                };
                num++;
                chips.push(chip);
            }
            level *= 1000;
        }
        return chips;
    }

    function getSpriteCoordsForCard(width, height, inRow, num) {
        var row = Math.ceil(num / inRow);
        var place = num % inRow;
        if (place === 0) place = inRow;
        var xCoord = 0 - width * (place - 1);
        var yCoord = 0 - height * (row - 1);
        return {x: xCoord, y: yCoord};
    }

    function cardFace($elem, num) {
        var coords = getSpriteCoordsForCard(131, 190, ranks.length, num);
        $elem.css('background-position', coords.x + 'px ' + coords.y +'px');
    }

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

});