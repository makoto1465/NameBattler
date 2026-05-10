"use strict";

const app = document.querySelector("#app");

const SYMBOLS = ["◆", "◇", "●", "○", "★", "☆", "▲", "△", "■", "□", "▼", "▽", "✦", "✧", "※", "◎"];
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

const MAGIC_BOOK = [
  { name: "魔力弾", minLevel: 1, jobs: ["魔法使い", "僧侶", "賢者", "暗黒騎士"], cost: 0, kind: "magic", power: 1.12, type: "攻撃魔法", effect: "MPなしで撃てる基礎魔法。魔法職の通常攻撃代わりになる" },
  { name: "火炎弾", minLevel: 5, jobs: ["魔法使い", "賢者", "暗黒騎士"], cost: 8, kind: "magic", power: 1.0, type: "攻撃魔法", effect: "魔力で火球を放つ基本魔法" },
  { name: "魔力集中", minLevel: 10, jobs: ["魔法使い", "僧侶", "賢者"], cost: 6, kind: "buff", power: 1.0, type: "補助魔法", effect: "身構えて次の被ダメージを抑える補助魔法" },
  { name: "癒しの光", minLevel: 8, jobs: ["僧侶", "賢者"], cost: 18, kind: "heal", power: 0.82, type: "回復魔法", effect: "HPを少し回復する。同じ戦闘で使うほど効果低下" },
  { name: "黒雷", minLevel: 18, jobs: ["魔法使い", "賢者", "暗黒騎士"], cost: 16, kind: "magic", power: 1.34, type: "攻撃魔法", effect: "魔力を中心にした雷撃ダメージ" },
  { name: "聖光再生", minLevel: 24, jobs: ["僧侶", "賢者"], cost: 28, kind: "heal", power: 1.12, type: "回復魔法", effect: "HPを大きく回復するが消費MPが重い" },
  { name: "冥王炎", minLevel: 34, jobs: ["暗黒騎士", "魔法使い"], cost: 24, kind: "magic", power: 1.62, type: "攻撃魔法", effect: "魔力と攻撃力を混ぜた闇炎ダメージ" },
  { name: "星詠み", minLevel: 48, jobs: ["賢者"], cost: 32, kind: "magic", power: 1.92, type: "攻撃魔法", effect: "高い魔法防御も貫きやすい星光魔法" }
];

const TECHNIQUE_BOOK = [
  { name: "けん制", minLevel: 1, jobs: ["盗賊", "忍者", "魔法使い", "僧侶", "賢者"], cost: 0, kind: "technique", power: 0.72, type: "特技", effect: "技術で相手の隙を突く軽い特技" },
  { name: "強打", minLevel: 1, jobs: ["戦士", "武闘家", "暗黒騎士"], cost: 0, kind: "technique", power: 0.92, type: "特技", effect: "技術と攻撃力で打ち込む基本特技" },
  { name: "影縫い", minLevel: 7, jobs: ["忍者", "盗賊"], cost: 4, kind: "technique", power: 1.08, type: "特技", effect: "技術と素早さを乗せた一撃" },
  { name: "竜牙連撃", minLevel: 15, jobs: ["武闘家", "忍者"], cost: 8, kind: "technique", power: 1.34, type: "特技", effect: "低燃費で連続攻撃を叩き込む" },
  { name: "覇王斬", minLevel: 22, jobs: ["戦士", "暗黒騎士"], cost: 10, kind: "technique", power: 1.56, type: "特技", effect: "攻撃力と技術を合わせた重い斬撃" },
  { name: "運命強奪", minLevel: 30, jobs: ["盗賊"], cost: 10, kind: "technique", power: 1.42, type: "特技", effect: "運の高さも乗る奇襲ダメージ" },
  { name: "無双乱舞", minLevel: 45, jobs: ["武闘家", "忍者"], cost: 16, kind: "technique", power: 1.86, type: "特技", effect: "技術が高いほど伸びる上級特技" }
];

const STAGES = [
  makeEnemy("影の見習い", "盗賊", 1, 62),
  makeEnemy("草原の番兵", "戦士", 4, 76),
  makeEnemy("古城の剣士", "戦士", 8, 92),
  makeEnemy("月読の僧兵", "僧侶", 13, 102),
  makeEnemy("黒衣の術士", "魔法使い", 19, 116),
  makeEnemy("疾風の刃", "忍者", 27, 132),
  makeEnemy("竜骨の武人", "武闘家", 38, 154),
  makeEnemy("虚無の賢者", "賢者", 54, 182),
  makeEnemy("終焉の暗黒王", "暗黒騎士", 74, 220)
];

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
  audioOn: true,
  audioReady: false,
  audio: null,
  musicTimer: null,
  musicMode: null
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
  values.push(hashText(`${character.name}:名前パターン:${level}`) & 15);
  return `${character.name}${values.map((value) => SYMBOLS[value]).join("")}`;
}

function rareLevelFromName(name) {
  const baseRoll = unitHash(name, "NameBattler-level-v3");
  const omenRoll = unitHash(name, "NameBattler-level-omen-v3");
  const base = baseRoll < 0.5
    ? Math.round(1 + 19 * Math.pow(baseRoll / 0.5, 0.34))
    : Math.round(20 + 79 * Math.pow((baseRoll - 0.5) / 0.5, 2.2));
  if (omenRoll > 0.992) return clamp(base + 38, 1, 99);
  if (omenRoll > 0.972) return clamp(base + 18, 1, 99);
  if (omenRoll < 0.026) return clamp(base - 5, 1, 99);
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

  character.patternUsed = pattern.ok;
  character.currentHp = character.stats.hp;
  character.currentMp = character.stats.mp;
  character.currentTp = character.stats.tp;
  return character;
}

function buildStats(character, spike) {
  const random = rng(character.seed ^ (character.level * 2654435761));
  const j = character.job;
  const level = character.level;
  const nature = character.baseNature;
  const calc = (base, growth, jobRate, key) => {
    const focusBoost = character.focus === key ? spike : 1;
    const wobble = 0.86 + random() * 0.32;
    return Math.max(1, Math.round((base + level * growth) * jobRate * nature * focusBoost * wobble));
  };
  return {
    hp: calc(42, 8.3, j.hp, "hp"),
    mp: calc(14, 3.7, j.mp, "mp"),
    tp: calc(12, 3.0, j.tp, "tp"),
    attack: calc(9, 2.45, j.attack, "attack"),
    defense: calc(8, 2.18, j.defense, "defense"),
    magic: calc(8, 2.35, j.magic, "magic"),
    magicDefense: calc(7, 2.1, j.magicDefense, "magicDefense"),
    technique: calc(7, 2.25, j.technique, "technique"),
    speed: calc(7, 2.05, j.speed, "speed"),
    luck: calc(5, 1.8, j.luck, "luck")
  };
}

function makeEnemy(name, jobName, level, power) {
  const job = JOBS.find((item) => item.name === jobName) || JOBS[0];
  const seed = hashText(`${name}:${level}`);
  const random = rng(seed);
  const factor = power / 100;
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
    baseNature: factor,
    focus: "attack"
  };
  enemy.stats = {
    hp: Math.round((64 + level * 9.6) * factor * job.hp),
    mp: Math.round((18 + level * 4.4) * factor * job.mp),
    tp: Math.round((16 + level * 3.6) * factor * job.tp),
    attack: Math.round((12 + level * 2.8) * factor * job.attack),
    defense: Math.round((10 + level * 2.45) * factor * job.defense),
    magic: Math.round((10 + level * 2.65) * factor * job.magic),
    magicDefense: Math.round((9 + level * 2.25) * factor * job.magicDefense),
    technique: Math.round((9 + level * 2.45) * factor * job.technique),
    speed: Math.round((8 + level * 2.25) * factor * job.speed),
    luck: Math.round((6 + level * 1.95) * factor * job.luck)
  };
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
    currentHp: character.stats.hp,
    currentMp: character.stats.mp,
    currentTp: character.stats.tp,
    defending: false,
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
    .map((ability) => ability.name);
}

function fullHeal(character) {
  character.currentHp = character.stats.hp;
  character.currentMp = character.stats.mp;
  character.currentTp = character.stats.tp;
}

function expToNext(level) {
  return Math.round(80 + level * level * 16);
}

function awardExp(player, enemy, stageIndex) {
  const enemyPower = enemy.stats.hp + enemy.stats.attack * 8 + enemy.stats.magic * 7 + enemy.stats.technique * 6 + enemy.stats.defense * 5 + enemy.stats.magicDefense * 4;
  const gained = Math.round(enemy.level * 42 + enemyPower / 5 + stageIndex * 55);
  const before = player.level;
  const learned = [];
  player.exp += gained;
  while (player.level < 999 && player.exp >= expToNext(player.level)) {
    player.exp -= expToNext(player.level);
    player.level += 1;
    learned.push(...learnedAbilitiesAtLevel(player, player.level));
    player.stats = buildStats(player, player.spike || 1);
  }
  fullHeal(player);
  return { gained, levels: player.level - before, learned };
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
  renderSetup();
}

function renderTitle() {
  if (state.audioReady && state.audioOn) startMusic("menu");
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
    ensureAudio("menu");
    state.screen = "mode";
    state.preview = null;
    state.previewTwo = null;
    render();
  });
}

function renderModeSelect() {
  if (state.audioReady && state.audioOn) startMusic("menu");
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
  if (state.audioReady && state.audioOn) startMusic("menu");
  const nameOneValue = document.querySelector("#name-one")?.value || "";
  const nameTwoValue = document.querySelector("#name-two")?.value || "";
  const hasDecision = Boolean(state.preview && (state.mode === "solo" || state.previewTwo));
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
              ${hasDecision ? `<button data-action="start">戦いを始める</button>` : ""}
            </div>
            <div class="error">${state.error}</div>
            <p class="small-note">名前を決定すると能力が現れます。戦闘後に表示される短い記号つきの名前パターンは、1人用でも2人用でもそのまま使えます。</p>
          </div>
        </div>
        <aside class="panel preview">
          <h2>呼び出された能力</h2>
          ${state.preview ? characterPreview(state.preview) : `<p class="small-note">名前を入力して「決定」を押すと、職業と能力が表示されます。</p>`}
          ${state.previewTwo ? characterPreview(state.previewTwo) : ""}
        </aside>
      </section>
      ${helpModal()}
    </main>
  `;
  bindSetup();
}

function bindSetup() {
  app.querySelector("[data-action='back-mode']").addEventListener("click", () => {
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
      state.selectedStage = Number(stageSelect.value);
    });
  }
  app.querySelector("[data-action='decide']").addEventListener("click", decideNames);
  const start = app.querySelector("[data-action='start']");
  if (start) start.addEventListener("click", startGame);
}

function decideNames() {
  ensureAudio("menu");
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
      modal.hidden = false;
      modal.querySelector("[data-action='close-help']").focus();
    });
    modal.addEventListener("click", (event) => {
      if (event.target === modal || event.target.closest("[data-action='close-help']")) {
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
          <p>マニュアル操作では、通常攻撃、魔法、特技、防御、様子を見るを選べます。回復魔法は強力ですが消費MPが大きく、同じ戦闘で使うほど回復量が落ちます。特技はTPを消費します。オート操作に切り替えると、自動で行動を選びます。</p>
          <h3>スキルの種類</h3>
          <p>魔法は魔力と魔法防御、特技は技術と攻撃力が重要です。職業とレベルによって覚える魔法・特技が変わり、低レベルでは使えないものもあります。各キャラクターの能力欄と戦闘画面に、種類・消費MPまたは消費TP・効果を表示しています。</p>
          <h3>職業の違い</h3>
          <p>戦士や武闘家は特技型、魔法使いや賢者は魔法型、暗黒騎士は物理と魔法の混合型です。魔法職は通常攻撃が弱い代わりに、低レベルからMPなしの基礎魔法を使えるようにしています。</p>
          <h3>名前パターン</h3>
          <p>1人用の戦闘後に、元の名前の後ろへ短い記号を足した名前パターンが表示されます。別人の名前には変わりません。そのまま名前欄に入れると、そのレベルの強さとして1人用でも2人用でも使えます。</p>
          <h3>音について</h3>
          <p>音はデフォルトでオンです。タイトル画面と戦闘画面では別のBGMが流れます。ブラウザの制限により、最初に「決定」や「戦いを始める」を押した後に再生されます。</p>
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
  logLine(`${player.displayName}が現れた。レベル ${player.level}、${player.job.name}。`);
  logLine(`${enemy.displayName}が立ちはだかった。レベル ${enemy.level}、${enemy.job.name}。`);
  render();
  if (state.battle.turn === "enemy") setTimeout(enemyTurn, 650);
}

function renderBattle() {
  if (state.audioReady && state.audioOn) startMusic("battle");
  const battle = state.battle;
  const magic = availableMagic(battle.player);
  const techniques = availableTechniques(battle.player);
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
          <button data-action="back">最初に戻る</button>
        </div>
      </header>
      <section class="stage">
        <div class="battle-header">
          <div class="battle-badge">${battle.turn === "player" ? "あなたの番" : "相手の番"}</div>
          <div class="battle-badge">${state.auto ? "オート操作中" : "マニュアル操作中"}</div>
        </div>
        <div class="fighters">
          ${fighterMarkup(battle.player, "player")}
          ${fighterMarkup(battle.enemy, "enemy")}
        </div>
        <div class="effect-layer"></div>
      </section>
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
        <div class="log">${battle.log.map((line) => `<p>${escapeHtml(line)}</p>`).join("")}</div>
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
  if (state.auto && !state.busy && !battle.ended) scheduleAuto();
}

function commandDisabled() {
  const battle = state.battle;
  return state.busy || state.auto || battle.turn !== "player" || battle.ended ? "disabled" : "";
}

function fighterMarkup(character, side) {
  const hpRate = Math.max(0, character.currentHp / character.stats.hp) * 100;
  const mpRate = Math.max(0, character.currentMp / character.stats.mp) * 100;
  const tpRate = Math.max(0, character.currentTp / character.stats.tp) * 100;
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
      </div>
      <div class="sprite-wrap">
        <div class="shadow"></div>
        <div class="sprite" data-sprite="${side}" style="--sprite-main:${character.tint};--sprite-dark:${character.dark};--sprite-aura:${character.aura}">
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

function logLine(text) {
  state.battle.log.unshift(text);
  state.battle.log = state.battle.log.slice(0, 12);
}

function scheduleAuto() {
  setTimeout(() => {
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
  const buffs = magic.filter((ability) => ability.kind === "buff");
  const attacks = [...techniques, ...magic.filter((ability) => ability.kind === "magic")];
  if (actor.currentHp < actor.stats.hp * 0.28 && heals.length && actor.healUses < 3) return { ability: heals[heals.length - 1] };
  if (actor.currentHp < actor.stats.hp * 0.45 && buffs.length && Math.random() < 0.22) return { ability: buffs[buffs.length - 1] };
  if (target.currentHp < actor.stats.attack * 1.25) return "attack";
  if (attacks.length && Math.random() < 0.62) return { ability: attacks[attacks.length - 1] };
  if (actor.currentHp < actor.stats.hp * 0.22 && Math.random() < 0.35) return "defend";
  return "attack";
}

function playerAction(command) {
  if (state.busy || state.battle.turn !== "player" || state.battle.ended) return;
  performAction(state.battle.player, state.battle.enemy, command, () => {
    if (!checkEnd()) {
      state.battle.turn = "enemy";
      render();
      setTimeout(enemyTurn, 650);
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
    setTimeout(() => finishAction(done), 420);
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
      setTimeout(() => finishAction(done), 760);
      render();
      return;
    }
    if (ability.kind === "buff") {
      actor.defending = true;
      logLine(`${actor.displayName}の${ability.name}。魔力を練り上げ、次の攻撃に備えた。`);
      playTone("guard");
      showEffect(actor === state.battle.player ? "player" : "enemy", "heal");
      setTimeout(() => finishAction(done), 620);
      render();
      return;
    }
    const damage = calcDamage(actor, target, ability.kind, ability);
    target.currentHp -= damage;
    logLine(`${actor.displayName}の${ability.name}。${target.displayName}に${damage}のダメージ。`);
    playTone(ability.kind === "magic" ? "magic" : "attack");
    showEffect(target === state.battle.player ? "player" : "enemy", ability.kind === "magic" ? "spell" : "slash");
    flashSprite(target, "hit");
    setTimeout(() => finishAction(done), 840);
    render();
    return;
  }

  if (action === "ability") {
    const resource = command.ability.kind === "technique" ? "TP" : "MP";
    logLine(`${actor.displayName}は力を解き放とうとしたが、${resource}が足りない。`);
  }
  const damage = calcDamage(actor, target, "attack");
  target.currentHp -= damage;
  logLine(`${actor.displayName}の通常攻撃。刃が走り、${target.displayName}に${damage}のダメージ。`);
  playTone("attack");
  flashSprite(actor, "attack");
  flashSprite(target, "hit");
  showEffect(target === state.battle.player ? "player" : "enemy", "slash");
  setTimeout(() => finishAction(done), 640);
  render();
}

function finishAction(done) {
  state.busy = false;
  done();
}

function calcDamage(actor, target, type, ability = null) {
  const random = rng(hashText(`${actor.id}:${target.id}:${Date.now()}:${Math.random()}`));
  const power = ability?.power || 1;
  const attackSide = type === "magic"
    ? (actor.stats.magic * 1.35 + actor.stats.luck * 0.16) * power
    : type === "technique"
      ? (actor.stats.technique * 1.12 + actor.stats.attack * 0.72 + actor.stats.speed * 0.18) * power
    : actor.stats.attack * 1.25 + actor.stats.luck * 0.24;
  const guardRate = target.defending ? 0.92 : 0.58;
  const defenseSide = type === "magic"
    ? target.stats.magicDefense * guardRate + target.stats.luck * 0.12
    : target.stats.defense * guardRate + target.stats.luck * 0.12;
  const critical = random() < clamp(actor.stats.luck / (target.stats.luck * 9 + 180), 0.04, 0.28);
  const variance = 0.86 + random() * 0.28;
  const raw = Math.max(1, (attackSide - defenseSide) * variance);
  return Math.round(raw * (critical ? 1.75 : 1));
}

function checkEnd() {
  const battle = state.battle;
  if (battle.player.currentHp > 0 && battle.enemy.currentHp > 0) return false;
  battle.ended = true;
  state.auto = false;
  const playerWon = battle.enemy.currentHp <= 0;
  playTone(playerWon ? "win" : "down");
  setTimeout(() => finishBattle(playerWon), 650);
  return true;
}

function finishBattle(playerWon) {
  const battle = state.battle;
  if (state.mode === "solo") {
    if (playerWon) {
      const outcome = awardExp(state.player, battle.enemy, state.stageIndex);
      const clearedFinal = state.stageIndex >= STAGES.length - 1;
      state.result = {
        won: true,
        title: clearedFinal ? "全ステージ制覇" : "勝利",
        lines: [
          `${battle.enemy.displayName}を倒した。`,
          `獲得経験値：${outcome.gained}`,
          `上がったレベル：${outcome.levels}`,
          `次のレベルまで：${expToNext(state.player.level) - state.player.exp} 経験値`,
          outcome.learned.length ? `新しく覚えた技：${outcome.learned.join("、")}` : "新しく覚えた魔法・特技：なし",
          `この強さの${state.player.name}は、下の名前パターンで呼び出せます。`
        ],
        code: makeNamePattern(state.player),
        next: clearedFinal ? "menu" : "next"
      };
      if (!clearedFinal) state.stageIndex += 1;
    } else {
      fullHeal(state.player);
      state.result = {
        won: false,
        title: "敗北",
        lines: [
          `${battle.enemy.displayName}に倒された。`,
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
  if (state.audioReady && state.audioOn) startMusic("menu");
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
          <button data-action="menu">タイトルへ戻る</button>
        </div>
      </section>
      ${helpModal()}
    </main>
  `;
  bindCommon();
  app.querySelector("[data-action='menu']").addEventListener("click", () => {
    state.screen = "title";
    state.result = null;
    state.battle = null;
    render();
  });
  const next = app.querySelector("[data-action='next']");
  if (next) {
    next.addEventListener("click", () => {
      startBattle(cloneForBattle(state.player), cloneForBattle(STAGES[state.stageIndex]));
    });
  }
  const retry = app.querySelector("[data-action='retry']");
  if (retry) {
    retry.addEventListener("click", () => {
      startBattle(cloneForBattle(state.player), cloneForBattle(STAGES[state.stageIndex]));
    });
  }
  const duelRetry = app.querySelector("[data-action='duel-retry']");
  if (duelRetry) {
    duelRetry.addEventListener("click", () => {
      startBattle(cloneForBattle(state.player), cloneForBattle(state.second));
    });
  }
  const copy = app.querySelector("[data-action='copy-code']");
  if (copy) {
    copy.addEventListener("click", async () => {
      await copyText(state.result.code);
      copy.textContent = "コピー済み";
      setTimeout(() => {
        copy.textContent = "コピー";
      }, 1200);
    });
  }
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
  startMusic(mode);
}

function toggleAudio() {
  state.audioOn = !state.audioOn;
  if (state.audioOn) {
    ensureAudio();
  } else {
    stopMusic();
  }
  render();
}

function startMusic(mode = "menu") {
  if (!state.audioOn || !state.audio) return;
  if (state.musicTimer && state.musicMode === mode) return;
  stopMusic();
  state.musicMode = mode;
  let step = 0;
  state.musicTimer = setInterval(() => {
    if (!state.audioOn || !state.audio) {
      stopMusic();
      return;
    }
    if (mode === "battle") {
      const bass = [82.41, 82.41, 110, 82.41, 123.47, 110, 98, 73.42];
      const lead = [329.63, 392, 440, 493.88, 440, 392, 329.63, 293.66];
      tone(bass[step % bass.length], 0.13, "sawtooth", 0.045);
      if (step % 2 === 0) tone(lead[step % lead.length], 0.08, "square", 0.032);
      if (step % 4 === 0) tone(55, 0.08, "triangle", 0.07);
      if (step % 4 === 2) tone(1760, 0.025, "square", 0.018);
    } else {
      const notes = [196, 246.94, 293.66, 329.63, 392, 329.63, 293.66, 246.94];
      const note = notes[step % notes.length];
      tone(note, 0.16, "triangle", 0.026);
      if (step % 4 === 0) tone(note / 2, 0.24, "sine", 0.018);
    }
    step += 1;
  }, mode === "battle" ? 150 : 260);
}

function stopMusic() {
  if (state.musicTimer) clearInterval(state.musicTimer);
  state.musicTimer = null;
  state.musicMode = null;
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

render();
