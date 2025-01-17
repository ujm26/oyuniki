
let suankiKostebekkonum;
let suankidDusmankonum;
let score = 0;
let gameOver = false;
let timer = 45;
let isCooldown = false; // Tıklama kontrol bayrağı
let kostebekClickable = true; // Kostebeğin tıklanabilirliğini kontrol eden bayrak


window.onload = function () {
    setGame();
    startTimer();
}

function setGame() {
    for (let i = 0; i < 9; i++) {
        let tile = document.createElement("div");
        tile.id = i.toString();
        tile.addEventListener("click", selectTile);
        document.getElementById("board").appendChild(tile);
    }
}

setInterval(setKostebek, 500);
setInterval(setDusman, 750);

function getRandomTile() {
    let num = Math.floor(Math.random() * 9);
    return num.toString();
}

function setKostebek() {
    if (gameOver) {
        return;
    }
    if (suankiKostebekkonum) {
        suankiKostebekkonum.innerHTML = "";
    }

    let kostebek = document.createElement("img");
    kostebek.src = "./zaza.png";

    let num = getRandomTile();
    if (suankidDusmankonum && suankidDusmankonum.id == num) {
        return;
    }
    suankiKostebekkonum = document.getElementById(num);
    suankiKostebekkonum.appendChild(kostebek);

    // Köstebeği tıklanabilir hale getir
    if (kostebekClickable) {
        suankiKostebekkonum.style.pointerEvents = "auto"; // Tıklanabilir hale getir
    }
}

function setDusman() {
    if (gameOver) {
        return;
    }

    if (suankidDusmankonum) {
        suankidDusmankonum.innerHTML = "";
    }

    let dusman = document.createElement("img");
    dusman.src = "./gorsel.png";

    let num = getRandomTile();
    if (suankiKostebekkonum && suankiKostebekkonum.id == num) {
        return;
    }
    suankidDusmankonum = document.getElementById(num);
    suankidDusmankonum.appendChild(dusman);
}

function selectTile() {
    if (gameOver) {
        return;
    }
    if (this == suankiKostebekkonum && kostebekClickable) {
        score += 10;
        document.getElementById("score").innerText = "Skorunuz: " +score.toString();

        // Köstebeği tıklanamaz hale getir
        kostebekClickable = false;
        suankiKostebekkonum.style.pointerEvents = "none";

        // Köstebeğin başka bir yere geçtiğinde tıklanabilir hale getir
        setTimeout(() => {
            kostebekClickable = true;
            if (suankiKostebekkonum) {
                suankiKostebekkonum.style.pointerEvents = "auto";
            }
        }, 800); // 0.8 saniye sonra köstebeği tıklanabilir hale getir
        sendScoreToBot(score);
    }
    else if (this == suankidDusmankonum) {
        // Düşman görseline tıklanırsa, görseli değiştir
        let dusmanImage = suankidDusmankonum.querySelector("img");
        if (dusmanImage) {
            dusmanImage.src = "./bombaiki.png"; // Görseli bombaiki.png olarak değiştir
        }

        document.getElementById("score").innerText = "Game Over: " + score.toString();
        gameOver = true;
        sendScoreToBot(score);
    }
}


function startTimer() {
    const timerElement = document.getElementById("timer");

    let timerInterval = setInterval(function () {
        if (gameOver || timer <= 0) {
            clearInterval(timerInterval); // Zamanlayıcıyı durdur
            document.getElementById("score").innerText = "Game Over: " + score.toString();
            gameOver = true;
        } else {
            timer--;
            document.getElementById("timer").innerText = "Kalan süre: " + timer.toString();
        }
    }, 1000); // Her saniyede bir çalışacak
}

function sendScoreToBot(score) {
    // Gerçek kullanıcı ID'sini buradan almanız gerekebilir
    let userId = user_id; // Bu kısmı değiştirebilirsiniz

    fetch("http://localhost:5000/api/save_score", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: userId, score: score })
    })
    .then(response => response.json())
    .then(data => {
        console.log("Score saved to database:", data);
    })
    .catch(error => {
        console.error("Error saving score:", error);
    });
}
