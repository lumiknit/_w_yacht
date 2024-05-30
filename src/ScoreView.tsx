import { Component } from "solid-js";
import { block } from "@lumiknit/solid-fekit";

import ScoreSheet from "./GameView/ScoreSheet";
import { calculateScore, GameState } from "./GameView/state";

type Props = {
	state: GameState;
	onReturn: () => void;
};

const ScoreView: Component<Props> = props => {
	return (
		<>
			<ScoreSheet state={props.state} />
			<div class="container">
				<h1> Score: {calculateScore(props.state)} </h1>
				<block.Button color="primary" onClick={props.onReturn}>
					Go to Start
				</block.Button>
			</div>
		</>
	);
};

export default ScoreView;
