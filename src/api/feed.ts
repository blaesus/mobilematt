import {
    ArticleConnectionRecommendation,
    FeedError,
    FeedRequestParams,
    FeedResponse,
    FeedSorting,
    requestHashs,
} from "./api";

interface LoadFeedSuccess {
    ok: true,
    recommendation: ArticleConnectionRecommendation
}

interface LoadFeedFailure {
    ok: false,
}

function feedParamsToUrl(base: string, params: FeedRequestParams): string {
    const query = Object.entries(params)
                      .map(entry => {
                          if (entry[0] === "operationName") {
                              return `${entry[0]}=${entry[1]}`
                          }
                          else {
                              return `${entry[0]}=${encodeURIComponent(JSON.stringify(entry[1]))}`
                          }
                      })
                      .join("&")
    ;
    return `${base}?${query}`;
}


export async function loadFeed(sorting: FeedSorting): Promise<LoadFeedSuccess | LoadFeedFailure> {
    const params: FeedRequestParams = {
        operationName: sorting,
        variables: {
            hasArticleDigestActionAuthor: false,
            hasArticleDigestActionBookmark: true,
            hasArticleDigestActionTopicScore: false,
        },
        extensions: {
            persistedQuery: {
                version: 1,
                sha256Hash: requestHashs[sorting]
            }
        }
    }
    const url = feedParamsToUrl(`https://server.matters.news/graphql`, params);
    const response = await fetch(url);
    const data: FeedResponse | FeedError = await response.json();
    if (data.hasOwnProperty("errors")) {
        let result: LoadFeedFailure = {
            ok: false
        };
        return result;
    }
    else {
        const successData = data as FeedResponse;
        const result: LoadFeedSuccess = {
            ok: true,
            recommendation: successData.data.viewer.recommendation.feed
        }
        return result
    }
}

