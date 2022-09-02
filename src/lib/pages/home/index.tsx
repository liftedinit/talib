import BlockList from "lib/components/blocklist/BlockList";
import BlockNetworkInformation from "lib/layout/blocknetwork/BlockNetworkInformation";
import SearchBar from "lib/layout/searchbar/SearchBar";

const Home = () => {
  return (
    <>
      <SearchBar />
      <BlockNetworkInformation />
      <BlockList />
    </>
  );
};

export default Home;
