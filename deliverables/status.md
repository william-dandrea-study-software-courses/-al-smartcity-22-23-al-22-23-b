# Architecture logicielle: Evolution

> Sujet V6: Pay as you pollute: real-time billing of car depending on car categories and dynamic city zones they travel in.
> Equipe b: Guillaume Piccina, Willian d'Andrea, Nicolas Fernandez, Yann Brault


## Status semaine 1,08/01
- [Architecture](https://github.com/pns-si5-al-course/al-smartcity-22-23-al-22-23-b/blob/Develop/deliverables/Architecture.pdf)

### Flag d'avancement <img src="./flags/red_flag.png" width="20" height="20" >

### Points validés cette semaine:

* Fin du système d'anti-fraude
* Implémentation de la communication via Socket entre le ClientCommunicationService (NestJS) et le UserClient (React)
* Prometheus : implémentation (difficile) des exporters MongoDB ainsi que Kafka. 
** Pour MongoDB, tout est fait automatiquement, nous n'avons plus besoin de créer un user à la main comme auparavant

### Points non validés cette semaine :

* Toujours pas de fonctionnement du domaine métier entier alors que c'était prévu d'être fait pour il y a bien longtemps (frontend react, route advisor, open route service)
* Pas de tests de charge

### Pour la semaine suivante:
* Finir le domaine métier (OpenRouteService, ClientCommunicationService, UserClient)
* Tests de charge et implémentation de load balancer
* Préparer la présentation finale


## Status semaine 50,13/12

- [Architecture](https://github.com/pns-si5-al-course/al-smartcity-22-23-al-22-23-b/blob/Develop/deliverables/Architecture.pdf)

### Flag d'avancement <img src="./flags/green_flag.png" width="20" height="20" >

### Points validés cette semaine:

- Mise à disposition des données pour faire des analyses statistiques
- Scénario équivalent à la précédente partie mais incluant les nouveaux composants et kafka
- Service anti fraude

### Points non validés cette semaine :

- Faire d'autres ADR

### Pour la semaine suivante:

- Continuer à rédiger des ADR par rapport aux choix d'architecture qui ont été fait
- Implémenter les composants annexes pour répondre à tous les besoins

=============================================================================

## Status semaine 49, 06/12

- [Architecture](https://github.com/pns-si5-al-course/al-smartcity-22-23-al-22-23-b/blob/Develop/deliverables/Architecture.pdf)

### Flag d'avancement <img src="./flags/yellow_flag.png" width="20" height="20" >

### Points validés cette semaine:

- Implémentation de Kafka dans l'architecture
- Implémentation d'un cache dans le service car-tracker
- Rédaction d'ADR

### Points non validés cette semaine:

- Avoir un scénario totalement traversant

### Points de difficultés cette semaine:

- On commence à se retrouver avec beaucoup de microservice, peut-être trop (ou pas) ?

### Pour la semaine suivante:

- Continuer à rédiger des ADR par rapport aux choix d'architecture qui ont été fait
- Avoir un scénario totalement traversant

=============================================================================

## Status semaine 48, 29/11

- [Architecture](https://github.com/pns-si5-al-course/al-smartcity-22-23-al-22-23-b/blob/Develop/deliverables/Architecture.pdf)

### Flag d'avancement <img src="./flags/yellow_flag.png" width="20" height="20" >

### Points validés cette semaine:

- Solution viable pour faire de la remontée d'informations dans les deux sens
- Premier découpage fait
- Transition vers Kafka décidée

### Points non validés cette semaine:

- Faire des ADR

### Points de difficultés cette semaine:

- Concevoir une solution viable pour faire de la remontée d'informations dans les deux sens
- Solution n'impliquant pas les adresses IP

### Pour la semaine suivante:

- Faire des ADR
- Commencer l'implémentation des nouveaux composants
- Transition vers Kafka (faire dans quel sens ?)

=============================================================================

## Status semaine 47, 22/11

- [Architecture](https://github.com/pns-si5-al-course/al-smartcity-22-23-al-22-23-b/blob/Develop/deliverables/Architecture.pdf)

### Flag d'avancement <img src="./flags/green_flag.png" width="20" height="20" >

### Points validés cette semaine:

- Première phase de discussion sur l'intégration des composants permettant de répondre aux nouveaux besoins
- Suppression du service Zone pollution faisant le relais entre car tracker et le service externe comme vu en soutenance

### Points de difficultés cette semaine:

- Comment faire remonter de l'info du système vers l'utilisateur, par exemple comment envoyer un trajet à un utilisateur, ou des infos concernant son trajet
- Comment garder l'adresse IP d'un utilisateur

### Pour la semaine suivante:

- Finir un premier découpage
- Etudier différences Kafka / Rabbit et voir lequel convient le mieux aux nouveaux besoins

=============================================================================

## Status semaine 44, semaine de pause pédagogique

- [Architecture](https://github.com/pns-si5-al-course/al-smartcity-22-23-al-22-23-b/blob/Develop/deliverables/Architecture.pdf)

### Flag d'avancement <img src="./flags/green_flag.png" width="20" height="20" >

### Points validés cette semaine:

- Fin d'implémentation des composants prévus pour la semaine 43 -> Mock utilisateur, bus Rabbit, service car tracker et Mock service pollution
- Implémentation des composants prévus pour la semaine 44 -> Complétion de la boucle primaire du scénario MVP par l'ajout du tracking shutdown, de la BD principale et du service de billing

### Points non validés cette semaine:

- Test
- Eventuel démarrage de l'implémentation des composants prévus pour la semaine 45

### Points de difficultés cette semaine:

- RabbitMQ est plus simialaire à une message queue qu'à un bus évènementiel qui fait du pub/sub.
- C'est à travers un problème de transmissions de messages avec Rabbit que nous avons trouvé le problème.
- Pour pallier à ce problème nous avons du créer plusieurs queues quand il fallait brancher plusieurs service sur le bus Rabbit

### Pour la semaine suivante:

- Implémenter les composants prévus pour la semaine 45 -> service de tracking caméra + mock caméra, service de configuration de fréquence d'envoie
- Vraiment faire des test
- Attaquer le rapport et le support de la soutenance

=============================================================================

## Status semaine 43, 25/10

- [Architecture](https://github.com/pns-si5-al-course/al-smartcity-22-23-al-22-23-b/blob/Develop/deliverables/Architecture.pdf)

### Flag d'avancement <img src="./flags/orange_flag.png" width="20" height="20" >

### Points validés cette semaine:

- Solution viable pour communiquer à un utilisateur sa fréquence d'envoie de position ainsi que la mise à disposition des prix pour le calcul estimé.

### Points non validés cette semaine:

- Coder les services pour compléter le scénario MVP.

### Points de difficultés cette semaine:

- Utilisation de RabbitMQ
- Mise à disposition des utilisateurs d'une politique de tracking (problème résolu pendant le point hebdomadaire)

### Pour la semaine suivante:

- Faire les tâches prévues pour la [semaine 43](https://github.com/pns-si5-al-course/al-smartcity-22-23-al-22-23-b/blob/develop/deliverables/Roadmap.md#objectif-pour-le-25-octore---semaine-43)
- Commencer/Faire les tâches prévues pour la [semaina 44](https://github.com/pns-si5-al-course/al-smartcity-22-23-al-22-23-b/blob/develop/deliverables/Roadmap.md#objectif-pour-les-vacances---semaine-44)

=============================================================================

## Status semaine 42, 18/10

- [Architecture](https://github.com/pns-si5-al-course/al-smartcity-22-23-al-22-23-b/blob/Develop/deliverables/Architecture.pdf)

### Flag d'avancement <img src="./flags/green_flag.png" width="20" height="20" >

### Points validés cette semaine:

- Définir les services en détail
- Définir la stack techno
- Définir les interfaces -> Fait de manière implicite dans les descriptions, pas de documents faisant une liste exhaustive
- Mocker les services externes -> Zone pollution seulement pour ce rendu (dev en cours au moment du rendu)
- Révision de l'archi -> Transformation vers de l'évènementiel, ajout d'un bus
- code MVP -> user, bus et car tracker

### Points non validés cette semaine:

- Liste exhaustive des interfaces

### Points de difficultés de cette semaine:

- Développement (lié à la découverte de RabbitMQ)
- Comment faire passer le message de configuration vers les users pour prévenir d'envoyer les positions plus régulièrement

### Pour la semaine suivante:

- Intégration + tests
- Ajout BD + services pour finir la boucle principale du MVP (walking skeleton)

=============================================================================

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
