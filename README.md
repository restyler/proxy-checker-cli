# proxy-checker-cli
Simple utility which is designed to accept a file of ip:port lines and to produce beautiful table of check results in terminal and to write the file with proxies which passed the checks successfully. Processes proxies concurrently (20 threads are running at the same time by default) so can be used for quite large files without overloading the server resources.

## Installation
```
git clone https://github.com/restyler/proxy-checker-cli.git .
npm install
```

## Example usage:

```node test.js listofproxies.txt --code=20. -o goodproxies.txt  --url=https://google.com```

Which will get proxies from `listofproxies.txt` file, try to request https://google.com and check that reply http code is 20x

Full list of options is available via `test.js --help`

Checks included out of the box:
- Expected http code ( --code=200 ) - regex supported
- Expected text in body ( --text=sometext
- Expected no specified text in body ( --notext=error )


Options list:
```
  --input file                The input file to process. The file is expected to contain       
                              ip:port lines without protocol specified. This is a default      
                              argument.                                                        
  -o, --output file           Output good ips to txt file.                                     
  -v, --verbose               Turn on debug output.                                            
  -s, --silent                Do not output visual table, only write result to files.          
  -h, --help                  Print this usage guide.                                          
  -t, --timeout number        Number of seconds to wait for connection to proxy and for the    
                              whole request.                                                   
  -p, --protocol string       Protocol to append to proxy ip (the file is expected to contain  
                              ip:port lines without protocol specified).                       
  -u, --url string            Url to connect to validate proxy.                                
  --text string               Text expected in body to validate proxy.                         
  --notext string             Text expected to not exist in body to validate proxy.            
  --code string               Http code expected for test to succeed.                          
  -c, --concurrency integer   Maximum Concurrency threads (default: 20)    
```  
  
Sample output to terminal:
```
┌─────────────────────┬────────┬──────┬────────────────────────────────┐
│ Proxy               │ Result │ Time │ Resp                           │
├─────────────────────┼────────┼──────┼────────────────────────────────┤
│ 62.75.223.199:5836  │ FALSE  │ 7.4  │ request to https://www.google. │
├─────────────────────┼────────┼──────┼────────────────────────────────┤
│ 181.119.69.153:3128 │ FALSE  │ 9.0  │ request to https://www.google. │
├─────────────────────┼────────┼──────┼────────────────────────────────┤
│ 185.114.137.14:14   │ FALSE  │ 4.0  │ request to https://google.com/ │
├─────────────────────┼────────┼──────┼────────────────────────────────┤
│ 212.129.4.96:5836   │ TRUE   │ 4.5  │ <!doctype html><html itemscope │
├─────────────────────┼────────┼──────┼────────────────────────────────┤
│ 5.141.117.33:81     │ FALSE  │ 4.0  │ request to https://google.com/ │
├─────────────────────┼────────┼──────┼────────────────────────────────┤
│ 183.89.11.223:8080  │ FALSE  │ 4.0  │ request to https://google.com/ │
├─────────────────────┼────────┼──────┼────────────────────────────────┤
│ 80.90.80.54:8080    │ TRUE   │ 0.9  │ <!doctype html><html itemscope │
├─────────────────────┼────────┼──────┼────────────────────────────────┤
│ 213.137.240.243:81  │ TRUE   │ 0.9  │ <!doctype html><html itemscope │
├─────────────────────┼────────┼──────┼────────────────────────────────┤
│ 181.119.81.1:3128   │ FALSE  │ 4.3  │ request to https://google.com/ │
├─────────────────────┼────────┼──────┼────────────────────────────────┤
│ 123                 │ FALSE  │ 0.0  │ request to https://google.com/ │
└─────────────────────┴────────┴──────┴────────────────────────────────┘
```
