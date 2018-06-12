import { conditions } from "./game/conditions.js";
import { init } from "./game/init.js";
import { onRoundEnd, onRoundStart, onStageEnd, onGameEnd} from "./game/callbacks.js";

import { onRoundEnd, onRoundStart, onStageEnd } from "./game/callbacks.js";
import { bob } from "./bots.js";
export const config = {
  conditions,
  init,
  onRoundStart,
  onStageEnd,
  onRoundEnd,
  onGameEnd,
  bots: [bob]
};
