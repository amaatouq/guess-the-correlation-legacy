import { conditions } from "./game/conditions.js";
import { init } from "./game/init.js";
import {
  onGameEnd,
  onGameStart,
  onRoundEnd,
  onRoundStart,
  onStageEnd,
  onStageStart
} from "./game/callbacks.js";

import { bob } from "./bots.js";
export const config = {
  conditions,
  init,
  onGameStart,
  onRoundStart,
  onStageStart,
  onStageEnd,
  onRoundEnd,
  onGameEnd,
  bots: [bob]
};
