import BlockList from "lib/components/blocklist/BlockList";
import BlockNetworkInformation from "lib/components/blocknetwork/BlockNetworkInformation";
import SearchBar from "lib/layout/searchbar/SearchBar";

const BlocksList = () => {
  return (
    <>
      <SearchBar />
      <BlockNetworkInformation />
      <BlockList />
    </>
  );
};

export default BlocksList;
