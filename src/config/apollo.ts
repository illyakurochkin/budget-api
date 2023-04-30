import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import {
  DirectiveLocation,
  GraphQLBoolean,
  GraphQLDirective,
  GraphQLEnumType,
  GraphQLInt,
} from 'graphql';
import * as path from 'path';
import cors from './cors';

export interface CookieAttributes {
  domain?: string;
  encode?: (cookie: string) => string;
  expires?: number | Date;
  httpOnly?: boolean;
  maxAge?: number;
  path?: string;
  priority?: string;
  sameSite?: 'strict' | 'Strict' | 'lax' | 'Lax' | 'none' | 'None' | boolean;
  secure?: boolean;
  signed?: boolean;
}

export interface CustomContext {
  req: {
    headers?: { authorization?: string };
    cookies?: Record<string, string>;
    user?: any;
  };
  res: {
    cookie: (key: string, value: string, attributes?: CookieAttributes) => void;
  };
}

export const apolloConfig: ApolloDriverConfig = {
  autoSchemaFile: path.join(
    process.cwd(),
    'apps',
    'api',
    'generated',
    'schema.gql',
  ),
  bodyParserConfig: { limit: '10mb', type: 'application/json' },
  buildSchemaOptions: {
    directives: [
      new GraphQLDirective({
        name: 'cacheControl',
        locations: [
          DirectiveLocation.FIELD_DEFINITION,
          DirectiveLocation.OBJECT,
          DirectiveLocation.INTERFACE,
          DirectiveLocation.UNION,
        ],
        args: {
          maxAge: { type: GraphQLInt },
          scope: {
            type: new GraphQLEnumType({
              name: 'CacheControlScope',
              values: {
                PUBLIC: {
                  astNode: {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    kind: 'EnumValueDefinition',
                    description: undefined,
                    name: {
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-ignore
                      kind: 'Name',
                      value: 'PUBLIC',
                    },
                    directives: [],
                  },
                },
                PRIVATE: {
                  astNode: {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    kind: 'EnumValueDefinition',
                    description: undefined,
                    name: {
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-ignore
                      kind: 'Name',
                      value: 'PRIVATE',
                    },
                    directives: [],
                  },
                },
              },
            }),
          },
          inheritMaxAge: { type: GraphQLBoolean },
        },
      }),
    ],
  },
  context: ({ connection, extra, req, res }) => {
    if (extra) return extra;
    if (connection) return { req: connection.context };
    return { req, res };
  },
  cors,
  debug: process.env.ENV !== 'production',
  driver: ApolloDriver,
  fieldResolverEnhancers: ['guards'],
  formatError: (error) => ({
    message: (error.extensions.response as any)?.message ?? error.message,
    status: (error.extensions.exception as any)?.status,
  }),
  introspection: true,
  playground: process.env.ENV !== 'production',
  sortSchema: true,
};
