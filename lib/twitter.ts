const BEARER_TOKEN = 'AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA';
const GRAPHQL_ID = 'Vg2Akr5FzUmF0sTplA5k6g';

const COMMON_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': '*/*',
  'Accept-Language': 'en-US,en;q=0.9',
  'Origin': 'https://x.com',
  'Referer': 'https://x.com/',
};

export async function getGuestToken(): Promise<string | null> {
  try {
    const response = await fetch('https://api.twitter.com/1.1/guest/activate.json', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${BEARER_TOKEN}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        ...COMMON_HEADERS
      }
    });

    if (!response.ok) {
      console.error('Failed to activate guest token', response.status, await response.text());
      return null;
    }

    const data = await response.json();
    return data.guest_token || null;
  } catch (e) {
    console.error('Error fetching guest token:', e);
    return null;
  }
}

export async function fetchTweet(tweetId: string, guestToken: string) {
  const variables = {
    tweetId: tweetId,
    withCommunity: false,
    includePromotedContent: false,
    withVoice: false,
  };

  const features = {
    creator_subscriptions_tweet_preview_api_enabled: true,
    premium_content_api_read_enabled: false,
    communities_web_enable_tweet_community_results_fetch: true,
    c9s_tweet_anatomy_moderator_badge_enabled: true,
    responsive_web_grok_analyze_button_fetch_trends_enabled: false,
    responsive_web_grok_analyze_post_followups_enabled: false,
    responsive_web_jetfuel_frame: false,
    responsive_web_grok_share_attachment_enabled: true,
    articles_preview_enabled: true,
    responsive_web_edit_tweet_api_enabled: true,
    graphql_is_translatable_rweb_tweet_is_translatable_enabled: true,
    view_counts_everywhere_api_enabled: true,
    longform_notetweets_consumption_enabled: true,
    responsive_web_twitter_article_tweet_consumption_enabled: true,
    tweet_awards_web_tipping_enabled: false,
    responsive_web_grok_show_grok_translated_post: false,
    responsive_web_grok_analysis_button_from_backend: true,
    creator_subscriptions_quote_tweet_preview_enabled: false,
    freedom_of_speech_not_reach_fetch_enabled: true,
    standardized_nudges_misinfo: true,
    tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled: true,
    longform_notetweets_rich_text_read_enabled: true,
    longform_notetweets_inline_media_enabled: true,
    profile_label_improvements_pcf_label_in_post_enabled: true,
    rweb_tipjar_consumption_enabled: true,
    responsive_web_graphql_exclude_directive_enabled: true,
    verified_phone_label_enabled: false,
    responsive_web_grok_image_annotation_enabled: true,
    responsive_web_graphql_skip_user_profile_image_extensions_enabled: false,
    responsive_web_graphql_timeline_navigation_enabled: true,
    responsive_web_enhance_cards_enabled: false,
  };

  const url = new URL(`https://api.x.com/graphql/${GRAPHQL_ID}/TweetResultByRestId`);
  url.searchParams.append('variables', JSON.stringify(variables));
  url.searchParams.append('features', JSON.stringify(features));

  const response = await fetch(url.toString(), {
    headers: {
      'Authorization': `Bearer ${BEARER_TOKEN}`,
      'x-guest-token': guestToken,
      'x-twitter-active-user': 'yes',
      'Content-Type': 'application/json',
      ...COMMON_HEADERS
    }
  });

  if (!response.ok) {
    throw new Error(`Twitter API Error: ${response.status} ${await response.text()}`);
  }

  return response.json();
}
