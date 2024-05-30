import { Toaster } from "solid-toast";

import "@lumiknit/solid-fekit/dist/index.css";
import "@lumiknit/solid-fekit/dist/block.css";
import StartView from "./StartView";
import { createSignal, Match, Switch } from "solid-js";
import GameView from "./GameView/GameView";
import { config51WordwideGames } from "./game";
import { initialState } from "./GameView/state";
import ScoreView from "./ScoreView";

type ViewState = "start" | "game" | "score";

const App = () => {
	const [view, setView] = createSignal<ViewState>("start");
	const [config, setConfig] = createSignal(config51WordwideGames());
	const [state, setState] = createSignal(initialState(config()));

	const handleGameOver = () => {
		setView("score");
	};

	const handleReturn = () => {
		setView("start");
	};

	const handleStart = () => {
		setView("game");
		const newState = initialState(config());
		newState.onGameOver = handleGameOver;
		setState(newState);
	};

	return (
		<>
			<Toaster />
			<Switch>
				<Match when={view() === "start"}>
					<StartView
						config={config()}
						setConfig={setConfig}
						start={handleStart}
					/>
				</Match>
				<Match when={view() === "game"}>
					<GameView state={state()} />
				</Match>
				<Match when={view() === "score"}>
					<ScoreView state={state()} onReturn={handleReturn} />
				</Match>
			</Switch>
		</>
	);
};

export default App;
