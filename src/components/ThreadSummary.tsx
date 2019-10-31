import React, { FunctionComponent } from "react";
import { StyleSheet, Text, View } from "react-native";
import { ArticleDigest, UserCore } from "../api/api";
import AuthorTag from "./AuthorTag";

interface ArticleViewProps {
    digest: ArticleDigest,
    author: UserCore,
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
    const { digest, author } = props;
    return (
        <View style={threadSummaryStyles.containers}>
            <Text style={threadSummaryStyles.title}>{digest.title}</Text>
            <AuthorTag userId={author.id} />
            <Text>{digest.summary}</Text>
        </View>
    )

};

export default ThreadSummary
