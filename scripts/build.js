const { exec } = require('child_process');
const jsdom = require('jsdom');
const fs = require('fs');
const { JSDOM } = jsdom;
const options = {
  resources: 'usable',
  runScripts: 'dangerously'
};
const paperName = process.argv[2] || 'paper';
const bibliographyName = process.argv[3] || 'bib_sorted';
const citationStyle = process.argv[4] || 'citation';
// const outputName = process.argv[4]

// we create our bibliography
exec(
  `pandoc input/${bibliographyName}.bib --citeproc --csl input/${citationStyle}.csl -s -o post.html`,
  (err, stdout, stderr) => {
    if (err) {
      // node couldn't execute the command
      return;
    }

    // the *entire* stdout and stderr (buffered)
    // console.log(`stdout: ${stdout}`);
    // console.log(`stderr: ${stderr}`);

    // we create our paper
    // pandoc input/paper.tex -f latex -t html -s -o pre.html --bibliography input/bibliography.bib
    exec(
      `pandoc input/${paperName}.tex -f latex -t html -s -o pre.html --bibliography input/${bibliographyName}.bib`,
      (err, stdout, stderr) => {
        if (err) {
          // node couldn't execute the command
          return;
        }

        // the *entire* stdout and stderr (buffered)
        // console.log(`stdout: ${stdout}`);
        // console.log(`stderr: ${stderr}`);

        // then we can do our post-processing!
        JSDOM.fromFile('pre.html', options).then(dom => {
          JSDOM.fromFile('post.html', options).then(bib => {
            const document = dom.window.document;
            const bibliography = bib.window.document;
            let citations = {};
            /* 
                    To do: 
                    - remove ugly metadata header
                    - remove weird paragraph breaks
                    - alt text??? (make a data file?)
                    - links to/from table/section
                    - add main section
                    - add nav bar
                    - add skip link
                    - add link styling
                    - make table semantic
                    - order citations in ascending order (eg. [3,12,2] > [2,3,12])
                */
            document.querySelectorAll('*[data-cites]').forEach(e => {
              const onlyDigits = /\d+/;
              const writeAriaLabel = bibTarget => {
                // EG. instead of '1' for a link it will announce '1, Mack et al.' for screen readers
                return `${bibTarget.children[0].innerHTML.match(onlyDigits)}, ${bibTarget.children[1].innerHTML
                  .substring(0, bibTarget.children[1].innerHTML.indexOf(','))
                  .replace('<em>et al.</em>', 'et al.')
                  .replace(/(\r\n|\n|\r)/gm, ' ')}`;
              };
              const lastSentence = () => {
                // find the last sentence to add to a link description
                // EG. 'Return to: 26% of people in the United States self-report living with at least one disability'
                const sentences = e.previousSibling.wholeText
                  .replace(/(\r\n|\n|\r)/gm, ' ')
                  .replace(/([.?!])\s*(?=[A-Z])/g, '$1|')
                  .split('|');
                return `Return to: ${sentences[sentences.length - 1]}`;
              };
              let i = 0;
              e.appendChild(document.createTextNode('['));
              const citationKeys = e.getAttribute('data-cites').split(' ');
              citationKeys.forEach(key => {
                const bibTarget = bibliography.getElementById(`ref-${key}`);
                if (!citations[key]) {
                  const index = bibTarget.children[0].innerHTML;
                  citations[key] = {
                    key,
                    count: [],
                    index: index.match(onlyDigits)
                  };
                }
                // add <a> elements into data-cites
                const newChild = document.createElement('a');
                newChild.setAttribute('href', `#ref-${key}`);
                newChild.id = key + citations[key].count.length + 1;
                newChild.innerHTML = `${citations[key].index}`;
                // make sure that the links are descriptive!
                newChild.setAttribute('aria-label', writeAriaLabel(bibTarget));
                newChild.setAttribute('title', writeAriaLabel(bibTarget));
                citations[key].count.push(newChild.id);
                if (i) {
                  e.appendChild(document.createTextNode(', '));
                }
                i++;
                e.appendChild(newChild);
                // add link back up to new <a> from bib entry
                const reverseCitation = document.createElement('a');
                reverseCitation.setAttribute('href', `#${newChild.id}`);
                reverseCitation.setAttribute('aria-label', lastSentence());
                reverseCitation.setAttribute('title', lastSentence());
                reverseCitation.innerHTML = citations[key].count.length;
                if (!bibTarget.children[1].querySelector('.reverse-citation')) {
                  const reverseCitations = document.createElement('span');
                  reverseCitations.classList.add('reverse-citation');
                  reverseCitations.innerHTML = '<br>^ Jump up: ';
                  bibTarget.children[1].appendChild(reverseCitations);
                } else {
                  bibTarget.children[1].querySelector('.reverse-citation').appendChild(document.createTextNode(', '));
                }
                bibTarget.children[1].querySelector('.reverse-citation').appendChild(reverseCitation);
              });
              e.appendChild(document.createTextNode(']'));
            });
            // combine our references and main document
            const refs = document.createElement('div');
            refs.innerHTML = bibliography.getElementById('refs').outerHTML;
            document.body.appendChild(refs);

            const style = document.createElement('style');
            style.innerHTML = bibliography.getElementsByTagName('style')[0].innerHTML;
            document.head.appendChild(style);
            fs.writeFile('index.html', document.documentElement.outerHTML, function (error) {
              if (error) throw error;
              exec(`rm post.html pre.html`);
            });
          });
        });
      }
    );
  }
);
