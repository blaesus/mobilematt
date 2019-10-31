import * as React from "react";
import { View, Text, ScrollView } from "react-native";
import { useContext, useEffect } from "react";
import { GlobalContext } from "../context";
import { fetchArticle } from "../api/api";
import HTML from 'react-native-render-html';
import AuthorTag from "./AuthorTag";
import CommentView from "./CommentView";

function ThreadView() {
    const {articles, articleDigests, articleInView, users, dispatch, userBlackList} = useContext(GlobalContext);
    const digest = articleDigests[articleInView];
    useEffect(() => {
        async function fetches(hash: string) {
            const data = await fetchArticle(hash);
            if (data) {
                dispatch({
                    type: "article-data-ready",
                    article: data.article,
                    authors: data.authors,
                })
            }
        }
        if (digest) {
            fetches(digest.mediaHash);
        }
    }, [articleInView])
    if (!digest) {
        return (
            <View><Text>Missing digest for {digest}</Text></View>
        )
    }

    const article = articles[articleInView];
    if (!article) {
        return <Text>Loading <Text>{articleInView}</Text>...</Text>
    }
    const author = users[article.author];
    if (!author) {
        return <Text>Missing user</Text>;
    }
    return (
        <ScrollView style={{
            flex: 1,
        }}>
            <Text style={{
                fontSize: 20,
            }}>{article.title}</Text>
            <AuthorTag userId={author.id} />
            <HTML
                html={article.content}
                tagsStyles={{
                    p: {
                        fontSize: 16,
                        lineHeight: 20,
                    }
                }}
            />
            <CommentView
                root={null}
                comments={article.comments.filter(c => !userBlackList.includes(c.author))}
            />
        </ScrollView>
    )
}

export default ThreadView;
