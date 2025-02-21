const translations = {
    en: {
        about_us: "About Us",
        about_us_description: "This project has been realised by three students from 42 School.",
        settings: "Settings",
        win_condition: "Win condition",
        win_condition_description: "Number of points required to win the match.",
        opponent: "Opponent",
        opponent_description: "The opponent you want to play against.",
        sign_in: "Sign in",
        sign_in_with: "Sign in with ",
        ai_difficulty: "AI difficulty",
        ai_difficulty_description: "More soon... Stay tuned!",
        launch_game: "Launch game",
        tournament: "Tournament",
        tournament_name: "Tournament name",
        select_game: "Select game",
        number_of_players: "Number of players",
        players: "Players",
        create_tournament: "Create tournament",
        friends: "Friends",
        category: "Category",
        max_consecutive_goals: "Max consecutive goals",
        average_time_to_score: "Average time to score",
        fastest_time_to_score: "Fastest time to score",
        longest_bounce_streak: "Longest bounce streak",
        max_consecutive_wins: "Max consecutive wins",
        wins_as_crosses: "Wins as crosses",
        wins_as_noughts: "Wins as noughts",
        quickest_win_as_moves: "Quickest win as moves",
        player: "Player",
        rank: "Rank",
        welcome_message: "Welcome to our final 42 common core project!",
        waiting_to_start: "Waiting to start...",
        start_the_match: "Start the match",
        games: "Games",
        tournaments: "Tournaments",
        edit_profile_informations: "Edit profile informations",
        dont_have_an_account: "Don't have an account?",
        submit: "Submit",
        sign_up: "Sign up",
        already_have_an_account: "Already have an account ?",
        rankings: "Rankings",
        player_1: "Player 1",
        player_2: "Player 2",
        // placeholders
        username: "Username",
        display_name: "Display name",
        email: "Email",
        password: "Password",
        confirm_password: "Confirm password",
    },
    fr: {
        about_us: "À propos de nous",
        about_us_description: "Ce projet a été réalisé par trois étudiants de l'école 42.",
        settings: "Paramètres",
        win_condition: "Condition de victoire",
        win_condition_description: "Nombre de points requis pour gagner le match.",
        opponent: "Adversaire",
        opponent_description: "L'adversaire contre lequel vous voulez jouer.",
        sign_in: "Se connecter",
        sign_in_with: "Se connecter avec ",
        ai_difficulty: "Difficulté de l'IA",
        ai_difficulty_description: "Bientôt plus à venir... Restez à l'écoute !",
        launch_game: "Lancer le jeu",
        tournament: "Tournoi",
        tournament_name: "Nom du tournoi",
        select_game: "Choisir le jeu",
        number_of_players: "Nombre de joueurs",
        players: "Joueurs",
        create_tournament: "Créer un tournoi",
        friends: "Amis",
        category: "Catégorie",
        max_consecutive_goals: "Nombre maximum de buts consécutifs",
        average_time_to_score: "Temps moyen pour marquer",
        fastest_time_to_score: "Temps le plus rapide pour marquer",
        longest_bounce_streak: "Plus longue série de rebonds",
        max_consecutive_wins: "Nombre maximum de victoires consécutives",
        wins_as_crosses: "Victoires en tant que croix",
        wins_as_noughts: "Victoires en tant que ronds",
        quickest_win_as_moves: "Victoire la plus rapide en nombre de mouvements",
        player: "Joueur",
        rank: "Rang",
        welcome_message: "Bienvenue dans notre projet commun final de l'école 42 !",
        waiting_to_start: "En attente de démarrage...",
        start_the_match: "Démarrer la partie",
        games: "Jeux",
        tournaments: "Tournois",
        edit_profile_informations: "Modifier les informations du profil",
        dont_have_an_account: "Vous n'avez pas de compte ?",
        submit: "Soumettre",
        sign_up: "S'inscrire",
        already_have_an_account: "Vous avez déjà un compte ?",
        rankings: "Classements",
        player_1: "Joueur 1",
        player_2: "Joueur 2",
        // placeholders
        username: "Nom d'utilisateur",
        display_name: "Nom d'affichage",
        email: "Email",
        password: "Mot de passe",
        confirm_password: "Confirmer le mot de passe",
        // games messages
    },
};

function translate_page(language) {
    const elements = document.querySelectorAll('[data-translate]');
    
    elements.forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[language] && translations[language][key]) {
            element.textContent = translations[language][key];
        }
    });

    const placeholderElements = document.querySelectorAll('[data-translate-placeholder]');
    placeholderElements.forEach(element => {
        const key = element.getAttribute('data-translate-placeholder');
        if (translations[language] && translations[language][key]) {
            element.setAttribute('placeholder', translations[language][key]);
        }
    });

    localStorage.setItem('preferred-language', language);
}

function str_player_scores(player)
{
    let language = localStorage.getItem('preferred-language');
    if (language == 'fr')
        return player + " marque un point !";
    else if (language == 'de')
        return player + " erzielt einen Punkt !";
    else
        return player + " scores!";
}

function str_player_wins(winner)
{
    let language = localStorage.getItem('preferred-language');
    if (language == 'fr')
        return winner + " gagne la partie !";
    else if (language == 'de')
        return winner + " gewinnt das Spiel !";
    else
        return winner + " wins the match !";
}

function str_draw()
{
    let language = localStorage.getItem('preferred-language');
    if (language == 'fr')
        return "Égalité !";
    else if (language == 'de')
        return "Unentschieden !";
    else
        return "It's a draw !";
}

function str_button_replay()
{
    let language = localStorage.getItem('preferred-language');
    if (language == 'fr')
        return "Rejouer";
    else if (language == 'de')
        return "Nochmal spielen";
    else
        return "Replay";
}

function str_opponent_required_error()
{
    let language = localStorage.getItem('preferred-language');
    if (language == 'fr')
        return "Un adversaire doit être connecté pour jouer.";
    else if (language == 'de')
        return "Ein Gegner muss eingeloggt sein, um ein Spiel zu spielen.";
    else
        return "An opponent must be logged in to play a game.";
}

function str_match_creation_error()
{
    let language = localStorage.getItem('preferred-language');
    if (language == 'fr')
        return "Une erreur est survenue lors de la création de la partie.";
    else if (language == 'de')
        return "Ein Fehler ist beim Erstellen des Spiels aufgetreten.";
    else
        return "An error occurred while creating the match.";
}

function str_match_creation_success()
{
    let language = localStorage.getItem('preferred-language');
    if (language == 'fr')
        return "La partie a été créée avec succès.";
    else if (language == 'de')
        return "Das Spiel wurde erfolgreich erstellt.";
    else
        return "The match has been successfully created.";
}

function str_tournament_update_error()
{
    let language = localStorage.getItem('preferred-language');
    if (language == 'fr')
        return "Une erreur est survenue lors de la mise à jour du tournoi.";
    else if (language == 'de')
        return "Ein Fehler ist beim Aktualisieren des Turniers aufgetreten.";
    else
        return "An error occurred while updating the tournament.";
}

function str_tournament_update_success()
{
    let language = localStorage.getItem('preferred-language');
    if (language == 'fr')
        return "Le tournoi a été mis à jour avec succès.";
    else if (language == 'de')
        return "Das Turnier wurde erfolgreich aktualisiert.";
    else
        return "The tournament has been successfully updated.";
}

function str_password_mismatch_error()
{
    let language = localStorage.getItem('preferred-language');
    if (language == 'fr')
        return "Les mots de passe ne correspondent pas.";
    else if (language == 'de')
        return "Die Passwörter stimmen nicht überein.";
    else
        return "The passwords do not match.";
}

function str_account_creation_success()
{
    let language = localStorage.getItem('preferred-language');
    if (language == 'fr')
        return "Le compte a été créé avec succès.";
    else if (language == 'de')
        return "Das Konto wurde erfolgreich erstellt.";
    else
        return "The account has been successfully created.";
}

function str_user_logged_in()
{
    let language = localStorage.getItem('preferred-language');
    if (language == 'fr')
        return "Utilisateur connecté.";
    else if (language == 'de')
        return "Benutzer eingeloggt.";
    else
        return "User logged in.";
}

function str_user_logged_out()
{
    let language = localStorage.getItem('preferred-language');
    if (language == 'fr')
        return "Utilisateur déconnecté.";
    else if (language == 'de')
        return "Benutzer ausgeloggt.";
    else
        return "User logged out.";
}

function str_oauth_configuration_missing()
{
    let language = localStorage.getItem('preferred-language');
    if (language == 'fr')
        return "La configuration OAuth est manquante.";
    else if (language == 'de')
        return "Die OAuth-Konfiguration fehlt.";
    else
        return "The OAuth configuration is missing.";
}

function str_login_42_error()
{
    let language = localStorage.getItem('preferred-language');
    if (language == 'fr')
        return "Une erreur est survenue lors de la connexion avec 42.";
    else if (language == 'de')
        return "Ein Fehler ist beim Anmelden mit 42 aufgetreten.";
    else
        return "An error occurred while logging in with 42.";
}

function str_user_logged_in_42()
{
    let language = localStorage.getItem('preferred-language');
    if (language == 'fr')
        return "Utilisateur connecté avec 42.";
    else if (language == 'de')
        return "Benutzer mit 42 eingeloggt.";
    else
        return "User logged in with 42.";
}

function str_opponent_logged_in_42()
{
    let language = localStorage.getItem('preferred-language');
    if (language == 'fr')
        return "Adversaire connecté avec 42.";
    else if (language == 'de')
        return "Gegner mit 42 eingeloggt.";
    else
        return "Opponent logged in with 42.";
}

function str_host_player_must_be_logged_in_to_play_a_game()
{
    let language = localStorage.getItem('preferred-language');
    if (language == 'fr')
        return "Un joueur hôte doit être connecté pour jouer.";
    else if (language == 'de')
        return "Ein Host-Spieler muss eingeloggt sein, um ein Spiel zu spielen.";
    else
        return "A host player must be logged in to play a game.";
}

function str_opponent_must_be_logged_in_to_play_a_game()
{
    let language = localStorage.getItem('preferred-language');
    if (language == 'fr')
        return "Un adversaire doit être connecté pour jouer.";
    else if (language == 'de')
        return "Ein Gegner muss eingeloggt sein, um ein Spiel zu spielen.";
    else
        return "An opponent must be logged in to play a game.";
}

function str_cannot_play_against_yourself()
{
    let language = localStorage.getItem('preferred-language');
    if (language == 'fr')
        return "Vous ne pouvez pas jouer contre vous-même !";
    else if (language == 'de')
        return "Sie können sich nicht selbst spielen!";
    else
        return "You cannot play against yourself!";
}

function str_win_condition_must_be_at_least_3()
{
    let language = localStorage.getItem('preferred-language');
    if (language == 'fr')
        return "La condition de victoire doit être au moins 3.";
    else if (language == 'de')
        return "Die Gewinnbedingung muss mindestens 3 betragen.";
    else
        return "The win condition must be at least 3.";
}

function str_win_condition_must_be_at_most_10()
{
    let language = localStorage.getItem('preferred-language');
    if (language == 'fr')
        return "La condition de victoire doit être au plus 10.";
    else if (language == 'de')
        return "Die Gewinnbedingung muss höchstens 10 betragen.";
    else
        return "The win condition must be at most 10.";
}

function str_failed_to_fetch_opponent_data()
{
    let language = localStorage.getItem('preferred-language');
    if (language == 'fr')
        return "Une erreur est survenue lors de la récupération des données de l'adversaire.";
    else if (language == 'de')
        return "Ein Fehler ist beim Abrufen der Gegnerdaten aufgetreten.";
    else
        return "An error occurred while fetching the opponent's data.";
}

function str_opponent_logged_in()
{
    let language = localStorage.getItem('preferred-language');
    if (language == 'fr')
        return "Adversaire connecté !";
    else if (language == 'de')
        return "Gegner eingeloggt!";
    else
        return "Opponent logged in!";
}

function str_opponent_signed_out()
{
    let language = localStorage.getItem('preferred-language');
    if (language == 'fr')
        return "Adversaire déconnecté !";
    else if (language == 'de')
        return "Gegner ausgeloggt!";
    else
        return "Opponent signed out!";
}

function str_failed_to_fetch_user_data()
{
    let language = localStorage.getItem('preferred-language');
    if (language == 'fr')
        return "Une erreur est survenue lors de la récupération des données de l'utilisateur.";
    else if (language == 'de')
        return "Ein Fehler ist beim Abrufen der Benutzerdaten aufgetreten.";
    else
        return "An error occurred while fetching the user's data.";
}

function str_already_logged_in()
{
    let language = localStorage.getItem('preferred-language');
    if (language == 'fr')
        return "Vous êtes déjà connecté !";
    else if (language == 'de')
        return "Sie sind bereits eingeloggt!";
    else
        return "You are already logged in!";
}

function str_failed_to_load_tournament()
{
    let language = localStorage.getItem('preferred-language');
    if (language == 'fr')
        return "Une erreur est survenue lors du chargement du tournoi.";
    else if (language == 'de')
        return "Ein Fehler ist beim Laden des Turniers aufgetreten.";
    else
        return "An error occurred while loading the tournament.";
}

function str_failed_to_load_next_match_of_this_tournament()
{
    let language = localStorage.getItem('preferred-language');
    if (language == 'fr')
        return "Une erreur est survenue lors du chargement du prochain match de ce tournoi.";
    else if (language == 'de')
        return "Ein Fehler ist beim Laden des nächsten Spiels dieses Turniers aufgetreten.";
    else
        return "An error occurred while loading the next match of this tournament.";
}

function str_no_more_matches_in_this_tournament()
{
    let language = localStorage.getItem('preferred-language');
    if (language == 'fr')
        return "Il n'y a plus de matchs dans ce tournoi.";
    else if (language == 'de')
        return "Es gibt keine weiteren Spiele in diesem Turnier.";
    else
        return "There are no more matches in this tournament.";
}

function str_tournament_name_title(tournament)
{
    let language = localStorage.getItem('preferred-language');
    if (language == 'fr' && tournament.is_pong)
        return "Tournoi de Pong : " + tournament.name;
    else if (language == 'fr' && !tournament.is_pong)
        return "Tournoi de TicTacToe : " + tournament.name;
    else if (language == 'de' && tournament.is_pong)
        return "Pong-Turnier : " + tournament.name;
    else if (language == 'de' && !tournament.is_pong)
        return "TicTacToe-Turnier : " + tournament.name;
    else if (language == 'en' && tournament.is_pong)
        return "Pong Tournament : " + tournament.name;
    else if (language == 'en' && !tournament.is_pong)
        return "TicTacToe Tournament : " + tournament.name;
    else
        return tournament.name;
}

function str_failed_to_load_tournament_details_from_server()
{
    let language = localStorage.getItem('preferred-language');
    if (language == 'fr')
        return "Une erreur est survenue lors du chargement des détails du tournoi.";
    else if (language == 'de')
        return "Ein Fehler ist beim Laden der Turnierdetails aufgetreten.";
    else
        return "An error occurred while loading the tournament details.";
}

function str_invalid_number_of_players()
{
    let language = localStorage.getItem('preferred-language');
    if (language == 'fr')
        return "Le nombre de joueurs est invalide.";
    else if (language == 'de')
        return "Die Anzahl der Spieler ist ungültig.";
    else
        return "The number of players is invalid.";
}

function str_please_enter_a_tournament_name()
{
    let language = localStorage.getItem('preferred-language');
    if (language == 'fr')
        return "Veuillez entrer un nom de tournoi.";
    else if (language == 'de')
        return "Bitte geben Sie einen Turniernamen ein.";
    else
        return "Please enter a tournament name.";
}

function str_please_select_a_valid_game()
{
    let language = localStorage.getItem('preferred-language');
    if (language == 'fr')
        return "Veuillez sélectionner un jeu valide.";
    else if (language == 'de')
        return "Bitte wählen Sie ein gültiges Spiel.";
    else
        return "Please select a valid game.";
}

function str_please_enter_all_usernames()
{
    let language = localStorage.getItem('preferred-language');
    if (language == 'fr')
        return "Veuillez entrer tous les noms d'utilisateur.";
    else if (language == 'de')
        return "Bitte geben Sie alle Benutzernamen ein.";
    else
        return "Please enter all usernames.";
}

function str_please_enter_unique_usernames()
{
    let language = localStorage.getItem('preferred-language');
    if (language == 'fr')
        return "Veuillez entrer des noms d'utilisateur uniques.";
    else if (language == 'de')
        return "Bitte geben Sie eindeutige Benutzernamen ein.";
    else
        return "Please enter unique usernames.";
}

function str_tournament_created_successfully()
{
    let language = localStorage.getItem('preferred-language');
    if (language == 'fr')
        return "Le tournoi a été créé avec succès.";
    else if (language == 'de')
        return "Das Turnier wurde erfolgreich erstellt.";
    else
        return "The tournament has been successfully created.";
}

function str_tournament_id_is_missing()
{
    let language = localStorage.getItem('preferred-language');
    if (language == 'fr')
        return "L'identifiant du tournoi est manquant.";
    else if (language == 'de')
        return "Der Turnier-ID fehlt.";
    else
        return "The tournament ID is missing.";
}

function str_is_not_the_first_player_of_this_tournament_match_please_check_your_credentials()
{
    let language = localStorage.getItem('preferred-language');
    if (language == 'fr')
        return "n'est pas le premier joueur de ce match de tournoi, veuillez vérifier vos identifiants";
    else if (language == 'de')
        return "ist nicht der erste Spieler dieses Turnier-Spiels, bitte überprüfen Sie Ihre Anmeldeinformationen";
    else
        return "is not the first player of this tournament match, please check your credentials";
}

function str_is_not_the_second_player_of_this_tournament_match_please_check_your_credentials()
{
    let language = localStorage.getItem('preferred-language');
    if (language == 'fr')
        return "n'est pas le second joueur de ce match de tournoi, veuillez vérifier vos identifiants";
    else if (language == 'de')
        return "ist nicht der zweite Spieler dieses Turnier-Spiels, bitte überprüfen Sie Ihre Anmeldeinformationen";
    else
        return "is not the second player of this tournament match, please check your credentials";
}

function str_failed_to_fetch_player_1_data()
{
    let language = localStorage.getItem('preferred-language');
    if (language == 'fr')
        return "Une erreur est survenue lors du chargement des données du joueur 1.";
    else if (language == 'de')
        return "Ein Fehler ist beim Abrufen der Daten des ersten Spielers aufgetreten.";
    else
        return "An error occurred while fetching the data of the first player.";
}

function str_player_1_logged_in()
{
    let language = localStorage.getItem('preferred-language');
    if (language == 'fr')
        return "Joueur 1 connecté !";
    else if (language == 'de')
        return "Spieler 1 eingeloggt!";
    else
        return "Player 1 logged in!";
}

function str_player_1_signed_out()
{
    let language = localStorage.getItem('preferred-language');
    if (language == 'fr')
        return "Joueur 1 déconnecté !";
    else if (language == 'de')
        return "Spieler 1 ausgeloggt!";
    else
        return "Player 1 signed out!";
}

function str_failed_to_fetch_player_2_data()
{
    let language = localStorage.getItem('preferred-language');
    if (language == 'fr')
        return "Une erreur est survenue lors du chargement des données du joueur 2.";
    else if (language == 'de')
        return "Ein Fehler ist beim Abrufen der Daten des zweiten Spielers aufgetreten.";
    else
        return "An error occurred while fetching the data of the second player.";
}

function str_player_2_logged_in()
{
    let language = localStorage.getItem('preferred-language');
    if (language == 'fr')
        return "Joueur 2 connecté !";
    else if (language == 'de')
        return "Spieler 2 eingeloggt!";
    else
        return "Player 2 logged in!";
}

function str_player_2_signed_out()
{
    let language = localStorage.getItem('preferred-language');
    if (language == 'fr')
        return "Joueur 2 déconnecté !";
    else if (language == 'de')
        return "Spieler 2 ausgeloggt!";
    else
        return "Player 2 signed out!";
}

function str_tournament_is_still_in_progress()
{
    let language = localStorage.getItem('preferred-language');
    if (language == 'fr')
        return "Ce tournoi est toujours en cours.";
    else if (language == 'de')
        return "Dieses Turnier ist noch im Gange.";
    else
        return "This tournament is still in progress.";
}

function str_friend_request_sent()
{
    let language = localStorage.getItem('preferred-language');
    if (language == 'fr')
        return "La demande d'amitié a été envoyée.";
    else if (language == 'de')
        return "Die Freundschaftsanfrage wurde gesendet.";
    else
        return "Friend request sent.";
}

function str_friend_request_accepted()
{
    let language = localStorage.getItem('preferred-language');
    if (language == 'fr')
        return "La demande d'amitié a été acceptée.";
    else if (language == 'de')
        return "Die Freundschaftsanfrage wurde akzeptiert.";
    else
        return "Friend request accepted.";
}

function str_friend_request_refused()
{
    let language = localStorage.getItem('preferred-language');
    if (language == 'fr')
        return "La demande d'amitié a été refusée.";
    else if (language == 'de')
        return "Die Freundschaftsanfrage wurde abgelehnt.";
    else
        return "Friend request refused.";
}

function str_personal_info_updated()
{
    let language = localStorage.getItem('preferred-language');
    if (language == 'fr')
        return "Les informations personnelles ont été mises à jour avec succès.";
    else if (language == 'de')
        return "Die persönlichen Informationen wurden erfolgreich aktualisiert.";
    else
        return "Personal information updated successfully.";
}

function str_no_file_selected()
{
    let language = localStorage.getItem('preferred-language');
    if (language == 'fr')
        return "Aucun fichier sélectionné.";
    else if (language == 'de')
        return "Es wurde keine Datei ausgewählt.";
    else
        return "No file selected.";
}

function str_profile_picture_updated()
{
    let language = localStorage.getItem('preferred-language');
    if (language == 'fr')
        return "La photo de profil a été mise à jour avec succès.";
    else if (language == 'de')
        return "Das Profilbild wurde erfolgreich aktualisiert.";
    else
        return "Profile picture updated successfully.";
}