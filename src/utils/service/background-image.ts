import {StorageObjectManager} from '@/utils/extend/browser/storage-object';

export function googleDriveShareImageToPublicUrl(url: string) {
  const match = url.match(/https:\/\/drive\.google\.com\/file\/d\/([^\/]+)/);

  if (match) {
    return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w1000`;
  } else {
    return url;
  }
}

interface BackgroundSetting {
  image: string;
  opacity: number;
}

export const backgroundImageManager = new StorageObjectManager<BackgroundSetting>({
  key: 'background-setting',
  storage: 'LOCAL_STORAGE',
  defaultValue: {
    image: '',
    opacity: 0.9
  }
});
