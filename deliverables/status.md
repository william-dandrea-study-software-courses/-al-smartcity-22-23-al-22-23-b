# Architecture logicielle: Construction

> Sujet V6: Pay as you pollute: real-time billing of car depending on car categories and dynamic city zones they travel in.
> Equipe b: Guillaume Piccina, Willian d'Andrea, Nicolas Fernandez, Yann Brault

## Status semaine 40, 04/10

- Les utilisateurs sont les conducteurs au travers de leur smartphone.
- **Nous allons réaliser une archicture en micro services**

- **Scénario MVP**: Bob monte dans sa voiture pour aller au travail. Il sort son téléphone pour lancer son application pay as you pollute, afin de démarrer son trajet. Tout au long de son trajet s'affiche en temps réel la catégorie de la zone qu'il traverse et le total qui lui sera facturé. Une fois arrivé, bob indique qu'il a fini son trajet et le système de facturation se charge de contacter la banque.

- Liste de services externes:
  - Banque pour les débits
  - Service de météo / météo marine / pollution pour connaître la pollution de l'air en temps réel
  - Système de surveillance vidéo de la ville pour une possible feature de tracking vidéo
  - Service des immatriculations
