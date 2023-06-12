import { Injectable } from '@nestjs/common'
import { CreateBillDto } from './dto/create-bill.dto'
import { UpdateBillDto } from './dto/update-bill.dto'

import xlsx from 'node-xlsx'
import { gbkToUtf8 } from 'src/utils'
import * as path from 'path'
import * as fs from 'fs'
import * as iconv from 'iconv-lite'

@Injectable()
export class BillService {
  async getAlipayBill() {
    const filepath = path.join(__dirname, '..', '..', 'src', 'data')
    const filename = `alipay_record_20230608_1008_1.csv`
    const newFilename = filename.split('.csv')[0] + '_content.csv'

    const buffer = fs.readFileSync(filepath + '/' + filename)
    // 获得正常的字符串，没有乱码
    const str = iconv.decode(buffer, 'GBK')
    const billContent = str.split(/\-+(交易记录明细列表)?\-+\r?\n/)[2]
    fs.writeFileSync(filepath + '/' + newFilename, billContent)
    var list = xlsx.parse(iconv.encode(billContent, 'utf8'))
    // list[0]为Sheet1
    const data = [...list[0].data]
    const arr = []
    for (let i = 1; i < data.length; i++) {
      if (data[i][14] !== 0) {
        const type = iconv.decode(data[i][6], 'GBK').split('\t')[0]
        const param = {
          id: data[i][1],
          type: type,
          value: data[i][14],
        }
        arr.push(param)
      }
    }
    const dataJson = JSON.stringify(arr)
    fs.writeFileSync(`dataJson.json`, `${dataJson}`)
    return data
  }

  create(createBillDto: CreateBillDto) {
    return 'This action adds a new bill'
  }

  findAll() {
    return `This action returns all bill`
  }

  findOne(id: number) {
    return `This action returns a #${id} bill`
  }

  update(id: number, updateBillDto: UpdateBillDto) {
    return `This action updates a #${id} bill`
  }

  remove(id: number) {
    return `This action removes a #${id} bill`
  }
}
