import { Component, Index, Match, Switch } from "solid-js";

import { block } from "@lumiknit/solid-fekit";

import Dice from "./Dice";
import { GameState, toggleKeepDices } from "./state";
import { vibratePick } from "../vibrate";

type Props = {
	state: GameState;

	onRollStart: () => void;
	onRollEnd: () => void;
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
							onClick={() => {
								toggleKeepDices(props.state, new Set([i]));
								vibratePick();
							}}
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
					<block.Button
						class="btn-roll"
						color="primary"
						onPointerDown={props.onRollStart}
						onPointerUp={props.onRollEnd}
						onPointerLeave={props.onRollEnd}
						onPointerCancel={props.onRollEnd}>
						Roll ({props.state.leftRolls()} / 3)
					</block.Button>
				</Match>
			</Switch>
		</div>
	);
};

export default DicePlate;
