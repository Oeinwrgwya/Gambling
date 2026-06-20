// Wszystkie "magiczne liczby" trzymamy tutaj, żeby łatwo balansować grę
// bez szukania ich w kodzie logiki.

export const GAME_WIDTH = 800;
export const GAME_HEIGHT = 600;

// Margines między krawędzią canvasu a ścianami areny (samego prostokąta gry)
export const ARENA_MARGIN = 40;

export const BALL_COUNT = 6;
export const BALL_RADIUS = 16;

// Zakresy losowania staty każdej kulki przy starcie - dla urozmaicenia walk.
// Chcesz identyczne kulki? Ustaw min = max w każdym zakresie.
export const BALL_STATS_RANGE = {
  maxHp: [70, 110],
  damage: [8, 16],
  maxSpeed: [140, 220],
};

// Jak długo (ms) kulka jest "nietykalna" po otrzymaniu obrażeń,
// żeby jedno zderzenie nie zdjęło HP wielokrotnie w jednej klatce
export const HIT_INVULNERABILITY_MS = 300;
