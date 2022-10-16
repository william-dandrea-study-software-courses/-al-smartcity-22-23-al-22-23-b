# Architecture logicielle: Construction

> Sujet V6: Pay as you pollute: real-time billing of car depending on car categories and dynamic city zones they travel in.
> Equipe b: Guillaume Piccina, Willian d'Andrea, Nicolas Fernandez, Yann Brault

## Status semaine 41, 11/10

- [Architecture](https://github.com/pns-si5-al-course/al-smartcity-22-23-al-22-23-b/blob/Develop/deliverables/Architecture.pdf)

### Flag d'avancement <img src="./flags/orange_flag.png" width="20" height="20" >

- La liste des services a été fixée et ne bougera probablement pas:
  - Services de banques
  - Service de pollution de la ville
  - Service de surveillance vidéos de la ville

### Points non validés cette semaine:

- La liste des technos n'a pas pu être validée cette semaine.
  > Ce que nous savons déjà vis à vis des technos, c'est que nous devons étudier le métier de chaucn de nos services afin d'en tirer les caractéristiques principales qui pourront ainsi nous aider à définir les choix de techno. Nous n'excluons pas d'utiliser différentes technos pour chaque service même si cela impliquerait pas mal de difficultés au niveau du maintient de l'architecture.
- pas de US

### Points de difficultés de cette semaine:

- Cette semaine nous avons eu beaucoup de mal à nous décider sur comment repenser notre architecture. Les points bloquants étaient quelles responsabilités peuvent être déportées sur le terminal de l'utilisateur et lesquelles ne peuvent pas.
  En particulier, la correspondance entre une position gps avec une zone et le calcul du prix estimé de la course. Après réflexions et conseils nous avons décidé d'assigner le calcul de l'estimation à l'utilisateur et la correspondance de la position avec la zone se fait entre les services.
- Détails de l'architecture [ici](https://github.com/pns-si5-al-course/al-smartcity-22-23-al-22-23-b/blob/Develop/deliverables/Architecture.pdf)

### Pour la semaine suivante:

- Définir les services, leur métier et leurs opérations
- Définir les interfaces entre les services
- Définir les techno pour l'architecture
- Mocker les services externes

=============================================================================

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
