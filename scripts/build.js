const { exec } = require('child_process');
const jsdom = require('jsdom');
const fs = require('fs');
const { JSDOM } = jsdom;
const options = {
  resources: 'usable',
  runScripts: 'dangerously'
};
const paperName = process.argv[2] || 'paper';
const bibliographyName = process.argv[3] || 'bibliography';
const citationStyle = process.argv[4] || 'citation';
// const outputName = process.argv[4]

// this hash was generated during the conversion process
const idHash = {
  9023497: 'Lee2020Reaching',
  aldrich_talk_2008: 'Aldrich2008Talk',
  noauthor_naked_nodate: 'AmakaNaked',
  noauthor_guidelines_nodate: 'BANA2010Guidelines',
  baker_2016: 'Baker2016Tactile',
  'balaji_chart-text_2018': 'Balaji2018Chart',
  bennett_interdependence_2018: 'Bennett2018Interdependence',
  bigham_vizwiz_2010: 'Bigham2010VizWiz',
  bornschein_collaborative_2015: 'Bornschein2015Collaborative',
  noauthor_unlocking_2018: 'Boudreau2018Unlocking',
  brangier_beyond_2018: 'Brangier2018Beyond',
  braun_clarke_thematic_2006: 'Braun2006Using',
  brewster_visualization_2002: 'Brewster2002Visualization',
  brown_viztouch_2012: 'Brown2012VizTouch',
  butler_technology_2021: 'Butler2021Technology',
  noauthor_revealing_nodate: 'CanelonRevealing',
  chaparro_applications_2017: 'Chaparro2017Applications',
  chen_neural_2019: 'Chen2019Neural',
  chen_figure_2020: 'Chen2020Figure',
  choi_visualizing_2019: 'Choi2019Visualizing',
  chuan_usability_2015: 'Chuan2015Usability',
  chundury_towards_2022: 'Chundury2022Towards',
  noauthor_making_2018: 'Community2018Making',
  craft_beyond_2005: 'Craft2005Beyond',
  'cullen_co-designing_2019': 'Cullen2019Co',
  noauthor_we_nodate: 'DeMartiniCoin',
  'demartini_tableau_nodate-1': 'DeMartiniTableau',
  'noauthor_axe-core_2021': 'Deque2021Axe',
  noauthor_study_2021: 'Deque2021Automated',
  noauthor_chartability_nodate: 'ElavskyChartability',
  'flowers_cross-modal_1997': 'Flowers1997Cross',
  forsell_heuristic_2010: 'Forsell2010heuristic',
  noauthor_are_2018: 'Forum2018Are',
  noauthor_solved_2019: 'Forum2019Datatables',
  gallace_what_2011: 'Gallace2011To',
  geldard_tactual_1983: 'Geldard1983Tactual',
  miesenberger_accessible_2018: 'Godfrey2018Accessible',
  gray_reprioritizing_2014: 'Gray2014Reprioritizing',
  noauthor_extensive_2016: 'HaleExtensive',
  noauthor_fixed_nodate: 'HighsoftFixed',
  noauthor_accessibility_nodate: 'HighsoftHighcharts',
  hoang_tableaumagic_2018: 'Hoang2018TableauMagic',
  hurst_making_2013: 'Hurst2013Making',
  initiative_wai_web_2021: 'Initiative2021Web',
  noauthor_web_nodate: 'InitiativeWeb',
  irani_turkopticon_13: 'Irani2013Turkopticon',
  jansen_opportunities_2015: 'Jansen2015Opportunities',
  jayant_automated_2007: 'Jayant2007Automated',
  joyce_mobile_2016: 'Joyce2016Mobile',
  jung_communicating_2022: 'Jung2022Communicating',
  kim_accessible_2021: 'Kim2021Accessible',
  noauthor_power_nodate: 'KleinPower',
  ladner_design_2015: 'Ladner2015Design',
  lai_automatic_2020: 'Lai2020Automatic',
  lederman_perception_1986: 'Lederman1986Perception',
  lundgard_sociotechnical_2019: 'Lundgard2019Sociotechnical',
  lundgard_accessible_22: 'Lundgard2022Accessible',
  mack_what_2021: 'Mack2021What',
  mankoff_disability_2010: 'Mankoff2010Disability',
  mansur_sound_1985: 'Mansur1985Sound',
  'noauthor_mapbox-gl_nodate': 'MapboxMapbox',
  'noauthor_mapboxmapbox-gl-accessibility_2021': 'Mapbox2021Mapbox',
  marriott_inclusive_2021: 'Marriott2021Inclusive',
  martinez_methodology_2021: 'Martinez2021Methodology',
  noauthor_semiotic_nodate: 'MazanecSemiotic',
  mcgookin_soundbar_2006: 'McGookin2006SoundBar',
  moraes_evaluating_2014: 'Moraes2014Evaluating',
  experience_10_nodate: 'Nielsen10',
  nielsen_heuristic_1994: 'Nielsen1994Heuristic',
  nunez_optimizing_2018: 'Nunez2018Optimizing',
  'obeid_chart--text_2020': 'Obeid2020Chart',
  cdc_disability_2018: 'Okoro2018Prevalence',
  oliveira_towards_2013: 'Oliveira2013Towards',
  oliveira_adapting_2022: 'Oliveira2017Adapting',
  noauthor_world_nodate: 'OrganizationWorld',
  otey_methodology_2017: 'Otey2017methodology',
  power_2012: 'Power2012Guidelines',
  qian_generating_2021: 'Qian2021Generating',
  noauthor_sas_nodate: 'SASSAS',
  'noauthor_covid-19_nodate': 'SanCOVID',
  santos_heuristic_2018: 'Santos2018Heuristic',
  schaadhardt_understanding_2021: 'Schaadhardt2021Understanding',
  noauthor_why_nodate: 'SchepersWhy',
  schneider_constructing_nodate: 'SchneiderConstructing',
  scholtz_developing_2011: 'Scholtz2011Developing',
  sharif_understanding_2021: 'Sharif2021Understanding',
  sharif_evographs_2018: 'Sharif2018evoGraphs',
  shi_tickers_2016: 'Shi2016Tickers',
  slavkovic_novice_1999: 'Slavkovic1999Novice',
  sorge_polyfilling_2016: 'Sorge2016Polyfilling',
  south_detecting_2021: 'South2021Detecting',
  south_generating_2020: 'South2020Generating',
  noauthor_inclusive_nodate: 'SwanInclusive',
  szpiro_2016: 'Szpiro2016How',
  noauthor_data_nodate: 'USData',
  noauthor_improving_nodate: 'USImproving',
  vcc: 'VisaVisa',
  initiative_wai_accessibility_nodate: 'WAI2019Accessibility',
  noauthor_w3c_nodate: 'WAI2021W3C',
  noauthor_webaim_nodate: 'WebAIMWebAIM',
  simon_making_2020: 'Wheatcroft2020Making',
  'wobbrock_ability-based_2011': 'Wobbrock2011Ability',
  wu_understanding_2021: 'Wu2021Understanding',
  xiong_curse_2020: 'Xiong2020Curse',
  zhao_data_2008: 'Zhao2008Data'
};

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
                    - alt text??? (make a data file?)
                    - links to/from table/section
                    - add main section
                    - add nav bar
                    - add skip link
                    - add link styling
                    - make table semantic
                    - order citations in ascending order (eg. [3,12,2] > [2,3,12])
                */
            document.querySelector('.CCSXML').remove();
            document.querySelector('.author').innerHTML = document
              .querySelector('.author')
              .innerHTML.replaceAll('¶', '');
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
                const bibTarget = bibliography.getElementById(`ref-${idHash[key]}`);
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
                newChild.setAttribute('href', `#ref-${idHash[key]}`);
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
                // process all bibTarget URLs into <a> elements
                bibTarget.children[1].childNodes.forEach(childNode => {
                  if (!childNode.tagName && childNode.textContent) {
                    const urlRegex = /(\b(https?):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
                    const url = childNode.textContent.match(urlRegex);
                    if (url) {
                      bibTarget.children[1].innerHTML = bibTarget.children[1].innerHTML.replace(
                        url[0],
                        `<a href="${url[0]}">${url[0]}</a>`
                      );
                    }
                  }
                });
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
