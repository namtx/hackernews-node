import { GraphQLServer } from 'graphql-yoga';
import { Prisma } from 'prisma-binding';

const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews clone`,
    feed: (root, args, context, info) => {
      return context.db.query.links({}, info);
    }
  },
  
  Mutation: {
    post: (root, args, context, info) => {
      return context.db.mutation.createLink({
        data: {
          url: args.url,
          description: args.description
        }
      }, info)
    }
  }
};

const db = new Prisma({
  typeDefs: './src/generated/prisma.graphql',
  endpoint: 'http://localhost:4466',
  secret: 'my-secret',
  debug: true
});

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: (req) => ({...req, db}),
});

server.start(() => console.log(`Server is running on http://localhost:4000`));

