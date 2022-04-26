const { exec } = require('child_process');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const options = {
    resources: 'usable',
    runScripts: 'dangerously',
};
const paperName = process.argv[2] || 'paper'
const bibliographyName = process.argv[3] || 'bibliography'
const citationStyle = process.argv[4] || 'citation'
// const outputName = process.argv[4]

// we create our bibliography
exec(`pandoc input/${bibliographyName}.bib --citeproc --csl input/${citationStyle}.csl -s -o post.html`, (err, stdout, stderr) => {
    if (err) {
      // node couldn't execute the command
      return;
    }
  
    // the *entire* stdout and stderr (buffered)
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);

    // we create our paper
    // pandoc input/paper.tex -f latex -t html -s -o pre.html --bibliography input/bibliography.bib
    exec(`pandoc input/${paperName}.tex -f latex -t html -s -o pre.html --bibliography input/${bibliographyName}.bib`, (err, stdout, stderr) => {
        if (err) {
        // node couldn't execute the command
        return;
        }
    
        // the *entire* stdout and stderr (buffered)
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);

        // then we can do our post-processing!
        JSDOM.fromFile('pre.html', options).then((dom) => {
            JSDOM.fromFile('post.html', options).then((bib) => {
                const document = dom.window.document
                const bibliography = bib.window.document
                let citations = {}
                let index = 1
                console.log(bibliography)
                /* 
                    To do: 
                    - find which citations are used, link to them
                    - remove citations that are unused
                    - add bibliography to paper
                    - add links BACK to locations they are linked to from bib
                    - alt text??? (make a data file?)
                    - links from table/section
                    - output file
                */
                // document.querySelectorAll('*[data-cites]').forEach(e =>{
                //     const citationKeys = e.getAttribute('data-cites').split(' ')
                //     citationKeys.forEach(key => {
                //         if (!citations[key]) {
                //             citations[key] = {
                //                 key,
                //                 index
                //             }
                //             index++
                //             // console.log(document.get)
                //         }
                //     })
                //     // remove data-cites attribute
                //     // add <a> elements into data-cites
                // })
            });
        });
    });
})

