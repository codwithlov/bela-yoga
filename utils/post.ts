
export const getSeoScoreColor = (score: any, index: any, keyword: any) => {
    if (index === 0) return 'seo-score-blue';
    if (!keyword) return 'seo-score-red';
    if (!score) return 'seo-score-gray'
    if (score >= 90) return 'seo-score-green';
    if (score >= 70) return 'seo-score-orange';
    return 'seo-score-red';
};