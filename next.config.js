/** @type {import('next').NextConfig} */
const isGitHubPages = process.env.GITHUB_PAGES === 'true';
const repoName = process.env.GITHUB_REPO_NAME || '';

const nextConfig = {
  // Static HTML export compatible with GitHub Pages, Vercel, and Netlify
  output: 'export',

  // For GitHub Pages under https://<username>.github.io/<repository-name>/
  // Set GITHUB_PAGES=true and GITHUB_REPO_NAME="<repository-name>" in your CI/CD environment.
  // For custom domains (e.g., https://linkvaultme.com), omit basePath and assetPrefix.
  basePath: isGitHubPages && repoName ? `/${repoName}` : '',
  assetPrefix: isGitHubPages && repoName ? `/${repoName}/` : '',

  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

module.exports = nextConfig;
