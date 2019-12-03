import requests


def upload_file(host='silencew.cn', files=[]):
    file_dict = {}
    for file in files:
        file_data = {
            "file": open(file, "rb")
        }
        headers = {
            "Accept": "*/*",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "zh-CN,zh;q=0.9",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "Content-Length": "70604",
            "Host": "localhost:3000",
            "Origin": 'localhost:3000',
            "Pragma": "no-cache",
            "Referer": 'localhost:3000',
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.87 Safari/537.36"}
        result = requests.post("http://" + host + "/upload", files=file_data, headers=headers)
        file_dict[file] = 'http://' + host + result.json()['filename']
    return file_dict

print(upload_file(files=['app.js']))
