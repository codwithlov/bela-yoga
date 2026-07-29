var cron = require("node-cron");
const { SitemapStream, streamToPromise } = require("sitemap");
const fs = require("fs");
const path = require("path");
const dotenv = require('dotenv')
dotenv.config();
process.env.NODE_ENV === 'development' ?
  dotenv.config({ path: '.env.development' }) :
  dotenv.config({ path: '.env.production' })
const baseUrl = String(process.env.NEXT_PUBLIC_WEB_URL || '').replace(/\/+$/, '');
const apiPath = process.env.NEXT_PUBLIC_BASE_URL + process.env.NEXT_PUBLIC_API_PATH;

const fetchSlugUrls = async () => {
  const response = await fetch(apiPath + "sitemap/getSitemapUrls");
  const data = await response.json();
  // console.log(response);
  if (!data?.success) return {};
  const createUrlData = (slugs) =>
    (slugs || []).map((slug) => {
      const lastmod = new Date(slug.updated_at);

      const formattedLastmod = lastmod.toISOString();

      return {
        url: baseUrl + slug.slug,
        changefreq: "weekly",
        lastmod: formattedLastmod,
      };
    });

  return {
    productUrls: createUrlData(data?.data?.productSlugs),
    productCatUrls: createUrlData(data?.data?.productCatSlugs),
    postUrls: createUrlData(data?.data?.postSlugs),
    postCatUrls: createUrlData(data?.data?.postCatSlugs),
    pageUrls: createUrlData(data?.data?.pageSlugs),
  };
};

const generateSitemaps = async (urls, type) => {
  if (urls.length === 0) return;

  const sitemapStream = new SitemapStream({ hostname: baseUrl });

  urls.forEach((urlData) => {
    sitemapStream.write(urlData);
  });

  sitemapStream.end();

  let sitemapXML = await streamToPromise(sitemapStream).then((data) =>
    data.toString()
  );

  const publicDir = path.resolve("public");
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  sitemapXML = sitemapXML.replace(
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<?xml version="1.0" encoding="UTF-8"?><?xml-stylesheet type="text/xsl" href="sitemap.xsl"?>'
  );
  fs.writeFileSync(path.resolve(publicDir, `${type}-sitemap.xml`), sitemapXML.trim());
  console.log(type + " sitemap generated!");
};

const generateSitemapIndex = (types) => {
  const validTypes = (types || []).filter(Boolean);
  if (!validTypes.length) return;

  const publicDir = path.resolve("public");
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const now = new Date().toISOString();
  const indexXml = `<?xml version="1.0" encoding="UTF-8"?>\n<?xml-stylesheet type="text/xsl" href="sitemap.xsl"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${validTypes
    .map((type) => `  <sitemap>\n    <loc>${baseUrl}/${type}-sitemap.xml</loc>\n    <lastmod>${now}</lastmod>\n  </sitemap>`)
    .join("\n")}\n</sitemapindex>`;

  fs.writeFileSync(path.resolve(publicDir, 'sitemap_index.xml'), indexXml.trim());
  console.log('sitemap index generated!');
};

const regenerateAllSitemaps = async () => {
  try {
    console.log("Regenerating sitemaps...");
    const { productUrls, productCatUrls, postUrls, postCatUrls, pageUrls } = await fetchSlugUrls();
    const generatedTypes = [];

    if ((productUrls || []).length) {
      await generateSitemaps(productUrls, "product");
      generatedTypes.push('product');
    }

    if ((productCatUrls || []).length) {
      await generateSitemaps(productCatUrls, "product_cat");
      generatedTypes.push('product_cat');
    }

    if ((postUrls || []).length) {
      await generateSitemaps(postUrls, "post");
      generatedTypes.push('post');
    }

    if ((postCatUrls || []).length) {
      await generateSitemaps(postCatUrls, "category");
      generatedTypes.push('category');
    }

    if ((pageUrls || []).length) {
      await generateSitemaps(pageUrls, "page");
      generatedTypes.push('page');
    }

    generateSitemapIndex(generatedTypes);
  } catch (error) {
    console.error("Error Regenerating sitemaps", error);
  }
};

// Run once immediately
regenerateAllSitemaps();

// Schedule sitemap generation every 30 minutes
cron.schedule("*/30 * * * *", async () => {
  // cron.schedule("* * * * *", async () => {
  await regenerateAllSitemaps();
});
