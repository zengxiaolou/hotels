import { Button, Notification, Form, InputNumber, Modal, ModalProps, Space, Input } from '@arco-design/web-react';
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
   const res = await window.ipc.setStoryByKey(StoreKey.SERVICE,  value)
   if (res) {
     Notification.success({title: '请求成功', content: "域名端口设置成功" })
     localStorage.setItem('host', value.host);
     localStorage.setItem('port', value.port);
   }else {
     Notification.error({title: '请求失败', content: '采集间隔设置失败'});
   }
   onSubmit()
 }

 useEffect(() => {
   if (!form.getFieldValue('host')) {
     const host = localStorage.getItem('host');
     form.setFieldsValue({host});
   }
   if (!form.getFieldValue('port')) {
     const port = localStorage.getItem('port');
     form.setFieldsValue({port});
   }
 }, [])

 return <Modal  onCancel={onCancel} title="服务器设置" {...rest} style={{width: 400}} footer={null}  >
  <Form onSubmit={handleSubmit} form={form}>
     <FormItem label="域名" defaultValue={ localStorage.getItem('host')|| "120.79.229.216" } field="host" labelAlign="left">
       <Input placeholder="请输入域名,例如: 120.79.229.216" />
     </FormItem>
    <FormItem label="端口" defaultValue={8000} field="port" labelAlign="left">
      <InputNumber placeholder="请输入端口号" />
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
