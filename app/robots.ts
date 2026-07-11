import type { MetadataRoute } from 'next'
export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_WEB_URL;
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: [
                '/storage/logs/',
                '/storage/framework/',
                '/storage/debugbar/',
                '/admin/',
                '/search/'
            ]
        },
        sitemap: `${baseUrl}sitemap_index.xml`,
    }
}