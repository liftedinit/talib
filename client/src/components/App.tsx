import { useQuery } from "react-query";

function App() {
  const blockInfo = useQuery(["blockInfo"], async () =>
    (await fetch("/api/block_info")).json()
  );

  return (
    <>
      <h1>Talib</h1>
      <pre>{blockInfo.data && JSON.stringify(blockInfo.data, null, 2)}</pre>
    </>
  );
}

export default App;
