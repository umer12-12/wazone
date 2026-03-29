'use client';

import { Form, Item, Section } from '@lobehub/ui';
import { Button, Card, Descriptions, Tag, Typography } from 'antd';
import { CreditCard, History, Settings } from 'lucide-react';
import { memo } from 'react';
import dayjs from 'dayjs';

import { trpc } from '@/libs/trpc/client';
import { useUserStore } from '@/store/user';
import { authSelectors } from '@/store/user/selectors';

const { Title, Text } = Typography;

const Billing = memo(() => {
  const [userState] = useUserStore((s) => [authSelectors.subscriptionPlan(s)]);
  const createPortal = trpc.subscription.createPortalSession.useMutation({
    onSuccess: (data: any) => {
      if (data.url) window.location.href = data.url;
    },
  });

  const planName = userState || 'Starter (Trial)';

  return (
    <div style={{ padding: '24px 48px' }}>
      <Title level={2}>Account & Billing</Title>
      <Text type="secondary">Manage your Wazone subscription and payment methods.</Text>

      <div style={{ marginTop: 32 }}>
        <Section title="💳 Current Subscription" description="Your active plan and billing status.">
          <Card style={{ borderRadius: 12 }}>
            <Descriptions column={1}>
              <Descriptions.Item label="Active Plan">
                <Tag color="#722ed1" style={{ fontSize: 16, padding: '4px 12px' }}>
                  {planName.toUpperCase()}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color="success">ACTIVE</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Next Billing Date">
                {dayjs().add(30, 'day').format('MMMM DD, YYYY')}
              </Descriptions.Item>
            </Descriptions>
            
            <div style={{ marginTop: 24, padding: '16px', background: '#f5f5f5', borderRadius: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text strong>Need to update your card or cancel?</Text>
                <Button 
                  icon={<Settings size={16} />} 
                  onClick={() => createPortal.mutate()}
                  loading={createPortal.isPending}
                >
                  Manage on Stripe
                </Button>
              </div>
            </div>
          </Card>
        </Section>

        <Section title="🧾 Billing History" description="View and download your past invoices.">
          <Card style={{ textAlign: 'center', padding: '48px 0', background: '#fafafa' }}>
             <History size={48} color="#d9d9d9" style={{ marginBottom: 16 }} />
             <br />
             <Text type="secondary">No invoices found yet. Your first billing cycle will appear here.</Text>
          </Card>
        </Section>
      </div>
    </div>
  );
});

Billing.displayName = 'Billing';
export default Billing;
