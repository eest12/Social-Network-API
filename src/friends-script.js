import { generateFriends } from "./generate-friends";
import members from "../data/members.json" assert { type: "json" };

const args = process.argv.slice(2);
const maxFriends = args.length > 0 ? Number(args[0]) : 25;

const friends = generateFriends(members, maxFriends);