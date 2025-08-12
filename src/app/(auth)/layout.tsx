import { FC, ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout: FC<AuthLayoutProps> = ({ children }) => {
  return (
    <main className="min-h-[calc(100vh-64px)] flex flex-col justify-center items-center">
      <div className="bg-slate-200 p-10 rounded-md">{children}</div>
    </main> 
  );
};

export default AuthLayout;
