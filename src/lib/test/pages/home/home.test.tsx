import renderer from "react-test-renderer";
import { expect, test } from "vitest";

import Home from "lib/pages/home/index";

const toJson = (component: renderer.ReactTestRenderer) => {
  const result = component.toJSON();
  expect(result).toBeDefined();
  return result as renderer.ReactTestRendererJSON;
};

test("Home", async () => {
  const component = renderer.create(<Home />);
  const tree = toJson(component);
  expect(tree).toMatchSnapshot();
});
