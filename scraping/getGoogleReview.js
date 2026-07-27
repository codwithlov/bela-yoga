

const puppeteer = require("puppeteer");
const dotenv = require("dotenv");

dotenv.config();
process.env.NODE_ENV === 'development' ?
    dotenv.config({ path: '.env.development' }) :
    dotenv.config({ path: '.env.production' })

const baseUrl = process.env.NEXT_PUBLIC_WEB_URL || 'http://localhost:3002/';
const apiPath = `${process.env.NEXT_PUBLIC_BASE_URL || baseUrl}${process.env.NEXT_PUBLIC_API_PATH || 'api/public/v1/'}`;
const placeUrl = process.env.GOOGLE_REVIEW_TARGET_URL || 'https://www.google.com/search?q=bela+yoga#lrd=0x0:0x0,1,,,,';
const staticSiteToken = process.env.STATIC_SITE_TOKEN || 'token';

const executablePath = process.env.PUPPETEER_EXECUTABLE_PATH || undefined;
const userDataDir = process.env.PUPPETEER_USER_DATA_DIR || undefined;

const sleep = ms => new Promise(res => setTimeout(res, ms));

const parseRating = (ratingText) => {
    if (!ratingText) return null;
    const match = ratingText.match(/\d+/);
    return match ? parseInt(match[0], 10) : null;
};

const getReviews = async () => {
    const launchOptions = {
        headless: false,
        defaultViewport: null,
    };

    if (executablePath) launchOptions.executablePath = executablePath;
    if (userDataDir) launchOptions.userDataDir = userDataDir;

    const browser = await puppeteer.launch(launchOptions);

    try {
        const page = await browser.newPage();
        await page.goto(placeUrl, {
            waitUntil: "domcontentloaded",
        });

        await page.waitForSelector('.RVCQse', { timeout: 1000000 });

        await page.evaluate(async () => {
            const btnReviews = document.querySelectorAll(".YCQwEb");
            for (let index = 0; index < btnReviews.length; index++) {
                const element = btnReviews[index];
                if (element?.getAttribute('data-sort') == 2) {
                    element?.click();
                    return;
                }
            }
        })

        await sleep(1500);

        const scrollPageToBottom = async () => {
            try {
                await page.evaluate(() => {
                    const feedbackWrap = document.querySelector('.RVCQse')
                    feedbackWrap?.scrollTo(0, feedbackWrap?.scrollHeight || 0);
                });
                await sleep(1500);
            } catch (error) {
                console.error('Scrolling stopped unexpectedly:', error.message);
            }
        };

        let previousHeight = 0;
        while (true) {
            await scrollPageToBottom();
            const newHeight = await page.evaluate(() => {
                const feedbackWrap = document.querySelector('.RVCQse');
                return feedbackWrap?.scrollHeight || 0;
            });
            if (newHeight === previousHeight) {
                break;
            }
            previousHeight = newHeight;
        }

        await page.evaluate(async () => {
            const reviewList = document.querySelectorAll(".bwb7ce");
            Array.from(reviewList).forEach((reviewItem) => {
                const descrip = reviewItem.querySelector(".OA1nbd");
                descrip?.querySelector(".MtCSLb")?.click();
            })
        })

        const feedback = await page.evaluate(async () => {
            const reviewList = document.querySelectorAll(".bwb7ce");
            return Array.from(reviewList).map((item) => {
                const g_id = item.getAttribute('data-id');
                const content = item.querySelector(".OA1nbd")?.innerText || '';
                const full_name = item.querySelector(".Vpc5Fe")?.innerText;
                const ratingText = item.querySelector(".dHX2k")?.ariaLabel || '';
                const feedback_date = item.querySelector(".y3Ibjb")?.innerText;
                let image_urls = item.querySelectorAll(".Se89we");
                let avatar = item.querySelector(".wSokxc");

                if (avatar instanceof HTMLElement) {
                    if (avatar.style.backgroundImage) {
                        avatar = avatar.style.backgroundImage.replace((/url\("(.*?)"\)/g), "$1");
                    }
                }

                if (image_urls.length > 0) {
                    image_urls = Array.from(image_urls).map((img) => {
                        const imgUrl = img.querySelector('.FfJICc');
                        return imgUrl?.getAttribute('src')?.split('=')[0] || '';
                    }).filter(Boolean);
                }

                const image_options = ['s125-p-k', 's2002-w1886-h2002'];
                const feedback_type = 'GOOGLE';
                return {
                    g_id,
                    full_name,
                    avatar,
                    ratingText,
                    feedback_date,
                    content,
                    image_urls,
                    image_options,
                    feedback_type
                };
            });
        });

        const normalizedFeedback = feedback.map((item) => ({
            ...item,
            rating: parseRating(item.ratingText),
        })).map(({ ratingText, ...rest }) => rest);

        const storeReview = async (feedbackList) => {
            const formData = {
                feedbackList: feedbackList.reverse()
            }
            const storeUrl = `${apiPath}feedback/clone-from-google-review`;
            console.log('Store URL:', storeUrl);

            const response = await fetch(storeUrl, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                    "X-STATIC-SITE-TOKEN": staticSiteToken,
                },
                body: JSON.stringify(formData)
            })

            if (response.ok) {
                const data = await response.json();
                console.log('Clone success:', data);
            } else {
                const errorText = await response.text();
                console.log('Failed to clone:', response.status, errorText);
            }
        };

        await storeReview(normalizedFeedback);
    } finally {
        await browser.close();
    }
};

getReviews().catch((error) => {
    console.error('Google review scraping failed:', error);
    process.exitCode = 1;
});