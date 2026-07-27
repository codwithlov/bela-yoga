import { createMetadata, metaOptions } from '@/constants/metaDataPage';
import SVPageFrame from '@/components/guest/SVPageFrame';
import { GUEST_COURSES, GUEST_HOME, GUEST_POSTS, GUEST_STORE } from '@/constants/route';
import { MAIL, PHONE } from '@/constants/link';

export async function generateMetadata() {
    return createMetadata(metaOptions.aboutUs);
}

export default async function AboutPage() {
    return (
        <SVPageFrame
            eyebrow="Giới thiệu"
            title="BelaYoga - Hít vào bình yên, thở ra cuộc sống."
            description="BelaYoga là cơ sở dạy tập yoga uy tín hàng đầu, nơi bạn tìm lại sự cân bằng thân - tâm - trí sau một ngày dài bận rộn. Chúng tôi xây dựng lộ trình luyện tập khoa học, phù hợp cho cả người mới bắt đầu và học viên nâng cao."
            highlights={[
                'Không gian tập luyện ấm cúng, sạch đẹp và riêng tư.',
                'Đội ngũ huấn luyện viên tận tâm, giàu kinh nghiệm chuyên môn.',
                'Lớp học đa dạng: yoga cơ bản, yoga trị liệu, yoga thư giãn và thiền.',
            ]}
            actions={[
                {
                    href: GUEST_COURSES,
                    label: 'Xem Khóa học',
                    variant: 'primary',
                },
                {
                    href: GUEST_POSTS,
                    label: 'Đọc kiến thức yoga',
                    variant: 'secondary',
                },
            ]}
            infoCards={[
                {
                    label: 'Sứ mệnh',
                    value: 'Nuôi dưỡng an yên',
                    description: 'Giúp mỗi học viên cải thiện sức khỏe thể chất và tinh thần bằng phương pháp luyện tập bền vững.',
                },
                {
                    label: 'Phương pháp',
                    value: 'Cá nhân hóa lộ trình',
                    description: 'Mỗi cấp độ có chương trình phù hợp để bạn tiến bộ đều đặn, an toàn và hiệu quả.',
                },
                {
                    label: 'Liên hệ',
                    value: `${PHONE} · ${MAIL}`,
                    description: 'Đội ngũ BelaYoga luôn sẵn sàng tư vấn lịch học và gói tập phù hợp với mục tiêu của bạn.',
                },
            ]}
        >
            <div className="grid gap-4 lg:grid-cols-3">
                {[
                    {
                        title: 'Không gian truyền cảm hứng',
                        description: 'Thiết kế nhẹ nhàng với tone ấm giúp bạn thả lỏng, tập trung vào hơi thở và chuyển động trong từng buổi tập.',
                    },
                    {
                        title: 'Lộ trình rõ ràng',
                        description: 'Từ nền tảng cơ bản đến nâng cao, mỗi lớp học đều được hướng dẫn chi tiết để bạn tiến bộ bền vững.',
                    },
                    {
                        title: 'Cộng đồng tích cực',
                        description: 'BelaYoga xây dựng môi trường thân thiện để bạn kết nối, duy trì động lực và lan tỏa lối sống lành mạnh.',
                    },
                ].map((item) => (
                    <div key={item.title} className="rounded-[1.5rem] border border-bela-gray-2 bg-white p-6 shadow-sm">
                        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-bela-primary-1">BelaYoga</div>
                        <h2 className="mt-3 text-xl font-bold text-bela-secondary-2">{item.title}</h2>
                        <p className="mt-3 text-sm leading-6 text-bela-neutral-3">{item.description}</p>
                    </div>
                ))}
            </div>

            <div className="mt-6 rounded-[2rem] border border-bela-gray-2 bg-white p-6 shadow-sm md:p-8">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-bela-primary-1">Giá trị cốt lõi tại BelaYoga</div>
                <div className="mt-3 grid gap-4 md:grid-cols-2">
                    {[
                        'Luyện tập đúng kỹ thuật để giảm căng thẳng và phòng tránh chấn thương.',
                        'Đồng hành cùng học viên bằng sự tận tâm, lắng nghe và tôn trọng nhịp độ cá nhân.',
                        'Kết hợp yoga, hơi thở và thư giãn để phục hồi năng lượng toàn diện.',
                        'Lan tỏa lối sống khỏe mạnh, cân bằng và tích cực trong cộng đồng.',
                    ].map((item) => (
                        <div key={item} className="rounded-2xl border border-bela-gray-2 bg-bela-bg-primary px-4 py-4 text-sm leading-6 text-bela-neutral-2">
                            {item}
                        </div>
                    ))}
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                    <a href={GUEST_HOME} className="rounded-xl border border-bela-gray-2 px-5 py-3 text-sm font-semibold text-bela-secondary-2 transition hover:bg-bela-bg-primary">
                        Về trang chủ
                    </a>
                    <a href={GUEST_COURSES} className="rounded-xl bg-gradient-to-r from-bela-primary-1 to-bela-primary-2 px-5 py-3 text-sm font-semibold text-white shadow-bela-primary transition hover:-translate-y-0.5">
                        Khám phá gói tập
                    </a>
                </div>
            </div>
        </SVPageFrame>
    );
}
