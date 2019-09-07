import React, { FunctionComponent } from "react";
import { View, Text, StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#000",
        width: "100%",
        flex: 0,
    },
    text: {
        color: "#fff",
        paddingTop: 20,
        paddingRight: 20,
        paddingBottom: 20,
        paddingLeft: 20,
        fontSize: 20,
        fontWeight: "bold",
        borderRadius: 10,
    }
})

const TopBar: FunctionComponent<{}> = () => {
    return (
        <View
            style={styles.container}
        >
            <Text style={styles.text}>
                M
            </Text>
        </View>
    )
}

export default TopBar
