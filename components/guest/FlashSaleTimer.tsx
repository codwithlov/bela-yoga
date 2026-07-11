'use client';
import React, { useEffect, useId, useMemo, useState } from 'react'
import dayjs from 'dayjs';
import dynamic from 'next/dynamic';

/** Import Lazy CSS */
const FlashSaleTimerCss = dynamic(() => import('@/components/non-critical/FlashSaleTimerCss'), { ssr: false });
/** End */

type TimerParams = {
    startDate: string,
    endDate: string,
    className?: string,
}
const FlashSaleTimer: React.FC<TimerParams> = ({ startDate, endDate, className }) => {
    const [isClient, setIsClient] = useState<any>(false);
    useEffect(() => {
        setIsClient(true);
    }, []);

    /**
     *  -----------EXAMPLE------------
     *  27m11s
     *  27:11
     * -9, -58, -228, -2568, -37968, -394368
     * -9 = 10s * ((100/10) * 9) / 100 )
     * -58 = 60s * ((100/6) * 5) / 100 ) + (9 - 1)
     * -228 = 600s * ((100/10) * 3) / 100 ) = 180 + 40 + 8
     * -2568 = 3600s * ((100/6) * 4) / 100 ) = 2400 + 120 + 40 + 8
     * -37968 = 36000s * ((100/10) * 10) / 100 ) = 36000 + 1800 + 120 + 40 + 8
     * -394368 = 360000s * ((100/10) * 10) / 100 ) = 360000 + 32400 + 1800 + 120 + 40 + 8
    */
    let divId = useId();
    const tenNumbers = useMemo(() => [0, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0], []);
    const sixNumbers = useMemo(() => [0, 5, 4, 3, 2, 1, 0], []);
    useEffect(() => {
        let hourFirstRef: HTMLCollectionOf<HTMLElement>;
        let hourSecondRef: HTMLCollectionOf<HTMLElement>;
        let secondFirstRef: HTMLCollectionOf<HTMLElement>;
        let secondSecondRef: HTMLCollectionOf<HTMLElement>;
        let minuteFirstRef: HTMLCollectionOf<HTMLElement>;
        let minuteSecondRef: HTMLCollectionOf<HTMLElement>;
        const startTime = dayjs(startDate);
        const currentTime = dayjs();
        const endTime = dayjs(endDate);
        // const timeTemaining = endTime - currentTime; // milliseconds
        const timeTemaining = endTime.diff(currentTime); // milliseconds
        let totalSeconds = Math.floor(timeTemaining > 0 ? (timeTemaining / 1000) : 0);
        // let totalSeconds = 7200;
        const tenNumberType = 'tenNumbers';
        const sixNumberType = 'sixNumbers';
        const getDigitIndex = (arrType: string, number: number) => {
            if (number == 0) {
                return arrType == tenNumberType ?
                    tenNumbers.length - 1 :
                    sixNumbers.length - 1;
            } else {
                return arrType == tenNumberType ?
                    tenNumbers[number] :
                    sixNumbers[number];
            }
        }
        let seconds = String(totalSeconds % 60);
        let minutes = String(Math.floor(totalSeconds % 3600 / 60));
        let hours = String(Math.floor(totalSeconds / 3600));
        seconds = seconds.length == 1 ? `0${seconds}` : seconds;
        minutes = minutes.length == 1 ? `0${minutes}` : minutes;
        hours = hours.length == 1 ? `0${hours}` : hours;
        const timer = () => {
            if (totalSeconds < 0) {
                clearInterval(counter);
                return;
            }
            totalSeconds--;
            if (totalSeconds == 1) {
                hourFirstRef[0].style.animationIterationCount = '1';
                hourSecondRef[0].style.animationIterationCount = '1';
                minuteFirstRef[0].style.animationIterationCount = '1';
                minuteSecondRef[0].style.animationIterationCount = '1';
                secondFirstRef[0].style.animationIterationCount = '1';
                secondSecondRef[0].style.animationIterationCount = '1';
                secondSecondRef[0].style.animationIterationCount = '2';
            }
        }
        let counter = setInterval(timer, 1000);
        let timePassed = 0;
        const divideByTenNumber = 100 / 10;
        const divideBysixNumber = 100 / 6;
        const second_2nd = 10 * ((divideByTenNumber * getDigitIndex(tenNumberType, Number(seconds[1]))) / 100);
        timePassed += 10 * ((divideByTenNumber * (getDigitIndex(tenNumberType, Number(seconds[1])) - 1)) / 100);

        const second_1st = (60 * ((divideBysixNumber * getDigitIndex(sixNumberType, Number(seconds[0]))) / 100)) + timePassed;
        timePassed += 60 * ((divideBysixNumber * (getDigitIndex(sixNumberType, Number(seconds[0])) - 1)) / 100);

        const minute_2nd = (600 * ((divideByTenNumber * getDigitIndex(tenNumberType, Number(minutes[1]))) / 100)) + timePassed;
        timePassed += (600 * ((divideByTenNumber * (getDigitIndex(tenNumberType, Number(minutes[1])) - 1)) / 100));

        const minute_1st = (3600 * ((divideBysixNumber * getDigitIndex(sixNumberType, Number(minutes[0]))) / 100)) + timePassed;
        timePassed += (3600 * ((divideBysixNumber * (getDigitIndex(sixNumberType, Number(minutes[0])) - 1)) / 100));

        const hour_2nd = (36000 * ((divideByTenNumber * getDigitIndex(tenNumberType, Number(hours[1]))) / 100)) + timePassed;
        timePassed += 36000 * ((divideByTenNumber * (getDigitIndex(tenNumberType, Number(hours[1])) - 1)) / 100);

        const hour_1nd = (360000 * ((divideByTenNumber * getDigitIndex(tenNumberType, Number(hours[0]))) / 100)) + timePassed;
        let elementExists = document.getElementById(divId);
        if (elementExists) {
            hourFirstRef = elementExists.getElementsByClassName('sgt_timer_item_hour_first') as HTMLCollectionOf<HTMLElement>;
            hourSecondRef = elementExists.getElementsByClassName('sgt_timer_item_hour_second') as HTMLCollectionOf<HTMLElement>;
            secondFirstRef = elementExists.getElementsByClassName('sgt_timer_item_second_first') as HTMLCollectionOf<HTMLElement>;
            secondSecondRef = elementExists.getElementsByClassName('sgt_timer_item_second_second') as HTMLCollectionOf<HTMLElement>;
            minuteFirstRef = elementExists.getElementsByClassName('sgt_timer_item_minute_first') as HTMLCollectionOf<HTMLElement>;
            minuteSecondRef = elementExists.getElementsByClassName('sgt_timer_item_minute_second') as HTMLCollectionOf<HTMLElement>;
            hourFirstRef[0].style.animationDelay = `-${hour_1nd}s`;
            hourSecondRef[0].style.animationDelay = `-${hour_2nd}s`;
            minuteFirstRef[0].style.animationDelay = `-${minute_1st}s`;
            minuteSecondRef[0].style.animationDelay = `-${minute_2nd}s`;
            secondFirstRef[0].style.animationDelay = `-${second_1st}s`;
            secondSecondRef[0].style.animationDelay = `-${second_2nd}s`;
        }

    }, [endDate, startDate, sixNumbers, tenNumbers, divId]);

    return (
        <>
            {isClient && <FlashSaleTimerCss />}
            <div id={divId} className={`${className} sgt_timer flex flex-row gap-x-1`}>
                <div className='sgt_timer_item'>
                    <div className='sgt_timer_item_hour_first'>
                        {
                            tenNumbers.map((n: number, index: number) =>
                                <div key={index} className='sgt_timer_item_number'>{n}</div>
                            )
                        }
                    </div>
                    <div className='sgt_timer_item_hour_second'>
                        {
                            tenNumbers.map((n: number, index: number) =>
                                <div key={index} className='sgt_timer_item_number'>{n}</div>
                            )
                        }
                    </div>
                </div>
                <div className='sgt_timer_item'>
                    <div className='sgt_timer_item_minute_first'>
                        {
                            sixNumbers.map((n: number, index: number) =>
                                <div key={index} className='sgt_timer_item_number'>{n}</div>
                            )
                        }
                    </div>
                    <div className='sgt_timer_item_minute_second'>
                        {
                            tenNumbers.map((n: number, index: number) =>
                                <div key={index} className='sgt_timer_item_number'>{n}</div>
                            )
                        }
                    </div>
                </div>
                <div className='sgt_timer_item'>
                    <div className='sgt_timer_item_second_first'>
                        {
                            sixNumbers.map((n: number, index: number) =>
                                <div key={index} className='sgt_timer_item_number'>{n}</div>
                            )
                        }
                    </div>
                    <div className='sgt_timer_item_second_second'>
                        {
                            tenNumbers.map((n: number, index: number) =>
                                <div key={index} className='sgt_timer_item_number'>{n}</div>
                            )
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default FlashSaleTimer