// doc: https://developer.github.com/v3/issues/#list-repository-issues
// https://octokit.github.io/rest.js/v18#issues-list-for-repo

import { Octokit } from "@octokit/rest";
import { to } from "await-to-js";
import filenamify from "filenamify";
import { writeFile } from "fs";
import moment from "moment";
import { promisify } from "util";
import { TOKEN } from "./sec";
import { IIssue } from "./types";

const r = promisify(writeFile);

const REPO = "wayou.github.io";
// const REPO = "format-copied-curl";
const OWNER = "wayou";
const SIZE = 100

const octokit = new Octokit({
  auth: TOKEN,
});

async function write(issues: IIssue[]) {
  const jobs = issues
    .filter((i) => !i.pull_request)
    .map((issue) => {
      const fileName = filenamify(
        `${issue.created_at.split("T")[0]}-${issue.title}.md`,{
          replacement:'-'
        }
      );
      const date = moment(issue.created_at).format("YYYY-MM-DD HH:MM:SS +0800");
      const categories = issue.labels.map((l) => l.name).join(" ");
      const title =issue.title.replace(/"/g,"\\\"");
      const frontMatter = `---
layout: post
title: "${title}"
date: ${date}
tags: ${categories}
---
    `;
      const content = `${frontMatter}
${issue.body}
    `;

      console.log(`writting ${issue.number}`);
      return r(`./_posts/${fileName}`, content);
    });
  return Promise.all(jobs);
}

async function loadIssues(page = 1) {
  console.log(`loading page ${page}`);
  const [err, res] = await to(
    octokit.issues.listForRepo({
      owner: OWNER,
      repo: REPO,
      state: "open",
      sort: "created",
      per_page: SIZE,
      page,
    })
  );
  if (err) {
    console.log(`loading page ${page} error`);
    throw err;
  }
  const issues = <IIssue[]>res?.data;
  console.log(`loading page ${page} done,issue count: ${issues?.length}`);

  await write(issues);
  if (issues?.length === SIZE) {
    await loadIssues(page + 1);
  }
}

loadIssues();
