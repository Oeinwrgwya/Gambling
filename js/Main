import { GameScene } from "./scenes/GameScene.js";
import { GAME_WIDTH, GAME_HEIGHT } from "./config.js";

const config = {
  type: Phaser.AUTO,
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  parent: "game-container",
  backgroundColor: "#1a1a2e",
  physics: {
    default: "arcade",
    arcade: { debug: false },
  },
  scene: [GameScene],
};

new Phaser.Game(config);
