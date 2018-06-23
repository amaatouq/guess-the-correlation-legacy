import SimpleSchema from "simpl-schema";
import { taskData } from "./constants.js";

export const conditions = {
  playerCount: {
    description: "The Number of players participating in the given game",
    type: SimpleSchema.Integer,
    min: 1,
    max: 100
  },
  botsCount: {
    description: "The Number of bots that should participate in a given game",
    type: SimpleSchema.Integer,
    optional: true,
    min: 0,
    max: 100
  },
  // JS doesn't have Integer and Float as distinctive types, just Number.
  // So when we really don't want people to give a float (like playerCount)
  // simple schema gives you that custom type.
  altersCount: {
    description: "The Number of connections for each player",
    type: SimpleSchema.Integer,
    min: 0,
    max: 12,
    optional: false
  },
  stageDuration: {
    description:
      "The maximum time in seconds for each stage before moving to the next",
    type: SimpleSchema.Integer,
    min: 5,
    max: 60,
    optional: false
  },
  rewiring: {
    description: "Can the player change their alters on each round",
    type: Boolean,
    optional: false
  },
  feedbackRate: {
    description: "how frequent the feedback is (1 = every round; 0 = never)",
    type: Number,
    min: 0,
    max: 1,
    optional: false
  },
  feedbackNoise: {
    description: "The level of noise added to performance of the alters",
    type: Number,
    min: 0,
    max: 1,
    optional: false
  },
  shockRate: {
    description: "The rate at which we change difficulties for the players",
    type: Number,
    min: 0,
    max: 1,
    optional: false
  },

  nRounds: {
    description: "This is the number of rounds for the game",
    type: SimpleSchema.Integer,
    min: 1,
    max: taskData.length, //can't have more rounds than tasks for this game
    optional: false
  }
};
