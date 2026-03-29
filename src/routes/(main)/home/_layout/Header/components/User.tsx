'use client';

import { UserButton, SignedIn, SignedOut, SignInButton } from '@clerk/nextjs';
import { Block, Flexbox } from '@lobehub/ui';
import { memo } from 'react';

const User = memo<{ lite?: boolean }>(({ lite }) => {
  return (
    <Block
      horizontal
      align={'center'}
      gap={8}
      paddingBlock={2}
      variant={'borderless'}
      style={{
        minWidth: 32,
        overflow: 'hidden',
        paddingInlineStart: 2,
      }}
    >
      <SignedIn>
        <UserButton 
          afterSignOutUrl="/"
          appearance={{
            elements: {
              userButtonAvatarBox: {
                width: 28,
                height: 28,
                borderRadius: 4
              }
            }
          }}
        />
      </SignedIn>
      <SignedOut>
        <SignInButton mode="modal">
          <Block clickable paddingInline={8}>Sign In</Block>
        </SignInButton>
      </SignedOut>
    </Block>
  );
});

export default User;
