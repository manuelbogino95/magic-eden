import axios from "axios";

// The API base url should be an environment variable
const API_BASE_URL =
  "https://api-mainnet.magiceden.io/idxv2/getListedNftsByCollectionSymbol?collectionSymbol=okay_bears";
const API_LIMIT = 20;

export async function fetchNfts(offset: number) {
  const res = await axios.get<ApiResponse<NFT>>(
    `${API_BASE_URL}&limit=${API_LIMIT}&offset=${offset}`
  );
  return res.data;
}
