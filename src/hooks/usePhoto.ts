import { useCallback, useMemo } from "react";
import {
  useCamera,
  availableFeatures,
} from "@capacitor-community/react-hooks/camera";
import { CameraResultType, CameraSource } from "@capacitor/core";

const base64ToBlob = (
  base64Data: string | undefined,
  imageFormat: string,
  sliceSize: number = 512
): Blob | undefined => {
  if (base64Data !== undefined) {
    const byteCharacters: string = atob(base64Data);
    const byteArrays: Uint8Array[] = [];

    for (
      let offset: number = 0;
      offset < byteCharacters.length;
      offset += sliceSize
    ) {
      const slice: string = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers: number[] = new Array(slice.length);

      for (let i: number = 0; i < slice.length; ++i) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      byteArrays.push(new Uint8Array(byteNumbers));
    }
    return new Blob(byteArrays, { type: `image/${imageFormat}` });
  }
  return undefined;
};

export function usePhoto() {
  const { photo, getPhoto } = useCamera();
  const takePhoto = useCallback(
    (source: CameraSource = CameraSource.Prompt) =>
      availableFeatures.getPhoto &&
      getPhoto({
        quality: 100,
        allowEditing: false,
        width: 256,
        height: 256,
        source: source,
        resultType: CameraResultType.Base64,
      }),
    [getPhoto]
  );
  const takePhotoFromCamera = useCallback(
    () => takePhoto(CameraSource.Camera),
    [takePhoto]
  );
  const takePhotoFromGallery = useCallback(
    () => takePhoto(CameraSource.Photos),
    [takePhoto]
  );

  return useMemo(
    () => ({
      photo,
      photoB64:
        photo && `data:image/${photo.format};base64,${photo.base64String}`,
      getPhotoBlob: () =>
        base64ToBlob(photo?.base64String, photo?.format || "png"),
      takePhoto,
      takePhotoFromCamera,
      takePhotoFromGallery,
    }),
    [photo, takePhoto, takePhotoFromCamera, takePhotoFromGallery]
  );
}
