import React, { useEffect, useReducer, useContext } from "react";
import { Text, View, StyleSheet, ScrollView, Button, TouchableHighlight } from "react-native";
import {
    Article, ArticleDigest, fetchNewest, UserCore, Comment
} from "../api/api";
import ThreadSummary from "./ThreadSummary";
import { MapById } from "../utils";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { navigateTo, setRootNavigator } from "../navigate";
import ThreadView from "./ThreadView";
import {GlobalContext} from "../context";
import { MobilemattAction } from "../actions";
import UserProfile from "./UserProfile";

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
    articleSummaries: MapById<ArticleDigest>,
    articles: MapById<Article>,
    users: MapById<UserCore>,
    custom: {
        userBlackList: string[],
    },
    ui: {
        screen: "Home" | "ThreadView" | "UserProfile",
        latestFeedCursor: string,
        articleInView: string | null,
        userInView: string | null,
    },
}

const INITIAL_STATE: GlobalState = {
    articleSummaries: {},
    articles: {},
    users: {},
    custom: {
        userBlackList: [],
    },
    ui: {
        latestFeedCursor: '',
        screen: "Home",
        articleInView: null,
        userInView: null,
    },
};

function normalize<T extends {id: string}>(data: T[]): {[key in string]: T} {
    const result = {};
    for (const item of data) {
        result[item.id] = item
    }
    return result
}

function ThreadList(props: {
    summaries: MapById<ArticleDigest>,
}) {
    const {dispatch, users, userBlackList} = useContext(GlobalContext);
    return (
        <View style={globalStyles.contentBox}>
            <ScrollView>
                {
                    Object.values(props.summaries)
                          .filter(summary => !userBlackList.includes(summary.author))
                          .map(
                              article =>
                                  <TouchableHighlight key={article.id} onPress={() => dispatch({
                                      type: "thread-focus",
                                      id: article.id,
                                  })}>
                                      <ThreadSummary
                                          digest={article}
                                          author={users[article.author]}
                                      />
                                  </TouchableHighlight>
                          )
                }
            </ScrollView>
        </View>
    );
}

const rootNavigator = createStackNavigator({
    Home: HomeScreen,
    ThreadView: ThreadView,
    UserProfile: UserProfile,
}, {})

const RoutedApp = createAppContainer(rootNavigator)

const PAGE = 10;

function HomeScreen() {
    const { articleDigests, latestFeedCursor, dispatch } = useContext<GlobalContext>(GlobalContext);
    async function fetchMore() {
        const {summaries, authors, lastCursor} = await fetchNewest(PAGE, latestFeedCursor);
        dispatch({
            type: "newest-data-ready",
            articleSummaries: summaries,
            users: authors,
            lastCursor,
        })
    }
    useEffect(() => {
        !!fetchMore()
    }, [])

    return (
        <View style={globalStyles.container}>
            <Text>Matters</Text>
            <ThreadList summaries={articleDigests} />
            <Button title="fetch more" onPress={fetchMore} />
        </View>
    )
}

function reducer(state: GlobalState, action: MobilemattAction): GlobalState {
    switch (action.type) {
        case "newest-data-ready": {
            return {
                ...state,
                articleSummaries: {
                    ...state.articleSummaries,
                    ...normalize(action.articleSummaries)
                },
                users: {
                    ...state.users,
                    ...normalize(action.users),
                },
                ui: {
                    ...state.ui,
                    latestFeedCursor: action.lastCursor
                }
            }
        }
        case "thread-focus": {
            return {
                ...state,
                ui: {
                    ...state.ui,
                    articleInView: action.id,
                    screen: "ThreadView"
                }
            }
        }
        case "article-data-ready": {
            return {
                ...state,
                articles: {
                    ...state.articles,
                    [action.article.id]: action.article,
                },
                users: {
                    ...state.users,
                    ...normalize(action.authors),
                },
            }
        }
        case "user-focus": {
            return {
                ...state,
                ui: {
                    ...state.ui,
                    userInView: action.id,
                    screen: "UserProfile",
                }
            }
        }
        case "set-user-blocking": {
            let next: string[] = state.custom.userBlackList;
            if (action.blocked) {
                next.push(action.user);
            }
            else {
                next = next.filter(id => id !== action.user);
            }
            return {
                ...state,
                custom: {
                    ...state.custom,
                    userBlackList: next,
                }
            }
        }

        default: {
            return state;
        }
    }
}

function App() {
    const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
    useEffect(() => {
        navigateTo(state.ui.screen)
    });
    const context: GlobalContext = {
        users: state.users,
        articles: state.articles,
        articleDigests: state.articleSummaries,
        latestFeedCursor: state.ui.latestFeedCursor,
        articleInView: state.ui.articleInView,
        userInView: state.ui.userInView,
        userBlackList: state.custom.userBlackList,
        dispatch,
    };
    return (
        <GlobalContext.Provider value={context}>
            <RoutedApp ref={ref => setRootNavigator(ref)} />
        </GlobalContext.Provider>
    )
}

export default App;
