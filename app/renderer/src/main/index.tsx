import styled from 'styled-components';
import React, { useEffect, useState } from 'react';
import { Button, Input, Notification, Space, Table } from '@arco-design/web-react';
import CollectSettingModal from '@/main/CollectSettingModal';
import { useGetHotelDetailList, useUpdateHotelStatus } from '@/api/services/hotel';
import { Page } from '@/api/types/base';
import { HotelDetail } from '@/api/types/hotel';
import HostSettingModal from '@/main/HostSettingModal';
import { StoreKey } from '@/types/enum';

const Main = () => {
  const [collect, setCollect] = useState<string>('');
  const [visible, setVisible] = useState<boolean>(false);
  const [name, setName] = useState<string>();
  const [page, setPage] = useState<Page>({ page_number: 1, page_size: 10 });
  const [data, setData] = useState<HotelDetail[]>([]);
  const [total, setTotal] = useState<number>();
  const [settingVisible, setSettingVisible] = useState<boolean>();
  const [cronjob, setCronjob] = useState<string>('start');

  const { loading, run } = useGetHotelDetailList();
  const { loading: updateLoading, run: updateRun } = useUpdateHotelStatus();

  const handleCollect = async (action: string) => {
    const res = await window.ipc.switch(action);
    if (res) {
      setCollect(action);
      Notification.success({ title: '请求成功', content: '切换成功' });
    } else {
      Notification.error({ title: '请求失败', content: '切换采集状态失败' });
    }
  };

  const handleCronjob = async () => {
    const action = cronjob === 'start' ? 'stop' : 'start'
    const res = await window.ipc.setStoryByKey(StoreKey.CRONJOB, action);
    debugger
    if (res) {
      setCronjob(action);
      Notification.success({ title: '请求成功', content: '切换成功' });
    } else {
      Notification.error({ title: '请求失败', content: '切换定时采集状态失败' });
    }
  };

  const handleSubmit = async () => {
    if (name) {
      const res = await run({ data: { name, page: { page_number: page.page_number, page_size: page.page_size } } });
      if (res?.metadata?.code === 'ok') {
        setData(res.result);
        setTotal(res?.metadata?.page?.total);
      } else {
        Notification.error({ title: '请求失败', content: '查询酒店数据失败' });
      }
    }
  };

  const handleUpdate = async (record: HotelDetail) => {
    const res = await updateRun({ data: { hotel_id: record.hotel_id, flag: !record.last_collected } });
    if (res?.metadata?.code === 'ok') {
      await handleSubmit();
      Notification.success({ title: '请求成功', content: '更新成功' });
    } else {
      Notification.error({ title: '请求失败', content: '更新失败' });
    }
  };

  const handlePageChange = (pageNumber: number, pageSize: number) => {
    setPage({ page_number: pageNumber, page_size: pageSize });
  };

  useEffect(() => {
    handleSubmit();
  }, [page]);

  const columns = [
    {
      title: '酒店名称',
      dataIndex: 'name',
    },
    {
      title: '酒店ID',
      dataIndex: 'hotel_id',
    },
    {
      title: '地址',
      dataIndex: 'address',
    },
    {
      title: '手机号',
      dataIndex: 'phone',
    },
    {
      title: '是否定时获取',
      dataIndex: 'last_collected',
      render: (text: boolean) => (text ? '是' : '否'),
    },
    {
      title: '操作',
      render: (_text: unknown, record: any) => (
        <Space>
          <Button type="text" onClick={() => handleUpdate(record)}>
            切换采集状态
          </Button>
        </Space>
      ),
      width: 160,
    },
  ];

  return (
    <Wrapper>
      <Header>
        <Space>
          <Input prefix="酒店名称" placeholder="请输入酒店名称查询" value={name} onChange={setName} />
          <Button onClick={handleSubmit} loading={loading || updateLoading} type="primary">
            查询
          </Button>
        </Space>
        <Space>
          <Button type="primary" disabled={collect === 'start'} onClick={() => handleCollect('start')}>
            开始采集
          </Button>
          <Button type="primary" status="warning" disabled={collect === 'pause'} onClick={() => handleCollect('pause')}>
            暂停采集{' '}
          </Button>
          <Button type="primary" onClick={() => handleCronjob()}>
            {`${cronjob === 'start' ? '开启定时采集' : '暂停定时采集'}`}
          </Button>
          <Button type="primary" onClick={() => setVisible(true)}>
            采集设置
          </Button>
          <Button type="primary" onClick={() => setSettingVisible(true)}>
            服务器设置
          </Button>
        </Space>
      </Header>
      <Body>
        <Table
          loading={updateLoading || loading}
          columns={columns}
          data={data}
          pagination={{
            showTotal: true,
            total: total,
            pageSize: page.page_size,
            current: page.page_number,
            onChange: handlePageChange,
          }}
        />
      </Body>
      <CollectSettingModal visible={visible} onSubmit={() => setVisible(false)} onCancel={() => setVisible(false)} />
      <HostSettingModal
        visible={settingVisible}
        onSubmit={() => setSettingVisible(false)}
        onCancel={() => setSettingVisible(false)}
      />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  margin: 16px;
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
`

const Body = styled.div`
    margin-top: 16px;
`

export default Main;
