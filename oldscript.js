const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
canvas.width = innerWidth;
canvas.height = innerHeight;

const keys = [];

function drawSprite(img, sX, sY, sW, sH, dX, dY, dW, dH){
    ctx.drawImage(img, sX, sY, sW, sH, dX, dY, dW, dH)
}

const player = {
    x: 350,
    y: 400,
    width: 16,
    height: 16,
    frameX: 0,
    frameY: 0,
    speed: 5,
    moving: false
};

const playerSprite = new Image();
playerSprite.src = "img/Walk.png";
const background = new Image();
background.src = "img/background.png";

window.addEventListener("keydown", function(e){
    keys[e.keyCode] = true;
    player.moving = true;
});
window.addEventListener("keyup", function(e){
    delete keys[e.keyCode];
    player.moving = false;
});

function movePlayer(){
    //up
    if (keys[38] && player.y > 50){
        player.y -= player.speed;
        player.frameX = 1;
        player.moving = true;
    }
    //left
    if (keys[37] && player.x > 0){
        player.x -= player.speed;
        player.frameX = 2;
        player.moving = true;
    }
    //down
    if (keys[40] && player.y < canvas.height - player.height){
        player.y += player.speed;
        player.frameX = 0;
        player.moving = true;
    }
    //right
    if (keys[39] && player.x < canvas.width - player.width){
        player.x += player.speed;
        player.frameX = 3;
        player.moving = true;
    }
}
function handleplayerFrame(){
    if(player.frameY < 3 && player.moving) player.frameY++
    else player.frameY = 0;
}

let fps, fpsInterval, startTime, now, then, elapsed;

function startAnimating(fps){
    fpsInterval = 1000 / fps;
    then = Date.now();
    startTime = then;
    animate();
}

function animate(){
    requestAnimationFrame(animate);
    now = Date.now();
    elapsed = now - then;
    if (elapsed > fpsInterval){
        then = now - (elapsed % fpsInterval);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
        drawSprite(playerSprite, player.width * player.frameX, 
        player.height * player.frameY, player.width, 
        player.height, player.x, player.y, player.width, 
        player.height);
        movePlayer();
        handleplayerFrame();
        drawFruits();
    }
}
startAnimating(24);