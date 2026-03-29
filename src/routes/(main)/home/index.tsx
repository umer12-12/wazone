import { Flexbox } from '@lobehub/ui';
import { type FC } from 'react';
import { useLocation } from 'react-router-dom';

import PageTitle from '@/components/PageTitle';
import NavHeader from '@/features/NavHeader';
import WideScreenContainer from '@/features/WideScreenContainer';

import LandingPage from '@/features/LandingPage';
import HomeContent from './features';

const Home: FC = () => {
  const { pathname } = useLocation();
  const isHomeRoute = pathname === '/' || pathname === '';

  if (isHomeRoute) {
    return <LandingPage />;
  }

  return (
    <>
      <PageTitle title="" />
      <NavHeader right={<Flexbox horizontal align="center" />} />
      <Flexbox height={'100%'} style={{ overflowY: 'auto', paddingBottom: '16vh' }} width={'100%'}>
        <WideScreenContainer>
          <HomeContent />
        </WideScreenContainer>
      </Flexbox>
    </>
  );
};

export default Home;
