import React from "react";
import ChatLog from "./ChatLog";
import TaskResponseText from "./TaskResponseText";
import TaskResponseOptions from "./TaskResponseOptions";
import TaskResponseSlider from "./TaskResponseSlider";

export default class SocialInteractions extends React.Component {
  renderPlayer(player, self = false) {
    return (
      <div className="player" key={player._id}>
        <span className="image">
          <span
            className={`satisfied bp3-tag bp3-round ${
              player.get("satisfied")
                ? "bp3-intent-success"
                : "bp3-intent-danger"
            }`}
          >
            <span
              className={`bp3-icon-standard ${
                player.get("satisfied") ? "bp3-icon-tick" : "bp3-icon-cross"
              }`}
            />
          </span>

          <img src={player.get("avatar")} />
        </span>
        {/* <span className="name" style={{ color: player.get("nameColor") }}> */}
        <span className="name" style={{ color: player.get("nameColor") }}>
          {player.get("name")}
          {self ? " (You)" : ""}
        </span>
      </div>
    );
  }

  getPreviousRoundResponse(player) {
    const { round, stage } = this.props;
    const prevIndex = stage.index - 1;
    const prevStage = round.stages[prevIndex].name;
    return player.round.get(prevStage);
  }

  render() {
    const { game, stage, player, round } = this.props;

    const otherPlayers = _.reject(game.players, p => p._id === player._id);
    const messages = stage.get("chat").map(({ text, playerId }) => ({
      text,
      subject: game.players.find(p => p._id === playerId)
    }));

    const playerResponse = this.getPreviousRoundResponse(player);
    const otherPlayerResponse = this.getPreviousRoundResponse(otherPlayers[0]);

    const otherPlayerProps = {
      player: otherPlayers[0],
      round: round,
      stage: stage,
      readonly: true
    };

    return (
      <div className="social-interactions">
        <div className="status">
          <div className="total-score bp3-card">
            <h6 className="bp3-heading">Other Player's Response: </h6>

            {stage.name === "description-social" ? (
              <TaskResponseText {...otherPlayerProps} />
            ) : stage.name === "qualities-social" ? (
              <TaskResponseOptions {...otherPlayerProps} />
            ) : (
              <TaskResponseSlider {...otherPlayerProps} />
            )}
          </div>
        </div>

        <ChatLog messages={messages} stage={stage} player={player} />
      </div>
    );
  }
}
