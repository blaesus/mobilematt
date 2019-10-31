import * as React from "react";
import { Image, View, Text, TouchableOpacity } from "react-native";
import { useContext, useEffect } from "react";
import { GlobalContext } from "../context";

function AuthorTag(props: {
    userId?: string,
}) {
    const {dispatch, users} = useContext(GlobalContext);
    const {userId} = props
    const user = users[userId];
    useEffect(() => {
        if (!user) {
            console.info("Missing", userId)
        }
    }, [userId])
    if (!user) {
        return null
    }

    return (
        <TouchableOpacity onPress={() => {
            dispatch({
                type: "user-focus",
                id: user.id,
            })
        }}>
            <View style={{
                flexDirection: "row",
            }}>
                <Image
                    source={{uri: user.avatar}}
                    style={{width: 20, height: 20, borderRadius: 10}}
                />
                <Text>{user.displayName}</Text>

            </View>
        </TouchableOpacity>
    )

}

export default AuthorTag
