export const formatPrice = (price: string): string => {
    if (price == null || price == '') {
        return price;
    }
    price = price.toString();
    const parts = price.split('.');
    const formattedParts = parts.map((part, index) => {
        if (index === 0) {
            return part.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        } else {
            return part;
        }
    });
    return formattedParts.join('.');
};

export const formatInputPrice = (value: any): string => {
    return String(value || '0').replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const stringPriceToNumber = (value: string): number => {
    return parseFloat((String(value) || '').replace(/\D/g, ''));
};

export const formatNumber = (value: any): string => {
    return String(value || '').replace(/\D/g, '');
}