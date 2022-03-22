import React from "react";
import { View, Text } from "react-native";
import { useFonts } from "expo-font";
// REACT ROUTER DOM
import { useNavigate } from "react-router-dom";
import Collapse from "../../components/ui/collapse/Collapse";
import PressableButton from "../../components/ui/PressableButton";
import FlatUsers from "../../components/ui/flatUsers/FlatUsers";
import { connect } from "react-redux";
import gameWss from "../../services/gameWss";
import style from "./style";
import { findIndexMatchToPlay } from "space-rock-scissor-paper-game-engine/lib/utils";

const Tournament = (props) => {
	const [loaded] = useFonts({
		Toons: require("../../assets/fonts/Mikey.ttf"),
		Sponge: require("../../assets/fonts/Sponge.ttf"),
	});

	let navigate = useNavigate();

	React.useEffect(() => {
		if (props.availableMatch) {
			navigate(`/game`);
		}
	}, [props.availableMatch]);

	const askWssToStartGame = () => {
		gameWss.send(
			JSON.stringify({
				channel: "LOBBY",
				action: {
					type: "GAME_START",
					payload: {
						id: props.gameId,
					},
				},
			})
		);
	};

	const getPhasesElements = React.useCallback(
		(matches) => {
			console.log(matches);
			const maxPhase = matches[matches.length - 1].phase;
			const buffer = [];
			for (let phase = 1; phase <= maxPhase; phase++) {
				const bufferMatchesByPhase = [];
				for (let j = 0; j < matches.length; j++) {
					if (matches[j].phase === phase) {
						bufferMatchesByPhase.push(matches[j]);
					}
				}
				console.log(bufferMatchesByPhase);
				buffer.push([...bufferMatchesByPhase]);
			}
			console.log(buffer);
			return buffer.map((phase, index) => (
				<View key={`${props.nameLobby}-phase${index + 1}`}>
					<Collapse phaseTitle={`Phase ${index + 1}`} matches={phase} />
				</View>
			));
		},
		[props.nameLobby]
	);

	return (
		<View style={style.container}>
			<View style={style.modalContent}>
				{/* {_renderModalContent()} */}
				<Text style={style.title}>{props.nameLobby}</Text>
				<Text style={style.text}>
					Players {props.users.length}/{props.maxPlayerNum}
				</Text>
				{/* <ScrollView style={{ height: "60%" }}> */}
				{props.phase === 0 && props.matches.length < 1 ? (
					<>
						{props.userId === props.creator.id ? (
							<PressableButton
								position={{ bottom: 100, right: 80 }}
								buttonText="Start"
								onPressCallBack={askWssToStartGame}
							/>
						) : (
							<Text style={style.text}>
								Wait for {props.creator.name} to start the game
							</Text>
						)}
						<FlatUsers users={props.users} />
					</>
				) : (
					getPhasesElements(props.matches)
				)}
				{/* </ScrollView> */}
			</View>
		</View>
	);
};

const mapStateToProps = (state) => ({
	phase: state.lobby.game.phase ?? 0,
	gameId: state.lobby.id,
	availableMatch: findIndexMatchToPlay(state.user.id, state.lobby.game) > -1,
	maxPlayerNum: state.lobby.game.playerNum,
	users: state.lobby.users,
	nameLobby: state.lobby.name,
	creator: state.lobby.creator,
	userId: state.user.id,
	matches: state.lobby.game.matches,
});

export default connect(mapStateToProps)(Tournament);
