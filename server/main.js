import Empirica from "meteor/empirica:core";

import "./callbacks.js";
import "./bots.js";

import { stageData } from "./constants";
import artData from "./toy_data.json";

// gameInit is where the structure of a game is defined.
// Just before every game starts, once all the players needed are ready, this
// function is called with the treatment and the list of players.
// You must then add rounds and stages to the game, depending on the treatment
// and the players. You can also get/set initial values on your game, players,
// rounds and stages (with get/set methods), that will be able to use later in
// the game.
Empirica.gameInit(game => {
  game.players.forEach((player, i) => {
    player.set("avatar", `/avatars/jdenticon/${player._id}`);
    const randomColor = "#" + (((1 << 24) * Math.random()) | 0).toString(16);
    player.set("nameColor", randomColor);
  });

  const roundCount = game.treatment.roundCount || 10;
  const probFemale = game.treatment.probabilityFemaleArtist || 0.5;
  const probRelatedFemale = game.treatment.probabilityFemaleRelated || 0.5;
  const probRelatedMale =
    game.treatment.probabilityMaleRelated || 1 - probRelatedFemale;

  for (let i = 0; i < roundCount; i++) {
    //it is better to use _.shuffle() outside the loop to shuffle things .. so we don't sample the same art work twice
    const randomArtwork = artData[i];
    const femaleArtist = Math.random() < probFemale;

    const relatedRandom = Math.random();
    const femaleRelated = relatedRandom < probRelatedFemale;
    const maleRelated = !femaleRelated && relatedRandom < probRelatedMale;

    const round = game.addRound({
      data: {
        artistGender: femaleArtist ? "female" : "male",
        artistName: femaleArtist
          ? randomArtwork.artistGender.female[0]
          : randomArtwork.artistGender.male[0],
        title: randomArtwork.title,
        year: "2019",
        relatedArtistsGender: femaleRelated
          ? "female"
          : maleRelated
            ? "male"
            : "mix",
        relatedArtists: femaleRelated
          ? randomArtwork.relatedArtists.female
          : maleRelated
            ? randomArtwork.relatedArtists.male
            : randomArtwork.relatedArtists.mix,
        relevantQualities: randomArtwork.relevantQualties,
        imagePath: randomArtwork.imagepath
      }
    });

    _.each(stageData, (stage, stageName) => {
      round.addStage({
        name: stageName,
        displayName: stage.title,
        durationInSeconds: game.treatment.stageLength || 120,
        data: {
          type: "solo",
          questionText: stage.questionText
        }
      });

      if (game.players.length > 1) {
        round.addStage({
          name: `${stageName}-social`,
          displayName: `${stage.title} - Social`,
          durationInSeconds: game.treatment.socialStageLength || 120,
          data: {
            type: "social",
            questionText: stage.questionText
          }
        });
      }
    });
  }
});
