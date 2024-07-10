import { Component, createSignal, JSXElement, Setter, Show } from "solid-js";

import { block } from "@lumiknit/solid-fekit";
import {
	config51WordwideGames,
	configOriginalYacht,
	configOriginalYahtzee,
	GameConfig,
} from "./game";
import { BsGearFill, BsPlay } from "solid-icons/bs";
import { TbBrandGithub } from "solid-icons/tb";

type CheckItemProps = {
	checked: (config: GameConfig) => boolean;
	onChange: (newValue: boolean) => (config: GameConfig) => GameConfig;
	children: JSXElement | JSXElement[];
};

type Props = {
	config: GameConfig;
	setConfig: Setter<GameConfig>;

	start: () => void;
};

const StartView: Component<Props> = props => {
	const [showMoreOptions, setShowMoreOptions] = createSignal(false);

	const CheckItem: Component<CheckItemProps> = p => {
		return (
			<block.Checkbox
				value={p.checked(props.config)}
				onChange={v => props.setConfig(p.onChange(v))}>
				{p.children}
			</block.Checkbox>
		);
	};

	return (
		<div class="w-100 d-flex flex-column justify-center align-center">
			<h1>
				{" "}
				Solitaire Yacht Dice
				<a href="https://github.com/lumiknit/_w_yacht" target="_blank">
					<TbBrandGithub />
				</a>
			</h1>
			<block.Button color="primary" onClick={props.start}>
				<BsPlay />
				Start
			</block.Button>

			<h2> Options </h2>

			<block.DropdownButton
				color="secondary"
				label={() => (
					<>
						<BsGearFill /> Preset
					</>
				)}
				labelProps={{}}>
				<a onClick={() => props.setConfig(config51WordwideGames())}>
					51 Worldwide Games
				</a>
				<a onClick={() => props.setConfig(configOriginalYacht())}>
					Original Yaucht
				</a>
				<a onClick={() => props.setConfig(configOriginalYahtzee())}>
					Original Yahtzee
				</a>
			</block.DropdownButton>

			<br />

			<div class="more-options">
				<div
					class="more-options-header"
					onClick={() => setShowMoreOptions(s => !s)}>
					{showMoreOptions() ? "Less Options..." : "More Options..."}
				</div>

				<Show when={showMoreOptions()}>
					<h3> Straight </h3>

					<CheckItem
						checked={c => c.smallStraightScore === 30}
						onChange={v => c => ({ ...c, smallStraightScore: v ? 30 : 15 })}>
						S. Straight 30pt. (Default is 15pt.)
					</CheckItem>

					<CheckItem
						checked={c => c.largeStraightScore === 40}
						onChange={v => c => ({ ...c, largeStraightScore: v ? 40 : 30 })}>
						L. Straight 40pt. (Default is 30pt.)
					</CheckItem>

					<h3> Full House </h3>

					<CheckItem
						checked={c => c.fullHouseFixedScore}
						onChange={v => c => ({ ...c, fullHouseFixedScore: v })}>
						Full House 25pt. (Default is sum)
					</CheckItem>

					<CheckItem
						checked={c => c.yachtIsFullHouse}
						onChange={v => c => ({ ...c, yachtIsFullHouse: v })}>
						Yacht is Full House
					</CheckItem>

					<h3> N of a Kind </h3>

					<CheckItem
						checked={c => c.threeOfAKind}
						onChange={v => c => ({ ...c, threeOfAKind: v })}>
						Three of a Kind
					</CheckItem>

					<Show when={props.config.threeOfAKind}>
						<CheckItem
							checked={c => c.threeOfAKindAll}
							onChange={v => c => ({ ...c, threeOfAKindAll: v })}>
							3oK Score is Sum of All Dices
						</CheckItem>
					</Show>

					<CheckItem
						checked={c => c.fourOfAKindAll}
						onChange={v => c => ({ ...c, fourOfAKindAll: v })}>
						4oK Score is Sum of All Dices
					</CheckItem>

					<h3> Bonus </h3>

					<CheckItem
						checked={c => c.upperSectionBonus}
						onChange={v => c => ({ ...c, upperSectionBonus: v })}>
						Up-sec. Bonus (+35pt.)
					</CheckItem>

					<CheckItem
						checked={c => c.yahtzeeBonus}
						onChange={v => c => ({ ...c, yahtzeeBonus: v })}>
						Yahtzee Bonus (100pt. for each additional)
					</CheckItem>
				</Show>
			</div>
		</div>
	);
};

export default StartView;
