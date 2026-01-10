import { glass } from '@dicebear/collection';
import { createAvatar } from '@dicebear/core';
// eslint-disable-next-line no-restricted-imports
import React, { useEffect, useRef, useState } from 'react';

type AvatarProps = {
  seed: string;
  size?: number;
  hasList?: boolean;
};

const Avatar: React.FC<AvatarProps> = ({
  seed,
  size = 100,
  hasList = false,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const avatarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hasList) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.1,
      }
    );

    if (avatarRef.current) {
      observer.observe(avatarRef.current);
    }

    return () => {
      if (avatarRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        observer.unobserve(avatarRef.current);
      }
    };
  }, [hasList]);

  const avatar = createAvatar(glass, {
    seed,
    size,
  });

  return (
    <div
      ref={avatarRef}
      style={{
        width: size,
        height: size,
        borderRadius: '1px',
        overflow: 'hidden',
      }}
      dangerouslySetInnerHTML={{
        __html: isVisible || !hasList ? avatar.toString() : '',
      }}
    />
  );
};

export default React.memo(Avatar);
