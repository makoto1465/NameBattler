# Suno SFX Prompts for NameBattler

## Sunoで作る時の前提

- `Suno Sounds` を使う
- `Type` は基本 `One Shot`
- プロンプトは短く具体的に書く
- `whoosh`, `hit`, `magic burst`, `heal chime`, `guard clang` のような分かりやすい語を使う
- 長さが大事な時は `0.3 second` や `1 second` のように書く
- まずは英語で作るのがおすすめ

## 今ゲーム内で使っている効果音

1. `attack`
   - 通常攻撃
   - 物理特技
2. `magic`
   - 攻撃魔法
   - デバフ
3. `heal`
   - 回復魔法
4. `guard`
   - 防御
   - バフ
5. `win`
   - 勝利
6. `down`
   - 敗北

## 追加すると強くなるおすすめ効果音

1. `physical_swing`
2. `physical_hit`
3. `critical_hit`
4. `miss_evade`
5. `magic_cast`
6. `magic_hit`
7. `heal_cast`
8. `buff_apply`
9. `debuff_apply`
10. `guard_brace`
11. `resource_fail`
12. `victory_stinger`
13. `defeat_stinger`
14. `level_up`
15. `shop_buy`
16. `ui_confirm`

## Prompt Boxes

### 1. physical_swing

```text
short RPG sword swing whoosh, sharp fast air cut, clean attack start, no voice, no music, one shot, 0.25 second
```

### 2. physical_hit

```text
retro fantasy battle hit impact, tight body blow, punchy midrange thump, no voice, no music, one shot, 0.2 second
```

### 3. critical_hit

```text
heavy RPG critical hit impact, bright metallic slash plus explosive hit, dramatic arcade finish, no voice, no music, one shot, 0.45 second
```

### 4. miss_evade

```text
quick dodge whoosh, light sidestep air swipe, agile anime evade sound, no voice, no music, one shot, 0.2 second
```

### 5. magic_cast

```text
fantasy spell cast start, glowing arcane shimmer, rising magical energy, clean and focused, no voice, no music, one shot, 0.5 second
```

### 6. magic_hit

```text
fantasy magic impact burst, bright arcane explosion, crisp energy crackle, no voice, no music, one shot, 0.45 second
```

### 7. heal_cast

```text
RPG healing spell chime, warm sparkling restore sound, gentle holy light feeling, no voice, no music, one shot, 0.7 second
```

### 8. buff_apply

```text
status up RPG sound effect, confident power surge, bright magical lift, no voice, no music, one shot, 0.5 second
```

### 9. debuff_apply

```text
status down RPG sound effect, dark magical drop, cursed energy pulse, no voice, no music, one shot, 0.5 second
```

### 10. guard_brace

```text
defense stance sound, short shield brace, muted metallic block, sturdy fantasy guard, no voice, no music, one shot, 0.3 second
```

### 11. resource_fail

```text
RPG error sound, not enough mana or skill points, short dry fail blip, no voice, no music, one shot, 0.25 second
```

### 12. victory_stinger

```text
short RPG victory fanfare, bright heroic finish, compact and catchy, no voice, no music, one shot, 1.2 second
```

### 13. defeat_stinger

```text
short RPG defeat stinger, low falling tone, somber game over mood, no voice, no music, one shot, 1 second
```

### 14. level_up

```text
RPG level up jingle, sparkling upward chime, exciting reward feeling, no voice, no music, one shot, 1 second
```

### 15. shop_buy

```text
retro fantasy purchase confirm sound, light coin and sparkle accent, satisfying UI reward cue, no voice, no music, one shot, 0.35 second
```

### 16. ui_confirm

```text
clean game UI confirm click, soft magical tap, polished menu select sound, no voice, no music, one shot, 0.15 second
```

## まず優先して作るならこの6個

1. `physical_swing`
2. `physical_hit`
3. `magic_cast`
4. `magic_hit`
5. `heal_cast`
6. `victory_stinger`
