import Image from "next/image";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";

interface NFT {
  id: string;
  name: string;
  img: string;
  price: number;
}

interface ApiResponse<T> {
  results: T[];
}

export default function Home() {
  const { ref, inView } = useInView();

  const { status, data, fetchNextPage, fetchPreviousPage } = useInfiniteQuery(
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
                <Image
                  key={item.id}
                  src={item.img}
                  width={200}
                  height={200}
                  alt=""
                />
              ))}
            </React.Fragment>
          ))}
        </div>
      )}
      <div ref={ref} />
    </main>
  );
}
