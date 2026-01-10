export function renameImageFile(imageFile: File, newName: string) {
  return new File([imageFile], `${newName}.${imageFile.type.split('/')[1]}`, {
    type: imageFile.type,
    lastModified: imageFile.lastModified,
  });
}
