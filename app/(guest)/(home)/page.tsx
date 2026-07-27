import Link from "next/link";
import { GUEST_ABOUT_US, GUEST_ACTION, GUEST_COURSES } from "@/constants/route";
import {
  getPublicHomeData,
  getPublicPosts,
  getPublicSections,
  getPublicStoreItems,
} from "@/services/api/discovery";
import { templateSiteConfig } from "@/config/template/site";

export default async function Home() {
  const [publicHomeSample, productsSample, postsSample, homeSectionsSample] =
    await Promise.all([
      getPublicHomeData(),
      getPublicStoreItems(3),
      getPublicPosts(3),
      getPublicSections("home"),
    ]);
  const homeConfig = templateSiteConfig.home;

  return (
    <div className="bg-[radial-gradient(circle_at_top,_rgb(var(--template-color-primary-light-rgb)/0.18),_transparent_45%),linear-gradient(180deg,var(--template-color-secondary-dark)_0%,var(--template-color-secondary-default)_38%,var(--template-color-background-primary)_38%,var(--template-color-background-primary)_100%)]">
      <section className="width-primary mx-auto px-4 pb-20 pt-12 text-white lg:pt-20">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div className="space-y-6">
            <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-bela-primary-3">
              {homeConfig.badge}
            </span>
            <div className="space-y-4">
              <h1 className="max-w-3xl text-4xl font-bold leading-tight text-white md:text-5xl">
                {homeConfig.title}
              </h1>
              <p className="max-w-2xl text-base leading-7 text-slate-200 md:text-lg">
                {homeConfig.description}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href={GUEST_ACTION}
                className="rounded-xl bg-gradient-to-r from-bela-primary-1 to-bela-primary-2 px-6 py-3 text-sm font-semibold text-white shadow-bela-primary transition hover:-translate-y-0.5"
              >
                {homeConfig.primaryCta}
              </Link>
              <Link
                href={GUEST_COURSES}
                className="rounded-xl border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
              >
                {homeConfig.secondaryCta}
              </Link>
            </div>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-white/95 p-6 text-bela-neutral-1 shadow-2xl shadow-black/20 sv-accent-ring">
            <div className="space-y-5">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.22em] text-bela-primary-1">
                  {/* Site scope */}
                  BelaYoga
                </div>
                <h2 className="mt-2 text-2xl font-bold text-bela-secondary-2">
                  {homeConfig.scopeTitle}
                </h2>
              </div>
              <div className="grid gap-3">
                {homeConfig.quickLinks.map((step) => (
                  <div
                    key={step}
                    className="rounded-2xl border border-bela-gray-2 bg-bela-bg-primary px-4 py-3 text-sm text-bela-neutral-2"
                  >
                    {step}
                  </div>
                ))}
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <Link
                  href={GUEST_ACTION}
                  className="rounded-2xl border border-bela-gray-2 px-4 py-4 transition hover:border-bela-primary-2 hover:bg-bela-primary-4"
                >
                  <div className="text-sm font-semibold text-bela-secondary-2">
                    Tập Yoga
                  </div>
                  <div className="mt-1 text-xs text-bela-neutral-3">
                    Khám phá các lớp tập phù hợp theo thể trạng và mục tiêu.
                  </div>
                </Link>
                <Link
                  href={GUEST_ABOUT_US}
                  className="rounded-2xl border border-bela-gray-2 px-4 py-4 transition hover:border-bela-primary-2 hover:bg-bela-primary-4"
                >
                  <div className="text-sm font-semibold text-bela-secondary-2">
                    Giới thiệu
                  </div>
                  <div className="mt-1 text-xs text-bela-neutral-3">
                    BelaYoga đồng hành cùng bạn tìm về bản ngã.
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="width-primary mx-auto px-4 pb-10">
        <div className="rounded-[2rem] border border-bela-gray-2 bg-white/95 p-6 shadow-sm md:p-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-bela-primary-1">
                {homeConfig.actionSection.eyebrow}
              </div>
              <h2 className="mt-2 text-2xl font-bold text-bela-secondary-2 md:text-3xl">
                {homeConfig.actionSection.title}
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-bela-neutral-3">
                {homeConfig.actionSection.description}
              </p>
            </div>
            <Link
              href={GUEST_ACTION}
              className="text-sm font-semibold text-bela-primary-1 transition hover:text-bela-primary-2"
            >
              {homeConfig.actionSection.cta}
            </Link>
          </div>
          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {postsSample.length > 0 ? (
              postsSample.map((post) => (
                <Link
                  key={post.id}
                  href={`${GUEST_ACTION}/${post.slug}`}
                  className="rounded-[1.5rem] border border-bela-gray-2 bg-bela-bg-primary p-5 transition hover:-translate-y-1 hover:border-bela-primary-2 hover:shadow-lg"
                >
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-bela-primary-1">
                    {post.category}
                  </div>
                  <h3 className="mt-3 text-xl font-bold text-bela-secondary-2">
                    {post.title}
                  </h3>
                  <p className="mt-2 text-sm text-bela-neutral-3">
                    {post.excerpt}
                  </p>
                  <div className="mt-4 text-sm font-semibold text-bela-primary-1">
                    Xem chi tiết
                  </div>
                </Link>
              ))
            ) : (
              <div className="rounded-[1.5rem] border border-dashed border-bela-gray-2 bg-bela-bg-primary p-5 text-sm text-bela-neutral-3 lg:col-span-3">
                {homeConfig.actionSection.empty}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="width-primary mx-auto px-4 pb-10">
        <div className="rounded-[2rem] border border-bela-gray-2 bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-bela-primary-1">
                {homeConfig.courseSection.eyebrow}
              </div>
              <h2 className="mt-2 text-2xl font-bold text-bela-secondary-2 md:text-3xl">
                {homeConfig.courseSection.title}
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-bela-neutral-3">
                {homeConfig.courseSection.description}
              </p>
            </div>
            <Link
              href={GUEST_COURSES}
              className="text-sm font-semibold text-bela-primary-1 transition hover:text-bela-primary-2"
            >
              {homeConfig.courseSection.cta}
            </Link>
          </div>
          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {productsSample.length > 0 ? (
              productsSample.map((product) => (
                <Link
                  key={product.id}
                  href={`${GUEST_COURSES}/${product.id}`}
                  className="rounded-[1.5rem] border border-bela-gray-2 bg-bela-bg-primary p-5 transition hover:-translate-y-1 hover:border-bela-primary-2 hover:shadow-lg"
                >
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-bela-primary-1">
                    {product.type}
                  </div>
                  <h3 className="mt-3 text-xl font-bold text-bela-secondary-2">
                    {product.name}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-bela-neutral-3">
                    {product.description ||
                      "Khóa học được thiết kế khoa học và phù hợp nhiều trình độ."}
                  </p>
                </Link>
              ))
            ) : (
              <div className="rounded-[1.5rem] border border-dashed border-bela-gray-2 bg-bela-bg-primary p-5 text-sm text-bela-neutral-3 lg:col-span-3">
                {homeConfig.courseSection.empty}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="width-primary mx-auto px-4 pb-20">
        <div className="rounded-[2rem] border border-bela-gray-2 bg-white p-6 shadow-sm md:p-8">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-bela-primary-1">
            {homeConfig.cmsSection.eyebrow}
          </div>
          <h2 className="mt-2 text-2xl font-bold text-bela-secondary-2 md:text-3xl">
            {homeConfig.cmsSection.title}
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-bela-neutral-3">
            {homeConfig.cmsSection.description}
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {homeSectionsSample.length > 0 ? (
              homeSectionsSample.map((section) => (
                <div
                  key={section.id}
                  className="rounded-2xl border border-bela-gray-2 bg-bela-bg-primary p-5"
                >
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-bela-primary-1">
                    {section.type}
                  </div>
                  <h3 className="mt-3 text-lg font-bold text-bela-secondary-2">
                    {section.name}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-bela-neutral-3">
                    {section.summary}
                  </p>
                </div>
              ))
            ) : (
              <div className="rounded-[1.5rem] border border-dashed border-bela-gray-2 bg-bela-bg-primary p-5 text-sm text-bela-neutral-3 md:col-span-2 xl:col-span-4">
                {homeConfig.cmsSection.empty}
              </div>
            )}
          </div>
          <div className="mt-6 text-xs text-bela-neutral-3">
            API bootstrap: products{" "}
            {publicHomeSample?.summary.store_items_count ??
              productsSample.length}
            , posts {postsSample.length}.
          </div>
        </div>
      </section>
    </div>
  );
}
