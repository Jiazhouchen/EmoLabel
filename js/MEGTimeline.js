
function getMEGContingency(sess, e) {
    const [type, n] = e.split('@')
    let runComp
    if (type === 'story') {
        const info = getStoryInfo(sess,n)
        console.log(info)
        runComp = [
            {
                type: jsPsychInfo,
                countDown: 0,
                majorMsg: 'Story: '+ info.pName,
                postMajor: 'Thank you for listening!',
                minorMsg: "Press 'enter' or 'space' to start listening.",
                audio: 'audio/'+info.name+'.wav',
            }
        ]

    }
    if (type === 'task') {
        runComp = MEGTaskContingency(window.MazeInfo,sess,n)
    }
    if (type === 'localizer') {
        runComp = [
            {

            }
        ]
    }
    return runComp
}

function MEGTaskContingency(MazeInfo, sess, n) {
    const config = allMEGConfig(sess, n)
    console.log(sess, n)
    let allProcedures = [];
    allProcedures.push({
        type: jsPsychRateEmotion,
        ShowEmo: true,
        emotion: "GoEmo",
        respType: 'key',
    })
    let ProcedureIndex = {
        'Maze': {easy:0, hard: 0},
        'Gamble': {easy:0, hard: 0},
        'Trust': {easy:0, hard: 0},
        'Math': {easy:0, hard: 0},
    }
    for (let x of config.order) {
        let taskIns = {
            'type': '',
            'difficulty': x.diff,
            'twist': x.twist,
        }
        switch (x.type) {
            case 'Maze':
                taskIns.type = jsPsychMaze
                taskIns.preset = config.MazeDiff[x.diff][ProcedureIndex[x.type][x.diff]]
                taskIns.reverse = x.twist==='true'
                taskIns.timeLimit = 10000
                taskIns.limit = 'time'
                break;
            case 'Math':
                taskIns.type = jsPsychMath
                break;
            case 'Trust':
                taskIns.type = jsPsychTrust
                taskIns.displayBio =  0
                taskIns.share = x.twist === 'false'
                taskIns.player = x.diff==='easy'?0:2
                taskIns.pts = 5
                break;
            case 'Gamble':
                taskIns.type = jsPsychGamble
                taskIns.whichSide= Math.random() > 0.5 ? 'left':'right'
                taskIns.switch= x.twist==='true'
                taskIns.win = Math.random() > 0.5
                taskIns.opt = config.GambleDiff[x.diff][ProcedureIndex[x.type][x.diff]]
                break;
        }

        allProcedures.push(taskIns)
        allProcedures.push({
            type: jsPsychRateEmotion,
            ShowEmo: true,
            emotion: "GoEmo",
            respType: 'key',
        })
        ProcedureIndex[x.type][x.diff] += 1
    }
    console.log(ProcedureIndex)
    return allProcedures
}

function allMEGConfig(sess, n) {
    const allConfig = {
        '1': {
            '1': {
                'order': [
                    {'type':'Maze','diff':'easy','twist':'false'},
                    {'type':'Trust','diff':'easy','twist':'false'},
                    {'type':'Gamble','diff':'easy','twist':'false'},
                    {'type':'Math','diff':'hard','twist':'false'},
                    {'type':'Maze','diff':'hard','twist':'true'},
                    {'type':'Gamble','diff':'hard','twist':'true'},
                    {'type':'Maze','diff':'easy','twist':'true'},
                    {'type':'Trust','diff':'hard','twist':'true'},
                    {'type':'Math','diff':'easy','twist':'false'},
                    {'type':'Gamble','diff':'easy','twist':'true'},
                    {'type':'Math','diff':'hard','twist':'true'},
                    {'type':'Gamble','diff':'hard','twist':'false'},
                    {'type':'Trust','diff':'easy','twist':'true'},
                    {'type':'Maze','diff':'hard','twist':'false'},
                    {'type':'Math','diff':'easy','twist':'true'},
                    {'type':'Trust','diff':'hard','twist':'false'},
                ],
                'MazeDiff': {
                    'easy': [MazeInfo['20'][0], MazeInfo['20'][1]],
                    'hard': [MazeInfo['20'][4], MazeInfo['20'][5], ]
                },
                'GambleDiff': {
                    'easy':[  // easy abs(EV - fixed) = 1.5 Gamble is always the preferred action
                        {fixed: -1,gam_1: -3,gam_2: 4 ,},
                        {fixed: 0,gam_1: -2,gam_2: 5 ,},
                    ],
                    'hard': [ // hard abs(EV - fixed) = 0.5 Gamble is always the preferred action
                        {fixed: -1,gam_1: -3,gam_2: 2 ,},
                        {fixed: 0,gam_1: -2,gam_2: 3 ,},
                    ]
                },

            },
            '2': {
                'order': [
                    {'type':'Gamble','diff':'hard','twist':'false'},
                    {'type':'Trust','diff':'easy','twist':'false'},
                    {'type':'Maze','diff':'hard','twist':'true'},
                    {'type':'Math','diff':'hard','twist':'true'},
                    {'type':'Maze','diff':'hard','twist':'false'},
                    {'type':'Gamble','diff':'hard','twist':'true'},
                    {'type':'Maze','diff':'easy','twist':'false'},
                    {'type':'Trust','diff':'hard','twist':'true'},
                    {'type':'Math','diff':'easy','twist':'true'},
                    {'type':'Gamble','diff':'easy','twist':'true'},
                    {'type':'Math','diff':'hard','twist':'false'},
                    {'type':'Trust','diff':'hard','twist':'false'},
                    {'type':'Gamble','diff':'easy','twist':'false'},
                    {'type':'Trust','diff':'easy','twist':'true'},
                    {'type':'Maze','diff':'easy','twist':'true'},
                    {'type':'Math','diff':'easy','twist':'false'},
                ],
                'MazeDiff': {
                    'easy': [MazeInfo['20'][2], MazeInfo['20'][3]],
                    'hard': [MazeInfo['20'][6], MazeInfo['20'][7]]
                },
                'GambleDiff': {
                    'easy':[  // easy abs(EV - fixed) = 1.5 Gamble is always the preferred action
                        {fixed: 1,gam_1: -1,gam_2: 6 ,},
                        {fixed: 2,gam_1: 0,gam_2:  7,},
                    ],
                    'hard': [ // hard abs(EV - fixed) = 0.5 Gamble is always the preferred action
                        {fixed: 1,gam_1: -1,gam_2: 4 ,},
                        {fixed: 2,gam_1: 0,gam_2: 5,},
                    ]
                },

            }
        }
    }
    console.log(allConfig)
    return allConfig[sess][n]
}