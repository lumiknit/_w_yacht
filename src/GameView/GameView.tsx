import { Component } from "solid-js";
import DicePlate from "./DicePlate";
import ScoreSheet from "./ScoreSheet";
import { GameState, rollDices } from "./state";
import toast from "solid-toast";

type Props = {
	state: GameState;
};

const GameView: Component<Props> = props => {
	const handleRoll = () => {
		if (props.state.leftRolls() <= 0) {
			toast.error("No more rolls left");
			return;
		}
		rollDices(props.state);
	};

	return (
		<div class="game">
			<ScoreSheet state={props.state} />
			<DicePlate state={props.state} onRoll={handleRoll} />
		</div>
	);
};

export default GameView;
