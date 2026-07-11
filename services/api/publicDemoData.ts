import { IPublicHighlightCard, IPublicHomePayload, IPublicMatchCard, IPublicStoreItem } from '@/interfaces/discovery';
import {
    IOrganizationAvailabilityQuery,
    IOrganizationAvailabilityResponse,
    IOrganizationAvailabilityVenue,
    IOrganizationCard,
    IOrganizationDetail,
} from '@/interfaces/organization';

const addHours = (date: Date, hours: number) => {
    const next = new Date(date);
    next.setHours(next.getHours() + hours);
    return next;
};

const toIsoAt = (dayOffset: number, hour: number, minute = 0) => {
    const date = new Date();
    date.setDate(date.getDate() + dayOffset);
    date.setHours(hour, minute, 0, 0);
    return date.toISOString();
};

const demoOrganizationDetails: IOrganizationDetail[] = [
    {
        id: 9001,
        name: 'SV Arena Quận 7',
        slug: 'sv-arena-quan-7',
        address: '18 Nguyễn Lương Bằng, Phường Tân Phú, Quận 7, TP.HCM',
        description: 'Cụm sân bóng đá mini 5v5 và 7v7 chuẩn SPORTVERSE, có khu check-in đội bóng, nước uống, giữ xe và hỗ trợ captain đặt sân theo khung giờ cao điểm.',
        featured_image_url: null,
        map_pin_url: 'https://maps.google.com/?q=Nguyen+Luong+Bang+Quan+7',
        venues: [
            {
                id: 9101,
                name: 'Sân A1 - Cỏ nhân tạo 5v5',
                sport_type: 'football',
                venue_type: 'field',
                field_format: '5v5',
                venue_number: 1,
                capacity: 12,
                default_duration_minutes: 90,
                default_price: 420000,
                currency: 'VND',
                cover_image_url: null,
                description: 'Sân 5v5 đèn LED, phù hợp giao hữu sau giờ làm và booking theo team.',
            },
            {
                id: 9102,
                name: 'Sân B2 - Cỏ nhân tạo 7v7',
                sport_type: 'football',
                venue_type: 'field',
                field_format: '7v7',
                venue_number: 2,
                capacity: 18,
                default_duration_minutes: 90,
                default_price: 720000,
                currency: 'VND',
                cover_image_url: null,
                description: 'Sân rộng cho đội công ty, có khu vực quay highlight và bảng tỉ số cơ bản.',
            },
        ],
    },
    {
        id: 9002,
        name: 'Verse Field Thảo Điền',
        slug: 'verse-field-thao-dien',
        address: '32 Quốc Hương, Thảo Điền, TP. Thủ Đức, TP.HCM',
        description: 'Điểm hẹn thể thao cộng đồng cho bóng đá 5v5, lớp kỹ năng trẻ em và các trận challenge cuối tuần trên hệ sinh thái SPORTVERSE.',
        featured_image_url: null,
        map_pin_url: 'https://maps.google.com/?q=Quoc+Huong+Thao+Dien',
        venues: [
            {
                id: 9201,
                name: 'Verse Field 01',
                sport_type: 'football',
                venue_type: 'field',
                field_format: '5v5',
                venue_number: 1,
                capacity: 12,
                default_duration_minutes: 90,
                default_price: 450000,
                currency: 'VND',
                cover_image_url: null,
                description: 'Sân trung tâm, ưu tiên booking nhanh và tạo trận mở để tìm đối thủ.',
            },
            {
                id: 9202,
                name: 'Verse Training Zone',
                sport_type: 'football',
                venue_type: 'training_zone',
                field_format: 'skills',
                venue_number: 2,
                capacity: 16,
                default_duration_minutes: 60,
                default_price: 300000,
                currency: 'VND',
                cover_image_url: null,
                description: 'Khu tập kỹ thuật, drill cá nhân và lớp academy nhỏ.',
            },
        ],
    },
    {
        id: 9003,
        name: 'Pickle Hub Bình Thạnh',
        slug: 'pickle-hub-binh-thanh',
        address: '88 Ung Văn Khiêm, Bình Thạnh, TP.HCM',
        description: 'Cụm sân pickleball/badminton đô thị, phù hợp đặt lịch ngắn, ghép cặp và tổ chức mini tournament cho cộng đồng văn phòng.',
        featured_image_url: null,
        map_pin_url: 'https://maps.google.com/?q=Ung+Van+Khiem+Binh+Thanh',
        venues: [
            {
                id: 9301,
                name: 'Court P1 - Pickleball',
                sport_type: 'pickleball',
                venue_type: 'court',
                field_format: 'double',
                venue_number: 1,
                capacity: 4,
                default_duration_minutes: 60,
                default_price: 220000,
                currency: 'VND',
                cover_image_url: null,
                description: 'Sân tiêu chuẩn cho đôi nam/nữ, có vợt thuê và nước uống tại quầy.',
            },
            {
                id: 9302,
                name: 'Court B1 - Badminton',
                sport_type: 'badminton',
                venue_type: 'court',
                field_format: 'single_double',
                venue_number: 2,
                capacity: 4,
                default_duration_minutes: 60,
                default_price: 180000,
                currency: 'VND',
                cover_image_url: null,
                description: 'Sân cầu lông trong nhà, phù hợp booking sau giờ làm và ghép đội nhanh.',
            },
        ],
    },
    {
        id: 9004,
        name: 'Northside Sport Complex',
        slug: 'northside-sport-complex',
        address: '12 Phạm Văn Đồng, Gò Vấp, TP.HCM',
        description: 'Tổ hợp bóng đá, futsal và dịch vụ quay highlight cơ bản cho các đội phong trào phía Bắc thành phố.',
        featured_image_url: null,
        map_pin_url: 'https://maps.google.com/?q=Pham+Van+Dong+Go+Vap',
        venues: [
            {
                id: 9401,
                name: 'Northside Futsal 01',
                sport_type: 'football',
                venue_type: 'indoor_field',
                field_format: 'futsal',
                venue_number: 1,
                capacity: 10,
                default_duration_minutes: 90,
                default_price: 520000,
                currency: 'VND',
                cover_image_url: null,
                description: 'Sân futsal trong nhà, mặt sân phẳng và có line rõ cho giải mini.',
            },
        ],
    },
];

export const demoOrganizations: IOrganizationCard[] = demoOrganizationDetails.map(({ venues: _venues, map_pin_url: _mapPinUrl, ...organization }) => organization);

export const demoMatches: IPublicMatchCard[] = [
    {
        id: 9501,
        title: 'SV Arena Q7 FC vs Monday Runners',
        description: 'Kèo giao hữu 5v5 mở cho captain xác nhận đội hình, ưu tiên team đã có booking khung 19:00.',
        organization_name: 'SV Arena Quận 7',
        organization_slug: 'sv-arena-quan-7',
        venue_name: 'Sân A1 - Cỏ nhân tạo 5v5',
        team_name: 'SV Arena Q7 FC',
        sport_type: 'football',
        match_type: 'friendly',
        participation_mode: 'team',
        starts_at: toIsoAt(1, 19, 0),
        ends_at: toIsoAt(1, 20, 30),
        status: 'open',
        visibility: 'public',
        max_participants: 12,
    },
    {
        id: 9502,
        title: 'Thảo Điền Sunday Challenge',
        description: 'Trận challenge cuối tuần dành cho đội 5v5 khu Thảo Điền, có recap highlight sau trận.',
        organization_name: 'Verse Field Thảo Điền',
        organization_slug: 'verse-field-thao-dien',
        venue_name: 'Verse Field 01',
        team_name: 'Verse Field Academy',
        sport_type: 'football',
        match_type: 'challenge',
        participation_mode: 'team',
        starts_at: toIsoAt(3, 17, 30),
        ends_at: toIsoAt(3, 19, 0),
        status: 'scheduled',
        visibility: 'public',
        max_participants: 12,
    },
    {
        id: 9503,
        title: 'Pickle Hub Mixed Doubles Night',
        description: 'Lịch ghép đôi pickleball cho cộng đồng văn phòng Bình Thạnh, phù hợp người mới chơi.',
        organization_name: 'Pickle Hub Bình Thạnh',
        organization_slug: 'pickle-hub-binh-thanh',
        venue_name: 'Court P1 - Pickleball',
        team_name: null,
        sport_type: 'pickleball',
        match_type: 'community',
        participation_mode: 'individual',
        starts_at: toIsoAt(2, 20, 0),
        ends_at: toIsoAt(2, 21, 0),
        status: 'open',
        visibility: 'public',
        max_participants: 4,
    },
    {
        id: 9504,
        title: 'Northside Futsal Mini Cup',
        description: 'Mini cup futsal 4 đội, dùng dữ liệu demo để kiểm tra feed trận đấu và nội dung cộng đồng.',
        organization_name: 'Northside Sport Complex',
        organization_slug: 'northside-sport-complex',
        venue_name: 'Northside Futsal 01',
        team_name: 'Northside United',
        sport_type: 'football',
        match_type: 'tournament',
        participation_mode: 'team',
        starts_at: toIsoAt(5, 18, 0),
        ends_at: toIsoAt(5, 21, 0),
        status: 'scheduled',
        visibility: 'public',
        max_participants: 40,
    },
];

export const demoHighlights: IPublicHighlightCard[] = [
    {
        id: 9601,
        title: 'Top 5 pha phối hợp một chạm tại SV Arena',
        description: 'Recap demo cho module highlight: các pha ban bật, dứt điểm và khoảnh khắc fair-play sau trận.',
        organization_name: 'SV Arena Quận 7',
        venue_name: 'Sân A1 - Cỏ nhân tạo 5v5',
        team_name: 'SV Arena Q7 FC',
        starts_at: toIsoAt(-1, 21, 0),
        status: 'published',
        source_type: 'match_recap',
    },
    {
        id: 9602,
        title: 'Verse Field Academy: buổi tập kỹ năng đầu tiên',
        description: 'Nội dung ngắn cho academy/training, dùng để kiểm tra luồng public content của LDP.',
        organization_name: 'Verse Field Thảo Điền',
        venue_name: 'Verse Training Zone',
        team_name: 'Verse Field Academy',
        starts_at: toIsoAt(-2, 18, 30),
        status: 'published',
        source_type: 'training',
    },
    {
        id: 9603,
        title: 'Pickleball rally dài nhất tuần',
        description: 'Highlight cộng đồng pickleball với rally demo để trang có nội dung ngay khi chưa có media API riêng.',
        organization_name: 'Pickle Hub Bình Thạnh',
        venue_name: 'Court P1 - Pickleball',
        team_name: null,
        starts_at: toIsoAt(-3, 20, 0),
        status: 'published',
        source_type: 'community_clip',
    },
    {
        id: 9604,
        title: 'Northside Futsal: pha cứu thua cuối trận',
        description: 'Clip demo cho feed highlight, liên kết ngược về sân và trận đấu liên quan.',
        organization_name: 'Northside Sport Complex',
        venue_name: 'Northside Futsal 01',
        team_name: 'Northside United',
        starts_at: toIsoAt(-4, 19, 45),
        status: 'published',
        source_type: 'match_recap',
    },
];

export const demoStoreItems: IPublicStoreItem[] = [
    {
        id: 9701,
        organization_id: 9001,
        organization_name: 'SV Arena Quận 7',
        name: 'Combo nước suối + khăn lạnh đội bóng',
        type: 'product',
        category: 'addon',
        price: 120000,
        unit: 'combo',
        description: 'Gói tiện ích bán kèm booking cho đội 10-12 người.',
        sport_type: 'football',
        field_format: '5v5',
        is_addon: true,
        stock_quantity: 80,
    },
    {
        id: 9702,
        organization_id: 9002,
        organization_name: 'Verse Field Thảo Điền',
        name: 'Gói quay highlight 60 phút',
        type: 'service',
        category: 'media',
        price: 350000,
        unit: 'trận',
        description: 'Dịch vụ quay nhanh để tạo recap/higlight sau trận trên SPORTVERSE.',
        sport_type: 'football',
        field_format: '5v5',
        is_addon: true,
        stock_quantity: null,
    },
    {
        id: 9703,
        organization_id: 9003,
        organization_name: 'Pickle Hub Bình Thạnh',
        name: 'Thuê vợt pickleball',
        type: 'service',
        category: 'equipment',
        price: 50000,
        unit: 'vợt/giờ',
        description: 'Vợt demo cho người mới chơi, có thể chọn cùng lúc đặt sân.',
        sport_type: 'pickleball',
        field_format: 'double',
        is_addon: true,
        stock_quantity: 24,
    },
    {
        id: 9704,
        organization_id: 9004,
        organization_name: 'Northside Sport Complex',
        name: 'Voucher futsal giờ thấp điểm',
        type: 'package',
        category: 'voucher',
        price: 990000,
        unit: '3 buổi',
        description: 'Gói đặt sân tiết kiệm cho team tập định kỳ trong tuần.',
        sport_type: 'football',
        field_format: 'futsal',
        is_addon: false,
        stock_quantity: 20,
    },
];

const limitItems = <T>(items: T[], limit?: number) => items.slice(0, limit && limit > 0 ? limit : items.length);

const minutesBetween = (startTime: string, endTime: string) => {
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    return Math.max(0, (endHour * 60 + endMinute) - (startHour * 60 + startMinute));
};

const toAvailabilityVenue = (venue: IOrganizationDetail['venues'][number], index: number): IOrganizationAvailabilityVenue => {
    const isAvailable = index % 3 !== 2;

    return {
        id: venue.id,
        name: venue.name,
        sport_type: venue.sport_type,
        venue_type: venue.venue_type,
        field_format: venue.field_format,
        venue_number: venue.venue_number,
        cover_image_url: venue.cover_image_url,
        status: isAvailable ? 'available' : 'busy',
        is_bookable: true,
        availability: {
            is_available: isAvailable,
            reason: isAvailable ? null : 'Khung giờ demo đã có đội khác giữ chỗ.',
            blocking_range: isAvailable
                ? null
                : {
                    starts_at: addHours(new Date(), 1).toISOString(),
                    ends_at: addHours(new Date(), 2).toISOString(),
                },
        },
        pricing: {
            pricing_rule_id: null,
            field_price_amount: venue.default_price,
            total_amount: venue.default_price,
            currency: venue.currency,
        },
    };
};

export const getDemoOrganizations = (limit?: number): IOrganizationCard[] => limitItems(demoOrganizations, limit);

export const getDemoOrganizationBySlug = (slug: string): IOrganizationDetail | null => (
    demoOrganizationDetails.find((organization) => organization.slug === slug) || null
);

export const getDemoOrganizationAvailability = (
    slug: string,
    params: IOrganizationAvailabilityQuery,
): IOrganizationAvailabilityResponse | null => {
    const organization = getDemoOrganizationBySlug(slug);

    if (!organization) {
        return null;
    }

    const venues = organization.venues
        .filter((venue) => !params.sport_type || venue.sport_type === params.sport_type)
        .filter((venue) => !params.field_format || venue.field_format === params.field_format)
        .map(toAvailabilityVenue);

    return {
        organization: {
            id: organization.id,
            name: organization.name,
            slug: organization.slug,
        },
        query: {
            sport_type: params.sport_type || null,
            field_format: params.field_format || null,
            date: params.date,
            start_time: params.start_time,
            end_time: params.end_time,
            duration_minutes: minutesBetween(params.start_time, params.end_time),
            timezone: 'Asia/Ho_Chi_Minh',
        },
        summary: {
            total_venues: venues.length,
            available_venues: venues.filter((venue) => venue.availability.is_available).length,
            busy_venues: venues.filter((venue) => !venue.availability.is_available).length,
            maintenance_venues: 0,
        },
        venues,
    };
};

export const appendDemoOrganizations = (organizations: IOrganizationCard[], limit?: number): IOrganizationCard[] => {
    const maxItems = limit && limit > 0 ? limit : organizations.length || demoOrganizations.length;
    const existingSlugs = new Set(organizations.map((organization) => organization.slug));
    const merged = [
        ...organizations,
        ...demoOrganizations.filter((organization) => !existingSlugs.has(organization.slug)),
    ];

    return limitItems(merged, maxItems);
};

export const appendDemoMatches = (matches: IPublicMatchCard[], limit?: number): IPublicMatchCard[] => {
    const maxItems = limit && limit > 0 ? limit : matches.length || demoMatches.length;
    const existingIds = new Set(matches.map((match) => match.id));
    return limitItems([...matches, ...demoMatches.filter((match) => !existingIds.has(match.id))], maxItems);
};

export const appendDemoHighlights = (highlights: IPublicHighlightCard[], limit?: number): IPublicHighlightCard[] => {
    const maxItems = limit && limit > 0 ? limit : highlights.length || demoHighlights.length;
    const existingIds = new Set(highlights.map((highlight) => highlight.id));
    return limitItems([...highlights, ...demoHighlights.filter((highlight) => !existingIds.has(highlight.id))], maxItems);
};

export const appendDemoStoreItems = (items: IPublicStoreItem[], limit?: number): IPublicStoreItem[] => {
    const maxItems = limit && limit > 0 ? limit : items.length || demoStoreItems.length;
    const existingIds = new Set(items.map((item) => item.id));
    return limitItems([...items, ...demoStoreItems.filter((item) => !existingIds.has(item.id))], maxItems);
};

export const getDemoHomePayload = (): IPublicHomePayload => ({
    sections: {
        organizations: demoOrganizations,
        matches: demoMatches,
        highlights: demoHighlights,
        store_items: demoStoreItems,
    },
    template: {
        posts: [],
        home_sections: [],
        header_menu: [],
        footer_menu: [],
    },
    summary: {
        organizations_count: demoOrganizations.length,
        matches_count: demoMatches.length,
        store_items_count: demoStoreItems.length,
    },
});

export const withDemoHomeFallback = (payload: IPublicHomePayload | null): IPublicHomePayload => {
    const fallback = getDemoHomePayload();

    if (!payload) {
        return fallback;
    }

    return {
        sections: {
            organizations: appendDemoOrganizations(payload.sections.organizations || [], 4),
            matches: appendDemoMatches(payload.sections.matches || [], 4),
            highlights: appendDemoHighlights(payload.sections.highlights || [], 4),
            store_items: appendDemoStoreItems(payload.sections.store_items || [], 4),
        },
        template: {
            posts: payload.template?.posts || fallback.template.posts,
            home_sections: payload.template?.home_sections || fallback.template.home_sections,
            header_menu: payload.template?.header_menu || fallback.template.header_menu,
            footer_menu: payload.template?.footer_menu || fallback.template.footer_menu,
        },
        summary: {
            organizations_count: Math.max(payload.summary.organizations_count, fallback.summary.organizations_count),
            matches_count: Math.max(payload.summary.matches_count, fallback.summary.matches_count),
            store_items_count: Math.max(payload.summary.store_items_count, fallback.summary.store_items_count),
        },
    };
};
