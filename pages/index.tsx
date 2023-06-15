import Image from "next/image";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import { FixedSizeGrid as Grid } from "react-window";

interface NFT {
  id: string;
  title: string;
  img: string;
  price: number;
}

interface ApiResponse<T> {
  results: T[];
}

function ItemBox({ item: { id, title, img, price } }: { item: NFT }) {
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
      <p className="mt-1 text-lg font-medium">{price}</p>
    </div>
  );
}

export default function Home() {
  const { ref, inView } = useInView();

  const { status, data, fetchNextPage } = useInfiniteQuery(
    ["nfts"],
    async ({ pageParam = 0 }) => {
      const res = await axios.get<ApiResponse<NFT>>(
        `https://api-mainnet.magiceden.io/idxv2/getListedNftsByCollectionSymbol?collectionSymbol=okay_bears&limit=20&offset=${pageParam}`
      );
      return res.data;
    },
    {
      getNextPageParam: (lastPage, pages) => {
        return pages.length * 20;
      },
    }
  );

  React.useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {status === "loading" ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-4 lg:gap-10">
          {data?.pages.map((page, index) => (
            <React.Fragment key={`page-${index}`}>
              {page.results.map((item) => (
                <ItemBox key={item.id} item={item} />
              ))}
            </React.Fragment>
          ))}
        </div>
      )}
      <div ref={ref} />
    </main>
  );
}
