import React from "react";
import { useTranslation } from 'react-i18next'; // Step 1: Import useTranslation

const Footer = () => {
  const { t } = useTranslation('footer');

  return (
    <footer className="fixed bottom-0 w-full bg-black text-white text-center py-4 [font-family:'Inria_Serif',Helvetica] z-50">
      <p className="font-normal text-sm">
        © CareCycle 2024 | {t('footer:privacyPolicy')} | {t('footer:termsOfUse')}
      </p>
    </footer>
  );
};

export default Footer;
