import Link from 'next/link';

type PublicContentPageProps = {
    eyebrow?: string;
    title: string;
    summary?: string | null;
    metaDescription?: string | null;
    content: string;
    badges?: string[];
    extraMeta?: string[];
    backHref?: string;
    backLabel?: string;
    children?: React.ReactNode;
};

export default function PublicContentPage({
    eyebrow,
    title,
    summary,
    metaDescription,
    content,
    badges = [],
    extraMeta = [],
    backHref,
    backLabel,
    children,
}: PublicContentPageProps) {
    return (
        <div className="bg-[linear-gradient(180deg,#04121f_0%,#082033_28%,#f2fbff_28%,#f2fbff_100%)]">
            <section className="width-primary mx-auto px-4 pb-20 pt-12 text-white lg:pt-16">
                <div className="max-w-4xl space-y-4">
                    {eyebrow ? (
                        <div className="text-xs font-semibold uppercase tracking-[0.22em] text-sgt-primary-3">{eyebrow}</div>
                    ) : null}
                    <h1 className="text-4xl font-bold leading-tight md:text-5xl">{title}</h1>
                    {summary ? <p className="max-w-3xl text-base leading-7 text-slate-200 md:text-lg">{summary}</p> : null}
                    {metaDescription ? <p className="max-w-3xl text-sm leading-6 text-slate-300">{metaDescription}</p> : null}
                    {extraMeta.length ? (
                        <div className="flex flex-wrap gap-3 text-xs text-slate-200">
                            {extraMeta.map((item) => (
                                <span key={item} className="rounded-full border border-white/10 bg-white/10 px-4 py-2">{item}</span>
                            ))}
                        </div>
                    ) : null}
                    {badges.length ? (
                        <div className="flex flex-wrap gap-2 pt-2 text-xs text-slate-200">
                            {badges.map((badge) => (
                                <span key={badge} className="rounded-full border border-white/10 bg-white/5 px-3 py-1">#{badge}</span>
                            ))}
                        </div>
                    ) : null}
                </div>
            </section>

            <section className="width-primary mx-auto px-4 pb-12">
                <div className="rounded-[2rem] border border-sgt-gray-2 bg-white p-6 shadow-sm md:p-8">
                    <div className="prose max-w-none prose-p:text-sgt-neutral-3 prose-headings:text-sgt-secondary-2">
                        <div dangerouslySetInnerHTML={{ __html: content }} />
                    </div>
                    {backHref && backLabel ? (
                        <div className="mt-8">
                            <Link href={backHref} className="text-sm font-semibold text-sgt-primary-1 transition hover:text-sgt-primary-2">
                                ← {backLabel}
                            </Link>
                        </div>
                    ) : null}
                </div>
            </section>

            {children ? <section className="width-primary mx-auto px-4 pb-20">{children}</section> : null}
        </div>
    );
}
