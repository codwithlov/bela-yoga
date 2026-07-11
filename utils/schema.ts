import { IArticleSchema } from "@/interfaces/article";
import { IMarketDetail } from "@/interfaces/market";
import { getFirstImageUrl } from "./htmlUtils";
import { SlugPermalink } from "@/interfaces/slugPermalink";
import { FACEBOOK, TIKTOK, YOUTUBE } from "@/constants/link";

// Organization Schema
export const generateOrganizationSchema = () => {
    const logoUrl = `${process.env.NEXT_PUBLIC_WEB_URL}assets/images/logo/merge-logo.png`;
    const schema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "@id": process.env.NEXT_PUBLIC_WEB_URL + '#Organization',
        url: process.env.NEXT_PUBLIC_WEB_URL,
        foundingDate: "14/09/2017",
        logo: logoUrl,
        contactPoint: [
            {
                "@type": "ContactPoint",
                telephone: "0916 938 824",
                contactType: "customer service",
                areaServed: "VI"
            }
        ],
        sameAs: [
            YOUTUBE,
            TIKTOK,
            FACEBOOK,
        ]
    };

    return schema;
};


// Product Schema
export const generateProductSchema = (marketDetail: IMarketDetail, slugPermalink: SlugPermalink, sku?: string) => {
    const schema = {
        "@context": "https://schema.org",
        "@type": "Product",
        name: marketDetail?.tour_name,
        image: marketDetail?.images?.map(i => i.original_image)?.slice(0, 5),
        description: slugPermalink?.meta_description,
        sku: sku || '',
        mpn: sku || '',
        brand: {
            "@type": "Brand",
            name: "SPORTVERSE"
        },
        review: {
            "@type": "Review",
            reviewRating: {
                "@type": "Rating",
                ratingValue: marketDetail?.rating?.toString(),
                bestRating: "5",
            },
            author: {
                "@type": "Organization",
                name: "SPORTVERSE",
            },
        },
        aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: marketDetail?.rating?.toString(),
            reviewCount: marketDetail?.reviewCount?.toString(),
        },
        offers: {
            "@type": "Offer",
            url: process.env.NEXT_PUBLIC_WEB_URL + slugPermalink.slug,
            priceCurrency: "VND",
            price: marketDetail?.price?.toString(),
            itemCondition: "https://schema.org/UsedCondition",
            availability: "https://schema.org/InStock",
            seller: {
                "@type": "Organization",
                name: "SPORTVERSE",
            },
        },
    };

    return schema;
};

// FAQ Schema
export const generateFAQSchema = (faqList: { question: string; answer: string }[]) => {
    const mainEntity = faqList.map(faq => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
        },
    }));

    const schema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity,
    };

    return schema;
};

// Breadcrumb Schema
export const generateBreadcrumbSchema = (breadcrumbList: { label: string; value: string }[]) => {
    breadcrumbList = [
        { value: '', label: 'Trang chủ' },
        ...breadcrumbList,
    ]
    const itemListElement = breadcrumbList.map((breadcrumb, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: breadcrumb.label,
        item: process.env.NEXT_PUBLIC_WEB_URL + breadcrumb.value,
    }));

    const schema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement,
    };

    return schema;
};

// Travel Agency Schema
export const generateTravelAgencySchema = () => {
    const logoUrl = `${process.env.NEXT_PUBLIC_WEB_URL}assets/images/logo/merge-logo.png`;
    const schema = {
        "@context": "https://schema.org",
        "@type": "TravelAgency",
        "@id": process.env.NEXT_PUBLIC_WEB_URL,
        name: "SPORTVERSE",
        image: logoUrl,
        telephone: "0916 938 824",
        priceRange: "VND",
        address: [
            {
                "@type": "PostalAddress",
                streetAddress: "Tòa nhà Nam Sài Gòn, 19 Huỳnh Đình Hai, Bình Thạnh, Hồ Chí Minh",
                addressLocality: "Thành phố Thủ Đức",
                addressRegion: "Hồ Chí Minh",
                postalCode: "700000",
                addressCountry: {
                    "@type": "Country",
                    name: "VN",
                },
            },
            {
                "@type": "PostalAddress",
                streetAddress: "N03-04, ngõ 59 Láng Hạ, phường Thành Công, quận Ba Đình, Hà Nội",
                addressLocality: "Quận Ba Đình",
                addressRegion: "Hà Nội",
                postalCode: "100000",
                addressCountry: {
                    "@type": "Country",
                    name: "VN"
                }
            }
        ],
        geo: [
            {
                "@type": "GeoCoordinates",
                latitude: "10.804449",
                longitude: "106.700431",
            },
            {
                "@type": "GeoCoordinates",
                latitude: "21.018868",
                longitude: "105.817803",
            },
        ],
        openingHoursSpecification: {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: [
                "http://schema.org/Monday",
                "http://schema.org/Tuesday",
                "http://schema.org/Wednesday",
                "http://schema.org/Thursday",
                "http://schema.org/Friday",
            ],
            opens: "08:30",
            closes: "18:00",
        },
    };

    return schema;
};

// Website Schema
export const generateWebsiteSchema = () => {
    const schema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        url: process.env.NEXT_PUBLIC_WEB_URL,
        potentialAction: {
            "@type": "SearchAction",
            target: `${process.env.NEXT_PUBLIC_WEB_URL}search?keyword={search_term_string}`,
            "query-input": "required name=search_term_string",
        },
    };

    return schema;
};

const getArticleSchemaData = (article: any, slugPermalink: SlugPermalink): IArticleSchema => {
    return {
        slug: slugPermalink?.slug || '',
        title: slugPermalink?.meta_title || '',
        imageUrl: article?.images?.[0]?.original_image || getFirstImageUrl(article?.info || article?.description || ''),
        description: slugPermalink?.meta_description || '',
        datePublished: article?.publish_date || article?.created_at || '',
        dateModified: article?.updated_at || '',
    }
}

// Aritcal Schema
export const generateArticleSchema = (article: any, slugPermalink: SlugPermalink) => {
    const { slug, title, imageUrl, description, datePublished, dateModified } = getArticleSchemaData(article, slugPermalink);
    return {
        "@context": "https://schema.org",
        "@type": "Article",
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": process.env.NEXT_PUBLIC_WEB_URL + slug,
        },
        "headline": title,
        "image": imageUrl,
        "description": description,
        "datePublished": datePublished,
        "dateModified": dateModified,
        "author": {
            "@type": "Person",
            "@id": `${process.env.NEXT_PUBLIC_WEB_URL + slug}#author`,
            "url": `${process.env.NEXT_PUBLIC_WEB_URL + slug}#author`,
            "name": "SPORTVERSE",
        },
        "publisher": {
            "@type": "Organization",
            "@id": process.env.NEXT_PUBLIC_WEB_URL + '#Organization',
        },
    };
};
