
function log(mess, ...args) {
  if (typeof mess === 'string') {
    console.log(`%c SDK:${mess}`, 'color:green');
  } else {
    console.log(`%c SDK:${JSON.stringify(mess)}`, 'color:green');
  }
  if(args.length > 0){
    console.log(...args);
  }
}

export default log;
