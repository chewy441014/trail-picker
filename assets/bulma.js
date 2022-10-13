// gets all the modal buttons setup, placed inside a function so it can be called on the results page
function modalLink() {
  // JS for Location Modal (Credit to Bulma)
  
    // Functions to open and close a modal
    function openModal($el) {
      $el.classList.add('is-active');
    }

    function closeModal($el) {
      $el.classList.remove('is-active');
    }

    function closeAllModals() {
      (document.querySelectorAll('.modal') || []).forEach(($modal) => {
        closeModal($modal);
      });
    }
    // Add a click event on buttons to open a specific modal
    (document.querySelectorAll('.js-modal-trigger') || []).forEach(($trigger) => {
      const modal = $trigger.dataset.target;
      const $target = document.getElementById(modal);
      $trigger.addEventListener('click', () => {
        openModal($target);
        let findIndexOf = $trigger.id.replace('card', '');
      // if the button which was clicked was a search result, display the park details regarding that entry of the results by index and open the modal
      if (findIndexOf) {
        displayParkDetails(findIndexOf);     
      }
      });
    });

    // Add a click event on various child elements to close the parent modal
    (document.querySelectorAll('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button') || []).forEach(($close) => {
      const $target = $close.closest('.modal');

      $close.addEventListener('click', () => {
        closeModal($target);
      });
    });

    // Add a keyboard event to close all modals
    document.addEventListener('keydown', (event) => {
      const e = event || window.event;

      if (e.keyCode === 27) { // Escape key
        closeAllModals();
      }
    });
    $('#updateBtn').on('click',closeAllModals)
}
