const ball = document.querySelector('.ball');
const platform = document.querySelector('.platform');
let ballSpeedY = 2;
let ballPosY = 20;

function update() {
    ballPosY += ballSpeedY;
    if (ballPosY >= 380) {
        ballSpeedY = -ballSpeedY;
    } else if (ballPosY <= 20) {
        ballSpeedY = -ballSpeedY;
    }
    ball.style.bottom = `${ballPosY}px`;
    requestAnimationFrame(update);
}

update();