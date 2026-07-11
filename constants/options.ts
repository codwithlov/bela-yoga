import { DESTINATION_SLUG, MARKET_SLUG, NATION_SLUG, POST_SLUG, TOPIC_SLUG } from "./SlugPermalink";
import { HIGHLIGHT_TYPE_BEST_SELLER, HIGHLIGHT_TYPE_GOOD_PRICE, HIGHLIGHT_TYPE_HOT, HIGHLIGHT_TYPE_SAVE, TOPIC_TYPE_FLASH_SALE, TOPIC_TYPE_HOT } from "./ui";

export const topicTypeOptions = [
    {
        value: TOPIC_TYPE_HOT,
        label: 'Hot',
    },
    {
        value: TOPIC_TYPE_FLASH_SALE,
        label: 'FLASH SALE',
    },
    {
        value: 'NORMAL',
        label: 'Bình thường',
    }
];
export const marketHighlightOptions = [
    {
        value: HIGHLIGHT_TYPE_SAVE,
        label: 'Tiết kiệm',
    },
    {
        value: HIGHLIGHT_TYPE_GOOD_PRICE,
        label: 'Giá tốt',
    },
    {
        value: HIGHLIGHT_TYPE_HOT,
        label: 'Hot',
    },
    {
        value: HIGHLIGHT_TYPE_BEST_SELLER,
        label: 'Bán chạy',
    }
];

export const pageOptions = [
    {
        value: 'home',
        label: 'Trang chủ',
    },
];

export const slugEntityOptions = [
    { label: "Bài viết", value: POST_SLUG },
    { label: "Chủ đề", value: TOPIC_SLUG },
    { label: "Điểm đến", value: DESTINATION_SLUG },
    { label: "Quốc gia", value: NATION_SLUG },
    { label: "Thị trường", value: MARKET_SLUG }
]
