import Link from 'next/link';

type ActionLink = {
    href: string;
    label: string;
    variant?: 'primary' | 'secondary' | 'ghost';
};

type InfoCard = {
    label: string;
    value: string;
    description?: string;
};

type SVPageFrameProps = {
    eyebrow: string;
    title: string;
    description: string;
    highlights?: string[];
    actions?: ActionLink[];
    infoCards?: InfoCard[];
    children?: React.ReactNode;
};

const actionClassName: Record<NonNullable<ActionLink['variant']>, string> = {
    primary: 'sv-brand-gradient text-white shadow-bela-primary',
    secondary: 'border border-bela-gray-2 bg-white text-bela-secondary-2',
    ghost: 'border border-white/15 bg-white/10 text-white backdrop-blur',
};

export default function SVPageFrame({
    eyebrow,
    title,
    description,
    highlights = [],
    actions = [],
    infoCards = [],
    children,
}: SVPageFrameProps) {
    return (
        <section className="bg-[radial-gradient(circle_at_top,_rgba(56,215,255,0.18),_transparent_38%),linear-gradient(180deg,#04121f_0%,#082033_34%,#f2fbff_34%,#f2fbff_100%)]">
            <div className="width-primary mx-auto px-4 pb-14 pt-12 md:pt-16">
                <div className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr] lg:items-start">
                    <div className="sv-brand-surface sv-accent-ring rounded-[2rem] border border-white/10 p-6 text-white shadow-2xl shadow-black/15 backdrop-blur md:p-8">
                        <div className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-bela-primary-3">
                            {eyebrow}
                        </div>
                        <h1 className="mt-5 max-w-3xl text-3xl font-bold leading-tight md:text-5xl">
                            {title}
                        </h1>
                        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-200 md:text-base">
                            {description}
                        </p>

                        {actions.length > 0 && (
                            <div className="mt-6 flex flex-wrap gap-3">
                                {actions.map((action) => (
                                    <Link
                                        key={`${action.href}-${action.label}`}
                                        href={action.href}
                                        className={`rounded-xl px-5 py-3 text-sm font-semibold transition hover:-translate-y-0.5 ${actionClassName[action.variant || 'primary']}`}
                                    >
                                        {action.label}
                                    </Link>
                                ))}
                            </div>
                        )}

                        {highlights.length > 0 && (
                            <div className="mt-8 grid gap-3 md:grid-cols-2">
                                {highlights.map((item) => (
                                    <div key={item} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm leading-6 text-slate-100">
                                        {item}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="rounded-[2rem] border border-bela-gray-2 bg-white p-6 shadow-sm md:p-8">
                        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-bela-primary-1">Tập luyện cùng Bela Yoga</div>
                        <h2 className="mt-3 text-2xl font-bold text-bela-secondary-2 md:text-3xl">
                            Đồng hành cùng bạn trên hành trình sống khỏe, an yên
                        </h2>
                        <p className="mt-3 text-sm leading-6 text-bela-neutral-3">
                            Bela Yoga cùng bạn xây dựng lối sống cân bằng, cải thiện sức khỏe thể chất và tinh thần thông qua các buổi tập yoga chất lượng cao, phù hợp cho mọi trình độ.
                        </p>

                        <div className="mt-6 grid gap-3">
                            {infoCards.map((card) => (
                                <div key={`${card.label}-${card.value}`} className="rounded-2xl border border-bela-gray-2 bg-bela-bg-primary px-4 py-4">
                                    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-bela-primary-1">{card.label}</div>
                                    <div className="mt-2 text-lg font-bold text-bela-secondary-2">{card.value}</div>
                                    {card.description ? (
                                        <div className="mt-1 text-sm leading-6 text-bela-neutral-3">{card.description}</div>
                                    ) : null}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {children ? <div className="mt-8">{children}</div> : null}
            </div>
        </section>
    );
}