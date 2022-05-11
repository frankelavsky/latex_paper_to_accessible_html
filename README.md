# Latex paper to accessible HTML, an exploration

An exploration of the process it takes to turn a latex file (from EuroVis 2022) into an accessible HTML page.

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
