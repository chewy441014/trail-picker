function modalLink() {
  // JS for Location Modal (Credit to Bulma docs example)
  // console.log('modal link running')
  
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
    // console.log('Got to the button trigger');
    // Add a click event on buttons to open a specific modal
    // console.log(document.querySelectorAll('.js-modal-trigger') || []);
    (document.querySelectorAll('.js-modal-trigger') || []).forEach(($trigger) => {
      const modal = $trigger.dataset.target;
      const $target = document.getElementById(modal);
      // console.log(modal);
      // console.log($target);
      // console.log($trigger);

      $trigger.addEventListener('click', () => {
        openModal($target);
      });
    });
    // console.log('past the button trigger  ');

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
    // $('#updateBtn').on('click',closeAllModals)
}

