import {
	BsDice1Fill,
	BsDice2Fill,
	BsDice3Fill,
	BsDice4Fill,
	BsDice5Fill,
	BsDice6Fill,
	BsSquare,
} from "solid-icons/bs";
import { Accessor, Component } from "solid-js";
import { Dynamic } from "solid-js/web";
import { DiceState } from "./state";

type Props = {
	rolling: Accessor<number | undefined>;
	dice: Accessor<DiceState>;
	onClick: () => void;
};

const Dice: Component<Props> = props => {
	const icons = [
		() => <BsSquare />,
		() => <BsDice1Fill />,
		() => <BsDice2Fill />,
		() => <BsDice3Fill />,
		() => <BsDice4Fill />,
		() => <BsDice5Fill />,
		() => <BsDice6Fill />,
	];

	const diceValueClass = () => `dice-${props.dice().value}-c`;
	const diceAdditionalClass = () =>
		props.dice().kept
			? "kept-dice"
			: props.rolling() !== undefined
				? "rolling"
				: "";

	return (
		<div
			class={`dice ${diceValueClass()} ${diceAdditionalClass()}`}
			onClick={props.onClick}>
			<Dynamic component={icons[props.dice().value]} />
		</div>
	);
};

export default Dice;
