import GE from "space-rock-scissor-paper-game-engine";

/**
 * @typedef { ReturnType< typeof GE.create > } Game
 */

const SET_LOBBY = "generic/game/SET_LOBBY";

/**
 *
 * @param { { game: Game; id: number; } } lobby
 * @returns { { type: SET_LOBBY; payload: { lobby: { game: Game; id: number; } } } }
 */
export const setLobby = (lobby) => ({
	type: SET_LOBBY,
	payload: { lobby },
});

const INIT_STATE = {
	game: {
		matches: [],
		maxMatchVictories: 0,
		players: [],
		playerNum: 0,
	},
	id: 0,
};

export default (state = INIT_STATE, action) => {
	switch (action.type) {
		case SET_LOBBY:
			return { ...action.payload.lobby };

		default:
			return state;
	}
};