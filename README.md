# proxy-checker-cli
Simple utility which is designed to accept a file of ip:port lines and to produce beautiful table of check results in terminal and to write the file with proxies which passed the checks successfully.

Example usage:

```node test.js listofproxies.txt --code=20. -o goodproxies.txt  --url=https://google.com```

Which will get proxies from `listofproxies.txt` file, try to request https://google.com and check that reply http code is 20x

Full list of options is available via `test.js --help`

Checks included out of the box:
- Expected http code ( --code=200 ) - regex supported
- Expected text in body ( --text=sometext
- Expected no specified text in body ( --notext=error )


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
