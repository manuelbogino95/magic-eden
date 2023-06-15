import { fetchNfts } from "@/lib/fetchNfts";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Fragment, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { ItemBox } from "./components";

export function NftList() {
  const { ref, inView } = useInView();

  const { status, data, fetchNextPage } = useInfiniteQuery(
    ["nfts"],
    async ({ pageParam = 0 }) => {
      return fetchNfts(pageParam);
    },
    {
      getNextPageParam: (lastPage, pages) => {
        return pages.length * 20;
      },
    }
  );

  useEffect(() => {
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
            <Fragment key={`page-${index}`}>
              {page.results.map((item) => (
                <ItemBox key={item.id} item={item} />
              ))}
            </Fragment>
          ))}
        </div>
      )}
      <div ref={ref} />
    </main>
  );
}
