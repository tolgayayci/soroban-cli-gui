import Image from "next/image";

export default function Loading() {
  return (
    <div className="rounded-lg border mt-4 p-4 flex-grw flex flex-col items-center justify-center">
      <Image
        src="/images/soroban-light.svg"
        alt="Loading..."
        className="animate-pulse"
        width={70}
        height={70}
      />
    </div>
  );
}
