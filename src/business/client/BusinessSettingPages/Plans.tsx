'use client';

import { Icon } from '@lobehub/ui';
import { Button, Card, Col, Divider, Row, Space, Typography } from 'antd';
import { CheckCircle2, Zap, ShieldCheck, Rocket } from 'lucide-react';
import { memo } from 'react';

import { trpc } from '@/libs/trpc/client';

const { Title, Text } = Typography;

const Plans = memo(() => {
  const { data: priceIds } = trpc.subscription.getPlanIds.useQuery();
  const createCheckout = trpc.subscription.createCheckoutSession.useMutation({
    onSuccess: (data: any) => {
      if (data.url) window.location.href = data.url;
    },
  });

  const plans = [
    {
      title: 'Starter',
      price: '19',
      priceId: priceIds?.starter,
      icon: Zap,
      color: '#1890ff',
      features: ['5,000 AI Messages', 'Standard Models', '2GB Storage', 'Email Support'],
    },
    {
      title: 'Premium',
      price: '49',
      priceId: priceIds?.premium,
      icon: ShieldCheck,
      color: '#722ed1',
      featured: true,
      features: ['Unlimited Messages', 'GPT-4 & Claude 3.5', '10GB Storage', 'Priority Support'],
    },
    {
      title: 'Ultimate',
      price: '99',
      priceId: priceIds?.ultimate,
      icon: Rocket,
      color: '#eb2f96',
      features: ['Everything in Premium', 'Early Access Features', '50GB Storage', '24/7 Sultan Support'],
    },
  ];

  return (
    <div style={{ padding: '24px 48px' }}>
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <Title level={2}>Empire Pricing Plans</Title>
        <Text type="secondary">Choose the power level for your Wazone journey.</Text>
      </div>

      <Row gutter={[24, 24]} justify="center">
        {plans.map((plan) => (
          <Col key={plan.title} xs={24} sm={12} md={8}>
            <Card
              hoverable
              style={{
                borderRadius: 16,
                border: plan.featured ? `2px solid ${plan.color}` : undefined,
                boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                textAlign: 'center',
              }}
            >
              <Space direction="vertical" align="center" size={16}>
                <div style={{ 
                  background: `${plan.color}15`, 
                  padding: 16, 
                  borderRadius: '50%',
                  color: plan.color 
                }}>
                  <Icon icon={plan.icon} size={{ fontSize: 32 }} />
                </div>
                <Title level={3} style={{ margin: 0 }}>{plan.title}</Title>
                <div>
                  <Title level={1} style={{ margin: 0, display: 'inline' }}>${plan.price}</Title>
                  <Text type="secondary"> / month</Text>
                </div>
                <Divider style={{ margin: '12px 0' }} />
                <div style={{ textAlign: 'left', minHeight: 180 }}>
                  {plan.features.map((f) => (
                    <Space key={f} style={{ marginBottom: 8, display: 'flex' }}>
                      <CheckCircle2 size={16} color="#52c41a" />
                      <Text>{f}</Text>
                    </Space>
                  ))}
                </div>
                <Button 
                  type={plan.featured ? 'primary' : 'default'}
                  size="large"
                  block
                  loading={createCheckout.isPending}
                  disabled={!plan.priceId}
                  onClick={() => createCheckout.mutate({ priceId: plan.priceId! })}
                >
                  {plan.priceId ? 'Deploy Now' : 'Coming Soon'}
                </Button>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
});

Plans.displayName = 'Plans';
export default Plans;
