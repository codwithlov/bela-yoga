

// import puppeteer from "puppeteer-core";
// import dotenv from "dotenv";
const puppeteer = require("puppeteer-core");
const dotenv = require("dotenv");

dotenv.config();
process.env.NODE_ENV === 'development' ?
    dotenv.config({ path: '.env.development' }) :
    dotenv.config({ path: '.env.production' })

const baseUrl = process.env.NEXT_PUBLIC_WEB_URL;
const apiPath = process.env.NEXT_PUBLIC_BASE_URL + process.env.NEXT_PUBLIC_API_PATH;

// See config in chrome://version/
const executablePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\Admin\\AppData\\Local\\Google\\Chrome\\User Data\\Default';
// End

const sleep = ms => new Promise(res => setTimeout(res, ms));
const getReviews = async () => {
    // Start a Puppeteer session with:
    // - a visible browser (`headless: false` - easier to debug because you'll see the browser in action)
    // - no default viewport (`defaultViewport: null` - website page will in full width and height)
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        executablePath: executablePath,
        userDataDir: userDataDir,
    });

    // Open a new page
    const page = await browser.newPage();
    const pageUrl = 'https://www.google.com/search?q=saigontimestravel&sca_esv=39121d5fb8094216&sxsrf=AHTn8zqGOu2l1zRPplLqZTwDs9l5UHBBSw%3A1744681839365&source=hp&ei=b7v9Z-CDE73K0-kP07DQ-QQ&iflsig=ACkRmUkAAAAAZ_3Jf3tYC5tdG6axycoYoICzz4FgYZjO&oq=sa&gs_lp=Egdnd3Mtd2l6IgJzYSoCCAAyChAjGIAEGCcYigUyChAjGIAEGCcYigUyChAjGIAEGCcYigUyChAAGIAEGEMYigUyChAAGIAEGEMYigUyExAuGIAEGLEDGNEDGEMYxwEYigUyERAuGIAEGLEDGNEDGIMBGMcBMgUQABiABDIFEAAYgAQyCxAAGIAEGLEDGIMBSNgKUABYX3AAeACQAQCYAYUBoAH-AaoBAzAuMrgBA8gBAPgBAZgCAqAChgLCAgQQIxgnwgIMECMYgAQYExgnGIoFmAMAkgcDMC4yoAfEFrIHAzAuMrgHhgI&sclient=gws-wiz#lrd=0x317528bb2513eae5:0x1a63752013354eb,1,,,,'
    // const pageUrl = 'https://www.google.com/'
    await page.goto(pageUrl, {
        waitUntil: "domcontentloaded",
    });

    // await page.waitForSelector('.rAChLe', { timeout: 30000 }).then(() => {

    // });

    // await page.locator('#APjFqb').fill('saigontimestravel');
    // await page.keyboard.press('Enter');
    await page.waitForSelector('.RVCQse', { timeout: 1000000 });
    // await page.waitForSelector('.bwb7ce', { timeout: 1000000 });

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

    /** Use Test */
    // await page.evaluate(() => {
    //     const feedbackWrap = document.querySelector('.RVCQse')
    //     feedbackWrap.scrollTo(0, feedbackWrap?.scrollHeight);
    // });
    /** End */

    // Defining a function to scroll to the bottom of the page
    const scrollPageToBottom = async () => {
        try {
            await page.evaluate(() => {
                const feedbackWrap = document.querySelector('.RVCQse')
                feedbackWrap.scrollTo(0, feedbackWrap?.scrollHeight);
            });
            await sleep(1500);
        } catch (error) {
            console.error('Scrolling stopped unexpectedly:', error.message);
        }
    };

    // Scrolling in a loop until a certain condition is met
    let previousHeight = 0;
    while (true) {
        await scrollPageToBottom();
        const newHeight = await page.evaluate(() => {
            const feedbackWrap = document.querySelector('.RVCQse');
            return feedbackWrap?.scrollHeight;
        });
        // Breaking the loop if no new content is loaded
        if (newHeight === previousHeight) {
            break;
        }
        previousHeight = newHeight;
    }

    await page.evaluate(async () => {
        const reviewList = document.querySelectorAll(".bwb7ce");
        Array.from(reviewList).map((reviewList) => {
            const descrip = reviewList.querySelector(".OA1nbd");
            descrip?.querySelector(".MtCSLb")?.click();
        })
    })
    // Get page data
    const feedback = await page.evaluate(async () => {
        const reviewList = document.querySelectorAll(".bwb7ce");
        return Array.from(reviewList).map((item) => {
            const g_id = item.getAttribute('data-id');
            const content = item.querySelector(".OA1nbd")?.innerText || '';
            const full_name = item.querySelector(".Vpc5Fe")?.innerText;
            const ratingText = item.querySelector(".dHX2k")?.ariaLabel;
            let rating = parseInt(ratingText.split(',')[0]?.slice(-1));
            const feedback_date = item.querySelector(".y3Ibjb")?.innerText;
            let image_urls = item.querySelectorAll(".Se89we");
            // /**@type{HTMLElement}*/
            let avatar = item.querySelector(".wSokxc");
            if (avatar instanceof HTMLElement) {
                if (avatar.style.backgroundImage) {
                    avatar = avatar.style.backgroundImage.replace((/url\(\"(.*?)\"\)/g), "$1");
                }
            }
            if (image_urls.length > 0) {
                image_urls = Array.from(image_urls).map((img) => {
                    const imgUrl = img.querySelector('.FfJICc');
                    return imgUrl.getAttribute('src').split('=')[0];
                });
            }
            const image_options = ['s125-p-k', 's2002-w1886-h2002'];
            const feedback_type = 'GOOGLE';
            return {
                g_id,
                full_name,
                avatar,
                rating,
                // ratingText,
                feedback_date,
                content,
                image_urls,
                image_options,
                feedback_type
            };
        });
    });

    // save feedback
    const storeReview = async (feedback) => {
        const formData = {
            feedbackList: feedback.reverse()
        }
        const storeUrl = `${apiPath}feedback/clone-from-google-review`;
        console.log(storeUrl);
        const response = await fetch(storeUrl, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                "X-STATIC-SITE-TOKEN": 'token',
            },
            body: JSON.stringify(
                formData
            )
        })
        if (response.ok) {
            const data = await response.json();
            console.log(data);
        } else {
            console.log('Failed to clone');
        }
    };

    await storeReview(feedback);

    // Display the feedback
    // console.log(feedback);
    // Close the browser
    // await browser.close();
};

// Start the scraping
getReviews();