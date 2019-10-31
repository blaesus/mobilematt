import { Article, ArticleDigest, UserCore } from "./api/api";

interface NewestFeedDataReady {
    type: "newest-data-ready",
    articleSummaries: ArticleDigest[],
    users: UserCore[],
    lastCursor: string,
}

interface ThreadFocus {
    type: "thread-focus",
    id: string,
}

interface ArticleDataReady {
    type: "article-data-ready",
    article: Article,
    authors: UserCore[],
}

interface UserFocus {
    type: "user-focus",
    id: string
}

interface SetUserBlocking {
    type: "set-user-blocking",
    user: string,
    blocked: boolean,
}

export type MobilemattAction =
    NewestFeedDataReady
    | ThreadFocus
    | ArticleDataReady
    | UserFocus
    | SetUserBlocking
;
