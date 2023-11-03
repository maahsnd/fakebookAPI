const { faker } = require('@faker-js/faker');
const User = require('./models/User');
const FriendRequest = require('./models/FriendRequest');
const Post = require('./models/Post');
const Comment = require('./models/Comment');
const dotenv = require('dotenv').config();
require('./mongoConfig');

let users = [];
let posts = [];

function getRandomElementFromArray(arr) {
  if (arr.length === 0) {
    return null; // Return null for an empty array.
  }

  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
}

async function createRandomUser() {
  const user = new User({
    _id: faker.database.mongodbObjectId(),
    username: faker.person.fullName(),
    profilePhoto: faker.image.avatar()
  });
  await user.save();
  return user;
}

async function createFriendRequest(to, from) {
  const friendRequest = new FriendRequest({
    from: from._id,
    to: to._id
  });
  to.friendRequests.push(friendRequest);
  from.friendRequests.push(friendRequest);
  await Promise.all([to.save(), from.save(), friendRequest.save()]);
}

async function createPost(author) {
  let likes = [];
  for (let i = 0; i < 3; i++) {
    let user = getRandomElementFromArray(users);
    likes.push(user);
  }
  const post = new Post({
    author: author._id,
    text: faker.lorem.words({ min: 1, max: 20 }),
    comments: [],
    likes: likes
  });
  posts.push(post);
  await post.save();
}

async function createComment() {
  let post = getRandomElementFromArray(posts);
  const comment = new Comment({
    author: getRandomElementFromArray(users),
    text: faker.word.adjective({ min: 1, max: 50 }),
    post: post
  });
  post.comments.push(comment);
  await comment.save();
  await post.save();
}

async function seed() {
  const userCount = 5;

  for (let i = 0; i < userCount; i++) {
    const user = await createRandomUser();
    users.push(user);
  }

  for (let i = 0; i < users.length - 1; i++) {
    await createFriendRequest(users[i], users[i + 1]);
  }

  for (let i = 0; i < users.length - 1; i++) {
    await createPost(getRandomElementFromArray(users));
  }

  for (let i = 0; i < userCount * 3; i++) {
    await createComment();
  }
}

seed();
console.log('done');
return;
