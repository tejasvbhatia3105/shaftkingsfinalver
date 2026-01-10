import ProfilePage from '@/shared/Profile';
import type { PageWithId } from '@/types/params';
import type { Metadata } from 'next';
import { getUserData } from 'packages/hooks/useUser';

export const metadata: Metadata = {
  title: 'Cricket | Profile',
  openGraph: {
    title: 'Cricket | Profile',
    siteName: 'Cricket',
    images: [
      {
        url: '/assets/img/metadata.png',
        width: 1102,
        height: 619,
      },
    ],
    type: 'website',
  },
  twitter: {
    title: 'Cricket | Profile',
    images: '/assets/img/metadata.png',
    card: 'summary_large_image',
  },
};

const Profile = async ({ params }: PageWithId) => {
  const { id } = await params;
  const userData = await getUserData(id);
  return <ProfilePage pageWallet={id} userData={userData} />;
};

export default Profile;
