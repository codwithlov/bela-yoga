import Link from "next/link";
import Image from "next/image";
import { GUEST_ABOUT_US, GUEST_ACTION, GUEST_COURSES } from "@/constants/route";
import {
  getPublicHomeData,
  getPublicPosts,
} from "@/services/api/discovery";
import { templateSiteConfig } from "@/config/template/site";
import { getFirstImageUrl } from "@/utils/htmlUtils";
import { DEFAULT_THUMBNAIL } from "@/constants/ui";

const normalizeCategory = (value?: string) =>
  (value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

export default async function Home() {
  const [publicHomeSample, publicPostsSample] =
    await Promise.all([
      getPublicHomeData(),
      getPublicPosts(64),
    ]);

  const actionPostsSample = publicPostsSample
    .filter((post) => normalizeCategory(post.category) === "tap yoga")
    .slice(0, 3);

  const publicCourses = publicPostsSample
    .filter((post) => normalizeCategory(post.category) === "khoa hoc")
    .slice(0, 3);

  const studioPostsSample = publicPostsSample
    .filter((post) => normalizeCategory(post.category) === "phong tap")
    .slice(0, 4);

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
            {actionPostsSample.length > 0 ? (
              actionPostsSample.map((post) => (
                <Link
                  key={post.id}
                  href={`${GUEST_ACTION}/${post.slug}`}
                  className="overflow-hidden rounded-[1.5rem] border border-bela-gray-2 bg-bela-bg-primary transition hover:-translate-y-1 hover:border-bela-primary-2 hover:shadow-lg"
                >
                  <div className="relative h-44 w-full">
                    <Image
                      src={getFirstImageUrl(post.description) || DEFAULT_THUMBNAIL}
                      alt={post.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="p-5">
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
            {publicCourses.length > 0 ? (
              publicCourses.map((course) => (
                <Link
                  key={course.id}
                  href={`${GUEST_ACTION}/${course.slug}`}
                  className="overflow-hidden rounded-[1.5rem] border border-bela-gray-2 bg-bela-bg-primary transition hover:-translate-y-1 hover:border-bela-primary-2 hover:shadow-lg"
                >
                  <div className="relative h-44 w-full">
                    <Image
                      src={getFirstImageUrl(course.description) || DEFAULT_THUMBNAIL}
                      alt={course.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="p-5">
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-bela-primary-1">
                    {course.category || 'Khóa học'}
                  </div>
                  <h3 className="mt-3 text-xl font-bold text-bela-secondary-2">
                    {course.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-bela-neutral-3">
                    {course.excerpt ||
                      "Khóa học được thiết kế khoa học và phù hợp nhiều trình độ."}
                  </p>
                  </div>
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
            {studioPostsSample.length > 0 ? (
              studioPostsSample.map((post) => (
                <Link
                  key={post.id}
                  href={`${GUEST_ACTION}/${post.slug}`}
                  className="overflow-hidden rounded-2xl border border-bela-gray-2 bg-bela-bg-primary transition hover:-translate-y-1 hover:border-bela-primary-2 hover:shadow-lg"
                >
                  <div className="relative h-40 w-full">
                    <Image
                      src={getFirstImageUrl(post.description) || DEFAULT_THUMBNAIL}
                      alt={post.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="p-5">
                    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-bela-primary-1">
                      {post.category || 'Phòng tập'}
                    </div>
                    <h3 className="mt-3 text-lg font-bold text-bela-secondary-2">
                      {post.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-bela-neutral-3">
                      {post.excerpt}
                    </p>
                  </div>
                </Link>
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
              0}
            , posts {actionPostsSample.length}.
          </div>
        </div>
      </section>
    </div>
  );
}
