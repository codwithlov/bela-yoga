'use client';
import React, { useState } from 'react';
import MarketSearchList from './MarketSearchList';
import PostSearchList from './PostSearchList';
import SearchNoResult from './SearchNoResult';

const SearchList = ({
    keyword
}: {
    keyword: string
}) => {
    const [hasMarkets, setHasMarktes] = useState(true);
    const [hasPosts, setHasPosts] = useState(true);
    if (!hasPosts && !hasMarkets) {
        return <SearchNoResult keyword={keyword} />
    }
    return (
        <section>
            <MarketSearchList keyword={keyword} setHasMarktes={setHasMarktes} />
            <PostSearchList keyword={keyword} setHasPosts={setHasPosts} />
        </section>
    );
};

export default SearchList;
