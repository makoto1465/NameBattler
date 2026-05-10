"use strict";

const app = document.querySelector("#app");

const SYMBOLS = ["◆", "◇", "●", "○", "★", "☆", "▲", "△", "■", "□", "▼", "▽", "✦", "✧", "※", "◎"];
const JOBS = [
  { name: "戦士", hp: 1.22, mp: 0.62, attack: 1.28, defense: 1.18, magic: 0.62, speed: 0.88, luck: 0.9, skill: "覇王斬", cost: 8, kind: "blade" },
  { name: "魔法使い", hp: 0.82, mp: 1.35, attack: 0.72, defense: 0.78, magic: 1.42, speed: 1.02, luck: 1.0, skill: "黒雷詠唱", cost: 12, kind: "magic" },
  { name: "僧侶", hp: 0.98, mp: 1.2, attack: 0.82, defense: 1.04, magic: 1.12, speed: 0.92, luck: 1.24, skill: "聖光再生", cost: 10, kind: "heal" },
  { name: "忍者", hp: 0.92, mp: 0.86, attack: 1.08, defense: 0.82, magic: 0.82, speed: 1.48, luck: 1.18, skill: "影縫い", cost: 9, kind: "blade" },
  { name: "暗黒騎士", hp: 1.12, mp: 0.92, attack: 1.35, defense: 1.05, magic: 1.06, speed: 0.76, luck: 0.72, skill: "冥王炎", cost: 13, kind: "magic" },
  { name: "武闘家", hp: 1.08, mp: 0.58, attack: 1.22, defense: 0.92, magic: 0.58, speed: 1.3, luck: 1.08, skill: "竜牙連撃", cost: 7, kind: "blade" },
  { name: "賢者", hp: 0.96, mp: 1.42, attack: 0.9, defense: 0.96, magic: 1.34, speed: 0.94, luck: 1.14, skill: "星詠み", cost: 14, kind: "magic" },
  { name: "盗賊", hp: 0.9, mp: 0.74, attack: 0.96, defense: 0.8, magic: 0.74, speed: 1.34, luck: 1.48, skill: "運命強奪", cost: 8, kind: "blade" }
];

const STAGES = [
  makeEnemy("影の見習い", "盗賊", 5, 96),
  makeEnemy("古城の番兵", "戦士", 12, 118),
  makeEnemy("月読の僧兵", "僧侶", 19, 140),
  makeEnemy("黒衣の術士", "魔法使い", 28, 168),
  makeEnemy("疾風の刃", "忍者", 39, 198),
  makeEnemy("竜骨の武人", "武闘家", 52, 232),
  makeEnemy("虚無の賢者", "賢者", 68, 276),
  makeEnemy("終焉の暗黒王", "暗黒騎士", 86, 330)
];

const state = {
  screen: "menu",
  mode: "solo",
  error: "",
  preview: null,
  previewTwo: null,
  player: null,
  enemy: null,
  second: null,
  stageIndex: 0,
  battle: null,
  auto: false,
  busy: false,
  result: null,
  audioReady: false,
  audio: null,
  musicTimer: null
};

function hashText(text) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
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

function rareLevel(random) {
  const base = Math.floor(1 + Math.pow(random(), 3.15) * 98);
  const omen = random();
  if (omen > 0.995) return clamp(base + 45, 1, 99);
  if (omen > 0.975) return clamp(base + 24, 1, 99);
  if (omen < 0.035) return clamp(base - 8, 1, 99);
  return base;
}

function createCharacter(inputName, options = {}) {
  const pattern = readNamePattern(inputName);
  const baseName = pattern.ok ? pattern.name : normalizeName(inputName);
  if (!baseName) throw new Error("名前を入力してください。");

  const seed = hashText(baseName);
  const random = rng(seed);
  const job = JOBS[Math.floor(random() * JOBS.length)];
  const generatedLevel = rareLevel(random);
  const initialLevel = options.level || pattern.level || generatedLevel;
  const tint = `hsl(${Math.floor(random() * 360)} 76% 58%)`;
  const dark = `hsl(${Math.floor(random() * 360)} 54% 28%)`;
  const aura = `hsla(${Math.floor(random() * 360)} 92% 66% / 0.72)`;
  const nature = 0.78 + Math.pow(random(), 2.2) * 0.82;
  const spikeRoll = random();
  const spike = spikeRoll > 0.94 ? 1.65 : spikeRoll < 0.05 ? 0.58 : 1;
  const focus = ["attack", "defense", "magic", "speed", "luck"][Math.floor(random() * 5)];
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
    attack: calc(9, 2.45, j.attack, "attack"),
    defense: calc(8, 2.18, j.defense, "defense"),
    magic: calc(8, 2.35, j.magic, "magic"),
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
    attack: Math.round((12 + level * 2.8) * factor * job.attack),
    defense: Math.round((10 + level * 2.45) * factor * job.defense),
    magic: Math.round((10 + level * 2.65) * factor * job.magic),
    speed: Math.round((8 + level * 2.25) * factor * job.speed),
    luck: Math.round((6 + level * 1.95) * factor * job.luck)
  };
  enemy.currentHp = enemy.stats.hp;
  enemy.currentMp = enemy.stats.mp;
  return enemy;
}

function cloneForBattle(character) {
  return {
    ...character,
    job: { ...character.job },
    stats: { ...character.stats },
    currentHp: character.stats.hp,
    currentMp: character.stats.mp,
    defending: false
  };
}

function fullHeal(character) {
  character.currentHp = character.stats.hp;
  character.currentMp = character.stats.mp;
}

function expToNext(level) {
  return Math.round(80 + level * level * 16);
}

function awardExp(player, enemy, stageIndex) {
  const enemyPower = enemy.stats.hp + enemy.stats.attack * 9 + enemy.stats.magic * 7 + enemy.stats.defense * 6;
  const gained = Math.round(enemy.level * 42 + enemyPower / 5 + stageIndex * 55);
  const before = player.level;
  player.exp += gained;
  while (player.level < 999 && player.exp >= expToNext(player.level)) {
    player.exp -= expToNext(player.level);
    player.level += 1;
    player.stats = buildStats(player, player.spike || 1);
  }
  fullHeal(player);
  return { gained, levels: player.level - before };
}

function render() {
  if (state.screen === "battle") {
    renderBattle();
    return;
  }
  if (state.screen === "result") {
    renderResult();
    return;
  }
  renderMenu();
}

function renderMenu() {
  const nameOneValue = document.querySelector("#name-one")?.value || "";
  const nameTwoValue = document.querySelector("#name-two")?.value || "";
  const hasDecision = Boolean(state.preview && (state.mode === "solo" || state.previewTwo));
  app.innerHTML = `
    <main class="shell">
      <header class="topbar">
        <div>
          <h1 class="title">NameBattler</h1>
          <p class="subtitle">名前に眠る運命を呼び起こし、横視点の戦場でぶつけ合え。</p>
        </div>
        <div class="top-actions">
          <button class="icon-button" data-action="help" aria-label="遊び方を開く" title="遊び方">?</button>
          <button class="sound-button" data-action="sound">${state.audioReady ? "音あり" : "音を鳴らす"}</button>
        </div>
      </header>
      <section class="menu">
        <div class="panel">
          <h2>モード選択</h2>
          <div class="mode-grid">
            <button class="mode-button ${state.mode === "solo" ? "active" : ""}" data-mode="solo">1人用</button>
            <button class="mode-button ${state.mode === "duel" ? "active" : ""}" data-mode="duel">2人用</button>
          </div>
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
            ` : ""}
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
  bindMenu();
}

function bindMenu() {
  app.querySelectorAll("[data-mode]").forEach((button) => {
    button.addEventListener("click", () => {
      state.mode = button.dataset.mode;
      state.preview = null;
      state.previewTwo = null;
      state.player = null;
      state.second = null;
      state.error = "";
      render();
    });
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
  app.querySelector("[data-action='decide']").addEventListener("click", decideNames);
  const start = app.querySelector("[data-action='start']");
  if (start) start.addEventListener("click", startGame);
}

function decideNames() {
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
  if (sound) sound.addEventListener("click", initAudio);
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
          <p>名前を入力すると、職業、レベル、HP、MP、攻撃力、防御力、魔力、素早さ、運が決まります。同じ名前なら、いつでも同じ能力になります。</p>
          <h3>1人用</h3>
          <p>固定された敵を順番に倒してステージを進めます。敵の強さはあなたのレベルに合わせて変わらないので、強い名前や成長した名前パターンが攻略の鍵になります。</p>
          <h3>2人用</h3>
          <p>プレイヤー1とプレイヤー2の名前を入れると、それぞれの名前から生まれたキャラクター同士で戦います。</p>
          <h3>戦闘操作</h3>
          <p>マニュアル操作では、通常攻撃、職業スキル、防御、様子を見るを選べます。オート操作に切り替えると、自動で行動を選びます。戦闘中にいつでも切り替えできます。</p>
          <h3>名前パターン</h3>
          <p>1人用の戦闘後に、元の名前の後ろへ短い記号を足した名前パターンが表示されます。別人の名前には変わりません。そのまま名前欄に入れると、そのレベルの強さとして1人用でも2人用でも使えます。</p>
          <h3>音について</h3>
          <p>ブラウザの制限により、音は「音を鳴らす」またはゲーム開始を押した後に再生されます。BGMや攻撃音はブラウザ内で生成しています。</p>
        </div>
      </section>
    </div>
  `;
}

function characterPreview(character) {
  return `
      <div class="preview-card">
      <div class="name-row"><span>${escapeHtml(character.name)}</span><span>レベル ${character.level}</span></div>
      <div class="job">${character.job.name}</div>
      ${character.patternUsed ? `<p class="pattern-note">記号つきの名前パターンから呼び出しました。</p>` : ""}
      <div class="stat-grid">
        ${statItem("HP", character.stats.hp)}
        ${statItem("MP", character.stats.mp)}
        ${statItem("攻撃力", character.stats.attack)}
        ${statItem("防御力", character.stats.defense)}
        ${statItem("魔力", character.stats.magic)}
        ${statItem("素早さ", character.stats.speed)}
        ${statItem("運", character.stats.luck)}
      </div>
    </div>
  `;
}

function statItem(label, value) {
  return `<div class="stat"><span>${label}</span><strong>${value}</strong></div>`;
}

function startGame() {
  initAudio();
  try {
    if (!state.preview || (state.mode === "duel" && !state.previewTwo)) {
      decideNames();
      return;
    }
    const one = state.preview;
    if (state.mode === "solo") {
      state.player = one;
      state.stageIndex = 0;
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
  state.screen = "battle";
  state.auto = false;
  state.busy = false;
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
  const battle = state.battle;
  app.innerHTML = `
    <main class="shell battle">
      <header class="topbar">
        <div>
          <h1 class="title">NameBattler</h1>
          <p class="subtitle">${state.mode === "solo" ? `第${state.stageIndex + 1}ステージ` : "2人用対戦"}</p>
        </div>
        <div class="top-actions">
          <button class="icon-button" data-action="help" aria-label="遊び方を開く" title="遊び方">?</button>
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
            <button data-command="skill" ${commandDisabled()}>${battle.player.job.skill}<span>消費MP ${battle.player.job.cost}</span></button>
            <button data-command="defend" ${commandDisabled()}>防御</button>
            <button data-command="wait" ${commandDisabled()}>様子を見る</button>
          </div>
        </div>
        <div class="log">${battle.log.map((line) => `<p>${escapeHtml(line)}</p>`).join("")}</div>
      </section>
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
  return `
    <div class="side ${side}">
      <div class="nameplate">
        <div class="name-row"><span>${escapeHtml(character.displayName)}</span><span>レベル ${character.level}</span></div>
        <div class="job">${character.job.name}</div>
        <div class="bar"><div class="fill hp-fill" style="width:${hpRate}%"></div></div>
        <div class="bar-text"><span>HP</span><span>${Math.max(0, character.currentHp)} / ${character.stats.hp}</span></div>
        <div class="bar"><div class="fill mp-fill" style="width:${mpRate}%"></div></div>
        <div class="bar-text"><span>MP</span><span>${Math.max(0, character.currentMp)} / ${character.stats.mp}</span></div>
      </div>
      <div class="sprite-wrap">
        <div class="shadow"></div>
        <div class="sprite enter" data-sprite="${side}" style="--sprite-main:${character.tint};--sprite-dark:${character.dark};--sprite-aura:${character.aura}">
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
    stopMusic();
    state.screen = "menu";
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
  if (actor.currentHp < actor.stats.hp * 0.35 && actor.job.kind === "heal" && actor.currentMp >= actor.job.cost) return "skill";
  if (target.currentHp < actor.stats.attack * 1.25) return "attack";
  if (actor.currentMp >= actor.job.cost && Math.random() < 0.62) return "skill";
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
  actor.defending = false;
  const action = command === "wait" ? "defend" : command;
  if (action === "defend") {
    actor.defending = true;
    logLine(`${actor.displayName}は身構えた。`);
    playTone("guard");
    setTimeout(() => finishAction(done), 420);
    render();
    return;
  }

  if (action === "skill" && actor.currentMp >= actor.job.cost) {
    actor.currentMp -= actor.job.cost;
    if (actor.job.kind === "heal") {
      const amount = Math.round(actor.stats.magic * 1.8 + actor.stats.luck * 0.7);
      actor.currentHp = Math.min(actor.stats.hp, actor.currentHp + amount);
      logLine(`${actor.displayName}の${actor.job.skill}。聖なる光が傷を包み、HPが${amount}回復した。`);
      playTone("heal");
      showEffect(actor === state.battle.player ? "player" : "enemy", "heal");
      setTimeout(() => finishAction(done), 760);
      render();
      return;
    }
    const damage = calcDamage(actor, target, "skill");
    target.currentHp -= damage;
    logLine(`${actor.displayName}の${actor.job.skill}。禁じられた力が${target.displayName}を貫き、${damage}のダメージ。`);
    playTone("magic");
    showEffect(target === state.battle.player ? "player" : "enemy", "spell");
    flashSprite(target, "hit");
    setTimeout(() => finishAction(done), 840);
    render();
    return;
  }

  if (action === "skill") {
    logLine(`${actor.displayName}は力を解き放とうとしたが、MPが足りない。`);
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

function calcDamage(actor, target, type) {
  const random = rng(hashText(`${actor.id}:${target.id}:${Date.now()}:${Math.random()}`));
  const attackSide = type === "skill"
    ? actor.stats.magic * 1.45 + actor.stats.attack * 0.42
    : actor.stats.attack * 1.25 + actor.stats.luck * 0.24;
  const defenseSide = target.stats.defense * (target.defending ? 0.92 : 0.58) + target.stats.luck * 0.12;
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
      next: "menu"
    };
  }
  state.screen = "result";
  render();
  showResultFlash();
}

function renderResult() {
  const result = state.result;
  app.innerHTML = `
    <main class="shell">
      <header class="topbar">
        <div>
          <h1 class="title">NameBattler</h1>
          <p class="subtitle">${result.title}</p>
        </div>
        <button class="icon-button" data-action="help" aria-label="遊び方を開く" title="遊び方">?</button>
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
          <button data-action="menu">最初に戻る</button>
        </div>
      </section>
      ${helpModal()}
    </main>
  `;
  bindCommon();
  app.querySelector("[data-action='menu']").addEventListener("click", () => {
    state.screen = "menu";
    state.result = null;
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

function initAudio() {
  if (state.audioReady) return;
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;
  state.audio = new AudioContext();
  state.audioReady = true;
  startMusic();
}

function startMusic() {
  stopMusic();
  let step = 0;
  state.musicTimer = setInterval(() => {
    if (!state.audio) return;
    const notes = [110, 146.83, 164.81, 196, 220, 196, 164.81, 146.83];
    const note = notes[step % notes.length];
    tone(note, 0.09, "sawtooth", 0.035);
    if (step % 4 === 0) tone(note / 2, 0.16, "triangle", 0.025);
    step += 1;
  }, 220);
}

function stopMusic() {
  if (state.musicTimer) clearInterval(state.musicTimer);
  state.musicTimer = null;
}

function tone(freq, duration, type, volume) {
  if (!state.audio) return;
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
