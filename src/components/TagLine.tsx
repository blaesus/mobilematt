import React, { FunctionComponent } from "react";
import { StyleSheet, Image, Text, View } from "react-native";

const styles = StyleSheet.create({
    container: {
        flexDirection:'row',
        flexWrap:'wrap',
        alignItems: 'center',
        marginTop: 5,
        marginBottom: 5,
    },
    profile: {
        width: 30,
        height: 30,
        borderRadius: 15,
        marginRight: 5,
    },
    text: {
        fontSize: 16,
    }
})

interface TagLineProps {
    authorName: string
    authorProfileUrl: string
    date: number
}

const TagLine: FunctionComponent<TagLineProps> = (props) => {
    const {authorName, date} = props;
    return (
        <View style={styles.container}>
            <Image
                style={styles.profile}
                source={{uri: props.authorProfileUrl}}
            />
            <Text style={styles.text}>
                {authorName}發表於{" "}{new Date(date).toLocaleString()}
            </Text>
        </View>
    )
}

export default TagLine
