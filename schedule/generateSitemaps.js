var cron = require("node-cron");
const { SitemapStream, streamToPromise } = require("sitemap");
const fs = require("fs");
const path = require("path");
const dotenv = require('dotenv')
dotenv.config();
process.env.NODE_ENV === 'development' ?
  dotenv.config({ path: '.env.development' }) :
  dotenv.config({ path: '.env.production' })
const baseUrl = process.env.NEXT_PUBLIC_WEB_URL;
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

// Schedule sitemap generation every 30 minutes
cron.schedule("*/30 * * * *", async () => {
  // cron.schedule("* * * * *", async () => {
  try {
    console.log("Regenerating sitemaps...");
    const { productUrls, productCatUrls, postUrls, postCatUrls, pageUrls } = await fetchSlugUrls();
    await generateSitemaps(productUrls, "product");
    await generateSitemaps(productCatUrls, "product_cat");
    await generateSitemaps(postUrls, "post");
    await generateSitemaps(postCatUrls, "category");
    await generateSitemaps(pageUrls, "page");
  } catch (error) {
    console.error("Error Regenerating sitemaps", error);
  }
});
