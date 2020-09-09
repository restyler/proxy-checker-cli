'use strict';

const fetch = require('node-fetch')
const ProxyAgent = require('simple-proxy-agent')
const UserAgent = require('user-agents')

async function request(url, options, timeout = 5) {
  try {
    const res = await fetch(url, {
      ...options,
      timeout: timeout * 1000
    })
    if(!res.ok) {
      throw new Error('Invalid Response');
    }
    return res;
  } catch (err) {
    throw err;
  }
}

async function singleRequestExecute(url, proxyAddr, options) {
  return new Promise((resolve) => {
    let res = {};
    res.name = proxyAddr;
    res.startMs = Date.now();

    options.verboseLog('Queueing %s', proxyAddr)

    let agent = ProxyAgent(options.protocol + '://' + proxyAddr, {
      timeout: options.timeout * 1000,
      tunnel: true
    })

    let headers = {}
    if (typeof options['user-agent'] == 'undefined') {
      headers['user-agent'] = new UserAgent().toString()
    } else {
      headers['user-agent'] = options['user-agent']
    }
    
    if (typeof options.header !== 'undefined' && options.header.length) {
      options.header.forEach(elem => {
        let el = elem.split(':').map(e => e.trim())
        headers[el[0]] = el[1]
      });
    }

    request(url, {agent, timeout: options.timeout, headers }, options.timeout)
    .then(async (resp) => {
      res = await requestProcess(res, resp, options)
    })
    .catch(err => {
      res.success = false;
      res.error = err.message.substring(0, 30).trim();
      options.verboseLog('Failed response from %s', proxyAddr)
    }).finally(() => {
      res.time = ((Date.now() - res.startMs)/1000).toFixed(1);
      resolve(res);
    })
  })
}

async function requestProcess(res, response, options) {
  res.success = true;
  let responseText = (await response.text());
  options.verboseLog('Received response from %s, http code: %d', res.name, response.status)


  if (options.code) {
    
    let r = new RegExp(options.code);
    if (r.test(response.status)) {
      options.verboseLog('Code check for %s: success, http code: %d', res.name, response.status)
    } else {
      res.success = false;
      res.error = 'Bad code:' + response.status;
      options.verboseLog('Code check for %s: fail, http code: %d', res.name, response.status)
    }

    
  }

  if (options.text) {
    if (!responseText.includes(options.text)) {
      res.success = false;
      res.error = 'Expected text not found';
      options.verboseLog('Text check for %s: fail', res.name)
    } else {
      options.verboseLog('Text check for %s: success', res.name)
    }
  }

  if (options.notext) {
    if (responseText.includes(options.notext)) {
      res.success = false;
      res.error = 'Not expected text found'
      options.verboseLog('Notext check for %s: fail', res.name)
    } else {
      options.verboseLog('Notext check for %s: success', res.name)
    }
  }
  res.response = responseText.substring(0, 30).trim();

  return res;
}

module.exports = singleRequestExecute;