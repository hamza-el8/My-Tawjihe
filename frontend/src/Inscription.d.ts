import { FC } from 'react';

interface InscriptionProps {
  onClose?: () => void;
  onSwitchToLogin?: () => void;
  lang?: 'fr' | 'ar';
}

declare const Inscription: FC<InscriptionProps>;
export default Inscription;
