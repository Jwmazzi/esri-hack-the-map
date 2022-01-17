import { React } from 'jimu-core';
import { Toast, ToastType } from 'jimu-ui';
import './index.css';

export default ({ toastText }: { toastText: string }) => {
  return <Toast type={ToastType.Info} open={!!toastText} text={toastText} className="hack-toast-message"></Toast>;
};
