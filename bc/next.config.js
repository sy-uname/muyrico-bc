const createNextIntlPlugin = require('next-intl/plugin')

const withNextIntl = createNextIntlPlugin()

/** @type {import('next').NextConfig} */
const isDev = process.env.DEPLOY !== 'true';

const baseDomain = !isDev ? 'muyricocr.com' : 'webserver.local';
const baseProtocol = !isDev ? 'https' : 'http';

const mainSite = !isDev ? 'www.' : '';
const mainSrvPath = !isDev ? '' : '/muyrico';
const mainURL = mainSite + baseDomain;
const webSiteLink = baseProtocol + '://' + mainURL + mainSrvPath ;

const baseSite = !isDev ? 'bc.' : '';
const baseSrvPath = !isDev ? '' : '/muyricobc';
const baseURL = baseSite + baseDomain;
const baseFullURL = baseProtocol + '://' + baseURL + baseSrvPath ;

const nextConfig = {
  basePath: baseSrvPath,
  skipTrailingSlashRedirect: true,  // вместо trailingSlash: true
  env: {
    gtmId: !isDev ? 'GTM-TQ2WZFFW' : 'GTM-XXX',
    gaId: !isDev ? 'G-FMY13SC2L4' : 'G-TCQ8H0BX4G',
    hrefBaseUrl: baseFullURL,
    webSiteLink: webSiteLink,
    ourName: 'MUYRICOCR',
    ourNameOut: 'Muy Rico CR',
  },
  compiler: {
    styledComponents: true,
  },
}

module.exports = withNextIntl(nextConfig)
