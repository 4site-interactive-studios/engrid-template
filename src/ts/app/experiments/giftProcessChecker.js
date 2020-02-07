/*global alert, confirm, console, prompt, pageJson, window */
/*jslint es6 */

window.addEventListener('DOMContentLoaded', (event) => {

    window.dataLayer = window.dataLayer || [];

    const giftProcess = pageJson.giftProcess;
    console.log("Looking for giftProcess...");

    if (giftProcess) {
        // If giftProcess has any value other than the boolean "false"
        // window.dataLayer.push({ event: 'giftProcess-' + giftProcess});
        console.log("giftProcess is present, logging an event with its value: giftProcess-", giftProcess);
        window.dataLayer.push({
            'event': 'experiments',
            'eventCategory': 'Engaging Networks Experiment - giftProcess Testing',
            'eventAction': 'Engaging Networks Donation Thank You Page',
            'eventLabel': 'giftProcess-' + giftProcess,
            'eventValue': undefined,
            'noninteraction': true
        });
    } else if (giftProcess === false) {
        // If giftProcess has a boolean value of "false"
        // window.dataLayer.push({ event: 'giftProcess-false' });
        console.log("giftProcess is present but 'false', logging an event with its value: giftProcess-", giftProcess); 
        window.dataLayer.push({
            'event': 'experiments',
            'eventCategory': 'Engaging Networks Experiment - giftProcess Testing',
            'eventAction': 'Engaging Networks Donation Thank You Page',
            'eventLabel': 'giftProcess-false',
            'eventValue': undefined,
            'noninteraction': true
        });
    } else {
        // If giftProcess has no defined value or is non-existant
        // window.dataLayer.push({ event: 'giftProcess-' + x});
        console.log("giftProcess is present and without a value or missing Logging an event with its value: giftProcess-", x);
        const x = typeof giftProcess;
        window.dataLayer.push({
            'event': 'experiments',
            'eventCategory': 'Engaging Networks Experiment - giftProcess Testing',
            'eventAction': 'Engaging Networks Donation Thank You Page',
            'eventLabel': 'giftProcess-' + x,
            'eventValue': undefined,
            'noninteraction': true
        });
    }

});