// src/app/(public)/reset-password/page.tsx
import RequestForm from "@/components/auth/RequestResetForm";
import ConfirmForm from "@/components/auth/ConfirmResetForm";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; email?: string }>;
}) {
  const { token, email } = await searchParams;

  return (
    <main className="min-h-[calc(80vh-64px)] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-xl border bg-white p-6 shadow-sm">
        {!token || !email ? (
          <>
            <h1 className="text-xl font-semibold mb-4">Réinitialiser le mot de passe</h1>
            <RequestForm />
          </>
        ) : (
          <>
            <h1 className="text-xl font-semibold mb-4">Définir un nouveau mot de passe</h1>
            <ConfirmForm token={token} email={email} />
          </>
        )}
      </div>
    </main>
  );
}
