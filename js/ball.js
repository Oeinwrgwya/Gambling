import { HIT_INVULNERABILITY_MS } from "../config.js";

// Bazowa klasa kulki. Gracz i wrogowie korzystają z tej samej klasy -
// jedyna różnica to kto steruje ruchem (zobacz PlayerBall.js).
export class Ball {
  constructor(scene, x, y, config = {}) {
    this.scene = scene;

    this.color = config.color ?? 0xffffff;
    this.radius = config.radius ?? 16;

    this.maxHp = config.maxHp ?? 100;
    this.hp = this.maxHp;
    this.damage = config.damage ?? 10;
    this.maxSpeed = config.maxSpeed ?? 220;

    this.invulnerableUntil = 0;

    this.sprite = this.createSprite(x, y);
    this.createHpBar(x, y);
  }

  createSprite(x, y) {
    const key = `ball-${this.color}-${this.radius}`;
    if (!this.scene.textures.exists(key)) {
      const g = this.scene.add.graphics();
      g.fillStyle(this.color, 1);
      g.fillCircle(this.radius, this.radius, this.radius);
      g.generateTexture(key, this.radius * 2, this.radius * 2);
      g.destroy();
    }

    const sprite = this.scene.physics.add.image(x, y, key);
    sprite.setCircle(this.radius);
    sprite.setBounce(1, 1); // odbicie bez utraty energii - jak bilardowa kulka
    sprite.body.setMaxSpeed(this.maxSpeed); // arcade physics sam ograniczy prędkość
    sprite.ballRef = this;

    return sprite;
  }

  createHpBar(x, y) {
    const barY = y - this.radius - 10;
    const barX = x - this.radius;

    this.hpBarBg = this.scene.add
      .rectangle(barX, barY, this.radius * 2, 5, 0x333333)
      .setOrigin(0, 0.5);

    this.hpBar = this.scene.add
      .rectangle(barX, barY, this.radius * 2, 5, 0x4ade80)
      .setOrigin(0, 0.5);
  }

  // Wystrzeliwuje kulkę w losowym kierunku z podaną prędkością - przydatne przy spawnie
  launchRandom(speed) {
    const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
    this.sprite.body.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);
  }

  canTakeDamage(time) {
    return time >= this.invulnerableUntil;
  }

  // Zwraca true, jeśli obrażenia faktycznie zostały zadane (np. nie była nietykalna)
  takeDamage(amount, time) {
    if (!this.canTakeDamage(time)) return false;

    this.hp -= amount;
    if (this.hp < 0) this.hp = 0;
    this.invulnerableUntil = time + HIT_INVULNERABILITY_MS;

    return true;
  }

  isDead() {
    return this.hp <= 0;
  }

  updateHpBar() {
    const barX = this.sprite.x - this.radius;
    const barY = this.sprite.y - this.radius - 10;

    this.hpBarBg.setPosition(barX, barY);
    this.hpBar.setPosition(barX, barY);
    this.hpBar.width = this.radius * 2 * Math.max(0, this.hp / this.maxHp);
  }

  destroy() {
    this.sprite.destroy();
    this.hpBar.destroy();
    this.hpBarBg.destroy();
  }
}
