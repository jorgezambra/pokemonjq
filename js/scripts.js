var pokemonRepository = (function () {
  var repository = [];
  var apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';

  function add(pokemon) {
      repository.push(pokemon);
    }

  function getAll() {
      return repository;
    }

  function addListItem(pokemon) {
    var $pokemonList = $('ul');
    var $listItem = $('<li>');
    var $button = $('<button class="pokemon-name">' + pokemon.name + '</button>');
    $listItem.append($button);
    $pokemonList.append($listItem);
    $button.on('click', function (event) {showDetails(pokemon)
    });
  }

  function loadList() {
      return $.ajax(apiUrl).then(function (json) {
        json.results.forEach(function (item) {
          var pokemon = {
            name: item.name,
            detailsUrl: item.url
          };
          add(pokemon);
        });
      }).catch(function (e) {
        console.error(e);
      })
    }

    function loadDetails(item) {
        var url = item.detailsUrl;
        return $.ajax(url).then(function(details) {
          item.imageUrl = details.sprites.front_default;
          item.height = details.height;
      }).catch(function (error) {
        console.error(error);
      });
    }

    function showDetails(item) {
    pokemonRepository.loadDetails(item).then(function () {
      showModal(item);
    });
    }

    function showModal(item) {
        var $modalContainer = $('#modal-container');

        $modalContainer.empty();

        var modal = $('<div class="modal"><div>');

        var closeButtonElement = $('<button class="modal-close">Close</button>');
        closeButtonElement.on('click', hideModal);

        var nameElement = $('<h1>' + item.name + '</h1>');

        var imageElement = $('<img class="modal-img">');
        imageElement.attr('src', item.imageUrl);

        var heightElement = $('<p>' + 'height : ' + item.height + 'm' '</p>');

        modal.append(closeButtonElement);
        modal.append(nameElement);
        modal.append(imageElement);
        modal.append(heightElement);

        $modalContainer.appendChild(modal);
        $modalContainer.addClass('is-visible');
    }

    function hideModal() {
        var $modalContainer = $('#modal-container');
        $modalContainer.removeClass('is-visible');
    }


return {
    add: add,
    getAll: getAll,
    addListItem : addListItem,
    loadList: loadList,
    loadDetails: loadDetails,
    showDetails: showDetails
  };
})();

pokemonRepository.loadList().then(function() {
  pokemonRepository.getAll().forEach(function(pokemon){
    pokemonRepository.addListItem(pokemon);
  });
});
