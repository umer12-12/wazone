import { UserButton } from '@clerk/nextjs';
import { ActionIcon, Flexbox } from '@lobehub/ui';
import { createStyles } from 'antd-style';
import { Activity, Shield, Wallet } from 'lucide-react';
import { memo } from 'react';
import { useNavigate } from 'react-router-dom';

import { useUserStore } from '@/store/user';
import { authSelectors } from '@/store/user/selectors';
import { useServerConfigStore, serverConfigSelectors } from '@/store/serverConfig';

const useStyles = createStyles(({ css, token }) => ({
  container: css`
    border-bottom: 1px solid ${token.colorInfoBorder};
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(10px);
    box-shadow: 0 0 15px rgba(0, 163, 255, 0.2);
  `,
  neonText: css`
    color: #00d2ff;
    text-shadow: 0 0 8px rgba(0, 210, 255, 0.6);
    font-weight: bold;
    font-family: 'Outfit', sans-serif;
  `,
  iconBox: css`
    gap: 12px;
    padding: 0 16px;
  `,
  neonButton: css`
    color: #00d2ff !important;
    transition: all 0.3s ease;
    &:hover {
      background: rgba(0, 210, 255, 0.1) !important;
      transform: translateY(-1px);
      box-shadow: 0 0 12px rgba(0, 210, 255, 0.4);
    }
  `,
}));

const SultanNavbar = memo(() => {
  const { styles } = useStyles();
  const isAdmin = useUserStore(authSelectors.isAdmin);
  const branding = useServerConfigStore(s => s.serverConfig.wazoneCustomBranding);
  const navigate = useNavigate();

  const appName = branding?.name || 'WAZONE';

  return (
    <Flexbox
      horizontal
      align={'center'}
      justify={'space-between'}
      className={styles.container}
      height={52}
      padding={'0 20px'}
      width={'100%'}
    >
      <Flexbox horizontal align={'center'} gap={20}>
        <div 
          className={styles.neonText} 
          style={{ fontSize: 20, cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          {appName.toUpperCase()}
        </div>
        {isAdmin && (
          <Flexbox horizontal align={'center'} className={styles.iconBox} gap={16}>
            <ActionIcon
              title="Sultan Wallet"
              icon={<Wallet size={20} />}
              className={styles.neonButton}
              onClick={() => navigate('/settings/stats')} 
            />
            <ActionIcon
              title="Server Pulse"
              icon={<Activity size={20} />}
              className={styles.neonButton}
              onClick={() => navigate('/settings/stats')}
            />
            <ActionIcon
              title="Binary Vault"
              icon={<Shield size={20} />}
              className={styles.neonButton}
              onClick={() => navigate('/settings/security')}
            />
          </Flexbox>
        )}
      </Flexbox>
      
      <Flexbox horizontal align={'center'} gap={12}>
        <UserButton afterSignOutUrl="/" />
      </Flexbox>
    </Flexbox>
  );
});

export default SultanNavbar;
