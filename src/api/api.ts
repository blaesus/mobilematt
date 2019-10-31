import ApolloClient from "apollo-boost";
import gql from "graphql-tag";
import { last } from "../utils";

export interface UserCore {
    id: string,
    uuid: string,
    userName: string,
    displayName: string,
    avatar: string,
}

export interface Article {
    id: string,
    topicScore: number
    slug: string,
    createdAt: string,
    title: string,
    mediaHash: string,
    state: string,
    public: boolean,
    live: boolean,
    cover: string | null,
    summary: string,
    author: string,
    dataHash: string,
    sticky: boolean,
    content: string,
    comments: Comment[],
}

export type ArticleDigest = Pick<
    Article,
    "id" | "title" | "author" | "summary" | "mediaHash"
    | "createdAt"
>

export interface Comment {
    id: string,
    createdAt: number,
    content: string,
    author: string,
    parent: string,
    replyTarget: string | null,
}

const client = new ApolloClient({
    uri: "https://server.matters.news/graphql"
});

const articleSummaryNewest = gql`
    query($first: Int!, $after: String) {
      viewer {
        recommendation {
          newest(input: {first: $first, after: $after}) {
            edges {
              cursor,
              node {
                id,
                title,
                slug,
                cover,
                public,
                live,
                author {
                    id,
                    uuid,
                    userName,
                    displayName,
                    avatar,
                },
                dataHash,
                sticky,
                summary,
                mediaHash,
              }
            }
          }
        }
      }
    }
`

interface ArticleSummaryResponseInner {
    id: string,
    title: string,
    slug: string,
    mediaHash: string,
    state: string,
    public: boolean,
    live: boolean,
    cover: string | null,
    summary: string,
    createdAt: string,
    author: UserCore,
    dataHash: string,
    sticky: boolean
}


interface ArticleSummaryResponse {
    viewer: {
        recommendation: {
            newest: {
                edges: {
                    cursor: string,
                    node: ArticleSummaryResponseInner
                }[]
            }
        }
    }
}


export async function fetchNewest(
    count: number,
    cursor?: string
): Promise<{summaries: ArticleDigest[], authors: UserCore[], lastCursor: string}> {
    const response = await client.query<ArticleSummaryResponse>({
        query: articleSummaryNewest,
        variables: {
            first: count,
            after: cursor,
        }
    });
    const edges = response.data.viewer.recommendation.newest.edges;
    const summaries: ArticleDigest[] = edges.map(edge => ({
        ...edge.node,
        author: edge.node.author.id,
    }));
    const authors: UserCore[] = edges.map(edge => edge.node.author);
    const lastCursor = last(edges).cursor;
    console.info(response.data.viewer.recommendation);
    return {
        summaries,
        lastCursor,
        authors,
    };
}

const fetchOneArticleQuery = gql`
query($mediaHash: String!) {
 article(input: {mediaHash: $mediaHash}) {
    id
    topicScore
    slug
    createdAt
    title
    mediaHash
    state
    public
    live
    cover
    summary
    author {
       id,
       uuid,
       userName,
       displayName,
       avatar,
    }
    dataHash
    sticky
    content
    slug,
    
    comments(input: {sort: newest}) {
      totalCount,
      edges {
        node {
          id,
          createdAt,
          content,
          author {
            id,
            uuid,
            userName,
            displayName,
            avatar,
          },
          parentComment {
            id,
          },
          replyTo {
            id,
          }
        }
      }
    }
 }
}
`;

interface CommentResponseNode extends Omit<Comment, "author"| "replyTarget" | "parent" | "createdAt"> {
    createdAt: string,
    author: UserCore,
    parentComment: {
        id: string,
    } | null,
    replyTo: {
        id: string,
    } | null
}

interface ArticleResponseNode extends Omit<Article, "author" | "comments"> {
    author: UserCore,
    comments: {
        edges: {
            node: CommentResponseNode
        }[]
    }

}

interface ArticleResponseData {
    article: ArticleResponseNode | null
}

export async function fetchArticle(
    mediaHash: string
): Promise<{article: Article, authors: UserCore[]} | null> {
    const response = await client.query<ArticleResponseData>({
        query: fetchOneArticleQuery,
        variables: {
            mediaHash,
        }
    });
    if (!response.data.article) {
        return null
    }
    const comments: Comment[] = response.data.article.comments.edges.map(edge => ({
        ...edge.node,
        author: edge.node.author.id,
        replyTarget: edge.node.replyTo && edge.node.replyTo.id,
        parent: edge.node.parentComment && edge.node.parentComment.id,
        createdAt: +new Date(edge.node.createdAt)
    }));
    const article: Article = {
        ...response.data.article,
        author: response.data.article.author.id,
        comments,
    };
    const authors: UserCore[] = [
        response.data.article.author,
        ...response.data.article.comments.edges.map(edge => edge.node.author),
    ];
    return {
        article,
        authors,
    };
}

const fetchUserQuery = gql`
query($userName: String) {
  user(userName: $userName) {
    id
  }
}
`;

interface UserResponse {
    id: string
}

export async function fetchUser(userName: string) {
    const response = await client.query<UserResponse>({
        query: fetchUserQuery,
        variables: {
            userName
        }
    });
    console.info(response)
}
