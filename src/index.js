import * as http from "http"

const PORT = 8000

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

const sleep = async () => {
  return new Promise(resolve => setTimeout(resolve, getRandomInt(3)))
}

const doAsync = async (taskNum) => {
  await sleep()  
  console.log(`completed task ${taskNum}`)
}

const server = http.createServer(async (req, res) => {
  let body = ''
  req.on('data', chunk => {
    body += chunk
  })

  req.on('end', async () => {
    if (!req.complete) {
      throw Error('Error parsing request data')
    }

    const taskNum = JSON.parse(body).tasks ?? 0
    await [...Array(taskNum).keys()].forEach(async (taskNum) => {
      await doAsync(taskNum)
    })

    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({
      status: 'success',
      data: `Completed ${taskNum} tasks.`,
    }))
  })

})

server.listen(PORT, "127.0.0.1")
