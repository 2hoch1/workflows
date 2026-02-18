import { Octokit } from "@octokit/core";
import dotenv from "dotenv";
dotenv.config();

const token = process.env.GITHUB_TOKEN;
if (!token) {
  console.error("Missing GITHUB_TOKEN env var.");
  process.exit(1);
}

const owner = process.env.GITHUB_OWNER;
const repo = process.env.GITHUB_REPO;
const author = process.env.GITHUB_AUTHOR;
const since = new Date(Date.now() - 1000 * 60 * 1000).toISOString();

if (!owner || !repo || !author) {
  console.error("Missing required env vars: GITHUB_OWNER, GITHUB_REPO, GITHUB_AUTHOR.");
  process.exit(1);
}

const octokit = new Octokit({ auth: token });

const searchQuery = `repo:${owner}/${repo} is:issue author:${author}`;

const { search } = await octokit.graphql(
  `query($searchQuery: String!) {
    search(type: ISSUE, query: $searchQuery, first: 1) {
      issueCount
    }
  }`,
  { searchQuery }
);

console.log(`Query: ${searchQuery}`);
console.log(`issueCount: ${search.issueCount}`);
