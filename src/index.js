require('./style.css')
const dayjs = require('dayjs')
var utc = require('dayjs/plugin/utc')
var timezone = require('dayjs/plugin/timezone')
var customParseFormat = require('dayjs/plugin/customParseFormat')
var isBetween = require('dayjs/plugin/isBetween')
dayjs.extend(isBetween)
dayjs.extend(customParseFormat)
dayjs.extend(utc)
dayjs.extend(timezone)

function UserException(message, el) {
    this.message = message;
    this.element = el;
    this.name = 'MissingParametersException';
}
function MainException(message) {
    this.message = message;
    this.name = 'UserException';
}

const eventAutomation = () =>{
    addEventListener('DOMContentLoaded', (event) => {
        try{
            const elements = document.querySelectorAll('[data-automation]')
            elements.forEach((el)=>{
                let start = el.dataset.automationStart
                let end = el.dataset.automationEnd
                let country = el.dataset.automationCountry
                let zone = el.dataset.automationZone

                if(!start || !end){
                    throw new UserException('Missing attribute `data-automation-start` and `data-automation-end`', el);
                }

                if(!country || !zone){
                    country = dayjs.tz.guess().split("/")[0]
                    zone = dayjs.tz.guess().split("/")[1]
                }

                start = dayjs(start, "DD-MM-YYYY HH:mm").format("DD-MM-YYYY HH:mm:ss");
                end = dayjs(end, "DD-MM-YYYY HH:mm").format("DD-MM-YYYY HH:mm:ss");
                
                let currentFormat = dayjs().tz(`${country}/${zone}`).format()
                let startFormat = dayjs.tz(start, "DD-MM-YYYY HH:mm:ss", `${country}/${zone}`).format()
                let endFormat = dayjs.tz(end, "DD-MM-YYYY HH:mm:ss", `${country}/${zone}`).format()

                let isEvent = dayjs(currentFormat).isBetween(startFormat, endFormat)

                if(!isEvent){
                    el.remove();
                }
            })
        }catch(err){
            throw new UserException(err.message);
        }
    })
}

eventAutomation();