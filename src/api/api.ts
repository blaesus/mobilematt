interface UserInfo {
    __typename: 'UserInfo',
    description: string,
}

interface User {
    __typename: 'User',
    id: string,
    userName: string,
    displayName: string,
    info: UserInfo,
    avatar: string,
    isFollower: false,
    isFollowee: false
}

interface ArticleConnection {
    __typename: 'ArticleConnection',
    totalCount: number,
}

interface UserEdge {
    __typename: 'UserEdge'
    cursor: string,
    node: Pick<User, "id" | "userName" | "displayName" | "avatar" >,
}

interface UserConnection {
    __typename: 'UserConnection',
    totalCount: number,
    edger: UserEdge[]
}

interface ArticleEdgeInner {
    __typename: 'ArticleEdge'
    cursor: string,
    node: Pick<
        Article<Pick<User, "__typename" | "id" | "userName" | "displayName">>,
        "__typename" | "id" | "title" | "slug" | "cover" | "summary"
        | "mediaHash" | "live" | "author" | "subscribed" | "createdAt"
        | "MAT" | "responseCount" | "state"
        >
}

interface ArticleEdgeOuter {
    __typename: 'ArticleEdge'
    cursor: string,
    node: ArticleEdgeInner[],
}

interface ArticleConnectionForRelatedArticles {
    __typename: 'ArticleConnection',
    edges: ArticleEdgeOuter[],
}

export interface Article<U=User> {
    __typename: 'Article',
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
    author: U,
    collection: ArticleConnection,
    subscribed: boolean,
    content: string,
    tags: [],
    MAT: number,
    hasAppreciate: boolean,
    appreciateLimit: number,
    appreciateLeft: number,
    appreciators: UserConnection[],
    responseCount: number,
    collectedBy: ArticleConnection,
    relatedArticles: ArticleConnectionForRelatedArticles,
    dataHash: string,
    sticky: boolean
}

interface PageInfo {
    __typename: 'PageInfo'
    startCursor: string,
    endCursor: string,
    hasNextPage: boolean,
}

interface ArticleEdgeRecommendation {
    __typename: 'ArticleEdge'
    cursor: string,
    node: Pick<
        Article<Pick<User, "id" | "userName" | "displayName" | "avatar" | "__typename">>,
        "id" | "title" | "slug" | "cover" | "summary" | "mediaHash" | "live" | "author" | "createdAt" |
        "MAT" | "__typename" | "responseCount" | "subscribed" | "state" | "dataHash" | "sticky"
        >,
}

export interface ArticleConnectionRecommendation {
    __typename: 'ArticleConnection'
    pageInfo: PageInfo,
    edges: ArticleEdgeRecommendation[],
}

interface Recommendation {
    __typename: 'Recommendation'
    feed: ArticleConnectionRecommendation,
}

export type FeedSorting = "NewestFeed" | "HottestFeed";

export interface FeedRequestParams {
    operationName: FeedSorting
    variables: {
        hasArticleDigestActionAuthor: boolean,
        hasArticleDigestActionBookmark: boolean,
        hasArticleDigestActionTopicScore: boolean,
        cursor?: string
    },
    extensions: {
        persistedQuery: {
            version: number,
            sha256Hash: string
        }
    }
}

export interface FeedResponse {
    data: {
        viewer: {
            __typename: "User"
            id: string,
            recommendation: Recommendation
        }
    }
}

export const requestHashs: {[key in FeedSorting]: string} = {
    HottestFeed: "151fc988809d779515e92c2b9a2e4b1ae0a8046755ac69ab5643bfdad0f4b93b",
    NewestFeed: "9e6c21a1e104f1ec36ed891b3ead9461a7f781a0f199b554a15f6f5e7babe1fd"
}

export interface FeedError {
    error: {}[]
}
