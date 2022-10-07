import renderer from "react-test-renderer";
import { expect, test } from "vitest";

import Block from "lib/pages/block/index";

const toJson = (component: renderer.ReactTestRenderer) => {
  const result = component.toJSON();
  expect(result).toBeDefined();
  return result as renderer.ReactTestRendererJSON;
};

test("Home", () => {
  const component = renderer.create(<Block />);
  const tree = toJson(component);
  expect(tree).toMatchSnapshot();
});
