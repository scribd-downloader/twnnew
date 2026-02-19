
import { NextRequest, NextResponse } from 'next/server';
import { getGuestToken, fetchTweet } from '@/lib/twitter';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { url } = body;

        if (!url) {
            return NextResponse.json({ error: 'URL is required' }, { status: 400 });
        }

        const tweetIdMatch = url.match(/\/status\/(\d+)/);
        const tweetId = tweetIdMatch ? tweetIdMatch[1] : null;

        if (!tweetId) {
            return NextResponse.json({ error: 'Invalid Twitter URL' }, { status: 400 });
        }

        const guestToken = await getGuestToken();
        if (!guestToken) {
            return NextResponse.json({ error: 'Failed to get guest token' }, { status: 500 });
        }

        const data = await fetchTweet(tweetId, guestToken);

        // Process logic
        const result = data?.data?.tweetResult?.result;
        if (!result) {
            return NextResponse.json({ error: 'Tweet not found or private' }, { status: 404 });
        }

        const legacy = result.legacy;
        const user = result.core?.user_results?.result?.legacy;

        const media = legacy.extended_entities?.media || [];

        const mediaItems = media.map((m: any) => {
            if (m.type === 'video' || m.type === 'animated_gif') {
                const variants = m.video_info?.variants || [];
                // Sort by bitrate desc
                const sortedVariants = variants
                    .filter((v: any) => v.content_type === 'video/mp4')
                    .sort((a: any, b: any) => (b.bitrate || 0) - (a.bitrate || 0));

                return {
                    type: m.type,
                    url: sortedVariants[0]?.url, // Highest quality
                    variants: sortedVariants,
                    poster: m.media_url_https
                };
            }
            return {
                type: 'photo',
                url: m.media_url_https,
                poster: m.media_url_https
            };
        });

        return NextResponse.json({
            text: legacy.full_text,
            user: {
                name: user?.name,
                screen_name: user?.screen_name,
                profile_image_url: user?.profile_image_url_https
            },
            media: mediaItems
        });

    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
