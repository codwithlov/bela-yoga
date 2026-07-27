'use client';

import { useEffect } from 'react';
import { initFirebaseAnalytics } from '@/lib/firebase';

const FirebaseAnalytics: React.FC = () => {
  useEffect(() => {
    void initFirebaseAnalytics();
  }, []);

  return null;
};

export default FirebaseAnalytics;
