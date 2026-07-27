'use client';
import { showErrorToastr, showSuccessToastr } from '@/utils/toastr';
import { Button, Checkbox, Divider, Drawer, Form, InputNumber, Select } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import { PlusOutlined, CloseOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { useGetMarketAssignedTopicQuery, useGetMarketNotAssignedTopicQuery, useUnassignedTopicMutation } from '@/services/api/markets';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { IMarketSummary } from '@/interfaces/market';
import { validateMessages } from '@/utils/validateRule';
import { useLazyGetListingsByMarketQuery } from '@/services/api/listings';
import { IListingSummary } from '@/interfaces/listing';
import { TEXT_BTN_CREATE, TEXT_BTN_DELETE, TEXT_BTN_REFRESH, TEXT_BTN_UPDATE, VI_DATE_FORMAT } from '@/constants/ui';
import dayjs from 'dayjs';
import { formatPrice } from '@/utils/formatPrice';

import { ACTION_CREATE, ACTION_DELETE, ACTION_UPDATE } from '@/constants/action';
import { usePostDataMutation } from '@/services/api/common';
import { AdminLoading } from '@/components/admin/atoms/Loading';
import { MARKET } from '@/constants/route';
import AdminTopicMarketTable from './topicMarket/AdminTopicMarketTable';
import { addKeyForList, getUpdateDrawerProps } from '@/utils/helper';
import { useConfirm } from '@/components/admin/atoms/useConfirm';
import useCheckPermission from '@/hooks/useCheckPermission';
import AdminTopicMarketAddTourField from './topicMarket/AdminTopicMarketAddTourField';

type AdminTopicAddMarketParams = {
    data?: any,
    isOpen?: boolean,
    setClose?: any,
}

const AdminTopicAddMarket: React.FC<AdminTopicAddMarketParams> = ({
    isOpen,
    setClose,
    data,
}) => {
    const checkPermission = useCheckPermission();

    /** Params */
    const topicTitle = data.name;
    const topic_id = data.topic_id;

    /** Hook */
    const [assignedMarketData, setAssingedMarketData] = useState<any>([]);
    const [spinning, setSpinning] = useState<boolean>(false);
    const [tourFetching, setTourFetching] = useState<boolean>(false);

    const [unassignedTopic] = useUnassignedTopicMutation();
    const [storeUpdateApi] = usePostDataMutation();
    const { handleConfirm, confirmModal } = useConfirm();

    const {
        data: marketNotAssigned,
        isFetching: marketNotAssignedFetching,
        refetch: refetchMarketNotAssigned,
    } = useGetMarketNotAssignedTopicQuery(topic_id, {
        skip: !topic_id || !isOpen,
        refetchOnMountOrArgChange: true,
    })
    const {
        data: marketAssigned,
        isLoading: marketAssignedLoading,
        isFetching: marketAssignedFetching,
        refetch: refetchMarketAssigned,
    } = useGetMarketAssignedTopicQuery(topic_id, {
        skip: !topic_id || !isOpen,
        refetchOnMountOrArgChange: true,
    })

    const [tourLazyByMarket] = useLazyGetListingsByMarketQuery();

    const [form] = Form.useForm();
    const [marketOptions, setMarketOptions] = useState<any[]>([]);
    const [useTour, setUseTour] = useState<any[]>([]);
    const [marketOptionRoot, setMarketOptionRoot] = useState<any[]>([]);
    const [tourOptions, setTourOptions] = useState<Record<string, any>>({});
    const [formAction, setFormAction] = useState<string>(ACTION_CREATE);
    /** Variables */
    const btnAdd = 'Thêm';
    const btnSave = TEXT_BTN_CREATE;
    const btnUpdate = TEXT_BTN_UPDATE;
    const btnRemove = TEXT_BTN_DELETE;
    const btnRefresh = TEXT_BTN_REFRESH;
    const componentId = '#admin-topic-add-market';
    const marketsFormData = 'marketsFormData';
    const dateFormat = VI_DATE_FORMAT;
    const marketFormDefaultValue = {
        market_id: '',
    }
    const tourFormDefaultValue = {
        tour_id: '',
    }
    useEffect(() => {
        fetchDataMarket();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [marketAssigned]);

    useEffect(() => {
        getMarketOptions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [marketNotAssigned]);

    const prevIsOpen = useRef(isOpen);
    useEffect(() => {
        if (prevIsOpen.current && !isOpen) {
            resetFormData();
        }
        prevIsOpen.current = isOpen;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    /** Functions */
    const fetchDataMarket = () => {
        setAssingedMarketData([]);
        const marketAssignedList = marketAssigned?.data as IMarketSummary[];
        if (marketAssigned?.data) {
            setAssingedMarketData(addKeyForList(marketAssignedList, 'market_id'));
        }
    }

    const getMarketOptions = async () => {
        if (marketNotAssigned?.data != null) {
            let mappedData = [
                { value: '', label: 'Chọn tuyến tour' },
                ...marketNotAssigned?.data.map((market: any) => ({
                    value: market.market_id,
                    label: `${market.tour_name}`,
                }))
            ];
            setMarketOptions([mappedData]);
            setMarketOptionRoot(mappedData);
        }
    }

    const resetMarketOptionsByItem = () => {
        let marketOptionsClone: any[] = [];
        let marketFormValues: any[] = form.getFieldValue(marketsFormData);
        let marketIds = marketFormValues.filter(item => item && item.market_id).map((item) => item.market_id);
        marketOptions.forEach((market, mIndex) => {
            const marketsDisabled = marketIds.filter(item => item != marketFormValues[mIndex]?.market_id);
            marketOptionsClone[mIndex] = market.map((i: any) => ({
                ...i,
                disabled: marketsDisabled.includes(i.value)
            })).sort((a: any, b: any) => (a.disabled < b.disabled) ? -1 : 1);
        })
        setMarketOptions(marketOptionsClone);
    }

    const getTourOptions = (marketId: number): Promise<any> => {
        return new Promise(async (resolve, reject) => {
            setTourFetching(true);
            let tour = tourOptions;
            if ((tour[marketId] instanceof Object) == false && marketId > 0) {
                tour[marketId] = {
                    rootList: [],
                    items: []
                };
            }
            let tourByMarket = await tourLazyByMarket(marketId).unwrap();
            const tourList = tourByMarket?.data ?? [];

            setTourOptions(prevTourOptions => {
                const updatedTourOptions = { ...prevTourOptions };
                if (!(updatedTourOptions[marketId] instanceof Object)) {
                    updatedTourOptions[marketId] = {
                        rootList: [],
                        items: []
                    };
                }

                const rootListTourIds = (tourList || []).map((i: any) => i.tour_id);
                const oldTours = ((assignedMarketData || []).find((v: any) => v.market_id === marketId)?.tours || [])
                    .filter((v: any) => !rootListTourIds.includes(v.tour_id))

                updatedTourOptions[marketId].rootList = [
                    ...oldTours,
                    ...tourList,
                ];

                updatedTourOptions[marketId].items[0] = [
                    { value: '', label: 'Chọn ngày khởi hành - mã tour' },
                    ...tourList.map((tour) => ({
                        value: tour.tour_id,
                        label: `${dayjs(tour.flight_date).format(dateFormat)}-${tour.series_code}`,
                        disabled: false,
                    }))
                ];
                return updatedTourOptions;
            });
            setTourFetching(false);
            resolve(true);
        })
    }

    const resetTourOptionsByItem = (marketIndex: number) => {
        let marketFormValues: any[] = form.getFieldValue(marketsFormData);
        let tourIds = marketFormValues[marketIndex].tours?.filter((item: any) => item && item.tour_id).map((item: any) => item.tour_id);
        let marketId = marketFormValues[marketIndex].market_id;
        let tourOptionConvert = { ...tourOptions };
        tourOptions[marketId]?.items.forEach((item: any, index: number) => {
            const toursDisabled: any[] = tourIds?.filter((t: any) => t != marketFormValues[marketIndex].tours[index]?.tour_id);
            tourOptionConvert[marketId].items[index] = [
                { value: '', label: 'Chọn ngày khởi hành - Mã tour' },
                ...tourOptionConvert[marketId].rootList?.map((tour: IListingSummary) => ({
                    value: tour.tour_id,
                    label: `${dayjs(tour.flight_date).format(dateFormat)}-${tour.series_code}`,
                    disabled: toursDisabled?.includes(tour.tour_id),
                }))
            ].sort((a: any, b: any) => (a.disabled < b.disabled) ? -1 : 1);
        })
        setTourOptions(tourOptionConvert);
    }

    const handleOnChangeSelect = async (selectValue: any, data: any) => {
        switch (selectValue) {
            case ACTION_UPDATE:
                await showFormData(data);
                setTimeout(() => {
                    resetTourOptionsByItem(0);
                }, 20);

                break;
            case ACTION_DELETE:
                handleConfirm('Xác nhận xóa ' + data?.market_name + ' khỏi chủ đề', () => onUnAssignedTopic(data));
                break;
        }
    }

    const showFormData = async (data: any) => {
        form.resetFields();
        setFormAction(ACTION_UPDATE);
        let marketOptions = [
            { value: '', label: 'Chọn tuyến tour' },
            {
                value: data.market_id,
                label: `${data.tour_name}`,
            }
        ];
        setMarketOptions([marketOptions]);
        let marketFormValues: any[] = form.getFieldValue(marketsFormData);
        marketFormValues[0].market_id = data.market_id;
        marketFormValues[0].isTourChecked = data.tour_ids?.length > 0;
        if (data.tour_ids?.length > 0) {
            marketFormValues[0].tours = data.tour_ids.map((id: any) => ({
                tour_id: id
            }));
        }

        form.setFieldsValue({ ...marketFormValues });

        await getTourOptions(data.market_id).then(() => {
            data.tour_ids.forEach((item: any, index: number) => {
                tourOptions[data.market_id].items.push({});
                onChangeTour(0, index);
            });
        }).catch((err) => { });
    };

    const addTour = async (marketId: number, tour_id: string) => {
        let assignedMarket = assignedMarketData.find((item: any) => item.market_id === marketId);
        // if market already assigned change to update market and add new tour to it
        if (assignedMarket) {
            let updatedMarket = assignedMarket;
            if (!assignedMarket.tour_ids.includes(tour_id)) {
                updatedMarket = {
                    ...assignedMarket,
                    tour_ids: [...assignedMarket.tour_ids, tour_id],
                };
            }

            await showFormData(updatedMarket);
            setTimeout(() => {
                resetTourOptionsByItem(0);
            }, 20);
        } else {
            let marketFormValues: any[] = form.getFieldValue(marketsFormData);
            let marketIndex = marketFormValues.findIndex((item: any) => item.market_id === marketId);

            let newMarketIndex = marketIndex === -1 ? marketFormValues.length : marketIndex;
            const newTourIndex = marketIndex === -1 ? 0 : marketFormValues[marketIndex].tours?.length || 0;
            //if market not already exist in form then create new one
            if (marketIndex === -1) {
                if (marketFormValues.length === 1 && marketFormValues[0].market_id === '') {
                    newMarketIndex = 0;
                    marketFormValues = [];
                } else {
                    let marketOptionClone = marketOptions;
                    marketOptionClone.push(marketOptionRoot);
                    setMarketOptions(marketOptionClone);
                }
                form.setFieldValue(marketsFormData, [
                    ...marketFormValues,
                    {
                        market_id: marketId,
                        isTourChecked: true,
                        tours: [{ tour_id }]
                    }
                ]);
            } else {
                const checkIfTourExist = (marketFormValues[marketIndex].tours || []).some((item: any) => item.tour_id === tour_id);
                if (checkIfTourExist) {
                    showErrorToastr('Tour đã tồn tại');
                    return;
                }
                marketFormValues[marketIndex] = {
                    market_id: marketId,
                    isTourChecked: true,
                    tours: [...marketFormValues[marketIndex].tours, { tour_id }]
                }
                form.setFieldValue(marketsFormData, marketFormValues);
                tourOptions[marketId].items.push({});
                setTourOptions(tourOptions);
            }
            await getTourOptions(marketId).then(() => {
                let tours = useTour;
                tours[newMarketIndex] = true;
                setUseTour(tours);
                resetMarketOptionsByItem();
                onChangeTour(newMarketIndex, newTourIndex);
                resetTourOptionsByItem(newMarketIndex);
            }).catch(() => { });
        }
    };

    const resetFormData = () => {
        getMarketOptions();
        setUseTour([]);
        setFormAction(ACTION_CREATE);
        form.resetFields();
    }

    const onUnAssignedTopic = async (formData: any) => {
        setSpinning(true)
        formData.topic_id = topic_id;
        await unassignedTopic(formData)
            .unwrap()
            .then((payload: any) => {
                if (payload?.success) {
                    showSuccessToastr(payload?.message);
                    refetchMarketAssigned();
                    refetchMarketNotAssigned();
                    resetFormData();
                }
            })
            .catch((error: any) => {
                if (error?.status) {
                    showErrorToastr(error?.data.message);
                }
            })
        setSpinning(false);
    }

    const onChangeMarket = (value: any, index: number) => {
        let marketFormValues: any[] = form.getFieldValue(marketsFormData);
        marketFormValues[index].tours = [{ ...tourFormDefaultValue }];
        marketFormValues[index].isTourChecked = false;
        form.setFieldsValue({ ...marketFormValues });
        getTourOptions(value);
        resetMarketOptionsByItem();
    };

    const onChangeTour = (marketIndex: number, tourIndex: number) => {
        let marketFormValues: any[] = form.getFieldValue(marketsFormData);
        let marketId = marketFormValues[marketIndex].market_id;
        let tourItem = marketFormValues[marketIndex].tours[tourIndex];
        let tourItemFullData = tourOptions[marketId].rootList.find((item: any) => item.tour_id == tourItem.tour_id);
        marketFormValues[marketIndex].tours[tourIndex] = tourItemFullData;
        form.setFieldsValue({ ...marketFormValues });
    }

    const onChangeUseTour = (value: boolean, index: number) => {
        let marketFormValues = form.getFieldValue(marketsFormData);
        marketFormValues[index].isTourChecked = value;
        form.setFieldsValue({ ...marketFormValues });

        let tours = useTour;
        tours[index] = value;
        setUseTour(tours);
        resetMarketOptionsByItem();
        resetTourOptionsByItem(index);
    }

    const handleOnSubmit = async (formData: any, tableData?: any) => {
        let dataConvert = null;
        if (!tableData) {
            dataConvert = await formData.marketsFormData?.map((item: any) => ({
                topic_id: topic_id,
                market_id: item.market_id,
                tour_ids: item.isTourChecked ? item.tours.filter((nt: any) => nt && nt.tour_id).map((t: any) => t.tour_id) : []
            }))
        }
        setSpinning(true);
        const postData = {
            url: MARKET + '/store-update-market-topics',
            data: { marketTopics: tableData || dataConvert },
        }
        await storeUpdateApi(postData)
            .unwrap()
            .then((payload: any) => {
                if (payload?.success) {
                    showSuccessToastr(payload?.message);
                    resetFormData();
                    refetchMarketAssigned();
                    refetchMarketNotAssigned();
                }
            })
            .catch((error: any) => {
                if (error?.status) {
                    showErrorToastr(error?.data.message);
                }
            })
        setSpinning(false);
    }

    /** Components */
    const TourFormComponent = ({ fieldKey, marketIndex }: { fieldKey: any, marketIndex: number }) => {
        let marketFormValues: any[] = form.getFieldValue(marketsFormData);
        let marketId = marketFormValues?.[marketIndex]?.market_id;
        const getTourOptionList = (index: number) => {
            return marketId ? tourOptions[marketId]?.items?.[index] : [];
        }
        return <>
            {/* Nest Form.List */}
            <div className='!pl-4 grid grid-cols-12 gap-4 text-sm font-medium'>
                <div className='col-span-4'>
                    <label htmlFor="">Ngày khởi hành-Mã tour</label>
                </div>
                <div className='col-span-2'>
                    <label htmlFor="">Giá ADL</label>
                </div>
                <div className='col-span-2'>
                    <label htmlFor="">Push Sale</label>
                </div>
                <div className='col-span-2'>
                    <label htmlFor="">Giá ADL Push Sale</label>
                </div>
            </div>
            <Divider className='!mt-2 !mb-3'></Divider>
            <Form.Item label="" className='!pl-4 !mb-2'>
                <Form.List name={[fieldKey, 'tours']} initialValue={[tourFormDefaultValue]}>
                    {
                        (subFields, subOpt) => (
                            <div className=''>
                                {
                                    subFields.map((subField, index) => {
                                        return <div
                                            key={subField.key}
                                            className='grid grid-cols-12 gap-3 justify-center items-baseline'>
                                            <div className='col-span-4'>
                                                <Form.Item
                                                    className='!mb-0 !pb-1'
                                                    name={[subField.name, 'tour_id']}
                                                    rules={[{ required: true }]}
                                                    initialValue={''}>
                                                    <Select
                                                        showSearch
                                                        onChange={() => {
                                                            onChangeTour(marketIndex, index);
                                                            resetTourOptionsByItem(marketIndex);
                                                        }}
                                                        className='w-1/2'
                                                        placeholder="Chọn tour"
                                                        options={getTourOptionList(index)}
                                                        filterOption={(input: any, option: any) =>
                                                            option?.label.toLowerCase().includes(input.toLowerCase())
                                                        }
                                                        loading={tourFetching}
                                                        popupMatchSelectWidth={false}
                                                    />
                                                </Form.Item>
                                            </div>
                                            <div className='col-span-2'>
                                                <Form.Item noStyle name={[subField.name, 'price_adl_off']}>
                                                    <InputNumber
                                                        className='!w-full'
                                                        disabled
                                                        placeholder="Giá ADL"
                                                        formatter={(value) => formatPrice(value?.toString() as string)}
                                                    />
                                                </Form.Item>
                                            </div>
                                            <div className='col-span-2'>
                                                <Form.Item noStyle name={[subField.name, 'is_push_sale']} valuePropName="checked">
                                                    <Checkbox disabled>
                                                        Push Sale
                                                    </Checkbox>
                                                </Form.Item>
                                                {/* <Form.Item noStyle name={[subField.name, 'is_push_sale']}>
                                                    <Input disabled placeholder="second" />
                                                </Form.Item> */}
                                            </div>
                                            <div className='col-span-2'>
                                                <Form.Item noStyle name={[subField.name, 'push_sale_price_adl_off']}>
                                                    <InputNumber
                                                        className='!w-full'
                                                        disabled
                                                        placeholder="Giá ADL Push Sale"
                                                        formatter={(value) => formatPrice(value?.toString() as string)}
                                                    />
                                                </Form.Item>
                                            </div>
                                            <div className='col-span-2 flex flex-row justify-start items-center gap-4'>
                                                {
                                                    subFields.length > 1 ?
                                                        <CloseOutlined
                                                            className="!text-red-600"
                                                            onClick={() => {
                                                                subOpt.remove(subField.name);
                                                                if (subField.name > -1) {
                                                                    let tourOptionClone = tourOptions;
                                                                    tourOptionClone[marketId].items.splice(subField.name, 1);
                                                                    setTourOptions(tourOptionClone);
                                                                    resetTourOptionsByItem(marketIndex);
                                                                }
                                                            }}
                                                        />
                                                        : null
                                                }

                                                {
                                                    (subFields.length - 1 == index) ?
                                                        <Button
                                                            type="dashed"
                                                            className='max-w-max'
                                                            onClick={() => {
                                                                tourOptions[marketId].items.push({});
                                                                setTourOptions(tourOptions);
                                                                subOpt.add();
                                                                resetTourOptionsByItem(marketIndex);
                                                            }}>
                                                            + Thêm tour
                                                        </Button>
                                                        : null
                                                }
                                            </div>
                                        </div>
                                    })
                                }
                            </div>
                        )}
                </Form.List>
            </Form.Item>
        </>
    }

    const MarketFormcomponent = () => {
        return <>
            {spinning && <AdminLoading isLoading={true}></AdminLoading>}
            <Form.List
                name={marketsFormData}
                initialValue={[marketFormDefaultValue]}
            >
                {
                    (fields, { add, remove }) =>
                        fields.map(({ key, name, ...restField }, index) => (
                            <React.Fragment key={key}>
                                <div key={key} className='grid grid-cols-12 gap-5 items-baseline'>
                                    <div className='col-span-6'>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'market_id']}
                                            rules={[{ required: true }]}
                                            initialValue={''}>
                                            <Select
                                                showSearch
                                                disabled={formAction == ACTION_UPDATE}
                                                onChange={(value) => onChangeMarket(value, index)}
                                                className='w-1/2'
                                                placeholder="Chọn tuyến tour"
                                                options={marketOptions[index]}
                                                filterOption={(input: any, option: any) =>
                                                    option?.label.toLowerCase().includes(input.toLowerCase())
                                                }
                                                loading={marketNotAssignedFetching}
                                                popupMatchSelectWidth={false}
                                                popupClassName='max-w-3xl'
                                            />
                                        </Form.Item>
                                    </div>
                                    <div className='col-span-2'>
                                        <Form.Item>
                                            <Checkbox
                                                disabled={form.getFieldValue(marketsFormData)[index]?.market_id > 0 ? false : true}
                                                checked={form.getFieldValue(marketsFormData)[index]?.isTourChecked}
                                                onChange={(e: any) => {
                                                    const isChecked = e.target.checked;
                                                    onChangeUseTour(isChecked, index);
                                                }}
                                            >
                                                Sản phẩm tour
                                            </Checkbox>
                                        </Form.Item>
                                    </div>
                                    <div className='col-span-1 flex flex-row gap-2 justify-start items-center'>
                                        {
                                            (fields.length - 1) > 0 ?
                                                <Button
                                                    danger
                                                    icon={<MinusCircleOutlined />}
                                                    onClick={() => {
                                                        remove(name);
                                                        if (name > -1) {
                                                            let marketOptionClone = marketOptions;
                                                            marketOptionClone.splice(name, 1);
                                                            setMarketOptions(marketOptionClone);
                                                            resetMarketOptionsByItem();
                                                        }
                                                    }}
                                                >
                                                    {btnRemove}
                                                </Button>
                                                : null
                                        }
                                        {
                                            ((fields.length - 1) == index && formAction == ACTION_CREATE) ?
                                                <Button
                                                    type={'primary'}
                                                    icon={<PlusOutlined />}
                                                    onClick={() => {
                                                        let marketOptionClone = marketOptions;
                                                        marketOptionClone.push(marketOptionRoot);
                                                        setMarketOptions(marketOptionClone);
                                                        add();
                                                        resetMarketOptionsByItem();
                                                    }}
                                                >
                                                    {btnAdd}
                                                </Button>
                                                : null
                                        }
                                    </div>
                                </div >
                                {
                                    form.getFieldValue(marketsFormData)[index]?.isTourChecked ? <TourFormComponent fieldKey={name} marketIndex={index} /> : null
                                }
                                {
                                    (fields.length - 1) != index ?
                                        <Divider className='!mt-0 !mb-5 !border-bela-neutral-4 opacity-10'></Divider>
                                        : null
                                }
                            </React.Fragment>
                        ))
                }
            </Form.List >
        </>
    }

    return (
        <Form
            form={form}
            validateMessages={validateMessages}
            onFinish={handleOnSubmit}
            id="marketForm"
        >
            <Drawer
                id={componentId}
                title=""
                open={isOpen}
                {...getUpdateDrawerProps()}
                className="sgt_drawer sgt_drawer_tour_detail"
                onClose={setClose}
            >
                <div className='p-5'>
                    {checkPermission('TOPIC_MARKET_UPDATE') &&
                        <>
                            <div className='title flex flex-row justify-between items-center pb-3'>
                                <h3 className='flex flex-row justify-start items-center gap-2 text-xl font-medium'>
                                    {topicTitle}
                                </h3>
                                <FontAwesomeIcon
                                    className='w-10 text-xl text-right cursor-pointer'
                                    icon={faClose}
                                    onClick={setClose}>
                                </FontAwesomeIcon>
                            </div>
                            <div className='form'>
                                <h3 className='flex flex-row justify-start items-center gap-2 text-lg font-medium pb-2'>
                                    Thêm thị trường/tour
                                </h3>
                                <div className=''>
                                    {
                                        formAction !== ACTION_UPDATE &&
                                        <AdminTopicMarketAddTourField addTour={addTour} />
                                    }
                                    <Divider className='!mt-3 !mb-5' />
                                    <MarketFormcomponent />
                                    <Divider className='!my-3'></Divider>
                                    <div className='flex flex-row justify-end gap-3'>
                                        <Button htmlType="button" onClick={resetFormData}>{btnRefresh}</Button>
                                        <Button htmlType="submit" type="primary" form="marketForm">
                                            {
                                                formAction == ACTION_UPDATE
                                                    ? btnUpdate
                                                    : btnSave
                                            }
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </>
                    }
                    {checkPermission('TOPIC_MARKET_LIST') &&
                        <AdminTopicMarketTable
                            loading={marketAssignedLoading || marketAssignedFetching}
                            handleOnChangeSelect={handleOnChangeSelect}
                            marketData={assignedMarketData}
                            handleOnSubmit={handleOnSubmit}
                            topic_id={topic_id}
                        />}
                </div>
            </Drawer >
            {confirmModal}
        </Form >

    )
}

export default AdminTopicAddMarket
