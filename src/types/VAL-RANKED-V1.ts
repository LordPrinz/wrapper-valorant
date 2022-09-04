import { long } from "./alias";

export type LeaderboardDto = {
	shard: string;
	actId: string;
	totalPlayers: long;
	players: PlayerDto[];
};

export type PlayerDto = {
	puuid: string;
	gameName: string;
	tagLine: string;
	leaderboardRank: long;
	rankedRating: long;
	numberOfWins: long;
};
