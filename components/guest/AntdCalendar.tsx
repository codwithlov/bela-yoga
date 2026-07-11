'use client';
import { Calendar, Col, ConfigProvider, Row, Select } from 'antd';
import React, { useEffect, useState } from 'react'
import locale from 'antd/locale/vi_VN';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import 'dayjs/plugin/localeData';
import dynamic from 'next/dynamic';

/** Import Lazy CSS */

const CalendarCss = dynamic(() => import('@/components/non-critical/CalendarCss'), { ssr: false });

/** End */
const AntdCalendar = (props: any) => {
    const [isClient, setIsClient] = useState(false);
    useEffect(() => {
        setIsClient(true);
    }, []);
    return (
        <>
            {isClient && <CalendarCss />}
            <ConfigProvider locale={locale}>
                <Calendar
                    fullscreen={false}
                    headerRender={({ value, type, onChange, onTypeChange }) => {
                        const currentTime = dayjs();
                        const currentYear = currentTime.get('y');
                        const currentMonth = currentTime.get('M');
                        const start = 0;
                        const end = 12;
                        const monthOptions = [];
                        let current = value.clone();
                        const localeData = value.localeData();
                        const months = [];
                        for (let i = 0; i < 12; i++) {
                            current = current.month(i);
                            months.push(localeData.months(current));
                        }

                        for (let i = start; i < end; i++) {
                            let monthDisable = (value.year() == currentYear && i < currentMonth) ? true : false;
                            monthOptions.push(
                                { value: i, label: months[i], disabled: monthDisable }
                            );
                        }

                        const year = value.year();
                        const month = (value.year() == currentYear && value.month() < currentMonth) ? currentMonth : value.month();
                        const options = [];
                        for (let i = currentYear; i < year + 10; i++) {
                            options.push(
                                { value: i, label: i }
                            );
                        }
                        return (
                            <div style={{ padding: 8 }}>
                                <Row gutter={8}>
                                    {/* <Col>
                                            <Radio.Group
                                                size="small"
                                                onChange={(e) => onTypeChange(e.target.value)}
                                                value={type}
                                            >
                                                <Radio.Button value="month">Month</Radio.Button>
                                                <Radio.Button value="year">Year</Radio.Button>
                                            </Radio.Group>
                                        </Col> */}
                                    <Col>
                                        <Select
                                            size="middle"
                                            className="sgt_select w-28"
                                            popupClassName='sgt_select_popup'
                                            value={year}
                                            onChange={(newYear) => {
                                                const now = value.clone().year(newYear);
                                                if (newYear == currentYear && month < currentMonth) {
                                                    onChange(value.clone().month(currentMonth));
                                                } else {
                                                    onChange(now);
                                                }
                                            }}
                                            options={options}
                                        >
                                        </Select>
                                    </Col>
                                    <Col>
                                        <Select
                                            size="middle"
                                            className="sgt_select w-28"
                                            popupClassName='sgt_select_popup'
                                            value={month}
                                            onChange={(newMonth) => {
                                                const now = value.clone().month(newMonth);
                                                onChange(now);
                                            }}
                                            options={monthOptions}
                                        >
                                        </Select>
                                    </Col>
                                </Row>
                            </div>
                        );
                    }}
                    {...props}
                />
            </ConfigProvider>
        </>
    )
}

export default AntdCalendar