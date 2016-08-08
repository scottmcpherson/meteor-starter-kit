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
  deleteTask(_id: String!): [Task]
  addTask(title: String!): Task
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
    addTask(_, { title }, context) {
      const _id = Tasks.insert({ title });
      return { _id };
      return Tasks.findOne(id);
    },
    deleteTask(_, { _id }, context) {
      Tasks.remove({ _id });
      return Tasks.find().fetch()
    }
  }
}
