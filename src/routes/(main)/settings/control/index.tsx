import { Button, Input, Switch, Table, Tag, message } from 'antd';
import dayjs from 'dayjs';
import { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Form, Item, Section } from '@lobehub/ui';

import { trpc } from '@/libs/trpc/client';

const Control = memo(() => {
  const { t: _t } = useTranslation('common');
  
  // System Configs
  const { data: settings, refetch: refetchSettings } = trpc.systemConfig.getSettings.useQuery();
  const updateSetting = trpc.systemConfig.updateSetting.useMutation({
    onSuccess: () => {
      message.success('Sultan, Wazone configurations updated!');
      refetchSettings();
    },
  });

  // User Management
  const { data: users, refetch: refetchUsers } = trpc.systemConfig.listUsers.useQuery();
  const updateUser = trpc.systemConfig.updateUser.useMutation({
    onSuccess: () => {
      message.success('User updated successfully.');
      refetchUsers();
    },
  });

  // Analytics
  const { data: analytics } = trpc.market.sultan.getAnalytics.useQuery();

  // Marketplace
  const { data: marketTools, refetch: refetchMarket } = trpc.market.sultan.getTools.useQuery();
  const addTool = trpc.market.sultan.addTool.useMutation({
    onSuccess: () => {
      message.success('Tool added to Marketplace, Sultan!');
      refetchMarket();
    },
  });
  const removeTool = trpc.market.sultan.removeTool.useMutation({
    onSuccess: () => {
      message.success('Tool removed.');
      refetchMarket();
    },
  });

  const [form] = Form.useForm();

  const handleSaveBranding = () => {
    const values = form.getFieldsValue();
    Object.entries(values).forEach(([key, value]) => {
      if (value !== undefined) {
        updateSetting.mutate({ key, value: String(value) });
      }
    });
  };

  const userColumns = [
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { 
      title: 'Created At', 
      dataIndex: 'createdAt', 
      key: 'createdAt',
      render: (date: any) => dayjs(date).format('YYYY-MM-DD HH:mm')
    },
    { 
      title: 'Trial Status', 
      key: 'trial',
      render: (_: any, record: any) => {
        const isExpired = dayjs().isAfter(record.trialEndsAt);
        return (
          <Tag color={isExpired ? 'error' : 'success'}>
            {isExpired ? 'Expired' : `Ends ${dayjs(record.trialEndsAt).fromNow()}`}
          </Tag>
        );
      }
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Button 
          danger 
          size="small" 
          onClick={() => updateUser.mutate({ id: record.id, banned: !record.banned })}
        >
          {record.banned ? 'Unban' : 'Ban'}
        </Button>
      )
    }
  ];

  const marketColumns = [
    { title: 'Identifier', dataIndex: 'identifier', key: 'identifier' },
    { title: 'Label', dataIndex: 'label', key: 'label' },
    { 
      title: 'Status', 
      dataIndex: 'active', 
      key: 'active',
      render: (active: boolean) => <Tag color={active ? 'processing' : 'default'}>{active ? 'Active' : 'Disabled'}</Tag>
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Button danger size="small" onClick={() => removeTool.mutate({ id: record.id })}>Remove</Button>
      )
    }
  ];

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Analytics Dashboard */}
      <Section title="📊 Empire Revenue Analytics" description="Real-time pulse of your money engine.">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
          <div style={{ padding: '16px', borderRadius: '8px', background: 'rgba(0,255,255,0.05)', border: '1px solid #00ffff55' }}>
            <div style={{ opacity: 0.7 }}>Total Revenue (USD)</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#00ffff' }}>${analytics?.totalRevenue?.toFixed(2) || '0.00'}</div>
          </div>
          <div style={{ padding: '16px', borderRadius: '8px', background: 'rgba(255,0,255,0.05)', border: '1px solid #ff00ff55' }}>
            <div style={{ opacity: 0.7 }}>Tokens Processed</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ff00ff' }}>{analytics?.totalTokens?.toLocaleString() || '0'}</div>
          </div>
          <div style={{ padding: '16px', borderRadius: '8px', background: 'rgba(255,255,0,0.05)', border: '1px solid #ffff0055' }}>
            <div style={{ opacity: 0.7 }}>Active Sessions</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ffff00' }}>{analytics?.logCount || '0'}</div>
          </div>
        </div>
      </Section>

      <Form
        form={form}
        initialValues={settings}
        variant="pure"
      >
        <Section title="💎 Wafone Global Branding" description="Change the identity of your SaaS empire.">
          <Item desc="Navbar and Browser Tab name." label="Product Name">
            <Input defaultValue={settings?.['PRODUCT_NAME']} name="PRODUCT_NAME" placeholder="Wazone" />
          </Item>
          <Item desc="Direct link to logo SVG/PNG." label="Logo URL">
            <Input defaultValue={settings?.['LOGO_URL']} name="LOGO_URL" placeholder="https://..." />
          </Item>
          <Item desc="Enforce a specific personality for all AI interactions." label="Global Identity">
            <Input.TextArea 
              defaultValue={settings?.['GLOBAL_SYSTEM_PROMPT']} 
              name="GLOBAL_SYSTEM_PROMPT" 
              placeholder="You are Wazone AI, a powerful and prestigious digital entity..." 
              rows={4}
            />
          </Item>
          <Button loading={updateSetting.isPending} onClick={handleSaveBranding} type="primary">
            Update Empire Identity
          </Button>
        </Section>

        <Section title="🎛️ Feature Toggles" description="Control entire modules and trial logic.">
          <Item desc="Lock site for everyone except you." label="Maintenance Mode">
            <Switch 
               checked={settings?.['MAINTENANCE_MODE'] === 'true'}
               onChange={(checked) => updateSetting.mutate({ key: 'MAINTENANCE_MODE', value: String(checked) })}
            />
          </Item>
          <Item desc="Enable 7-day trial for Starter plan." label="Starter Trial">
            <Switch 
               checked={settings?.['PLAN_STARTER_TRIAL'] === 'true'}
               onChange={(checked) => updateSetting.mutate({ key: 'PLAN_STARTER_TRIAL', value: String(checked) })}
            />
          </Item>
          <Item desc="Enable 7-day trial for Premium plan." label="Premium Trial">
            <Switch 
               checked={settings?.['PLAN_PREMIUM_TRIAL'] === 'true'}
               onChange={(checked) => updateSetting.mutate({ key: 'PLAN_PREMIUM_TRIAL', value: String(checked) })}
            />
          </Item>
          <Item desc="Enable 7-day trial for Ultimate plan." label="Ultimate Trial">
            <Switch 
               checked={settings?.['PLAN_ULTIMATE_TRIAL'] === 'true'}
               onChange={(checked) => updateSetting.mutate({ key: 'PLAN_ULTIMATE_TRIAL', value: String(checked) })}
            />
          </Item>
        </Section>
      </Form>

      <Section title="🪄 Sultan Marketplace Injection" description="Dynamically inject custom tools and agents into the marketplace.">
        <div style={{ marginBottom: '16px' }}>
             <Button type="dashed" block onClick={() => {
                const identifier = prompt('Enter Tool Identifier (e.g. sultan-whatsapp):');
                const label = prompt('Enter Tool Label:');
                const manifestUrl = prompt('Enter Manifest URL:');
                if(identifier && label && manifestUrl) {
                    addTool.mutate({ identifier, label, manifestUrl });
                }
             }}>+ Inject New Tool</Button>
        </div>
        <Table 
          dataSource={marketTools} 
          columns={marketColumns} 
          rowKey="id" 
          pagination={{ pageSize: 5 }}
        />
      </Section>

      <Section title="👥 Sultan User Management" description="Monitor and manage all users in your empire.">
        <Table 
          dataSource={users} 
          columns={userColumns} 
          rowKey="id" 
          loading={!users}
          pagination={{ pageSize: 5 }}
        />
      </Section>
    </div>
  );
});

export default Control;
