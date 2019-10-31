import { View, Text } from "react-native";
import AuthorTag from "./AuthorTag";
import * as React from "react";
import { Comment } from "../api/api";
import HTML from 'react-native-render-html';

function CommentView(props: {
    root: string | null,
    comments: Comment[],
    level?: number,
}) {
    if (!props.comments.length) {
        return <Text>No more comments</Text>
    }
    const level = props.level || 0;
    if (level > 5) {
        return <Text>Too much comment levels</Text>
    }
    return (<View style={{
        marginLeft: 10 * level,
        padding: 4,
    }}>
        {props.comments
                .filter(comment => comment.parent === props.root)
                .sort((a, b) => a.createdAt - b.createdAt)
                .map(comment => (
                    <View
                        key={comment.id}
                        style={{
                            marginTop: 10,
                            borderWidth: 1,
                            borderColor: "#ccc",
                        }}
                    >
                        <AuthorTag userId={comment.author} />
                        <HTML
                            html={comment.content || ""}
                            tagsStyles={{
                                p: {
                                    fontSize: 16,
                                    lineHeight: 20,
                                }
                            }}
                        />
                        <CommentView
                            root={comment.id}
                            comments={props.comments}
                            level={level+1}
                        />
                    </View>
                ))}
    </View>)
}

export default CommentView;
