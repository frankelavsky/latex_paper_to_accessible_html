// credit to the legendary Chris Coyer, https://css-tricks.com/sticky-table-of-contents-with-scrolling-active-states/
window.addEventListener('DOMContentLoaded', () => {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const id = entry.target.getAttribute('id');
      const navLink = id ? `a[href="#${id}"]` : `nav li a[href="#"]`;
      const li = document.querySelector(navLink).parentElement;
      const detailsParent =
        li.parentElement.tagName === 'DETAILS'
          ? li.parentElement
          : li.parentElement.parentElement.tagName === 'DETAILS'
          ? li.parentElement.parentElement
          : li.parentElement.parentElement.parentElement.tagName === 'DETAILS'
          ? li.parentElement.parentElement.parentElement
          : null;
      const mod = entry.intersectionRatio > 0 ? 'add' : 'remove';
      li.classList[mod]('active');
      if (detailsParent) {
        detailsParent.open = detailsParent.querySelectorAll('.active').length > 0;
        if (entry.intersectionRatio > 0) {
          detailsParent.parentNode.parentNode.parentNode.scrollTop = detailsParent.offsetTop;
        }
      }
    });
  });

  // Track all sections that have an `id` applied
  document
    .querySelector('.main-wrapper')
    .querySelectorAll('.section')
    .forEach(section => {
      observer.observe(section);
    });
});
