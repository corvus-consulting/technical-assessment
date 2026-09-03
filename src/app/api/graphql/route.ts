import { createYoga, createSchema } from "graphql-yoga";
import { typeDefs } from "@/graphql/schema";
import { resolvers, type Context } from "@/graphql/resolvers";
import { getSessionUser } from "@/lib/session";

const schema = createSchema({ typeDefs, resolvers });

const yoga = createYoga<{}, Context>({
  schema,
  graphqlEndpoint: "/api/graphql",
  fetchAPI: { Response },
  context: async (): Promise<Context> => ({
    user: await getSessionUser(),
  }),
});

function handleRequest(request: Request) {
  return yoga.handleRequest(request, {});
}

export { handleRequest as GET, handleRequest as POST, handleRequest as OPTIONS };
