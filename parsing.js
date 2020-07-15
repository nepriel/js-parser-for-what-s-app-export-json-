// TAKES IN ARGUMENT FOR FILE INPUT AND OUTPUT
if (process.argv.length !== 4) {
    console.error('MAKE SUR FORMAT IS VALID BECAUSE THERE IS NO SECURITY !! Expected at least two argument! : you must specify the input file location and the destination of json file. ex: node parsing.js `D:\\first_conv\\_chat.txt` `D:\\first_conv\\truc.json` ' );
    process.exit(1);
  }
const INPUT = process.argv[2];
const OUTPUT = process.argv[3];

var fs = require('fs');

// READS FILE AND PUT EACH LINE IN array
var yolo = fs.readFileSync(INPUT, 'utf-8');
var array = yolo.split('\n');


function isLetter(str) {
    return str.length === 1 && str.match(/[a-z]/i);
  }

var newarray = [];
var problem = [];
array.forEach((el, i) => {

    //if the first line is a letter it means the message continue in an other line and it breaks the parsing, we therefore need to construct a problem array that will take care of it later
    if (isLetter(el.slice(0,1)) ) {
        problem.push({
            index: i,
            bits: el
        })
    }

    //takes the first 22 chars as a date : ex format : [22/02/2019 21:43:36]
    var strDate = el.slice(0,21);

    //splits the resting string for each ':' char it encounters to isolate the sender : ex 'virgile' in ' [24/02/2019 07:43:30] Virgile: bonne journée bb .'
    var rest = el.slice(22);
    var splits = rest.split(/:(.+)/);
    //check size of splits to see if parsing failed and can compare index with the problems array
    // if (splits.length !== 3) {
    //     console.log('should be errors at index ', i, 'for', splits);
    // }

    var newstr = '';
    splits.forEach((string, i) => {
        if(i !== 0) {
            newstr = newstr + string;
        }
    });

    // console.log('should have a piece jointe somewhere', newstr);

    var message = {
        date: strDate,
        sendBy: splits[0],
        content: newstr
    }
    // console.log(message);
    newarray.push(message);
});

// console.log(problem);

// THE PROBLEM ARRAY CONTAINS THE INDEX OF THE LINE THAT CAUSES PROBLEM then if lines are next to each other it puts each line in one only strings because it means it's part of the same message
for (let i = 0; i < problem.length; i++) {
    const element = problem[i];
    if (i < (problem.length - 1) && (element.index + 1) === problem[ i + 1 ].index) {
        var j = i;
        var compose = ''
        var IndexOfProblem = (element.index - 1)
        while(problem[j] && problem[ j + 1 ] && (problem[j].index + 1) === problem[ j + 1 ].index){
            compose = compose + '\n' + problem[j].bits;
            j++;
        }
        //for each noticeable problem it updates the content of the messages array at the index it occurs
        newarray[IndexOfProblem].content = newarray[IndexOfProblem].content + compose;
        i = j;
    }
}

var bolosse = [];
newarray.forEach(element => {
    // console.log('before should contain piece jointe: ', element);
    if (element.sendBy === 'Jo ❤️' || element.sendBy === 'Virgile' ||  element.sendBy === ' Virgile'){
        //the creation of a new array fixes error due to strange behavior of parsing
        bolosse.push(
            {
                date: element.sendBy === ' Virgile' ? (element.date + ']') : element.date ,
                sendBy: element.sendBy === ' Virgile' ? 'Virgile': element.sendBy,
                content: element.content
            }
        );
        // console.log('after: ', element);
    }
});

const callback= (err) => {
    if (err) throw err;
    console.log('complete');
    }

// console.log(bolosse);
// bolosse.forEach(element => {
// console.log('element:', element)
// });

var json = JSON.stringify(bolosse);
fs.writeFile(OUTPUT, json, 'utf8', callback);