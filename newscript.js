let canvas = document.getElementById("game");
    let game = canvas.getContext("2d");
    let lastTimestamp = 0;
    let score = document.getElementById("playerScore");

    const FRAME_RATE = 60;
    const FRAME_DURATION = 1000 / FRAME_RATE;

    let fallers = [];

    const DEFAULT_DESCENT = 0.0003; // This is per millisecond.
    let Faller = function (x, y, width, height, dx = 0, dy = 0, ax = 0, ay = DEFAULT_DESCENT) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        // Velocity.
        this.dx = dx;
        this.dy = dy;

        // Acceleration.
        this.ax = ax;
        this.ay = ay;
    };

    Faller.prototype.draw = function () {
        game.fillStyle = "blue";
        game.fillRect(this.x, this.y, this.width, this.height);
    };

    Faller.prototype.move = function (millisecondsElapsed) {
        this.x += this.dx * millisecondsElapsed;
        this.y += this.dy * millisecondsElapsed;

        this.dx += this.ax * millisecondsElapsed;
        this.dy += this.ay * millisecondsElapsed;
    };

    const PLAYER_Y = canvas.height - 64;
    let Player = function (x, y = PLAYER_Y, width = 64, height = 64) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    };

    Player.prototype.draw = function () {
        game.fillStyle = "darkred";
        game.fillRect(this.x, this.y, 64, 64);
    };

    let player = new Player(canvas.width / 2);

    let checkCollision = function(px = player.x, py = player.y, fx = fallers, fy){

    }
    let draw = (millisecondsElapsed) => {
        game.clearRect(0, 0, canvas.width, canvas.height);

       /* isCollision = false
        fallers.forEach((faller) => {
            isCollision = isCollision || checkCollision(faller,player) 
           });

        if (player.x + 64 >= Faller.x && 
            player.x <= Faller.x + 64 &&
            player.y + 64 >= Faller.y && 
            player.y <= Faller.y + 64) {
                alert("GAME OVER!");
        };
        */
        fallers.forEach((faller) => {
            faller.draw();
            faller.move(millisecondsElapsed);
        });

        player.draw();

        // Remove fallers that have hit the ground. 
        fallers = fallers.filter((faller) => {
            return faller.y < canvas.height;
        });
    };

    // It is responsible for generating falling objects at random.

    const MILLISECONDS_BETWEEN_FALLERS = 800;

    let fallerGenerator;
    let startFallerGenerator = () => {
        fallerGenerator = setInterval(() => {

            fallers.push(new Faller(Math.floor(Math.random() * (canvas.width - 64)), 0, 64, 64));
        }, MILLISECONDS_BETWEEN_FALLERS);
    };

    let stopFallerGenerator = () => clearInterval(fallerGenerator);

    // This section is responsible for moving the "player" around based on mouse movement
    let setPlayerPositionBasedOnMouse = (event) => {
        player.x = event.clientX / document.body.clientWidth * canvas.width;
    };

    document.body.addEventListener("mouseenter", setPlayerPositionBasedOnMouse);
    document.body.addEventListener("mousemove", setPlayerPositionBasedOnMouse);

    let running = false;
    let nextFrame = (timestamp) => {
        if (!lastTimestamp) {
            lastTimestamp = timestamp;
        }

        if (timestamp - lastTimestamp < FRAME_DURATION) {
            if (running) {
                window.requestAnimationFrame(nextFrame);
            }

            return;
        }

        draw(timestamp - lastTimestamp);

        lastTimestamp = timestamp;
        if (running) {
            window.requestAnimationFrame(nextFrame);
        }
    };

    document.getElementById("start-button").addEventListener("click", () => {
        running = true;
        lastTimestamp = 0;
        startFallerGenerator();
        window.requestAnimationFrame(nextFrame);
    });

    document.getElementById("stop-button").addEventListener("click", () => {
        stopFallerGenerator();
        running = false;
    });