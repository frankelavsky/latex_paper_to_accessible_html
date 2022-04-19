# Documenting my process, so far:

Step 1: [Install Quarto](https://quarto.org/docs/get-started/)
Step 2: [Install for VS Code](https://marketplace.visualstudio.com/items?itemName=quarto.quarto)
Step 3: [Clone quarto-tvcg](https://github.com/cscheid/quarto-tvcg/)
Step 4: Attempt to run `quarto render paper.qmd --to html` (it fails)
Step 5: [Install R for the example in quarto-tvcg](https://cloud.r-project.org/), re-attempt Step 4 (it fails again)
Step 6: Open R and run `install.packages("rmarkdown")`, re-attempt Step 4 (it fails again)
Step 7: From R run `install.packages("tidyverse")`, re-attempt Step 4 (it fails again)
Step 8: From R run `install.packages("palmerpenguins")`, re-attempt Step 4 (it fails again)
Step 9: From R run `install.packages("reticulate")`, re-attempt Step 4 (it SUCCEEDS!)
Step 10: Open the resulting HTML file at `src/paper.html` and inspect it with keyboard/SR
Step 11: Run automated tests for accessibility (AXE and WAVE)
Step 12: (Record findings) __Areas to improve__: AXE found 50 things (1 critical, 33 serious), WAVE found 3 Errors and 21 Contrast Errors, I found issues with keyboard/SR nav on citations (not closing), figures have no alt text (and some use "embed" and not "img" tags), math equations are very rough, many links/anchors are non-descriptive, styling seems minimalistic (not bad necessarily!). __Strengths__: Table works well, headings are good. __Summary__: Overall, needs work but it is an okay and simple document.
Step 13: Try placing my own paper files into the directory (paper.bib, paper.latex, figures)
Step 14: Rename the url in paper.qmd to my paper.tex file `template: vgtc-quarto-template/paper.tex`
Step 15: (Tried a bunch of things -- then contacted Carlos. It turns out we can't convert latex into html using quarto!)
Step 16: Pandoc it is... :_)
Step 17: Put paper.tex and chartability_bibliography.bib in the same folder, from terminal run `pandoc paper.tex -f latex -t html -s -o test.html --bibliography chartability_bibliography.bib`
Step 18: Post-proccess! We need all the links to work, CSS, and most importantly: alt added to our figures