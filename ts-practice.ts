const myFunc = () => {
  return 12;
};

type myFuncType = ReturnType<typeof myFunc>;

const makeQuery = (
  url: string,
  options?: {
    method?: string;
    headers?: { [key: string]: string };
    body?: string;
  }
) => {};

type MakeQueryParameters = Parameters<typeof makeQuery>;

const testingFrameworks = {
  vitest: {
    label: "Vitest",
  },
  jest: {
    label: "Jest",
  },
};

type TestingFramework = keyof typeof testingFrameworks;
