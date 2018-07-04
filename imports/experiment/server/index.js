import { conditions } from "./game/conditions.js";
import { init } from "./game/init.js";
import callbacks from "./game/callbacks.js";

const {
  onGameEnd,
  onGameStart,
  onRoundEnd,
  onRoundStart,
  onSet,
  onChange,
  onAppend,
  onStageEnd,
  onStageStart
} = callbacks;

import { bob } from "./bots.js";

export const config = {
  conditions,
  init,
  bots: [bob],
  onGameStart,
  onRoundStart,
  onStageStart,
  onSet,
  onAppend,
  onChange,
  onStageEnd,
  onRoundEnd,
  onGameEnd
};
