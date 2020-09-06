# proxy-checker-cli
Simple utility which is designed to accept a file of ip:port lines and to produce beautiful table of check results in terminal and to write the file with proxies which passed the checks successfully. Processes proxies concurrently (20 threads are running at the same time by default) so can be used for quite large files without overloading the server resources.

## Installation
```
npm i -g proxy-checker-cli
```

## Example usage:

```proxy-checker-cli listofproxies.txt --code=20. -o goodproxies.txt  --url=https://google.com```

Which will get proxies from `listofproxies.txt` file, try to request https://google.com and check that reply http code is 20x


## Proxy tests included out of the box:
- Expected http code ( --code=200 ) - regex supported
- Expected text in body ( --text=sometext )
- Expected no specified text in body ( --notext=error )


## Arguments list:
```
  --input file                       The input file to process. The file is expected to        
                                     contain ip:port lines without protocol specified. This is 
                                     a default argument.                                       
  -o, --output file                  Output good ips to txt file.                              
  -v, --verbose                      Turn on debug output.                                     
  -s, --silent                       Do not output visual table, only write result to files.   
  -h, --help                         Print this usage guide.                                   
  -t, --timeout number               Number of seconds to wait for connection to proxy and for 
                                     the whole request.                                        
  -p, --protocol string              Protocol to append to proxy ip (the file is expected to   
                                     contain ip:port lines without protocol specified).        
  -u, --url string                   Url to connect to validate proxy.                         
  --text string                      Text expected in body to validate proxy.                  
  --notext string                    Text expected to not exist in body to validate proxy.     
  --code string                      Http code expected for test to succeed.                   
  -c, --concurrency integer          Maximum Concurrency threads (default: 20)                 
  --user-agent string                User agent to use for http(s) connections to tested       
                                     websites.                                                 
  --header headername: headervalue   Header to attach to request for http(s) connections to    
                                     tested websites. Accepts multiple args.                   
```  
  
## Sample output to terminal:
<img width="1069" alt="Screenshot 2020-09-06 at 22 39 25" src="https://user-images.githubusercontent.com/775507/92332935-313a0980-f092-11ea-8b9a-2e34f01bf0a2.png">
