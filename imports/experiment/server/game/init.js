import {difficulties, taskData} from "./constants";


export const init = (treatment, players) => {
  const playerIds = _.pluck(players, "_id");
  players.forEach((player, i) => {
    const alterIds = _.sample(
      _.without(playerIds, player._id),
      treatment.altersCount
    );
    player.set("avatar", `/avatars/jdenticon/${player._id}`);
    //equal number of difficulties .. this can be changed to change the fraction of easy/medium/hard
    player.set("difficulty", difficulties[i % difficulties.length]);
    player.set("alterIds", alterIds);
    player.set("cumulativeScore", 0);
    player.set("bonus", 0);
  });

  //only randomize the task if specified in the conditions
  const tasks = treatment.randomizeTask ? _.shuffle(taskData) : taskData;

  const rounds = [];
  _.times(treatment.nRounds, i => {
    const stages = [
      {
        name: "response",
        displayName: "Response",
        durationInSeconds: treatment.stageDuration
      }
    ];

    if (treatment.altersCount > 0) {
      stages.push({
        name: "interactive",
        displayName: "Interactive Response",
        durationInSeconds: treatment.stageDuration
      });
    }

    // adding "outcome" might look complicated but basically what we are checking is this:
    // when interactive with others, show the round outcome if there is feedback or rewiring
    // when no interactions with others only show the outcome stage when feedback is given
    if (
      (treatment.altersCount > 0 &&
        (treatment.feedbackRate > 0 || treatment.rewiring)) ||
      (treatment.altersCount === 0 && treatment.feedbackRate > 0)
    ) {
      stages.push({
        name: "outcome",
        displayName: "Round Outcome",
        durationInSeconds: treatment.stageDuration
      });
    }

    rounds.push({
      stages,
      task: tasks[i]
    });
  });

  return {
    rounds,
    players
  };
};
