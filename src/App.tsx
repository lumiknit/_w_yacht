import { Toaster } from "solid-toast";

import "@lumiknit/solid-fekit/dist/index.css";
import "@lumiknit/solid-fekit/dist/block.css";
import StartView from "./StartView";
import { createSignal, Match, Switch } from "solid-js";
import GameView from "./GameView/GameView";
import { config51WordwideGames } from "./game";

const App = () => {
	const [config, setConfig] = createSignal(config51WordwideGames());
	const [started, setStarted] = createSignal(false);

	return (
		<>
			<Toaster />
			<Switch>
				<Match when={!started()}>
					<StartView
						config={config()}
						setConfig={setConfig}
						start={() => setStarted(true)}
					/>
				</Match>
				<Match when={started()}>
					<GameView config={config()} />
				</Match>
			</Switch>
		</>
	);
};

export default App;
