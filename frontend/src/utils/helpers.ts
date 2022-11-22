import { ACCESS_TOKEN } from '@/utils/constants';
import jwt from 'jsonwebtoken';

export const sliceWalletAddress = (address: string, width = 10) => {
  return `${address.slice(0, width)}...${address.slice(-width + 5)}`;
};

export const getImageURL = (relativePath: string) => {
  return `${process.env.NEXT_PUBLIC_IMAGE_STORAGE}${relativePath}`;
};

export const checkItemBelongsToOwner = (itemOwnerId: string, ownerId?: string) => {
  try {
    if (!ownerId) {
      const accessToken = localStorage.getItem(ACCESS_TOKEN);
      const decodedToken = jwt.verify(
        accessToken || '',
        process.env.NEXT_PUBLIC_JWT_KEY || 'complexsecrethere'
      );
      return decodedToken.sub === itemOwnerId;
    }
    return ownerId === itemOwnerId;
  } catch (error) {
    return false;
  }
};
