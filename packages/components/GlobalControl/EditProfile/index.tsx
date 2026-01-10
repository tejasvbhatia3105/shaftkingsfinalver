'use client';

import { useRouter } from 'next/navigation';
import { ArrowBack } from '@/components/Icons';
import InputField from '@/components/InputField';
import { Button } from '@/components/Button';
import { useCallback, useState } from 'react';
import { useUser } from '@/context/User';
import type { UserData } from '@/types/user';
import { ImageUpload } from '@/components/ImageUpload';
import { Toast } from '@/components/Toast';
import { renameImageFile } from '@/utils/renameImage';
import api from '@/constants/api';
import { signMessage } from '@/utils/signMessage';
import { USER_AUTHORIZATION_MESSAGE } from '@/constants/authorization';
import type { WalletContextState } from '@solana/wallet-adapter-react';
import { useTriad } from '@/context/Triad';
import { getUserData } from 'packages/hooks/useUser';

const EditProfile = ({ userData }: { userData: UserData }) => {
  const { connectedUser, setConnectedUser } = useTriad();
  const { updateUser, wallet } = useUser();
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const router = useRouter();

  const onRemoveImage = useCallback(async () => {
    if (image) {
      setImage(null);
      Toast.show({
        title: 'Profile image removed!',
        type: 'success',
        timeClose: 3000,
      });
      return;
    }

    const signatureBase64 = await signMessage(
      USER_AUTHORIZATION_MESSAGE,
      wallet as WalletContextState
    );

    await updateUser({
      signature: signatureBase64,
      image: ' ',
    });

    setImage(null);
    if (connectedUser) {
      setConnectedUser({ ...connectedUser, image: '' });
    }
  }, [image, wallet, updateUser, connectedUser, setConnectedUser]);

  const editPhoto = useCallback(
    async (img: File, signatureBase64: string) => {
      if (!wallet) return;
      try {
        const formDataImage = new FormData();
        formDataImage.append(
          'files',
          renameImageFile(img, img.name.split('.')[0])
        );
        await api.patch(
          `user/${wallet.publicKey.toBase58()}/image?signature=${signatureBase64}`,
          formDataImage
        );
        const res = await getUserData(wallet.publicKey.toBase58());
        setImage(null);

        setConnectedUser(res);
        Toast.show({
          title: 'Profile image updated!',
          type: 'success',
          timeClose: 3000,
        });
      } catch (error) {
        /* empty */
      }
    },
    [setConnectedUser, wallet]
  );

  const onSubmit = useCallback(async () => {
    if (!connectedUser?.name) return;
    try {
      setLoading(true);

      const signatureBase64 = await signMessage(
        USER_AUTHORIZATION_MESSAGE,
        wallet as WalletContextState
      );

      if (image) {
        const encodedSignature = encodeURIComponent(signatureBase64);
        await editPhoto(image, encodedSignature);
      }
      if (connectedUser?.name !== userData.name) {
        await updateUser({
          name: connectedUser?.name,
          signature: signatureBase64,
        });
      }
    } catch (error) {
      /* empty */
    } finally {
      setLoading(false);
    }
  }, [
    connectedUser?.name,
    updateUser,
    image,
    editPhoto,
    wallet,
    userData.name,
  ]);

  return (
    <div className="size-full min-h-[calc(100vh-80px)] px-3 pt-12 lg:px-0">
      <div className="mx-auto w-full max-w-[580px]">
        <button
          onClick={() =>
            router.push(`/profile/${wallet?.publicKey?.toBase58()}`)
          }
          className="flex items-center"
        >
          <ArrowBack />
          <span className="ml-2 text-2xl font-medium text-white">
            Edit Profile
          </span>
        </button>
        <div className="mt-8">
          <div className="mx-auto w-fit">
            <ImageUpload
              currentImage={image}
              stringImage={connectedUser?.image.trim()}
              onUpload={(file) => {
                const maxSize = 1 * 1024 * 1024;
                if (file && file.size > maxSize) {
                  Toast.show({
                    title: 'Image must be less than 1MB',
                    description: 'Image must be less than 1MB',
                    type: 'error',
                  });
                  return;
                }
                setImage(file);
              }}
              onRemove={onRemoveImage}
              size={100}
              index={0}
            />
          </div>
          <InputField
            value={connectedUser?.name}
            onChange={(e) =>
              connectedUser &&
              setConnectedUser({ ...connectedUser, name: e.target.value })
            }
            label="Username"
            placeholder="CgMak...o4m1j"
          />
          <Button
            loading={loading}
            disabled={!connectedUser?.name}
            onClick={onSubmit}
            size="large"
            color="gold"
            className="mt-7 w-full rounded-[1px] font-medium"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
