// src/app/(auth)/layout.tsx
import { FC, ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout: FC<AuthLayoutProps> = ({ children }) => {
  return (
    <main className="min-h-[calc(80vh-64px)] flex flex-col justify-center items-center">
      <div className="p-10 rounded-md bg-gradient-to-b from-orange-100 via-orange-200 to-orange-300 border border-orange-300/60 shadow-lg">
        {children}
      </div>
    </main> 
  );
};

export default AuthLayout;
