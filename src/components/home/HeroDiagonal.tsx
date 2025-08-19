// components/home/HeroDiagonal.tsx
import Image from "next/image";

export default function HeroDiagonal({
  title,
  text,
  imgSrc,
}: {
  title: string;
  text: string;
  imgSrc: string;
}) {
  return (
    <section className="relative w-full overflow-hidden">
      <div className="grid md:grid-cols-2">
        {/* IMAGE À GAUCHE avec bord droit DIAGONAL */}
        <div
          className="
            relative h-[320px] sm:h-[420px] md:h-[720px]
            md:[clip-path:polygon(0_0,100%_0,75%_100%,0_100%)]
            will-change-[clip-path]
          "
        >
          <Image
            src={imgSrc}
            alt={title}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* TEXTE À DROITE */}
        <div className="relative bg-background flex items-center px-6 md:px-12 py-10">
          <div className="max-w-xl ml-0">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{title}</h1>
            <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
              {text}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
