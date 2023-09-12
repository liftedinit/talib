import { Code, Text } from "@liftedinit/ui";
import { Link } from "react-router-dom";

export function kvstorePut(data: any) {
  return {
    From: (
      <Code
        as={Link}
        to={`/addresses/${data.argument.owner}`}
        color="brand.teal.500"
      >
        {data.argument.owner}
      </Code>
    ),
    Key: (
      <Text as="span" color="brand.teal.500"> 
        {data.argument.key}
      </Text>
    ),
    Value: (  
      <Text as="span" color="brand.teal.500"> 
        {data.argument.value} 
      </Text> 
    ),
  };
}
