const { HttpsProxyAgent } = require("https-proxy-agent");
const { getGuestToken } = require("../services/guestTokenService");
const { getRandomProxy } = require("../services/proxyService");

async function fetchTweet(req, res) {
  const tweetID = req.params.tweetID;
  const proxy = getRandomProxy();
  const agent = new HttpsProxyAgent(proxy);
  const guestToken = await getGuestToken();
  const response = await fetch(
    `https://api.x.com/graphql/Xl5pC_lBk_gcO2ItU39DQw/TweetResultByRestId?variables=%7B%22tweetId%22%3A%22${tweetID}%22%2C%22withCommunity%22%3Afalse%2C%22includePromotedContent%22%3Afalse%2C%22withVoice%22%3Afalse%7D&features=%7B%22creator_subscriptions_tweet_preview_api_enabled%22%3Atrue%2C%22communities_web_enable_tweet_community_results_fetch%22%3Atrue%2C%22c9s_tweet_anatomy_moderator_badge_enabled%22%3Atrue%2C%22articles_preview_enabled%22%3Atrue%2C%22tweetypie_unmention_optimization_enabled%22%3Atrue%2C%22responsive_web_edit_tweet_api_enabled%22%3Atrue%2C%22graphql_is_translatable_rweb_tweet_is_translatable_enabled%22%3Atrue%2C%22view_counts_everywhere_api_enabled%22%3Atrue%2C%22longform_notetweets_consumption_enabled%22%3Atrue%2C%22responsive_web_twitter_article_tweet_consumption_enabled%22%3Atrue%2C%22tweet_awards_web_tipping_enabled%22%3Afalse%2C%22creator_subscriptions_quote_tweet_preview_enabled%22%3Afalse%2C%22freedom_of_speech_not_reach_fetch_enabled%22%3Atrue%2C%22standardized_nudges_misinfo%22%3Atrue%2C%22tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled%22%3Atrue%2C%22rweb_video_timestamps_enabled%22%3Atrue%2C%22longform_notetweets_rich_text_read_enabled%22%3Atrue%2C%22longform_notetweets_inline_media_enabled%22%3Atrue%2C%22rweb_tipjar_consumption_enabled%22%3Atrue%2C%22responsive_web_graphql_exclude_directive_enabled%22%3Atrue%2C%22verified_phone_label_enabled%22%3Afalse%2C%22responsive_web_graphql_skip_user_profile_image_extensions_enabled%22%3Afalse%2C%22responsive_web_graphql_timeline_navigation_enabled%22%3Atrue%2C%22responsive_web_enhance_cards_enabled%22%3Afalse%7D&fieldToggles=%7B%22withArticleRichContentState%22%3Atrue%2C%22withArticlePlainText%22%3Afalse%2C%22withGrokAnalyze%22%3Afalse%7D`,
    {
      headers: {
        accept: "*/*",
        "accept-language": "en-US,en;q=0.9",
        authorization:
          "Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA",
        "content-type": "application/json",
        priority: "u=1, i",
        "sec-ch-ua":
          '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
        "sec-ch-ua-mobile": "?1",
        "sec-ch-ua-platform": '"Android"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
        "x-client-transaction-id":
          "Wrdg0MrefzpjAczgX2jye33wFrdElzhi3P9+VHaFYP9UPGEAom97LFYpk7zd3wc118OvbFgMtLEjZb7qUJRMEiqpHn91WQ",
        "x-guest-token": guestToken,
        "x-twitter-active-user": "yes",
        "x-twitter-client-language": "en",
      },
      agent: agent,
      referrer: "https://x.com/",
      referrerPolicy: "strict-origin-when-cross-origin",
      body: null,
      method: "GET",
      mode: "cors",
    }
  );
  const responseJson = await response.json();
  res.status(200).send(responseJson);
}

module.exports = { fetchTweet };