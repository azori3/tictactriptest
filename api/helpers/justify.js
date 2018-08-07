const config= require('../../config/config');
const textSplit = (text, format) => {
    let res = '';
    let charTracker = 0;
    const textTab = text.trim().split(' ');
    for (let i = 0; i < textTab.length; i++){
        charTracker += textTab[i].length;
        if (charTracker > format) {
            res = res.trim();
            res += '\n'+textTab[i] + ' ';
            charTracker = (textTab[i] + ' ').length;
        } else {
            res += textTab[i] + " ";
            charTracker++;
        }
    }
    return res;
};
const spaceForP = (p) => {
    if (p.length < config.justifyBy) {
        let amountOfSpace = config.justifyBy - p.length;
        let res = '';
        let i = 0;
        while(amountOfSpace > 0) {
            if (i >= p.length) {
                break;
            }
            if (p[i] === ' ') {
                res += " ";
                amountOfSpace--;
            }
            res += p[i];
            i++;
        }
        while(i < p.length) {
            res += p[i];
            i++;
        }
        return res;
    } else {
        return p;
    }
};
const addSpace = (text) => {
    let textTab = text.split('\n');
    let spacedText = textTab.map((p) => spaceForP(p)).join('\n');
    return spacedText;
};

const justify = (text) => {
    let splittedText = textSplit(text, config.justifyBy);
    return addSpace(splittedText);
}

module.exports = justify;