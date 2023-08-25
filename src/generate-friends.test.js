import { assert, expect, use } from "chai";
import chaiEach from "chai-each";
import { generateFriends } from "./generate-friends.js";

use(chaiEach);

describe("generateFriends", (numEntries = 50) => {
    const getDummyData = () => {
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

            for (let key in friendPair) { // for each key ("member1_id" and "member2_id")
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

    it("returns an empty list when passed 0", () => {
        const data = getDummyData();
        const expected = [];
        const actual = generateFriends(data, 0);
        expect(actual).to.deep.equal(expected);
    });

    it("returns a list of objects containing the properties 'member1_id' and 'member2_id' when passed a non-zero value", () => {
        const data = getDummyData();
        const friendships = generateFriends(data, 1);
        const expectedKeys = ["member1_id", "member2_id"];

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
    })
});