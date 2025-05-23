import { redis } from "@/lib/redis/redis";

const notificationServiceKey = "flappy-frog";

const ONE_DAY = 60 * 60 * 24;

const getUserGamePlayKey = (fid: number): string => {
  return `${notificationServiceKey}:hearts:${fid}`;
};

export const setTTL = async (fid: number) => {
  if (!redis) {
    return null;
  }
  try {
    const ttl = Math.floor(Date.now() / 1000) + ONE_DAY;
    await redis.expireat(getUserGamePlayKey(fid), ttl);
    return true;
  } catch (error) {
    console.error(error);
  }
};

export const setUserGamePlay = async (fid: number, hearts: number) => {
  if (!redis) {
    return null;
  }
  try {
    return await redis.set<number>(getUserGamePlayKey(fid), hearts, {
      keepTtl: true,
    });
  } catch (error) {
    console.error(error);
  }
};

export const getUserGamePlay = async (fid: number) => {
  if (!redis) {
    return null;
  }
  try {
    return await redis.get<number>(getUserGamePlayKey(fid));
  } catch (error) {
    console.error(error);
  }
};

export const updateLeaderboard = async (
  fid: number,
  displayName: string,
  score: number,
) => {
  if (!redis) {
    return null;
  }
  try {
    const leaderboardKey = `${notificationServiceKey}:leaderboard`;

    const existingScore = await redis.zscore(
      leaderboardKey,
      `${fid}:${displayName}`,
    );
    if (existingScore === null || existingScore < score) {
      // If the user doesn't exist or the score is higher than the existing one, add or update it.
      await redis.zadd(leaderboardKey, {
        score,
        member: `${fid}:${displayName}`,
      });
      return {
        updated: true,
        personalRecord: true,
      };
    }
    return {
      updated: false,
      personalRecord: false,
    };
  } catch (error) {
    console.error(error);
  }
};

export const getNthTopPlayers = async (limit: number) => {
  if (!redis) {
    return null;
  }
  try {
    const leaderboardKey = `${notificationServiceKey}:leaderboard`;
    return await redis.zrange(leaderboardKey, 0, limit - 1, {
      rev: true,
      withScores: true,
    });
  } catch (error) {
    console.error(error);
  }
};

export const getEndOfGame = async () => {
  if (!redis) {
    return null;
  }
  try {
    const endOfGameKey = `${notificationServiceKey}:end-of-game`;
    return await redis.get(endOfGameKey);
  } catch (error) {
    console.error(error);
  }
};
