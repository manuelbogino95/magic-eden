import { fetchNfts } from "@/lib/fetchNfts";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { ItemBox } from "./components";
import { Spinner } from "@/components/ui/Spinner";
import { Input } from "@/components/ui/Input";
import _debounce from "lodash.debounce";

export function NftList() {
  const { ref, inView } = useInView();
  const [filter, setFilter] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [filteredData, setFilteredData] = useState<NFT[]>([]);

  const { status, data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(
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
    if (inView && !filter) {
      fetchNextPage();
    }
  }, [inView, filter]);

  const debounceFilter = useCallback(_debounce(setFilter, 1000), []);

  function handleChange({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) {
    setInputValue(value);
    debounceFilter(value);
  }

  useEffect(() => {
    if (data) {
      const flattenedData = data.pages.flatMap((page) => page.results);
      const filteredItems = flattenedData.filter((item) =>
        item.title.toLowerCase().includes(filter.toLowerCase())
      );
      setFilteredData(filteredItems);
    }
  }, [data, filter]);

  return (
    <main className="p-8 flex min-h-screen flex-col items-center justify-between md:p-24">
      {status === "loading" ? (
        <Spinner />
      ) : (
        <div>
          <div className="w-full md:w-96">
            <Input
              value={inputValue}
              placeholder="Search nft name"
              onChange={handleChange}
            />
          </div>
          <div className="grid grid-cols-1 gap-5 mt-8 md:grid-cols-2 md:gap-6 lg:grid-cols-4 lg:gap-10">
            {filteredData.map((item) => (
              <ItemBox key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}
      <div ref={ref} />
      {isFetchingNextPage ? <Spinner /> : null}
    </main>
  );
}
