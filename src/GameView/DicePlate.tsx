import { Component, Index, Match, Switch } from "solid-js";

import { block } from "@lumiknit/solid-fekit";

import Dice from "./Dice";
import { GameState, toggleKeepDices } from "./state";

type Props = {
	state: GameState;

	onRoll: () => void;
};

const DicePlate: Component<Props> = props => {
	return (
		<div class="dice-plate w-100 d-flex flex-column align-center justify-center">
			<div class="kept-dices">Kept</div>

			<div class="dices w-100 d-flex flex-row align-center justify-center">
				<Index each={props.state.dices()}>
					{(dice, i) => (
						<Dice
							rolling={props.state.rolling}
							dice={dice}
							onClick={() => toggleKeepDices(props.state, new Set([i]))}
						/>
					)}
				</Index>
			</div>

			<Switch>
				<Match when={props.state.leftRolls() <= 0}>
					<block.Button color="secondary" disabled>
						No more rolls left
					</block.Button>
				</Match>
				<Match when={true}>
					<block.Button color="primary" onClick={props.onRoll}>
						Roll ({props.state.leftRolls()} / 3)
					</block.Button>
				</Match>
			</Switch>
		</div>
	);
};

export default DicePlate;
