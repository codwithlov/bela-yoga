
import React, { Fragment } from 'react';
import fetchApi from '@/services/api/fetchApi';
import { PAGINATE_METHOD } from '@/constants/api';

const SearchBar = async ({
    children,
}: {
    children: any
}) => {
    const nationList = await fetchApi({
        urlPath: `nation/option-list?method=${PAGINATE_METHOD}&limit=50`,
    })

    const destinationList = await fetchApi({
        urlPath: `destination/option-list?method=${PAGINATE_METHOD}&limit=50`,
    })

    const marketList = await fetchApi({
        urlPath: `market/option-list?method=${PAGINATE_METHOD}&limit=50`,
    })

    const tagList = await fetchApi({
        urlPath: `tag/option-list?method=${PAGINATE_METHOD}&limit=50`,
    })

    const data = {
        nationList: nationList,
        destinationList: destinationList,
        marketList: marketList,
        tagList: tagList,
    }
    return (
        <Fragment>
            {children && children({ data }) ? children({ data }) : null}
        </Fragment>
    );
};
SearchBar.displayName = 'SearchBar';
export default SearchBar;
