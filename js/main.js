
// DOMがロードされた後、イベントリスナーが設定され、国の選択やじゃんけんの手の選択が可能になる
document.addEventListener('DOMContentLoaded', function () {
    let playerMoney = 10000; // プレイヤーの初期所持金
    let roundCount = 0; // 現在のラウンド数    

    const resetButton = document.getElementById('resetButton');
    resetButton.addEventListener('click', resetGame);

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
            // ↑【備忘録】国名を大文字のコードにしたので.toLowerCase()が悪さしていた
            highlightCountry(this); //ハイライト
            changeHandChoiceBackground(countryName); //背景色
            displayHands(country[countryName]);
        });
    });

    // 選択された国をハイライトする関数
    function highlightCountry(selectedImg) {
        // すべての国の画像からハイライトを削除
        document.querySelectorAll('.country img').forEach(img => {
            img.classList.remove('highlight');
        });
        // 選択された国の画像にハイライトを追加
        selectedImg.classList.add('highlight');
    }

    // handChoice エリアの背景色を変更する関数
    function changeHandChoiceBackground(country) {
        const handChoiceArea = document.querySelector('.handChoice');
        const bgColors = {
            JPN: 'linear-gradient(to right, #fff, #f00, #fff)',
            USA: 'linear-gradient(to right, #00f, #fff, #f00)',
            // その他の国に対応するグラデーションを追加...
        };
        handChoiceArea.style.background = bgColors[country] || 'none';
    }

    // じゃんけんの手を表示：選択された国のじゃんけんの手がボタンとして表示され、プレイヤーはこれをクリックして手を選ぶ
    function displayHands(country) {
        const handChoiceArea = document.querySelector('.handChoice');
        handChoiceArea.innerHTML = ''; // 以前の手をクリア
        country.hands.forEach(hand => { //country オブジェクトの hands 配列をループ処理 forEach メソッドは配列の各要素に対して与えられた関数（この場合はアロー関数 hand => {...}）を実行 各要素は hand として参照される
            const handButton = document.createElement('button'); //新しい button 要素を作成し、それを handButton という変数に格納
            handButton.className = 'handButton'; // 新しいクラスを適用

            const handImage = document.createElement('img'); //新しい img 要素を作成し、それを handImage という変数に格納
            handImage.src = hand.image; //作成した img 要素の src 属性を、hand オブジェクトの image プロパティに設定。これにより画像が表示される。
            handButton.appendChild(handImage); //作成した img 要素（handImage）を、button 要素（handButton）の子要素として追加→ボタンの中に画像が表示される
            handButton.addEventListener('click', () => playRound(hand.name, country)); //ボタンクリック→playRound 関数呼び出し→hand.nameとcountryを引数
            handChoiceArea.appendChild(handButton); //handButtonをhandChoiceAreaの子要素として追加→ボタンがページに表示される
        });
    }

    // ラウンドをプレイ：プレイヤーが手を選択すると、PCとの勝負が行われ、勝敗に応じて所持金が更新
    function playRound(playerHand, country) {
        const pcHand = country.hands[Math.floor(Math.random() * country.hands.length)].name;
        const result = determineWinner(playerHand, pcHand);


        // 結果表示エリア
        const handResultArea = document.querySelector('.handResult');
        handResultArea.innerHTML = ''; // 既存の内容をクリア

        // ユーザーの手の画像
        const userHandImg = document.createElement('img');
        userHandImg.src = getHandImage(playerHand, country);
        handResultArea.appendChild(userHandImg);

        // 勝敗結果の画像
        const resultImg = document.createElement('img');
        resultImg.src = getResultImage(result); // 勝敗結果に応じた画像を取得
        handResultArea.appendChild(resultImg);

        // PCの手の画像
        const pcHandImg = document.createElement('img');
        pcHandImg.src = getHandImage(pcHand, country);
        handResultArea.appendChild(pcHandImg);

        updateMoney(result, country); // 所持金の更新
        updateScoreboard(roundCount + 1, country.alt, result); // スコアボードの更新
        // 手の画像を取得する関数
        function getHandImage(handName, country) {
            const hand = country.hands.find(h => h.name === handName);
            return hand ? hand.image : '';
        }

        function getResultImage(result) {
            // 勝敗結果に応じた画像のパスを設定する
            const resultImages = {
                win: '/img/win.png',   // 勝ちの画像のパス
                lose: '/img/lose.png', // 負けの画像のパス
                draw: '/img/draw.png'  // 引き分けの画像のパス
            };

            // resultImages オブジェクトから対応する画像のパスを返す
            return resultImages[result] || 'path/to/default-result-image.png';
        }
        roundCount++; // ラウンドカウントのインクリメント

        // 【疑問】このメッセージをスコアボードの更新後に出すには？playGroundの定義に出してもだめだった
        // 【あとで】終わった時点でボタン押せなくしたい。
        if (roundCount == 4) {
            alert('次で最後の勝負！');
        }
        if (roundCount >= 5) {
            alert('このゲームは終了しました。また遊んでね！');
            resetButton.style.display = 'block'; // リセットボタンを表示
            return; // 関数から抜ける
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
            // 【疑問】国名表示されない
            row.insertCell(2).textContent = result;
            row.insertCell(3).textContent = playerMoney;
        }
    }

    // ゲームをリセットする関数【疑問あり】2回押すと意図通りにリセットできる
    function resetGame() {
        // playerMoney = 10000; // 初期所持金に戻す
        // roundCount = 0; // ラウンド数をリセット
        // currentPlayerCountry = 'JPN'; // 初期国に戻す

        // スコアボードの中身をリセット
        // const scoreboard = document.querySelector('.scoreHistory table');
        // const tbody = scoreboard.getElementsByTagName('tbody')[0]; //スコアボードを構成するテーブルのtbody要素を取得
        // tbody.innerHTML = ''; //tbodyのinnerHTMLを空に設定することで行をクリア（するはず）回数はリセットされてる
        // ↓別のスコアボードリセットのやりかた
        // const scoreboardBody = document.querySelector('.scoreHistory tbody'); //クラス名が scoreHistory の要素内の最初の tbody を選択
        // if (scoreboardBody) {
        //     scoreboardBody.innerHTML = '';
        // }
        // スコアボードリセットはうまくいかなかったのでページリロードにする↓
        const resetButton = document.getElementById('resetButton');
        resetButton.addEventListener('click', function () {
            location.reload(); // ページをリロードする。はずだが？
        });
        resetButton.style.display = 'none'; // リセットボタンを非表示にする
    }
}
);



