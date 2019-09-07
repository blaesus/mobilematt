import React, { FunctionComponent } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Article } from "../api/api";
import TagLine from "./TagLine";

interface ArticleViewProps {
    article: Article
}

const threadSummaryStyles = StyleSheet.create({
    containers: {
        marginTop: 4,
        marginRight: 10,
        marginBottom: 4,
        marginLeft: 10,
        fontSize: 20,
        lineHeight: 1.5,
        padding: 10,
        borderColor: "#ccc",
        borderWidth: 1
    },
    title: {
        fontSize: 24
    },
});

const ThreadSummary: FunctionComponent<ArticleViewProps> = (props: ArticleViewProps) => {
    const { article } = props;
    return (
        <View style={threadSummaryStyles.containers}>
            <Text style={threadSummaryStyles.title}>{article.title}</Text>
            <TagLine
                date={+new Date(article.createdAt)}
                authorName={article.author.displayName}
                authorProfileUrl={article.author.avatar}
            />
            <Text>{article.summary}</Text>
        </View>
    )

};

export default ThreadSummary
