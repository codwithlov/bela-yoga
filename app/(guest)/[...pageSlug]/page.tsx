
import React from 'react'
import Link from 'next/link';
import SearchResult from '../guestSearchShared/components/SearchResult';
import "@/styles/search.scss";
import "@/styles/components/ck-content.scss";

import { Metadata, ResolvingMetadata } from 'next';
import fetchApi from '@/services/api/fetchApi';
import SearchFeaturedListings from '../guestSearchShared/components/SearchFeaturedListings';
import SearchListingIntro from '../guestSearchShared/components/SearchListingIntro';
import SearchSupport from '../guestSearchShared/components/SearchSupport';
import SearchDetailOfDestination from '../guestSearchShared/components/SearchDetailOfDestination';
import { redirect, RedirectType } from 'next/navigation';
import { STATUS_404 } from '@/constants/status';
import { isEmpty } from '@/utils/helper';
import { IArticle } from '@/interfaces/article';
import { toQueryString } from '@/utils/apiUtils';
import { FLIGHT_DATE_KEY, SLUG_PERMALINK_KEY } from '../guestSearchShared/constants/searchParams';
import { GUEST_404, GUEST_SEARCH } from '@/constants/route';
import { addSEO, getTextOnly, parseContent } from '@/utils/htmlUtils';
import { generateArticleSchema, generateBreadcrumbSchema, generateFAQSchema } from '@/utils/schema';
import SchemaScript from '@/components/general/atoms/SchemaScript';
import Breadcrumb from '@/components/guest/Breadcrumb';
import { POST_SLUG, POST_TYPE_SLUG } from '@/constants/SlugPermalink';
import PostPage from '../guestSearchShared/pages/PostPage';
import ListingTables from '../guestSearchShared/components/ListingTables';
import AdminNavBarReduxUpdater from '@/components/guest/AdminNavBarReduxUpdater';
import PostTypePage from '../guestSearchShared/pages/PostTypePage';
import SearchFilters from '../guestSearchShared/components/SearchFilters';
import SearchBar from '../../../components/guest/organisms/SearchBar';
import SearchHeaderMobile from '../guestSearchShared/components/SearchHeaderMobile';
import SearchBarHorizontal from '@/components/guest/SearchBarHorizontal';
import Feedback from '@/components/guest/organisms/Feedback';
import ListingViewed from '@/components/guest/ListingViewed';
import PublicContentPage from '../components/PublicContentPage';
import { getPublicPostsByIdsFromStore, resolvePublicMenuRouteByPathFromStore } from '@/lib/template-cms-repository';

type SearchParamsObject = {
  [key: string]: string | string[] | undefined
}

type Props = {
  params: Promise<{
    pageSlug: string[]
  }>
  searchParams?: Promise<SearchParamsObject>
}

const getDefaultData = async (slug: string, admin: any) => {
  let defautDataPath = `market/get-default-data-search-page-by-slug?${SLUG_PERMALINK_KEY}=${slug}&checkImage=true${!!admin ? '&admin=true' : ''}`;
  let defaultData = await fetchApi({
    urlPath: defautDataPath,
    isNoCache: !!admin,
  });
  return defaultData;
}

const buildSlugPath = (parts: string[]) => `/${parts.join('/')}`;

const getKeywordBadges = (keywords?: string | null) => (keywords || '')
  .split(',')
  .map((keyword) => keyword.trim())
  .filter(Boolean);

const getResolvedRouteMetadata = async (pathname: string): Promise<Metadata | null> => {
  const resolved = await resolvePublicMenuRouteByPathFromStore(pathname);

  if (!resolved) {
    return null;
  }

  if (resolved.type === 'post') {
    return {
      title: resolved.post.meta_title || resolved.post.title,
      description: resolved.post.meta_description || resolved.post.excerpt,
      keywords: resolved.post.keywords,
      alternates: {
        canonical: resolved.menu.path || resolved.post.canonical || pathname,
      },
      robots: {
        index: resolved.post.index,
        follow: resolved.post.follow,
      },
      openGraph: {
        title: resolved.post.meta_title || resolved.post.title,
        description: resolved.post.meta_description || resolved.post.excerpt,
        type: 'article',
      },
    };
  }

  if (resolved.type === 'custom') {
    const customPage = resolved.menu.custom_page;

    return {
      title: customPage?.meta_title || resolved.menu.title,
      description: customPage?.meta_description || customPage?.summary || resolved.menu.title,
      keywords: customPage?.keywords || resolved.menu.title,
      alternates: {
        canonical: resolved.menu.path || pathname,
      },
      robots: {
        index: true,
        follow: true,
      },
      openGraph: {
        title: customPage?.meta_title || resolved.menu.title,
        description: customPage?.meta_description || customPage?.summary || resolved.menu.title,
        type: 'website',
      },
    };
  }

  return {
    title: resolved.page.meta_title || resolved.page.title,
    description: resolved.page.meta_description || resolved.page.summary,
    keywords: resolved.page.keywords,
    alternates: {
      canonical: resolved.menu.path || resolved.page.canonical || pathname,
    },
    robots: {
      index: resolved.page.index,
      follow: resolved.page.follow,
    },
    openGraph: {
      title: resolved.page.meta_title || resolved.page.title,
      description: resolved.page.meta_description || resolved.page.summary,
      type: 'website',
    },
  };
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { pageSlug } = await params;
  const resolvedSearchParams = await searchParams;
  const slug = pageSlug.join('/');
  const pathname = buildSlugPath(pageSlug);
  const resolvedRouteMetadata = await getResolvedRouteMetadata(pathname);

  if (resolvedRouteMetadata) {
    return resolvedRouteMetadata;
  }

  let metadata: Metadata = {};
  let defaultData = await getDefaultData(slug, false);
  let metaImages: string[] = defaultData?.metadata?.images ? [defaultData.metadata.images.thumbnail_360] : [];
  metadata = addSEO(metadata, defaultData?.metadata, metaImages, !!resolvedSearchParams?.admin, slug);
  return metadata;
}

const Search = async ({
  params,
  searchParams,
}: Props) => {
  const flightDateKey = FLIGHT_DATE_KEY;
  const { pageSlug } = await params;
  const resolvedSearchParams = (await searchParams) ?? {};
  let slug = pageSlug.join('/');
  const pathname = buildSlugPath(pageSlug);

  let goodPriceTourList: any[] = [];
  let marketData: any[] = [];
  let guestSearch = GUEST_SEARCH.split('/')[1];
  let articleIsEmpty: boolean | undefined;
  let article: IArticle | null = null;
  let questions: { title: string, content: string }[] = []
  let inputTitle = '';
  let tourTableData = null;
  let breadcrumb: any[] = [];
  let slugPermalink = null;
  let defaultData = null;

  if (slug !== guestSearch) {
    const resolvedMenuRoute = await resolvePublicMenuRouteByPathFromStore(pathname);

    if (resolvedMenuRoute?.type === 'custom') {
      const customPage = resolvedMenuRoute.menu.custom_page;
      const relatedPosts = await getPublicPostsByIdsFromStore(customPage?.related_post_ids || []);

      return (
        <PublicContentPage
          eyebrow={customPage?.eyebrow || 'Custom page'}
          title={resolvedMenuRoute.menu.title}
          summary={customPage?.summary || ''}
          metaDescription={customPage?.meta_description || customPage?.summary || ''}
          content={customPage?.content || '<p>Nội dung đang được cập nhật.</p>'}
          badges={getKeywordBadges(customPage?.keywords)}
          extraMeta={[
            resolvedMenuRoute.menu.location,
            resolvedMenuRoute.menu.path,
          ]}
          backHref='/'
          backLabel='Quay về trang chủ'
        >
          <div className='space-y-6'>
            {(customPage?.sections || []).length ? (
              <div className='grid gap-6 lg:grid-cols-2'>
                {(customPage?.sections || []).map((section) => (
                  <article key={section.id} className='rounded-[1.5rem] border border-sgt-gray-2 bg-white p-6 shadow-sm'>
                    <div className='space-y-3'>
                      <div className='text-xs font-semibold uppercase tracking-[0.18em] text-sgt-primary-1'>Section</div>
                      <h2 className='text-2xl font-bold text-sgt-secondary-2'>{section.title}</h2>
                      {section.summary ? <p className='text-sm leading-6 text-sgt-neutral-3'>{section.summary}</p> : null}
                      <div className='prose max-w-none prose-p:text-sgt-neutral-3 prose-headings:text-sgt-secondary-2' dangerouslySetInnerHTML={{ __html: section.content }} />
                      {section.cta_label && section.cta_href ? (
                        <div>
                          <Link href={section.cta_href} className='inline-flex rounded-full bg-sgt-primary-1 px-5 py-2 text-sm font-semibold text-white transition hover:bg-sgt-primary-2'>
                            {section.cta_label}
                          </Link>
                        </div>
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>
            ) : null}

            {relatedPosts.length ? (
              <div className='rounded-[1.5rem] border border-sgt-gray-2 bg-white p-6 shadow-sm'>
                <div className='mb-4'>
                  <div className='text-xs font-semibold uppercase tracking-[0.18em] text-sgt-primary-1'>Related posts</div>
                  <h2 className='mt-2 text-2xl font-bold text-sgt-secondary-2'>Bài viết liên quan</h2>
                </div>
                <div className='grid gap-4 lg:grid-cols-3'>
                  {relatedPosts.map((post) => (
                    <Link key={post.id} href={post.canonical || `/bai-viet/${post.slug}`} className='rounded-2xl border border-sgt-gray-2 p-4 transition hover:-translate-y-0.5 hover:border-sgt-primary-1 hover:shadow-sm'>
                      <div className='text-xs font-semibold uppercase tracking-[0.18em] text-sgt-primary-1'>{post.category}</div>
                      <h3 className='mt-2 text-lg font-bold text-sgt-secondary-2'>{post.title}</h3>
                      <p className='mt-2 text-sm leading-6 text-sgt-neutral-3'>{post.excerpt}</p>
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </PublicContentPage>
      );
    }

    if (resolvedMenuRoute?.type === 'post') {
      const post = resolvedMenuRoute.post;

      if (post) {
        return (
          <PublicContentPage
            eyebrow={post.category}
            title={post.title}
            summary={post.excerpt}
            metaDescription={post.meta_description || getTextOnly(post.description).slice(0, 180)}
            content={post.description}
            badges={getKeywordBadges(post.keywords)}
            extraMeta={[
              post.author_name,
              post.placement,
              post.published_at ? new Date(post.published_at).toLocaleDateString('vi-VN') : 'Draft',
            ].filter(Boolean)}
            backHref='/bai-viet'
            backLabel='Quay về thư viện bài viết'
          />
        );
      }
    }

    if (resolvedMenuRoute?.type === 'cms_page') {
      const page = resolvedMenuRoute.page;

      if (page) {
        return (
          <PublicContentPage
            eyebrow='CMS page'
            title={page.title}
            summary={page.summary}
            metaDescription={page.meta_description || getTextOnly(page.content).slice(0, 180)}
            content={page.content}
            badges={getKeywordBadges(page.keywords)}
            backHref='/'
            backLabel='Quay về trang chủ'
          />
        );
      }
    }

    let slugPermalinkPath = `slug-permalink/check-slug-permalink-exist?${SLUG_PERMALINK_KEY}=${slug}${!!resolvedSearchParams?.admin ? '&admin=true' : ''}`;
    slugPermalink = await fetchApi({
      urlPath: slugPermalinkPath,
      isNoCache: !!resolvedSearchParams?.admin,
    });
    if (!slugPermalink || slugPermalink == STATUS_404) {
      redirect(GUEST_404);
    } else if (slugPermalink.entity_type === POST_SLUG) {
      return <PostPage slugPermalink={slugPermalink} admin={!!resolvedSearchParams?.admin} />
    } else if (slugPermalink.entity_type === POST_TYPE_SLUG) {
      return <PostTypePage typeID={slugPermalink.entity_id} />
    }
    else {
      defaultData = await getDefaultData(slug, resolvedSearchParams?.admin);
      articleIsEmpty = isEmpty(defaultData?.article);
      article = defaultData?.article;
      breadcrumb = defaultData?.breadcrumb || [];
      tourTableData = defaultData?.tourTableData;
      inputTitle = breadcrumb?.[breadcrumb?.length - 1]?.label || '';
      let paramString: string = '';
      let searchParamsConvert: any = { ...resolvedSearchParams };
      searchParamsConvert[flightDateKey] = searchParamsConvert[flightDateKey] ?? null;
      searchParamsConvert[SLUG_PERMALINK_KEY] = slug;
      paramString = toQueryString(searchParamsConvert, true);

      goodPriceTourList = await fetchApi(
        {
          urlPath: `tour/tour-push-sale-by-search${paramString}`,
          isNoCache: !!resolvedSearchParams?.admin,
        }
      )
      marketData = await fetchApi(
        {
          urlPath: `market/market-summary-by-search${paramString}&limit=9&page=1`,
          allResponse: true,
        }
      )
      if (article) {
        questions = parseContent(article.question);
      }
    }
  } else {
    redirect(GUEST_SEARCH);
  }

  const optionListData = await fetchApi({
    urlPath: 'market/option-list-related-by-slug?slug_permalink=' + slugPermalink?.slug,
  })

  return (
    <section id='search_page' className={`search_page bg-sgt-bg-primary relative`}>
      {!isEmpty(questions) &&
        <SchemaScript
          id='faq-schema'
          schema={generateFAQSchema(questions.map(i => ({
            question: i.title,
            answer: getTextOnly(i.content)
          })))} />
      }
      {!articleIsEmpty &&
        <SchemaScript id="article-schema" schema={generateArticleSchema(article, slugPermalink)} />
      }
      {
        !isEmpty(breadcrumb) &&
        <SchemaScript id="breadcrumb-schema" schema={generateBreadcrumbSchema(breadcrumb)} />
      }
      <AdminNavBarReduxUpdater slugPermalink={slugPermalink} />
      <>
        <SearchBar>
          {(props: any) => {
            let data = props.data;
            return <>
              <div className='mb-2 max-sm:pb-6 block lg:hidden'>
                <SearchHeaderMobile
                  nationList={data.nationList}
                  destinationList={data.destinationList}
                  marketList={data.marketList}
                  title={inputTitle}
                  slug={slug}
                  tagList={data.tagList}
                />
              </div>
              <div className='hidden lg:block'>
                <SearchBarHorizontal
                  title={inputTitle}
                  nationList={data.nationList}
                  destinationList={data.destinationList}
                  marketList={data.marketList}
                  tagList={data.tagList}
                  slug={slug}
                />
              </div>
            </>
          }}
        </SearchBar>
        <div className=' hidden lg:flex'>
          <div className='width-primary m-auto py-10'>
            <Breadcrumb items={breadcrumb} />
          </div>
        </div>
        <div className='width-primary flex flex-col m-auto'>
          <section className='grid grid-cols-12 gap-x-5 max-sm:pt-0 max-sm:pb-0'>
            <section className='search_sidebar col-span-3 max-sm:hidden'>
              <section id='search_side_bar'>
                <SearchFilters slugType={slugPermalink?.entity_type} optionListData={optionListData} />
              </section>
            </section>
            <section className='search_content col-span-9 max-sm:col-span-12'>
              {
                !articleIsEmpty ?
                  <SearchListingIntro content={article?.description} title={inputTitle} /> :
                  null
              }
              <SearchFeaturedListings data={goodPriceTourList} />
              <SearchResult slugType={slugPermalink?.entity_type} optionListData={optionListData} marketData={marketData} slug={slug} />
            </section >
          </section >
          {
            !articleIsEmpty && !isEmpty(questions) ?
              <SearchSupport questions={questions} source={inputTitle} /> :
              null
          }
          {
            tourTableData && <ListingTables tourTableData={tourTableData} />
          }
          {
            !articleIsEmpty && !isEmpty(article?.info) ?
              <SearchDetailOfDestination content={article?.info} /> :
              null
          }
          <Feedback feedbacks={defaultData?.feedbacks ?? []} tagId={defaultData?.tag_id}/>
          <ListingViewed></ListingViewed>
        </div >
      </>
    </section >
  )
}

export default Search
{/* <SearchArrangeNavBar /> */ }
{/* params={params} searchParams={searchParams} */ }