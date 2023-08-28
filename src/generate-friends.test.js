import { assert, expect, use } from "chai";
import chaiEach from "chai-each";
import { generateFriends } from "./generate-friends.js";

use(chaiEach);

const MEMBER1 = "member1_id";
const MEMBER2 = "member2_id";

const getDummyData = (numEntries = 50) => {
    const dummyVals = {
        "username": "abcd",
        "first_name": "abcd",
        "last_name": "abcd",
        "email": "abcd",
        "gender": "abcd",
        "birthdate": "abcd",
        "avatar": "abcd"
    };

    const dataArray = [];

    for (let i = 1; i <= numEntries; i++) {
        const dummyValsCopy = { ...dummyVals };
        dummyValsCopy.id = i;
        dataArray.push(dummyValsCopy);
    }

    return dataArray;
};

const maxFriendCount = (friendships) => {
    const friendedMembers = {};
    let maxFriends = 0;

    // add all member IDs to friendedMembers and count the amount of times they appear
    for (let i = 0; i < friendships.length; i++) { // for each friendship pair
        const friendPair = friendships[i];

        for (let key in friendPair) { // for each key (MEMBER1 and MEMBER2)
            if (friendPair[key] in friendedMembers) {
                friendedMembers[friendPair[key]] += 1;
            } else {
                friendedMembers[friendPair[key]] = 1;
            }

            // update the maxFriends count if a new high value has been reached
            if (friendedMembers[friendPair[key]] > maxFriends) {
                maxFriends = friendedMembers[friendPair[key]];
            }
        }
    }

    return maxFriends;
};

describe("generateFriends", () => {
    it("returns an empty list when passed 0", () => {
        const data = getDummyData();
        const expected = [];
        const actual = generateFriends(data, 0);
        expect(actual).to.deep.equal(expected);
    });

    it("returns a list of objects containing the properties defined by MEMBER1 and MEMBER2 when passed a non-zero value", () => {
        const data = getDummyData();
        const friendships = generateFriends(data, 1);
        const expectedKeys = [MEMBER1, MEMBER2];

        expect(friendships).to.each.have.all.keys(expectedKeys);
    });

    it("returns a list of member pairs where each member appears only once (meaning members have at most one friend) when passed 1", () => {
        const data = getDummyData();
        const expectedMaxFriends = 1;
        const friendships = generateFriends(data, expectedMaxFriends);
        const actualMaxFriends = maxFriendCount(friendships);

        expect(actualMaxFriends).to.be.at.most(expectedMaxFriends);
    });

    it("returns a list of member pairs where each member appears a maximum of 3 times (meaning members have at most 3 friends) when passed 3", () => {
        const data = getDummyData();
        const expectedMaxFriends = 3;
        const friendships = generateFriends(data, expectedMaxFriends);
        const actualMaxFriends = maxFriendCount(friendships);

        expect(actualMaxFriends).to.be.at.most(expectedMaxFriends);
    });

    it("returns a list of member pairs (m1, m2) such that m1 != m2", () => {
        const data = getDummyData();
        const friendships = generateFriends(data, 20);

        expect(friendships).to.each.satisfy((friendship) => {
            return friendship[MEMBER1] != friendship[MEMBER2];
        });
    });

    it("returns a list of unique member pairs such that (m1, m2) appears only once", () => {
        const data = getDummyData();
        const friendships = generateFriends(data, 20);
        const friendsByMember = {}; // memberId: Set(friend1, friend2, ...)
        let duplicateFriendshipFound = false;

        for (let i = 0; i < friendships.length; i++) {
            const friendship = friendships[i];

            if (friendship[MEMBER1] in friendsByMember) { // if MEMBER1 exists...
                // make sure (MEMBER1, MEMBER2) friendship doesn't already exist
                if (friendsByMember[friendship[MEMBER1]].has(friendship[MEMBER2])) {
                    duplicateFriendshipFound = true;
                    break;
                } else { // update friend list of MEMBER1
                    friendsByMember[friendship[MEMBER1]].add(friendship[MEMBER2]);
                }
            } else { // if MEMBER1 doesn't exist, add it as a new member
                friendsByMember[friendship[MEMBER1]] = new Set([friendship[MEMBER2]]);
            }
        }

        expect(duplicateFriendshipFound).to.be.false;
    });

    it("returns a list of member pairs such that if (m1, m2) is a pair, there is no such pair (m2, m1)", () => {
        const data = getDummyData();
        const friendships = generateFriends(data, 20);
        const friendsByMember = {}; // memberId: Set(friend1, friend2, ...)
        let reverseFriendshipFound = false;


        for (let i = 0; i < friendships.length; i++) {
            const friendship = friendships[i];

            // make sure (MEMBER2, MEMBER1) friendship doesn't exist
            if (friendship[MEMBER2] in friendsByMember && friendsByMember[friendship[MEMBER2]].has(friendship[MEMBER1])) {
                reverseFriendshipFound = true;
                break;
            }

            if (!(friendship[MEMBER1] in friendsByMember)) { // add current member as new member
                friendsByMember[friendship[MEMBER1]] = new Set([friendship[MEMBER2]]);
            } else { // update friend list of current member
                friendsByMember[friendship[MEMBER1]].add(friendship[MEMBER2]);
            }
        }

        expect(reverseFriendshipFound).to.be.false;
    });
});