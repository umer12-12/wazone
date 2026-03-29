'use client';

import { Icon } from '@lobehub/ui';
import { Button, Card, Col, Row, Space, Typography, Tag, Divider } from 'antd';
import { ShieldCheck, Zap, Rocket, Terminal, Database, Globe, ArrowRight } from 'lucide-react';
import { memo } from 'react';
import { createStyles } from 'antd-style';
import { useNavigate } from 'react-router-dom';

const { Title, Text, Paragraph } = Typography;

const useStyles = createStyles(({ css, token }) => ({
  container: css`
    background: #000;
    color: #fff;
    min-height: 100vh;
    overflow-x: hidden;
  `,
  hero: css`
    padding: 120px 24px 80px;
    text-align: center;
    background: radial-gradient(circle at center, #1d39c422 0%, #000 70%);
    position: relative;
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url('/wazone_hero_shuttle_1774808699317.png') no-repeat center center;
      background-size: cover;
      opacity: 0.3;
      z-index: 0;
    }
  `,
  heroContent: css`
    position: relative;
    z-index: 1;
  `,
  glowText: css`
    text-shadow: 0 0 20px rgba(24, 144, 255, 0.8);
    background: linear-gradient(180deg, #fff 0%, #1890ff 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  `,
  card: css`
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 20px;
    backdrop-filter: blur(10px);
    transition: all 0.3s ease;
    
    &:hover {
      border-color: #1890ff;
      transform: translateY(-5px);
      box-shadow: 0 10px 30px rgba(24, 144, 255, 0.2);
    }
  `,
  featureIcon: css`
    background: linear-gradient(135deg, #1890ff 0%, #722ed1 100%);
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 15px;
    margin-bottom: 24px;
  `,
}));

const LandingPage = memo(() => {
  const { styles } = useStyles();
  const navigate = useNavigate();

  const features = [
    {
      title: 'Binary Vault',
      desc: 'Military-grade encryption for your AI data and prompts.',
      icon: Terminal,
    },
    {
      title: 'Server Pulse',
      desc: 'Real-time monitoring of your LLM infrastructure and health.',
      icon: Database,
    },
    {
      title: 'Global Gateway',
      desc: 'Connect to any AI provider worldwide with 99.9% uptime.',
      icon: Globe,
    },
  ];

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <Space direction="vertical" size={24}>
            <Tag color="processing" style={{ borderRadius: 100, padding: '4px 16px', fontSize: 14 }}>
              WAZONE v2.0 HAS ARRIVED
            </Tag>
            <Title className={styles.glowText} style={{ fontSize: '72px', margin: 0 }}>
              The Sovereign AI Empire
            </Title>
            <Paragraph style={{ fontSize: '20px', color: 'rgba(255,255,255,0.7)', maxWidth: 800, margin: '0 auto' }}>
              Your high-tech command center for world-class AI operations. 
              Secure, scalable, and Sultan-approved.
            </Paragraph>
            <Space size={16}>
              <Button type="primary" size="large" onClick={() => navigate('/settings/billing')} icon={<ArrowRight size={18} />}>
                Start Your Empire
              </Button>
              <Button size="large" ghost onClick={() => navigate('/home')}>
                Explore Portal
              </Button>
            </Space>
          </Space>
        </div>
      </section>

      {/* Features Grid */}
      <section style={{ padding: '100px 48px' }}>
        <Row gutter={[32, 32]}>
          {features.map((f) => (
            <Col key={f.title} xs={24} md={8}>
              <Card className={styles.card}>
                <div className={styles.featureIcon}>
                  <Icon icon={f.icon} size={{ fontSize: 24 }} color="#fff" />
                </div>
                <Title level={3} style={{ color: '#fff' }}>{f.title}</Title>
                <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 16 }}>
                  {f.desc}
                </Text>
              </Card>
            </Col>
          ))}
        </Row>
      </section>

      <Divider style={{ borderColor: 'rgba(255,255,255,0.1)' }} />

      {/* Trust Quote */}
      <section style={{ padding: '80px 24px', textAlign: 'center' }}>
        <Paragraph style={{ fontStyle: 'italic', fontSize: '24px', color: '#1890ff' }}>
          "In the age of AI, those who control their binary destiny, control the future."
        </Paragraph>
        <Text strong style={{ color: 'rgba(255,255,255,0.5)' }}>— Sultan Umer Sahoo</Text>
      </section>

      {/* Footer */}
      <footer style={{ padding: '48px', borderTop: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
        <Text style={{ color: 'rgba(255,255,255,0.4)' }}>
          © 2026 Wazone.online - All Rights Reserved by the Sultanate.
        </Text>
      </footer>
    </div>
  );
});

LandingPage.displayName = 'LandingPage';
export default LandingPage;
