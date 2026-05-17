"use strict";

const app = document.querySelector("#app");

const SYMBOLS = ["◆", "◇", "●", "○", "★", "☆", "▲", "△", "■", "□", "▼", "▽", "✦", "✧", "※", "◎"];
const STAT_LABELS = {
  hp: "HP",
  mp: "MP",
  tp: "TP",
  attack: "攻撃力",
  defense: "防御力",
  magic: "魔力",
  magicDefense: "魔法防御",
  technique: "技術",
  speed: "素早さ",
  luck: "運"
};

const JOBS = [
  { name: "戦士", role: "物理前衛", note: "攻撃力と防御力が高く、TPを使う特技で押す。魔法は苦手。", hp: 1.22, mp: 0.62, tp: 1.12, attack: 1.28, defense: 1.18, magic: 0.62, magicDefense: 0.86, technique: 1.05, speed: 0.88, luck: 0.9 },
  { name: "魔法使い", role: "攻撃魔法", note: "通常攻撃は弱いが、低レベルからMPなしの魔法を使える。魔力で戦う。", hp: 0.82, mp: 1.35, tp: 0.62, attack: 0.72, defense: 0.78, magic: 1.42, magicDefense: 1.24, technique: 0.76, speed: 1.02, luck: 1.0 },
  { name: "僧侶", role: "回復・耐久", note: "魔法防御と回復が強い。攻撃力は控えめで長期戦向き。", hp: 0.98, mp: 1.2, tp: 0.72, attack: 0.82, defense: 1.04, magic: 1.12, magicDefense: 1.36, technique: 0.8, speed: 0.92, luck: 1.24 },
  { name: "忍者", role: "高速技巧", note: "素早さと技術で先手を取り、TP特技で削る。耐久は低め。", hp: 0.92, mp: 0.86, tp: 1.32, attack: 1.08, defense: 0.82, magic: 0.82, magicDefense: 0.92, technique: 1.42, speed: 1.48, luck: 1.18 },
  { name: "暗黒騎士", role: "物魔混合", note: "攻撃力と闇魔法を両立するが、運と素早さは低い。", hp: 1.12, mp: 0.92, tp: 0.98, attack: 1.35, defense: 1.05, magic: 1.06, magicDefense: 0.98, technique: 1.02, speed: 0.76, luck: 0.72 },
  { name: "武闘家", role: "特技連打", note: "技術と攻撃力で戦う。MPは低いがTPが高く、特技を連発しやすい。", hp: 1.08, mp: 0.58, tp: 1.48, attack: 1.22, defense: 0.92, magic: 0.58, magicDefense: 0.82, technique: 1.48, speed: 1.3, luck: 1.08 },
  { name: "賢者", role: "万能魔法", note: "攻撃魔法と回復魔法を覚える万能職。伸びるほど選択肢が増える。", hp: 0.96, mp: 1.42, tp: 0.76, attack: 0.9, defense: 0.96, magic: 1.34, magicDefense: 1.3, technique: 0.88, speed: 0.94, luck: 1.14 },
  { name: "盗賊", role: "運と技巧", note: "技術と運で崩す職業。TPが高く、高レベルで奇襲特技が強くなる。", hp: 0.9, mp: 0.74, tp: 1.38, attack: 0.96, defense: 0.8, magic: 0.74, magicDefense: 0.86, technique: 1.32, speed: 1.34, luck: 1.48 }
];

const JOB_SPRITE_SHEETS = {
  "戦士": "assets/sprites/jobs/warrior.png",
  "魔法使い": "assets/sprites/jobs/mage.png",
  "僧侶": "assets/sprites/jobs/priest.png",
  "忍者": "assets/sprites/jobs/ninja.png",
  "暗黒騎士": "assets/sprites/jobs/dark-knight.png",
  "武闘家": "assets/sprites/jobs/martial-artist.png",
  "賢者": "assets/sprites/jobs/sage.png",
  "盗賊": "assets/sprites/jobs/thief.png"
};

const MAGIC_BOOK = [
  { name: "魔力弾", minLevel: 1, jobs: ["魔法使い", "僧侶", "賢者", "暗黒騎士"], cost: 0, kind: "magic", power: 1.12, type: "攻撃魔法", effect: "MPなしで撃てる基礎魔法。魔法職の通常攻撃代わりになる" },
  { name: "火炎弾", minLevel: 5, jobs: ["魔法使い", "賢者", "暗黒騎士"], cost: 18, kind: "magic", power: 1.0, type: "攻撃魔法", effect: "魔力で火球を放つ基本魔法" },
  { name: "魔力集中", minLevel: 10, jobs: ["魔法使い", "僧侶", "賢者"], cost: 16, kind: "buff", stat: "magic", amount: 0.24, duration: 3, type: "補助魔法", effect: "自分の魔力をしばらく上げる補助魔法" },
  { name: "霧縛り", minLevel: 14, jobs: ["魔法使い", "賢者"], cost: 22, kind: "debuff", stat: "speed", amount: -0.24, duration: 3, type: "状態異常魔法", effect: "相手の素早さを下げ、先手の有利を崩す" },
  { name: "癒しの光", minLevel: 8, jobs: ["僧侶", "賢者"], cost: 34, kind: "heal", power: 0.82, type: "回復魔法", effect: "HPを少し回復する。同じ戦闘で使うほど効果低下" },
  { name: "守護結界", minLevel: 16, jobs: ["魔法使い", "僧侶", "賢者"], cost: 24, kind: "buff", stat: "magicDefense", amount: 0.28, duration: 3, type: "補助魔法", effect: "自分の魔法防御を上げ、魔法ダメージを抑える" },
  { name: "衰弱の呪い", minLevel: 20, jobs: ["魔法使い", "暗黒騎士", "賢者"], cost: 28, kind: "debuff", stat: "attack", amount: -0.22, duration: 3, type: "状態異常魔法", effect: "相手の攻撃力を下げ、物理職の勢いを削ぐ" },
  { name: "黒雷", minLevel: 18, jobs: ["魔法使い", "賢者", "暗黒騎士"], cost: 38, kind: "magic", power: 1.34, type: "攻撃魔法", effect: "魔力を中心にした雷撃ダメージ" },
  { name: "聖光再生", minLevel: 24, jobs: ["僧侶", "賢者"], cost: 52, kind: "heal", power: 1.12, type: "回復魔法", effect: "HPを大きく回復するが消費MPが重い" },
  { name: "冥王炎", minLevel: 34, jobs: ["暗黒騎士", "魔法使い"], cost: 58, kind: "magic", power: 1.62, type: "攻撃魔法", effect: "魔力と攻撃力を混ぜた闇炎ダメージ" },
  { name: "星詠み", minLevel: 48, jobs: ["賢者"], cost: 76, kind: "magic", power: 1.92, type: "攻撃魔法", effect: "高い魔法防御も貫きやすい星光魔法" }
];

const TECHNIQUE_BOOK = [
  { name: "けん制", minLevel: 1, jobs: ["盗賊", "忍者", "魔法使い", "僧侶", "賢者"], cost: 0, kind: "technique", power: 0.72, type: "特技", effect: "技術で相手の隙を突く軽い特技" },
  { name: "強打", minLevel: 1, jobs: ["戦士", "武闘家", "暗黒騎士"], cost: 0, kind: "technique", power: 0.92, type: "特技", effect: "技術と攻撃力で打ち込む基本特技" },
  { name: "影縫い", minLevel: 7, jobs: ["忍者", "盗賊"], cost: 14, kind: "technique", power: 1.08, type: "特技", effect: "技術と素早さを乗せた一撃" },
  { name: "気合ため", minLevel: 9, jobs: ["戦士", "武闘家", "暗黒騎士"], cost: 16, kind: "buff", stat: "attack", amount: 0.22, duration: 3, type: "補助特技", effect: "自分の攻撃力をしばらく上げる" },
  { name: "足払い", minLevel: 12, jobs: ["武闘家", "忍者", "盗賊"], cost: 18, kind: "debuff", stat: "speed", amount: -0.2, duration: 3, type: "妨害特技", effect: "相手の素早さを下げ、行動順の優位を崩す" },
  { name: "竜牙連撃", minLevel: 15, jobs: ["武闘家", "忍者"], cost: 24, kind: "technique", power: 1.34, type: "特技", effect: "連続攻撃を叩き込む中級特技" },
  { name: "鉄身", minLevel: 18, jobs: ["戦士", "武闘家"], cost: 22, kind: "buff", stat: "defense", amount: 0.28, duration: 3, type: "補助特技", effect: "自分の防御力を上げ、物理ダメージを抑える" },
  { name: "覇王斬", minLevel: 22, jobs: ["戦士", "暗黒騎士"], cost: 34, kind: "technique", power: 1.56, type: "特技", effect: "攻撃力と技術を合わせた重い斬撃" },
  { name: "運命強奪", minLevel: 30, jobs: ["盗賊"], cost: 32, kind: "technique", power: 1.42, type: "特技", effect: "運の高さも乗る奇襲ダメージ" },
  { name: "無双乱舞", minLevel: 45, jobs: ["武闘家", "忍者"], cost: 52, kind: "technique", power: 1.86, type: "特技", effect: "技術が高いほど伸びる上級特技" }
];

const STAGE_LEVELS = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
  11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
  22, 24, 26, 28, 30, 32, 34, 36, 38, 40,
  43, 46, 49, 52, 55, 58, 61, 64, 67, 70,
  73, 76, 79, 82, 85, 88, 91, 94, 97, 99
];

const STAGE_NAMES = [
  "影の見習い", "草原の番兵", "古井戸の剣士", "夕闇の盗賊", "森の格闘家",
  "薄明の僧兵", "黒衣の術士", "疾風の下忍", "土煙の武人", "夜叉の剣士",
  "白銀の祈祷師", "双刃の盗賊", "火花の魔導士", "骨砕きの拳士", "古城の隊長",
  "月読の僧兵", "疾風の刃", "竜骨の武人", "冥府の使者", "星屑の魔導士",
  "黒羽の剣豪", "氷雨の僧正", "影渡りの忍者", "紅蓮の拳王", "虚無の賢者",
  "黄金の盗王", "雷鳴の魔人", "鉄壁の戦鬼", "白夜の大僧正", "百影の忍頭",
  "深淵の騎将", "天文の賢王", "不滅の剣聖", "冥府の盗神", "星滅の魔導王",
  "神速の影皇", "破軍の拳聖", "聖盾の大神官", "黒翼の覇者", "虚空の賢帝",
  "焦熱の魔皇", "無明の暗黒騎士", "銀河の僧帝", "百鬼の盗帝", "天墜の武神",
  "終末の魔導王", "無限の賢帝", "神域の剣王", "終焉の前触れ", "終焉の暗黒王"
];

const STAGE_JOBS = ["盗賊", "戦士", "戦士", "盗賊", "武闘家", "僧侶", "魔法使い", "忍者", "武闘家", "暗黒騎士", "僧侶", "盗賊", "魔法使い", "武闘家", "戦士", "僧侶", "忍者", "武闘家", "暗黒騎士", "魔法使い", "暗黒騎士", "僧侶", "忍者", "武闘家", "賢者"];

const SEED_SHOP = [
  { key: "hp", name: "命の種", price: 120, gain: 18, description: "HPを18上げる" },
  { key: "mp", name: "魔力の雫", price: 110, gain: 10, description: "MPを10上げる" },
  { key: "tp", name: "技の霊薬", price: 110, gain: 10, description: "TPを10上げる" },
  { key: "attack", name: "力の種", price: 150, gain: 3, description: "攻撃力を3上げる" },
  { key: "defense", name: "守りの種", price: 140, gain: 3, description: "防御力を3上げる" },
  { key: "magic", name: "魔力の種", price: 150, gain: 3, description: "魔力を3上げる" },
  { key: "magicDefense", name: "抗魔の種", price: 140, gain: 3, description: "魔法防御を3上げる" },
  { key: "technique", name: "技術の種", price: 145, gain: 3, description: "技術を3上げる" },
  { key: "speed", name: "疾風の種", price: 145, gain: 3, description: "素早さを3上げる" },
  { key: "luck", name: "幸運の種", price: 130, gain: 3, description: "運を3上げる" }
];

const BATTLE_SPEEDS = [0.75, 1, 1.5, 2];
const BATTLE_SPEED_BASE = 0.75;
const MUSIC_TRACKS = {
  menu: "assets/audio/menu.mp3",
  battle: "assets/audio/battle.mp3"
};
const MUSIC_VOLUMES = {
  menu: 0.18,
  battle: 0.22
};
const SFX_TRACKS = {
  select: "assets/sfx/ui-select.mp3",
  confirm: "assets/sfx/ui-confirm.mp3",
  encounter: "assets/sfx/encounter.mp3",
  attack: "assets/sfx/attack.mp3",
  damage: "assets/sfx/damage.mp3",
  miss: "assets/sfx/miss.mp3",
  guard: "assets/sfx/guard.mp3",
  magic: "assets/sfx/magic.mp3",
  heal: "assets/sfx/heal.mp3",
  status: "assets/sfx/status.mp3",
  win: "assets/sfx/reward.mp3",
  shop: "assets/sfx/reward.mp3",
  down: "assets/sfx/defeat.mp3"
};
const SFX_VOLUMES = {
  select: 0.42,
  confirm: 0.48,
  encounter: 0.38,
  attack: 0.44,
  damage: 0.5,
  miss: 0.36,
  guard: 0.42,
  magic: 0.42,
  heal: 0.44,
  status: 0.4,
  win: 0.42,
  shop: 0.42,
  down: 0.46
};
const AUDIO_PREFS_KEY = "namebattler-audio-pref-v1";

const STAGES = STAGE_LEVELS.map((level, index) => makeEnemy(
  STAGE_NAMES[index],
  STAGE_JOBS[index % STAGE_JOBS.length],
  level,
  Math.round(62 + index * 4.8 + level * 0.72)
));

const state = {
  screen: "title",
  mode: "solo",
  error: "",
  preview: null,
  previewTwo: null,
  player: null,
  enemy: null,
  second: null,
  stageIndex: 0,
  selectedStage: 0,
  battle: null,
  auto: false,
  busy: false,
  actionMenu: null,
  result: null,
  battleSpeed: 1,
  audioOn: true,
  audioReady: false,
  audio: null,
  musicTrack: null,
  musicMode: null,
  musicRetryArmed: false,
  audioUnlocked: false
};

function hashText(text) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function unitHash(text, salt) {
  return hashText(`${salt}::${text}`) / 4294967296;
}

function rng(seed) {
  let value = seed >>> 0;
  return () => {
    value += 0x6d2b79f5;
    let t = value;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function normalizeName(value) {
  return value.trim().replace(/\s+/g, " ");
}

function readNamePattern(input) {
  const text = normalizeName(input);
  if (text.length < 5) return { ok: false, name: text };
  const longTail = Array.from(text.slice(-14));
  if (longTail.length === 14 && longTail.every((char) => SYMBOLS.includes(char))) {
    const name = text.slice(0, -14);
    const values = longTail.map((char) => SYMBOLS.indexOf(char));
    const level = (values[0] << 8) + (values[1] << 4) + values[2];
    const counts = values.slice(3, 13);
    const check = hashText(`${name}:名前パターン:${level}:${counts.join(",")}`) & 15;
    if (name && level >= 1 && level <= 999 && check === values[13]) {
      const seedBoosts = {};
      SEED_SHOP.forEach((item, index) => {
        if (counts[index]) seedBoosts[item.key] = counts[index] * item.gain;
      });
      return { ok: true, name, level, seedBoosts };
    }
  }
  const tail = Array.from(text.slice(-4));
  if (tail.length !== 4 || tail.some((char) => !SYMBOLS.includes(char))) {
    return { ok: false, name: text };
  }
  const name = text.slice(0, -4);
  const values = tail.map((char) => SYMBOLS.indexOf(char));
  const level = (values[0] << 8) + (values[1] << 4) + values[2];
  const check = hashText(`${name}:名前パターン:${level}`) & 15;
  if (name && level >= 1 && level <= 999 && check === values[3]) {
    return { ok: true, name, level };
  }
  return { ok: false, name: text };
}

function makeNamePattern(character) {
  const level = clamp(character.level, 1, 999);
  const values = [(level >> 8) & 15, (level >> 4) & 15, level & 15];
  const hasBoosts = SEED_SHOP.some((item) => character.seedBoosts?.[item.key]);
  if (hasBoosts) {
    const counts = SEED_SHOP.map((item) => clamp(Math.round((character.seedBoosts?.[item.key] || 0) / item.gain), 0, 15));
    values.push(...counts);
    values.push(hashText(`${character.name}:名前パターン:${level}:${counts.join(",")}`) & 15);
    return `${character.name}${values.map((value) => SYMBOLS[value]).join("")}`;
  }
  values.push(hashText(`${character.name}:名前パターン:${level}`) & 15);
  return `${character.name}${values.map((value) => SYMBOLS[value]).join("")}`;
}

function rareLevelFromName(name) {
  const baseRoll = unitHash(name, "NameBattler-level-v3");
  const omenRoll = unitHash(name, "NameBattler-level-omen-v3");
  const common = Math.pow(baseRoll, 1.55);
  const base = Math.round(1 + common * 56);
  if (omenRoll > 0.9994) return clamp(base + 43, 1, 99);
  if (omenRoll > 0.997) return clamp(base + 25, 1, 99);
  if (omenRoll > 0.986) return clamp(base + 12, 1, 99);
  if (omenRoll < 0.035) return clamp(base - 6, 1, 99);
  return clamp(base, 1, 99);
}

function createCharacter(inputName, options = {}) {
  const pattern = readNamePattern(inputName);
  const baseName = pattern.ok ? pattern.name : normalizeName(inputName);
  if (!baseName) throw new Error("名前を入力してください。");

  const seed = hashText(baseName);
  const job = JOBS[Math.floor(unitHash(baseName, "NameBattler-job-v3") * JOBS.length)];
  const generatedLevel = rareLevelFromName(baseName);
  const initialLevel = options.level || pattern.level || generatedLevel;
  const tint = `hsl(${Math.floor(unitHash(baseName, "NameBattler-tint-v3") * 360)} 76% 58%)`;
  const dark = `hsl(${Math.floor(unitHash(baseName, "NameBattler-dark-v3") * 360)} 54% 28%)`;
  const aura = `hsla(${Math.floor(unitHash(baseName, "NameBattler-aura-v3") * 360)} 92% 66% / 0.72)`;
  const nature = 0.78 + Math.pow(unitHash(baseName, "NameBattler-nature-v3"), 2.2) * 0.82;
  const spikeRoll = unitHash(baseName, "NameBattler-spike-v3");
  const spike = spikeRoll > 0.94 ? 1.65 : spikeRoll < 0.05 ? 0.58 : 1;
  const focusList = ["hp", "mp", "tp", "attack", "defense", "magic", "magicDefense", "technique", "speed", "luck"];
  const focus = focusList[Math.floor(unitHash(baseName, "NameBattler-focus-v3") * focusList.length)];
  const character = {
    id: `${baseName}-${seed}`,
    name: baseName,
    displayName: baseName,
    job,
    level: initialLevel,
    exp: 0,
    seed,
    tint,
    dark,
    aura,
    baseNature: nature,
    focus,
    spike
  };
  character.stats = buildStats(character, spike);
  character.gold = options.gold || 0;
  character.seedBoosts = options.seedBoosts || pattern.seedBoosts || {};
  applySeedBoosts(character);

  character.patternUsed = pattern.ok;
  character.currentHp = character.stats.hp;
  character.currentMp = character.stats.mp;
  character.currentTp = character.stats.tp;
  return character;
}

function buildStats(character, spike) {
  const j = character.job;
  const level = character.level;
  const base = {
    hp: (42 + level * 8.3) * j.hp,
    mp: (14 + level * 3.7) * j.mp,
    tp: (12 + level * 3.0) * j.tp,
    attack: (9 + level * 2.45) * j.attack,
    defense: (8 + level * 2.18) * j.defense,
    magic: (8 + level * 2.35) * j.magic,
    magicDefense: (7 + level * 2.1) * j.magicDefense,
    technique: (7 + level * 2.25) * j.technique,
    speed: (7 + level * 2.05) * j.speed,
    luck: (5 + level * 1.8) * j.luck
  };
  const keys = Object.keys(base);
  const raw = {};
  keys.forEach((key) => {
    const bias = 0.94 + unitHash(character.id, `stat-${key}`) * 0.12;
    const focusBoost = character.focus === key ? 1.08 : 1;
    raw[key] = base[key] * bias * focusBoost;
  });
  const baseTotal = keys.reduce((sum, key) => sum + base[key], 0);
  const rawTotal = keys.reduce((sum, key) => sum + raw[key], 0);
  const scale = baseTotal / rawTotal;
  return keys.reduce((stats, key) => {
    stats[key] = Math.max(1, Math.round(raw[key] * scale));
    return stats;
  }, {});
}

function applySeedBoosts(character) {
  if (!character.seedBoosts) character.seedBoosts = {};
  Object.entries(character.seedBoosts).forEach(([key, value]) => {
    if (character.stats[key]) character.stats[key] += value;
  });
}

function makeEnemy(name, jobName, level, power) {
  const job = JOBS.find((item) => item.name === jobName) || JOBS[0];
  const seed = hashText(`${name}:${level}`);
  const random = rng(seed);
  const focusList = ["hp", "mp", "tp", "attack", "defense", "magic", "magicDefense", "technique", "speed", "luck"];
  const enemy = {
    id: `enemy-${seed}`,
    name,
    displayName: name,
    job,
    level,
    exp: 0,
    seed,
    tint: `hsl(${Math.floor(random() * 360)} 76% 56%)`,
    dark: `hsl(${Math.floor(random() * 360)} 54% 25%)`,
    aura: `hsla(${Math.floor(random() * 360)} 92% 62% / 0.72)`,
    baseNature: 1,
    focus: focusList[Math.floor(unitHash(name, `enemy-focus-${level}`) * focusList.length)],
    goldReward: power
  };
  enemy.stats = buildStats(enemy, 1);
  enemy.currentHp = enemy.stats.hp;
  enemy.currentMp = enemy.stats.mp;
  enemy.currentTp = enemy.stats.tp;
  return enemy;
}

function cloneForBattle(character) {
  return {
    ...character,
    job: { ...character.job },
    stats: { ...character.stats },
    gold: character.gold || 0,
    seedBoosts: { ...(character.seedBoosts || {}) },
    currentHp: character.stats.hp,
    currentMp: character.stats.mp,
    currentTp: character.stats.tp,
    defending: false,
    effects: {},
    healUses: 0
  };
}

function availableMagic(character) {
  const learned = MAGIC_BOOK.filter((ability) => character.level >= ability.minLevel && ability.jobs.includes(character.job.name));
  if (!learned.length && character.stats.magic > character.stats.attack * 1.05) {
    return [MAGIC_BOOK[0]];
  }
  return learned;
}

function availableTechniques(character) {
  return TECHNIQUE_BOOK.filter((ability) => character.level >= ability.minLevel && ability.jobs.includes(character.job.name));
}

function learnedAbilitiesAtLevel(character, level) {
  const jobName = character.job.name;
  return [...MAGIC_BOOK, ...TECHNIQUE_BOOK]
    .filter((ability) => ability.minLevel === level && ability.jobs.includes(jobName))
    .map((ability) => ({ name: ability.name, type: ability.type, kind: ability.kind }));
}

function fullHeal(character) {
  character.currentHp = character.stats.hp;
  character.currentMp = character.stats.mp;
  character.currentTp = character.stats.tp;
}

function expToNext(level) {
  return Math.round(90 + level * 42 + level * level * 2.6);
}

function awardExp(player, enemy, stageIndex) {
  const enemyPower = enemy.stats.hp + enemy.stats.attack * 8 + enemy.stats.magic * 7 + enemy.stats.technique * 6 + enemy.stats.defense * 5 + enemy.stats.magicDefense * 4;
  const before = player.level;
  const levelGap = Math.max(0, enemy.level - before);
  const levelDown = Math.max(0, before - enemy.level);
  const uphillBonus = levelGap * 95 + levelGap * levelGap * 10;
  const stageBonus = stageIndex * 52;
  const repeatPenalty = Math.max(0.18, 1 - levelDown * 0.075);
  const rawGained = Math.round((150 + enemy.level * 55 + enemyPower / 4.2 + stageBonus + uphillBonus) * repeatPenalty);
  const capRate = before < 8 ? 0.92 : before < 20 ? 0.68 : before < 40 ? 0.48 : before < 70 ? 0.34 : 0.24;
  const gained = Math.max(24, Math.round(Math.min(rawGained, expToNext(before) * capRate)));
  const learned = [];
  const beforeStats = { ...player.stats };
  player.exp += gained;
  while (player.level < 999 && player.exp >= expToNext(player.level)) {
    player.exp -= expToNext(player.level);
    player.level += 1;
    learned.push(...learnedAbilitiesAtLevel(player, player.level));
    player.stats = buildStats(player, player.spike || 1);
    applySeedBoosts(player);
  }
  fullHeal(player);
  return { gained, levels: player.level - before, beforeLevel: before, afterLevel: player.level, beforeStats, afterStats: { ...player.stats }, learned };
}

function render() {
  if (state.screen === "title") {
    renderTitle();
    return;
  }
  if (state.screen === "mode") {
    renderModeSelect();
    return;
  }
  if (state.screen === "battle") {
    renderBattle();
    return;
  }
  if (state.screen === "result") {
    renderResult();
    return;
  }
  if (state.screen === "shop") {
    renderShop();
    return;
  }
  renderSetup();
}

function renderTitle() {
  if (state.audioOn) startMusic("menu");
  app.innerHTML = `
    <main class="shell title-screen">
      <div class="title-orbit"></div>
      <section class="title-hero">
        <p class="title-kicker">名前が力になるRPG風バトル</p>
        <h1 class="title mega">NameBattler</h1>
        <p class="subtitle">名前から職業、レベル、魔法、特技、運命の能力を呼び出せ。</p>
        <div class="title-actions">
          <button class="primary start-button" data-action="open-mode">ゲームスタート</button>
          <button class="icon-button" data-action="help" aria-label="遊び方を開く" title="遊び方">?</button>
          ${soundButton()}
        </div>
      </section>
      ${helpModal()}
    </main>
  `;
  bindCommon();
  app.querySelector("[data-action='open-mode']").addEventListener("click", () => {
    playTone("confirm");
    ensureAudio("menu");
    state.screen = "mode";
    state.preview = null;
    state.previewTwo = null;
    render();
  });
}

function renderModeSelect() {
  if (state.audioOn) startMusic("menu");
  app.innerHTML = `
    <main class="shell">
      <header class="topbar">
        <div>
          <h1 class="title">NameBattler</h1>
          <p class="subtitle">遊ぶモードを選んでください。</p>
        </div>
        <div class="top-actions">
          <button class="icon-button" data-action="help" aria-label="遊び方を開く" title="遊び方">?</button>
          ${soundButton()}
        </div>
      </header>
      <section class="mode-select">
        <button class="mode-card" data-mode="solo">
          <strong>1人用</strong>
          <span>固定ステージを選び、敵を倒して成長する。</span>
        </button>
        <button class="mode-card" data-mode="duel">
          <strong>2人用</strong>
          <span>2つの名前から生まれたキャラクター同士で対戦する。</span>
        </button>
      </section>
      ${helpModal()}
    </main>
  `;
  bindCommon();
  app.querySelectorAll("[data-mode]").forEach((button) => {
    button.addEventListener("click", () => {
      playTone("confirm");
      state.mode = button.dataset.mode;
      state.screen = "setup";
      state.preview = null;
      state.previewTwo = null;
      state.player = null;
      state.second = null;
      state.error = "";
      render();
    });
  });
}

function renderSetup() {
  if (state.audioOn) startMusic("menu");
  const nameOneValue = document.querySelector("#name-one")?.value || "";
  const nameTwoValue = document.querySelector("#name-two")?.value || "";
  const hasDecision = Boolean(state.preview && (state.mode === "solo" || state.previewTwo));
  const duelReady = state.mode === "duel" && hasDecision;
  app.innerHTML = `
    <main class="shell">
      <header class="topbar">
        <div>
          <h1 class="title">NameBattler</h1>
          <p class="subtitle">${state.mode === "solo" ? "1人用：名前を入力して能力を呼び出します。" : "2人用：2人の名前を入力して能力を呼び出します。"}</p>
        </div>
        <div class="top-actions">
          <button class="icon-button" data-action="help" aria-label="遊び方を開く" title="遊び方">?</button>
          ${soundButton()}
          <button data-action="back-mode">モード選択へ</button>
        </div>
      </header>
      ${duelReady ? `
        <section class="panel duel-ready">
          <h2>2人のキャラクター</h2>
          <div class="duel-preview-grid">
            ${characterPreview(state.preview)}
            ${characterPreview(state.previewTwo)}
          </div>
          <div class="start-row duel-actions">
            <button class="primary battle-start-button" data-action="start">戦いを始める</button>
            <button data-action="edit-names">名前を入れ直す</button>
          </div>
        </section>
      ` : `
      <section class="menu">
        <div class="panel">
          <h2>${state.mode === "solo" ? "1人用の名前入力" : "2人用の名前入力"}</h2>
            <div class="form-grid">
              <label class="field">
                <span>${state.mode === "solo" ? "あなたの名前" : "プレイヤー1の名前"}</span>
              <input id="name-one" value="${escapeAttr(nameOneValue)}" placeholder="例：太郎">
            </label>
            ${state.mode === "duel" ? `
              <label class="field">
                <span>プレイヤー2の名前</span>
                <input id="name-two" value="${escapeAttr(nameTwoValue)}" placeholder="例：花子">
              </label>
            ` : `
              <label class="field">
                <span>ステージ選択</span>
                <select id="stage-select">
                  ${STAGES.map((stage, index) => `<option value="${index}" ${state.selectedStage === index ? "selected" : ""}>第${index + 1}ステージ：${stage.name} / レベル ${stage.level}</option>`).join("")}
                </select>
              </label>
            `}
            <div class="start-row">
              <button class="primary" data-action="decide">決定</button>
            </div>
            <div class="error">${state.error}</div>
            <p class="small-note">名前を決定すると能力が現れます。戦闘後に表示される短い記号つきの名前パターンは、1人用でも2人用でもそのまま使えます。</p>
            ${hasDecision ? `
              <div class="battle-start-callout">
                <button class="battle-start-button" data-action="start">戦いを始める</button>
              </div>
            ` : ""}
          </div>
        </div>
        <aside class="panel preview">
          <h2>呼び出された能力</h2>
          ${state.preview ? characterPreview(state.preview) : `<p class="small-note">名前を入力して「決定」を押すと、職業と能力が表示されます。</p>`}
          ${state.previewTwo ? characterPreview(state.previewTwo) : ""}
        </aside>
      </section>
      `}
      ${helpModal()}
    </main>
  `;
  bindSetup();
}

function bindSetup() {
  app.querySelector("[data-action='back-mode']").addEventListener("click", () => {
    playTone("select");
    state.screen = "mode";
    state.preview = null;
    state.previewTwo = null;
    state.player = null;
    state.second = null;
    state.error = "";
    render();
  });
  bindCommon();
  app.querySelectorAll("#name-one, #name-two").forEach((input) => {
    input.addEventListener("input", () => {
      state.preview = null;
      state.previewTwo = null;
      state.player = null;
      state.second = null;
    });
  });
  const stageSelect = app.querySelector("#stage-select");
  if (stageSelect) {
    stageSelect.addEventListener("change", () => {
      playTone("select");
      state.selectedStage = Number(stageSelect.value);
    });
  }
  const decide = app.querySelector("[data-action='decide']");
  if (decide) decide.addEventListener("click", decideNames);
  const start = app.querySelector("[data-action='start']");
  if (start) start.addEventListener("click", startGame);
  const editNames = app.querySelector("[data-action='edit-names']");
  if (editNames) {
    editNames.addEventListener("click", () => {
      playTone("select");
      state.preview = null;
      state.previewTwo = null;
      state.player = null;
      state.second = null;
      state.error = "";
      render();
    });
  }
}

function decideNames() {
  ensureAudio("menu");
  playTone("confirm");
  try {
    state.preview = createCharacter(app.querySelector("#name-one").value);
    state.player = state.preview;
    if (state.mode === "duel") {
      state.previewTwo = createCharacter(app.querySelector("#name-two").value);
      state.second = state.previewTwo;
    } else {
      state.previewTwo = null;
      state.second = null;
    }
    state.error = "";
  } catch (error) {
    state.preview = null;
    state.previewTwo = null;
    state.player = null;
    state.second = null;
    state.error = error.message;
  }
  render();
}

function bindCommon() {
  const sound = app.querySelector("[data-action='sound']");
  if (sound) sound.addEventListener("click", toggleAudio);
  const help = app.querySelector("[data-action='help']");
  const modal = app.querySelector("#help-modal");
  if (help && modal) {
    help.addEventListener("click", () => {
      playTone("select");
      modal.hidden = false;
      modal.querySelector("[data-action='close-help']").focus();
    });
    modal.addEventListener("click", (event) => {
      if (event.target === modal || event.target.closest("[data-action='close-help']")) {
        playTone("select");
        modal.hidden = true;
      }
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !modal.hidden) modal.hidden = true;
    }, { once: true });
  }
}

function helpModal() {
  return `
    <div class="modal-backdrop" id="help-modal" hidden>
      <section class="help-modal" role="dialog" aria-modal="true" aria-labelledby="help-title">
        <div class="modal-head">
          <h2 id="help-title">遊び方</h2>
          <button class="icon-button" data-action="close-help" aria-label="閉じる" title="閉じる">×</button>
        </div>
        <div class="help-content">
          <h3>名前でキャラクターを作る</h3>
          <p>名前を入力すると、職業、レベル、HP、MP、攻撃力、防御力、魔力、魔法防御、技術、素早さ、運が決まります。同じ名前なら、いつでも同じ能力になります。</p>
          <h3>1人用</h3>
          <p>固定された敵を順番に倒してステージを進めます。開始前にステージを選べます。敵の強さはあなたのレベルに合わせて変わらないので、強い名前や成長した名前パターンが攻略の鍵になります。</p>
          <h3>2人用</h3>
          <p>プレイヤー1とプレイヤー2の名前を入れると、それぞれの名前から生まれたキャラクター同士で戦います。</p>
          <h3>戦闘操作</h3>
          <p>マニュアル操作では、通常攻撃、魔法、特技、防御、様子を見るを選べます。回復魔法は強力ですが消費MPが大きく、同じ戦闘で使うほど回復量が落ちます。特技はTPを消費します。オート操作に切り替えると、自動で行動を選びます。戦闘中は0.75倍速、1倍速、1.5倍速、2倍速を切り替えられます。</p>
          <h3>スキルの種類</h3>
          <p>魔法は魔力と魔法防御、特技は技術と攻撃力が重要です。職業とレベルによって覚える魔法・特技が変わり、低レベルでは使えないものもあります。各キャラクターの能力欄と戦闘画面に、種類・消費MPまたは消費TP・効果を表示しています。</p>
          <h3>職業の違い</h3>
          <p>戦士や武闘家は特技型、魔法使いや賢者は魔法型、暗黒騎士は物理と魔法の混合型です。魔法職は通常攻撃が弱い代わりに、低レベルからMPなしの基礎魔法を使えるようにしています。</p>
          <h3>名前パターン</h3>
          <p>1人用の戦闘後に、元の名前の後ろへ短い記号を足した名前パターンが表示されます。別人の名前には変わりません。そのまま名前欄に入れると、そのレベルの強さとして1人用でも2人用でも使えます。</p>
          <h3>お金と能力の種</h3>
          <p>戦闘後には勝っても負けてもお金が手に入ります。結果画面の能力の種屋で、HP、MP、TP、攻撃力、防御力、魔力、魔法防御、技術、素早さ、運を少しずつ伸ばせます。種で伸ばした能力も、記号つきの名前パターンに含まれます。</p>
          <h3>音について</h3>
          <p>音はデフォルトでオンです。タイトル画面に入った時点でBGMの再生を試み、ブラウザ側で止められた時だけ最初の操作で再開します。戦闘では別のBGMと効果音に切り替わります。</p>
        </div>
      </section>
    </div>
  `;
}

function characterPreview(character) {
  const magic = availableMagic(character);
  const techniques = availableTechniques(character);
  return `
      <div class="preview-card">
      <div class="name-row"><span>${escapeHtml(character.name)}</span><span>レベル ${character.level}</span></div>
      <div class="job">${character.job.name} / ${character.job.role}</div>
      <p class="small-note">${character.job.note}</p>
      ${character.patternUsed ? `<p class="pattern-note">記号つきの名前パターンから呼び出しました。</p>` : ""}
      <div class="stat-grid">
        ${statItem("HP", character.stats.hp)}
        ${statItem("MP", character.stats.mp)}
        ${statItem("TP", character.stats.tp)}
        ${statItem("攻撃力", character.stats.attack)}
        ${statItem("防御力", character.stats.defense)}
        ${statItem("魔力", character.stats.magic)}
        ${statItem("魔法防御", character.stats.magicDefense)}
        ${statItem("技術", character.stats.technique)}
        ${statItem("素早さ", character.stats.speed)}
        ${statItem("運", character.stats.luck)}
      </div>
      <p class="pattern-note">次のレベルまで：${expToNext(character.level) - character.exp} 経験値</p>
      <div class="skill-info">
        <strong>覚えている魔法</strong>
        <span>${magic.length ? magic.map((ability) => `${ability.name}（${ability.type}${resourceText(ability)}）`).join("、") : "なし"}</span>
        <p>${magic.length ? magic.map((ability) => ability.effect).join(" / ") : "この職業またはレベルでは、まだ魔法を使えません。"}</p>
      </div>
      <div class="skill-info">
        <strong>覚えている特技</strong>
        <span>${techniques.length ? techniques.map((ability) => `${ability.name}（${ability.type}${resourceText(ability)}）`).join("、") : "なし"}</span>
        <p>${techniques.length ? techniques.map((ability) => ability.effect).join(" / ") : "この職業またはレベルでは、まだ特技を使えません。"}</p>
      </div>
      <div class="skill-info">
        <strong>パラメーターの見方</strong>
        <span>魔法はMP、特技はTPを使います</span>
        <p>魔法は魔力で威力が伸び、相手の魔法防御で軽減されます。特技は技術と攻撃力で威力が伸び、TPを消費します。職業によって、魔法型・特技型・混合型に分かれます。</p>
      </div>
    </div>
  `;
}

function soundButton() {
  return `<button class="sound-button ${state.audioOn ? "active" : "off"}" data-action="sound" aria-pressed="${state.audioOn ? "true" : "false"}">${state.audioOn ? "音 オン" : "音 オフ"}</button>`;
}

function statItem(label, value) {
  return `<div class="stat"><span>${label}</span><strong>${value}</strong></div>`;
}

function startGame() {
  ensureAudio("battle");
  playTone("confirm");
  try {
    if (!state.preview || (state.mode === "duel" && !state.previewTwo)) {
      decideNames();
      return;
    }
    const one = state.preview;
    if (state.mode === "solo") {
      state.player = one;
      const stageSelect = app.querySelector("#stage-select");
      state.stageIndex = stageSelect ? Number(stageSelect.value) : state.selectedStage;
      state.selectedStage = state.stageIndex;
      startBattle(cloneForBattle(state.player), cloneForBattle(STAGES[state.stageIndex]));
    } else {
      const two = state.previewTwo;
      state.player = one;
      state.second = two;
      startBattle(cloneForBattle(one), cloneForBattle(two));
    }
  } catch (error) {
    state.error = error.message;
    render();
  }
}

function startBattle(player, enemy) {
  ensureAudio("battle");
  state.screen = "battle";
  state.auto = false;
  state.busy = false;
  state.actionMenu = null;
  state.battle = {
    player,
    enemy,
    turn: player.stats.speed + player.stats.luck >= enemy.stats.speed + enemy.stats.luck ? "player" : "enemy",
    log: [],
    ended: false
  };
  playTone("encounter");
  logLine(`${player.displayName}が現れた。レベル ${player.level}、${player.job.name}。`, "player");
  logLine(`${enemy.displayName}が立ちはだかった。レベル ${enemy.level}、${enemy.job.name}。`, "enemy");
  render();
  if (state.battle.turn === "enemy") afterBattleDelay(enemyTurn, 900);
}

function renderBattle() {
  if (state.audioOn) startMusic("battle");
  const battle = state.battle;
  const magic = availableMagic(battle.player);
  const techniques = availableTechniques(battle.player);
  const turnLabel = battle.turn === "player" ? battleSideLabel("player") : battleSideLabel("enemy");
  const latestLog = battle.log[0] ? logEntryMarkup(battle.log[0], 0) : "";
  app.innerHTML = `
    <main class="shell battle">
      <header class="topbar">
        <div>
          <h1 class="title">NameBattler</h1>
          <p class="subtitle">${state.mode === "solo" ? `第${state.stageIndex + 1}ステージ` : "2人用対戦"}</p>
        </div>
        <div class="top-actions">
          <button class="icon-button" data-action="help" aria-label="遊び方を開く" title="遊び方">?</button>
          ${soundButton()}
          <div class="speed-control" aria-label="戦闘速度">
            ${BATTLE_SPEEDS.map((speed) => `<button class="${state.battleSpeed === speed ? "active" : ""}" data-speed="${speed}">${speed}倍速</button>`).join("")}
          </div>
          <button data-action="back">最初に戻る</button>
        </div>
      </header>
      <section class="stage">
        <div class="battle-header">
          <div class="battle-badge">${turnLabel}の番</div>
          <div class="battle-badge">${state.auto ? "オート操作中" : "マニュアル操作中"}</div>
        </div>
        <div class="fighters">
          ${fighterMarkup(battle.player, "player")}
          ${fighterMarkup(battle.enemy, "enemy")}
        </div>
        <div class="effect-layer"></div>
      </section>
      <div class="stage-message stage-message-bar">${latestLog}</div>
      <section class="hud">
        <div class="panel commands">
          <div class="toggle-row">
            <button class="${!state.auto ? "active" : ""}" data-action="manual">マニュアル操作</button>
            <button class="${state.auto ? "active" : ""}" data-action="auto">オート操作</button>
          </div>
          <div class="command-grid">
            <button data-command="attack" ${commandDisabled()}>通常攻撃</button>
            <button data-menu="magic" ${commandDisabled() || !magic.length ? "disabled" : ""}>魔法<span>${magic.length ? `${magic.length}種類` : "覚えていない"}</span></button>
            <button data-menu="technique" ${commandDisabled() || !techniques.length ? "disabled" : ""}>特技<span>${techniques.length ? `${techniques.length}種類` : "覚えていない"}</span></button>
            <button data-command="defend" ${commandDisabled()}>防御</button>
            <button data-command="wait" ${commandDisabled()}>様子を見る</button>
          </div>
        </div>
        <div class="panel skill-panel">
          <h2>スキル効果</h2>
          <p><strong>${battle.player.displayName}</strong>：魔法 ${magic.length}種類 / 特技 ${techniques.length}種類</p>
          <p><strong>${battle.enemy.displayName}</strong>：魔法 ${availableMagic(battle.enemy).length}種類 / 特技 ${availableTechniques(battle.enemy).length}種類</p>
        </div>
      </section>
      ${abilityMenuMarkup()}
      ${helpModal()}
    </main>
  `;
  bindBattle();
  if (battle.log[0]?.flash) battle.log[0].flash = false;
  if (state.auto && !state.busy && !battle.ended) scheduleAuto();
}

function battleSideLabel(side) {
  if (state.mode === "duel") return side === "player" ? "1P" : "2P";
  return side === "player" ? "あなた" : "敵";
}

function logEntryMarkup(entry, index) {
  const normalized = typeof entry === "string" ? { text: entry, side: "player", flash: false } : entry;
  const classes = [
    index === 0 ? "latest" : "",
    normalized.side === "enemy" ? "side-enemy" : "side-player",
    normalized.flash ? "flash" : ""
  ].filter(Boolean).join(" ");
  return `<p class="${classes}">${escapeHtml(normalized.text)}</p>`;
}

function commandDisabled() {
  const battle = state.battle;
  return state.busy || state.auto || battle.turn !== "player" || battle.ended ? "disabled" : "";
}

function fighterMarkup(character, side) {
  const hpRate = Math.max(0, character.currentHp / character.stats.hp) * 100;
  const mpRate = Math.max(0, character.currentMp / character.stats.mp) * 100;
  const tpRate = Math.max(0, character.currentTp / character.stats.tp) * 100;
  const spriteSheet = JOB_SPRITE_SHEETS[character.job.name] || JOB_SPRITE_SHEETS["戦士"];
  return `
    <div class="side ${side}">
      <div class="nameplate">
        <div class="name-row"><span>${escapeHtml(character.displayName)}</span><span>レベル ${character.level}</span></div>
        <div class="job">${character.job.name}</div>
        <div class="bar"><div class="fill hp-fill" style="width:${hpRate}%"></div></div>
        <div class="bar-text"><span>HP</span><span>${Math.max(0, character.currentHp)} / ${character.stats.hp}</span></div>
        <div class="bar"><div class="fill mp-fill" style="width:${mpRate}%"></div></div>
        <div class="bar-text"><span>MP</span><span>${Math.max(0, character.currentMp)} / ${character.stats.mp}</span></div>
        <div class="bar"><div class="fill tp-fill" style="width:${tpRate}%"></div></div>
        <div class="bar-text"><span>TP</span><span>${Math.max(0, character.currentTp)} / ${character.stats.tp}</span></div>
        ${effectBadges(character)}
      </div>
      <div class="sprite-wrap">
        <div class="shadow"></div>
        <div class="sprite job-sprite" data-sprite="${side}" style="--sprite-main:${character.tint};--sprite-dark:${character.dark};--sprite-aura:${character.aura};--job-sheet:url('${spriteSheet}')">
          <img class="sprite-loader" src="${spriteSheet}" alt="" aria-hidden="true" onload="this.parentElement.classList.add('loaded')" onerror="this.parentElement.classList.add('missing')">
          <div class="job-sheet"></div>
          <div class="aura"></div>
          <div class="head"></div>
          <div class="body"></div>
          <div class="arm left"></div>
          <div class="arm right"></div>
          <div class="leg left"></div>
          <div class="leg right"></div>
          <div class="weapon"></div>
        </div>
      </div>
    </div>
  `;
}

function effectBadges(character) {
  const entries = Object.entries(character.effects || {});
  if (!entries.length) return "";
  return `<div class="effect-badges">${entries.map(([key, effect]) => `<span class="${effect.amount > 0 ? "up" : "down"}">${STAT_LABELS[key]}${effect.amount > 0 ? "↑" : "↓"}</span>`).join("")}</div>`;
}

function bindBattle() {
  bindCommon();
  app.querySelector("[data-action='back']").addEventListener("click", () => {
    state.screen = "title";
    state.battle = null;
    state.result = null;
    render();
  });
  app.querySelector("[data-action='manual']").addEventListener("click", () => {
    state.auto = false;
    render();
  });
  app.querySelector("[data-action='auto']").addEventListener("click", () => {
    state.auto = true;
    render();
  });
  app.querySelectorAll("[data-speed]").forEach((button) => {
    button.addEventListener("click", () => {
      state.battleSpeed = Number(button.dataset.speed);
      render();
    });
  });
  app.querySelectorAll("[data-command]").forEach((button) => {
    button.addEventListener("click", () => playerAction(button.dataset.command));
  });
  app.querySelectorAll("[data-menu]").forEach((button) => {
    button.addEventListener("click", () => {
      state.actionMenu = state.actionMenu === button.dataset.menu ? null : button.dataset.menu;
      render();
    });
  });
  app.querySelectorAll("[data-ability]").forEach((button) => {
    button.addEventListener("click", () => {
      const list = button.dataset.abilityType === "magic" ? availableMagic(state.battle.player) : availableTechniques(state.battle.player);
      playerAction({ ability: list[Number(button.dataset.ability)] });
    });
  });
  app.querySelectorAll("[data-action='close-ability']").forEach((button) => {
    button.addEventListener("click", (event) => {
      if (event.target !== button && !button.classList.contains("ability-close")) return;
      state.actionMenu = null;
      render();
    });
  });
}

function abilityMenuMarkup() {
  if (!state.actionMenu || !state.battle || state.auto || state.battle.turn !== "player") return "";
  const list = state.actionMenu === "magic" ? availableMagic(state.battle.player) : availableTechniques(state.battle.player);
  const title = state.actionMenu === "magic" ? "魔法を選ぶ" : "特技を選ぶ";
  return `
    <div class="ability-popover-backdrop" data-action="close-ability">
      <section class="ability-popover" role="dialog" aria-modal="true" aria-label="${title}">
        <div class="ability-popover-head">
          <h2>${title}</h2>
          <button class="ability-close" data-action="close-ability" aria-label="閉じる">×</button>
        </div>
        <div class="ability-list">
      ${list.map((ability, index) => `
        <button data-ability-type="${state.actionMenu}" data-ability="${index}" ${state.busy || !hasResource(state.battle.player, ability) ? "disabled" : ""}>
          ${ability.name}
          <span>${ability.type}${resourceText(ability)}</span>
          <small>${ability.effect}</small>
        </button>
      `).join("")}
        </div>
      </section>
    </div>
  `;
}

function resourceText(ability) {
  if (!ability.cost) return " / 消費なし";
  return ability.kind === "technique" ? ` / 消費TP ${ability.cost}` : ` / 消費MP ${ability.cost}`;
}

function hasResource(character, ability) {
  return ability.kind === "technique" ? character.currentTp >= ability.cost : character.currentMp >= ability.cost;
}

function battleDelay(ms) {
  return Math.round(ms / ((state.battleSpeed || 1) * BATTLE_SPEED_BASE));
}

function afterBattleDelay(callback, ms) {
  setTimeout(callback, battleDelay(ms));
}

function logLine(text, side = state.battle.turn) {
  state.battle.log.unshift({ text, side, flash: true });
  state.battle.log = state.battle.log.slice(0, 12);
}

function scheduleAuto() {
  afterBattleDelay(() => {
    if (state.screen !== "battle" || !state.auto || state.busy || state.battle.ended) return;
    if (state.battle.turn === "player") {
      playerAction(pickAction(state.battle.player, state.battle.enemy));
    } else {
      enemyTurn();
    }
  }, 720);
}

function pickAction(actor, target) {
  const magic = availableMagic(actor).filter((ability) => actor.currentMp >= ability.cost);
  const techniques = availableTechniques(actor).filter((ability) => actor.currentTp >= ability.cost);
  const heals = magic.filter((ability) => ability.kind === "heal");
  const buffs = [...techniques, ...magic].filter((ability) => ability.kind === "buff");
  const debuffs = [...techniques, ...magic].filter((ability) => ability.kind === "debuff");
  const attacks = [...techniques.filter((ability) => ability.kind === "technique"), ...magic.filter((ability) => ability.kind === "magic")];
  const hpRate = actor.currentHp / actor.stats.hp;
  const targetHpRate = target.currentHp / target.stats.hp;
  const killMove = bestAttack(actor, target, attacks, true);
  if (killMove) return killMove;
  if (hpRate < 0.34) {
    if (heals.length && (actor.healUses || 0) < 3) return { ability: heals[heals.length - 1] };
    return "defend";
  }
  const urgentDebuff = bestDebuff(actor, target, debuffs);
  if (urgentDebuff && !target.effects?.[urgentDebuff.stat]) return { ability: urgentDebuff };
  const usefulBuff = bestBuff(actor, target, buffs);
  if (usefulBuff && !actor.effects?.[usefulBuff.stat] && (hpRate > 0.42 || usefulBuff.stat === "defense" || usefulBuff.stat === "magicDefense")) {
    return { ability: usefulBuff };
  }
  const attack = bestAttack(actor, target, attacks, false);
  if (attack && (targetHpRate > 0.25 || Math.random() < 0.75)) return attack;
  if (hpRate < 0.38 && Math.random() < 0.45) return "defend";
  return "attack";
}

function bestAttack(actor, target, attacks, onlyKill) {
  const candidates = ["attack", ...attacks.map((ability) => ({ ability }))].map((command) => {
    const ability = command.ability;
    const type = ability?.kind || "attack";
    const costBias = ability ? 1 - Math.min(0.22, (ability.cost || 0) / 260) : 1;
    const estimate = estimateDamage(actor, target, type, ability) * costBias;
    return { command, estimate };
  }).sort((a, b) => b.estimate - a.estimate);
  const best = candidates[0];
  if (!best) return null;
  if (onlyKill && best.estimate < target.currentHp) return null;
  return best.command;
}

function bestBuff(actor, target, buffs) {
  const wantsMagic = actor.stats.magic > actor.stats.attack;
  const priorities = [
    actor.currentHp < actor.stats.hp * 0.52 ? "defense" : null,
    actor.currentHp < actor.stats.hp * 0.52 ? "magicDefense" : null,
    wantsMagic ? "magic" : "attack"
  ].filter(Boolean);
  return priorities.map((stat) => buffs.find((ability) => ability.stat === stat)).find(Boolean) || null;
}

function bestDebuff(actor, target, debuffs) {
  const targetPhysical = target.stats.attack + target.stats.technique > target.stats.magic * 1.15;
  const targetFaster = effectiveStat(target, "speed") > effectiveStat(actor, "speed") + 6;
  const priorities = [
    targetFaster ? "speed" : null,
    targetPhysical ? "attack" : "magic"
  ].filter(Boolean);
  return priorities.map((stat) => debuffs.find((ability) => ability.stat === stat)).find(Boolean) || null;
}

function estimateDamage(actor, target, type, ability = null) {
  const power = ability?.power || 1;
  const attackSide = type === "magic"
    ? (effectiveStat(actor, "magic") * 1.05 + effectiveStat(actor, "luck") * 0.12) * power
    : type === "technique"
      ? (effectiveStat(actor, "technique") * 0.88 + effectiveStat(actor, "attack") * 0.5 + effectiveStat(actor, "speed") * 0.1) * power
    : effectiveStat(actor, "attack") * 0.9 + effectiveStat(actor, "luck") * 0.16;
  const defenseSide = type === "magic"
    ? effectiveStat(target, "magicDefense") * 0.78 + effectiveStat(target, "luck") * 0.16
    : effectiveStat(target, "defense") * 0.78 + effectiveStat(target, "luck") * 0.16;
  return Math.min(Math.max(1, attackSide - defenseSide), damageCap(target, type, Boolean(ability), false));
}

function playerAction(command) {
  if (state.busy || state.battle.turn !== "player" || state.battle.ended) return;
  performAction(state.battle.player, state.battle.enemy, command, () => {
    if (!checkEnd()) {
      state.battle.turn = "enemy";
      render();
      afterBattleDelay(enemyTurn, 900);
    }
  });
}

function enemyTurn() {
  if (!state.battle || state.busy || state.battle.ended) return;
  const command = pickAction(state.battle.enemy, state.battle.player);
  performAction(state.battle.enemy, state.battle.player, command, () => {
    if (!checkEnd()) {
      state.battle.turn = "player";
      render();
    }
  });
}

function performAction(actor, target, command, done) {
  state.busy = true;
  state.actionMenu = null;
  actor.defending = false;
  const action = command?.ability ? "ability" : command === "wait" ? "defend" : command;
  if (action === "defend") {
    actor.defending = true;
    logLine(`${actor.displayName}は身構えた。`);
    playTone("guard");
    showBattleText(actor === state.battle.player ? "player" : "enemy", "防御", "buff");
    afterBattleDelay(() => finishAction(done), 780);
    render();
    return;
  }

  if (action === "ability" && hasResource(actor, command.ability)) {
    const ability = command.ability;
    if (ability.kind === "technique") {
      actor.currentTp -= ability.cost;
    } else {
      actor.currentMp -= ability.cost;
    }
    if (ability.kind === "heal") {
      actor.healUses += 1;
      const baseHeal = (actor.stats.magic * 0.62 + actor.stats.magicDefense * 0.28 + actor.stats.luck * 0.16 + actor.level) * ability.power;
      const fatigue = Math.pow(0.68, actor.healUses - 1);
      const cap = actor.stats.hp * 0.28;
      const amount = Math.max(8, Math.round(Math.min(baseHeal * fatigue, cap)));
      actor.currentHp = Math.min(actor.stats.hp, actor.currentHp + amount);
      logLine(`${actor.displayName}の${ability.name}。聖なる光が傷を包み、HPが${amount}回復した。`);
      playTone("heal");
      showEffect(actor === state.battle.player ? "player" : "enemy", "heal");
      showBattleText(actor === state.battle.player ? "player" : "enemy", `+${amount}`, "heal");
      afterBattleDelay(() => finishAction(done), 1200);
      render();
      return;
    }
    if (ability.kind === "buff") {
      applyStatEffect(actor, ability);
      logLine(`${actor.displayName}の${ability.name}。${STAT_LABELS[ability.stat]}がしばらく上がった。`);
      playTone("status");
      showEffect(actor === state.battle.player ? "player" : "enemy", "heal");
      showBattleText(actor === state.battle.player ? "player" : "enemy", `${STAT_LABELS[ability.stat]}↑`, "buff");
      afterBattleDelay(() => finishAction(done), 1050);
      render();
      return;
    }
    if (ability.kind === "debuff") {
      applyStatEffect(target, ability);
      logLine(`${actor.displayName}の${ability.name}。${target.displayName}の${STAT_LABELS[ability.stat]}がしばらく下がった。`);
      playTone("status");
      showEffect(target === state.battle.player ? "player" : "enemy", "spell");
      showBattleText(target === state.battle.player ? "player" : "enemy", `${STAT_LABELS[ability.stat]}↓`, "debuff");
      afterBattleDelay(() => finishAction(done), 1150);
      render();
      return;
    }
    const result = calcDamage(actor, target, ability.kind, ability);
    if (result.missed) {
      logLine(`${actor.displayName}の${ability.name}。しかし${target.displayName}はかわした。`);
      playTone("miss");
      showBattleText(target === state.battle.player ? "player" : "enemy", "ミス", "miss");
    } else {
      target.currentHp -= result.damage;
      logLine(`${actor.displayName}の${ability.name}。${result.critical ? "会心の一撃。 " : ""}${target.displayName}に${result.damage}のダメージ。`);
      playTone(ability.kind === "magic" ? "magic" : "attack");
      setTimeout(() => playTone("damage"), battleDelay(90));
      showBattleText(target === state.battle.player ? "player" : "enemy", `${result.damage}`, result.critical ? "critical" : "damage");
    }
    if (result.critical) screenShake();
    if (ability.kind === "technique") flashSprite(actor, "attack");
    if (ability.kind === "magic") flashSprite(actor, "cast");
    showEffect(target === state.battle.player ? "player" : "enemy", ability.kind === "magic" ? "spell" : "slash");
    flashSprite(target, "hit");
    afterBattleDelay(() => finishAction(done), 1320);
    render();
    return;
  }

  if (action === "ability") {
    const resource = command.ability.kind === "technique" ? "TP" : "MP";
    logLine(`${actor.displayName}は力を解き放とうとしたが、${resource}が足りない。`);
    playTone("miss");
  }
  const result = calcDamage(actor, target, "attack");
  if (result.missed) {
    logLine(`${actor.displayName}の通常攻撃。しかし${target.displayName}は身をひるがえしてかわした。`);
    playTone("miss");
    showBattleText(target === state.battle.player ? "player" : "enemy", "ミス", "miss");
  } else {
    target.currentHp -= result.damage;
    logLine(`${actor.displayName}の通常攻撃。${result.critical ? "会心の一撃。 " : "刃が走り、"}${target.displayName}に${result.damage}のダメージ。`);
    playTone("attack");
    setTimeout(() => playTone("damage"), battleDelay(90));
    showBattleText(target === state.battle.player ? "player" : "enemy", `${result.damage}`, result.critical ? "critical" : "damage");
  }
  if (result.critical) screenShake();
  flashSprite(actor, "attack");
  flashSprite(target, "hit");
  showEffect(target === state.battle.player ? "player" : "enemy", "slash");
  afterBattleDelay(() => finishAction(done), 1120);
  render();
}

function finishAction(done) {
  const battle = state.battle;
  if (battle) {
    const actor = battle.turn === "player" ? battle.player : battle.enemy;
    tickEffects(actor);
  }
  state.busy = false;
  done();
}

function applyStatEffect(character, ability) {
  character.effects ||= {};
  const current = character.effects[ability.stat];
  if (!current || Math.abs(ability.amount) >= Math.abs(current.amount)) {
    character.effects[ability.stat] = { amount: ability.amount, turns: ability.duration || 3, fresh: true };
  } else {
    current.turns = Math.max(current.turns, ability.duration || 3);
    current.fresh = true;
  }
}

function tickEffects(character) {
  if (!character.effects) return;
  Object.keys(character.effects).forEach((key) => {
    const effect = character.effects[key];
    if (effect.fresh) {
      effect.fresh = false;
      return;
    }
    effect.turns -= 1;
    if (effect.turns <= 0) delete character.effects[key];
  });
}

function effectiveStat(character, key) {
  const effect = character.effects?.[key];
  const rate = effect ? 1 + effect.amount : 1;
  return Math.max(1, character.stats[key] * rate);
}

function calcDamage(actor, target, type, ability = null) {
  const random = rng(hashText(`${actor.id}:${target.id}:${Date.now()}:${Math.random()}`));
  const missRate = hitMissRate(actor, target, type);
  if (random() < missRate) return { damage: 0, missed: true, critical: false };
  const power = ability?.power || 1;
  const attackSide = type === "magic"
    ? (effectiveStat(actor, "magic") * 1.05 + effectiveStat(actor, "luck") * 0.12) * power
    : type === "technique"
      ? (effectiveStat(actor, "technique") * 0.88 + effectiveStat(actor, "attack") * 0.5 + effectiveStat(actor, "speed") * 0.1) * power
    : effectiveStat(actor, "attack") * 0.9 + effectiveStat(actor, "luck") * 0.16;
  const guardRate = target.defending ? 1.28 : 0.78;
  const defenseSide = type === "magic"
    ? effectiveStat(target, "magicDefense") * guardRate + effectiveStat(target, "luck") * 0.16
    : effectiveStat(target, "defense") * guardRate + effectiveStat(target, "luck") * 0.16;
  const critical = random() < clamp(effectiveStat(actor, "luck") / (effectiveStat(target, "luck") * 12 + 260), 0.03, 0.18);
  const variance = 0.9 + random() * 0.2;
  const raw = Math.max(1, (attackSide - defenseSide) * variance);
  const capped = Math.min(raw * (critical ? 1.45 : 1), damageCap(target, type, Boolean(ability), critical));
  return { damage: Math.max(1, Math.round(capped)), missed: false, critical };
}

function damageCap(target, type, isAbility, critical) {
  const baseRate = type === "attack" ? 0.3 : isAbility ? 0.42 : 0.34;
  const criticalBonus = critical ? 0.08 : 0;
  return Math.max(12, target.stats.hp * (baseRate + criticalBonus));
}

function hitMissRate(actor, target, type) {
  const speedDiff = effectiveStat(target, "speed") - effectiveStat(actor, "speed");
  const luckDiff = effectiveStat(target, "luck") - effectiveStat(actor, "luck");
  const base = type === "magic" ? 0.025 : type === "technique" ? 0.045 : 0.06;
  const rate = base + speedDiff * 0.0022 + luckDiff * 0.0012;
  const max = type === "magic" ? 0.14 : type === "technique" ? 0.2 : 0.24;
  return clamp(rate, 0.02, max);
}

function checkEnd() {
  const battle = state.battle;
  if (battle.player.currentHp > 0 && battle.enemy.currentHp > 0) return false;
  battle.ended = true;
  state.auto = false;
  const playerWon = battle.enemy.currentHp <= 0;
  playTone(playerWon ? "win" : "down");
  afterBattleDelay(() => finishBattle(playerWon), 1100);
  return true;
}

function finishBattle(playerWon) {
  const battle = state.battle;
  if (state.mode === "solo") {
    if (playerWon) {
      const outcome = awardExp(state.player, battle.enemy, state.stageIndex);
      const gold = battle.enemy.goldReward || Math.round(70 + battle.enemy.level * 6);
      state.player.gold = (state.player.gold || 0) + gold;
      const clearedFinal = state.stageIndex >= STAGES.length - 1;
      state.result = {
        won: true,
        title: clearedFinal ? "全ステージ制覇" : "勝利",
        levelUp: outcome.levels > 0 ? outcome : null,
        gold,
        lines: [
          `${battle.enemy.displayName}を倒した。`,
          `獲得経験値：${outcome.gained}`,
          `獲得したお金：${gold}`,
          `次のレベルまで：${expToNext(state.player.level) - state.player.exp} 経験値`,
          `この強さの${state.player.name}は、下の名前パターンで呼び出せます。`
        ],
        code: makeNamePattern(state.player),
        next: clearedFinal ? "menu" : "next"
      };
      if (!clearedFinal) state.stageIndex += 1;
    } else {
      const gold = Math.max(18, Math.round((battle.enemy.goldReward || 60) * 0.28));
      state.player.gold = (state.player.gold || 0) + gold;
      fullHeal(state.player);
      state.result = {
        won: false,
        title: "敗北",
        levelUp: null,
        gold,
        lines: [
          `${battle.enemy.displayName}に倒された。`,
          `獲得したお金：${gold}`,
          `次のレベルまで：${expToNext(state.player.level) - state.player.exp} 経験値`,
          "傷は癒えた。今の強さは、元の名前に記号を足した名前パターンで残せる。"
        ],
        code: makeNamePattern(state.player),
        next: "retry"
      };
    }
  } else {
    state.result = {
      won: playerWon,
      title: playerWon ? `${battle.player.displayName}の勝利` : `${battle.enemy.displayName}の勝利`,
      levelUp: null,
      lines: ["名前に宿る運命が決着を告げた。"],
      code: null,
      next: "duelRetry"
    };
  }
  state.screen = "result";
  render();
  showResultFlash();
}

function renderResult() {
  if (state.audioOn) startMusic("menu");
  const result = state.result;
  app.innerHTML = `
    <main class="shell">
      <header class="topbar">
        <div>
          <h1 class="title">NameBattler</h1>
          <p class="subtitle">${result.title}</p>
        </div>
        <div class="top-actions">
          <button class="icon-button" data-action="help" aria-label="遊び方を開く" title="遊び方">?</button>
          ${soundButton()}
        </div>
      </header>
      <section class="panel result">
        <h2>${result.title}</h2>
        ${result.levelUp ? levelUpMarkup(result.levelUp) : ""}
        ${result.lines.map((line) => `<p>${escapeHtml(line)}</p>`).join("")}
        ${result.code ? `
          <div>
            <div class="small-note">この強さになる名前パターン</div>
            <div class="code-box">${escapeHtml(result.code)}</div>
            <button data-action="copy-code">コピー</button>
          </div>
        ` : ""}
        <div class="start-row">
          ${result.next === "next" ? `<button class="primary" data-action="next">次のステージへ</button>` : ""}
          ${result.next === "retry" ? `<button class="primary" data-action="retry">再戦する</button>` : ""}
          ${result.next === "duelRetry" ? `<button class="primary" data-action="duel-retry">再戦する</button>` : ""}
          ${state.mode === "solo" && state.player ? `<button data-action="shop">ショップへ</button>` : ""}
          <button data-action="menu">タイトルへ戻る</button>
        </div>
      </section>
      ${helpModal()}
    </main>
  `;
  bindCommon();
  app.querySelector("[data-action='menu']").addEventListener("click", () => {
    playTone("confirm");
    state.screen = "title";
    state.result = null;
    state.battle = null;
    render();
  });
  const next = app.querySelector("[data-action='next']");
  if (next) {
    next.addEventListener("click", () => {
      playTone("confirm");
      startBattle(cloneForBattle(state.player), cloneForBattle(STAGES[state.stageIndex]));
    });
  }
  const retry = app.querySelector("[data-action='retry']");
  if (retry) {
    retry.addEventListener("click", () => {
      playTone("confirm");
      startBattle(cloneForBattle(state.player), cloneForBattle(STAGES[state.stageIndex]));
    });
  }
  const duelRetry = app.querySelector("[data-action='duel-retry']");
  if (duelRetry) {
    duelRetry.addEventListener("click", () => {
      playTone("confirm");
      startBattle(cloneForBattle(state.player), cloneForBattle(state.second));
    });
  }
  const shop = app.querySelector("[data-action='shop']");
  if (shop) {
    shop.addEventListener("click", () => {
      playTone("select");
      state.screen = "shop";
      render();
    });
  }
  const copy = app.querySelector("[data-action='copy-code']");
  if (copy) {
    copy.addEventListener("click", async () => {
      await copyText(state.result.code);
      playTone("confirm");
      copy.textContent = "コピー済み";
      setTimeout(() => {
        copy.textContent = "コピー";
      }, 1200);
    });
  }
}

function seedShopMarkup() {
  return `
    <div class="seed-shop">
      <div class="seed-shop-head">
        <div>
          <strong>能力の種屋</strong>
          <span>今のお金：${state.player.gold || 0}</span>
        </div>
        <p>個体差で低めに出た名前でも、戦闘後のお金で能力を底上げできます。</p>
      </div>
      ${state.result.shopMessage ? `<p class="shop-message">${escapeHtml(state.result.shopMessage)}</p>` : ""}
      <div class="seed-grid">
        ${SEED_SHOP.map((item) => `
          <button data-seed="${item.key}" ${(state.player.gold || 0) < seedPrice(item) ? "disabled" : ""}>
            <strong>${item.name}</strong>
            <span>${item.description}</span>
            <em>${seedPrice(item)} G</em>
          </button>
        `).join("")}
      </div>
    </div>
  `;
}

function renderShop() {
  if (state.audioOn) startMusic("menu");
  app.innerHTML = `
    <main class="shell">
      <header class="topbar">
        <div>
          <h1 class="title">NameBattler</h1>
          <p class="subtitle">能力の種屋</p>
        </div>
        <div class="top-actions">
          <button class="icon-button" data-action="help" aria-label="遊び方を開く" title="遊び方">?</button>
          ${soundButton()}
        </div>
      </header>
      <section class="panel result shop-screen">
        <h2>ショップ</h2>
        ${state.player ? characterPreview(state.player) : ""}
        ${seedShopMarkup()}
        ${state.result?.code ? `
          <div>
            <div class="small-note">この強さになる名前パターン</div>
            <div class="code-box">${escapeHtml(state.result.code)}</div>
            <button data-action="copy-code">コピー</button>
          </div>
        ` : ""}
        <div class="start-row">
          ${state.result?.next === "next" ? `<button class="primary" data-action="next">次のステージへ</button>` : ""}
          ${state.result?.next === "retry" ? `<button class="primary" data-action="retry">再戦する</button>` : ""}
          <button data-action="back-result">結果へ戻る</button>
          <button data-action="menu">タイトルへ戻る</button>
        </div>
      </section>
      ${helpModal()}
    </main>
  `;
  bindCommon();
  bindResultNavigation();
  app.querySelector("[data-action='back-result']").addEventListener("click", () => {
    playTone("select");
    state.screen = "result";
    render();
  });
  app.querySelectorAll("[data-seed]").forEach((button) => {
    button.addEventListener("click", () => buySeed(button.dataset.seed));
  });
  const copy = app.querySelector("[data-action='copy-code']");
  if (copy) {
    copy.addEventListener("click", async () => {
      await copyText(state.result.code);
      playTone("confirm");
      copy.textContent = "コピー済み";
      setTimeout(() => {
        copy.textContent = "コピー";
      }, 1200);
    });
  }
}

function bindResultNavigation() {
  const menu = app.querySelector("[data-action='menu']");
  if (menu) {
    menu.addEventListener("click", () => {
      playTone("confirm");
      state.screen = "title";
      state.result = null;
      state.battle = null;
      render();
    });
  }
  const next = app.querySelector("[data-action='next']");
  if (next) {
    next.addEventListener("click", () => {
      playTone("confirm");
      startBattle(cloneForBattle(state.player), cloneForBattle(STAGES[state.stageIndex]));
    });
  }
  const retry = app.querySelector("[data-action='retry']");
  if (retry) {
    retry.addEventListener("click", () => {
      playTone("confirm");
      startBattle(cloneForBattle(state.player), cloneForBattle(STAGES[state.stageIndex]));
    });
  }
}

function seedPrice(item) {
  const level = clamp(state.player?.level || 1, 1, 999);
  const levelMultiplier = 1 + (level - 1) * 0.035 + Math.floor((level - 1) / 10) * 0.08;
  return Math.round(item.price * levelMultiplier);
}

function buySeed(key) {
  const item = SEED_SHOP.find((seed) => seed.key === key);
  if (!item || !state.player) return;
  const price = seedPrice(item);
  if ((state.player.gold || 0) < price) {
    state.result.shopMessage = "お金が足りません。";
    playTone("miss");
    render();
    return;
  }
  state.player.gold -= price;
  state.player.seedBoosts ||= {};
  state.player.seedBoosts[item.key] = (state.player.seedBoosts[item.key] || 0) + item.gain;
  state.player.stats[item.key] += item.gain;
  fullHeal(state.player);
  state.result.code = makeNamePattern(state.player);
  state.result.shopMessage = `${item.name}を使った。${STAT_LABELS[item.key]}が${item.gain}上がった。`;
  playTone("shop");
  render();
}

function levelUpMarkup(levelUp) {
  const magic = levelUp.learned.filter((ability) => ability.kind === "magic" || ability.kind === "heal" || ability.kind === "buff");
  const techniques = levelUp.learned.filter((ability) => ability.kind === "technique");
  return `
    <div class="level-up-card">
      <div class="level-up-aura"></div>
      <div class="level-up-label">レベルアップ</div>
      <div class="level-up-main">+${levelUp.levels}</div>
      <div class="level-up-sub">レベル ${levelUp.beforeLevel} → ${levelUp.afterLevel}</div>
      <div class="level-up-details">
        <div class="level-stat-list">
          ${Object.entries(STAT_LABELS).map(([key, label]) => levelStatRow(label, levelUp.beforeStats[key], levelUp.afterStats[key])).join("")}
        </div>
        <div class="learned-list">
          <strong>新しく覚えた魔法</strong>
          <span>${magic.length ? magic.map((ability) => `${ability.name}（${ability.type}）`).join("、") : "なし"}</span>
          <strong>新しく覚えた特技</strong>
          <span>${techniques.length ? techniques.map((ability) => `${ability.name}（${ability.type}）`).join("、") : "なし"}</span>
        </div>
      </div>
    </div>
  `;
}

function levelStatRow(label, before, after) {
  const diff = after - before;
  return `
    <div class="level-stat-row">
      <span>${label}</span>
      <strong>${before} → ${after}</strong>
      <em>+${diff}</em>
    </div>
  `;
}

function showEffect(side, type) {
  requestAnimationFrame(() => {
    const layer = document.querySelector(".effect-layer");
    const target = document.querySelector(`[data-sprite="${side}"]`);
    if (!layer || !target) return;
    const layerRect = layer.getBoundingClientRect();
    const rect = target.getBoundingClientRect();
    const effect = document.createElement("div");
    effect.className = type;
    effect.style.left = `${rect.left - layerRect.left + rect.width / 2 - 85}px`;
    effect.style.top = `${rect.top - layerRect.top + rect.height / 2 - 75}px`;
    layer.appendChild(effect);
    if (type === "slash" || type === "spell") {
      const impact = document.createElement("div");
      impact.className = "impact";
      impact.style.left = `${rect.left - layerRect.left + rect.width / 2 - 82}px`;
      impact.style.top = `${rect.top - layerRect.top + rect.height / 2 - 82}px`;
      layer.appendChild(impact);
      setTimeout(() => impact.remove(), 900);
      for (let i = 0; i < 10; i += 1) {
        const spark = document.createElement("div");
        spark.className = "spark";
        spark.style.left = `${rect.left - layerRect.left + rect.width / 2}px`;
        spark.style.top = `${rect.top - layerRect.top + rect.height / 2}px`;
        spark.style.setProperty("--rot", `${i * 36}deg`);
        spark.style.setProperty("--x", `${Math.cos(i / 10 * Math.PI * 2) * 105}px`);
        spark.style.setProperty("--y", `${Math.sin(i / 10 * Math.PI * 2) * 78}px`);
        layer.appendChild(spark);
        setTimeout(() => spark.remove(), 900);
      }
    }
    setTimeout(() => effect.remove(), 1000);
  });
}

function showBattleText(side, text, kind) {
  requestAnimationFrame(() => {
    const layer = document.querySelector(".effect-layer");
    const target = document.querySelector(`[data-sprite="${side}"]`);
    if (!layer || !target) return;
    const layerRect = layer.getBoundingClientRect();
    const rect = target.getBoundingClientRect();
    const popup = document.createElement("div");
    popup.className = `float-text ${kind}`;
    popup.textContent = text;
    popup.style.left = `${rect.left - layerRect.left + rect.width / 2}px`;
    popup.style.top = `${rect.top - layerRect.top + rect.height * 0.22}px`;
    layer.appendChild(popup);
    setTimeout(() => popup.remove(), battleDelay(1050));
  });
}

function screenShake() {
  requestAnimationFrame(() => {
    const stage = document.querySelector(".stage");
    if (!stage) return;
    stage.classList.remove("shake");
    void stage.offsetWidth;
    stage.classList.add("shake");
  });
}

function flashSprite(character, className) {
  requestAnimationFrame(() => {
    const side = character === state.battle.player ? "player" : "enemy";
    const sprite = document.querySelector(`[data-sprite="${side}"]`);
    if (!sprite) return;
    sprite.classList.remove(className);
    void sprite.offsetWidth;
    sprite.classList.add(className);
  });
}

function showResultFlash() {
  requestAnimationFrame(() => {
    const main = document.querySelector(".shell");
    if (!main) return;
    const flash = document.createElement("div");
    flash.className = "level-flash";
    document.body.appendChild(flash);
    setTimeout(() => flash.remove(), 1000);
  });
}

function ensureAudio(mode = state.screen === "battle" ? "battle" : "menu") {
  if (!state.audioOn) return;
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;
  if (!state.audio) {
    state.audio = new AudioContext();
    state.audioReady = true;
  }
  if (state.audio.state === "suspended") {
    state.audio.resume();
  }
}

function loadAudioPrefs() {
  try {
    const raw = localStorage.getItem(AUDIO_PREFS_KEY);
    if (!raw) return;
    const prefs = JSON.parse(raw);
    if (typeof prefs.audioOn === "boolean") state.audioOn = prefs.audioOn;
    if (prefs.audioUnlocked) state.audioUnlocked = true;
  } catch {}
}

function saveAudioPrefs() {
  try {
    localStorage.setItem(AUDIO_PREFS_KEY, JSON.stringify({
      audioOn: state.audioOn,
      audioUnlocked: state.audioUnlocked
    }));
  } catch {}
}

function toggleAudio() {
  state.audioOn = !state.audioOn;
  if (state.audioOn) {
    ensureAudio();
    startMusic(currentMusicMode());
  } else {
    stopMusic();
  }
  saveAudioPrefs();
  render();
}

function startMusic(mode = "menu") {
  if (!state.audioOn) return;
  if (state.musicTrack && state.musicMode === mode && !state.musicTrack.paused) return;
  stopMusic();
  state.musicMode = mode;
  const track = new Audio(MUSIC_TRACKS[mode] || MUSIC_TRACKS.menu);
  track.loop = true;
  track.autoplay = true;
  track.preload = "auto";
  track.playsInline = true;
  track.volume = MUSIC_VOLUMES[mode] || MUSIC_VOLUMES.menu;
  state.musicTrack = track;
  track.play().then(() => {
    state.audioUnlocked = true;
    saveAudioPrefs();
  }).catch(() => {
    if (state.musicTrack === track) state.musicTrack = null;
    armMusicRetry(mode);
  });
}

function stopMusic() {
  if (state.musicTrack) {
    state.musicTrack.pause();
    state.musicTrack.currentTime = 0;
  }
  state.musicTrack = null;
  state.musicMode = null;
}

function currentMusicMode() {
  return state.screen === "battle" ? "battle" : "menu";
}

function armMusicRetry(mode) {
  if (state.musicRetryArmed) return;
  state.musicRetryArmed = true;
  const retry = () => {
    state.musicRetryArmed = false;
    document.removeEventListener("pointerdown", retry);
    document.removeEventListener("keydown", retry);
    state.audioUnlocked = true;
    saveAudioPrefs();
    if (state.audioOn) {
      ensureAudio(mode || currentMusicMode());
      startMusic(mode || currentMusicMode());
    }
  };
  document.addEventListener("pointerdown", retry, { once: true });
  document.addEventListener("keydown", retry, { once: true });
}

function playSample(kind) {
  const src = SFX_TRACKS[kind];
  if (!state.audioOn || !src) return false;
  const sample = new Audio(src);
  sample.preload = "auto";
  sample.volume = SFX_VOLUMES[kind] || 0.42;
  sample.play().then(() => {
    state.audioUnlocked = true;
    saveAudioPrefs();
  }).catch(() => {});
  return true;
}

function tone(freq, duration, type, volume) {
  if (!state.audioOn || !state.audio) return;
  const ctx = state.audio;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0.0001, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(volume, ctx.currentTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
  osc.connect(gain).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + duration + 0.02);
}

function playTone(kind) {
  if (!state.audioOn) return;
  if (playSample(kind)) return;
  ensureAudio(state.screen === "battle" ? "battle" : "menu");
  if (!state.audioReady) return;
  if (kind === "attack") {
    tone(660, 0.08, "square", 0.09);
    setTimeout(() => tone(240, 0.08, "sawtooth", 0.06), 70);
  } else if (kind === "magic") {
    [392, 523.25, 783.99].forEach((freq, index) => setTimeout(() => tone(freq, 0.16, "triangle", 0.08), index * 55));
  } else if (kind === "heal") {
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, index) => setTimeout(() => tone(freq, 0.13, "sine", 0.065), index * 65));
  } else if (kind === "guard") {
    tone(180, 0.12, "triangle", 0.055);
  } else if (kind === "win") {
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, index) => setTimeout(() => tone(freq, 0.18, "square", 0.075), index * 105));
  } else if (kind === "down") {
    [196, 164.81, 130.81].forEach((freq, index) => setTimeout(() => tone(freq, 0.2, "sawtooth", 0.055), index * 120));
  }
}

async function copyText(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const input = document.createElement("textarea");
  input.value = text;
  input.style.position = "fixed";
  input.style.opacity = "0";
  document.body.appendChild(input);
  input.select();
  document.execCommand("copy");
  input.remove();
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function escapeAttr(value) {
  return escapeHtml(value);
}

loadAudioPrefs();
render();
