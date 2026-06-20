import { Ball } from "./ball.js";
import {
  GAME_WIDTH,
  GAME_HEIGHT,
  ARENA_MARGIN,
  BALL_COUNT,
  BALL_RADIUS,
  BALL_STATS_RANGE,
} from "./config.js";

const BALL_COLORS = [
  0x4ade80, 0xf87171, 0x60a5fa, 0xfacc15, 0xc084fc, 0xfb923c, 0x2dd4bf, 0xf472b6,
];

export class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
    this.balls = []; // wszystkie żywe kulki na arenie
    this.isGameOver = false;
  }

  create() {
    this.defineArena();
    this.drawArenaBorder();
    this.spawnBalls();

    this.ballGroup = this.physics.add.group(this.balls.map((b) => b.sprite));
    this.physics.add.collider(
      this.ballGroup,
      this.ballGroup,
      this.onBallCollide,
      null,
      this
    );

    this.statusText = this.add.text(10, 10, "", {
      fontSize: "18px",
      fill: "#ffffff",
    });

    this.endText = this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2, "", {
        fontSize: "28px",
        fill: "#ffffff",
        align: "center",
      })
      .setOrigin(0.5)
      .setVisible(false);

    // Brak sterowania kulką - jedyna interakcja to restart po zakończeniu walki
    this.input.on("pointerdown", () => {
      if (this.isGameOver) this.scene.restart();
    });
  }

  // Arena to prostokąt z marginesem od krawędzi canvasu - tu ustawiamy
  // granice świata fizyki, żeby kulki odbijały się od "ścian areny", nie od canvasu.
  defineArena() {
    const bounds = {
      x: ARENA_MARGIN,
      y: ARENA_MARGIN,
      width: GAME_WIDTH - ARENA_MARGIN * 2,
      height: GAME_HEIGHT - ARENA_MARGIN * 2,
    };
    this.arenaBounds = bounds;
    this.physics.world.setBounds(bounds.x, bounds.y, bounds.width, bounds.height);
  }

  drawArenaBorder() {
    const g = this.add.graphics();
    g.lineStyle(4, 0x6b7280, 1);
    g.strokeRect(
      this.arenaBounds.x,
      this.arenaBounds.y,
      this.arenaBounds.width,
      this.arenaBounds.height
    );
  }

  spawnBalls() {
    const { x, y, width, height } = this.arenaBounds;

    for (let i = 0; i < BALL_COUNT; i++) {
      const bx = Phaser.Math.Between(x + 40, x + width - 40);
      const by = Phaser.Math.Between(y + 40, y + height - 40);

      const ball = new Ball(this, bx, by, {
        color: BALL_COLORS[i % BALL_COLORS.length],
        radius: BALL_RADIUS,
        maxHp: Phaser.Math.Between(...BALL_STATS_RANGE.maxHp),
        damage: Phaser.Math.Between(...BALL_STATS_RANGE.damage),
        maxSpeed: Phaser.Math.Between(...BALL_STATS_RANGE.maxSpeed),
      });
      ball.launchRandom(Phaser.Math.Between(120, 200));

      this.balls.push(ball);
    }
  }

  // Kluczowy mechanizm: zderzenie dwóch kulek = obie zadają sobie wzajemnie obrażenia.
  // Fizyczne odbicie (knockback) Phaser robi za nas automatycznie dzięki setBounce(1).
  onBallCollide(spriteA, spriteB) {
    const ballA = spriteA.ballRef;
    const ballB = spriteB.ballRef;
    if (!ballA || !ballB) return;

    const time = this.time.now;
    ballA.takeDamage(ballB.damage, time);
    ballB.takeDamage(ballA.damage, time);
  }

  update() {
    if (this.isGameOver) return;

    this.balls.forEach((ball) => ball.updateHpBar());
    this.removeDeadBalls();
    this.checkEndCondition();
    this.updateStatusText();
  }

  removeDeadBalls() {
    const dead = this.balls.filter((b) => b.isDead());
    if (dead.length === 0) return;

    dead.forEach((ball) => {
      this.ballGroup.remove(ball.sprite, true, true); // usuń z grupy i zniszcz sprite
      ball.hpBar.destroy();
      ball.hpBarBg.destroy();
    });

    this.balls = this.balls.filter((b) => !b.isDead());
  }

  checkEndCondition() {
    if (this.balls.length > 1) return;

    const message =
      this.balls.length === 1
        ? "Zwycięzca!\nKliknij, aby zagrać ponownie"
        : "Remis - wszystkie kulki padły!\nKliknij, aby zagrać ponownie";

    this.endGame(message);
  }

  endGame(message) {
    this.isGameOver = true;
    this.endText.setText(message).setVisible(true);
    this.physics.pause();
  }

  updateStatusText() {
    this.statusText.setText(`Kulki na arenie: ${this.balls.length}`);
  }
}
