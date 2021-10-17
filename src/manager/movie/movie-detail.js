import puppeteer from 'puppeteer'
import useProxy from 'puppeteer-page-proxy'

export default class MovieDetail {
    constructor(url) {
        this.url = url
    }

    async getMovieInfo(callback) {
        const browser = await puppeteer.launch({
            args: [
                '--disable-setuid-sandbox',
                '--no-sandbox',
                '--ignore-certificate-errors',
                '--remote-debugging-port=9222',
                '--disable-web-security'
            ],
            ignoreHTTPSErrors: true,
            headless: true,
            // executablePath: "/usr/bin/google-chrome"
        })
        const proxy = 'http://0.0.0.0:8080'
        const page = await browser.newPage()
        await page.setUserAgent('Mozilla/5.0 (Macintosh Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36')
        await page.setRequestInterception(true)
        page.on('request', req => {
            if (req.resourceType() === 'image' || req.resourceType() === 'stylesheet') {
                req.abort()
                return
            }
            if (req.url() === 'https://www.dandanzan.cc/url.php') {
                console.log(req._url, req._postData)
                useProxy(req, proxy)
                if (callback) {
                    callback({ url: req._url, postData: req._postData })
                }
            } else {
                req.continue()
            }
        })
        await page.goto(this.url)
        await page.close()
        await browser.close()
    }
}
