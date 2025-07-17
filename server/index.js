// server/index.js
const express = require('express')
const fs = require('fs')
const path = require('path')
const cors = require('cors')

const app = express()
const PORT = 3001

app.use(cors())
app.use(express.json())

// 저장할 파일 경로
const filePath = path.join(__dirname, 'boxes.json')

// ✅ 서버 시작 시 파일이 없으면 자동 생성
if (!fs.existsSync(filePath)) {
  fs.writeFileSync(filePath, '[]', 'utf8')
  console.log('✅ boxes.json 파일이 자동 생성되었습니다.')
}

// ✅ 저장 API
app.post('/save-boxes', (req, res) => {
  fs.writeFile(filePath, JSON.stringify(req.body, null, 2), (err) => {
    if (err) {
      console.error('❌ 파일 저장 실패:', err)
      return res.status(500).send('저장 실패')
    }
    res.send('저장 성공')
  })
})

// ✅ 불러오기 API
app.get('/load-boxes', (req, res) => {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('❌ 파일 읽기 실패:', err)
      return res.status(500).json([])
    }
    try {
      res.json(JSON.parse(data))
    } catch (parseErr) {
      console.error('❌ JSON 파싱 오류:', parseErr)
      res.status(500).json([])
    }
  })
})

// ✅ 서버 시작
app.listen(PORT, () => {
  console.log(`🚀 서버가 http://localhost:${PORT} 에서 실행 중입니다.`)
})
