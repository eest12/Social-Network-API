import fs from "fs";
import { generateFriends } from "./generate-friends.js";
import members from "../data/members.json" assert { type: "json" };

const MAX_FRIENDS_DEFAULT = 25;
const maxFriends = Number(process.argv[2]) || MAX_FRIENDS_DEFAULT;
const friends = generateFriends(members, maxFriends);
const friendsJson = JSON.stringify(friends);

try {
    fs.writeFileSync("data/friendships.json", friendsJson);
} catch (e) {
    console.log(e);
}