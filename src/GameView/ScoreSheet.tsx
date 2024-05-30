import { Component, For, Match, Switch } from "solid-js";
import { block } from "@lumiknit/solid-fekit";

import {
	Category,
	CATEGORY_LABELS,
	CategoryPoints,
	fillScore,
	FullCategory,
	GameState,
	getCategoryPoints,
	LOWER_SECTION_CATEGORIES,
	UPPER_SECTION_CATEGORIES,
} from "./state";

type EntryProps = {
	state: GameState;
	key: any;
	label: string;
	value: CategoryPoints;
};

const Entry: Component<EntryProps> = props => {
	return (
		<tr>
			<td class="score-cell-label"> {props.label} </td>
			<td class="score-cell-points">
				<Switch>
					<Match when={props.value.filled}>{props.value.value}</Match>
					<Match when={true}>
						<block.Button
							class="px-2"
							small
							color={props.value.value > 0 ? "primary" : "secondary"}
							onClick={fillScore(props.state, props.key)}>
							{props.value.value}
						</block.Button>
					</Match>
				</Switch>
			</td>
		</tr>
	);
};

type HalfSheetProps = {
	state: GameState;
	class: string;
	keys: Category[];
	footer: FullCategory[];
};

const HalfSheet: Component<HalfSheetProps> = props => {
	return (
		<table class={`half-sheet ${props.class}`}>
			<colgroup>
				<col style="width: 66%;" />
				<col style="width: 34%;" />
			</colgroup>
			<tbody>
				<For each={props.keys}>
					{i => (
						<Entry
							state={props.state}
							key={i}
							label={CATEGORY_LABELS.get(i) || ""}
							value={getCategoryPoints(props.state, i)}
						/>
					)}
				</For>
			</tbody>
			<tfoot>
				<For each={props.footer}>
					{i => (
						<Entry
							state={props.state}
							key={i}
							label={CATEGORY_LABELS.get(i) || ""}
							value={getCategoryPoints(props.state, i as any)}
						/>
					)}
				</For>
			</tfoot>
		</table>
	);
};

type Props = {
	state: GameState;
};

const ScoreSheet: Component<Props> = props => {
	const upperFooters = [
		...(props.state.config.upperSectionBonus
			? (["upperSum", "upperSectionBonus"] as FullCategory[])
			: []),
	];

	return (
		<div class="p-2">
			<div class="score-sheet">
				<HalfSheet
					state={props.state}
					class="upper-sheet"
					keys={UPPER_SECTION_CATEGORIES}
					footer={upperFooters}
				/>
				<HalfSheet
					state={props.state}
					class="lower-sheet"
					keys={LOWER_SECTION_CATEGORIES}
					footer={["total"]}
				/>
			</div>
		</div>
	);
};

export default ScoreSheet;
