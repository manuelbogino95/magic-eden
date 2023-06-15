import { formatCurrencyUSD } from "@/lib/helpers";
import Image from "next/image";

export function ItemBox({ item: { id, title, img, price } }: { item: NFT }) {
  return (
    <div key={id} className="group">
      <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
        <Image
          src={img}
          width={200}
          height={200}
          alt=""
          className="h-full w-full object-cover object-center group-hover:opacity-75"
        />
      </div>
      <h3 className="mt-4 text-sm">{title}</h3>
      <p className="mt-1 text-lg font-medium">{formatCurrencyUSD(price)}</p>
    </div>
  );
}
