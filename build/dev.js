const { exec } = require('child_process')
let projects = process.argv.slice(2)
let param = ''
// projects [ 'projectName1', , 'projectName2', '--proxy=sit' ]
projects = projects.filter(project => {
    if (project.slice(0, 2) !== '--') {
        // 开头不等于-- 的才是想要启动的项目名
        return true
    }
    // 否则是传入的参数
    param += ` ${project}`
})

projects.forEach(project => {
    // maxBuffer <number> stdout 或 stderr 允许的最大字节数。如果超过限制，则子进程会终止。参见 maxBuffer与Unicode。默认为 200*1024
    // 启动一个项目下的多个单页
    console.log('===>', 'vue-cli-service serve --project=' + project + param)
    let workerProcess = exec(
        'vue-cli-service serve --project=' + project + param,
        {
            maxBuffer: 1024 * 1024 * 10 * 10
        },
        err => {
            if (err) {
                console.error(err)
            }
        }
    )
    workerProcess.stdout.on('data', function(data) {
        // 输出启动日志
        console.log(data)
    })
})
