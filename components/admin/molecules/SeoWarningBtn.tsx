'use client';

import { Button, Form, FormInstance, Popover } from "antd";
import { WarningTwoTone } from '@ant-design/icons';
import { useEffect, useMemo, useState } from "react";
import {
    checkImageWithoutAlt,
    checkLinks,
    extractHeadings,
    getAllAltTexts,
    getKeywordCountAndDensity,
    containKeywordHeadings,
    getTextAfterLastHeading,
    getTextBeforeFirstHeading,
} from "@/utils/htmlUtils";
import { commonCkeditorTabFields } from "@/constants/ui";
import { normalizeStr } from "@/utils/formatString";

interface ActionProps {
    form: FormInstance;
    getFormValue: any;
    slugName?: string;
    fieldNames?: string[];
    sapoName?: string;
    endArticleName?: string;
    setSeoWarningScore?: any;
}

const SeoWarningBtn: React.FC<ActionProps> = ({
    form,
    getFormValue,
    slugName,
    fieldNames = commonCkeditorTabFields.map(i => i.key),
    sapoName = 'description',
    endArticleName = 'info',
    setSeoWarningScore,
}) => {
    const keywords = Form.useWatch('keywords', form);
    const slug = Form.useWatch(slugName || 'slug', form);
    const [warningSlug, setWarningSlug] = useState<any>(true);
    const [hasKeywordInLastPara, setHasKeywordInLastPara] = useState<any>(true);
    const [hasKeywordInIntro, setHasKeywordInIntro] = useState<any>(true);

    const [warningState, setWarningState] = useState<any>({
        headingsPercentage: 0,
        altsPercentage: 0,
        hasInternalLinks: false,
        hasExternalLinks: false,
        hasImageWithoutAlt: false,
    });

    const [info, setInfo] = useState<any>({
        headings: '0/0',
        alts: '0/0',
    })

    useEffect(() => {
        const runEffect = () => {
            const html = fieldNames.filter((i) => i !== 'question')
                .map((fieldName) => getFormValue(fieldName))
                .filter(Boolean)
                .join(' ');
            const headings = extractHeadings(html).map(i => i.text);
            const altTexts = getAllAltTexts(html);

            const headingsCount = containKeywordHeadings(headings, keywords);
            const altsCount = containKeywordHeadings(altTexts, keywords);
            const { internalLinks, externalLinks } = checkLinks(html);

            setWarningState({
                headingsPercentage: headingsCount / headings.length * 100,
                altsPercentage: altsCount / altTexts.length * 100,
                hasInternalLinks: internalLinks.length > 0,
                hasExternalLinks: externalLinks.length > 0,
                hasImageWithoutAlt: checkImageWithoutAlt(html),
            });

            setInfo({
                headings: headingsCount + '/' + headings.length,
                alts: altsCount + '/' + altTexts.length,
            });

            // Check last paragraph
            if (getFormValue(endArticleName)) {
                const text = getTextAfterLastHeading(getFormValue(endArticleName));
                const { totalKeywordCount } = getKeywordCountAndDensity(text, keywords);
                setHasKeywordInLastPara(!text || totalKeywordCount !== 0);
            }

            // Check sabo
            if (getFormValue(sapoName)) {
                const text = getTextBeforeFirstHeading(getFormValue(sapoName));
                const { totalKeywordCount } = getKeywordCountAndDensity(text, keywords);
                setHasKeywordInIntro(!text || totalKeywordCount !== 0);
            }
        };

        runEffect();

        const intervalId = setInterval(runEffect, 1000);

        return () => clearInterval(intervalId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [keywords]);

    //check url
    useEffect(() => {
        const { totalKeywordCount } = getKeywordCountAndDensity(slug?.replaceAll('-', ' '), normalizeStr(keywords));
        setWarningSlug(totalKeywordCount === 0);
    }, [slug, keywords]);

    const warningMessages = useMemo(() => {
        return [
            {
                condition: warningSlug,
                message: "• URL không chứa từ khoá",
            },
            {
                condition: warningState.headingsPercentage > 50,
                message: "• Tổng tiêu đề phụ (H2, H3, H4, H5, H6) chứa từ khóa chiếm trên 50%",
            },
            {
                condition: warningState.headingsPercentage < 20,
                message: "• Tổng tiêu đề phụ (H2, H3, H4, H5, H6) chứa từ khóa chiếm dưới 20%",
            },
            {
                condition: warningState.altsPercentage < 30,
                message: "• Tổng số ALT của hình ảnh chứa từ khoá chiểm dưới 30%",
            },
            {
                condition: warningState.altsPercentage > 60,
                message: "• Tổng số ALT của hình ảnh chứa từ khoá chiểm trên 60%",
            },
            {
                condition: warningState.hasImageWithoutAlt,
                message: "• Tồn tại hình ảnh không có ALT",
            },
            {
                condition: !warningState.hasInternalLinks,
                message: "• Không có internal link",
            },
            {
                condition: !warningState.hasExternalLinks,
                message: "• Không có external link",
            },
            {
                condition: !hasKeywordInIntro,
                message: "• Phần sabo đang không chứa từ khoá",
            },
            {
                condition: !hasKeywordInLastPara,
                message: "• Phần kết đang không chứa từ khoá",
            },
        ].filter(i => i.condition);
    }, [
        warningSlug,
        warningState,
        hasKeywordInIntro,
        hasKeywordInLastPara,
    ]);

    useEffect(() => {
        if (setSeoWarningScore) {
            setSeoWarningScore(10 - warningMessages.length);
        }
    }, [setSeoWarningScore, warningMessages]);

    const content = (
        <>
            <p>• Heading chứa từ khóa {info?.headings}</p>
            <p>• Alt chứa từ khóa {info?.alts}</p>
            {
                warningMessages.length > 0 &&
                <p className="font-bold mt-2">Có thể cải thiện</p>
            }
            <div className="text-red-500">
                {warningMessages.map(
                    (warning, index) =>
                        <p key={index}>{warning.message}</p>
                )}
            </div>
        </>
    );

    return (
        <div className="fixed bottom-60 right-7 z-[1111]">
            <Popover
                content={content}
                title="Thông tin"
                trigger="hover"
                placement="left"
                className="!mb-10"
            >
                <Button
                    shape="circle"
                    danger
                    icon={<WarningTwoTone className='mb-0.5' twoToneColor="#FF0000" />}
                />
            </Popover>

        </div>
    );
}

export default SeoWarningBtn;
