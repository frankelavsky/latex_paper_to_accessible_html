# Latex paper to accessible HTML, an exploration

An exploration of the process it takes to turn a latex file (from EuroVis 2022) into an accessible HTML page.

## Overview of what it takes to make an accessible HTML paper from a LaTeX workflow

### Basic input files

- A latex paper (`input/paper.tex`)
- Figures (`figures/`)
- bib file (`input/bibliography.bib`)
- csl file (`input/citation.csl`)

### Additional input files

For accessibility and various features:

- Alt text data (`input/alt-text.json`)
- Opinionated styling (`input/custom.css`)
- Special table of contents javascript (`input/scrollNav.js`)

### Output files

- A single HTML document, complete with styling and JS
- Note: HTML file requires local `figures/` folder

### Environment set up

I am using Node and a JS file (build.js). In my `package.json`, I'm using `prettier` (to keep things clean) and `jsdom` to do all my processing via Node.

I do all my processing work in a `build.js` file, which I run via a script in my `package.json` with `yarn build`.

Not listed in my `package.json` is `pandoc`, which does a lot of heavy lifting for us, preparing the files.

### Rough method I use here:

Note that major overhaul items are **bolded**:

1. Loaded in css, js, and alt text json files
2. **Bibliography**: Pre-processed bibliography file and sorted it. First I converted it to json via pandoc, then sorted it in javascript, and then finished processing using `citation.js`'s online demo app. Citation.js was nice but required me to set up an `idHash` const (since it changed my IDs from my original file). (Note this whole step isn't necessary if your bibliography is already sorted.)
3. Created bibliography HTML via pandoc with `pandoc input/${bibliographyName}.bib --citeproc --csl input/${citationStyle}.csl -s -o post.html` and saved the file as a temporary `post.html`
4. Create main paper HTML via pandoc with `pandoc input/${paperName}.tex -f latex -t html -s -o pre.html --bibliography input/${bibliographyName}.bib` and saved the file as a temporary `pre.html`
5. Opened both files via jsdom
6. Cleaned up weird artifacts from LaTeX (xml section, paragraph marks, double curly brackets from bibliography)
7. **Cleaned up figures**: add alt text from our data, make sure `figcaption` isn't hidden via `aria-hidden`, and rename the links to the figures.
8. **Cleaned up the table**: added proper semantics and structure to header (adding scoping to row, column, and colgroup head cells), add a heading (h2) to caption title, clean up link names to the table.
9. **Cleaned up citations**: I had to create citations in the paper (the data was there in an HTML attribute, but no content or link). First I linked down to bibliography and added nice aria (eg "1, Mack et al") as well as semantics (`role="doc-noteref"`) to every link. Then I added links back up to the document from the references section with nice aria (eg 'Return to: 26% of people in the United States self-report living with at least one disability') as well as semantics (`role="doc-backlink"`).
10. Converted all text of urls in the References into real, working urls (DOIs, etc).
11. Fixed endnote (semantics and aria).
12. Combined bib's post.html style tag with main document.
13. Validation stuff: added document language, wrapped primary contents in `<main>`, `<header>`, and `<footer>` structure.
14. Combined the rest of bib document's body with main document.
15. **Table of contents**: Added a spicy, super sleek table of contents (sticky on the left in desktop view, builds automatically from contents in doc, has collapsing/nesting, and highlights as you scroll the doc).
16. Lastly, added some styling touches via css (for accessibility and otherwise).

## Documentation of every step I took (for the most part)

1. [Install Quarto](https://quarto.org/docs/get-started/)
2. [Install for VS Code](https://marketplace.visualstudio.com/items?itemName=quarto.quarto)
3. [Clone quarto-tvcg](https://github.com/cscheid/quarto-tvcg/)
4. Attempt to run `quarto render paper.qmd --to html` (it fails)
5. [Install R for the example in quarto-tvcg](https://cloud.r-project.org/), re-attempt Step 4 (it fails again)
6. Open R and run `install.packages("rmarkdown")`, re-attempt Step 4 (it fails again)
7. From R run `install.packages("tidyverse")`, re-attempt Step 4 (it fails again)
8. From R run `install.packages("palmerpenguins")`, re-attempt Step 4 (it fails again)
9. From R run `install.packages("reticulate")`, re-attempt Step 4 (it SUCCEEDS!)
10. Open the resulting HTML file at `src/paper.html` and inspect it with keyboard/SR
11. Run automated tests for accessibility (AXE and WAVE)
12. (Record findings)
    1. **Areas to improve**: AXE found 50 things (1 critical, 33 serious), WAVE found 3 Errors and 21 Contrast Errors, I found issues with keyboard/SR nav on citations (not closing), figures have no alt text (and some use "embed" and not "img" tags), math equations are very rough, many links/anchors are non-descriptive, styling seems minimalistic (not bad necessarily!).
    2. **Strengths**: Table works well, headings are good.
    3. **Summary**: Overall, needs work but it is an okay and simple document.
13. Try placing my own paper files into the directory (paper.bib, paper.latex, figures)
14. Rename the url in paper.qmd to my paper.tex file `template. vgtc-quarto-template/paper.tex`
15. (Tried a bunch of things -- then contacted Carlos. It turns out we can't convert latex into html using quarto!)
16. Pandoc it is... :\_)
17. Put paper.tex and chartability_bibliography.bib in the same folder, from terminal run `pandoc paper.tex -f latex -t html -s -o test.html --bibliography chartability_bibliography.bib`
18. Post-proccess! We need all the links to work, CSS, and most importantly: alt added to our figures
19. Run `yarn add prettier` to include it in the repo and add `prettier-all` and `prettier-all-check` to the scripts in the package json
20. Add build.js file to a scripts folder, add it to package json
21. Run `yarn add jsdom` so we can do some dom-like post-processing in our build file
22. Add a csl file for formatting our citations, [the IEEE TVCG csl file downloaded from Zotero](https://www.zotero.org/styles?q=id%3Aieee-transactions-on-visualization-and-computer-graphics)
23. JavaScript (via JSDOM): Find which citations are used, link to them
24. JavaScript (via JSDOM): Add a link to the citations parent for each citation
25. JavaScript (via JSDOM): Combine bibliography with paper
26. JavaScript (via JSDOM): Add links BACK to locations they are linked to from bib
27. Remove unused references from bib file
28. Break from bib stuff: Add data file for alt text
29. Convert bib to json via terminal `pandoc bibliography.bib -t csljson -o bibliography.json`
30. Sorted bib in the browser console (code in `scripts/utils`) and downloaded the new json as `bib_sorted.json`
31. FAILED to convert back via pandoc `pandoc bibliography.json -f csljson -t biblatex -o bibliography.bib`, I am getting `pandoc JSON parse error: Error in $: mempty`
32. I went to `https://citation.js.org/demo/` and pasted my sorted json in, found a strange bug where ids that are strings of numerics were throwing an error, then fixed it and converted back to bib format (code in `scripts/utils`), downloading the new file as `bib_sorted.bib`
33. Annoyingly, I had to clean up 3 instances in my sorted bib where `:amp;` was being prepended instead of the intended ful unicode, such as `&#x201c;`
34. add links to link text in citations
35. remove ugly metadata header
36. remove weird paragraph breaks
37. add alt text, fix caption a11y, fix fig links
38. fix table caption and links
39. add document language
40. add basic table of contents
41. add nesting and disclosure to table of contents
42. add styling to table of contents while scrolling, fix various issues
43. fix endnote, add semantics for all role=docnotes and backlinks
44. make table accessible (add proper structure and semantics)
45. made some styling changes based on feedback
46. found that the references AX on voiceover won't announce their contents unless I put tabindex="-1" on them! This is probably because the id is on a div that has no immediate text nodes but two children divs with text nodes. Adding tabindex="-1" fixes this and likely has no AX downsides!
