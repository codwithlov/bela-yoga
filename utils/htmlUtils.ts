import { HOST_NAME } from "@/constants/api";
import { DEFAULT_DESCRIPTION, DEFAULT_TITLE } from "@/constants/SlugPermalink";
import { SlugPermalink } from "@/interfaces/slugPermalink";
import { Metadata } from "next";

const queryHeaders = 'h1, h2, h3, h4, h5, h6';
export const getDoc = (html: string) => {
    let doc: Document;

    if (typeof window !== 'undefined') {
        const parser = new DOMParser();
        doc = parser.parseFromString(html, 'text/html');
    } else {
        const JSDOM = require('jsdom').JSDOM;
        const dom = new JSDOM(html);
        doc = dom.window.document;
    }
    return doc
}

export const parseContent = (html: string): { title: string; content: string }[] => {
    const doc = getDoc(html);
    const headings: NodeListOf<HTMLHeadingElement> = doc.querySelectorAll('h2');
    const result: { title: string; content: string }[] = [];

    headings.forEach((heading: HTMLHeadingElement) => {
        const title: string = heading.textContent?.trim() || '';
        let nextSibling = heading.nextSibling;
        let content = '';

        // Traverse all nodes until the next h2 heading or end of content
        while (nextSibling && nextSibling.nodeName !== 'H2') {
            if (nextSibling.nodeType === 3) { // Text node
                content += nextSibling.textContent?.trim() || '';
            } else if (nextSibling.nodeType === 1) { // Element node
                const element = nextSibling as HTMLElement;
                content += element.outerHTML;
            }
            nextSibling = nextSibling.nextSibling;
        }

        result.push({ title, content });
    });

    return result;
};

export const getTextOnly = (html: string) => {
    const doc = getDoc(html);
    const text = Array.from(doc.body.childNodes)
        .map(node => {
            if (node.nodeType === 3 || node.nodeType === 1) {
                return node.textContent;
            }
            return '';
        }).join(' ').trim();

    return text;
};

export const extractHeadings = (html: string) => {
    const doc = getDoc(html);
    const headings = Array.from(doc.querySelectorAll('h2, h3, h4'));

    const levelCounters: number[] = [0, 0, 0, 0, 0];

    return headings.map(heading => {
        const level = parseInt(heading.tagName[1], 10) - 2;
        levelCounters[level]++;
        levelCounters.fill(0, level + 1);

        const number = levelCounters.slice(0, level + 1).join('.');
        return {
            tagName: heading.tagName.toLowerCase(),
            text: number + '. ' + heading.textContent?.trim() || '',
            id: heading.id,
        };
    });
};


export const addHeadingIdsForContent = (html: string): string => {
    const doc = getDoc(html);
    const headings = doc.querySelectorAll(queryHeaders);

    headings.forEach((heading, index) => {
        const id = heading.textContent?.toLowerCase().replace(/\s+/g, '-') + `-${index}`;
        heading.setAttribute('id', id);
    });

    return doc.body.innerHTML;
};

export const getKeywordCountAndDensity = (text: string, keywords: string) => {
    const totalWords = (text || '').split(' ').filter(Boolean).length;
    const keywordArray = getKeywordArray(keywords);
    let count = 0;
    let notUseWords = '';

    keywordArray.forEach(keyword => {
        const regex = new RegExp(keyword, 'gi');
        const matches = text?.match(regex);

        if (matches) {
            count += matches.length;
        } else {
            notUseWords += notUseWords ? `, ${keyword}` : keyword
        }
    });

    const keywordDensity = totalWords > 0 ? ((count * 100) / totalWords).toFixed(2) : 0;

    return {
        totalKeywordCount: count,
        keywordDensity: keywordDensity as number,
        notUseWords,
        totalWords
    };
};

export const containKeywordHeadings = (parts: any[], keywords: string) => {
    const keywordArray = getKeywordArray(keywords);
    let count = 0;
    parts.forEach(part => {
        if (keywordArray.some(keyword => part.toLowerCase().includes(keyword))) {
            count += 1;
        }
    })
    return count;
};

const getKeywordArray = (keywords: string) => {
    return Array.from(new Set((keywords || '').split(',').map(keyword => keyword.trim().toLowerCase()).filter(Boolean)));
}

export const getAllAltTexts = (html: string) => {
    const doc = getDoc(html);
    const images = doc.querySelectorAll('img');
    const altTexts: string[] = [];

    images.forEach(img => {
        if (img.alt) {
            altTexts.push(img.alt);
        }
    });

    return altTexts;
};

export const checkLinks = (html: string) => {
    const doc = getDoc(html);
    const links = Array.from(doc.querySelectorAll('a'));

    let internalLinks: string[] = [];
    let externalLinks: string[] = [];

    links.forEach(link => {
        const webUrl = process.env.NEXT_PUBLIC_WEB_URL as string;
        const href = link.href;
        // 'change to process.env.NEXT_PUBLIC_WEB_URL || '' later'
        if (href.startsWith(webUrl)) {
            internalLinks.push(href);
        } else {
            externalLinks.push(href);
        }
    });

    return {
        internalLinks,
        externalLinks
    };
};

export const getTextBeforeFirstHeading = (html: string) => {
    const doc = getDoc(html);

    const headings = doc.querySelectorAll(queryHeaders);

    if (headings.length === 0) {
        return getTextOnly(html);
    }

    const firstHeading = headings[0];

    let textBeforeFirstHeading = '';
    let sibling = doc.body.firstChild;

    while (sibling && sibling !== firstHeading) {
        if (sibling.nodeType === 3) {
            textBeforeFirstHeading += sibling.textContent;
        } else if (sibling.nodeType === 1) {
            textBeforeFirstHeading += (sibling as HTMLElement).textContent;
        }
        sibling = sibling.nextSibling;
    }

    return textBeforeFirstHeading.trim();
}

export const getTextAfterLastHeading = (html: string) => {
    const doc = getDoc(html);

    const headings = doc.querySelectorAll(queryHeaders);

    if (headings.length === 0) {
        return '';
    }

    const lastHeading = headings[headings.length - 1];

    let textAfterLastHeading = '';
    let sibling = lastHeading.nextSibling;

    while (sibling) {
        if (sibling.nodeType === 3) {
            textAfterLastHeading += sibling.textContent;
        } else if (sibling.nodeType === 1) {
            textAfterLastHeading += (sibling as HTMLElement).textContent;
        }
        sibling = sibling.nextSibling;
    }

    return textAfterLastHeading.trim();
}

export const checkImageWithoutAlt = (html: string): boolean => {
    const doc = getDoc(html);
    let check = false;
    const images = doc.querySelectorAll('img');
    images.forEach(img => {
        if (!img.hasAttribute('alt') || img.getAttribute('alt') === '') {
            check = true;
        }
    });

    return check;
};

export const getMatchingKeywords = (keywordsString: string, keywordArray: string[]): string[] => {
    const keywords = getKeywordArray(keywordsString);
    keywordArray = keywordArray.map(i => i.toLowerCase());
    const matchingKeywords: string[] = keywords.filter(keyword => (keywordArray || []).includes(keyword));
    return matchingKeywords;
};

export const getFirstImageUrl = (html: string) => {
    const doc = getDoc(html);
    const images = Array.from(doc.querySelectorAll('img'));

    const getSrc = (img: Element) => (img.getAttribute('src') || '').trim();

    // Ưu tiên ảnh có width đủ lớn nếu có thông tin kích thước.
    for (const img of images) {
        const src = getSrc(img);
        if (!src) continue;

        const widthAttr = Number(img.getAttribute('width') || 0);
        const naturalWidth = (img as HTMLImageElement).width || 0;
        const width = Math.max(widthAttr, naturalWidth);

        if (width > 50) {
            return src;
        }
    }

    // Fallback: nhiều bài viết không khai báo width, lấy ảnh đầu tiên hợp lệ.
    for (const img of images) {
        const src = getSrc(img);
        if (src) {
            return src;
        }
    }

    return '';
};

export const formatHtml = (html: string) => {
    const doc = getDoc(html);
    doc.body.querySelectorAll('*').forEach((node) => {
        node.removeAttribute('style');
        node.removeAttribute('class');
        if (node.tagName.toLowerCase() === 'a') {
            let span = document.createElement('span');
            span.innerHTML = node.innerHTML.replace((/<(a).*?>(.*?)<\/(a)>/g), "$2");
            node.replaceWith(span);
        }
    });
    return doc.body.innerHTML;
}

export const getAnchorList = (html: string) => {
    const doc = getDoc(html);
    if (!doc) return [];

    return Array.from(doc.querySelectorAll('a')).map((a) => ({
        text: a.textContent?.trim() || '',
        href: a.getAttribute('href') || ''
    }));
};

export const addSEO = (metadata: Metadata, data: SlugPermalink, images: string[], admin: boolean, slug: string) => {
    metadata.metadataBase = new URL(`${HOST_NAME}`);
    metadata.title = data?.meta_title || DEFAULT_TITLE;
    metadata.description = data?.meta_description || DEFAULT_DESCRIPTION;
    metadata.keywords = data?.keywords || '';
    metadata.robots = {
        index: !admin && data?.index === 1,
        follow: !admin && data?.follow === 1,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
    }
    metadata.alternates = {
        canonical: `${HOST_NAME}${data?.canonical || slug}`,
    };
    metadata.openGraph = {
        images: images || []
    }
    return metadata;
}