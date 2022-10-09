# Architecture logicielle: Construction

> Sujet V6: Pay as you pollute: real-time billing of car depending on car categories and dynamic city zones they travel in.
> Equipe b: Guillaume Piccina, Willian d'Andrea, Nicolas Fernandez, Yann Brault

## Status semaine 40, 04/10

### Flag d'avancement: <img src="./flags/green_flag.png" width="20" height="20" >

- Les utilisateurs sont les conducteurs au travers de leur smartphone.
- **Nous allons réaliser une archicture en micro services**

- **Scénario MVP**: Bob monte dans sa voiture pour aller au travail. Il sort son téléphone pour lancer son application pay as you pollute, afin de démarrer son trajet. Tout au long de son trajet s'affiche en temps réel la catégorie de la zone qu'il traverse et le total qui lui sera facturé. Une fois arrivé, bob indique qu'il a fini son trajet et le système de facturation se charge de contacter la banque.

- Liste de services externes:
  - Banque pour les débits
  - Service de météo / météo marine / pollution pour connaître la pollution de l'air en temps réel
  - Système de surveillance vidéo de la ville pour une possible feature de tracking vidéo
  - Service des immatriculations

### Points de difficultés:

- Un point très important sur lequel nous avons eu du mal a trouvé une solution est la fréquence d'envoie de la position par l'utilisateur. A la fois envoyer trop d'informations engendrerait une surcharge du réseau et ne pas en envoyer assez pourrait engendrait des erreurs de tarifications d'un trajet surtout si l'utilisateur passe fréquement d'une zone à une autre.
  La solution qui a été trouvée est la suivante: l'utilisateur fait lui même la requête pour obtenir les infos de pollution sur un service dédié à ça et le match entre sa position et les zones se fait de son côté. Ainsi au lieu d'envoyer des positions gps il envoie simplement sa zone, et donc cela permet d'envoyer une payload uniquement à chauqe entrée et sortie de zone peu importe l'intervalle entre.
- Ainsi un second problème était de mettre à disposition les infos de pollutions pour les utilisateurs. Nous avons d'abord pensé au service de billing mais vu la charge qu'entrainerait une telle idée, ce serait trop risqué étant donné que billing contient beaucoup de logique métier.
  Nous avons ensuite imaginé envoyer les utilisateurs directment vers le service externe de pollution, mais si ce service n'est pas assez robuste cela met en péril le fonctionnement de toute l'application.
  Finalement la troisième idée nous a être la bonne. Elle consiste à pull à intervalle régulier les infos de pollution d'un service externe et de les stocker dans une db dédier à ça et qui sera scale pour assumer la charge.

  ### Pour la semaine suivante:

  - améliorer l'architecture (ajouter bd temporaire clé valeur dans billing pour associer zone et prix)
  - Trouver les technos adaptées
  - Définir des US
