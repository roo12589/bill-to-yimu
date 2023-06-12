import * as fs from 'fs'
import * as iconv from 'iconv-lite'

export const gbkToUtf8 = (filename: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const stream = fs.createReadStream(
      `${__dirname}/../../src/data/${filename}`,
      {
        encoding: 'binary',
      },
    )
    let data = ''
    stream.on('error', (err) => {
      console.error('读取行错误')
      console.error(err)
      reject(err)
    })
    stream.on('data', (item) => {
      data += item + '\n'
    })
    stream.on('end', () => {
      const buf = Buffer.from(data, 'binary')
      // 获得正常的字符串，没有乱码
      const str = iconv.decode(buf, 'GBK')
      const res = str.split(/\-+(交易记录明细列表)?\-+\r?\n/)[2]
      const newFilename = filename.split('.csv')[0] + '_utf8.csv'
      fs.writeFileSync(newFilename, res)
      resolve(newFilename)
    })
  })
}
