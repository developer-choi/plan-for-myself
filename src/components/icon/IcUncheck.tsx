import {IcCheckProps} from '@/components/icon/IcCheck';

export default function IcUncheck({square = 20, ...rest}: IcCheckProps) {
  return (
    <svg width={square} height={square} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...rest}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10 16.9271C13.8257 16.9271 16.9271 13.8257 16.9271 10C16.9271 6.17429 13.8257 3.07293 10 3.07293C6.17429 3.07293 3.07293 6.17429 3.07293 10C3.07293 13.8257 6.17429 16.9271 10 16.9271ZM10 17.9167C14.3723 17.9167 17.9167 14.3723 17.9167 10C17.9167 5.62776 14.3723 2.08334 10 2.08334C5.62776 2.08334 2.08334 5.62776 2.08334 10C2.08334 14.3723 5.62776 17.9167 10 17.9167Z"
        fill="#DBDBDB"
      />
    </svg>
  );
}
