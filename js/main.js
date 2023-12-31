// ゲームをリセットする関数
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
    // 【備忘録】下記でボタンについて定義しちゃってるが、もう7,8行目で定義してるので被ってた。なので単純にリロードしてね、だけでOK
    // const resetButton = document.getElementById('resetButton');
    // resetButton.addEventListener('click', function () {
    location.reload(); // ページをリロードする
    // });
}

// ＜リーダーボード＞ユーザー名の入力と結果の保存
// 入力されたユーザー名と現在の所持金でsaveGameResult関数を呼び出し
function promptForUsernameAndSaveResult(money) {
    const username = prompt("ゲーム終了！ユーザー名を入力してください:");
    if (username === null) {
        // ユーザーがキャンセルを選択した場合の処理
        return; // 関数を終了
    }
    if (username) {
        saveGameResult(username, money);
    }

}

//＜リーダーボード＞スコアを保存する関数
// ユーザーのゲーム結果（ユーザー名、所持金、日時）をオブジェクトとして保存
// このオブジェクトをJSON形式に変換してlocalStorageに保存
function saveGameResult(username, money) {
    const gameResult = {
        username: username,
        money: money,
        date: new Date().toLocaleString()
    };
    const resultsJson = localStorage.getItem('gameResults') || '[]';
    const gameResults = JSON.parse(resultsJson);
    gameResults.push(gameResult);

    // 所持金で降順にソート
    gameResults.sort((a, b) => b.money - a.money);
    // リーダーボードの既存の内容をクリア
    const leaderboard = document.querySelector('#leaderBoardTable tbody');
    leaderboard.innerHTML = '';
    // リーダーボードを更新
    displayLeaderboard(gameResults);
    // スコアデータを保存
    localStorage.setItem('gameResults', JSON.stringify(gameResults));
}


// リーダーボードの表示
function displayLeaderboard(gameResults) {
    const leaderboard = document.querySelector('#leaderBoardTable tbody');
    gameResults.forEach(result => {
        const row = leaderboard.insertRow(-1);
        row.insertCell(0).textContent = result.username;
        row.insertCell(1).textContent = result.money;
        row.insertCell(2).textContent = result.date;
    });
}




// DOMがロードされた後、イベントリスナーが設定され、国の選択やじゃんけんの手の選択が可能になる
document.addEventListener('DOMContentLoaded', function () {
    // 【定数と設定】
    // リーダーボードの表示
    const resultsJson = localStorage.getItem('gameResults') || '[]';
    const gameResults = JSON.parse(resultsJson);

    //    リセットボタン
    const resetButton = document.getElementById('resetButton');
    resetButton.addEventListener('click', resetGame);

    //    レコードボタン
    const recordButton = document.getElementById('recordButton');
    recordButton.addEventListener('click', () => promptForUsernameAndSaveResult(playerMoney));
    // playRound内でこれ書いちゃうと、関数が呼び出されるたびに、recordButtonに新しいイベントリスナーが追加されちゃう



    //    初期設定
    let playerMoney = 10000; // プレイヤーの初期所持金
    let roundCount = 0; // 現在のラウンド数   

    // countryオブジェクトに各国のじゃんけんの手と倍率を定義 
    const country = {
        JPN: {
            hands: [
                { name: 'rock', image: './img/rock.png', description: '岩' },
                { name: 'scissors', image: './img/scissors.png', description: 'はさみ' },
                { name: 'paper', image: './img/paper.png', description: '紙' }
            ],
            winMultiplier: 2, // 勝利時の報酬倍率
            lossMultiplier: 1.2, // 敗北時のペナルティ倍率
            // odds: `アメリカンドリーム！勝ったら3倍、負けたら-5倍`
        },

        CHN: {
            hands: [
                { name: 'rock', image: './img/rock.png', description: 'ハンマー' },
                { name: 'scissors', image: './img/scissors.png', description: 'はさみ' },
                { name: 'paper', image: './img/paper.png', description: '爆発' }
            ],
            winMultiplier: 2, // 勝利時の報酬倍率
            lossMultiplier: 3.5, // 敗北時のペナルティ倍率
            // odds: `アメリカンドリーム！勝ったら3倍、負けたら-5倍`
        },

        MYS: {
            hands: [
                { name: 'water', image: './img/water.png', description: '水' },
                { name: 'board', image: './img/board.png', description: '板' },
                { name: 'bird', image: './img/bird.png', description: '小鳥' },
                { name: 'gun', image: './img/gun.png', description: '拳銃' },
                { name: 'rock', image: './img/rock-malaysia.png', description: '岩' }
            ],
            winMultiplier: 2, // 勝利時の報酬倍率
            lossMultiplier: 1.5, // 敗北時のペナルティ倍率
            // odds: `アメリカンドリーム！勝ったら3倍、負けたら-5倍`
        },

        SGP: {
            hands: [
                { name: 'water', image: './img/water.png', description: '水' },
                { name: 'rock', image: './img/rock-singapore.png', description: '石' },
                { name: 'dragon', image: './img/well.png', description: '竜' }
            ],
            winMultiplier: 1.8, // 勝利時の報酬倍率
            lossMultiplier: 1.3, // 敗北時のペナルティ倍率
            // odds: `アメリカンドリーム！勝ったら3倍、負けたら-5倍`
        },

        IDN: {
            hands: [
                { name: 'ant', image: './img/ant.png', description: '蟻' },
                { name: 'elephant', image: './img/elephant.png', description: '象' },
                { name: 'human', image: './img/human.png', description: '人間' }
            ],
            winMultiplier: 3, // 勝利時の報酬倍率
            lossMultiplier: 2, // 敗北時のペナルティ倍率
            // odds: `アメリカンドリーム！勝ったら3倍、負けたら-5倍`
        },

        FRA: {
            hands: [
                { name: 'rock', image: './img/rock.png', description: '石' },
                { name: 'scissors', image: './img/scissors.png', description: 'はさみ' },
                { name: 'paper', image: './img/paper.png', description: '木の葉' },
                { name: 'well', image: './img/well.png', description: '井戸' }
            ],
            winMultiplier: 1.5, // 勝利時の報酬倍率
            lossMultiplier: 1, // 敗北時のペナルティ倍率
            // odds: `アメリカンドリーム！勝ったら3倍、負けたら-5倍`
        },

        USA: {
            hands: [
                { name: 'rock', image: './img/rock.png', description: '岩' },
                { name: 'scissors', image: './img/scissors.png', description: 'はさみ' },
                { name: 'paper', image: './img/paper.png', description: '紙' }
            ],
            winMultiplier: 5, // 勝利時の報酬倍率
            lossMultiplier: 5, // 敗北時のペナルティ倍率
            // odds: `アメリカンドリーム！勝ったら3倍、負けたら-5倍`
        },
    };

    // 国の画像
    const countryImages = document.querySelectorAll('.country img');


    // 【関数定義】

    // 選択された国をハイライト
    function highlightCountry(selectedImg) {
        // すべての国の画像からハイライトを削除
        document.querySelectorAll('.country img').forEach(img => {
            img.classList.remove('highlight');
        });
        // 選択された国の画像にハイライトを追加
        selectedImg.classList.add('highlight');
    }

    // じゃんけんの手を表示：選択された国のじゃんけんの手がボタンとして表示
    function displayHands(country) {
        const handChoiceArea = document.querySelector('.handChoice');
        handChoiceArea.innerHTML = ''; // 以前の手をクリア

        country.hands.forEach(hand => { //country オブジェクトの hands 配列をループ処理 forEach メソッドは配列の各要素に対して与えられた関数（この場合はアロー関数 hand => {...}）を実行 各要素は hand として参照される
            const handButton = document.createElement('button'); //新しい button 要素を作成し、それを handButton という変数に格納
            handButton.className = 'handButton'; // 新しいクラスを適用

            const handImage = document.createElement('img'); //新しい img 要素を作成し、それを handImage という変数に格納
            handImage.alt = hand.name; // img 要素の alt 属性を設定
            handImage.className = 'hand'; // img にクラス名を追加
            handImage.src = hand.image; //作成した img 要素の src 属性を、hand オブジェクトの image プロパティに設定。これにより画像が表示される。

            const tooltipHand = document.createElement('span'); // ツールチップ用のspan要素を作成
            tooltipHand.className = 'tooltipHand';
            tooltipHand.textContent = hand.description; // ツールチップのテキストを設定

            handButton.appendChild(handImage); //作成した img 要素（handImage）を、button 要素（handButton）の子要素として追加→ボタンの中に画像が表示される
            handButton.appendChild(tooltipHand); // handButtonにtooltipを追加
            handButton.addEventListener('click', () => playRound(hand.name, country)); //ボタンクリック→playRound 関数呼び出し→hand.nameとcountryを引数
            handChoiceArea.appendChild(handButton); //handButtonをhandChoiceAreaの子要素として追加→ボタンがページに表示される
        });
    }

    // ★ラウンドをプレイ：プレイヤーが手を選択すると、PCとの勝負が行われ、勝敗に応じて所持金が更新
    function playRound(playerHand, country) {
        // 【定数と設定】
        const pcHand = country.hands[Math.floor(Math.random() * country.hands.length)].name;
        const result = determineWinner(playerHand, pcHand);
        const userHandImg = document.createElement('img');
        const resultImg = document.createElement('img');
        const pcHandImg = document.createElement('img');



        // 結果表示エリア
        const handResultArea = document.querySelector('.handResult');


        // 【関数定義】
        // 手の画像を取得する関数
        function getHandImage(handName, country) {
            const hand = country.hands.find(h => h.name === handName);
            return hand ? hand.image : '';
        }

        // 勝敗結果の画像を取得する関数
        function getResultImage(result) {
            // 勝敗結果に応じた画像のパスを設定する
            const resultImages = {
                win: './img/win.png',   // 勝ちの画像のパス
                lose: './img/lose.png', // 負けの画像のパス
                draw: './img/draw.png'  // 引き分けの画像のパス
            };

            // resultImages オブジェクトから対応する画像のパスを返す
            return resultImages[result] || 'path/to/default-result-image.png';
        }

        // 勝敗判定：determineWinner 関数でプレイヤーとPCの手を比較し、勝敗を決定
        function determineWinner(playerHand, pcHand) {
            if (playerHand === pcHand) {
                return 'draw'; // 引き分け
            }

            const winsAgainst = {
                rock: ['scissors', 'bird', 'board', 'dragon'], // 石はハサミに勝つ
                paper: ['rock', 'well'], // 紙は石と井戸に勝つ
                scissors: ['paper'], // ハサミは紙に勝つ
                well: ['rock', 'scissors'], // 井戸は石とハサミに勝つ
                water: ['gun', 'rock'],
                gun: ['bird', 'board'],
                board: ['bird', 'water'],
                bird: ['water'],
                dragon: ['water'],
                ant: ['elephant'],
                elepahnt: ['human'],
                human: ['ant']
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
                playerMoney = Math.floor(playerMoney * country.winMultiplier);
            } else if (result === 'lose') {
                playerMoney = Math.floor(playerMoney / country.lossMultiplier);
            }
            // 'draw'の場合は所持金に変更なし
            document.querySelector('.currentMoney p').textContent = `あなたの現在の所持金: ${playerMoney}円`;
        }

        // スコアボードの更新：各ラウンドの結果が scoreHistory に記録
        function updateScoreboard(round, countryName, result) {
            const scoreboard = document.querySelector('.scoreHistory table');
            const row = scoreboard.insertRow(-1);
            row.insertCell(0).textContent = round;
            row.insertCell(1).textContent = countryName; // 【疑問】国名表示されない
            row.insertCell(2).textContent = result;
            row.insertCell(3).textContent = playerMoney;
        }




        // 【実行】
        // 結果表示エリア
        handResultArea.innerHTML = ''; // 既存の内容をクリア

        // ユーザーの手の画像（userHandImg）を表示
        userHandImg.src = getHandImage(playerHand, country);
        userHandImg.style.transform = 'scaleX(-1)'; // 画像を反転
        handResultArea.appendChild(userHandImg);

        // 勝敗結果の画像（resultImg）を表示
        resultImg.src = getResultImage(result); // 勝敗結果に応じた画像を取得
        resultImg.style.display = 'none'; // 初期状態では非表示
        resultImg.onload = function () {
            $(resultImg).fadeIn(1000); // 画像のロードが完了したらフェードイン
        };
        handResultArea.appendChild(resultImg);

        // PCの手の画像（ pcHandImg）を表示
        pcHandImg.src = getHandImage(pcHand, country);
        handResultArea.appendChild(pcHandImg);

        // 所持金の更新
        updateMoney(result, country);

        // スコアボードの更新
        //【備忘録】5回までは実行、それ以降はやらないというif文にすれば6回以降も書き続けちゃうの止まる
        if (roundCount < 5) {
            updateScoreboard(roundCount + 1, country.alt, result);
        }

        // 【備忘録】このメッセージをスコアボードの更新後に出すには→ラウンドカウントのインクリメントの前に持ってきたら意図通りになった
        if (roundCount == 4) {
            alert('次で最後の勝負！');
        }

        roundCount++; // ラウンドカウントのインクリメント

        if (roundCount === 5) {
            resetButton.style.display = 'block'; // リセットボタンを表示
            recordButton.style.display = 'block'; // recordボタンを表示
            return; // 関数から抜ける
        }
        if (roundCount >= 5) {
            alert('このゲームは終了しました。また遊んでね！');
            return; // 関数から抜ける
        }
    }

    // 【実行】
    // リーダーボードの表示
    displayLeaderboard(gameResults);

    // 国の選択：国旗をクリックしてその国のじゃんけんの手を表示
    countryImages.forEach(img => {
        img.addEventListener('click', function () {
            const countryName = this.alt // 国名を取得
            // ↑【備忘録】国名を大文字のコードにしたので.toLowerCase()が悪さしていた
            highlightCountry(this); //ハイライト
            // changeHandChoiceBackground(countryName); //背景色
            displayHands(country[countryName]);
        });
    });



});






