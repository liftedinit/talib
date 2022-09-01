import BlockList from "lib/components/blocklist/BlockList";
import BlockNetworkInformation from "lib/layout/blocknetwork/BlockNetworkInformation";
import SeachBar from "lib/layout/searchbar/SearchBar";

const Home = () => {
  return (
    <>
      <SeachBar />
      <BlockNetworkInformation />
      <BlockList />
    </>
  );
};

export default Home;
