import { useState } from 'react';
import { IconTrash } from '../Icons';

interface ImageUploadProps {
  currentImage: File | null;
  stringImage?: string;
  onUpload: (file: File | null) => void;
  onRemove: () => void;
  size?: number;
  index?: number;
}
export function ImageUpload({
  currentImage,
  onUpload,
  onRemove,
  stringImage,
  size = 100,
  index,
}: ImageUploadProps) {
  const [resetInput, setResetInput] = useState(false);
  const [hovered, setHovered] = useState(false);

  const handleRemove = () => {
    setResetInput(true);
    setTimeout(() => {
      setResetInput(false);
    }, 100);
    onRemove();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    // const maxSize = 1 * 1024 * 1024;
    // if (file && file.size > maxSize) {
    //   setResetInput(true);
    //   setTimeout(() => {
    //     setResetInput(false);
    //   }, 100);
    //   onUpload(null);
    //   return;
    // }
    if (file) {
      onUpload(file);
    }
  };

  return (
    <div className="relative">
      {!resetInput && (
        <input
          type="file"
          onChange={handleChange}
          accept="image/png"
          className="hidden"
          id={`image-upload-${index}`}
          name={`image-upload-${index}`}
        />
      )}
      <label
        htmlFor={`image-upload-${index}`}
        className="flex size-24 cursor-pointer flex-col items-center justify-center rounded-[1px] bg-white/10 transition-colors"
        style={{
          width: `${size}px`,
          height: `${size}px`,
        }}
      >
        {currentImage || stringImage ? (
          <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="relative size-full"
          >
            <img
              src={
                currentImage ? URL.createObjectURL(currentImage) : stringImage
              }
              alt="Upload preview"
              className="size-full rounded-[1px] object-cover"
            />
            {hovered && (
              <button
                type="button"
                className="absolute inset-0 z-50 flex items-center justify-center rounded-[1px] bg-black/50 text-white"
                onClick={handleRemove}
              >
                <IconTrash />
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13.5 4.5C13.0425 4.5 12.6225 4.2375 12.4125 3.8325L11.8725 2.745C11.5275 2.0625 10.6275 1.5 9.8625 1.5H8.145C7.3725 1.5 6.4725 2.0625 6.1275 2.745L5.5875 3.8325C5.3775 4.2375 4.9575 4.5 4.5 4.5C2.8725 4.5 1.5825 5.8725 1.6875 7.4925L2.0775 13.6875C2.1675 15.2325 3 16.5 5.07 16.5H12.93C15 16.5 15.825 15.2325 15.9225 13.6875L16.3125 7.4925C16.4175 5.8725 15.1275 4.5 13.5 4.5ZM7.875 5.4375H10.125C10.4325 5.4375 10.6875 5.6925 10.6875 6C10.6875 6.3075 10.4325 6.5625 10.125 6.5625H7.875C7.5675 6.5625 7.3125 6.3075 7.3125 6C7.3125 5.6925 7.5675 5.4375 7.875 5.4375ZM9 13.59C7.605 13.59 6.465 12.4575 6.465 11.055C6.465 9.6525 7.5975 8.52 9 8.52C10.4025 8.52 11.535 9.6525 11.535 11.055C11.535 12.4575 10.395 13.59 9 13.59Z"
                fill="#A1A7BB"
              />
            </svg>
          </div>
        )}
      </label>
    </div>
  );
}
