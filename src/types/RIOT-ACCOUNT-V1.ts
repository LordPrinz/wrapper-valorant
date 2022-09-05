export type AccountDto = {
	puuid: string;
	gameName: string;
	tagLine: string;
};

export type ActiveShardDto = {
	puuid: string;
	game: string;
	activeShard: string;
};

export type Queue =
	| "competetive"
	| "unrated"
	| "spikerush"
	| "tournamentmode"
	| "deathmatch"
	| "onefa"
	| "ggteam";
