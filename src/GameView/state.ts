import { Accessor, batch, createSignal, Setter } from "solid-js";
import { GameConfig } from "../game";
import toast from "solid-toast";

export type DiceState = {
	value: number;
	kept: boolean;
};

export type Category =
	| 1
	| 2
	| 3
	| 4
	| 5
	| 6
	| "threeOfAKind"
	| "fourOfAKind"
	| "fullHouse"
	| "smallStraight"
	| "largeStraight"
	| "yaucht"
	| "chance";
export type Points = { [key in Category]?: number };

export type FullCategory =
	| Category
	| "total"
	| "upperSum"
	| "upperSectionBonus";

export const UPPER_SECTION_CATEGORIES: Category[] = [1, 2, 3, 4, 5, 6];

export const LOWER_SECTION_CATEGORIES: Category[] = [
	"chance",
	"threeOfAKind",
	"fourOfAKind",
	"fullHouse",
	"smallStraight",
	"largeStraight",
	"yaucht",
];

export const CATEGORY_LABELS = new Map<FullCategory, string>([
	[1, "Ones"],
	[2, "Twos"],
	[3, "Threes"],
	[4, "Fours"],
	[5, "Fives"],
	[6, "Sixes"],
	["chance", "Chance"],
	["threeOfAKind", "Three of a Kind"],
	["fourOfAKind", "Four of a Kind"],
	["fullHouse", "Full House"],
	["smallStraight", "Small Straight"],
	["largeStraight", "Large Straight"],
	["yaucht", "Yaucht"],
	// Aggregation
	["upperSum", "Up Sum (63- bonus)"],
	["upperSectionBonus", "Bonus"],
	["total", "Total"],
]);

export type GameState = {
	config: GameConfig;

	dices: Accessor<DiceState[]>;
	setDices: Setter<DiceState[]>;

	scores: Accessor<Points>;
	setScores: Setter<Points>;

	leftRolls: Accessor<number>;
	setLeftRolls: Setter<number>;

	rolling: Accessor<number | undefined>;
	setRolling: Setter<number | undefined>;

	onGameOver?: () => void;
};

export const initialState = (config: GameConfig): GameState => {
	const [dices, setDices] = createSignal(
		[1, 2, 3, 4, 5].map(() => ({ value: 0, kept: false })),
	);
	const [scores, setScores] = createSignal({});
	const [leftRolls, setLeftRolls] = createSignal(3);
	const [rolling, setRolling] = createSignal<number | undefined>(undefined);

	if (!config.threeOfAKind) {
		setScores(s => ({ ...s, threeOfAKind: 0 }));
	}

	return {
		config,
		dices,
		setDices,
		scores,
		setScores,
		leftRolls,
		setLeftRolls,
		rolling,
		setRolling,
	};
};

export const resetDiceRolls = (state: GameState) => {
	state.setLeftRolls(3);
	state.setDices(ds => ds.map(() => ({ value: 0, kept: false })));
};

const setDicesRandom = (state: GameState) => {
	state.setDices(ds => {
		return ds.map(dice =>
			dice.kept
				? dice
				: { value: Math.floor(Math.random() * 6) + 1, kept: false },
		);
	});
};

export const rollDices = (state: GameState) => {
	if (state.rolling() !== undefined) {
		return;
	}

	state.setRolling(
		setInterval(() => {
			setDicesRandom(state);
		}, 30),
	);
};

export const stopRollDices = (state: GameState) => {
	if (state.rolling() === undefined) {
		return;
	}
	batch(() => {
		setDicesRandom(state);
		state.setLeftRolls(rolls => rolls - 1);
		state.setRolling(r => {
			clearInterval(r);
			return undefined;
		});
	});
};

export const toggleKeepDices = (state: GameState, indices: Set<number>) => {
	state.setDices(ds => {
		return ds.map((dice, i) =>
			indices.has(i)
				? {
						...dice,
						kept: !dice.kept && dice.value !== 0,
					}
				: dice,
		);
	});
};

export const checkUpperSectionBonus = (state: GameState): boolean => {
	const scores = state.scores();
	if (state.config.upperSectionBonus) {
		let upperSectionSum = 0;
		([1, 2, 3, 4, 5, 6] as Array<Category>).forEach(cat => {
			upperSectionSum += scores[cat] || 0;
		});
		if (upperSectionSum >= 63) {
			return true;
		}
	}
	return false;
};

export const calculateScore = (state: GameState): number => {
	// Sum of all points
	let sum = 0;
	Object.entries(state.scores()).forEach(value => {
		sum += value[1];
	});

	// If the upper section bonus is enabled, add 35 points if the sum of the upper section is 63 or higher
	if (state.config.upperSectionBonus && checkUpperSectionBonus(state)) {
		sum += 35;
	}
	return sum;
};

export type CategoryPoints = {
	filled?: boolean;
	value: number;
};

export const guessScore = (state: GameState, category: Category): number => {
	const dices = state.dices();
	const sorted = dices.map(d => d.value).sort((a, b) => a - b);
	console.log(sorted);
	const count = [0, 0, 0, 0, 0, 0, 0];
	sorted.forEach(d => count[d]++);

	if (typeof category === "number") {
		// Sum of all dices with the value of the category
		return count[category] * category;
	}
	switch (category) {
		case "threeOfAKind": {
			const idx = count.findIndex(c => c >= 3);
			if (idx <= 0) return 0;
			return state.config.threeOfAKindAll
				? sorted.reduce((a, b) => a + b, 0)
				: idx * 3;
		}
		case "fourOfAKind": {
			// Check if there are at least 4 dices with the same value
			const idx = count.findIndex(c => c >= 4);
			if (idx <= 0) return 0;
			return state.config.threeOfAKindAll
				? sorted.reduce((a, b) => a + b, 0)
				: idx * 4;
		}
		case "fullHouse": {
			// Check if there are 3 dices with the same value and 2 dices with another value
			let eyes = [0, 0];
			if (state.config.yachtIsFullHouse) {
				const idx = count.findIndex(c => c === 5);
				if (idx > 0) {
					eyes = [idx, idx];
				}
			}
			const idx1 = count.findIndex(c => c === 3);
			const idx2 = count.findIndex(c => c === 2);
			if (idx1 > 0 && idx2 > 0) {
				eyes = [idx1, idx2];
			}
			if (eyes[0] < 1 || eyes[1] < 1) {
				return 0;
			}
			return state.config.fullHouseFixedScore ? 25 : eyes[0] * 3 + eyes[1] * 2;
		}
		case "chance":
			// Sum of all dices
			return sorted.reduce((a, b) => a + b, 0);
		case "smallStraight": {
			// Check if there are 4 dices in a row
			let cont = 0;
			for (let i = 1; i <= 6 && cont < 4 && 7 - i >= 4 - cont; i++) {
				if (count[i] > 0) {
					cont++;
				} else {
					cont = 0;
				}
			}
			return cont >= 4 ? state.config.smallStraightScore : 0;
		}
		case "largeStraight":
			// Check if there are 5 dices in a row
			for (let i = 1; i < 5; i++) {
				if (sorted[i - 1] + 1 !== sorted[i]) {
					return 0;
				}
			}
			return state.config.largeStraightScore;
		case "yaucht":
			// Check if all dices have the same value
			return count.findIndex(c => c === 5) > 0 ? 50 : 0;
	}
};

export const getCategoryPoints = (
	state: GameState,
	category: FullCategory,
): CategoryPoints => {
	const filled = (s: number) => ({ filled: true, value: s });
	switch (category) {
		case "total":
			return filled(calculateScore(state));
		case "upperSum":
			return filled(
				UPPER_SECTION_CATEGORIES.reduce(
					(acc, cat) => acc + (state.scores()[cat] || 0),
					0,
				),
			);
		case "upperSectionBonus":
			return filled(checkUpperSectionBonus(state) ? 35 : 0);
		default: {
			const scores = state.scores();
			return scores[category] !== undefined
				? filled(scores[category]!)
				: { filled: false, value: guessScore(state, category) };
		}
	}
};

export const fillScore = (state: GameState, category: Category) => () => {
	if (state.rolling() !== undefined || state.scores()[category] !== undefined) {
		return;
	}
	if (state.dices().findIndex(x => x.value < 1) >= 0) {
		toast.error("Please roll the dice!");
		return;
	}

	const dices = state.dices();
	let isYaucht = true;
	for (let i = 0; i < dices.length; i++) {
		if (dices[i].value !== dices[0].value) {
			isYaucht = false;
			break;
		}
	}

	const score = guessScore(state, category);
	batch(() => {
		state.setScores(scores => ({ ...scores, [category]: score }));
		// If yacht is filled and the dice is one more yacht, add 100 points

		if (
			state.config.yahtzeeBonus &&
			category !== "yaucht" &&
			isYaucht &&
			state.scores()["yaucht"] !== undefined
		) {
			state.setScores(scores => ({
				...scores,
				["yaucht"]: (scores["yaucht"] || 0) + 100,
			}));
		}
		// Reset dices
		resetDiceRolls(state);

		// Check game over
		for (let cat of [
			...UPPER_SECTION_CATEGORIES,
			...LOWER_SECTION_CATEGORIES,
		]) {
			if (state.scores()[cat] === undefined) {
				return;
			}
		}
		state.onGameOver?.();
	});
};
