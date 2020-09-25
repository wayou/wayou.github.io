export interface IIssue {
  /** 'https://api.github.com/repos/wayou/format-copied-curl/issues/6' */
  url: string;
  id: number;
  number: number;
  title: string;
  created_at: "2020-09-25T15:18:20Z";
  updated_at: "2020-09-25T15:18:20Z";
  labels: {
    name: string;
  }[];
  body: string;
  pull_request: object;
}
