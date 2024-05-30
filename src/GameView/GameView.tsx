import { Component } from "solid-js";
import { GameConfig } from "../game";
import DicePlate from "./DicePlate";
import ScoreSheet from "./ScoreSheet";
import { initialState, rollDices } from "./state";
import toast from "solid-toast";

type Props = {
	config: GameConfig;
};

const GameView: Component<Props> = props => {
	const state = initialState(props.config);

	const handleRoll = () => {
		if (state.leftRolls() <= 0) {
			toast.error("No more rolls left");
			return;
		}
		rollDices(state);
	};

	return (
		<div class="game">
			<ScoreSheet state={state} />
			<DicePlate state={state} onRoll={handleRoll} />
		</div>
	);
};

export default GameView;
