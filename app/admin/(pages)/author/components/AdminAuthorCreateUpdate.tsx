import React, { useEffect, useRef, useState } from 'react';
import { AdminLoading } from '@/components/admin/atoms/Loading';
import { AUTHOR } from '@/constants/route';
import { showErrorToastr, showSuccessToastr } from '@/utils/toastr';
import { validateMessages } from '@/utils/validateRule';
import DrawerFormBtn from '@/components/admin/molecules/DrawerFormBtn';
import { DrawerLoading } from '@/components/admin/atoms/DrawerLoading';
import { useGetDataQuery, usePostDataMutation } from '@/services/api/common';
import { handleApiResponse, appendFormData } from '@/utils/helper';
import { authorFields } from './AuthorFields';
import { Form, Input, message, Select, Upload } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import InputAvatar from '@/components/general/organisms/InputAvatar/InputAvatar';


type Params = {
  author_id?: string;
  reloadDataList?: any;
  closeModal?: any;
};

const AdminAuthorCreateUpdate: React.FC<Params> = ({
  author_id,
  closeModal,
  reloadDataList,
}) => {
  const isEdit = !!author_id;
  const [form] = Form.useForm();
  const [spinning, setSpinning] = useState<boolean>(false);
  const divRef = useRef<HTMLDivElement>(null);
  const [storeUpdateApi] = usePostDataMutation();
      

  const getUrl = `${AUTHOR}/${isEdit ? (author_id + '/edit') : 'create'}`;
  const { data: initData, isFetching } = useGetDataQuery(getUrl, {
    refetchOnMountOrArgChange: !!isEdit,
  });

  const handleOnSubmit = async (values: any) => {
    const formData = new FormData();
    appendFormData(values, formData);
    const url = AUTHOR + (!isEdit ? '' : `/${author_id}?_method=PUT`);

    const postData = {
      url: url,
      data: formData,
      isFormData: true,
  }
    await handleApiResponse(
      storeUpdateApi(postData),
      (payload: any) => {
        showSuccessToastr(payload?.message);
        reloadDataList();
        closeModal();
        form.resetFields();
      },
      setSpinning
    );
  };

  useEffect(() => {
    if (initData?.author) {
      if (initData.error) {
        showErrorToastr(initData?.message);
        reloadDataList();
        closeModal();
      } else if (isEdit) {
        form.setFieldsValue({
          ...initData.author,
          ...initData.author?.social,
        });
      }
    }
  }, [initData, closeModal, form, isEdit, reloadDataList]);

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  return (
    <>
      {spinning && <AdminLoading isLoading={true} />}
      <div className="pb-5 mb-5">
        <DrawerLoading isLoading={isFetching} />
        <Form
          form={form}
          layout="vertical"
          onFinish={(value) => handleOnSubmit(value)}
          validateMessages={validateMessages}
          className={`${isFetching ? 'hidden' : 'block'}`}
        >
          <div ref={divRef}>
            {authorFields.map((field, index) => (
              <div key={index}>
                <h2 className="mb-1" id={field.item}>
                  {field.itemName}
                </h2>
                {field.part.map((item) =>
                  <Form.Item
                    key={item.name}
                    name={item.name}
                    label={item.label}
                    rules={[{ required: item.require }]} 
                    valuePropName={item.name === 'image' ? 'fileList' : undefined} 
                    getValueFromEvent={item.name === 'image' ? normFile : undefined} 
                  >
                    {item.name === 'image' ? (
                      <InputAvatar
                        isMultiple={false}
                        maxFiles={1}
                        src={initData?.author?.image} 
                      />
                    ) : item.type === 'select' ? (
                      <Select options={item.options} />
                    ) : item.type === 'text-area' ? (
                      <TextArea maxLength={item.maxLength} rows={4} />
                    ) : (
                      <Input
                        maxLength={item.maxLength}
                        type={item.type || 'text'}
                      />
                    )}
                  </Form.Item>
                )}
              </div>
            ))}
          </div>
          <DrawerFormBtn divRef={divRef} isEdit={isEdit} />
        </Form>
      </div>
    </>
  );
};

export default AdminAuthorCreateUpdate;
