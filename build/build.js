const { exec } = require('child_process')
const projects = process.argv.slice(2)

// 以同时构建一个项目的多个单页
projects.forEach(project => {
    let workerProcess = exec(
        `vue-cli-service build --project=${project}`,
        { maxBuffer: 1024 * 1024 * 10 },
        err => {
            if (err) {
                console.error(err)
            }
        }
    )
    workerProcess.stdout.on('data', function(data) {
        console.log(data)
    })
})
