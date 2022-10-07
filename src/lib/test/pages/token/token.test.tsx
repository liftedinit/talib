import renderer from "react-test-renderer";
import { expect, test } from "vitest";

import Token from "lib/pages/token/index";

const toJson = (component: renderer.ReactTestRenderer) => {
  const result = component.toJSON();
  expect(result).toBeDefined();
  return result as renderer.ReactTestRendererJSON;
};

test("Home", () => {
  const component = renderer.create(<Token />);
  const tree = toJson(component);
  expect(tree).toMatchSnapshot();
});
