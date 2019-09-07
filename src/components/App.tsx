import React, { FunctionComponent, useState, useEffect } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import {
    Article,
} from "../api/api";
import { loadFeed } from "../api/feed";
import TopBar from "./TopBar"
import ThreadSummary from "./ThreadSummary";

const globalStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    contentBox: {
        flex: 1,
    }
});

interface GlobalState {
    shouldLoad: boolean,
    message: string
    articles: {[key in string]: Article}
}

const INITIAL_STATE: GlobalState = {
    shouldLoad: true,
    message: "Loading...",
    articles: {},
};

function normalize<T extends {id: string}>(data: T[]): {[key in string]: T} {
    const result = {};
    for (const item of data) {
        result[item.id] = item
    }
    return result
}


const App: FunctionComponent<{}> = () => {
    const [state, setState] = useState(INITIAL_STATE);
    useEffect(() => {
        async function load() {
            // const data = await loadFeed("NewestFeed")
            const data = await loadFeed("HottestFeed")
            if (!data.ok) {
                console.log("feed load failed")
                setState({
                    ...state,
                    message: "feed load failed",
                    shouldLoad: false
                })
            }
            else {
                const newArticles: Article[] = data.recommendation.edges.map(edge => edge.node as Article);
                setState({
                    ...state,
                    articles: {
                        ...state.articles,
                        ...normalize(newArticles)
                    },
                    shouldLoad: false
                })
            }
        }

        if (state.shouldLoad) {
            !!load()
        }
    });
    return (
        <View style={globalStyles.container}>
            <TopBar />
            <View style={globalStyles.contentBox}>
                <ScrollView>
                    {
                        Object.values(state.articles).map(
                            article => <ThreadSummary key={article.id} article={article}/>
                        )
                    }
                </ScrollView>
            </View>
        </View>
    );
};


export default App
