import * as React from "react";
import { MapById } from "./utils";
import { Article, ArticleDigest, UserCore } from "./api/api";
import { MobilemattAction } from "./actions";

export interface GlobalContext {
    users: MapById<UserCore>,
    articles: MapById<Article>,
    articleDigests: MapById<ArticleDigest>,
    latestFeedCursor: string,
    articleInView: string,
    userInView: string,
    userBlackList: string[],
    dispatch(action: MobilemattAction): void
}

const initialContext: GlobalContext = {
    users: {},
    articles: {},
    articleDigests: {},
    latestFeedCursor: '',
    articleInView: '',
    userInView: '',
    userBlackList: [],
    dispatch(_action: MobilemattAction) {},
}

export const GlobalContext = React.createContext(initialContext);

