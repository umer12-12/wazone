'use client';

import { Icon } from '@lobehub/ui';
import { Button, Typography } from 'antd';
import dayjs from 'dayjs';
import { Timer, Zap } from 'lucide-react';
import { memo, useEffect, useState } from 'react';
import { createStyles } from 'antd-style';
import { useNavigate } from 'react-router-dom';

import { useUserStore } from '@/store/user';
import { authSelectors } from '@/store/user/selectors';

const { Text } = Typography;

const useStyles = createStyles(({ css, token }) => ({
  banner: css`
    background: linear-gradient(90deg, #1d39c4 0%, #722ed1 100%);
    color: white;
    padding: 8px 16px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 12px;
    font-weight: bold;
    box-shadow: 0 4px 12px rgba(114, 46, 209, 0.3);
    animation: pulse 2s infinite;
    z-index: 1000;

    @keyframes pulse {
      0% { box-shadow: 0 0 0 0 rgba(114, 46, 209, 0.4); }
      70% { box-shadow: 0 0 0 10px rgba(114, 46, 209, 0); }
      100% { box-shadow: 0 0 0 0 rgba(114, 46, 209, 0); }
    }
  `,
  timer: css`
    font-family: monospace;
    background: rgba(255, 255, 255, 0.2);
    padding: 2px 8px;
    border-radius: 4px;
    margin-left: 4px;
  `,
}));

const TrialUrgencyBanner = memo(() => {
  const { styles } = useStyles();
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState<string>('');
  
  const [trialStartedAt, subscriptionPlan] = useUserStore((s) => [
    s.userServerConfig?.trialStartedAt,
    authSelectors.subscriptionPlan(s)
  ]);

  // If user is already on a premium plan, don't show the "Activate" urgency
  if (subscriptionPlan === 'premium' || subscriptionPlan === 'ultimate') return null;
  if (!trialStartedAt) return null;

  const expiryDate = dayjs(trialStartedAt).add(24, 'hour');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = dayjs();
      const diff = expiryDate.diff(now);
      
      if (diff <= 0) {
        setTimeLeft('EXPIRED');
        clearInterval(timer);
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft(`${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [trialStartedAt]);

  if (timeLeft === 'EXPIRED') return null;

  return (
    <div className={styles.banner}>
      <Icon icon={Zap} size={{ fontSize: 18 }} />
      <span>SULTAN'S OFFER: Your 7-Day Pro Trial activation expires in:</span>
      <span className={styles.timer}><Icon icon={Timer} size={14} style={{ marginRight: 4 }} />{timeLeft}</span>
      <Button 
        type="primary" 
        size="small" 
        style={{ marginLeft: 12, background: 'white', color: '#1d39c4', border: 'none' }}
        onClick={() => navigate('/settings/billing')}
      >
        ACTIVATE NOW
      </Button>
    </div>
  );
});

export default TrialUrgencyBanner;
