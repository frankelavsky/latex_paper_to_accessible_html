// All of these functions are run via the browser (none in a local env)

// a simple function to download a string or JSON object as a file
const downloadVariableAsAFile = (data, filename) => {
  var dataStr =
    'data:text/json;charset=utf-8,' + encodeURIComponent(typeof data === 'string' ? data : JSON.stringify(data));
  var a = document.createElement('a');
  a.setAttribute('href', dataStr);
  a.setAttribute('download', filename);
  document.body.appendChild(a);
  a.click();
  a.remove();
};

// crude sorting function (don't hold this against me lmao, perf was irrelevant!!)
const sortBibJSON = bib => {
  bib.sort((a, b) => {
    // some structure to get the first last name is a.author[0].family
    // while others in my bib json were a.author[0].literal up to the first comma
    // these variables store whichever is found in the first author entry
    const a_name =
      a.author[0] && a.author[0].family
        ? a.author[0].family
        : a.author[0].literal.substring(0, a.author[0].literal.indexOf(','));
    const b_name =
      b.author[0] && b.author[0].family
        ? b.author[0].family
        : b.author[0].literal.substring(0, b.author[0].literal.indexOf(','));
    return a_name < b_name ? -1 : a_name > b_name ? 1 : 0;
  });
};

// this function uses citation.js, I ran it in the browser console over at
// https://citation.js.org/demo/ to access their environment easily (I am lazy)
const streamBibJSONToBibTex = bib => {
  let output = { file: '', idHash: {} };
  // bib is our bibliography in json format (bib_sorted.json)
  // we stream this, rather than all at once, just for easier testing
  bib.forEach(item => {
    const originalId = item.id + '';
    const copy = [{ ...item }];

    // I encountered a bug where ids that were strings of numerics, ie
    // "0986743" would throw an error related to missing '.replace()' as a
    // method, so we prepend a string to keep it a string
    copy[0].id = 'PizzaHighEntropyPizza' + originalId;
    var bibString = JSON.stringify(copy);

    // the cite internal methods are where the string error happens this
    // function will convert our JSON string back into bibtex
    var converted = cite.set(bibString).get(opt).replace('PizzaHighEntropyPizza', '');
    output.file += converted;

    // now we save the original id mapping to the new id
    output.idHash[originalId] = converted.substring(converted.indexOf('{') + 1, converted.indexOf(','));
  });
  return output;
};
