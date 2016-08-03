import { Random } from 'meteor/random';
import casual from 'casual';
import { Tasks } from './collections';

export const schema = [`
type Email {
  address: String
  verified: Boolean
}

type User {
  emails: [Email]
  username: String
  randomString: String
}

type Task {
  _id: String
  title: String
}

type Mutation {
  deleteTask(title: String!): [Task]
}

type Query {
  user(id: String!): User
  tasks: [Task]
}

schema {
  query: Query
  mutation: Mutation
}
`]

let allTasks = [
  { _id: Random.id(), title: casual.title },
  { _id: Random.id(), title: casual.title },
  { _id: Random.id(), title: casual.title }
]

let getTasks = (callback) => {
  setTimeout(function() {
    callback(allTasks)
  }, 1000)
}

// function getTasks() {
//   // return setTimeout(() => {
//     return allTasks
//   // }, 100)
// }

export const resolvers = {
  Query: {
    async user(root, args, context) {
      // Only return the current user, for security
      if (context.userId === args.id) {
        return await Meteor.users.findOne(context.userId);
      }
    },
    async tasks() {
      return await Tasks.find().fetch();
    }
  },
  User: {
    emails: ({emails}) => emails,
    randomString: () => Random.id(),
  },
  Mutation: {
    deleteTask(_, { title }, context) {
      console.log(title);
      Tasks.remove({ title });
      return Tasks.find().fetch()
    }
  }
}
