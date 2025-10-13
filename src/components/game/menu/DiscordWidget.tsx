// src/components/game/menu/DiscordWidget.tsx
import Link from "next/link";

export default function DiscordWidget({
  serverId,
  inviteUrl,
  theme = "dark",
  title = "Rejoindre le Discord du BDE",
  description = "Actus, entraide, events, et bonne ambiance — rejoins la communauté !",
}: {
  serverId: string;              // Active "Server Widget" dans Paramètres serveur > Widget
  inviteUrl?: string;            // Lien d’invitation permanent (discord.gg/...)
  theme?: "dark" | "light";
  title?: string;
  description?: string;
}) {
  return (
    <section className="mt-8 rounded-lg border bg-card">
      <div className="p-4 sm:p-5 border-b">
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>

      <div className="p-4 sm:p-5">
        <div className="rounded-md overflow-hidden border">
          <iframe
            title="Discord Widget"
            src={`https://discord.com/widget?id=${encodeURIComponent(serverId)}&theme=${theme}`}
            width="100%"
            height="420"
            allowTransparency
            sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
          />
        </div>

        {inviteUrl && (
          <div className="mt-4">
            <Link
              href={inviteUrl}
              target="_blank"
              className="inline-flex items-center rounded-md bg-amber-600 px-3 py-2 text-white hover:bg-amber-700"
            >
              Rejoindre le serveur
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
