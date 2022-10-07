import renderer from "react-test-renderer";
import { expect, test } from "vitest";

import Address from "lib/pages/address/index";

const toJson = (component: renderer.ReactTestRenderer) => {
  const result = component.toJSON();
  expect(result).toBeDefined();
  return result as renderer.ReactTestRendererJSON;
};

test("Home", () => {
  const component = renderer.create(<Address />);
  const tree = toJson(component);
  expect(tree).toMatchSnapshot();
});
