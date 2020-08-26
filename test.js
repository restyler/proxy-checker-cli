const ProxyAgent = require('simple-proxy-agent');
const request = require('./request.js')
const fs = require('fs');
const Table = require('cli-table3');
const colors = require('colors');
const commandLineArgs = require('command-line-args')
const commandLineUsage = require('command-line-usage')

const allowedProtocols = ['http', 'https', 'socks5']
const urlPresets = {
  instagram: 'https://www.instagram.com/graphql/query/?query_hash=e769aa130647d2354c40ea6a439bfc08&variables=%7B%22id%22%3A%221226157729%22%2C%22first%22%3A%221%22%2C%22after%22%3A%22%22%7D',
  avito: 'https://www.avito.ru/samara?q=%D0%B4%D0%B8%D0%B2%D0%B0%D0%BD',
  ifconfig: 'https://ifconfig.me/'
}

const optionDefinitions = [
  { name: 'verbose', alias: 'v', type: Boolean },
  { name: 'silent', alias: 's', type: Boolean, defaultValue: false },
  { name: 'help', alias: 'h', type: Boolean },
  { name: 'output', alias: 'o', type: String },
  { name: 'input', type: String, defaultOption: true },
  { name: 'timeout', alias: 't', type: Number, defaultValue: 5 },
  { name: 'protocol', alias: 'p', type: String, defaultValue: allowedProtocols[1] },
  { name: 'url', alias: 'u', type: String, defaultValue: urlPresets.ifconfig },
  { name: 'text', type: String },
  { name: 'notext', type: String },
  { name: 'code', type: String }
]


const options = commandLineArgs(optionDefinitions)

//console.log(options);return;

const sections = [
  {
    header: 'Simple & fast proxy checker',
    content: 'Gets proxy list from file and tests them via set of checks, logging time and response result.\n Usage: `test.js ips.txt -t 10`'
  },
  {
    header: 'Options',
    optionList: [
      {
        name: 'input',
        typeLabel: '{underline file}',
        description: 'The input file to process. The file is expected to contain ip:port lines without protocol specified. This is a default argument.'
      },
      {
        name: 'output',
        typeLabel: '{underline file}',
        description: 'Output good ips to txt file.'
      },
      {
        name: 'help',
        description: 'Print this usage guide.'
      },
      {
        name: 'protocol',
        description: 'Protocol to append to proxy ip (the file is expected to contain ip:port lines without protocol specified).'
      },
      {
        name: 'url',
        description: 'Url to connect to validate proxy.'
      },
      {
        name: 'text',
        description: 'Text expected in body to validate proxy.'
      },
      {
        name: 'notext',
        description: 'Text expected to not exist in body to validate proxy.'
      },
      {
        name: 'code',
        description: 'Http code expected for test to succeed.'
      },
      {
        name: 'silent',
        description: 'Do not output visual table, only write result to files'
      }
    ]
  }
]

let r = new RegExp(options.code);


if (options.help) {
  const usage = commandLineUsage(sections)
  console.log(usage)
  return
}

if (!options.input) {
  console.error('Input file with ips is required. Try --help')
  return
}

if (!allowedProtocols.includes(options.protocol)) {
  console.error('Allowed protocols: ', allowedProtocols)
  return
}

if (!fs.existsSync(options.input)) {
  console.error('Input file does not exist!')
  return
}

if (options.silent) {
  options.verbose = false;
}


const url = urlPresets[options.url] ? urlPresets[options.url] : options.url


var lines = fs.readFileSync(options.input, 'utf8').split('\n');

let agents = [];
let promises = [];

let startMs = Date.now();

for (i = 0; i<lines.length; i++) {
  let proxyName = lines[i];

  agents[i] = ProxyAgent(options.protocol + '://' + lines[i], {
    timeout: options.timeout * 1000,
    tunnel: true
  });
  console.time(proxyName);
  
  promises[i] = new Promise((resolve, reject) => {
    let res = {};
    res.name = proxyName;
    if (options.verbose) {
      console.log('Queueing %s', proxyName);
    }

    return request(url, {agent: agents[i], timeout: options.timeout}, options.timeout).then(async resp => { 
      res.success = true;
      let response = (await resp.text());
      if (options.verbose) {
        console.log('Received response from %s', proxyName);
      }

      if (options.code) {
        let r = new RegExp('/' + options.code + '/');
        if (r.test(resp.status)) {
          res.success = false;
          res.error = 'Bad code:' + resp.status;
        }
      }

      if (options.text) {
        if (!response.includes(options.text)) {
          res.success = false;
          res.error = 'Expected text not found';
        }
      }

      if (options.notext) {
        if (response.includes(options.notext)) {
          res.success = false;
          res.error = 'Not expected text found';
        }
      }
      res.response = response.substring(0, 30).trim();
    }).catch(err => {
      res.success = false;
      res.error = err.message.substring(0, 30).trim();
      if (options.verbose) {
        console.log('Failed response from %s', proxyName);
      }
    }).finally(() => { 
      res.time = ((Date.now() - startMs)/1000).toFixed(1);
      resolve(res);
    });
  });
}


Promise.all(promises).then((results) => {

  if (!options.silent) {
    let table = new Table({style: {head: ['cyan']}, head: [
      'Proxy', 'Result', 'Time', 'Resp'
    ]});
    results.map((item) => {
      table.push([
        item.name,
        item.success ? colors.green('TRUE') : colors.red('FALSE'),
        item.time,
        item.success ? item.response : colors.red(item.error)
  
      ]);
    })
    console.log(table.toString());
  }
  

  if (options.output) {
    let file = fs.createWriteStream(options.output);
    let good = 0;

    file.on('error', function(err) { /* error handling */ })
    results.forEach(function(v) {
      if (v.success) {
        good++
        file.write(v.name + '\n')
      }
    })
    file.end();

    if (options.verbose) {
      console.log('Written %d good proxies out of %d to %s', good, results.length, options.output);
    }
  }
});