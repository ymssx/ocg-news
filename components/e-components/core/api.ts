import { Octokit } from '@octokit/core';
import { getAuth } from './auth';

const owner = 'ymssx';
const repo = 'ocg-news';

const getOctokit = () => {
  const { token } = getAuth();
  return new Octokit({
    auth: token,
  });
}

export function createPackage(name: string, content?: { list: string[] }) {
  
  const data = {
    name,
    content,
  };
  
  return getOctokit().request('POST /repos/{owner}/{repo}/dispatches', {
    owner,
    repo,
    event_type: 'CREATE_PACKAGE',
    client_payload: {
      unit: false,
      integration: true,
      ...data,
    },
    headers: {
      'X-GitHub-Api-Version': '2022-11-28'
    }
  })
}

export function updatePackage(data) {
  return getOctokit().request('POST /repos/{owner}/{repo}/dispatches', {
    owner,
    repo,
    event_type: 'UPDATE_PACKAGE',
    client_payload: {
      ...data,
    },
    headers: {
      'X-GitHub-Api-Version': '2022-11-28'
    }
  })
}

export function updateData(path: string, content: { name: string; data: string }) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(content);
    }, 1000);
  });
}