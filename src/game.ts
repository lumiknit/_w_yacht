export type GameConfig = {
	upperSectionBonus: boolean;

	smallStraightScore: number;
	largeStraightScore: number;

	fullHouseFixedScore: boolean;
	yachtIsFullHouse: boolean;

	threeOfAKind: boolean;
	threeOfAKindAll: boolean;
	fourOfAKindAll: boolean;

	yahtzeeBonus: boolean;
};

export const config51WordwideGames = (): GameConfig => ({
	upperSectionBonus: true,

	smallStraightScore: 15,
	largeStraightScore: 30,

	fullHouseFixedScore: false,
	yachtIsFullHouse: true,

	threeOfAKind: false,
	threeOfAKindAll: true,
	fourOfAKindAll: true,

	yahtzeeBonus: false,
});

export const configOriginalYacht = (): GameConfig => ({
	upperSectionBonus: false,

	smallStraightScore: 30,
	largeStraightScore: 30,

	fullHouseFixedScore: false,
	yachtIsFullHouse: false,

	threeOfAKind: false,
	threeOfAKindAll: false,
	fourOfAKindAll: false,

	yahtzeeBonus: false,
});

export const configOriginalYahtzee = (): GameConfig => ({
	upperSectionBonus: true,

	smallStraightScore: 30,
	largeStraightScore: 40,

	fullHouseFixedScore: true,
	yachtIsFullHouse: false,

	threeOfAKind: true,
	threeOfAKindAll: true,
	fourOfAKindAll: true,

	yahtzeeBonus: true,
});
