import { Button, Notification, Form, InputNumber, Modal, ModalProps, Space } from '@arco-design/web-react';
import React, { FC, useEffect } from 'react';
import styled from 'styled-components';
import { StoreKey } from '@/types/enum';

interface Props extends ModalProps {
  onCancel: () => void;
  onSubmit: () => void;
}

const FormItem = Form.Item

const CollectSettingModal: FC<Props> = ({onCancel, onSubmit, ...rest}) => {

  const [form] = Form.useForm();
 const handleSubmit =async (value: any) => {
   const res = await window.ipc.setStoryByKey(StoreKey.WAIT_TIME,  value.waitTime)
   if (res) {
     Notification.success({title: '请求成功', content: "采集间隔设置成功" })
   }else {
     Notification.error({title: '请求失败', content: '采集间隔设置失败'});
   }
   onSubmit()
 }

 useEffect(() => {
   const getValue = async () => {
     const res = await window.ipc.getStoryByKey(StoreKey.WAIT_TIME);
     if (!form.getFieldValue("waitTime")) {
       form.setFieldsValue({waitTime: res})
     }
   };
   getValue();
 }, [])

 return <Modal  onCancel={onCancel} title="采集设置" {...rest} style={{width: 400}} footer={null}  >
  <Form onSubmit={handleSubmit} form={form}>
     <FormItem label="间隔时间" field="waitTime" labelAlign="left">
       <InputNumber suffix="秒" />
     </FormItem>
      <Footer>
        <Space>
          <Button onClick={onCancel}>取消</Button>
          <Button type="primary" htmlType="submit">提交</Button>
        </Space>
      </Footer>
   </Form>
  </Modal>
}

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
`

export default CollectSettingModal
