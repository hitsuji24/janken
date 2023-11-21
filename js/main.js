
// DOMがロードされた後、イベントリスナーが設定され、国の選択やじゃんけんの手の選択が可能になる
document.addEventListener('DOMContentLoaded', function () {
    let playerMoney = 10000; // プレイヤーの初期所持金
    let roundCount = 0; // 現在のラウンド数
    let currentPlayerCountry = 'JPN'; // 初期国は日本
    const exchangeRates = {
        USA: { JPN: 125, BRA: 5, CHN: 6.67, IDN: 143, AUS: 0.714 },
        JPN: { USA: 0.008, BRA: 0.04, CHN: 0.0533, IDN: 1.143, AUS: 0.0057 },
        BRA: { USA: 0.2, JPN: 25, CHN: 1.33, IDN: 28.57, AUS: 0.14 },
        CHN: { USA: 0.15, JPN: 18.75, BRA: 0.75, IDN: 21.43, AUS: 0.107 },
        IDN: { USA: 0.007, JPN: 0.875, BRA: 0.035, CHN: 0.0467, AUS: 0.005 },
        AUS: { USA: 1.4, JPN: 175, BRA: 7, CHN: 9.33, IDN: 200 }
    };

    fillExchangeRatesTable(); // 為替レート表を表示

    // countryオブジェクトに各国のじゃんけんの手と倍率を定義 
    const country = {
        JPN: {
            hands: [
                { name: 'rock', image: '/img/rock.png' },
                { name: 'scissors', image: '/img/scissors.png' },
                { name: 'paper', image: '/img/paper.png' }
            ],
            winMultiplier: 1.5, // 勝利時の報酬倍率
            lossMultiplier: 1.5 // 敗北時のペナルティ倍率
        },

        USA: {
            hands: [
                { name: 'rock', image: '/img/rock.png' },
                { name: 'scissors', image: '/img/scissors.png' },
                { name: 'paper', image: '/img/paper.png' }
            ],
            winMultiplier: 3, // 勝利時の報酬倍率
            lossMultiplier: 5 // 敗北時のペナルティ倍率
        },

        BRA: {
            hands: [
                { name: 'rock', image: '/img/rock.png' },
                { name: 'scissors', image: '/img/scissors.png' },
                { name: 'paper', image: '/img/paper.png' }
            ],
            winMultiplier: 3, // 勝利時の報酬倍率
            lossMultiplier: 5 // 敗北時のペナルティ倍率
        },

        CHN: {
            hands: [
                { name: 'rock', image: '/img/rock.png' },
                { name: 'scissors', image: '/img/scissors.png' },
                { name: 'paper', image: '/img/paper.png' }
            ],
            winMultiplier: 3, // 勝利時の報酬倍率
            lossMultiplier: 5 // 敗北時のペナルティ倍率
        },

        IDN: {
            hands: [
                { name: 'rock', image: '/img/rock.png' },
                { name: 'scissors', image: '/img/scissors.png' },
                { name: 'paper', image: '/img/paper.png' }
            ],
            winMultiplier: 3, // 勝利時の報酬倍率
            lossMultiplier: 5 // 敗北時のペナルティ倍率
        },

        AUS: {
            hands: [
                { name: 'rock', image: '/img/rock.png' },
                { name: 'scissors', image: '/img/scissors.png' },
                { name: 'paper', image: '/img/paper.png' }
            ],
            winMultiplier: 3, // 勝利時の報酬倍率
            lossMultiplier: 5 // 敗北時のペナルティ倍率
        },

    };

    // 国の選択：国旗をクリックしてその国のじゃんけんの手を表示
    const countryImages = document.querySelectorAll('.country img');
    countryImages.forEach(img => {
        img.addEventListener('click', function () {
            const countryName = this.alt // 国名を取得
            // 【備忘録】国名を大文字のコードにしたので.toLowerCase()が悪さしていた
            displayHands(country[countryName]);
        });
    });

    // じゃんけんの手を表示：選択された国のじゃんけんの手がボタンとして表示され、プレイヤーはこれをクリックして手を選ぶ
    function displayHands(country) {
        const handChoiceArea = document.querySelector('.handChoice');
        handChoiceArea.innerHTML = ''; // 以前の手をクリア

        country.hands.forEach(hand => {
            const handButton = document.createElement('button');
            const handImage = document.createElement('img');
            handImage.src = hand.image;
            handButton.appendChild(handImage);
            handButton.addEventListener('click', () => playRound(hand.name, country));
            handChoiceArea.appendChild(handButton);
        });
    }

    // ラウンドをプレイ：プレイヤーが手を選択すると、PCとの勝負が行われ、勝敗に応じて所持金が更新
    function playRound(playerHand, country) {
        const pcHand = country.hands[Math.floor(Math.random() * country.hands.length)].name;
        const result = determineWinner(playerHand, pcHand);
        updateMoney(result, country); // 所持金の更新
        updateScoreboard(roundCount + 1, country.alt, result); // スコアボードの更新

        roundCount++; // ラウンドカウントのインクリメント

        // 【疑問】このメッセージをスコアボードの更新後に出すには？あとは終わった時点でボタン押せなくしたい。
        if (roundCount == 4) {
            alert('次で最後の勝負！！');
        }
        if (roundCount >= 5) {
            alert('このゲームは終了しました。また遊んでね！');
            return; // 関数から抜ける
        }
    }

    // 勝敗判定：determineWinner 関数でプレイヤーとPCの手を比較し、勝敗を決定
    function determineWinner(playerHand, pcHand) {
        if (playerHand === pcHand) {
            return 'draw'; // 引き分け
        }

        const winsAgainst = {
            rock: ['scissors'], // 石はハサミに勝つ
            paper: ['rock', 'well'], // 紙は石と井戸に勝つ
            scissors: ['paper'], // ハサミは紙に勝つ
            well: ['rock', 'scissors'] // 井戸は石とハサミに勝つ
        };

        if (winsAgainst[playerHand].includes(pcHand)) {
            return 'win'; // プレイヤーの勝利
        } else {
            return 'lose'; // プレイヤーの敗北
        }
    }

    // 所持金の更新：勝敗に応じてプレイヤーの所持金が更新
    function updateMoney(result, country) {
        if (result === 'win') {
            playerMoney *= country.winMultiplier;
        } else if (result === 'lose') {
            playerMoney /= country.lossMultiplier;
        }
        // 'draw'の場合は所持金に変更なし
        document.querySelector('.currentMoney p').textContent = `あなたの現在の所持金: ${playerMoney}円`;
    }

    // スコアボードの更新：各ラウンドの結果が scoreHistory に記録
    function updateScoreboard(round, countryName, result) {
        const scoreboard = document.querySelector('.scoreHistory table');
        const row = scoreboard.insertRow(-1);
        row.insertCell(0).textContent = round;
        row.insertCell(1).textContent = countryName;
        row.insertCell(2).textContent = result;
        row.insertCell(3).textContent = playerMoney;
    }

    // 情報エリアに為替レートを表示
    function fillExchangeRatesTable() {
        const tableBody = document.getElementById('exchangeRatesTable').getElementsByTagName('tbody')[0];
        tableBody.innerHTML = ''; // テーブルの中身をクリア

        for (const [fromCurrency, rates] of Object.entries(exchangeRates)) {
            const row = tableBody.insertRow();
            row.insertCell().textContent = fromCurrency;

            for (const toCurrency of Object.keys(exchangeRates)) {
                const rate = rates[toCurrency] || '-';
                row.insertCell().textContent = rate;
            }
        }
    }
});



