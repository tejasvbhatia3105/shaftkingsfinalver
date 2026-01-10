import EditProfile from '@/components/GlobalControl/EditProfile';
import type { PageWithId } from '@/types/params';
import { getUserData } from 'packages/hooks/useUser';

const EditPage = async ({ params }: PageWithId) => {
  const { id } = await params;
  const userData = await getUserData(id);
  return <EditProfile userData={userData} />;
};

export default EditPage;
