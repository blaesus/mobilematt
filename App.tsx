import React from "react";
import { StyleSheet, Text, View } from "react-native";

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

interface Article<U=User> {
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
    dataHash: 'QmXNPzN8wrgUesnjaLBfzGq7JeyVbHKqMuiGQvXZ9aSFQT'
}

export default function App() {
    return (
        <View style={styles.container}>
            <Text>Hello world!</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
});
