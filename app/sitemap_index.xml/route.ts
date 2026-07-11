const baseUrl = process.env.NEXT_PUBLIC_WEB_URL;
const pathSitemap = [
    'post-sitemap.xml',
    'page-sitemap.xml',
    'category-sitemap.xml',
    'product_cat-sitemap.xml',
    'product-sitemap.xml',
]

const generateSitemapLink = (url: string) => `
    <sitemap>
        <loc>${url}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
    </sitemap>
`;

export async function GET() {
    const sitemapIndexXML = `
        <?xml version="1.0" encoding="UTF-8"?>
        <?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?> 
        <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
            ${pathSitemap
            .map((item) =>
                generateSitemapLink(`${baseUrl}${item}`),
            )
            .join('')
        }
        </sitemapindex>
    `;
    return new Response(sitemapIndexXML.trim(),
        {
            headers: { 'Content-Type': 'text/xml' },
        }
    );
}
