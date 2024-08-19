import View from './View';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;

      const goToPage = +btn.dataset.goto;
      handler(goToPage);
    });
  }

  _generateMarkup() {
    const currentPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    //Page 1, others pages
    if (currentPage === 1 && numPages > 1) {
      return this._generateMarkupHelper('next', currentPage);
    }
    //Last page
    if (currentPage === numPages && numPages > 1) {
      return this._generateMarkupHelper('prev', currentPage);
    }
    //Other page
    if (currentPage < numPages) {
      return this._generateMarkupHelper('both', currentPage);
    }
    //Page 1, no more pages
    return '';
  }
  _generateMarkupHelper(buttonType, currentPage) {
    const next = `
    <button data-goto="${
      currentPage + 1
    }" class="btn--inline pagination__btn--next">
          <span>Page ${currentPage + 1}</span>
            <svg class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
          </svg>
     </button>
    `;
    const prev = `
    <button data-goto="${
      currentPage - 1
    }" class="btn--inline pagination__btn--prev">
           <svg class="search__icon">
             <use href="${icons}#icon-arrow-left"></use>
           </svg>
           <span>Page ${currentPage - 1}</span>
       </button>
    `;

    if (buttonType === 'prev') return prev;
    if (buttonType === 'next') return next;
    if (buttonType === 'both') return prev + next;
  }
}

export default new PaginationView();
