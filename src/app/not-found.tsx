import Link from "next/link";

export default function NotFound() {
  return (
    <div className="absolute top-1/2 left-1/2 z-[60] w-[min(24rem,calc(100%-2rem))] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-[#303030] p-6 text-center text-white shadow-2xl ring-1 ring-white/10">
      <p className="text-lg font-medium">Essa página não existe</p>
      <Link href="/" className="mt-4 inline-block text-sm text-[#ffb399] hover:underline">
        Voltar à área de trabalho
      </Link>
    </div>
  );
}
