import * as React from "react"
import { Button, Image, Text, View } from "react-native";
import { useContext } from "react";
import { GlobalContext } from "../context";

function UserProfile() {
    const {userInView, users, userBlackList, dispatch} = useContext(GlobalContext);
    const user = users[userInView];
    if (!user) {
        return null;
    }
    const blocked = userBlackList.includes(userInView);
    return (
        <View
            style={{
                alignItems: "center",
            }}
        >
            <Text>User profile</Text>
            <Image
                style={{
                    width: 100,
                    height: 100,
                }}
                source={{uri: user.avatar}}
            />
            <Text>{user.displayName}</Text>
            <Text>({user.userName})</Text>
            <Button title={blocked ? "解封" : "眼不见为静"} onPress={() => {
                dispatch({
                    type: "set-user-blocking",
                    user: userInView,
                    blocked: !blocked,
                })
            }}/>
        </View>
    );
}

export default UserProfile;
