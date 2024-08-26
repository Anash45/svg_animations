"use strict"; // Activer le mode strict

function animatePapillon(animal) {
    const papillon = document.querySelector('.' + animal);

    function moveRandomly() {
        let container = document.getElementById('zoo-container');
        // Obtenir les dimensions du conteneur
        const viewportWidth = container.offsetHeight;
        const viewportHeight = container.offsetHeight;

        // Générer des positions aléatoires
        const randomX = Math.floor(Math.random() * (viewportWidth - papillon.clientWidth));
        const randomY = Math.floor(Math.random() * (viewportHeight - papillon.clientHeight));

        // Appliquer les positions aléatoires à l'élément papillon
        papillon.style.transform = `translate(${randomX - 150}px, ${randomY - 150}px)`;
        papillon.style.zIndex = `3`;

        // Définir un intervalle aléatoire pour le prochain mouvement
        const randomInterval = Math.floor(Math.random() * 2000) + 500; // Entre 500ms et 2500ms

        // Déplacer le papillon à nouveau après l'intervalle aléatoire
        setTimeout(moveRandomly, randomInterval);
    }

    // Démarrer le mouvement
    moveRandomly();
}

document.addEventListener('DOMContentLoaded', function () {
    var zooContainer = document.getElementById('zoo-container');
    var decor = document.body; // Cible l'élément body pour modifier le décor
    var isNight = false;

    // Liste des animaux avec les noms de fichiers SVG mis à jour
    var animals = [
        { name: 'Kangourou', file: 'Kangourou.svg' },
        { name: 'Papillon', file: 'Papillon.svg' },
        { name: 'Souris', file: 'Souris.svg' },
        { name: 'Chauves-souris', file: 'Chauves_souris.svg' },
        { name: 'Girafe', file: 'Girafe.svg' },
        { name: 'Singe', file: 'Singe.svg' },
        { name: 'Chameleon', file: 'Chameleon.svg' },
        { name: 'Lion', file: 'Lion.svg' },
        { name: 'Panda', file: 'Panda.svg' },
        { name: 'Crocodile', file: 'Crocodile.svg' },
        { name: 'Elephant', file: 'Elephant.svg' },
        { name: 'Ecureuil', file: 'Ecureuil.svg' },
    ];

    animals.forEach(function (animal) {
        fetch(animal.file)
            .then(function (response) {
                return response.text();
            })
            .then(function (data) {
                var animalSVGContainer = document.createElement('div');
                animalSVGContainer.innerHTML = data;
                var svgElement = animalSVGContainer.querySelector('svg');
                svgElement.classList.add(animal.name.toLowerCase());
                svgElement.classList.add('svg_icon');

                if (svgElement) {
                    zooContainer.appendChild(svgElement);

                    // Changer la couleur du caméléon quand la souris le survole
                    if (animal.name === 'Chameleon') {
                        svgElement.addEventListener('mousedown', function () {
                            changeAnimalColor(svgElement, 'red');
                        });
                        svgElement.addEventListener('mouseup', function () {
                            resetAnimalColor(svgElement);
                        });
                    }

                    if (animal.name === 'Forest') {
                        svgElement.addEventListener('click', function () {
                            toggleDayNight();
                        });
                    } else {
                        // Affichage du nom de l'animal au clic
                        svgElement.addEventListener('click', function () {
                            showAnimalName(animal.name);
                        });

                        svgElement.addEventListener('dblclick', function () {
                            moveWithArrowKeys(svgElement);
                        });
                    }
                }
            })
            .catch(function (error) {
                if (typeof console !== 'undefined') {
                    console.error('Erreur lors du chargement du fichier SVG ' + animal.file + ':', error);
                }
            });
    });

    // Fonction pour afficher le nom de l'animal
    function showAnimalName(animalName) {
        var nameText = document.createElement('div');
        nameText.innerText = 'Ceci est un ' + animalName + '.';
        nameText.style.position = 'absolute';
        nameText.style.backgroundColor = 'rgba(255, 255, 255)';
        nameText.style.color = 'black';
        nameText.style.padding = '5px';
        nameText.style.borderRadius = '5px';
        nameText.style.zIndex = '10';
        nameText.style.border = '1px solid #000';
        document.body.appendChild(nameText);

        // Positionnement au centre de l'écran
        nameText.style.top = '10%';
        nameText.style.left = '50%';
        nameText.style.transform = 'translate(-50%, -50%)';

        // Supprime le texte après 2 secondes
        setTimeout(function () {
            if (document.body.contains(nameText)) {
                document.body.removeChild(nameText);
            }
        }, 2000);
    }

    function toggleDayNight(event) {
        console.log(isNight);
        let forest = document.querySelector('body');
        if (isNight) {
            forest.style.backgroundImage = "url(Forest.svg)";
            isNight = false;
        } else {
            forest.style.backgroundImage = "url(Forest-night.svg)";
            isNight = true;
        }
    }

    function changeAnimalColor(svgElement, color) {
        svgElement.querySelector('path:nth-child(3)').style.fill = color;
    }

    function resetAnimalColor(svgElement) {
        svgElement.querySelector('path:nth-child(3)').style.fill = 'rgb(154, 206, 87)';
    }

    function moveWithArrowKeys(svgElement) {
        // Supprimer la classe 'selectedElement' de tous les éléments
        let selectedElements = document.querySelectorAll('.selectedElement');
        for (let i = 0; i < selectedElements.length; i++) {
            selectedElements[i].classList.remove('selectedElement');
        }

        // Ajouter la classe 'selectedElement' à l'élément cliqué
        svgElement.classList.add('selectedElement');

        let x = 0;
        let y = 0;

        // Supprimer les anciens écouteurs d'événements
        document.removeEventListener('keydown', moveElement);

        function moveElement(event) {
            let selectedElement = document.querySelector('.selectedElement'); // L'élément actuellement sélectionné
            switch (event.key) {
                case 'ArrowUp':
                    y -= 50;
                    break;
                case 'ArrowDown':
                    y += 50;
                    break;
                case 'ArrowLeft':
                    x -= 50;
                    break;
                case 'ArrowRight':
                    x += 50;
                    break;
                default:
                    return; // Quitter la fonction si la touche n'est pas une touche de flèche
            }

            // Appliquer la translation à l'élément SVG
            selectedElement.style.transform =  `translate(${x}px, ${y}px)`;
        }

        // Attacher l'écouteur d'événements au document
        document.addEventListener('keydown', moveElement);
    }

    document.body.addEventListener('click', function (event) {
        toggleDayNight(event);
    });

});
