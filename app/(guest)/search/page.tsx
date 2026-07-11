import React from 'react';
import SearchAdviseForm from './components/SearchAdviseForm';
import SearchList from './components/SearchList';

type SearchPageProps = {
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}

const SearchPage = async ({
    searchParams
}: SearchPageProps) => {
    const resolvedSearchParams = await searchParams;
    let keyword = resolvedSearchParams?.keyword as string;
    return (
        <section>
            <div className='width-primary m-auto max-xl:px-4 py-10'>
                <div className='grid grid-cols-12 gap-4'>
                    <div className='col-span-12 lg:col-span-8'>
                        <SearchList keyword={keyword} />
                    </div>
                    <div className='lg:col-span-4 sticky top-24 self-start hidden lg:block'>
                        <SearchAdviseForm />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SearchPage;
