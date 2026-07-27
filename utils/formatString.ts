import slugify from "slugify";

export function transferStringToSlug(value: string | null) {
    if (value == null) {
        return '';
    }
    return slugify(value.toLocaleLowerCase(), {
        replacement: '-',
        locale: 'vi',
        trim: true,
        remove: /[*+~.()'"!:@]/g
    })
}

export const transferViToEn = (value: string | null) => {
    if (value == null) {
        return '';
    }
    return slugify(value, {
        locale: 'vi',
        replacement: ' ',
        trim: true,
        lower: true
    })
}

export const capitalizeFirstLetter = (string: string) => {
    let arr = string?.split(' ');

    arr = arr?.map(item => {
        if (item.startsWith('[')) {
            return '[' + item.charAt(1).toUpperCase() + item.slice(2).toLowerCase();
        }
        if (item.startsWith('(')) {
            return '(' + item.charAt(1).toUpperCase() + item.slice(2).toLowerCase();
        }
        return item.charAt(0).toUpperCase() + item.slice(1).toLowerCase();
    });

    let result = arr?.join(' ');
    return result;
}


export const cutString = (text: string, length: number) => {
    if (typeof text !== 'string') return '';

    const trimmedText = text.trim().replace(/\s+/g, ' ');
    const words = trimmedText.split(' ');

    if (words.length <= length) {
        return text;
    }

    return `${words.slice(0, length).join(' ')}...`;
}

export const trimText = (text: string, length: number) => (text.length > length ? `${text.slice(0, length)}...` : text);


export const normalizeStr = (str: string) => {
    return (str || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd');
}

export const searchInString = (searchText: string, str: string) => {
    return normalizeStr(str || '').toLowerCase().includes(normalizeStr(searchText || '').toLowerCase());
}

export const highlightText = (item: string, keyword: string | null) => {
    if (!item || !keyword) return item;

    const normalizedItem = normalizeStr(item);
    const normalizedKeyword = normalizeStr(String(keyword));

    const firstIndex = normalizedItem.search(normalizedKeyword);
    if (firstIndex === -1) return item;

    let strReplace = item.slice(
        firstIndex,
        (firstIndex + (String(keyword).length ?? 0))
    );
    let strReplaced = `<strong class="text-bela-primary-1">${strReplace}</strong>`;
    return item.replaceAll(strReplace, strReplaced);
};

