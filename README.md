# Social Network API

An API to simulate a social network where members can friend each other. Uses Express and a file system for data storage.

## Setup

Install Node dependencies:

    npm install

Start server on `localhost:3000`:

    npm run start

## HTTP Routes

<table>
    <tr>
        <th>Path</th>
        <th>Method</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>/members</td>
        <td>GET</td>
        <td>Get all members</td>
    </tr>
    <tr>
        <td rowspan="2">/member/:id</td>
        <td>GET</td>
        <td>Get member</td>
    </tr>
    <tr>
        <td>DELETE</td>
        <td>Delete member and all friendships associated with it</td>
    </tr>
    <tr>
        <td>/member/:id/friends</td>
        <td>GET</td>
        <td>Get member's friends</td>
    </tr>
    <tr>
        <td rowspan="3">/member/:id1/friend/:id2</td>
        <td>GET</td>
        <td>Get member's friend (or empty set if the two members are not friends)</td>
    </tr>
    <tr>
        <td>POST</td>
        <td>Add member as friend</td>
    </tr>
    <tr>
        <td>DELETE</td>
        <td>Remove member as friend</td>
    </tr>
    <tr>
        <td>/member/:id/feed</td>
        <td>GET</td>
        <td>Get member feed consisting of friends' statuses</td>
    </tr>
    <tr>
        <td>/register</td>
        <td>POST</td>
        <td>Create new member</td>
    </tr>
</table>

## Data

The `data` directory contains two files: `members.json` and `friendships.json`.

### Members

The `members.json` file contains mock data that was generated using [Mockaroo](https://www.mockaroo.com/). It contains 50 rows and these fields (using Mockaroo's attributes):

| Field Name | Type                       |
| ---------- | -------------------------- |
| id         | Row Number (Primary Key)   |
| username   | Username                   |
| first_name | First Name                 |
| last_name  | Last Name                  |
| email      | Email Address              |
| gender     | Gender                     |
| birthdate  | Datetime                   |
| avatar     | Avatar                     |

### Friendships

The `friendships.json` file was generated using the `src/friends-script.js` script. It consists of randomly assigned friendships between the members in `members.json`. A friendship is denoted by the key-value pair `member1_id: member2_id`. The fields look like this:

| Field Name | Type                     |
| ---------- | ------------------------ |
| member1_id | Row Number (Foreign Key) |
| member2_id | Row Number (Foreign Key) |

The following command can be used to generate new friendships:

    node src/friends-script.js [max_friends]

The optional `max_friends` argument specifies the maximum number of friends a single member can have. The default value is 25.