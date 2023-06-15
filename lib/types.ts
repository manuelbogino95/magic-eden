interface NFT {
  id: string;
  title: string;
  img: string;
  price: number;
}

interface ApiResponse<T> {
  results: T[];
}
