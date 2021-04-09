const pup = require("puppeteer");
let id = "hocegot995@whyflkj.com";
let pass = "simran@123";
//launching browser in chromium
let browserPromise = pup.launch({
    headless: false,
    defaultViewport: false
})
let tab;
//getting address of tab
browserPromise.then(function(browser){
    let pagesPromise = browser.pages(); //returning an arraylist of pages
    return pagesPromise;
}).then(function(pages){
    tab = pages[0];
    let pagereturnpromise = tab.goto("https://www.hackerrank.com/auth/login"); //going to login page of hackerrank
    return pagereturnpromise;
}).then(function(){
    let idpromise = tab.type("#input-1",id); //typing id in hackerrank's login's id
    return idpromise;
}).then(function(){
    let passpromise = tab.type("#input-2",pass);  //typing password in hackerrank's login's password
    return passpromise;
}).then(function(){
    let loginpromise = tab.click(".ui-btn.ui-btn-large.ui-btn-primary.auth-button.ui-btn-styled"); //clicking on login button
    return loginpromise;
}).then(function(){
    //waiting for loading of interview prep 
    let interPromise = tab.waitForSelector(".ui-btn.ui-btn-normal.ui-btn-large.ui-btn-primary.ui-btn-link.ui-btn-styled",{visible:true});
    return interPromise;
}).then(function(){
    //clicking on interview prep
    let interclickPromise = tab.click(".ui-btn.ui-btn-normal.ui-btn-large.ui-btn-primary.ui-btn-link.ui-btn-styled");
    return interclickPromise;
}).then(function(){
    //waiting for loading of warmup challenges
    let warmwaitPromise = tab.waitForSelector("a[data-attr1='warmup']",{visible:true}); //used "data-attr1" attribute of "a" tag
    return warmwaitPromise;
}).then(function(){
    //clicking on warmuo challenges
    let warmPromise = tab.click("a[data-attr1='warmup']");
    return warmPromise;
}).then(function(){
    //waiting for all questions in warmup challenges
    let questionwaitpromise = tab.waitForSelector(".js-track-click.challenge-list-item",{visible:true});
    return questionwaitpromise;
}).then(function(){
    //finding and getting all questions in array
    let allquestionurl = tab.$$(".js-track-click.challenge-list-item"); //findelement through $$
    return allquestionurl;
}).then(function(data){
    let geturlPromises = []; //this array will contain promises of getting url of all questions
    for(let i of data){
        let geturlPromise = tab.evaluate(function(ele){
            return ele.getAttribute("href"); //getting href of questions
        },i);
        geturlPromises.push(geturlPromise);
    }
    return Promise.all(geturlPromises); //resolving all array at a time parallely
}).then(function(data){
    let problemsolvePromise = solvequestion("https://www.hackerrank.com"+data[0]);
    for(let i=1;i<data.length;i++){
        //promises running synchronously
        problemsolvePromise = problemsolvePromise.then(function(){
            return solvequestion("https://www.hackerrank.com"+data[i]);
        });
    }
}).catch(function(err){
    console.log("error occured");
})
//function of solving questions
function solvequestion(url){
    let prblmurl = url;
    let editorialurl = url.replace("?","/editorial?"); //going to editorial page directly
    return new Promise(function(resolve,reject){
        tab.goto(editorialurl).then(function(){
            let languagesPromises = tab.$$(".hackdown-content h3"); //finding languages of code in editorial
            return languagesPromises;
        }).then(function(data){
            let languagesPromise = [];
            for(let i of data){
                let languageP = tab.evaluate(function(ele){
                    return ele.textContent;
                },i);
                languagesPromise.push(languageP); //Filling all promises that give language of code
            }
            return Promise.all(languagesPromise); //resolving all promises at a time of getting languages of code
        }).then(function(data){ //recieve all languages
            for(let i in data){
                if(data[i] == "C++"){ 
                    let finalansPromise = tab.$$(".highlight").then(function(ans){ //getting all codes
                        let ansPromise = tab.evaluate(function(ele){
                            return ele.textContent;  //getting only C++ code
                        },ans[i]);
                        return ansPromise;
                    });
                    return finalansPromise; //returning array of codes in C++
                }
            }
        }).then(function(data){
            return tab.goto(prblmurl).then(function(){
                let checkboxwaitPromise = tab.waitForSelector(".custom-input-checkbox",{visible:true});
                return checkboxwaitPromise;
            }).then(function(){
                let checkboxclickPromise = tab.click(".custom-input-checkbox");
                return checkboxclickPromise;
            }).then(function(){
                let checkboxtypePromise = tab.type(".custominput",data);
                return checkboxtypePromise;
            }).then(function(){
                let controldownPromise = tab.keyboard.down("Control");
                return controldownPromise;
            }).then(function(){
                let ApressPromise = tab.keyboard.press("A");
                return ApressPromise;
            }).then(function(){
                let XpressPromise = tab.keyboard.press("X");
                return XpressPromise;
            }).then(function(){
                let editorClickPromise = tab.click(".monaco-editor.no-user-select.vs");
                return editorClickPromise;
            }).then(function(){
                let AepressPromise = tab.keyboard.press("A");
                return AepressPromise;
            }).then(function(){
                let VpressPromise = tab.keyboard.press("V");
                return VpressPromise;
            }).then(function(){
                let ControlRealsePro = tab.keyboard.up("Control");
                return ControlRealsePro;
            }).then(function(){
                return tab.click(".pull-right.btn.btn-primary.hr-monaco-submit");
            }).then(function(){
                return tab.waitForSelector(".congrats-wrapper", {visible: true});
            })
        }).then(function(){
            resolve();
        });
    });
}