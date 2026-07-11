'use client';
import { getKeywordCountAndDensity, getMatchingKeywords, getTextOnly } from "@/utils/htmlUtils";
import { Collapse, Form, FormInstance, Input } from "antd";
import React, { useEffect, useState } from "react";
import FormItemCheckbox from "../atoms/FormItemCheckbox";
import { commonCkeditorTabFields } from "@/constants/ui";

interface ActionProps {
    form: FormInstance;
    getFormValue?: any;
    notCheckSeo?: boolean;
    disabled?: boolean;
    notShowKeyword?: boolean;
    allKeywords?: string[];
    fieldNames?: string[];
    setSeoCollapseScore?: any;
}

const SeoFormItems: React.FC<ActionProps> = ({
    form,
    getFormValue,
    notCheckSeo,
    disabled,
    notShowKeyword,
    fieldNames = commonCkeditorTabFields.map(i => i.key),
    allKeywords = [],
    setSeoCollapseScore,
}) => {
    const meta_title = Form.useWatch('meta_title', form);
    const meta_description = Form.useWatch('meta_description', form);
    const keywords = Form.useWatch('keywords', form);

    const [scores, setScores] = useState({ title: 0, description: 0 });
    const [keywordsInfo, setKeywordsInfo] = useState<any>(null);
    const [repeatedKeywords, setRepeatedKeywords] = useState<any>([]);
    const [scoreMessages, setScoreMessages] = useState<{ title: string[]; description: string[] }>({
        title: [],
        description: [],
    });
    const lengthBounds: any = {
        title: [50, 65],
        description: [110, 160],
    }
    const maxLengthScore = 5;

    useEffect(() => {
        const runEffect = () => {
            if (!getFormValue || notCheckSeo) return;

            const html = fieldNames
                .map((fieldName) => getFormValue(fieldName))
                .filter(Boolean)
                .join(' ');

            const textOnly = getTextOnly(html);

            const info = getKeywordCountAndDensity(`${meta_title || ''} ${meta_description || ''} ${textOnly || ''}`, keywords);
            setKeywordsInfo(info);

            const updateScore = (text: string, type: 'title' | 'description') => {
                if (!text) {
                    setScores(prev => ({ ...prev, [type]: 0 }));
                    setScoreMessages(prev => ({
                        ...prev,
                        [type]: [],
                    }));
                    return;
                }
                const lengthScore = getLengthScore(text?.length, type);
                const keywordScore = getKeywordCountAndDensity(text, keywords).totalKeywordCount === 0 ? 0 : 5;
                setScores(prev => ({ ...prev, [type]: lengthScore + keywordScore }));
                setScoreMessages(prev => ({
                    ...prev,
                    [type]: generateScoreMessages(lengthScore, keywordScore, type),
                }));
                return lengthScore + keywordScore;
            };

            const titleScore = updateScore(meta_title, 'title');
            const descriptionScore = updateScore(meta_description, 'description');

            const usedKeywords = getMatchingKeywords(keywords, allKeywords);
            setRepeatedKeywords(usedKeywords);

            if (setSeoCollapseScore) {
                const goodConditions = [
                    info?.keywordDensity <= 0.8 && info?.keywordDensity >= 0.6,
                    titleScore === 10,
                    descriptionScore === 10,
                    usedKeywords.length === 0,
                    !info?.notUseWords
                ].filter(Boolean).length;

                setSeoCollapseScore(goodConditions);
            }
        };

        runEffect();

        const intervalId = setInterval(runEffect, 1000);
        return () => clearInterval(intervalId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [meta_title, meta_description, keywords]);

    const getLengthScore = (length: number, type: string): number => {
        const [minLength, maxLength] = lengthBounds[type];

        if (length >= minLength && length <= maxLength) {
            return maxLengthScore;
        }

        const distance = length < minLength ? minLength - length : length - maxLength;
        const score = Math.max(0, maxLengthScore - (distance / maxLengthScore));

        return score;
    };

    const generateScoreMessages = (lengthScore: number, keywordScore: number, type: string): string[] => {
        const messages: string[] = [];
        const typeName = type === 'title' ? 'tiêu đề' : 'mô tả';
        const [minLength, maxLength] = lengthBounds[type];
        const lengthMessage = `Độ dài ${typeName} quá ngắn (dưới ${minLength} ký tự) hoặc quá dài (trên ${maxLength} ký tự).`;
        const keywordMessage = `Trong ${typeName} nên chứa ít nhất một từ khóa chính.`;

        if (lengthScore !== maxLengthScore) {
            messages.push(lengthMessage);
        }
        if (keywordScore === 0) {
            messages.push(keywordMessage);
        }

        return messages;
    };

    const scoreDisplay = (score: number, messages: string[]) => (
        <>
            <div className="bg-red-400 w-full rounded-full h-[5px] mb-1 -mt-2">
                <div className="h-[5px] rounded-full bg-green-500" style={{ width: `${(score / 10) * 100}%` }} />
            </div>
            {messages.length > 0 && (
                <div className="mb-1 text-xs text-red-500">
                    {messages.map((message, index) => (
                        <div key={index}>{message}</div>
                    ))}
                </div>
            )}
        </>
    );

    return (
        <div>
            {!notShowKeyword &&
                <Form.Item name="keywords" label="Từ khóa">
                    <Input placeholder={disabled ? '' : 'món ăn thái lan, ẩm thực thái,...'} disabled={disabled} />
                </Form.Item>
            }
            {!notCheckSeo &&
                <div className={`-mt-2 mb-1 text-xs ${(keywordsInfo?.keywordDensity > 0.8 || keywordsInfo?.keywordDensity < 0.6) ? 'text-red-500' : 'text-green-500'}`}>
                    Mật độ từ khóa: {keywordsInfo?.keywordDensity}%.
                    {
                        keywordsInfo?.notUseWords &&
                        <span className="text-red-500"> Từ khóa {keywordsInfo?.notUseWords} đang không được sử dụng.</span>
                    } {
                        repeatedKeywords.length > 0 &&
                        <span className="text-red-500"> Từ khóa {repeatedKeywords.join(', ')} bị trùng lặp với bài viết khác.</span>
                    }
                    <p className="text-blue-500">{`Xuất hiện: ${keywordsInfo?.totalKeywordCount}/${keywordsInfo?.totalWords}`}</p>
                </div>
            }

            <Form.Item name="meta_title" label="Meta title" rules={[{ required: !disabled }]}>
                <Input placeholder={disabled ? '' : 'Nhập tiêu đề'} disabled={disabled} maxLength={255} />
            </Form.Item>
            {!notCheckSeo &&
                scoreDisplay(scores.title, scoreMessages.title)
            }

            <Form.Item name="meta_description" label="Meta description">
                <Input placeholder={disabled ? '' : 'Nhập mô tả'} disabled={disabled} />
            </Form.Item>
            {!notCheckSeo &&
                scoreDisplay(scores.description, scoreMessages.description)
            }

            <Form.Item name="canonical" label="Canonical URL">
                <Input placeholder={disabled ? '' : 'Nhập Canonical URL'} disabled={disabled} />
            </Form.Item>
            <div className="flex -my-1">
                <FormItemCheckbox
                    name="index"
                    label="Cho phép hiển thị bài viết trong kết quả tìm kiếm"
                    className="flex-1"
                    disabled={disabled}
                />
                <FormItemCheckbox
                    name="follow"
                    label="Cho phép công cụ tìm kiếm theo dõi liên kết trong bài viết"
                    className="flex-1"
                    disabled={disabled}
                />
            </div>
        </div>
    );
};

SeoFormItems.displayName = "SeoFormItems";

const SeoCollapse: React.FC<ActionProps> = (props) => (
    <div className="mb-4">
        <Collapse
            defaultActiveKey={'1'}
            size="small"
            items={[{
                key: '1', label: 'SEO', children: <SeoFormItems{...props} />
            }]}
        />
    </div>
);

export default SeoCollapse;
